# zoahdev × DeepSeek Harness — official engagement dossier

> 一页纸记录 zoahdev 在官方讨论区/上游仓库的全部实质贡献。每条都有可点击链接与真实验证；更新于 2026-08-20。

## Bug 根因 + 修复（cherry-pick 就绪）

| # | 问题 | 交付 | 状态 |
|---|---|---|---|
| 2060 | session.prompt 被固定 30s unary 超时中止（host 负载下偶发 signal timed out） | 根因定位 prompt 误用有界超时；补丁改为 caller-signal-only（与 pickDirectory 同策略），分支 `fix/prompt-user-paced-no-deadline`；fetch-carrier 36/36 + tsc 全绿 | 已回复（#discussioncomment-18032208），补丁待 PR 通道 |
| 2023 | pi-ai 手写推理模型无法关闭 developer-role/store/reasoning-content 兼容开关 | 补丁暴露三个 compat 开关（PiAiCompatProfile/schema/resolution，model > route > catalog），分支 `fix/pi-ai-compat-expose-role-store`；catalog 53/53 + tsc 全绿 | 已回复（#discussioncomment-18031734），补丁待 PR 通道 |
| 2009 | Chromium 151 把 Origin 序列化成无端口形式，/api POST 全部 403（trust fence 端口比较） | 根因定位 `.host` 精确比较；补丁改 `.hostname`（对齐 trustedHosts 无端口约定），分支 `fix/api-trust-origin-hostname-portless`；11/11 + tsc 全绿 | 已回复（#discussioncomment-18031625），补丁待 PR 通道 |
| 1997 | Windows 点「停止」后 AbortSignal.reason 为 DOMException，turn/end 序列化失败变成 host/agent-error | 根因定位 agent-loop 直接把 signal.reason 写入 turn/end；补丁做 JSON 安全归一化（typed 原因透传，非 JSON 值归为 `{kind:'user'}`），分支 `fix/agent-abort-reason-json-safe`；cancel 32/32 + tsc 全绿 | 已回复（#discussioncomment-18031394），补丁待 PR 通道 |
| 2002 | 单个损坏的 Zstandard 会话文件（首帧非单行 header）导致 dsh web 启动崩溃循环 | 根因定位 `listArtifacts` 让损坏文件异常冒泡到 workspace boot；补丁改为逐文件隔离（warn + 跳过，load 仍拒绝，系统性错误仍致命），分支 `fix/session-list-isolate-corrupt`；239/239 + tsc 全绿 | 已回复（#discussioncomment-18031351），补丁待 PR 通道 |
| 1992 | 自定义 pi-ai 路由（私有 provider key）下模型丢失 catalog 已知模态，带图会话无法切换 | 根因定位 `resolveRouteModels` 只按 provider 查目录；补丁加按 model id 的全局目录回退（仅 input 模态，api/baseUrl 仍属路由），分支 `fix/pi-ai-catalog-model-id-inheritance`；catalog 53/53 + tsc 全绿 | 已回复（#discussioncomment-18031307），补丁待 PR 通道 |
| 1993 | source launch 下 dsh-typert-protocol 出现 src/lib 双副本，插件 Remote 装饰器标记不可见，所有端点静默 404 | 根因定位模块私有 WeakMap；补丁改为 `Symbol.for` 全局共享注册表（与 #1697 同机制），分支 `fix/typert-remote-markers-shared-registry`；protocol 10/10 + tsc 全绿 | 已回复（#discussioncomment-18031268），补丁待 PR 通道 |
| 1961 | Windows 清理 %TEMP% 删除 spill 目录后，子进程输出溢出时 ENOENT 崩溃整个服务 | 根因定位 `subprocess-local/spawn.ts`：mkdtemp 单例目录被系统清理，`spillAll` 无父目录检查；补丁 ENOENT 时重建私有目录并重试一次、失败降级为内存 tail，分支 `fix/subprocess-spill-recreate-on-enoent`；运行时复现验证通过 | 已回复（#discussioncomment-18030665），补丁待 PR 通道 |
| 1944 | compaction 摘要请求与正常回合参数不一致，provider 前缀缓存全 miss（~122k tokens 重新计费） | 根因定位 `summarizeWithLlm` 只继承 provider/model 且强加 `maxTokens: 8192`；补丁改为整包继承 routed header config（agent-loop 同语义），分支 `fix/compaction-inherit-header-config`；124/124 测试全绿 | 已回复（#discussioncomment-18030489），补丁待 PR 通道 |
| 1954 | Windows 循环 junction 导致 skill 目录 ELOOP，dsh 启动即崩溃 | 根因定位 chokidar pre-ready 错误拒绝 readiness 并向上 rethrow；补丁对 ELOOP 仅降级该根（warn + unhealthy + skip + 重试恢复），分支 `fix/skill-filesystem-eloop-contained`；watcher 11/11 全绿 | 已回复（#discussioncomment-18030568），补丁待 PR 通道 |
| 1919 | dsh web 内网 HTTP 下 `crypto.randomUUID is not a function`，提供方目录无法加载 | 根因定位 4 个浏览器侧 mint（commands/ui-conversation/apiproxy/llm）；新增零依赖 `@deepseek-ai/dsh-random-uuid`（`getRandomValues` 兜底）+ `INLINE_SAFE`；分支 `fix/web-crypto-randomuuid-insecure-context`；frozen install + 双 face 构建 + 782/782 测试全绿 | 已回复（#discussioncomment-18030320），补丁待 PR 通道 |
| 1697 | 插件安装后所有工具调用 `undefined.prepare`（双实例 unique symbol） | 根因定位到 `packages/core/tools/src/index.ts:466`；`Symbol.for` + `TOOL_RUNTIME_SCHEDULER_PROTOCOL_VERSION` 协议守卫 + 三态回归测试；分支 `fix/tool-runtime-scheduler-symbol-for` | 官方仍 open，补丁待 PR 通道 |
| 1842 | profile `package.json` 带 UTF-8 BOM 导致 `dsh web` 启动崩溃 | 复现 + 定位 `packages/boot/app-boot/src/profile.ts:267-272`；一行剥 BOM 补丁；分支 `fix/profile-manifest-bom-strip` | 官方仍 open，补丁待 PR 通道 |
| 1856 | Windows minimal 预设默认 bash `/bin/bash` 无法解析 | 独立复现（node-pty File not found）+ 源码定位 + 补丁分支 `fix/terminal-bash-win32-shell`（win32 探测 PATH/Git/LOCALAPPDATA） | 官方仍 open，补丁待 PR 通道 |
| 1861 | deepseek-official adapter 白名单缺 `reasoning_effort: low` | 源码定位 `packages/llm/llm-deepseek/src/adapter.ts`（off/high/max）+ 补丁分支 `fix/llm-deepseek-reasoning-low` | 官方仍 open，补丁待 PR 通道 |
| 1862 | stale standing generation 未 dispose → webServer 路由重复 | 确认机制 + dsh-subscribe v0.3.1 幂等挂载守卫（per-profile disposer map，重挂载先 dispose） | 官方仍 open；我方已防御 |
| 1859/1863 | session 大日志 RangeError / pre-execute 审批前副作用 | 背书增量哈希修复 + O(n) clone 与错误透传建议；安全边界分析（approval=consent UX，非沙箱）+ lint 提议 | 已回应 |
| 1841 | tool 失败后 session 卡死（tool_call 未配对） | 确诊为 #1697 家族第二阶症状；给出 10 秒验证命令与恢复建议 | 已回应 |

