# zoahdev × DeepSeek Harness — official engagement dossier

> 一页纸记录 zoahdev 在官方讨论区/上游仓库的全部实质贡献。每条都有可点击链接与真实验证；更新于 2026-08-15。

## Bug 根因 + 修复（cherry-pick 就绪）

| # | 问题 | 交付 | 状态 |
|---|---|---|---|
| 1697 | 插件安装后所有工具调用 `undefined.prepare`（双实例 unique symbol） | 根因定位到 `packages/core/tools/src/index.ts:466`；`Symbol.for` + `TOOL_RUNTIME_SCHEDULER_PROTOCOL_VERSION` 协议守卫 + 三态回归测试；分支 `fix/tool-runtime-scheduler-symbol-for` | 官方仍 open，补丁待 PR 通道 |
| 1842 | profile `package.json` 带 UTF-8 BOM 导致 `dsh web` 启动崩溃 | 复现 + 定位 `packages/boot/app-boot/src/profile.ts:267-272`；一行剥 BOM 补丁；分支 `fix/profile-manifest-bom-strip` | 官方仍 open，补丁待 PR 通道 |
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
- **dsh-plugin-doctor v1.6.0**：preflight、`--profile`（profile-shadow + manifest-bom）、`--env`、dsh-doctor/v1 envelope、跨实现契约验收 harness
- **dsh-ecosystem**：生态地图 + 周报 + **官方 release 兼容性报告自动生成**（npm dist-tags 变动自动出报告）
- **dsh-docs**：官方文档 PR 预置（publish / adding-a-package / troubleshooting）+ 两份规格 + RFC 存档
- **教程站**：29 页中英教程（含 in-harness 市场实战、doctor 排障手册）

## 收录 PR（外部审核中）

- awesome-dsh-plugin [#492](https://github.com/awesome-dsh-plugin/awesome-dsh-plugin/pull/492)（Plugin Markets & Managers）
- ydhrdh/dsh-marketplace [#3](https://github.com/ydhrdh/dsh-marketplace/pull/3)（5 个插件，rebase 到最新 main，Validate 等维护者批准）

## 协作记录

- 与 moonquake2004/dsh-doctor 互认：双方 doctor 的 profile-shadow/P5 检查互相验证；统一契约 envelope 已提出，验收 fixture 已备好
- 官方 `@deepseek-ai/dsh` npm `latest` 坏标签（0.0.1-rc.1）已被官方修复为 0.1.0-rc.6——我们在 #984 确认闭环

## 诚实数字

- star：仍为 0；渠道：5+ 官方讨论帖、2 个收录 PR、29 页教程、6 个 CI 全绿仓库
- 未验证/未完成：官方 PR 通道未开（补丁就绪待提交）；npm 发布待用户 `NPM_TOKEN`；moonquake2004 契约适配待对方接入
