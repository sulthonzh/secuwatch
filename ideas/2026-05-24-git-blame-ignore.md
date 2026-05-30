# git-blame-ignore — CLI to manage `.git-blame-ignore-revs`

**Date:** 2026-05-24
**Status:** ✅ BUILD CANDIDATE
**Score:** 27/35

---

## One-Liner

CLI that auto-detects bulk-change commits (prettier, lint autofix, mass renames) and manages your `.git-blame-ignore-revs` file — so `git blame` stays useful.

## Problem

After running prettier, eslint --fix, or mass renames, `git blame` becomes useless for affected files — every line shows the formatting commit instead of who actually wrote the code. Git has `.git-blame-ignore-revs` natively, GitHub supports it, but:

1. **Manual SHA hunting** — you have to find the commit SHA yourself
2. **No auto-detection** — nobody wants to scan git log for bulk commits
3. **File management is tedious** — add/remove/list entries manually
4. **Teams forget to update it** — new formatting commits go unignored

**Evidence:**
- Git docs explicitly document `--ignore-revs-file` and `blame.ignoreRevsFile` config
- GitHub natively reads `.git-blame-ignore-revs` from repo root
- Common advice in team onboarding: "add prettier commit to blame-ignore"
- Every project that adopts prettier mid-stream hits this problem

## Existing Solutions & Gaps

| Tool | Stars | What it does | Gap |
|------|-------|--------------|-----|
| `.git-blame-ignore-revs` (native) | Built-in | File format only | No management tooling |
| Manual workflow | — | `git log --oneline \| grep prettier` | Tedious, error-prone |
| GitHub docs | — | Recommend the file format | No auto-detection |

**No dedicated CLI tool exists.** Zero GitHub repos found for managing this file. The gap is 100% in the tooling layer.

## Our Angle

**Auto-detection + interactive management.** The killer feature isn't just editing a text file — it's *finding* which commits to ignore automatically:

1. **`scan`** — Analyzes git history for bulk-change commits by detecting:
   - Commits touching 20+ files with similar diff patterns
   - Commits with messages like "prettier", "format", "lint", "rename"
   - Commits where >80% of changes are whitespace-only
2. **`add <sha>`** — Adds entry with comment (commit message)
3. **`list`** — Shows entries with commit messages and dates
4. **`init`** — Interactive wizard: scan → select → write file
5. **`check`** — Validates entries (warns about SHAs not in history)

## Security Assessment

**Risk Level: LOW 🟢**

- **Attack surface:** Minimal. Reads git log, writes a text file. No network access.
- **Data handled:** Git commit SHAs and messages (already public in repo).
- **No secrets, no env vars, no API keys needed.**
- **No dependencies on external services.**
- **Supply chain:** Only dev dependencies (testing framework, build tools).

**Controls:**
- `.gitignore` includes `node_modules/`, `dist/`
- `.env.example`: Not needed (no env vars)
- CI: GitHub Actions for lint + test + publish
- No telemetry, no data collection

**Similar tool CVEs:** None applicable — git plumbing tools have minimal attack surface.

## Technical Design

### Architecture

```
git-blame-ignore/
├── src/
│   ├── cli.ts          # CLI entry (commander)
│   ├── scanner.ts      # Bulk-change commit detection
│   ├── file-manager.ts # .git-blame-ignore-revs CRUD
│   ├── analyzer.ts     # Commit diff analysis
│   └── types.ts        # TypeScript types
├── test/
│   └── *.test.ts
├── package.json
└── tsconfig.json
```

### CLI Interface

```bash
# Auto-detect bulk commits and interactively add them
npx git-blame-ignore init

# Scan without writing (dry run)
npx git-blame-ignore scan
# Output:
# 🔍 Found 3 bulk-change commits:
#   1. a1b2c3d — "Run prettier on all files" (47 files, 2,841 lines)
#   2. e4f5g6h — "eslint --fix" (23 files, 156 lines)
#   3. i7j8k9l — "Rename: src/lib → src/utils" (31 files, 0 content changes)

# Add specific commit
npx git-blame-ignore add a1b2c3d

# List current entries
npx git-blame-ignore list
# Output:
# 📋 .git-blame-ignore-revs (3 entries):
#   a1b2c3d — Run prettier on all files (2026-05-20)
#   e4f5g6h — eslint --fix (2026-05-21)
#   i7j8k9l — Rename: src/lib → src/utils (2026-05-22)

# Validate entries
npx git-blame-ignore check
# Output:
# ✅ All 3 entries are valid commits in this repository

# Remove entry
npx git-blame-ignore remove a1b2c3d
```

### Detection Algorithm

```typescript
interface BulkCommit {
  sha: string;
  message: string;
  filesChanged: number;
  linesChanged: number;
  whitespaceRatio: number; // 0-1, ratio of whitespace-only changes
  bulkScore: number; // 0-100, confidence it's a bulk change
}

// Scoring:
// - 20+ files changed: +30 points
// - 50+ files changed: +50 points
// - Message matches /format|prettier|lint|rename|refactor/i: +20 points
// - Whitespace ratio > 0.8: +20 points
// - Similar diff across files: +10 points
// Threshold: score >= 40 → suggest for ignoring
```

### Dependencies

- `commander` — CLI framework
- `simple-git` — Git operations (type-safe wrapper)
- `prompts` — Interactive selection (or inquirer)
- `chalk` — Terminal colors

### File Format

The tool manages the standard `.git-blame-ignore-revs` format:
```
# a1b2c3d4 Run prettier on all files (auto-detected by git-blame-ignore)
a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0

# e4f5g6h7 eslint --fix (auto-detected by git-blame-ignore)
e4f5g6h7i8j9k0l1m2n3o4p5q6r7s8t9u0v1w2x3
```

Comments are preserved and managed by the tool.

## Competition Matrix

| Feature | Manual workflow | git-blame-ignore (ours) |
|---------|----------------|------------------------|
| Auto-detect bulk commits | ❌ | ✅ Heuristic scoring |
| Interactive selection | ❌ | ✅ `init` wizard |
| List with context | ❌ | ✅ SHA + message + date |
| Validate entries | ❌ | ✅ `check` command |
| Preserve comments | Manual | ✅ Auto-managed |
| GitHub-compatible format | ✅ | ✅ |
| Zero-config | N/A | ✅ Just `npx git-blame-ignore init` |

## Build Estimate

| Phase | Days | Notes |
|-------|------|-------|
| Core scanner + file manager | 2 | Git log parsing, scoring algorithm |
| CLI interface (init/scan/add/list) | 1 | Commander setup |
| Interactive prompts | 1 | `init` wizard |
| Tests + docs | 1 | README with GIF demo |
| **Total** | **5 days** | |

## Score Card

| Criteria | Score | Notes |
|----------|-------|-------|
| Problem Clarity | 4/5 | Well-defined pain, git docs recommend the feature |
| Demand Evidence | 3/5 | Real pain but infrequent (per-project setup). GitHub docs validate. |
| Competition | 5/5 | Zero dedicated tools. Complete gap. |
| Differentiation | 4/5 | Auto-detection of bulk commits is unique |
| Build Feasibility | 5/5 | Simple git operations, 5-day build |
| Standalone Value | 3/5 | Useful but one-time setup per project |
| Security | 5/5 | Minimal attack surface, no network, no secrets |
| **TOTAL** | **27/35** | ✅ BUILD |

## Next Steps

1. Build MVP: `init`, `scan`, `add`, `list`, `remove`, `check`
2. Focus on detection algorithm quality (avoid false positives)
3. README with before/after `git blame` comparison
4. Publish as `git-blame-ignore` on npm
