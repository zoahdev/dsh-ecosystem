# DeepSeek Harness Ecosystem Map

> The living map of the dsh plugin ecosystem — curated, quality-signaled, and updated weekly. Maintained by [zoahdev](https://github.com/zoahdev).

[![Weekly](https://img.shields.io/badge/weekly-2026--08--15-blue)](./docs/weekly-2026-08-15.md) · [![Plugins](https://img.shields.io/badge/plugins-40%2B-orange)](./docs/plugins.md) · [![Bugs tracked](https://img.shields.io/badge/bugs-10-red)](./docs/weekly-2026-08-15.md#bug-radar)

## What this is

DeepSeek Harness (`dsh`) went open source on 0.1.0-rc.6 and the ecosystem exploded in days: 2,958 repos carry the `dsh-plugin` topic, at least 8 curated lists exist, and new plugins appear hourly. Nobody was tracking **quality signals, bug status, and gaps** in one place. This map is that place.

- **[Weekly editions](./docs/)** — what shipped, what broke, what got fixed.
- **[Curated plugin catalog](./docs/plugins.md)** — real dsh-installable plugins with category, author, visibility, and (where audited) verification signals.
- **Bug radar** — known upstream bugs with status, root cause, and fixes/workarounds.
- **Gap radar** — what the ecosystem is missing (and who is building it).
- **[Release compatibility reports](./docs/release-compat/)** — npm dist-tags + zoahdev suite CI + ecosystem health, auto-generated on every release train change.
- **[Official engagement dossier](./docs/official-engagement.md)** — one page of every upstream contribution (patches, RFCs, docs) with links and status.

## How to read quality signals

| Signal | Meaning |
|---|---|
| ✅ verified | I audited this repo: CI exists, a release/tarball exists, and (for zoahdev suite) real-registry agent-visibility tests pass |
| 🟡 signals partial | Some signals present (release or CI), not fully audited |
| ○ not audited | Listed from the topic/awesome/marketplace survey; quality not yet verified |

## Quick stats (2026-08-15)

- Official: `deepseek-ai/deepseek-harness` — 103k★, 0.1.0-rc.6
- `dsh-plugin` topic: 2,958 repos (noisy: includes skills, desktops, and unrelated projects)
- Curated lists: 8+ (crowded — see [docs/plugins.md](./docs/plugins.md#curated-lists))
- Marketplaces/registries: dsh-marketplace (PR-based), dsh-market (in-DSH), several web marketplaces
- Tracked upstream bugs: 10 (see [Bug radar](./docs/weekly-2026-08-15.md#bug-radar))
- Gaps: 8 (see [Gap radar](./docs/weekly-2026-08-15.md#gap-radar))

## The zoahdev suite (fully verified)

| Repo | What | Verification |
|---|---|---|
| [dsh-github-intelligence](https://github.com/zoahdev/dsh-github-intelligence) | 195+ tools × 15 ecosystems + weekly digest | ✅ real-API smoke, 44 tests, visibility (198 tools), CI |
| [dsh-plugin-doctor](https://github.com/zoahdev/dsh-plugin-doctor) | Pre-publish preflight + diagnostics | ✅ 12 tests, visibility, CI |
| [dsh-plugin-search](https://github.com/zoahdev/dsh-plugin-search) | Plugin discovery inside DSH | ✅ 6 tests, visibility, CI |
| [dsh-github-release-radar](https://github.com/zoahdev/dsh-github-release-radar) | Releases/stars/tags radar | ✅ 16 tests, visibility, CI |
| [dsh-plugin-template](https://github.com/zoahdev/dsh-plugin-template) | Verified template with peer guard | ✅ CI |

## Contribute

- Know a plugin that should be in the catalog? Open an issue or PR with the repo URL.
- Found a bug not on the radar? Open an issue.
- Want to take a gap? Say so in the issue — the map will track it.

## License

CC0 — the map is data; use it freely.
