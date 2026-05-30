# Code Review: ruby-grape/grape
_Date: 2026-05-24 | Reviewer: sulthonzh_

## Repo Stats
- Stars: 9,986 | Language: Ruby | License: MIT
- Community: Mature, 250 open issues, recent commits (yesterday)
- Last commit: 2026-05-23 (yesterday)

## Review Findings

### 🔒 Security
1. **Type Coercion Error Leak** (Issue #2743)
   - Internal error messages exposed in validation responses
   - Leaks class names, schema details, library internals
   - Severity: low (information disclosure)

### 🐛 Bugs
1. **Auth Middleware Defensive Check** (Issue #2745)
   - No validation that `@auth_strategy` exists in `call!`
   - Silent failure when auth misconfigured
   - Severity: low (configuration error)

### 📐 Architecture
1. **Mass Assignment Protection** (Issue #2744)
   - No built-in protection against mass assignment attacks
   - Related to existing discussion in issue #2416
   - Severity: medium (data integrity risk)
   - Well-structured validation system
- Good DSL for API definition
- Mature project with solid foundations

## Issues Filed
| # | Title | Category | Priority |
|---|-------|----------|----------|
| 2743 | Type coercion validator leaks internal error messages | Security | low |
| 2745 | Auth middleware lacks defensive checks in call! | Bug | low |
| 2744 | Implement mass assignment protection | Architecture | medium |

## Overall Assessment
- Code quality: 7/10 - Clean Ruby, well-organized
- Security posture: 6/10 - Basic auth present, but lacks modern protections
- Test coverage: 7/10 - Good coverage, but could be more comprehensive
- Documentation: 8/10 - Good README and guides
- Community health: 6/10 - Some stale issues (from 2023), but recent activity
- Recommendation: **One-time review** - Mature project, less room for impactful findings

## Follow-up
- [ ] Monitor issue responses
- [ ] Submit PR if welcome
- [ ] Skip future reviews (mature, low-impact discoveries)