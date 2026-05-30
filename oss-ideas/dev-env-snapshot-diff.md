# Dev Environment Snapshot & Diff Tool

**Codename:** envsnap
**Date:** 2026-05-29
**Score:** 8/10

## The Problem
"Works on my machine" is still unsolved. When builds break locally but pass CI, devs waste hours comparing versions, env vars, running processes, platform differences. Docker is overkill for debugging. Nix is too complex for most teams.

Current tools:
- `doctor` scripts (manual, not versioned)
- Docker (heavy, doesn't help debug local env issues)
- `nvm`/`asdf`/`mise` (manage ONE thing, not the full picture)
- Volta/fnm (just Node)

Nothing captures your *full* dev environment state and diffs it.

## The Idea
CLI tool that snapshots your dev environment:
- Runtime versions (node, python, go, rust, etc.)
- Package versions (lockfile hash, installed globally)
- Environment variables (names only, values redacted by default)
- OS/platform info
- Running processes on relevant ports
- Git state (branch, uncommitted changes)
- Docker/container state (optional)

Then: `envsnap diff` against CI's known-good state, or a teammate's snapshot, or your own last-known-good.

## Why Now
- Polyglot stacks are the norm (every project has Node + something else)
- Remote/hybrid teams = more env drift
- `mise` is gaining traction (7k+ stars) but only manages tool versions, doesn't snapshot
- No one has built the "full picture" tool

## Competition
- `mise` — tool version manager, not env snapshotter
- `doctor` scripts — custom, per-project, not standardized
- `asdf` — version manager only
- Docker — overkill for this problem

## MVP (Weekend Build)
1. `envsnap capture` — saves snapshot as JSON to `.envsnap/`
2. `envsnap diff <target>` — compares two snapshots, highlights differences
3. `envsnap ci` — captures CI env and stores as baseline
4. `.envsnap/` is gitignored by default, shareable on demand

## Monetization
- Core CLI: free, open source
- Team sync: share snapshots across team (SaaS, $5/dev/month)
- CI integration: auto-capture CI env, auto-diff on failure
- GitHub Action: comment env diff on PRs

## Buildability
- Weekend MVP: yes, CLI is straightforward
- Language: Rust (fast, single binary) or Go
- Key libraries: sysinfo for OS/process info, semver for version parsing

## Risks
- Security: env vars are sensitive → redact by default, opt-in to include values
- Noise: too many detected differences → smart diffing with significance scoring
- Adoption: devs might not think to snapshot until they need it → CI integration is key
