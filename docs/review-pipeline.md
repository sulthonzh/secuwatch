# OSS Code Review Pipeline

## Purpose
Scan high-potential public GitHub repos → deep code review → create quality issues → build GitHub reputation.

## Status
🟢 ACTIVE

## Review Targets
| Repo | Stars | Language | Status | Issues Filed | Last Reviewed |
|------|-------|----------|--------|-------------|---------------|
| sheeki03/tirith | 2365 | Rust | ✅ Reviewed | 2 | 2026-05-24 |
| RtlZeroMemory/Rezi | 630 | TypeScript | ✅ Reviewed | 2 | 2026-05-24 |
| stakpak/agent | 1554 | Rust | ✅ Reviewed | 2 | 2026-05-24 |
| containers/ramalama | 2848 | Python | ✅ Reviewed | 3 | 2026-05-24 |
| iib0011/omni-tools | 9539 | TypeScript | ✅ Reviewed | 3 | 2026-05-24 |
| yaklang/yakit | 7304 | TypeScript | ✅ Reviewed | 3 | 2026-05-24 |
| getprobo/probo | 1089 | Go | ✅ Reviewed | 2 | 2026-05-24 |
| openreplay/openreplay | 12048 | TypeScript/Python | ✅ Reviewed | 3 | 2026-05-24 |
| mswjs/msw | 17936 | TypeScript | ✅ Reviewed | 2 | 2026-05-24 |
| frain-dev/convoy | 2804 | Go | ✅ Reviewed | 3 | 2026-05-24 |
| graphif/project-graph | 4090 | TypeScript + Rust | ✅ Reviewed | 3 | 2026-05-24 |
| stablyai/orca | 3152 | TypeScript | ✅ Reviewed | 2 | 2026-05-24 |
| mcp-use/mcp-use | 9992 | TypeScript | ✅ Reviewed | 3 | 2026-05-24 |
| ruby-grape/grape | 9986 | Ruby | ✅ Reviewed | 3 | 2026-05-24 |
| lnreader/lnreader | 2605 | TypeScript | ✅ Reviewed | 3 | 2026-05-24 |

## Criteria for Target Selection
- **Community Health**: Active maintainers, responsive to issues/PRs, welcoming CONTRIBUTING.md
- **Growth Potential**: Fast star growth, trending, recently featured
- **Tech Stack**: TypeScript, Python, Rust, Go preferred (languages we know)
- **Size**: Not too big (Linux kernel) — focus on mid-size repos where our review matters
- **Issue Quality**: We only file issues that add real value — no spam, no trivial nits

## Issue Quality Standards
1. MUST include: clear reproduction steps, expected vs actual behavior, code references
2. MUST include: suggested fix or approach
3. MUST be: respectful, constructive, well-formatted
4. NEVER: file trivial issues just for activity count
5. NEVER: file duplicate issues without checking existing ones first
6. Categories we focus on:
   - 🔒 Security vulnerabilities
   - 🐛 Real bugs with reproduction
   - ⚡ Performance improvements with benchmarks
   - 📐 Architecture/design improvements
   - ♿ Accessibility issues
   - 🧪 Missing test coverage for critical paths
   - 📖 Documentation gaps for critical features

## Metrics
- Total repos reviewed: 15
- Total issues filed: 39
- Issues accepted/closed by maintainers: 0
- Repos where we became contributors: 0

## Rules
- Max 3 issues per repo per week (don't spam)
- Only review repos with >100 stars AND <50k stars (sweet spot)
- Always check existing issues before filing
- Always be respectful in issue templates
- Focus on quality over quantity