## 标准提案（RFC）

| 讨论 | 内容 | 参考实现 |
|---|---|---|
| #1846 | 社区插件注册表契约 v2 + `dsh plugin check` + `dsh doctor`（退出码 0/1/2、JSON envelope、维护承诺） | dsh-subscribe / dsh-plugin-doctor / dsh-plugin-template |
| #1719 | `dsh doctor` 命令规格 → 统一为 dsh-doctor/v1 契约 | dsh-plugin-doctor v1.6.0 |
| #1814 | `dsh plugin check` + `dsh doctor` 采纳提案 | 同上 |
| #1629 | 插件脚手架 RFC 的社区实现（preflight 模式） | dsh-plugin-doctor |


## 本周新增（2026-08-15 → 08-17）

### 采纳请求 + 实测回答（Galaxy Brain 路径）
- 采纳请求 ×5：#1841 / #1919 / #1856 / #2359 / #1932（双语，等作者标记）
- 实测回答 ×7：#2796（插件安装）、#2790（TUI 报错）、#2747（web 无 UI）、#2770（413 上下文）、#2758（工作空间）、#2783（minimal 记忆）、#2779（第三方模型 token）

### 官方采纳线
- RFC 草稿：[subagent/steer 子代理指挥通道](https://github.com/zoahdev/dsh-docs/blob/main/docs/rfc/subagent-steer-channel.md)（#1968，社区已证明 API 可行）
- 补丁台账新增"已诊断待修"分区：D1（token meter 低估，#2107）、D2（web compaction realm 不生效，#2107）
- #2107 深度分析：web profile 默认禁用 compaction + meter 低估双层根因

### 生态地图
- Week 2 周报已发布（注册表 917、10 个 awesome 合并、doctor 契约 5 实现收敛）
- dsh-ecosystem-status 仪表盘每日刷新（48 补丁 / 917 插件 / 30 已验证）

### 分发
- 博客 8 篇深度文上线：https://zoahdev.github.io/blog/（Symbol 根因 / compaction / 安全边界 / doctor 契约 / API 纪律 / 自进化 / 物理 AI / 生态信任）
- dsh-poison-guard 已合并进 4k★ awesome-dsh-plugin；artifacts/browser-use/firecrawl 在 1 天门槛
- 掘金/知乎一键发布包已就绪（3 篇复制即发长文）
## 已实现的生态基础设施

- **dsh-subscribe v0.3**：917 插件注册表（30 verified）+ 中英商店页 + 零依赖 CLI + in-harness 市场（一键安装/卸载/更新/approve-builds，同源 POST + curated-only）
- **dsh-plugin-doctor v1.10.0**：`check` 子命令（RFC #1846 表面）、preflight、`--profile`（profile-shadow + manifest-bom + large-files/#1859）、`--env`（win-bash，#1856）、`pre-execute-side-effects` lint（#1863）、dsh-doctor/v1 envelope、契约验收 harness
- **dsh-ecosystem**：生态地图 + 周报 + **官方 release 兼容性报告自动生成**（npm dist-tags 变动自动出报告）
- **dsh-docs**：官方文档 PR 预置（publish / adding-a-package / troubleshooting）+ 两份规格 + RFC 存档
- **dsh-evolve**：验证驱动自进化循环（experience → rules → verify）；dogfood 实证——检查 doctor 自己发现并修复 lint 自误报（v1.10.1），Show and tell #1906
- **教程站**：35 页中英教程（含 in-harness 市场实战、doctor 排障手册、Agent Growth Report）
- **商店页**：hero 显示"已验证 rc.6 + 6 仓库 CI 全绿 + 兼容报告"状态条（https://zoahdev.github.io/dsh-subscribe/）

## 收录 PR

- awesome-dsh-plugin [#492](https://github.com/awesome-dsh-plugin/awesome-dsh-plugin/pull/492)（Plugin Markets & Managers）—— **已合并 ✅ 2026-08-15**
- awesome-dsh-plugin [#560](https://github.com/awesome-dsh-plugin/awesome-dsh-plugin/pull/560)（Self-evolution / dsh-rule-evolve）—— **已合并 ✅ 2026-08-15**
- ydhrdh/dsh-marketplace [#3](https://github.com/ydhrdh/dsh-marketplace/pull/3)（5 个插件，rebase 到最新 main，Validate 等维护者批准）

## 补丁就绪队列

[upstream-patches.md](https://github.com/zoahdev/dsh-docs/blob/main/docs/specs/upstream-patches.md)：十七张 cherry-pick 就绪分支（#1697/#1842/#1856/#1861/#1869/#1891/#1919/#1944/#1954/#1961/#1993/#1992/#2002/#1997/#2009/#2023/#2060）+ 提交清单。最新上游 validator 复核 marketplace 5 个 plugin.json：**5/5 valid**。

## 协作记录
- 同行互认（#1918 SandBase / #1922 1024Store / #1926 dsh-web-shell / #1931 workbench）：三个确认后已收入 dsh-subscribe 注册表（539 插件），四条评论已发（包含具体技术建议）；#1931 已邀请作者提供仓库链接。

- 与 moonquake2004/dsh-doctor 互认：双方 doctor 的 profile-shadow/P5 检查互相验证；统一契约 envelope 已提出，验收 fixture 已备好
- 官方 `@deepseek-ai/dsh` npm `latest` 坏标签（0.0.1-rc.1）已被官方修复为 0.1.0-rc.6——我们在 #984 确认闭环

## 诚实数字

- star：dsh-subscribe 1、dsh-github-intelligence 1（其余 0）；渠道：60+ 官方讨论帖、2 个收录 PR（awesome #492 已合并）、56 页教程、6 个 CI 全绿仓库
- 未验证/未完成：官方 PR 通道未开（补丁就绪待提交）；npm 发布待用户 `NPM_TOKEN`；moonquake2004 契约适配待对方接入

---

## 最新动态（2026-08-18 → 08-19）

### 9 插件套件全线上（npm + GitHub + CI 绿）

| 插件 | npm | 一句话 |
|---|---|---|
| dsh-dep-audit | 0.1.1 | 供应链依赖审计（semver 引擎，抓到 #2763 类坏 latest） |
| dsh-llms-forge | 0.1.0 | llms.txt 生成 |
| dsh-cn-boot | 0.1.0 | 国内网络引导（npmmirror/代理探测） |
| dsh-timesheet | 0.1.0 | 会话工时统计 |
| dsh-discussions-radar | 0.1.0 | 官方讨论区雷达 |
| dsh-readme-forge | 0.1.0 | README 生成 |
| dsh-firstrun | 0.1.0 | 首启体检 |
| dsh-disk-audit | 0.1.0 | 磁盘占用审计 |
| dsh-quality-score | 0.1.4 | 插件质量评分卡（325 插件榜单，12 测试） |
| dsh-unplug | 0.3.1 | 插件生命周期管理（小白模式/菜单/hint/--all/--dry-run）：list/remove/disable/enable/audit/reconcile，零依赖，只读默认，中英双语 |

收录 PR：**已合并 2 个** —— 0xsline/awesome-deepseek-harness [#401](https://github.com/0xsline/awesome-deepseek-harness/pull/401)（9 插件套件）✅ 2026-08-20；awesome-dsh-plugin [#1732](https://github.com/awesome-dsh-plugin/awesome-dsh-plugin/pull/1732)（dsh-firstrun）✅。**gate 全绿待合并 7 个**：#1682/#1684/#1698/#1722/#1727/#1737/#1786（Submission gate 全部 success，2026-08-20 06:45Z 验证）。**新增 #2159（dsh-unplug）** 已开，新仓库 24h 年龄 gate 排队中；官方讨论区展示帖 [#3603](https://github.com/deepseek-ai/deepseek-harness/discussions/3603)。

### #2763 战役（坏 latest dist-tag）

- 全注册表扫描（08-20 复验）：316 npm-installable → 91 声明 dsh-tools 范围 → **69 被坏 latest 命中**（较 08-19 的 325/101/78 下降）；what-if latest→next 修复 69/69。meta 包 @deepseek-ai/dsh latest 已修到 0.1.0-rc.7 ✅；子包族 latest 仍卡 0.0.1-rc.1/rc.3，next 全族 rc.8——partial fix 进行中。
- 评分卡联动：78 个 B 的唯一扣分即 dsh-tools peer；修复后 240A→318A
- 官方讨论区 #2763 共 7 条实证回复（影响面/趋势/leaderboard/修复影响/8 个精确 pin 名单）
- 修复日验证器：`scripts/verify-2763-fix.mjs`（detect latest 变化 → 重扫 → 重评 → 出报告，dry-run 已验证）

### 技术核验回复 12 条（全部对照 main HEAD 99f6f02，见 Q&A 库索引）

#3174（tmpfs 不对称·深挖）· #675（SQLite torn tail）· #3183（投影缓存）· #3190（spill ENOENT）· #1047（单坏日志拖垮列表）· #3195（CTRL_C_EVENT）· #3101（pnpm peer 警告·代码级纠正）· #3177（单波浪线删除线·实测）· #3178（WSL /dev/dxg·透传建议）· #3175（跨会话延续·生态对照）· #3206（CJK 检索·node:sqlite 实测）· #2763×7 战役回复 · 08-20 新增：#3530（seq 重叠·#3232 同族）、#3524（prepare 缺口·#1697+#3234 链）、#3541（{{...}} 模板变量·#1341 同根因）、#3542（/compact 中止·#1944 链路）、#3546（归档/删除·指向 dsh-shelf+disk-audit）、#3601（latest dist-tag·#2763 数据）、#3565（/compact 旧路由·#1944 同区）、#3591（未配对 tool_calls·#3234 同族）

### 工具与站点

- `scripts/discussion-triage.mjs` + `.github/workflows/discussion-triage.yml`（每日值班队列，单 GraphQL 请求；需 DISCUSSIONS_TOKEN secret 启用）
- 仪表盘 v3：[ecosystem-health-dashboard.html](https://zoahdev.github.io/dsh-ecosystem/ecosystem-health-dashboard.html)（917/325/101/78 当前态 + 趋势 + 分类 + leaderboard v1）
- 商店端质量徽章：[zoahdev.github.io/dsh-subscribe](https://zoahdev.github.io/dsh-subscribe/)（917 插件，324 带 Q 徽章）
- 教程 zh-25/en-25：社区贡献工作流（值班/核验/GraphQL/家族化）
- 教程 zh-25/en-25：社区贡献工作流（值班/核验/GraphQL/家族化）
- **已知问题家族图谱**：[docs/bug-families.md](https://github.com/zoahdev/dsh-ecosystem/blob/main/docs/bug-families.md)——13 个已核验根因家族（dist-tag/%TEMP% 清理/坏工件隔离/符号分裂/推理别名/Windows 令牌/信任边界/加载回滚/检索渲染/工具结果可信度/会话事件信封/同模式升级误报/无约束执行面绕过沙箱），新帖先查图谱
- 新回复：#3219（同模式 sandbox_permissions 应放行——根因确认 + 现有测试会破 + 工具层 validation 前置缺口，提议三件套完整修复）、#3220（/history 深链直达轨迹——四点现状全核验 + URL 绑定最小闭环）、教程 zh-27/en-27（家族图谱 triage 工作流，54 页）

### 诚实数字

- 官方讨论回复累计 70+；10 插件 npm 全绿；注册表 917（325 npm-installable）
- 未完成：awesome-dsh-plugin 7 PR 待维护者合并（gate 已全绿）；#2763 官方 partial fix 进行中（next→rc.8，核心包 latest 仍旧）；CI 值班需用户设 DISCUSSIONS_TOKEN 才能全自动
