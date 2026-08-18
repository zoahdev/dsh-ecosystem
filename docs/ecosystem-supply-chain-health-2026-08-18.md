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

Affected list (name | source | declared range):

| Plugin | source | declared range |
|---|---|---|
| dsh-dep-audit | peer | ^0.1.0-rc.6 |
| dsh-cn-boot | peer | ^0.1.0-rc.6 |
| dsh-llms-forge | peer | ^0.1.0-rc.6 |
| dsh-firstrun | peer | ^0.1.0-rc.6 |
| dsh-disk-audit | peer | ^0.1.0-rc.6 |
| dsh-timesheet | peer | ^0.1.0-rc.6 |
| dsh-readme-forge | peer | ^0.1.0-rc.6 |
| dsh-discussions-radar | peer | ^0.1.0-rc.6 |
| dsh-diagram | peer | 0.1.0-rc.6 |
| dsh-splash-launcher | peer | ^0.1.0-rc.6 |
| dsh-file-upload | peer | ^0.1.0-rc.6 |
| @huiliyi37/dsh-tianshu-tui | peer | ^0.1.0-rc.6 |
| @lemcae/dsh-balance | peer | ^0.1.0-rc.5 |
| dsh-better-sidebar | peer | ^0.1.0-rc.7 |
| @open-agfs/dsh-agfs | peer | ^0.1.0-rc.6 |
| dsh-plugin-genui | peer | ^0.1.0-rc.6 |
| dsh-codex-timeline | peer | 0.1.0-rc.7 |
| @zseven-w/dsh-openpencil | peer | ^0.1.0-rc.6 |
| dsh-codex-auth | peer | ^0.1.0-rc.6 |
| dsh-codex-connect | peer | 0.1.0-rc.6 |
| @wnjxyk/dsh-codex-oauth | dep | ^0.1.0-rc.6 |
| task-passport | peer | >=0.1.0-rc.5 |
| dsh-agent-message | peer | >=0.1.0-rc.6 <0.2.0 |
| dsh-plugin-solo-thinking | peer | ^0.1.0-rc.6 |
| dsh-chat-import | peer | ^0.1.0-rc.6 |
| dsh-period-report | peer | ^0.1.0-rc.6 |
| dsh-memory-vault | peer | ^0.1.0-rc.6 |
| dsh-unified-agent-memory | peer | ^0.1.0-rc.6 |
| dsh-memento | peer | >=0.1.0-rc.6 |
| dsh-flomo | peer | ^0.1.0-rc.6 |
| dsh-notion-connector | peer | ^0.1.0-rc.6 |
| dsh-monitor | peer | ^0.1.0-rc.6 |
| dsh-free-search | peer | >=0.1.0-rc.6 |
| dsh-web-search-pro | dep | ^0.1.0-rc.6 |
| dsh-wechat-mp | peer | >=0.1.0-rc.6 |
| dsh-blender | peer | ^0.1.0-rc.6 |
| dsh-remote | peer | ^0.1.0-rc.6 |
| dsh-ai4scholar | peer | >=0.1.0-rc.6 |
| dsh-office-tools | peer | ^0.1.0-rc.6 |
| dsh-plugin-grok2api-media-tool | peer | ^0.1.0-rc.7 |
| dsh-unsloth-hands | peer | >=0.1.0-rc.2 |
| @moguiyu/dsh-tool-tavily-search | peer | ^0.1.0-rc.7 |
| @yejiming/dsh-data-agent | peer | ^0.1.0-rc.7 |
| dsh-koboldcpp-hands | peer | >=0.1.0-rc.2 |
| dsh-bash-terminal | peer | ^0.1.0-rc.6 |
| dsh-us-stocks | peer | >=0.0.1-rc.5 <0.1.0 |
| dsh-lsp-actions | peer | >=0.1.0-rc.6 |
| dsh-codex-tools | peer | ^0.1.0-rc.6 |
| dsh-better-edit | peer | ^0.1.0-rc.6 |
| dsh-checkpoint-rewind | peer | 0.1.0-rc.6 |
| dsh-deeptutor | peer | ^0.1.0-rc.6 |
| dsh-s1 | peer | ^0.1.0-rc.6 |
| dsh-tool-writing | peer | ^0.1.0-rc.6 |
| dsh-git-worktree | dep | 0.1.0-rc.6 |
| dsh-plugin-writing-guard | peer | ^0.1.0-rc.6 |
| @yun520-1/deepseek-heartflow | peer | ^0.1.0-rc.6 |
| dsh-continual-evolve | peer | ^0.1.0-rc.6 |
| dsh-tool-orchestrate | peer | ^0.1.0-rc.6 |
| @opendsh/dsh-plugin-scheduled-tasks | peer | ^0.1.0-rc.6 |
| dsh-approval-llm | peer | ^0.1.0-rc.7 |
| dsh-agent-relay | peer | ^0.1.0-rc.6 |
| @nyantused/folio-dsh-tools | peer | ^0.1.0-rc.6 |
| dsh-auto-review | peer | 0.1.0-rc.7 |
| dsh-doublecheck | peer | 0.1.0-rc.6 |
| @dsh-suite/plugin-team-board | peer | ^0.1.0-rc.6 |
| dsh-acp-enhanced | peer | ^0.1.0-rc.6 |
| @luzhengyangtx/dsh-telegram-duty | peer | ^0.1.0-rc.5 |
| dsh-voice-call | peer | ^0.1.0-rc.6 |
| dsh-paperlab | peer | ^0.1.0-rc.6 |
| dsh-ticktick | peer | ^0.1.0-rc.6 |
| dsh-restart | dep | ^0.1.0-rc.6 |
| dsh-security-guard | peer | ^0.1.0-rc.6 |
| dsh-testkit | peer | >=0.1.0-rc.6 <0.2.0 |
| dsh-mcp-lens | peer | ^0.1.0-rc.6 |
| dsh-mcp-panel | peer | 0.1.0-rc.6 |
| dsh-permission-rules | peer | 0.1.0-rc.6 |
| dsh-prometheus | peer | 0.1.0-rc.6 |


