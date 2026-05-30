# Code Review: stakpak/agent
_Date: 2026-05-24 | Reviewer: sulthonzh_

## Repo Stats
- Stars: 1554 | Language: Rust | License: Apache-2.0
- Community: Active (last push May 20, 2026), 151 forks, 33 open issues
- Last commit: 2026-05-20

## Review Findings

### 🔒 Security
- **API key leaked in error log** — `authenticate_with_browser_redirect()` includes full key value in error message when format validation fails. Any error tracking system receives plaintext credentials.
- **Local callback server has no CSRF protection** — Accepts POST from any origin with `Access-Control-Allow-Origin: *`. A malicious webpage could inject an attacker-controlled API key during the auth flow.
- **Config file handling is GOOD** — Uses atomic write (temp + rename), sets 0600 permissions on Unix. Proper credential storage practice.
- **SQLite queries use parameterized statements** — All DB queries use `?` placeholders via libsql. No SQL injection risk.
- **Known issue #282** — TUI doesn't redact pasted password (already reported).

### 🐛 Bugs
- None found beyond security issues above.

### ⚡ Performance
- `listen_for_callback` polls every 2 seconds with a new TLS client each iteration. Could reuse the client, but low priority.
- SQLite busy timeout is properly configured with good concurrent write handling (verified by tests).

### 📐 Architecture
- Well-structured modular codebase with clear separation (commands/, config/, utils/, onboarding/).
- Good use of Rust's type system for run statuses and error handling.
- OAuth flow is properly abstracted with `LocalOAuthCallbackListener` for provider-agnostic auth.
- Test coverage is solid for the DB layer and auth modules.

## Issues Filed
| # | Title | Category | Priority |
|---|-------|----------|----------|
| #744 | API key leaked in error log when browser redirect auth receives invalid format | 🔒 Security | Medium |
| #745 | Local callback server accepts API key from any origin (no CSRF protection) | 🔒 Security | Medium |

## Overall Assessment
- Code quality: 8/10 — Clean, well-organized Rust code with good error handling
- Security posture: 6/10 — Config file storage is good, but auth callback flow has CSRF and credential leakage issues
- Test coverage: 7/10 — Good coverage on DB and auth, especially concurrent write tests
- Documentation: 7/10 — CONTRIBUTING.md, GETTING-STARTED.md, good module docs
- Community health: 8/10 — Active, responsive, Hacktoberfest-friendly
- Recommendation: **continue reviewing** — interested in their response to security issues, may submit PRs

## Follow-up
- [ ] Monitor issue #744 and #745 responses
- [ ] Submit PR for API key redaction in error logs (straightforward fix)
- [ ] Consider reviewing the TUI module (issue #282 area)
- [ ] Review again in 2 weeks
