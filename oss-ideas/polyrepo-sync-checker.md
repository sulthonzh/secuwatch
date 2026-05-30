# Idea #15: Polyrepo Consistency Checker (reposync)

## The Problem
Teams with 5+ microservices in separate repos inevitably drift apart. Different TypeScript versions, inconsistent ESLint configs, mismatched CI pipelines, different package.json scripts doing the same thing named differently. Monorepo tools (Turborepo, Nx) solve this by forcing everything into one repo — but many teams can't or won't do that.

Current options? Manually check. Or write custom scripts nobody maintains. There's no good tool that says "your 12 repos have drifted — here's what's different."

## Why Now
- Microservices architecture is standard, polyrepo is still the majority (monorepos are trending but not dominant)
- Config-as-code means MORE config files per repo, not less (tsconfig, eslint, prettier, docker-compose, CI, dependabot, renovate, etc.)
- AI coding agents are making this worse — they generate configs based on context, not consistency with your other repos
- GitHub trending is saturated with AI tools; developer infra/tooling gap is widening

## The Tool
`reposync` — point it at your GitHub org, it scans all repos for:
- Package manager versions (node, python, etc.)
- Linting/formatting configs (eslint, prettier, ruff)
- CI/CD pipeline configs
- TypeScript/compilation configs
- Dockerfile patterns
- Dependency versions (shared deps across repos)
- Naming conventions (scripts, env vars)

Outputs a drift report. "Repo A uses TS 5.1, repos B-F use TS 5.6. Repo C has eslint@8 while others use eslint@9." 

Can also enforce templates — define your org's "golden config" and reposync flags deviations.

## Validation
- Turborepo/Nx exist but require monorepo migration
- `syncpack` exists for package.json consistency but only within monorepos
- No standalone polyrepo config drift tool found
- Every team with 5+ repos has this pain — universal problem

## Buildability
**Weekend MVP.** GitHub API + config file parsing. Core is just diffing JSON/YAML configs across repos. CLI first, then maybe a dashboard.

## Monetization
- OSS core (CLI, local scanning)
- Pro: GitHub App that runs on PRs, blocks config drift in CI
- Enterprise: org-wide policies, historical drift tracking, Slack notifications

## Score: 7.5/10
- Universal pain: 9/10
- Competition: 9/10 (no direct competitor)
- Buildability: 9/10 (weekend MVP)
- Monetization: 7/10 (clear but B2B, slower adoption)
- Market timing: 6/10 (not hot/trending, steady demand)

## Risk
- "Boring" — not sexy enough to go viral. But that's also the opportunity — nobody's building it because it's unglamorous infra work.
- Teams might solve this by finally migrating to monorepos instead.
