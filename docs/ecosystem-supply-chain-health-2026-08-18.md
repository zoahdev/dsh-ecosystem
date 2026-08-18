# dsh ecosystem supply-chain health scan — 2026-08-18

Scanned **41** packages on npm (official @deepseek-ai scope + community plugin packages).

- **21** packages have a `latest` dist-tag that differs from `next` (#2763 class)
- **5** packages have dead dependency/peer ranges in the version `latest` points at
- **15** packages declare an @deepseek-ai/dsh-tools peer range that the broken `latest` (0.0.1-rc.1) contradicts
- **3** listed packages do not exist on npm: dsh-web-ui, oh-dsh, dsh-compass

| Package | latest | next | latest≠next | dead ranges | dsh-tools peer affected (#2763) |
|---|---|---|---|---|---|
| @deepseek-ai/dsh-scope | 0.0.1-rc.1 | 0.1.0-rc.7 | WARN |  |  |
| @deepseek-ai/dsh-system-prompt | 0.0.1-rc.1 | 0.1.0-rc.7 | WARN |  |  |
| @deepseek-ai/dsh-session | 0.0.1-rc.1 | 0.1.0-rc.7 | WARN | @deepseek-ai/dsh-type-meta@^0.0.1-rc.1 (package 404) |  |
| @deepseek-ai/dsh-agent | 0.1.0-rc.6 | 0.1.0-rc.7 | WARN |  |  |
| @deepseek-ai/dsh-tools | 0.0.1-rc.1 | 0.1.0-rc.7 | WARN |  |  |
| @deepseek-ai/dsh-cmdline | 0.0.1-rc.1 | 0.1.0-rc.7 | WARN |  |  |
| @deepseek-ai/dsh-llm | 0.0.1-rc.1 | 0.1.0-rc.7 | WARN |  |  |
| @deepseek-ai/dsh-schedule | 0.0.1-rc.3 | 0.1.0-rc.7 | WARN |  | WARN ^0.0.1-rc.3 |
| @deepseek-ai/dsh-app-boot | 0.1.0-rc.6 | 0.1.0-rc.7 | WARN |  |  |
| @deepseek-ai/cordis-plugin-loader | 1.0.2 | 1.0.2-rc.4 | WARN |  |  |
| @deepseek-ai/schemastery | 3.18.1 | 3.18.1-rc.4 | WARN |  |  |
| @deepseek-ai/cordis | 4.0.1 | 4.0.1-rc.4 | WARN |  |  |
| @deepseek-ai/cordis-plugin-timer | 1.1.3 | 1.1.3-rc.4 | WARN |  |  |
| @deepseek-ai/dsh-mcp-client | 0.0.1-rc.1 | 0.1.0-rc.7 | WARN |  |  |
| @deepseek-ai/dsh-bash-local | 0.0.1-rc.1 | 0.1.0-rc.7 | WARN | @deepseek-ai/dsh-bash@^0.0.1-rc.1 (package 404) |  |
| deepseek-harness-desktop | 0.4.1 | - |  |  |  |
| @deepseek-ai/dsh-session-persistence-jsonl | 0.0.1-rc.1 | 0.1.0-rc.7 | WARN |  |  |
| dsh-memory | 0.1.0 | - |  |  | WARN ^0.1.0-rc.6 |
| dsh-egress-guard | 0.1.0 | - |  |  | WARN >=0.1.0-rc.5 <0.2.0 |
| dsh-plugin-vetting | 0.5.6 | - |  |  |  |
| dsh-notifier | 0.8.4 | - |  |  |  |
| dsh-kirocrew | 0.1.0 | - |  |  | WARN ^0.1.0-rc.6 |
| dsh-browser-use | 0.1.0 | - |  |  | WARN ^0.1.0-rc.6 |
| dsh-firecrawl | 0.1.0 | - |  |  | WARN ^0.1.0-rc.6 |
| @deepseek-ai/dsh-tool-bash | 0.0.1-rc.1 | 0.1.0-rc.7 | WARN | @deepseek-ai/dsh-bash@^0.0.1-rc.1 (package 404)<br>@deepseek-ai/dsh-tasks@^0.0.1-rc.1 (package 404)<br>@deepseek-ai/dsh-bash-env@^0.0.1-rc.1 (package 404) |  |
| @deepseek-ai/dsh-agent-spine-demo | 0.0.1-rc.1 | 0.1.0-rc.7 | WARN | @deepseek-ai/dsh-paths@^0.0.1-rc.1 (package 404)<br>@deepseek-ai/dsh-bash-env@^0.0.1-rc.1 (package 404)<br>@deepseek-ai/dsh-tool-tasks@^0.0.1-rc.1 (package 404)<br>@deepseek-ai/dsh-skill-local@^0.0.1-rc.1 (package 404)<br>@deepseek-ai/dsh-tasks-local@^0.0.1-rc.1 (package 404)<br>@deepseek-ai/dsh-goal-session@^0.0.1-rc.1 (package 404)<br>@deepseek-ai/dsh-workspace-context@^0.0.1-rc.1 (package 404) |  |
| dsh-dep-audit | 0.1.1 | - |  |  | WARN ^0.1.0-rc.6 |
| dsh-llms-forge | 0.1.0 | - |  |  | WARN ^0.1.0-rc.6 |
| dsh-readme-forge | 0.1.0 | - |  |  | WARN ^0.1.0-rc.6 |
| dsh-cn-boot | 0.1.0 | - |  |  | WARN ^0.1.0-rc.6 |
| dsh-timesheet | 0.1.0 | - |  |  | WARN ^0.1.0-rc.6 |
| dsh-discussions-radar | 0.1.0 | - |  |  | WARN ^0.1.0-rc.6 |
| sage-mem | 0.4.0 | - |  |  |  |
| dsh-firstrun | 0.1.0 | - |  |  | WARN ^0.1.0-rc.6 |
| dsh-disk-audit | 0.1.0 | - |  |  | WARN ^0.1.0-rc.6 |
| @deepseek-ai/dsh-subprocess-local | 0.0.1-rc.1 | 0.1.0-rc.7 | WARN |  |  |
| @deepseek-ai/dsh | 0.1.0-rc.7 | 0.1.0-rc.7 |  |  |  |
| dsh-pomodoro | 0.4.0 | - |  |  |  |
| dsh-vault | 1.9.2 | 1.9.2-rc.1 | WARN |  | WARN >=0.1.0-rc.6 |
| dsh-mnemon | 0.2.9 | - |  |  |  |
| @deepseek-ai/dsh-base | 0.0.1-rc.1 | 0.1.0-rc.7 | WARN | @deepseek-ai/dsh-bash-env@^0.0.1-rc.1 (package 404)<br>@deepseek-ai/dsh-fs-policy@^0.0.1-rc.1 (package 404)<br>@deepseek-ai/dsh-permission@^0.0.1-rc.1 (package 404)<br>@deepseek-ai/dsh-tool-tasks@^0.0.1-rc.1 (package 404)<br>@deepseek-ai/dsh-skill-local@^0.0.1-rc.1 (package 404)<br>@deepseek-ai/dsh-tasks-local@^0.0.1-rc.1 (package 404)<br>@deepseek-ai/dsh-goal-session@^0.0.1-rc.1 (package 404)<br>@deepseek-ai/dsh-compact-basic@^0.0.1-rc.1 (package 404)<br>@deepseek-ai/dsh-subagent-fork@^0.0.1-rc.1 (package 404)<br>@deepseek-ai/dsh-settings-local@^0.0.1-rc.1 (package 404)<br>@deepseek-ai/dsh-subagent-spawn@^0.0.1-rc.1 (package 404)<br>@deepseek-ai/dsh-timeout-policy@^0.0.1-rc.1 (package 404)<br>@deepseek-ai/dsh-user-interaction@^0.0.1-rc.1 (package 404)<br>@deepseek-ai/dsh-repeat-tool-guard@^0.0.1-rc.1 (package 404)<br>@deepseek-ai/dsh-workspace-context@^0.0.1-rc.1 (package 404)<br>@deepseek-ai/dsh-workflow-workerthread@^0.0.1-rc.1 (package 404)<br>@deepseek-ai/dsh-compact-tool-result-prune@^0.0.1-rc.1 (package 404)<br>@deepseek-ai/dsh-session-title-first-message-llm@^0.0.1-rc.1 (package 404) |  |

Method: registry metadata scan (npm install-v1 accept header + npm CLI fallback with full-version verification for large packuments), semver checks via the dsh-dep-audit engine (v0.1.1). Snapshot date 2026-08-18.

Notes:

- "latest != next" means the default install path (dsh plugin add <name> / 
pm install <name>) can resolve a version line different from the actively developed one — the #2763 failure class.
- "dsh-tools peer affected" means the plugin declares a peer range for @deepseek-ai/dsh-tools that the broken latest (0.0.1-rc.1) does NOT satisfy; fresh installs should pin @next / the matching rc.
- Dead ranges in the latest version are concentrated in the official 0.0.1-rc.1 line (pre-rename package names that 404 on npm).
- dsh-web-ui / oh-dsh / dsh-compass are not on npm (distributed from GitHub / monorepo paths).

## Full-registry impact — 2026-08-18 (all npm-installable plugins)

Fast-mode scan of the live dsh-subscribe registry (916 plugins, 324 npm-installable):

- **100** plugins declare an @deepseek-ai/dsh-tools range (96 peer, 4 dependency)
- **77 are affected** by the broken `latest` (0.0.1-rc.1) — their declared range is not satisfied by the default install resolution
- 23 not affected, 0 fetch failures

Affected list (name | source | declared range | plugin latest):

| Plugin | source | declared range |
|---|---|---|
