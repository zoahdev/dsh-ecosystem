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
- Tracked upstream bugs: 16 (16 cherry-pick-ready patches, see [patch list](https://github.com/zoahdev/dsh-docs/blob/main/docs/specs/upstream-patches.md))
- Gaps: 8 (see [Gap radar](./docs/weekly-2026-08-15.md#gap-radar))

## The zoahdev suite (fully verified)

| Repo | What | Verification |
|---|---|---|
| [dsh-subscribe](https://github.com/zoahdev/dsh-subscribe) | Steam-style market + 563-plugin registry + in-harness install | ✅ check-registry, CI, awesome #492 merged |
| [dsh-rule-evolve](https://github.com/zoahdev/dsh-rule-evolve) | Verification-driven self-evolution + badge | ✅ 18 tests, awesome #560 merged |
| [dsh-plugin-doctor](https://github.com/zoahdev/dsh-plugin-doctor) | Pre-publish preflight + env explain + entry-points + profile-shadow | ✅ 40 tests + dsh-doctor/v1 contract |
| [dsh-plugin-doctor-action](https://github.com/zoahdev/dsh-plugin-doctor-action) | One-line GitHub Action CI gate for plugin authors | ✅ @v1, Release tarball |
| [dsh-shelf](https://github.com/zoahdev/dsh-shelf) | Session lifecycle: web panel + CLI + verify/rescue | ✅ 14 tests |
| [dsh-pet-evolve](https://github.com/zoahdev/dsh-pet-evolve) | The pet that grows with your agent | ✅ 13 tests |
| [dsh-github-intelligence](https://github.com/zoahdev/dsh-github-intelligence) | 195+ tools × 15 ecosystems + weekly digest | ✅ real-API smoke, 44 tests, CI |
| [dsh-plugin-search](https://github.com/zoahdev/dsh-plugin-search) | Plugin discovery inside DSH | ✅ 6 tests, visibility, CI |
| [dsh-github-release-radar](https://github.com/zoahdev/dsh-github-release-radar) | Releases/stars/tags radar | ✅ 16 tests, visibility, CI |
| [dsh-plugin-template](https://github.com/zoahdev/dsh-plugin-template) | Verified template with peer guard | ✅ CI |
| [dsh-tutorials](https://github.com/zoahdev/dsh-tutorials) | 45-page bilingual tutorial site | ✅ Pages live |
| [dsh-docs](https://github.com/zoahdev/dsh-docs) | Official-docs gap specs + upstream patch list | ✅ 15 patches documented |
| [dsh-ecosystem](https://github.com/zoahdev/dsh-ecosystem) | Map + weekly + release-compat + patch-verify | ✅ 15-branch patch-verify bot |

## Contribute

- Know a plugin that should be in the catalog? Open an issue or PR with the repo URL.
- Found a bug not on the radar? Open an issue.
- Want to take a gap? Say so in the issue — the map will track it.

## License

CC0 — the map is data; use it freely.
