# Code Review: openreplay/openreplay
_Date: 2026-05-24 | Reviewer: sulthonzh_

## Repo Stats
- Stars: 12,048 | Language: TypeScript/Python/Go | License: ELv2 (Elastic License)
- Community: Active — last push 2026-05-23, responsive maintainers, 160 open issues
- Last commit: 2026-05-23

## Review Scope
Focused on authentication/authorization layer and security-critical paths:
- JWT authentication (auth_jwt.py, authorizers.py)
- Password reset flow (reset_password.py)
- User management SQL queries (users.py)
- API entry points (app.py, routers/)
- Database connection handling (pg_client.py)

## Review Findings

### 🔒 Security
- **Log injection in password reset** (MEDIUM): User-controlled email logged unsanitized in `reset_password.py:16`, enabling log injection via newline characters in email field. Could be used to mask real attacks or trigger false alerts.
- **Excessive JWT leeway** (MEDIUM): `JWT_LEEWAY_DAYS` defaults to 3 days in refresh flow, effectively extending access token lifetime by 3 days past configured expiration. Compromised tokens remain usable far longer than intended.
- Auth layer overall is solid — proper JWT signature verification, audience validation (front vs spot tokens), parameterized SQL queries via psycopg2 mogrify, bcrypt password hashing.

### 🐛 Bugs
- **Typo in spot refresh log** (LOW): `auth_jwt.py:116` logs "soptRefreshToken" instead of "spotRefreshToken", hampering debugging of Spot cobrowsing auth issues.

### ⚡ Performance
- Connection pool uses semaphores correctly with health checks
- GZip middleware enabled for responses >1KB
- No obvious N+1 query patterns in reviewed code

### 📐 Architecture
- Clean separation: auth layer → authorizers → JWT handling
- Pydantic schemas validate all API inputs before reaching SQL layer
- The `users.update()` dynamic SQL builder is fragile but currently safe due to schema validation on all callers
- Good use of f-string SQL with mogrify parameterization (not string interpolation)

### 🧪 Testing
- CI workflows present (codeql-analysis, frontend-tests, tracker-tests, ui-tests)
- Backend Python API appears to lack unit test coverage (no test directory found for API module)

## Issues Filed
| # | Title | Category | Priority |
|---|-------|----------|----------|
| #4647 | Log injection in password reset | 🔒 Security | Medium |
| #4648 | Typo in spot refresh token log message | 🐛 Bug | Low |
| #4649 | JWT refresh leeway default of 3 days | 🔒 Security | Medium |

## Overall Assessment
- Code quality: 7/10 — well-structured, but some security hygiene gaps
- Security posture: 6/10 — core auth is solid, but log injection and token lifecycle issues need attention
- Test coverage: 4/10 — frontend has tests, backend API lacks unit tests
- Documentation: 7/10 — good README, CONTRIBUTING.md, SECURITY.md present
- Community health: 8/10 — active, responsive, multiple language READMEs
- Recommendation: **One-time** — issues filed, monitor responses

## Follow-up
- [ ] Monitor issue responses from maintainers
- [ ] Submit PR for log injection fix if welcome
- [ ] Consider reviewing the Go backend (backend/) in a future cycle
