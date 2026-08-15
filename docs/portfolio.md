# zoahdev — DeepSeek Harness ecosystem portfolio

> One-page portfolio for collaboration, hiring, and sponsorship conversations.
> Everything below is public, linked, and reproducible. Last updated 2026-08-15.

## Who

Independent developer building **verification-first infrastructure** for the
DeepSeek Harness (dsh) plugin ecosystem: standards, diagnostics, marketplaces,
documentation, and upstream patches — every claim backed by CI runs and real
install/boot smoke tests.

## What I built

| Project | What it does | Status |
|---|---|---|
| [dsh-subscribe](https://github.com/zoahdev/dsh-subscribe) | 536-plugin registry (20 verified), bilingual storefront, zero-dep CLI, in-harness market with one-click install/uninstall/update/allowBuilds | v0.3.1, CI green, listed on awesome-dsh-plugin |
| [dsh-plugin-doctor](https://github.com/zoahdev/dsh-plugin-doctor) | `dsh plugin check`-style preflight (manifest/patch/entry/build/pack/fresh-profile install), profile checks (shadow/BOM/large-files), env checks (win-bash), dsh-doctor/v1 JSON envelope, cross-implementation contract harness | v1.10.0, 25/25 tests |
| [dsh-ecosystem](https://github.com/zoahdev/dsh-ecosystem) | Weekly ecosystem map (bug/gap radar) + **auto-generated release compatibility reports** (npm dist-tags + 6-repo CI + ecosystem health) | weekly |
| [dsh-docs](https://github.com/zoahdev/dsh-docs) | PR-ready official documentation proposals (publishing guide, troubleshooting, adding packages) + specs + RFC archive + upstream patch queue | maintained |
| [dsh-tutorials](https://zoahdev.github.io/dsh-tutorials/) | 31 bilingual tutorial pages (getting started → plugin dev → diagnostics → retrieval efficiency) | live |

## Upstream contributions (cherry-pick-ready on the fork)

| Discussion | Fix branch | Class |
|---|---|---|
| #1697 | `fix/tool-runtime-scheduler-symbol-for` | dual-instance tool-runtime crash (`undefined.prepare`) |
| #1842 | `fix/profile-manifest-bom-strip` | UTF-8 BOM boot crash |
| #1856 | `fix/terminal-bash-win32-shell` | Windows minimal-preset bash resolution |
| #1861 | `fix/llm-deepseek-reasoning-low` | adapter rejects `reasoning_effort: low` |
| #1869 | `fix/markdown-single-tilde` | single tilde renders as strikethrough |

Each branch: source-root-caused, minimally scoped, evidence attached to the
discussion, maintained against master.

## Standards & RFCs

- [RFC #1846](https://github.com/deepseek-ai/deepseek-harness/discussions/1846) — Community plugin registry contract v2 + first-class `dsh plugin check` / `dsh doctor`, with running implementations for every section
- [dsh-doctor/v1 contract](https://github.com/deepseek-ai/deepseek-harness/discussions/1719) — shared JSON envelope + exit-code semantics, with an acceptance harness (clean/BOM/shadow fixtures)

## Engagement model (what I keep doing automatically)

- **Release compatibility reports**: every official npm dist-tag change triggers an auto-generated report (npm tags, 6-repo CI matrix, ecosystem health) — [example](https://github.com/zoahdev/dsh-ecosystem/blob/main/docs/release-compat/0.1.0-rc.6.md)
- **Bug-to-tool pipeline**: every upstream bug I touch gets: root cause → patch branch → doctor check → troubleshooting doc
- **Docs ready on demand**: publish guide, troubleshooting, and registry specs are diff-ready for the official docs structure

## Recognition so far

- Listed on [awesome-dsh-plugin](https://github.com/awesome-dsh-plugin/awesome-dsh-plugin) (PR #492 merged)
- Marketplace listing PR open: [dsh-marketplace #3](https://github.com/ydhrdh/dsh-marketplace/pull/3)
- Cross-author collaboration: dsh-plugin-doctor ↔ moonquake2004/dsh-doctor contract alignment

## Honest numbers

- Repo stars: 0 (channels are set; external review/traffic pending)
- CI: 6 repos green (pack → fresh profile → real tool invocation → web boot → registry visibility)
- Verification-first, no fake claims, no engagement farming

## Contact

GitHub: [zoahdev](https://github.com/zoahdev) · engagement dossier:
[official-engagement.md](./official-engagement.md)
