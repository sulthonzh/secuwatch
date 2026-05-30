# skill-conflict-detector (skillguard)

**Date:** 2026-05-30
**Score:** 8/10
**Status:** New idea, unvalidated

## The Problem

The AI coding agent "skills" ecosystem is exploding — mattpocock/skills has 60K+ stars, awesome-codex-skills has 6.8K, ComposioHQ has a growing registry. But developers composing multiple skills from different authors are flying blind. Two skills can:

- Contradict each other ("always use tabs" vs "always use spaces")
- Double-define the same tool or command
- Have overlapping triggers causing agent confusion
- Waste tokens with redundant instructions
- Introduce security risks (one skill says "auto-approve all", another says "always ask")

Currently developers just stack skills and hope for the best. There's no validation layer.

## Why Now

- Skills ecosystem hit critical mass in May 2026 (two skills repos in weekly top 3)
- SkillsBench (benchflow-ai) validates individual skill effectiveness but NOT composition
- smithery skill-linter validates syntax, not semantic conflicts
- The space between "linter" and "benchmark" is empty

## Competition

- **smithery skill-linter** — syntax/format validation only
- **SkillsBench** — effectiveness benchmarking (single skill)
- **agnix (agent-sh)** — agent shell, not skill validation
- Nobody doing **semantic conflict detection between skills**

## Proposed Tool: skillguard

A CLI that scans your skills directory and flags:

1. **Instruction conflicts** — contradictory directives (regex + semantic)
2. **Tool overlap** — same tool registered by multiple skills with different configs
3. **Token waste** — redundant instructions that can be merged
4. **Security risks** — contradictory permission models
5. **Priority conflicts** — skills that expect to be "first" or "last" in load order

```bash
npx skillguard ./skills
# → ⚠️ conflict: "code-style" says tabs, "formatting" says spaces
# → 💡 merge: "git-workflow" and "commit-style" share 40% instructions
# → 🔒 risk: "auto-approve" overrides "security-check" permissions
```

## Weekend Buildable?

Yes. Core is a file parser + conflict rule engine. Could ship v0.1 in a weekend:
- Parse AGENTS.md / SKILL.md / skill folder structures
- Define ~20 conflict rules (hardcoded initially)
- CLI output with severity levels
- Add semantic conflict detection with embeddings later

## Monetization

- OSS core (basic conflict detection)
- Pro: semantic analysis, auto-merge suggestions, CI integration
- Registry: validated skill badges (like npm verified)

## Validation Needed

- [ ] GitHub search: how many people report skill conflict issues?
- [ ] Reddit/Discord: are developers actually composing multiple skills?
- [ ] Check mattpocock/skills issues for conflict reports
