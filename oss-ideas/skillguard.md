# skillguard — Security Scanner for AI Agent Skills

## The Problem
The agent skills ecosystem is exploding: 1000+ community skills, multiple marketplaces (SkillsMP, agentskill.sh, ClaudeSkills), one-command installs. But zero security tooling. You're installing a markdown/config file that gets executed by your coding agent with full shell/file/network access — and you have no idea what it actually does.

## The Gap
- **No skill security scanner exists** — not in any marketplace, not as a standalone tool
- Skills are just markdown + config — easy to audit automatically, but nobody's doing it
- Claude's new "skill testing" tool only tests *functionality*, not *security*
- Marketplaces list community skills as "compatible" with 20+ platforms with zero vetting
- One-command install = zero human review before execution

## What It Does
A CLI that scans agent skill definitions before install:
- **Pattern matching** for dangerous constructs (shell injection, file exfiltration, network calls, credential access)
- **Permission mapping** — shows exactly what a skill can access (files, shell, network, env vars)
- **Trust scoring** — green/yellow/red based on capability surface
- **Diff mode** — `skillguard diff skill-v1.md skill-v2.md` to see what changed between versions
- Works with any agent skill format (Claude Code SKILL.md, Codex skills, Cursor rules, MCP configs)

## Why Now
- Agent skills marketplaces went mainstream May 2026 (5+ competing platforms)
- Claude launched skill-creator testing tools (functionality only, no security)
- addyosmani/agent-skills and VoltAgent/awesome-agent-skills hitting 1000+ entries
- Enterprise adoption of Claude Code/Codex means compliance teams will demand this

## Competition
- **None** — literally zero tools for skill security auditing
- Closest: npm audit (package-level), semgrep (code-level) — wrong abstraction layer
- Claude's built-in skill testing = functional only

## Buildability
**Weekend project.** Skills are text files (markdown, YAML, JSON). Pattern matching + AST parsing of shell commands in skill bodies. Ship as npx skillguard or pip install skillguard.

## Monetization
- Open-source core CLI
- Paid: CI integration (scan skills in PRs), enterprise policy enforcement, marketplace integration API
- Marketplaces might pay to integrate as a "verified" badge

## Signals
- GitHub trending: 3/10 top repos are agent skills frameworks
- Every marketplace is manually curating — they need automation
- r/claudecode and r/cursor have multiple threads about "is this skill safe?"
- Enterprise teams deploying agent skills at scale have zero compliance tooling
