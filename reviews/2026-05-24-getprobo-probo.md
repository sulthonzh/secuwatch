# Code Review: getprobo/probo
_Date: 2026-05-24 | Reviewer: sulthonzh_

## Repo Stats
- Stars: 1089 | Language: Go + TypeScript | License: MIT
- Community: Active (last push hours ago), 71 open issues, good issue triage with labels
- Last commit: 2026-05-23

## Summary
Open-source compliance platform for SOC2, GDPR, ISO27001. Go backend + React/Relay frontend. Handles sensitive compliance data including access reviews, evidence collection, and document management. Security posture is generally strong — proper use of AES-256-GCM, PBKDF2 with 600k iterations, timing-aware design intent, and session management.

## Review Findings

### 🔒 Security
- **🔴 Timing attack in CheckCredentials**: The dummy hash comparison in `auth_service.go` uses a plain string that fails format validation immediately, making the timing mitigation ineffective. This enables user enumeration via response timing. (Filed #1218)
- **Overall crypto implementation is solid**: AES-256-GCM with proper nonce handling, PBKDF2-SHA256 with 600k min iterations + pepper + 32-byte salt, constant-time comparison
- **Good practices observed**: Email enumeration protection in password reset, magic link single-use (token deleted after use), sessions expired on password reset

### 🐛 Bugs
- **Hardcoded session duration in signup path**: `CreateIdentityWithPassword` uses `24*time.Hour*7` while all other session methods use configurable `s.sessionDuration`. (Filed #1219)

### ⚡ Performance
- No critical performance issues found in reviewed code paths
- PBKDF2 with 600k iterations is appropriate for security, though Argon2id would be more future-proof

### 📐 Architecture
- Well-structured monorepo: clean separation of `pkg/` (domain logic), `apps/` (frontend/console), `e2e/` (tests)
- Comprehensive cursor rules for Go conventions — shows engineering maturity
- OAuth2 server implementation with PKCE support
- Good error handling patterns (custom error types, no info leakage)

## Issues Filed
| # | Title | Category | Priority |
|---|-------|----------|----------|
| #1218 | Timing attack mitigation in CheckCredentials is ineffective | 🔒 Security | Medium |
| #1219 | CreateIdentityWithPassword uses hardcoded session duration | 🐛 Bug | Low |

## Overall Assessment
- Code quality: **8/10** — clean, well-structured, follows Go conventions
- Security posture: **7/10** — strong fundamentals, one real timing issue found
- Test coverage: **7/10** — test files present for most packages, e2e tests exist
- Documentation: **8/10** — good cursor rules, AGENTS.md, CONTRIBUTING.md, SECURITY.md
- Community health: **8/10** — active maintainers, labeled issues, welcoming

## Notable Positive Findings
- Proper use of `crypto/rand` for all cryptographic operations
- Pepper-based password hashing with HMAC application
- Stateless token design for invitations/password resets
- Row-level locking (`LoadByHashedValueForUpdate`) for magic link replay prevention
- Comprehensive access review driver ecosystem (30+ integrations)

## Follow-up
- [ ] Monitor issue responses
- [ ] Submit PR for #1218 if welcome (timing fix)
- [ ] Review again in 2 weeks — potential contributor relationship
