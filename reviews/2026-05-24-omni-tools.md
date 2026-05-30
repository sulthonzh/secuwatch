# Code Review: iib0011/omni-tools
_Date: 2026-05-24 | Reviewer: sulthonzh_

## Repo Stats
- Stars: 9,539 | Language: TypeScript | License: MIT
- Community: Active, 90 open issues, responsive to feature requests
- Last commit: 2026-05-04

## Review Findings

### 🔒 Security
- **Password generator uses `Math.random()`** (MEDIUM/HIGH) — Not cryptographically secure. Predictable PRNG used for security-sensitive output. Users generating passwords through this tool get weaker passwords than expected.
- **ReDoS via unvalidated user regex** (MEDIUM) — List Shuffle tool passes user input directly to `new RegExp()` with no validation, enabling catastrophic backtracking.
- **Worker `getListener` has no timeout/rejection** (LOW) — GhostScript worker promises can hang forever if WASM crashes. Memory leak risk from terminated workers.

### 🐛 Bugs
- **JSON-to-XML stack overflow** — No recursion depth limit in `convertObjectToXml()`. Deeply nested JSON crashes with `RangeError`.
- **Invalid XML tag names** — JSON keys used directly as XML element names without sanitization. Keys with spaces, special chars, or starting with numbers produce malformed XML.

### ⚡ Performance
- No significant performance issues found. Tools process client-side (WASM/Web Workers) which is appropriate.

### 📐 Architecture
- Well-structured React app with consistent tool pattern (meta/types/service/index per tool).
- Emscripten Ghostscript WASM is appropriately isolated in workers.
- The `SplitOperatorType: 'regex'` pattern may be duplicated across multiple tools — worth auditing.

## Issues Filed
| # | Title | Category | Priority |
|---|-------|----------|----------|
| #376 | Password Generator uses cryptographically insecure Math.random() | 🔒 Security | Medium/High |
| #377 | ReDoS vulnerability in List Shuffle tool via unvalidated user regex | 🐛 Security/DoS | Medium |
| #378 | JSON-to-XML converter crashes on deeply nested JSON + invalid tag names | 🐛 Bug | Low/Medium |

## Overall Assessment
- Code quality: 7/10 — Clean structure, consistent patterns, good separation of concerns
- Security posture: 5/10 — Math.random for passwords is a significant miss; user-controlled regex without validation is concerning
- Test coverage: 4/10 — Only found one test file (merge-pdf/service.test.ts). Most tools have no tests.
- Documentation: 6/10 — Good README, but tools lack inline documentation for edge cases
- Community health: 8/10 — Active, responsive, welcoming to contributions
- Recommendation: **continue reviewing** — Large codebase with many tools, more issues likely. Worth a follow-up review focusing on other tool categories (image processing, video tools).

## Follow-up
- [ ] Monitor issue responses from maintainers
- [ ] Submit PR for Math.random → crypto.getRandomValues() fix if welcome
- [ ] Audit other tools using `SplitOperatorType: 'regex'` pattern
- [ ] Review image/video processing tools in next cycle (ffmpeg-based, potential for security issues)
- [ ] Check existing issue #301 (privacy: analytics on "nothing leaves your device" claim)
