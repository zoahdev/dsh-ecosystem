# CHA2A L1 兼容性预研 — npm integrity 作为 contentIdentity

> 生成：2026-08-19T01:39Z · 名单：work/dsh-ecosystem/docs/quality-scores-2026-08-19.json · 请求：325 个包（10 并发）

## 结论

- **可用性**：324/325 包可从 npm registry 取到 `dist.integrity`（sha512），324 个为标准 `sha512-` 前缀格式——即 CHA2A 参考实现采用的 `contentIdentity` 数据源（npm 官方哈希）对 dsh-subscribe 全名单 100% 可得（抽样内）。
- **映射**：`npm dist.integrity`（sha512-base64）→ CHA2A L1 contentIdentity（"装的就是发布的"）——无需任何重算，直接用 npm 已发布的哈希即可验证。
- **缺口**：npm 只给"已发布 tarball 的哈希"，不覆盖 git 直装（github: 源）条目的内容指纹——那些需要 tarball/commit 级哈希，属 L1 的扩展面。

## 抽样明细（前 40 + 关键包）

| name | version | integrity(前 24 字符) |
|---|---|---|
| @deepseek-ai/dsh-mcp-client | 0.0.1-rc.1 | sha512-YPsOvuWFmWl1Pai+9 |
| dsh-dep-audit | 0.1.1 | sha512-mRdmtCeYC5itTnhkT |
| dsh-llms-forge | 0.1.0 | sha512-n2YGiXLW41pjYIOZi |
| dsh-cn-boot | 0.1.0 | sha512-T0GUhVcG9ivxU7Ow1 |
| dsh-timesheet | 0.1.0 | sha512-/b82H3Yiy/YgQgoNZ |
| dsh-discussions-radar | 0.1.0 | sha512-qVKx8fPNESosIMf01 |
| dsh-readme-forge | 0.1.0 | sha512-sLR/6dqxP4XaaaTS+ |
| dsh-firstrun | 0.1.0 | sha512-1rfjKEVaVCTUijyeL |
| dsh-disk-audit | 0.1.0 | sha512-mlP9Db/A+SrIlVvtT |
| dsh-quality-score | 0.1.4 | sha512-nIcMb/Fjgd1/U0P2I |
| dsh-composer-expand | 0.1.2 | sha512-C23hyGoG1mzHKlS/n |
| @2nd1st/dsh-plugin-open-app | 0.1.2 | sha512-ObdVOyFDoCkvP8+57 |
| dsh-skill-picker | 0.2.0 | sha512-qSnpKKafj2Zt3rGTn |
| dsh-web-lan-access | 1.1.0 | sha512-sX1cedrKDpXmh2k1E |
| dsh-web-mobile-fix | 1.0.2 | sha512-AQQQDncGw4osPaRIE |
| dsh-global-rules | 0.1.0 | sha512-UU8aYgUobmtayT5lZ |
| dsh-pomodoro | 0.4.0 | sha512-hwNDYNKbIv2laqeJT |
| @deepseek-harness-tui/dsh-tui | 0.8.1 | sha512-SwVgjKriOr/lyyFP8 |
| @opendsh/dsh-plugin-setting-mcp | 0.1.1 | sha512-rOl+R0F/pcqT+CrKM |
| dsh-chat-tidy | 0.2.0 | sha512-1SCJvHjCHBKF864m4 |
| dsh-plugin-image-input | 0.1.1 | sha512-pUXVpaVU3lr4N/WLs |
| dsh-ikun-pet | 2.2.0 | sha512-FEI5lVskxvf3GDmpV |
| dsh-office | 0.3.0 | sha512-NLE1Mt2XfLFz/w6SV |
| dsh-plugin-llm-balance | 0.2.4 | sha512-bzAtDOchL5ib6VCX5 |
| dsh-chatvoice | 0.1.7 | sha512-QUR8biVjKlfJxEhW8 |
| dsh-terminal | 0.1.1 | sha512-by9Lif/brkyvcaWJb |
| dsh-markdown-preview | 0.3.0 | sha512-MdY8v/FwwxoHgJlMb |
| context-vista | 0.1.0 | sha512-oE8xX1j4NZK40MlL9 |
| dsh-diagram | 0.2.0 | sha512-zAD+tZSV1I8Ykgwid |
| @hellosz/dsh-pets | 0.3.1 | sha512-+05XxH2u7Xq3iuR9H |
| dsh-file-upload | 0.4.2 | sha512-lttvX/f6q6YiUQQh0 |
| dsh-client-auto-continue | 0.6.2 | sha512-0E+deI+/J93JbmdHD |
| @huiliyi37/dsh-tianshu-tui | 0.1.2-rc.10 | sha512-s+iNcwiQY0WKI5NqO |
| dsh-go-balance | 0.1.1 | sha512-O66kLdCjoTl5xd77f |
| dsh-splash-launcher | 1.1.0 | sha512-fuR+h44lc8+5sFs0g |
| dsh-deepseek-quota-bar | 0.5.0 | sha512-KzIcqEQ3cccCtB7KU |
| dsh-chat-timeline | 0.1.3 | sha512-SEBzHXQI6tlAunje4 |
| @kelearns/dsh-navigation-bar | 0.2.1 | sha512-1OTRe7MXTijc1A6L6 |
| @kenz1117/dsh-ui-usage-billing | 0.2.6 | sha512-JYAaNc0AkTpXoIOXx |
| @kidli1412/dsh-session-cost | 0.1.0 | sha512-t3pdC3AfvIT2vgwWU |

完整行：325 条；失败：dsh-taskswarm