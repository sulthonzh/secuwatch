# Code Review: yaklang/yakit
_Date: 2026-05-24 | Reviewer: sulthonzh_

## Repo Stats
- Stars: 7304 | Language: TypeScript (Electron) | License: AGPL-3.0
- Community: Active — issues responded to within days, regular commits (last push: 2026-05-22)
- Open issues: 140 (manageable, responsive maintainers)
- Forks: 805

## Review Findings

### 🔒 Security
- **CRITICAL: `rejectUnauthorized: false` in httpServer.js** — All outbound HTTPS requests from the Electron main process accept any TLS certificate. This enables MITM attacks that can intercept auth tokens, API keys, and scan data. In a security tool, this is especially damaging to user trust.
- **MEDIUM: gRPC TLS bypass via `checkServerIdentity` returning undefined** — The custom checkServerIdentity callback in ipc.js always returns success, bypassing server certificate validation for gRPC connections to the yak engine. Bearer tokens in gRPC metadata could be intercepted by a local attacker.
- **OBSERVATION: `validateOpenPath` in security.js** has no directory confinement — while it validates extensions and requires absolute paths, there's no check that the path is within an expected directory. Could be used to open sensitive system files.

### 🐛 Bugs
- **Race condition with global `cancelTokenSource`** — Module-level singleton means concurrent HTTP requests cancel each other. Any concurrent operation pattern (multiple scans, multi-tab usage) will cause random request failures.

### ⚡ Performance
- gRPC max message sizes set to 1GB (`1024 * 1024 * 1000`) — potential memory pressure / DoS vector for local yak engine communication. Acceptable for a local tool but worth noting.

### 📐 Architecture
- `security.js` is well-structured with clear validation functions and IPC sender verification. Good patterns.
- `httpServer.js` mixes concerns — HTTP client config, request interceptors, retry logic, and cancel token management are all in one file. Could benefit from separation.
- Error handling in request interceptor: `Promise.reject(error)` without `return` — error won't propagate correctly.

## Issues Filed
| # | Title | Category | Priority |
|---|-------|----------|----------|
| #3778 | TLS certificate verification disabled (rejectUnauthorized: false) | 🔒 Security | HIGH |
| #3779 | gRPC TLS bypass: checkServerIdentity always returns undefined | 🔒 Security | MEDIUM |
| #3780 | Race condition: global cancelTokenSource causes concurrent requests to cancel each other | 🐛 Bug | MEDIUM |

## Overall Assessment
- Code quality: 6/10 — decent structure, some sloppy patterns (global state, commented-out checks)
- Security posture: 4/10 — disabling TLS verification in a security tool is a serious concern
- Test coverage: ?/10 — didn't find test files for the reviewed modules
- Documentation: 5/10 — code has some Chinese comments, could benefit from more
- Community health: 7/10 — active, responsive, good issue templates
- Recommendation: **continue reviewing** — security improvements would have high impact

## Follow-up
- [ ] Monitor issue responses (especially #3778 — TLS issue)
- [ ] Submit PR for `rejectUnauthorized` fix if maintainers are receptive
- [ ] Review more modules (handlers/, utils/) in next cycle
- [ ] Check if gRPC security issue extends to yak engine itself