## What-if: official `latest` → 0.1.0-rc.7

Computed against the 77 affected plugins (same snapshot):

- **69 / 77 would be fixed** — their declared ranges (`^0.1.0-rc.6`, `>=0.1.0-rc.5`, etc.) are satisfied by 0.1.0-rc.7
- **8 remain broken** because they pin the exact version `0.1.0-rc.6` (an exact pin, not a caret range): dsh-diagram, dsh-codex-connect, dsh-checkpoint-rewind, dsh-git-worktree, dsh-doublecheck, dsh-mcp-panel, dsh-permission-rules, dsh-prometheus

So a single official dist-tag fix (`latest` → `0.1.0-rc.7`) resolves 89% of the ecosystem impact; the remaining 8 are plugin-side exact pins that should be loosened to `^0.1.0-rc.6`.

## Trend 2026-08-18 -> 2026-08-19

| Metric | 08-18 | 08-19 | Δ |
|---|---|---|---|
| npm-installable plugins | 324 | 325 | +1 (dsh-quality-score) |
| declare dsh-tools range | 100 | 101 | +1 |
| affected by broken latest | 77 | 78 | +1 |
| not affected | 23 | 23 | 0 |
| unknown | 0 | 0 | 0 |

**Conclusion**: impact holds steady; the official `latest` dist-tag for @deepseek-ai/dsh-tools is still 0.0.1-rc.1 (unfixed). The +1 delta is the new dsh-quality-score plugin itself (it declares `^0.1.0-rc.6` and is affected like every other plugin). Ecosystem waiting on the official fix; the what-if still stands (latest -> 0.1.0-rc.7 fixes 89%).
