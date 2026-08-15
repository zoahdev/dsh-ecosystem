# zoahdev × DeepSeek Harness — official engagement dossier

> 一页纸记录 zoahdev 在官方讨论区/上游仓库的全部实质贡献。每条都有可点击链接与真实验证；更新于 2026-08-15。

## Bug 根因 + 修复（cherry-pick 就绪）

| # | 问题 | 交付 | 状态 |
|---|---|---|---|
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

## 已实现的生态基础设施

- **dsh-subscribe v0.3**：536 插件注册表（20 verified）+ 中英商店页 + 零依赖 CLI + in-harness 市场（一键安装/卸载/更新/approve-builds，同源 POST + curated-only）
- **dsh-plugin-doctor v1.10.0**：`check` 子命令（RFC #1846 表面）、preflight、`--profile`（profile-shadow + manifest-bom + large-files/#1859）、`--env`（win-bash，#1856）、`pre-execute-side-effects` lint（#1863）、dsh-doctor/v1 envelope、契约验收 harness
- **dsh-ecosystem**：生态地图 + 周报 + **官方 release 兼容性报告自动生成**（npm dist-tags 变动自动出报告）
- **dsh-docs**：官方文档 PR 预置（publish / adding-a-package / troubleshooting）+ 两份规格 + RFC 存档
- **dsh-evolve**：验证驱动自进化循环（experience → rules → verify）；dogfood 实证——检查 doctor 自己发现并修复 lint 自误报（v1.10.1），Show and tell #1906
- **教程站**：35 页中英教程（含 in-harness 市场实战、doctor 排障手册、Agent Growth Report）
- **商店页**：hero 显示"已验证 rc.6 + 6 仓库 CI 全绿 + 兼容报告"状态条（https://zoahdev.github.io/dsh-subscribe/）

## 收录 PR

- awesome-dsh-plugin [#492](https://github.com/awesome-dsh-plugin/awesome-dsh-plugin/pull/492)（Plugin Markets & Managers）—— **已合并 ✅ 2026-08-15**
- ydhrdh/dsh-marketplace [#3](https://github.com/ydhrdh/dsh-marketplace/pull/3)（5 个插件，rebase 到最新 main，Validate 等维护者批准）

## 补丁就绪队列

[upstream-patches.md](https://github.com/zoahdev/dsh-docs/blob/main/docs/specs/upstream-patches.md)：七张 cherry-pick 就绪分支（#1697/#1842/#1856/#1861/#1869/#1891/#1919）+ 提交清单。最新上游 validator 复核 marketplace 5 个 plugin.json：**5/5 valid**。

## 协作记录

- 与 moonquake2004/dsh-doctor 互认：双方 doctor 的 profile-shadow/P5 检查互相验证；统一契约 envelope 已提出，验收 fixture 已备好
- 官方 `@deepseek-ai/dsh` npm `latest` 坏标签（0.0.1-rc.1）已被官方修复为 0.1.0-rc.6——我们在 #984 确认闭环

## 诚实数字

- star：dsh-subscribe 1、dsh-github-intelligence 1（其余 0）；渠道：20+ 官方讨论帖、2 个收录 PR（awesome #492 已合并）、35 页教程、6 个 CI 全绿仓库
- 未验证/未完成：官方 PR 通道未开（补丁就绪待提交）；npm 发布待用户 `NPM_TOKEN`；moonquake2004 契约适配待对方接入
