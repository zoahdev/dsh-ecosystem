# dsh 已知问题家族图谱（Bug Family Map）

> 持续维护：同一根因在讨论区多帖的投影，按家族归类。每条根因都对照官方源码核验过；核验基线：main HEAD `99f6f02`（0.1.0-rc.7，2026-08-17）。遇到新帖先查本图谱：命中家族 = 直接引用根因帖 + 补增量证据，不重复开题。

## 家族 1：npm dist-tag 发布族（latest 卡旧版）

- 代表帖：[#2763](https://github.com/deepseek-ai/deepseek-harness/discussions/2763)（全族 14/14 子包 latest=0.0.1-rc.1，主包 dsh 正确）；[#3098](https://github.com/deepseek-ai/deepseek-harness/discussions/3098)（Mide69 独立观察到 dsh-base 同病）
- 影响面：注册表 160/325 插件被任一官方范围命中（dsh-tools 单项 78）；what-if latest→next 后 100 恢复、剩 60（精确 pin rc.6 系列 / rc.3-rc.5 中段 / dsh-agent rc.6）
- 状态：官方未修（08-19 复查）；修复日验证器 `scripts/verify-2763-fix.mjs`（14 包 latest==next）+ 评论模板就绪
- 使用建议：今天安装一律显式 pin（`dsh plugin add <pkg>@0.1.0-rc.7`），别信 latest

## 家族 2：运行期私有目录对外部清理无防护（%TEMP% 族）

- 代表帖：[#1961](https://github.com/deepseek-ai/deepseek-harness/discussions/1961)（spill 目录被清理 → ENOENT 崩溃整个服务）→ [#3190](https://github.com/deepseek-ai/deepseek-harness/discussions/3190)（spillAll 写 stdout.log 时 ENOENT 未捕获）→ [#3203](https://github.com/deepseek-ai/deepseek-harness/discussions/3203)（windows-acl 沙箱 temp 缓存命中不存在的目录 → fail-closed 到重启）
- 触发模型：Windows 磁盘清理 / 第三方清理工具删掉运行期持有的 `dsh-*` 私有目录
- 已验证：`subprocess-local/src/spawn.ts` spillAll；`sandbox-local/src/index.ts` materializeAclGrant 缓存复用（:413 命中直接返回、:415 只建一次）+ `sandbox-windows-acl/src/runner.ts:109-113` requireDirectory fail-loud
- 修复原则：在目录被消费的边界"遇缺失即重建"（provider 侧补 existsSync+mkdirSync，保留 runner 的 fail-loud 边界）；spillAll 侧 ENOENT 捕获降级而不是让未捕获异常炸进程
- 家族级加固：dsh-doctor 加 Windows 运行时检查（列出 `%TEMP%\dsh-*` 持有者与缺失状态）

## 家族 3：坏工件隔离族（一个坏文件拖垮全局）

- 代表帖：[#675](https://github.com/deepseek-ai/deepseek-harness/discussions/675)（SQLite torn tail 吞掉合法事件）→ [#1047](https://github.com/deepseek-ai/deepseek-harness/discussions/1047)（单坏 session 日志让 session.list 整体 500）→ [#3173](https://github.com/deepseek-ai/deepseek-harness/discussions/3173)（坏插件崩溃启动，installFailLoud）
- 原则：隔离 + 可见（warn + skip，load 仍拒绝；启动跳过安全条目必须 boot banner + doctor 可查）
- 已验证：#675 tornFrom 唯一消费方=load→commitRepair；#1047 `readFirstZstdLine@492` 无保护 + `assertStoredIdentity@498` + duplicate-id `@500-502` 同循环抛错点
- 测试建议：`[valid,bad,valid]` 回归；持久化层断言"坏记录不被当作最新覆盖"

## 家族 4：模块双实例符号分裂族（undefined.prepare）

- 代表帖：[#1697](https://github.com/deepseek-ai/deepseek-harness/discussions/1697) → [#2660](https://github.com/deepseek-ai/deepseek-harness/discussions/2660)（canonical root cause + 探针证据）→ [#3033](https://github.com/deepseek-ai/deepseek-harness/discussions/3033)（插件 bundle 第二物理副本确认）→ [#1993](https://github.com/deepseek-ai/deepseek-harness/discussions/1993)（typert-remote WeakMap 双副本）
- 机制：同一进程两份 dsh-tools → TOOL_RUNTIME_SCHEDULER 唯一 symbol 分裂 → `undefined.prepare` → 孤儿 tool_calls 被回放 → 永久 400
- 修复蓝图三臂：Symbol.for（声明侧窄修）/ peerDependency 统一（包装侧）/ loader 按安装锚点解析 `@deepseek-ai/dsh-*`（解析侧）
- 状态：rc.7 均未实现；argszero 在 #2660 给出了完整 PR 描述素材（四帖合链）

## 家族 5：推理字段别名族（网关兼容）

- 代表帖：[#199](https://github.com/deepseek-ai/deepseek-harness/discussions/199)（vLLM `delta.reasoning` 被丢 → 推理不可见 + EMPTY_RESPONSE → 重试风暴）
- 根因：`llm-deepseek/src/translate.ts:132` 只读 `delta?.reasoning_content`，WireDelta（types.ts:71/114）无别名；pi-ai 路径对 wire 字段名无感（别名容忍在 pi-ai SDK 依赖内）
- 重试风暴机械链：推理被丢 → order 空 → stop 映射 EMPTY_RESPONSE（translate.ts:107-114）→ `retry-policy.ts:19` 默认重试码含 EMPTY_RESPONSE（retry.spec.ts:226 钉住）
- 修复建议：`reasoning_content ?? reasoning ?? reasoning_text` 回退链 + WireDelta 扩字段 + 三回归测试（别名接收 / 官方字段优先 / reasoning-only 不再 EMPTY_RESPONSE）；两个既有分支（DiGuStudent / dietmarscharf）可合并成一个 PR

## 家族 6：Windows 令牌 / ACL 沙箱族

- 代表帖：[#3207](https://github.com/deepseek-ai/deepseek-harness/discussions/3207)（schannel TLS SEC_E_NO_CREDENTIALS：受限令牌 DISABLE_MAX_PRIVILEGE|LUA_TOKEN|WRITE_RESTRICTED，read-only 同受影响）→ [#3216](https://github.com/deepseek-ai/deepseek-harness/discussions/3216)（隐藏 .dsh EPERM：UAC 分裂令牌 ACL）→ [#3195](https://github.com/deepseek-ai/deepseek-harness/discussions/3195)（CTRL_C_EVENT 误杀：SIGINT handler 无条件注册）→ [#3193](https://github.com/deepseek-ai/deepseek-harness/discussions/3193)（dsh-failure-lens 四标记=文档化沙箱边界，argszero 核验）
- 原则：受限令牌是安全边界，README"网络不受限"的表述是矛盾（已确认）；诊断顺序：事件日志/审计定位被拒对象 → 窄修读权限 → 文档化
- 测试建议：windows-acl 套件补 curl.exe 回归；isTTY 判别抽纯函数做单测

## 家族 7：远程部署信任边界族

- 代表帖：[#3209](https://github.com/deepseek-ai/deepseek-harness/discussions/3209)（externalUrl 仅叙事）→ [#3210](https://github.com/deepseek-ai/deepseek-harness/discussions/3210)（Host 可伪造，argszero 深度覆盖）→ [#3211](https://github.com/deepseek-ai/deepseek-harness/discussions/3211)（Tailscale-User-Login）
- 一句话：externalUrl=说对地址、Tailscale-User-Login=说对身份、surface=装到一起；三个都不改 trust fence
- 已验证：#3209 `localWebUrl` 硬编码 loopback 成立；建议"narration-only"做成测试不变量（防未来把 externalUrl 拉进信任判定）

## 家族 8：插件加载 / 回滚族（失败不破坏运行组合）

- 代表帖：[#3173](https://github.com/deepseek-ai/deepseek-harness/discussions/3173)（启动 degrade）→ [#3213](https://github.com/deepseek-ai/deepseek-harness/discussions/3213)（运行期热重载失败自动回滚）
- 契约建议：revertible-effects（只有经 ctx.effect 的副作用可回滚，插件作者契约）；环境变量应急 + config 常态双形态
- 相关：out-of-tree 接缝缺口（[#3186](https://github.com/deepseek-ai/deepseek-harness/discussions/3186)/[#3191](https://github.com/deepseek-ai/deepseek-harness/discussions/3191)/[#3167](https://github.com/deepseek-ai/deepseek-harness/discussions/3167)）——统一 capability registry 的长期建议

## 家族 9：检索 / 渲染 / 元数据族

- CJK 检索：[#3202](https://github.com/deepseek-ai/deepseek-harness/discussions/3202)/[#3206](https://github.com/deepseek-ai/deepseek-harness/discussions/3206)——unicode61 对 2 字 CJK 双词法臂全灭，trigram ≥3 字命中（node:sqlite 实测）；README 已知限制
- Markdown 渲染：[#3177](https://github.com/deepseek-ai/deepseek-harness/discussions/3177)——gfm() 默认 singleTilde:true，单波浪线被当删除线（micromark-extension-gfm@3.0.0 实测）
- 文件元数据：[#3111](https://github.com/deepseek-ai/deepseek-harness/discussions/3111)——FS_STALE_VERSION 因 ctime 误报（fsio.ts:74-75）；2×2 取舍框架已给出
- 搜索语义不一致：[#3182](https://github.com/deepseek-ai/deepseek-harness/discussions/3182) 发现 5——glob 固定 `--no-ignore --hidden`（只排 VCS 目录，glob.ts:83-112）而 grep 尊重 .gitignore（grep.ts:112-120），node_modules 在 glob 路径下必被扫

## 家族 10：工具结果可信度族（观测盲区）

- 代表帖：[#3182](https://github.com/deepseek-ai/deepseek-harness/discussions/3182) 发现 3——`tool/result` 无强制结构化失败字段（core/session/src/types.ts:291-300 仅可选 error/isError；llm/src/types.ts:88-94 ToolResultBlock 可选 isError）；日志里的 ok 是工具私有 payload，不是 schema 字段
- 建议：shell 类工具 exit≠0 → isError:true 归一；健康监控按 isError/error 统计而非解析 stderr
- 同帖发现 2（归档≠删除）：`workspace/src/index.ts:244-256` archiveSession 只写 archivedSessionIds 标记，数据 100% 保留——"信任基础设施"缺口，建议 UI 明示归档与删除的区别


## 家族 11：out-of-tree 会话事件信封族（ignorable-envelope 缺口）

- 代表帖：[#3191](https://github.com/deepseek-ai/deepseek-harness/discussions/3191)（dsh-click/observed|action 崩溃 rc.6/rc.7）+ 同族 4 位插件作者（#1538/#1584/#1619/#2778）
- 根因：读侧已支持 `ignorable: true`（coordinator.ts:1063 + types.ts:412-422 契约），但 `Session.append` 对非 surface 类型不暴露 opts（index.ts:604-608）——插件事件写不进标记，冷加载时未知类型拒绝 resume
- 已验证修复：Mchsd 分支 `feat/session-append-ignorable-envelope`（6430083a，基于 master 47f9438；三文件与 main 99f6f02 逐字节一致，可干净 apply）+ zoahdev 独立核验（main+补丁 761/762 通过，唯一失败为 Windows symlink EPERM 预存环境问题）
- 原则：silent-write / loud-read 不对称 → warn-at-append 把失败点前移；读侧严格是坏工件隔离族的完整性背水，不能放宽

## 家族 12：sandbox 同模式升级误报族

- 代表帖：[#3219](https://github.com/deepseek-ai/deepseek-harness/discussions/3219)
- 根因：`WIDER_MODES` 无 self 条目（escalation.ts:22-28），`approveEscalation` 严格更宽检查先于审批（escalation.ts:150-157）——full-access 会话请求 full-access 报 "not strictly wider"
- 已验证修复：zoahdev 分支 `fix/escalation-same-mode-pass-through`（8d83d01，基于 main 99f6f02）：同模式短路 + 测试更新；sandbox 包 19/19 + 全量 typecheck 过
- 注意：工具层 `validateEscalationArgs` 在 approveEscalation 之前（tool-bash:67/tool-pwsh:99/tool-fs sandbox.ts:88），不带 justification 的模型在更早处报错——完整修复需工具层同模式跳过（留作独立补丁）
## 如何用这张图

1. 新 bug 帖：先对照家族表 → 命中即在回复里引用根因帖编号 + 补该帖的增量证据（环境/复现/新字段）。
2. 修一个家族：按"已验证根因"列出的 file:line 直接落地，回归测试按家族惯例补（隔离族 `[valid,bad,valid]`、令牌族 curl 回归、别名族三测试）。
3. 给维护者：每一族的"代表帖"链起来就是一份完整 PR 描述；#2660 已经做到了。

> 维护人：zoahdev · 更新：2026-08-19 · 核验基线：99f6f02（rc.7）
