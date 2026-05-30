# Open-Source Knowledge Base

## What Makes a Successful Open-Source Project

### High-Impact Patterns (from research)
- Solves a pain point the author themselves had
- Has a killer README with GIF demo
- Zero-config to get started
- Does ONE thing extremely well
- Has a catchy, memorable name
- First release within 1 week of idea

### Anti-Patterns (avoid these)
- "Yet another..." clone of popular tool without differentiation
- Over-engineered architecture for a simple problem
- Requiring extensive configuration before first use
- No documentation or examples
- Solves a problem nobody actually has

### Naming Guide
- Short (1-2 words, ideally 1)
- Memorable and easy to type
- Available on npm/pip and GitHub
- Not trademarked

### README Must-Haves
1. One-line description
2. Badges (build, version, license)
3. Installation (copy-paste ready)
4. Quick start example (show, don't tell)
5. Features list
6. API docs (if library)
7. Contributing guide link
8. License

### Monetization (optional, halal)
- GitHub Sponsors
- Open Core (basic free, advanced paid)
- Consulting/services around the tool
- NEVER: ads, data collection, telemetry without consent

## Tech Decisions Log

| Decision | Rationale | Date |
|----------|-----------|------|
| MIT License default | Most permissive, encourages adoption | 2026-05-24 |
| TypeScript primary | Largest npm ecosystem, type safety | 2026-05-24 |

## Research Patterns Learned

| Pattern | Lesson | Date |
|---------|--------|------|
| Developer tool saturation | CLI tools for common tasks (README, gitignore, scaffolding) are almost always saturated. Check GitHub stars before investing. | 2026-05-24 |
| Official SDK kills community tools | If a company publishes an official SDK (Meta WhatsApp, Xendit), community alternatives rarely gain traction. | 2026-05-24 |
| Regional tools have gaps | Indonesian-specific tools (IDX, payment gateways, address validation) have much less competition than global equivalents. Local context = moat. | 2026-05-24 |
| AI-powered wrappers are crowded | Any tool that's "X + AI" (README AI, prompt testing, code review) has 3+ well-funded competitors. Differentiate on domain, not AI. | 2026-05-24 |
| Star count thresholds | <100 stars = no dominant player, opportunity. 1k+ stars = established player, need clear differentiation. 10k+ stars = saturated. | 2026-05-24 |
| Scrapers are fragile foundations | Tools relying on web scraping (idx.co.id) break often. Abstract the scraping layer and cache aggressively. | 2026-05-24 |
| TypeScript gap in Python-heavy niches | If a domain has only Python tools, a TypeScript alternative can capture the npm ecosystem. But must match feature parity. | 2026-05-24 |
| AI agent tooling = red ocean (2026-05) | ruflo 54k⭐, pi 53k⭐, codegraph 19k⭐ all in weeks. Every sub-niche (memory, config, skills) has 2+ competitors. Avoid AI agent tooling entirely. | 2026-05-24 |
| MCP ecosystem is saturated | 8+ MCP config managers appeared in 2026. First-mover advantage is gone; only differentiated UX can win. | 2026-05-24 |
| File-based tools resonate | Files.md got 719 HN points. Developers love tools that work with plain files, no DB required. | 2026-05-24 |
| Niche < 4 GitHub results = low demand | If GitHub search returns <5 repos, demand is too low regardless of gap. Both must exist. | 2026-05-24 |
| Trivially solvable = no tool needed | If the "problem" can be solved with a one-liner shell command (`time node -e "require('x')"`), no dedicated tool is needed regardless of demand. | 2026-05-24 |
| Format-fit matters | Just because there's a gap doesn't mean CLI is the right format. Some problems (review analytics, team metrics) genuinely need dashboards/visualization. Don't force a CLI solution onto a dashboard problem. | 2026-05-24 |
| Fragmented competition < 100⭐ = opportunity | If multiple tools exist but none dominate (<100⭐ each), AND there's demand evidence (SO questions), a better UX can win. | 2026-05-24 |
| Interactive wizards > reference commands | Tools that GUIDE users through problems (wizard-style) beat tools that just provide commands. The demand is for hand-holding, not more commands. | 2026-05-24 |
| 2k+ stars = strong incumbents | Tools with 2,000+ stars that are actively maintained (updated within weeks) are dominant. Only build if the gap is very specific and the incumbent's architecture prevents them from addressing it. | 2026-05-24 |
| Squash-merge detection is a real gap | `git branch --merged` doesn't detect squash-merged branches. GitHub's default squash merge means most PR branches are invisible. Only 1 tool (0⭐) addresses this. | 2026-05-24 |
| Successor tools close gaps fast | When a popular tool dies (depcheck), the community quickly builds a successor (knip 11k⭐). Don't build "lite" versions of dead tools — check if a successor already exists. | 2026-05-24 |
| Zero GitHub results = zero demand | If GitHub search returns 0 repos for a tool concept (e.g., stale issue cleanup CLI), demand is likely zero. People who care already use existing solutions. | 2026-05-24 |
| Dead tool ≠ gap (check for successors) | When a popular tool dies (license-checker 2.8k⭐, unmaintained), check if a successor already exists BEFORE researching. The community often builds replacements (@brainhubeu/lac for license-checking). Don't assume "dead = opportunity". | 2026-05-24 |
| Auto-detection features create value | Tools that auto-detect problems (bulk commits, unused exports, config drift) are more valuable than tools that just manage known problems. The detection is the hard part users won't do manually. | 2026-05-24 |
| Rust alternatives close TS gaps | When a Rust CLI tool exists for a niche (dotenv-linter, git-cliff), it often covers the gap even if there's no TS equivalent. Developers will install Rust binaries via cargo/brew. Don't assume "no TS tool = gap". | 2026-05-24 |
| Dominant library subsumes niche tools | When a major library (node-qrcode) already supports a niche use case (terminal output via -t utf8), smaller dedicated tools (qrcode-terminal) become redundant. Check if major libraries cover the "gap" before building. | 2026-05-24 |
| Multiple small attempts with no breakout = low-adoption niche | When 8+ developers have tried to solve a problem and none achieved >100⭐, the problem is either not painful enough or adequately solved by broader tools. Don't enter a niche where many have tried and all failed. | 2026-05-24 |
| Rust tools close TS CLI gaps | When a Rust CLI tool exists for a niche (dotenv-linter, git-cliff), it often covers the gap even if there's no TS equivalent. Developers will install Rust binaries via cargo/brew. Don't assume "no TS tool = gap." | 2026-05-24 |
| Git DX is a strong research category | Our top scores are all git DX tools: gitpanic 28/35, git-blame-ignore 27/35, branchcleanup 24/35. Continue mining git workflow gaps. | 2026-05-24 |
| Git DX is getting saturated at the surface level | After researching 10+ git DX ideas, the obvious gaps are taken. git-standup (7.8k⭐), onefetch (11.8k⭐), fac (1.9k⭐), git-quick-stats (7k⭐) dominate. Need to go deeper/nicher or pivot category. | 2026-05-24 |
| Squash-merge detection creates real opportunity | GitHub's default squash-merge makes branches invisible to `git branch --merged`. Tools that detect squash-merged branches + offer interactive deletion solve a real pain point with no existing maintained solution (branchcleanup scored 27/35). | 2026-05-24 |
| CI log parsing is a trap idea | `ci-log-parser` topic has 0 repos. CI logs are too diverse for generic parsing. GitHub's native annotations + `gh run view --log-failed` cover the need. Scope explosion risk: every framework outputs errors differently. | 2026-05-24 |
| .env tooling is a low-adoption niche | 7+ envdoc tools exist on GitHub (envdoc-go 2⭐, envdoc-ai, etc.), none with >10 stars. When multiple devs try the same idea and none get traction, the problem isn't painful enough. Writing env docs is a one-time task, not recurring pain. | 2026-05-24 |
| "Convenience wrapper" ideas have no demand | Ideas that are just "combine 2-3 existing commands into one CLI" (gh-pr-check, git-last) have zero demand signal. Developers write shell aliases for this, not install packages. | 2026-05-24 |
| Transferred repos hide incumbents | Always check if a "dead" repo was transferred (kamranahmedse/git-standup → nilbuild/git-standup). The original URL redirects but the star count/updates are on the new org. | 2026-05-24 |
| SaaS-dominated spaces need CLI demand proof | When a problem space has many successful SaaS/GUI tools (screenshot mockups, design tools), the CLI niche may already be filled by 1-2 incumbents. Don't assume "no CLI = gap" — check if GUI tools genuinely serve the CLI audience better. Screenshot mockups: appshot CLI exists but most users prefer GUI tools (FrameUp, MockUPhone). | 2026-05-24 |
| AI assistants kill "explain X" tool ideas | If the core value is "explain [error/message/log]", AI assistants already do this trivially. A dedicated CLI loses vs paste-into-ChatGPT unless it adds significant context (e.g., code-aware explanations). ts-error-translator works in VS Code because it has YOUR types. A CLI version would just be a lookup table. | 2026-05-24 |
| VS Code extension ≠ CLI gap | Just because a VS Code extension exists with no CLI equivalent doesn't mean there's a CLI gap. The extension works IN your code context. A CLI without that context provides much less value. Demand for CLI format must be verified independently. | 2026-05-24 |
| Dead incumbent ≠ opportunity (check AI alternatives) | When an incumbent dies (ts-error-translator not updated since Aug 2024), check if AI assistants have already filled the gap before building a replacement. "Explain this error" is now a trivial LLM prompt. | 2026-05-24 |
| Node modules size analysis tools are viable | Tools like npkill (8k⭐) prove developers care about node_modules management. When a popular tool in this space dies (cost-of-modules 3.5k⭐), it creates a clear opportunity for a focused successor. The deletion vs analysis split shows how one problem space can have multiple tools serving different workflows. |
| Terminal Docker tools have gap when incumbents age | ctop (14k⭐) last updated 2022 creates opportunity for modern TypeScript alternative with better UX. Incumbent age + developer desire for modern tools = viable gap even with established players. |
| Schema-first approach beats validation-only | For .env tools, defining schema first (dotenv-schema) that generates validation code + .env.example is more valuable than validation-only tools (envcheck killed). Schema definition addresses root cause: inconsistent environment setup. |
| Project-aware scanning creates differentiation | Git tools that scan actual project state (git-ignore-gen learning from git status) beat template-only approaches. Auto-detection of real patterns creates more value than generic suggestions. |
| Cross-platform clipboard tools need lightweight alternatives | Heavy GUI tools (copyq 5.8k⭐) and limited CLI tools create gap for lightweight, terminal-native clipboard history. No Electron dependency is key differentiator for power users. | 2026-05-24 |
| Focus vs complexity in Docker tools | lazydocker (35k⭐) proves Docker terminal tools are in demand, but its complexity creates room for simpler, focused alternatives. Targeting "monitoring only" (not full management) creates clear differentiation. Incumbent age (ctop outdated since 2022) + TypeScript gap = strong opportunity. | 2026-05-24 |
| TypeScript gap in Docker monitoring | Docker terminal space dominated by Go/Rust tools (lazydocker, ctop). TypeScript alternative leverages npm ecosystem advantages (easy installation, updates, cross-platform) while providing type safety. Docker API compatibility more important than language choice. | 2026-05-24 |
| Multiple established players = red ocean | When 3+ tools exist in a space (wt, Par, Agent Empies for git worktree session management), competition indicates both real demand AND saturated market. TypeScript gap doesn't automatically equal opportunity - incumbents have moats. | 2026-05-24 |
| Old npm tools create modern opportunities | npm-remote-ls (176⭐, 1+ years old) and npm-tree (48⭐, ancient dependencies) show that when npm visualization tools become outdated, there's opportunity for modern TypeScript replacements. The npm ecosystem is large enough to support specialized visualization tools. | 2026-05-24 |
| Monorepo tools need focused niches | manypkg (1,200⭐) exists but only updates versions, doesn't detect drift. Tools that complement incumbents by solving specific sub-problems (drift detection, conflict resolution) have clearer value propositions than general monorepo managers. | 2026-05-24 |
| AI-powered developer tools require learning data | Command search tools like cheat (16k⭐) and tldr (40k⭐) are static lookup tables. AI-powered versions that learn from user usage patterns provide disproportionate value over time, creating moats that static tools can't cross. The "learning" component is the real differentiator, not the AI itself. | 2026-05-24 |
| Environment migration tools address real pain points | While .env tooling has been low-adoption (7+ envdoc tools <10⭐), environment-to-environment migration solves a more substantial problem than just documentation. Auto-detection of missing/extra variables and type mismatches across deployment stages creates real value, making this a viable gap despite existing .env tools. | 2026-05-24 |
| Documentation extraction solves discovery problems | Tools that extract documentation from existing code (npm scripts, package.json) address real pain points in team onboarding and knowledge sharing. Unlike documentation generation tools that create content from scratch, extraction tools leverage existing documentation that's often scattered and hard to discover. This creates value with minimal content creation overhead. | 2026-05-24 |
