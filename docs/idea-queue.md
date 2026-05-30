# Open-Source Idea Queue

_Last updated: 2026-05-24 (Round 20 — screenshot-frame killed, trend mining)

## Research Queue

### Round 5: Trend-Mined Ideas (2026-05-24)
Generated from GitHub trending + HN analysis. Focus: underserved niches, TypeScript gaps, simple one-purpose tools.

- [x] **`pkgbench`** — Benchmark npm dependency startup/import time → **KILLED**: `time-require` from 2014 is only tool (dead), but zero demand for modern replacement. Trivially solved with `time node -e "require('x')"`.
- [x] **`gh-review-stats`** — CLI to analyze PR review patterns → **KILLED**: CLI is wrong format for review analytics (eng managers want dashboards). Max 6⭐ existing CLI tools = weak CLI demand. Easily replicated with `gh api` scripts.
- [x] **`gitpanic`** — Interactive CLI for recovering from common git mistakes → **BUILD CANDIDATE** ⭐ 28/35 — see ideas/2026-05-24-gitpanic.md
- [x] **`rupiah.js`** — TypeScript library for IDR/Rupiah → **KILLED**: 8+ existing rupiah formatting + 8+ terbilang libraries in JS/TS. No dominant player but no gap either.
- [x] **`worktree-manager`** — Git worktree management CLI (create, list, switch, clean). Wraps `git worktree` with better DX. → **BUILD CANDIDATE** ⭐ 39/35 — see ideas/2026-05-24-worktree-manager.md
- [x] **`jsonpipe`** — Streaming JSON CLI → **KILLED**: `jq --stream` handles this natively. Plus a "lightning-fast zero-dep" competitor exists. jq dominance is insurmountable.
- [x] **`envdoctor`** — Dev environment health check CLI → **KILLED**: zero GitHub results = zero demand. Each ecosystem has its own doctor (flutter doctor, nvm doctor).
- [x] **`dockervis`** — Terminal dashboard for Docker containers. Like `ctop` but TypeScript and maintained (ctop hasn't been updated since 2022). → **BUILD CANDIDATE** ⭐ 29/35 — see ideas/2026-05-24-dockervis.md

### Round 6: Trend-Mined Ideas (2026-05-24)
Generated from GitHub trending TypeScript + new CLI tools. Focus: git DX, env management, developer productivity.

- [x] **`branchcleanup`** — Smart git branch cleanup CLI → **BUILD CANDIDATE** ⭐ 24/35 — see ideas/2026-05-24-branchcleanup.md
- [x] **`envcheck`** — Zero-config CLI that validates `.env` files against `.env.example` → **KILLED**: 10+ existing tools on GitHub all doing .env vs .env.example validation (zero-dep, WASM, Go, CI-friendly variants). Ultra-saturated.
- [x] **`lockdiff`** — Human-friendly lockfile diff CLI → **KILLED**: 3 small existing tools, low-frequency problem, GitHub native dependency review + `npm diff` (v7+) eating the space.
- [x] **`screenshot-frame`** — CLI to frame screenshots in device mockups → **KILLED**: appshot (v2.0 CLI, MCP, `frame` subcommand) covers CLI niche. See ideas/2026-05-24-screenshot-frame.md.
- [x] **`depcheck-lite`** — Find unused npm dependencies, lightweight alt to depcheck → **KILLED**: depcheck officially unmaintained BUT knip (11,308⭐, actively maintained May 2026) is the definitive successor. Does unused files + dependencies + exports. No gap.
- [x] **`depdrift`** — Detect dependency version drift across monorepo workspaces. Shows which packages are at different versions and suggests alignment. Complements `manypkg` → **BUILD CANDIDATE** ⭐ 26/35 — see ideas/2026-05-24-depdrift.md

### Round 7: Gap-Analysis Ideas (2026-05-24)
Generated from patterns observed across 35 researched ideas. Focus: underserved niches with <3 existing tools.

- [x] **`screenshot-frame`** — CLI to frame screenshots in device mockups → **KILLED**: appshot (v2.0 CLI) covers CLI niche. See ideas/2026-05-24-screenshot-frame.md.
- [x] **`branchcleanup`** — Smart git branch cleanup CLI. Detects merged, squashed, and stale branches (local + remote). Offers batch deletion with confirmation. Better UX than `git branch --merged | xargs git branch -d`. → **BUILD CANDIDATE** ⭐ 27/35 — see ideas/2026-05-24-branchcleanup.md
- [x] **`worktree-manager`** — Git worktree management CLI (create, list, switch, clean). Wraps `git worktree` with better DX. → **BUILD CANDIDATE** ⭐ 39/35 — see ideas/2026-05-24-worktree-manager.md
- [x] **`dockervis`** — Terminal dashboard for Docker containers. Like `ctop` but TypeScript and maintained (ctop hasn't't been updated since 2022). → **BUILD CANDIDATE** ⭐ 26/35 — see ideas/2026-05-24-dockervis.md
- [x] **`jsonfix`** — CLI to auto-fix common JSON errors → **KILLED**: `josdejong/jsonrepair` (2,339⭐, TypeScript) covers everything.
- [x] **`cliphist`** — Clipboard history CLI with fuzzy search. Lightweight daemon + CLI. Works on macOS/Linux. No electron dependency. → **KILLED**: cliphist (Go, 11+ ecosystem projects) already exists and dominates Wayland clipboard history space. Tool is mature, well-maintained, and has full integration with system pickers (rofi, dmenu, wofi). No gap for TypeScript alternative - incumbent covers the problem completely.
- [x] **`readme-shot`** — Generate social preview image from README.md. OG image for GitHub repos. CLI, zero-config. → **KILLED**: readme-SVG/github-social-preview-generator (Client-side, 1280×640, GitHub API, multiple themes) + zircote/github-social (Claude Code plugin, DALL-E integration) + Flyyer ecosystem already dominate this space. No gap for new CLI tool - incumbents cover zero-config, CLI, and advanced features.

### Round 8: Trend-Mined Ideas (2026-05-24)
Generated from GitHub trending TypeScript weekly + gap analysis. Focus: underserved dev-experience niches.

- [x] **`gh-stale`** — CLI to find and close stale GitHub issues/PRs → **KILLED**: Zero GitHub results for stale CLI cleanup = zero demand. Problem solvable with `gh api` one-liners. People who care already use actions/stale (GitHub Action).
- [x] **`dotenv-schema`** — Define .env variable schema with types, required/optional, defaults, and descriptions. Generates .env.example, validates at runtime. Unlike envcheck (killed — pure validation), this is a SCHEMA definition tool that GENERATES validation code. → **BUILD CANDIDATE** ⭐ 29/35 — see ideas/2026-05-24-dotenv-schema.md
- [x] **`git-ignore-gen`** — Interactive CLI to create .gitignore files. Different from github/gitignore (killed — template repo) because it SCANS your project for untracked files and SUGGESTS ignore patterns. Learns from what's in .git status. → **BUILD CANDIDATE** ⭐ 28/35 — see ideas/2026-05-24-git-ignore-gen.md
- [x] **`cliphist`** — Clipboard history CLI with fuzzy search. Lightweight daemon + CLI. Works on macOS/Linux. No electron dependency. → **BUILD CANDIDATE** ⭐ 24/35 — see ideas/2026-05-24-cliphist.md
- [x] **`depcheck-lite`** — Find unused npm dependencies. Lightweight alternative to `depcheck` (8k⭐, last meaningful update 2022, complex config). Zero-config, fast, focuses on simple import scanning. → **KILLED**: knip (11,309⭐, actively maintained) completely fills this gap with comprehensive features and is the recommended replacement. No room for "lite" version when full-featured tool dominates.

### Previously Researched

#### Round 1: Developer Tools
- [x] AI-powered README generator → **KILLED**: saturated (readme-ai 2.9k⭐, readme-md-gen 11k⭐)
- [x] Smart .gitignore generator → **KILLED**: ultra-saturated (github/gitignore 174k⭐)
- [x] CLI tool for managing multiple AI API keys → **KILLED**: subset of secret managers
- [x] Local-first Markdown note-taking CLI with AI search → **KILLED**: nb (8.1k⭐), iwe (1k⭐)
- [x] TypeScript utility library for WhatsApp Business API → **KILLED**: official Meta SDK (270⭐)
- [x] Git hook toolkit — pre-commit AI code review → **KILLED**: promptfoo (21.5k⭐)
- [x] API mock server generator from OpenAPI spec → **KILLED**: Prism, WireMock
- [x] Environment variable manager with encryption → **KILLED**: Doppler, Infisical
- [x] Markdown-to-Notion sync tool → **KILLED**: SyncNos, notion-jam
- [x] CLI tool to generate project scaffolds from templates → **KILLED**: Yeoman, Plop

#### Round 2: Indonesian Developer Tools
- [x] IDX stock data CLI → **BUILD CANDIDATE** ⭐ 22/30 — see ideas/2026-05-24-sahamcli.md
- [x] Indonesian address validator/normalizer → **KILLED**: zero existing tools = zero demand signal
- [x] Bahasa Indonesia NLP utility library → **KILLED**: NLP_bahasa_resources (572⭐ resource list), nalapa (33⭐). Existing coverage.
- [x] Indonesian payment gateway abstraction layer → **KILLED**: official SDKs (Xendit 149⭐, Midtrans). Only 1 community attempt (1⭐).
- [x] WhatsApp message template builder CLI → **KILLED**: zero existing tools = zero demand signal

#### Round 3: AI/ML Tools
- [x] Prompt testing framework → **KILLED**: promptfoo (21.5k⭐), deepeval (15.6k⭐), DSPy (34.6k⭐)
- [x] AI model cost calculator & comparator → **KILLED**: too niche (max 2⭐). Not enough demand.
- [x] Local AI agent framework (runs on Ollama) → **KILLED**: LangChain/AutoGen/CrewAI dominate. Monan SDK (47⭐).
- [x] RAG pipeline builder CLI → **KILLED**: too complex for 5-10 day MVP. LangChain dominates.
- [x] AI function calling validator → **KILLED**: zero existing tools = zero demand signal. Too niche.

#### Round 4: Productivity
- [x] Time tracker CLI with AI categorization → **KILLED**: timetrap, watson, tik. Saturated.
- [x] Bookmark manager with auto-tagging → **KILLED**: buku (5.7k⭐), linkding, few 0⭐ CLI attempts.
- [x] Meeting notes to action items converter → **KILLED**: too niche, 0⭐ tools only.
- [x] RSS feed aggregator with AI summaries → **KILLED**: many 0⭐ attempts, too niche.
- [x] Habit tracker CLI with streak analytics → **KILLED**: many 0⭐ clones, no market.

#### Round 5 Supplementary (Killed this cycle)
- [x] MCP server config manager CLI → **KILLED**: 8+ existing tools (mcpman, agent-skills, etc). Heavily saturated.
- [x] NIK/KTP parser for TypeScript → **KILLED**: 4 existing tools including a TS zero-dep one. Low demand signal.

## Completed Research

| # | Date | Idea | Score | Status |
|---|------|------|-------|--------|
| 1 | 2026-05-24 | AI README generator | - | ❌ Killed — saturated market |
| 2 | 2026-05-24 | Smart .gitignore generator | - | ❌ Killed — ultra-saturated |
| 3 | 2026-05-24 | AI API key manager | - | ❌ Killed — subset of secret managers |
| 4 | 2026-05-24 | Markdown notes CLI | - | ❌ Killed — nb (8.1k⭐) dominates |
| 5 | 2026-05-24 | WhatsApp Business API TS | - | ❌ Killed — official Meta SDK exists |
| 6 | 2026-05-24 | Git hook AI code review | - | ❌ Killed — promptfoo dominates |
| 7 | 2026-05-24 | OpenAPI mock server | - | ❌ Killed — Prism/WireMock dominate |
| 8 | 2026-05-24 | Env variable manager | - | ❌ Killed — Doppler/Infisical dominate |
| 9 | 2026-05-24 | Markdown-to-Notion sync | - | ❌ Killed — SyncNos covers it |
| 10 | 2026-05-24 | Project scaffold generator | - | ❌ Killed — Yeoman/Plop/Cookiecutter |
| 11 | 2026-05-24 | Prompt testing framework | - | ❌ Killed — promptfoo/deepeval/DSPy |
| 12 | 2026-05-24 | IDX stock data CLI (sahamcli) | **22/30** | ✅ **BUILD** |
| 13 | 2026-05-24 | ID address validator | - | ❌ Killed — zero demand signal |
| 14 | 2026-05-24 | Bahasa NLP library | - | ❌ Killed — existing coverage |
| 15 | 2026-05-24 | Payment gateway abstraction | - | ❌ Killed — official SDKs exist |
| 16 | 2026-05-24 | WA template builder | - | ❌ Killed — zero demand signal |
| 17 | 2026-05-24 | AI model cost calculator | - | ❌ Killed — too niche |
| 18 | 2026-05-24 | Local AI agent framework | - | ❌ Killed — LangChain dominates |
| 19 | 2026-05-24 | RAG pipeline CLI | - | ❌ Killed — too complex for MVP |
| 20 | 2026-05-24 | Function calling validator | - | ❌ Killed — zero demand signal |
| 21 | 2026-05-24 | Time tracker CLI | - | ❌ Killed — saturated |
| 22 | 2026-05-24 | Bookmark manager CLI | - | ❌ Killed — buku (5.7k⭐) |
| 23 | 2026-05-24 | Meeting notes converter | - | ❌ Killed — too niche |
| 24 | 2026-05-24 | RSS AI summary | - | ❌ Killed — too niche |
| 25 | 2026-05-24 | Habit tracker CLI | - | ❌ Killed — many 0⭐ clones |
| 26 | 2026-05-24 | MCP config manager | - | ❌ Killed — 8+ existing tools |
| 27 | 2026-05-24 | NIK/KTP parser | - | ❌ Killed — 4 existing tools, low demand |
| 28 | 2026-05-24 | rupiah.js | - | ❌ Killed — 8+ rupiah + 8+ terbilang libs, no gap |
| 29 | 2026-05-24 | jsonpipe | - | ❌ Killed — jq --stream dominates, no gap |
| 30 | 2026-05-24 | envdoctor | - | ❌ Killed — zero demand, ecosystem-specific doctors exist |
| 31 | 2026-05-24 | pkgbench | - | ❌ Killed — zero demand for modern replacement, trivially solved |
| 32 | 2026-05-24 | gitpanic (git recovery wizard) | **28/35** | ✅ **BUILD** |
| 33 | 2026-05-24 | gh-review-stats (PR review analytics) | **18/35** | ❌ Killed — wrong format (CLI) for dashboard problem, weak demand signal |
| 34 | 2026-05-24 | envcheck (.env validation) | - | ❌ Killed — 10+ existing tools, ultra-saturated |
| 35 | 2026-05-24 | lockdiff (lockfile diff) | - | ❌ Killed — 3 small tools, low-frequency, GitHub native coverage |
| 36 | 2026-05-24 | jsonfix (JSON auto-repair CLI) | - | ❌ Killed — jsonrepair (2,339⭐) covers everything |
| 37 | 2026-05-24 | branchcleanup (git branch cleanup) | **24/35** | ✅ **BUILD** |
| 38 | 2026-05-24 | depcheck-lite (unused deps finder) | - | ❌ Killed — knip (11,308⭐) is definitive successor, no gap |
| 39 | 2026-05-24 | gh-stale (stale issue cleanup CLI) | - | ❌ Killed — zero demand, solvable with gh api one-liners |
| 40 | 2026-05-24 | license-check (dependency license audit CLI) | **14/35** | ❌ Killed — @brainhubeu/lac is maintained successor, no gap |
| 46 | 2026-05-24 | dotenv-lint (.env file linter) | - | ❌ Killed — Rust dotenv-linter (1.7k⭐) covers gap, 2+ TS tools exist |
| 47 | 2026-05-24 | git-standup (standup report from git) | - | ❌ Killed — nilbuild/git-standup 7,836⭐, transferred & maintained |
| 48 | 2026-05-24 | git-context (git project dashboard) | - | ❌ Killed — onefetch 11,808⭐ + git-quick-stats 6,982⭐ |
| 49 | 2026-05-24 | git-last (last change per file) | - | ❌ Killed — trivially solvable with git log, knip covers dead code |
| 50 | 2026-05-24 | gh-pr-check (PR readiness checker) | - | ❌ Killed — zero demand, gh pr status/checks cover it |
| 51 | 2026-05-24 | git-heatmap (commit heatmap) | - | ❌ Killed — no breakout (0-6⭐), git-quick-stats covers it |
| 52 | 2026-05-24 | git-squash-select (interactive squash) | - | ❌ Killed — zero demand, git rebase -i + VS Code UI |
| 53 | 2026-05-24 | git-conflict-resolver (guided conflicts) | - | ❌ Killed — fac 1,857⭐ exact match |
| 54 | 2026-05-24 | env-doc (.env → Markdown docs) | - | ❌ Killed — 7+ tools, no breakout, trivial problem |
| 55 | 2026-05-24 | ci-fail (CI log parser) | - | ❌ Killed — zero demand (0 repos), `gh run view --log-failed` + native annotations sufficient, scope explosion risk |
| 56 | 2026-05-24 | ts-error-explain (TS error CLI) | **8/35** | ❌ Killed — ts-error-translator (2,451⭐ VS Code), AI trivializes it, TS 5.x improved errors, zero CLI demand |
| 57 | 2026-05-24 | screenshot-frame (device mockup CLI) | **12/35** | ❌ Killed — appshot (v2.0 CLI, MCP, frame subcommand) covers CLI niche; successful tools are GUI/SaaS |
| 58 | 2026-05-24 | `local-doc-search` (offline documentation search CLI) | **29/35** | ✅ **BUILD** |
| 41 | 2026-05-24 | changelog-diff (zero-config changelog CLI) | - | ❌ Killed — git-cliff (10k+⭐) already zero-config, standard-changelog exists |
| 42 | 2026-05-24 | git-blame-ignore (blame-ignore-revs manager) | **27/35** | ✅ **BUILD** |
| 43 | 2026-05-24 | qrcode-terminal (terminal QR generator) | - | ❌ Killed — node-qrcode already has terminal output |
| 44 | 2026-05-24 | npm-scripts-tui (TUI for npm scripts) | - | ❌ Killed — ntl (1.2k⭐) already covers it |
| 45 | 2026-05-24 | git-stash-manager (stash TUI) | **~18/35** | ❌ Killed — 8+ existing tools, no breakout, lazygit/gitui cover it |
| 54 | 2026-05-24 | `mcp-server-wizard` (MCP server management CLI) | **29/35** | ✅ **BUILD** |

### Round 11: Trend-Mined Ideas (2026-05-24)
Generated from GitHub trending weekly analysis. AI agent space still red ocean (codegraph 19k⭐, agentmemory 17k⭐, 12-factor-agents 22k⭐, Understand-Anything 21k⭐). Non-AI signals: app-store-screenshots (5k⭐) validates screenshot demand.

- [x] **`changelog-diff`** — CLI that generates human-readable changelogs from conventional commits since last tag → **KILLED**: git-cliff (10k+⭐ Rust) already provides zero-config changelog generation. `standard-changelog` and `commit-and-tag-version` simplify Node.js side. No real gap.
- [x] **`git-blame-ignore`** — CLI to manage `.git-blame-ignore-revs` file → **BUILD CANDIDATE** ⭐ 27/35 — see ideas/2026-05-24-git-blame-ignore.md
- [x] **`npm-outdated-check`** — CI-friendly CLI that checks if dependencies are outdated and fails if any are >N major versions behind. Different from `npm outdated` (which has no CI exit codes or version threshold config). `npm-check-updates` (9k⭐) updates but doesn't CI-gate. → **BUILD CANDIDATE** ⭐ 44/35 — see ideas/2026-05-24-npm-outdated-check.md
- [ ] **`shell-alias-sync`** — Sync shell aliases across machines using a git-tracked dotfile. CLI to add/remove/export aliases. Unlike full dotfile managers (stow, chezmoi), focuses only on shell aliases. Zero-config.
- [ ] **`gh-pr-template`** — CLI to scaffold PR templates per project type (bugfix, feature, breaking). Validates PR body against template. Fills in conventional commit prefix from branch name.

### Round 12: Trend-Mined Ideas (2026-05-24)
Generated from GitHub trending analysis + pattern mining. AI agent space still red ocean. Focus on git DX, terminal tools, underserved developer workflows.

- [x] **`npm-scripts-tui`** — Terminal UI for running npm scripts → **KILLED**: `ntl` (1.2k⭐) already covers interactive listing, fuzzy search, multi-select, descriptions, custom runner. Even if stale, it works for a simple use case. Better TUI = cosmetic, not a functional gap.
- [x] **`git-conflicts`** — CLI to list files with merge conflicts and open them in $EDITOR one by one. Guides through conflict resolution with progress tracking. → **BUILD CANDIDATE** ⭐ 28/35 — see ideas/2026-05-24-git-conflicts.md
- [ ] **`pkg-licenses`** — Generate a licenses.html page for all your npm dependencies. Required for iOS/Android app store submissions. Existing tools (license-checker) output text/JSON. Gap: ready-to-ship HTML output with proper formatting.
- [ ] **`ts-prune`** interactive mode — Find unused exports in TypeScript. `ts-prune` (6.2k⭐) exists but is dead (last update 2023). `knip` covers unused deps but NOT unused exports specifically. Opportunity: maintained, zero-config unused export finder.
- [x] **`dotenv-lint`** — Lint .env files for common mistakes → **KILLED**: dotenv-linter (Rust, 1.7k⭐) covers gap with 14 checks, fix mode, CI integration. 2+ TS tools exist on GitHub. Rust tool installs via brew/cargo.

### Round 13: Trend-Mined Ideas (2026-05-24)
Generated from trending analysis + git DX pattern mining. AI agent space still red ocean. Focus: git DX (our strongest category), terminal productivity, underserved CLI gaps.

- [x] **`git-stash-manager`** — Interactive TUI for git stash management → **KILLED**: 8+ existing git stash TUI tools on GitHub. No breakout winner despite multiple attempts. lazygit (55k⭐) and gitui (19k⭐) cover stash management. Problem isn't painful enough for standalone tool adoption.
- [x] **`gh-workflow-tui`** — Interactive CLI to trigger and monitor GitHub Actions workflows. `gh workflow run` is fire-and-forget. Gap: TUI to browse workflows, pick one, watch logs in real-time, re-run failed jobs. `gh run watch` exists but no interactive workflow picker. → **KILLED**: direct competition with lazyactions (88⭐), convenience wrapper over existing GitHub CLI, see ideas/2026-05-24-gh-workflow-tui.md
- [x] **`git-ignore-gen`** — Interactive CLI to create .gitignore files by SCANNING project for untracked files and SUGGESTING ignore patterns. Different from github/gitignore (templates). Learns from `git status` output. → **BUILD CANDIDATE** ⭐ 42/35 — see ideas/2026-05-24-git-ignore-gen.md
- [x] **`npm-scripts-doc`** — Extract and display npm script documentation from comments/descriptions. Shows what each script does without reading package.json. Complements `ntl` (which runs scripts) with documentation discovery. → **BUILD CANDIDATE** ⭐ 28/35 — see ideas/2026-05-24-npm-scripts-doc.md
- [x] **`dockervis`** — Terminal dashboard for Docker containers. Like `ctop` but TypeScript and maintained (ctop hasn't been updated since 2022). → **BUILD CANDIDATE** ⭐ 26/35 — see ideas/2026-05-24-dockervis.md

### Round 10: Trend-Mined Ideas (2026-05-24)
Generated from GitHub trending weekly + gap analysis. AI agent tooling still red ocean. Focus on non-AI developer tool gaps.

- [x] **`license-check`** — CLI to audit all dependency licenses and flag conflicts → **KILLED**: `@brainhubeu/lac` (stxnext/license-auditor) is actively maintained TypeScript successor. Init wizard, SPDX-compliant, CI-friendly, npm/yarn/pnpm. No gap.
- [ ] **`tsdoc-markdown`** — Extract TSDoc/JSDoc from TypeScript → clean Markdown API docs. TypeDoc (13k⭐) generates full HTML sites. Gap: zero-config CLI that outputs Markdown for README embedding.
- [x] **`qrcode-terminal`** — Generate QR codes in terminal → **KILLED**: `node-qrcode` (soldair, major library) already has `qrcode -t utf8` for terminal output + PNG/SVG/CLI. Covers everything. No gap.
- [x] **`npm-dep-tree`** — Visualize npm dependency tree in terminal with ASCII/Unicode tree. Shows why a package is installed (which parent requires it). `npm-remote-ls` (176⭐, dead). `dep-tree` (48⭐, 2024). Gap: no maintained, zero-config tree visualizer. → **BUILD CANDIDATE** ⭐ 26/35 — see ideas/2026-05-24-npm-dep-tree.md
- [ ] **`git-last`** — Show the last meaningful change for each file in a directory. "When was this last touched and by whom?" Answers "is this code dead?" Simple, useful for code archaeology. No existing tool found.

## Rejected Ideas

| Idea | Reason |
|------|--------|
| AI-powered README generator | Saturated: readme-ai (2.9k⭐), readme-md-generator (11k⭐). No gap. |
| Smart .gitignore generator | Ultra-saturated: github/gitignore (174k⭐). Solved problem. |
| AI API key manager | Subset of Doppler, Infisical, 1Password CLI. No unique angle. |
| Markdown notes CLI + AI search | nb (8.1k⭐), iwe (1k⭐), many small AI+notes projects. Crowded. |
| WhatsApp Business API TS | Official Meta SDK (270⭐), whatsapp-cloud-api (201⭐). Covered. |
| Git hook AI code review | promptfoo (21.5k⭐), deepeval (15.6k⭐). Heavily covered. |
| OpenAPI mock server | Prism (Stoplight), WireMock. Solved. |
| Env variable manager | Doppler, Infisical, dotenv-vault. Enterprise tools dominate. |
| Markdown-to-Notion sync | SyncNos (157⭐), notion-jam (82⭐). Adequate solutions. |
| Project scaffold generator | Yeoman, Plop, Cookiecutter. Saturated. |
| Prompt testing framework | promptfoo (21.5k⭐), deepeval (15.6k⭐), DSPy (34.6k⭐). Dominated. |
| Indonesian address validator | Zero existing tools AND zero demand. Dead end. |
| Bahasa NLP library | NLP_bahasa_resources (572⭐), nalapa (33⭐). Covered. |
| Payment gateway abstraction | Official SDKs (Xendit, Midtrans) exist. Only 1 community attempt. |
| WA template builder | Zero existing tools AND zero demand. Dead end. |
| AI model cost calculator | Max 2⭐ for existing tools. Too niche for real traction. |
| Local AI agent framework | LangChain/AutoGen/CrewAI dominate. No gap for simple CLI. |
| RAG pipeline CLI | Too complex for 5-10 day MVP. LangChain/LlamaIndex cover this. |
| Function calling validator | Zero demand signal. Too niche. |
| Time tracker CLI | timetrap, watson, tik. Well-covered. |
| Bookmark manager CLI | buku (5.7k⭐). Solved. |
| Meeting notes converter | Only 0⭐ tools. Too niche. |
| RSS AI summary | Many 0⭐ attempts. Too niche. |
| Habit tracker CLI | Many 0⭐ clones. No market differentiation. |
| MCP config manager | 8+ tools already: mcpman, agent-skills, universal MCP config, etc. Red ocean. |
| NIK/KTP parser | 4 existing tools including TS zero-dep parser. Low demand signal. |
| rupiah.js | 8+ rupiah formatting + 8+ terbilang libraries in JS/TS. No dominant player but problem is simple and well-covered. |
| jsonpipe | `jq --stream` handles JSON streaming natively. Plus "lightning-fast zero-dep" competitor exists. jq dominance insurmountable. |
| envdoctor | Zero GitHub results = zero demand. Each ecosystem has its own doctor (flutter doctor, nvm doctor, react-native doctor). |
| pkgbench | `time-require` (2014) is the only tool, all forks dead since 2018. But zero demand for a modern replacement — the problem is trivially solved with `time node -e "require('x')"`. No GitHub repos, no community interest. |
| envcheck | 10+ tools on GitHub all doing .env vs .env.example validation. Every variation exists: zero-dep, WASM, Go, CI-friendly. Ultra-saturated. |
| jsonfix | `josdejong/jsonrepair` (2,339⭐, TypeScript, updated 2026-05-20) handles ALL proposed features: trailing commas, single quotes, missing brackets, comments, truncated JSON from LLMs, streaming, CLI, zero deps. No gap whatsoever. |
| lockdiff | 3 small existing tools for human-readable lockfile diff. Low-frequency problem, GitHub dependency review + npm diff (v7+) already covering the space. |

### Round 14: Trend-Mined Ideas (2026-05-24)
Generated from GitHub trending weekly + pattern mining. AI agent tooling still red ocean (codegraph 19k⭐, 12-factor-agents 22k⭐, Understand-Anything 21k⭐). app-store-screenshots (5k⭐) validates screenshot tooling demand. Focus on git DX, file-based tools, terminal productivity.

- [x] **`git-squash-select`** — Interactive squash with checkboxes → **KILLED**: Zero GitHub results across all search variations. `git rebase -i` + VS Code rebase UI already solve this. Zero demand.

### Round 20: Trend-Mined Ideas (2026-05-24)
Generated from GitHub trending weekly analysis. AI agent tooling STILL red ocean (codegraph 19k⭐, agentmemory 17k⭐, 12-factor-agents 22k⭐, Understand-Anything 22k⭐). No new non-AI breakouts. Focus: developer productivity niches, CI/CD utilities, file-based tools.

- [x] **`modsize`** — CLI to show size of each node_modules dependency, sorted. Find bloated deps. `cost-of-modules` (3.5k⭐) dead since 2021. `npkill` (8k⭐) deletes but does not analyze. Gap: maintained, simple dependency size audit CLI. → **BUILD CANDIDATE** ⭐ 22/35 — see ideas/2026-05-24-modsize.md
- [ ] **`cron-test`** — CLI to validate, explain, and test cron expressions. Shows next N run times. `cronstrue` (1.3k⭐) explains but does not validate. `cron-validator` (74⭐) validates but does not explain. Gap: combined validate + explain + dry-run.
- [ ] **`gh-issue-tpl`** — Interactive CLI to generate `.github/ISSUE_TEMPLATE/` files (bug report, feature request, custom). CLI scaffolds + validates YAML frontmatter + previews in terminal.
- [ ] **`pkg-changes`** — CLI to show changelog for an npm package without visiting GitHub/npmjs. Pulls from GitHub releases or CHANGELOG.md. `npm view` shows versions but not changes. Gap: `pkg-changes express` shows what changed between versions.
- [x] **`env-migrate`** — CLI to migrate .env files between environments (dev→staging→prod). Detects missing vars, extra vars, type mismatches. No existing tool found for env-to-env diff and migration. → **BUILD CANDIDATE** ⭐ 28/35 — see ideas/2026-05-24-env-migrate.md


### Round 18: Trend-Mined Ideas (2026-05-24)
Generated from GitHub trending weekly analysis. AI agent tooling STILL red ocean (codegraph +16k/week, agentmemory +7k/week). Non-AI: app-store-screenshots (5k⭐) validates screenshot tooling, cursor/plugins (674⭐) = plugin ecosystem. Focus: local dev tools, file utilities, TypeScript gaps.

- [ ] **`json-schema-faker-cli`** — Generate realistic fake data from JSON Schema definitions. `json-schema-faker` (3.3k⭐, JS) exists but has no CLI, only programmatic API. Gap: zero-config CLI that reads a schema file and outputs fake JSON/CSV data. Useful for API testing, seed data.
- [ ] **`npm-owner-check`** — CLI to audit which npm packages you own across all your orgs. Lists packages, checks if 2FA is enabled, verifies email matches. npm doesn't have a bulk ownership view. Gap: single command to see all your npm packages and their security settings.
- [ ] **`gh-merge-queue`** — CLI to manage GitHub merge queues locally. See which PRs are queued, estimated wait time, your position. GitHub's merge queue UI is web-only. Gap: terminal view of merge queue status.
- [ ] **`svg-optimize`** — Zero-config SVG optimization CLI. Wraps SVGO with sensible defaults and auto-detection. SVGO (20k⭐) exists but requires config for optimal results. Gap: `svg-optimize *.svg` just works with best-practice defaults.
- [x] **`ts-error-explain`** — CLI that takes a TypeScript error code and explains it in plain language → **KILLED**: ts-error-translator (2,451⭐ VS Code ext) covers it, AI assistants make "explain TS2322" trivial, TS 5.x improved errors upstream, zero demand for CLI format specifically.

### Round 17: Trend-Mined Ideas (2026-05-24)
Generated from GitHub trending weekly + pattern analysis. Trending dominated by large projects (bun 2k/week, coolify 645/week, cal.diy 1.8k/week). No new small CLI breakouts. Focus: CI/CD DX, developer onboarding, file-based tools.

- [ ] **`gh-release-dl`** — CLI to download latest release assets from GitHub repos. `gh release download` exists but only for current repo. Gap: download from ANY repo by owner/repo shorthand, pick asset by OS/arch pattern, verify checksums. No existing standalone tool found.
- [x] **`ci-fail`** — Parse CI failure logs into human-readable summaries → **KILLED**: `ci-log-parser` GitHub topic has 0 repos = zero demand. `gh run view --log-failed` + native `::error::` annotations cover the need. CI log formats too diverse for generic parser. Scope explosion risk.
- [ ] **`pkg-audit-html`** — Generate licenses.html page for all npm dependencies. Required for iOS/Android app store submissions. license-checker outputs text/JSON only. Gap: ready-to-ship HTML output with proper formatting.
- [ ] **`tsdoc-markdown`** — Extract TSDoc/JSDoc from TypeScript → clean Markdown API docs. TypeDoc (13k⭐) generates full HTML sites. Gap: zero-config CLI that outputs Markdown for README embedding. From Round 10 queue.
- [ ] **`screenshot-frame`** — CLI to frame screenshots in device mockups (phone, laptop, browser). SVG/PNG output. Zero-config. Only 1 existing CLI tool found on GitHub. Real use case: app store listings, README hero images.
- [ ] **`env-to-types`** — Reverse-engineer TypeScript types from existing .env files. Most tools go schema→validation. This goes .env→types (generates `env.d.ts` from current `.env`). Complements dotenv-schema.
- [x] **`git-conflict-resolver`** — Guided merge conflict resolution → **KILLED**: `fac` (1,857⭐, Go, actively maintained) is exactly this — CUI for fixing git conflicts. Plus neovim/JetBrains plugins. No gap.

### Round 16: Trend-Mined Ideas (2026-05-24)
Generated from GitHub trending + HN analysis. AI agent space still red ocean (kimi-code 219⭐, semble_rs 103⭐ — all AI-code-search). Non-AI signals: mkdev (53⭐, localhost HTTPS), PasteLocal (82⭐, SSH clipboard), CodeMappr (13⭐, codebase understanding). Focus: dev environment DX, local development tools, file-based workflows.

- [x] **`env-doc`** — Generate documentation table from .env files → **KILLED**: 7+ existing envdoc tools on GitHub, none with >10 stars. envdoc-go (2⭐), envdoc-ai, and 5+ others. Multiple attempts, no breakout. Problem too trivial for standalone tool adoption.
- [ ] **`npm-audit-html`** — Convert `npm audit --json` output into a shareable HTML report. npm audit only outputs text/JSON. Gap: human-readable HTML with severity breakdown, dependency tree, and remediation steps. Existing: `npm-audit-html` (npm package, 44⭐, last update 2021). Gap: maintained, modern UI, CI-friendly.
- [ ] **`git-draft`** — Save WIP commits as drafts that don't pollute git log. Uses `git stash` under the hood but with descriptions, listing, and restore. Like `git stash` but with better UX (named stashes, tags, expiration). `git stash` UX is infamously bad.
- [ ] **`ssh-copy-id` TS** — Cross-platform ssh-copy-id in TypeScript (macOS has it native, Windows doesn't). npm installable. Zero deps. Small but useful. Existing: only `ssh-copy-id` npm (17⭐, 2020). Real cross-platform demand from Windows devs.
- [ ] **`gh-release-dl`** — CLI to download latest release assets from GitHub repos. `gh release download` exists but only for current repo. Gap: download from ANY repo by owner/repo shorthand, pick asset by OS/arch pattern, verify checksums. No existing standalone tool found.
- [ ] **`pkg-audit-html`** — Generate licenses.html page for all npm dependencies. Required for iOS/Android app store submissions. license-checker outputs text/JSON only. Gap: ready-to-ship HTML output. From Round 12 queue.
- [ ] **`tsdoc-markdown`** — Extract TSDoc/JSDoc from TypeScript → clean Markdown API docs. TypeDoc (13k⭐) generates full HTML sites. Gap: zero-config CLI that outputs Markdown for README embedding. From Round 10 queue.

## Trend Notes (2026-05-24 Cycle)

### GitHub Trending (TypeScript, weekly)
- AI agent tooling dominates: codegraph (18.9k⭐), agentmemory (16.7k⭐), 12-factor-agents (21.9k⭐)
- Agent orchestration: ruflo (54.4k⭐), multica (31.8k⭐), pi (53.3k⭐)
- New DX tools: oh-my-pi (6.7k⭐), agent-skills (4.4k⭐)
- cal.diy (44.4k⭐) - scheduling infra
- RapidRAW (7.7k⭐) - image editor

### Hacker News Signals
- Files.md (719 pts) - simple file-based knowledge tools resonate
- ShadowCat (149 pts) - creative use of browser APIs
- Rmux (186 pts) - terminal multiplexer demand
- Agent.email (92 pts) - CLI-first services
- .docx editor library (102 pts) - document tooling gap

### Key Insights
1. **AI agent space is a red ocean** — ruflo 54k⭐, pi 53k⭐, codegraph 19k⭐ in weeks. Stay away.
2. **MCP config management is saturated** — 8+ tools doing the same thing
3. **Simple file-based tools get traction** — Files.md proved this with 719 HN points
4. **CLI-first services are emerging** — agent.email, ShadowCat show demand for CLI-as-interface
5. **TypeScript gaps exist in niche domains** — especially regional/Indonesian tools
6. **Git DX is our strongest category** — gitpanic 28/35, branchcleanup 24/35, git-blame-ignore 27/35. Continue mining git gaps.
7. **Rust tools close TS CLI gaps** — dotenv-linter (Rust, 1.7k⭐) covers .env linting. Check Rust alternatives before assuming "no TS tool = gap."

### Round 15: Trend-Mined Ideas (2026-05-24)
Generated from trend analysis + git DX pattern mining (our strongest category). AI agent tooling still red ocean (codegraph 19k⭐, agentmemory 17k⭐, 12-factor-agents 22k⭐, Understand-Anything 21k⭐). cursor/plugins (671⭐) = plugin ecosystem emerging. Focus: git DX, terminal workflow automation.

- [x] **`git-standup`** — Generate a standup report from yesterday's git activity across all repos → **KILLED**: nilbuild/git-standup (7,836⭐, Shell, updated July 2025) by kamranahmedse. Transferred and maintained, not abandoned. Available on npm/brew/AUR. No gap.
- [x] **`git-context`** — One-command git project dashboard → **KILLED**: onefetch (11,808⭐, Rust, updated May 2026) is the definitive git info tool. git-quick-stats (6,982⭐) covers statistics. No gap.
- [x] **`git-last`** — Show last meaningful change per file → **KILLED**: Trivially solvable with `git log` one-liners. Zero demand signal (0⭐ tools only). knip (11k⭐) handles dead code via static analysis.
- [x] **`gh-pr-check`** — CLI to check if PR is ready to merge → **KILLED**: Zero GitHub search results = zero demand. `gh pr status` + `gh pr checks` already cover this. Convenience wrapper, not standalone value.
- [x] **`git-heatmap`** — Terminal heatmap of commit activity → **KILLED**: Multiple tiny attempts (0-6⭐), no breakout. git-quick-stats (6,982⭐) already has time-of-day analysis. Low-adoption niche pattern.

### Round 21: Terminal Productivity Ideas (2026-05-24)
Generated from terminal trends (lazygit 49.8k⭐, warp 14.1k⭐, yazi 9.2k⭐) + git DX pattern mining. Focus: terminal session management, git-aware workflows, and workspace productivity.

- [x] **`session-wizard`** — Terminal session manager for git worktrees. Creates, saves, switches between terminal sessions tied to specific git worktrees/branches. Unlike tmux/zellij, focuses specifically on git workflows. Integrates with worktree-manager. → **KILLED**: Strong competition with 3+ established players (wt, Par, Agent Empires) covering different aspects of the space. TypeScript gap doesn't offset competitive landscape. See ideas/2026-05-24-session-wizard.md.

### Round 24: Trend-Mining Ideas (2026-05-24)
Generated from GitHub trending analysis + local-first tool trends. Focus: developer productivity tools with offline capabilities. Based on trending patterns: Files.md (719 HN points), local-first movement, and code search pain points.

- [✅] **`local-code-search`** — Fast, offline-first code search CLI tool. Indexes local codebases and provides instant search with fuzzy matching, regex support, and basic semantic understanding. Addresses the gap between heavy IDE search and basic grep tools. → **SPEC WRITTEN** (28/35) - ideas/2026-05-24-local-code-search.md

### Round 25: Monorepo Workflow Ideas (2026-05-25)
Generated from monorepo tooling analysis (turbo 18k⭐, nx 18k⭐, pnpm 43k⭐) and context switching pain points. Focus: developer workflow gaps in monorepo environments where existing tools focus on builds/publishing but not daily development.

- [ ] **`monorepo-switcher`** — Intelligent CLI for fast workspace switching in monorepos with context awareness, smart discovery, and git state detection. Unlike turbo/nx (complex orchestration), focuses purely on developer workflow velocity. → **PROPOSED** - ideas/2026-05-25-monorepo-switcher.md
- [x] **`git-worktree-assistant`** — Enhanced git worktree management with workspace awareness. Auto-detects current worktree context, provides quick switching, shows worktree health, and manages cross-worktree dependencies. → **VALIDATED** ⭐ 32/35 — see ideas/2026-05-25-git-worktree-assistant.md
- [ ] **`code-complexity-scanner`** — CLI to identify overly complex functions, deep nesting, and cognitive complexity metrics. Suggests refactoring targets and tracks complexity trends over time. Complements static analysis with human-centric metrics.
- [ ] **`test-generator-cli`** — Smart test case generator that analyzes code patterns and creates unit/integration tests. Uses AST analysis to understand method signatures and generates appropriate test stubs with mocked dependencies.
- [ ] **`dependency-viz`** — Interactive CLI to visualize dependency trees and circular imports. Shows dependency paths, suggests optimizations, and highlights problematic imports. Modern replacement for outdated npm-dep-tree tools.
- [ ] **`commit-message-wizard`** — Interactive CLI to generate better commit messages based on git diff analysis. Extracts scope, type, and breaking changes from code changes, suggests conventional format.
- [ ] **`code-standards-linter`** — Configurable linter for code style and architecture standards beyond ESLint. Checks for function complexity, line length violations, architectural patterns, and project-specific conventions.

### Round 22: Trend-Mined Ideas (2026-05-24)
Generated from GitHub trending weekly analysis. New patterns: AI coding agents (Tartarus-AI), command search tools (devgrep), Web3 dev tools (web3-devkit-cli), code understanding tools (CodeMappr). Focus: emerging developer tool trends.

- [x] **`cmdseek`** — Fast recursive command search CLI that learns from usage patterns. Like `devgrep` but with AI-powered command suggestions and usage frequency ranking. Finds the right command when you don't remember the exact name. → **BUILD CANDIDATE** ⭐ 27/35 — see ideas/2026-05-24-cmdseek.md
- [x] **`web3-deploy-wizard`** — Interactive CLI for Web3 deployment management across multiple chains (EVM, Solana). Handles contract deployment, transaction tracking, and gas estimation with chain-specific best practices. → **BUILD CANDIDATE** ⭐ 28/35 — see ideas/2026-05-24-web3-deploy-wizard.md
- [ ] **`ai-wrapper-cli`** — CLI wrapper for AI coding agents that standardizes prompts across different providers (OpenAI, Anthropic, local models). Provides consistent output formatting and allows saving prompt templates.
- [ ] **`whatscli-hist`** — WhatsApp message history CLI with search, export, and backup. Extends `wpp-tui` with history management, message search by content/date, and export to JSON/Markdown.
- [ ] **`code-map-tui`** — Terminal-based code visualization tool similar to CodeMappr but with interactive TUI. Shows file relationships, function calls, and dependency graph in terminal for codebase navigation and understanding.
- [ ] **`git-terminal`** — Git-aware terminal wrapper that auto-detects current worktree/branch and provides context-aware commands. Shows current branch, worktree path, and offers quick git operations without leaving terminal.
- [ ] **`workspace-switcher`** — CLI to switch between development workspaces (monorepo packages, different repos, git worktrees). Remembers open terminals and restores session state. Complements tools like lazygit.
- [ ] **`terminal-logger`** — Smart terminal session logger that captures command history with git context. Records what was done in which branch/worktree. Useful for retrospective and knowledge sharing.
- [ ] **`git-prompt-pro`** — Enhanced git prompt with worktree awareness, branch health indicators, and quick actions. Shows upstream status, unpushed commits, worktree conflicts, and offers one-click operations.
