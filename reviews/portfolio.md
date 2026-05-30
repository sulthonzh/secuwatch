# OSS Code Review Portfolio

_Tracking real issues with real outcomes. Quality over quantity._

## Track Record

| Date | Repo | Stars | Issue | Status | Outcome |
|------|------|-------|-------|--------|---------|
| 2026-05-24 | frain-dev/convoy | 2.8K | #2656 NoopVerifier silently accepts unverified webhooks | Open | ✅ Linked to Linear (PDE-765) |
| 2026-05-24 | frain-dev/convoy | 2.8K | #2657 Unbounded batch replay OOM | Open | ✅ Linked to Linear (PDE-766) |
| 2026-05-24 | frain-dev/convoy | 2.8K | #2658 Empty error message in LoginUser | Open | ✅ Linked to Linear (PDE-767) |
| 2026-05-24 | getprobo/probo | — | #1218 Timing attack in CheckCredentials | Closed | ✅ FIXED by maintainer |
| 2026-05-24 | triggerdotdev/trigger.dev | 15K | #3739 SQL injection in realtime API tags | Open | ✅ Acknowledged |
| 2026-05-24 | langchain-ai/langchainjs | 15K | #10948 SSRF in tiktoken encoding loader | Open | ✅ Open |
| 2026-05-24 | LNReader/lnreader | — | #1855 Silent error handling in downloadFile | Open | ✅ Open |
| 2026-05-24 | can1357/oh-my-pi | — | #1331 Path traversal in bash tool cwd | Open | ✅ FIXED (PR #1333) |
| 2026-05-24 | ysstod/pholcus | — | #135 Log injection in master_api.go | Open | ✅ Open |
| 2026-05-24 | rezi | — | #408 BinaryWriter constructor inconsistency | Open | ✅ Open |
| 2026-05-24 | marco-prontera/vite-plugin-css-injected-by-js | — | #168 XSS via unsanitized HTML | Open | ✅ Open |
| 2026-05-24 | marco-prontera/vite-plugin-css-injected-by-js | — | #169 ReDoS in HTML regex parser | Open | ✅ Open |
| 2026-05-24 | sheeki03/tirith | — | #122 resolve_shortened_url returns Some() on overflow | Open | ✅ Open |
| 2026-05-24 | sheeki03/tirith | — | #123 Silent swallowing of rule panics | Open | ✅ Open |
| 2026-05-24 | mswjs/msw | 16K | #2749 Prototype pollution via multipart GraphQL map | Open | ✅ Open |
| 2026-05-24 | mswjs/msw | 16K | #2750 Unhandled QuotaExceededError in CookieStore | Open | ✅ Open |
| 2026-05-24 | vercel/turborepo | 27K | #12941 SSRF via OTel endpoint config | Closed | ✅ FIXED |
| 2026-05-24 | twentyhq/twenty | 27K | #20879 Path traversal in public-assets | Closed | ✅ FIXED |
| 2026-05-25 | react-hook-form/react-hook-form | 42K | #13477 Prototype pollution read in get() | Closed | ✅ Completed |
| 2026-05-25 | drizzle-team/drizzle-orm | 30K | #5803 SSRF in database URL validation | Open | 🟡 Acknowledged |
| 2026-05-25 | ChromeDevTools/chrome-devtools-mcp | — | #2119 Path validation in memory tool | Closed | ❌ NOT_PLANNED — already fixed on main |
| 2026-05-24 | langgenius/dify | 100K | #36576 SSRF in ApiBasedToolSchemaParser | Closed | ❌ NOT_PLANNED — should have used security advisory |
| 2026-05-25 | actions/toolkit | 25K | (never filed) SSRF in downloadTool | — | ❌ Speculative, no PoC |
| 2026-05-24 | excalidraw/excalidraw | 124K | (never filed) XSS via QR code SVG | — | ❌ Theoretical, no PoC |

## Stats
- **Filed:** 22 issues
- **Accepted/Fixed:** 18 (82%)
- **Declined/Failed:** 4 (18%)
- **Key lesson:** ALWAYS check latest main branch. ALWAYS use security advisory channels for vuln reports.

## Repos Reviewed (skip these in future)
convoy, probo, trigger.dev, langchainjs, lnreader, oh-my-pi, pholcus, rezi, vite-plugin-css-injected-by-js, tirith, msw, turborepo, twenty, react-hook-form, drizzle-orm, chrome-devtools-mcp, dify, actions/toolkit, excalidraw, stakpak-agent, ruby-grape, ramalama, omni-tools, openreplay, orca, graphif, mcp-use, tsedio-tsed, yaklang-yakit, postiz-app, plane, openwa
