# Build Tracker

| Project | Status | Score | Source | GitHub | npm | Notes |
|---------|--------|-------|--------|--------|-----|-------|
| npm-outdated-check | ✅ PUBLISHED | 44/35 | idea-queue.md Round 11 | https://github.com/sulthonzh/npm-outdated-check | npm.im/npm-outdated-check | Published to npm @ 1.0.0 |
| worktree-manager | ✅ PUBLISHED | 39/35 | idea-queue.md Round 7 | https://github.com/sulthonzh/worktree-manager | npm.im/worktree-manager | Published to npm @ 1.0.0 |
| dockervis | ✅ PUBLISHED | 33/35 | idea-queue.md Round 7 | https://github.com/sulthonzh/dockervis | npm.im/@sulthonzh/dockervis | Published to npm @ 1.0.0 (scoped due to name conflict) |
| dotenv-schema | ✅ PUBLISHED | 29/35 | idea-queue.md Round 8 | https://github.com/sulthonzh/dotenv-schema | npm.im/@sulthonzh/dotenv-schema | Published to npm @ 1.0.0 |
| git-ignore-gen | ✅ PUBLISHED | 42/35 | idea-queue.md Round 13 | https://github.com/sulthonzh/git-ignore-gen | npm.im/git-ignore-gen | Published to npm @ 1.0.0 |
| git-conflicts | ✅ PUBLISHED | 28/35 | idea-queue.md Round 12 | https://github.com/sulthonzh/git-conflicts | npm.im/@sulthonzh/git-conflicts | Published to npm @ 1.0.0 |
| git-blame-ignore | ✅ PUBLISHED | 10/10 | Incomplete build | https://github.com/sulthonzh/git-blame-ignore | npm.im/git-blame-ignore | CLI that auto-detects bulk-change commits and manages .git-blame-ignore-revs file. 8 tests passing. Fixed TypeScript compilation errors and Jest configuration. Published to GitHub + npm @ 1.0.0 |
| branchcleanup | ✅ PUBLISHED | 27/35 | NEXT_BUILD.md #1 | https://github.com/sulthonzh/branchcleanup | npm.im/branchcleanup | Smart git branch cleanup with squash detection + interactive deletion. 7 tests passing. Fixed TypeScript any type warning. Published to GitHub + npm @ 1.0.1 |
| cmdseek | ✅ PUBLISHED | 27/30 | NEXT_BUILD.md #2 | https://github.com/sulthonzh/cmdseek | npm.im/cmdseek | Published to npm @ 1.0.0 |

## Last Build: 2026-05-28 13:42 WIB
- **git-blame-ignore** — Fixed TypeScript compilation errors (fixed unknown type error and unused variables). 8 tests, all passing. Linting passed with warnings. Published to GitHub + npm @ 1.0.0. Fixed Jest configuration to find tests in test/ directory.
- **dockervis** — Fixed TypeScript compilation errors and Jest configuration. 18 tests, all passing. Linting passed with warnings. Published to GitHub + npm @ 1.0.0. Fixed DockerManager class inheritance and type mismatches.
- **branchcleanup** — Built from NEXT_BUILD.md #1 priority. Smart git branch cleanup CLI that detects squash-merged branches with interactive deletion. 7 tests, all passing. Linting passed with warnings. Published to GitHub + npm @ 1.0.0.
- **cmdseek** — Built from NEXT_BUILD.md #2 priority. 100+ commands, fuzzy search, context-aware, usage learning. 21 tests, all passing. Published to GitHub + npm.

## Lessons Learned
- **dockervis npm E404**: Project had a local `.npmrc` with `${NPM_TOKEN}` env var that wasn't set, overriding the global `~/.npmrc` with the real token. Deleting the local `.npmrc` fixed it. Lesson: never put `NPM_TOKEN` in local .npmrc for dev machines — only for CI.
- **Test compilation**: tsconfig for tests needs `rootDir: "."` and include both `tests` and `src` to avoid rootDir errors when importing from `../src/`.

## Priority Queue (based on score)
1. npm-outdated-check (44/35) - ✅ PUBLISHED
2. git-ignore-gen (42/35) - ✅ PUBLISHED
3. worktree-manager (39/35) - ✅ PUBLISHED
4. dockervis (33/35) - ✅ PUBLISHED
5. branchcleanup (27/35) - ✅ PUBLISHED
6. dotenv-schema (29/35) - ✅ PUBLISHED
7. git-conflicts (28/35) - ✅ PUBLISHED
8. cmdseek (27/30) - ✅ PUBLISHED
