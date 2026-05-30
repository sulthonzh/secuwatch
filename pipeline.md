# OSS Build Pipeline

## Project Status

| Project | Status | CI Status | GitHub | npm |
|---------|--------|-----------|--------|-----|
| dockervis | PUBLISHED | ✅ Passed | https://github.com/sulthonzh/dockervis | ⚠️ npm failed (404) |
| dotenv-schema | PUBLISHED | ✅ Passed (46 tests) | https://github.com/sulthonzh/dotenv-schema | - |
| git-conflicts | PUBLISHED | ✅ Passed (10 tests) | https://github.com/sulthonzh/git-conflicts | ✅ https://www.npmjs.com/package/@sulthonzh/git-conflicts |
| git-ignore-gen | BUILDING | - | - | - |
| gitpanic | PUBLISHED | ✅ Passed (21 tests) | https://github.com/sulthonzh/gitpanic | ✅ https://www.npmjs.com/package/gitpanic |
| logchef-zig | PUBLISHED | ✅ Passed | https://github.com/sulthonzh/logchef-zig | - |
| npm-outdated-check | PUBLISHED | ✅ Passed (9 tests) | https://github.com/sulthonzh/npm-outdated-check | ⚠️ npm failed (404) |
| worktree-manager | PUBLISHED | ✅ Passed (9 tests) | https://github.com/sulthonzh/worktree-manager | - |
| monorepo-switcher | PUBLISHED | ✅ Passed (24 tests) | https://github.com/sulthonzh/monorepo-switcher | ✅ https://www.npmjs.com/package/monorepo-switcher |

## Last Update
**2026-05-25 06:14 WIB**
- git-conflicts: Interactive CLI to list and resolve merge conflicts with progress tracking. CI passed (10 tests), lint clean, build successful. Features: conflict file listing, progress counter, validation before continuing. Published to GitHub + npm (@sulthonzh/git-conflicts).

## Build History
- 2026-05-25: git-conflicts (v1.0.0) - Merge conflict resolution CLI with progress tracking, validation, cross-platform support. CI passed (10 tests) → PUBLISHED
- 2026-05-25: monorepo-switcher (v1.0.0) - Fast workspace switching CLI with context awareness, fuzzy search, git integration. CI passed (24 tests) → PUBLISHED
- 2026-05-25: gitpanic (v1.0.0) - Fixed test imports (src → dist), fixed CLI (--version/--help flags), all 21 tests passing → Published to GitHub + npm
- 2026-05-25: dockervis (v1.0.0) - Updated .gitignore
- 2026-05-25: npm-outdated-check (v1.0.0) - Fixed eslint config and package.json exports
- 2026-05-25: worktree-manager (v1.0.0) - Added lint script
- 2026-05-25: dotenv-schema (v1.0.0) - Added lint script
- 2026-05-25: gitpanic (v1.0.0) - Added lint script, test hangs
- 2026-05-25: logchef-zig (v1.0.0) - Build + test passed