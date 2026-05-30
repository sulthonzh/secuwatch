# Code Review: graphif/project-graph
_Date: 2026-05-24 | Reviewer: sulthonzh_

## Repo Stats
- Stars: 4,090 | Language: TypeScript + Rust | License: None
- Community: Active (75 open issues, commit today)
- Last commit: 2026-05-24T02:05:10Z

## Review Findings

### 🔒 Security
- **CRITICAL**: Command injection in `app/src-tauri/src/cmd/shell.rs` — allows arbitrary command execution without validation
- **CRITICAL**: Path traversal in `app/src-tauri/src/cmd/fs.rs` — can read any file on system
- **HIGH**: YAML parsing DoS vulnerability in `app/src/utils/yaml.tsx` — no resource limits, vulnerable to exponential anchor attacks
- **MEDIUM**: No visible input validation on IPC commands from frontend
- **MEDIUM**: No license file — unclear usage terms

### 🐛 Bugs
- **LOW**: `externalOpen.tsx` error handling silences exceptions (catch with just console.error)
- **LOW**: Missing error handling in YAML parser for malformed input

### ⚡ Performance
- **MEDIUM**: `read_folder_structure()` recursively reads entire trees without pagination or depth limits
- **MEDIUM**: No debouncing/throttling on IPC command calls visible
- **LOW**: Large XML operations could be optimized (no lazy loading visible)

### 📐 Architecture
- **GOOD**: Clean separation between Tauri Rust backend and TypeScript frontend
- **GOOD**: Well-structured component hierarchy (renderers, controllers, entities)
- **CONCERN**: No visible test coverage for critical security paths
- **CONCERN**: Complex dependency graph (monorepo with multiple packages)

## Issues Filed
| # | Title | Category | Priority |
|---|-------|----------|----------|
| 718 | 🔒 CRITICAL: Command Injection Vulnerability in run_command() | Security | Critical |
| 719 | 🔒 CRITICAL: Path Traversal Vulnerability in fs.rs commands | Security | Critical |
| 720 | 🔒 HIGH: YAML Parsing Vulnerability - Potential DoS and XXE | Security | High |

## Overall Assessment
- Code quality: 6/10 (good structure, missing security controls)
- Security posture: 2/10 (multiple critical vulnerabilities, no validation)
- Test coverage: 3/10 (no visible tests for security-critical paths)
- Documentation: 7/10 (good inline comments, Chinese docs)
- Community health: 7/10 (active, responsive, but no license)
- Recommendation: **continue reviewing** — excellent project, needs security hardening

## Follow-up
- [x] File security issues
- [ ] Monitor issue responses (high priority)
- [ ] Offer to submit PRs for security fixes
- [ ] Suggest adding a LICENSE file
- [ ] Review again in 2 weeks after fixes

## Notes for Sulthon
This project is a sophisticated visual note-taking tool (Tauri + TypeScript + Rust). The architecture is well-designed, but there are CRITICAL security vulnerabilities that need immediate attention. These issues are particularly concerning because:
1. Tauri exposes these commands to the frontend
2. User can open arbitrary .prg files
3. No visible authentication or sandboxing

The maintainers are very active (commit today), so they should respond quickly. I'\''d recommend following up on these issues in 1-2 days.