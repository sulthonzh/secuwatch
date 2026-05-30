# AI Cost Attribution Per PR/Feature

## The Gap
Starting June 1, 2026, GitHub Copilot switches to token-based billing (AI Credits). Teams will get bills based on token consumption but have **zero visibility** into which PRs, features, or repos are burning through their credits. No open-source tool breaks down AI coding costs per git unit of work.

## Why Now (Timing is Everything)
- Copilot token billing launches June 1, 2026 — **literally tomorrow**
- Claude Code, Cursor, Codex all charge per-token already
- Teams using multiple AI tools have no unified cost view
- Engineering managers need to answer: "How much did AI cost for this sprint/feature/PR?"

## Competition
- **tokencost.app** — estimates token costs per model, but doesn't attribute to specific PRs/repos
- **GitHub's own billing dashboard** — shows org-level spend, no per-repo/PR breakdown
- **WakaTime** — tracks time, not token costs
- **agentblame (mesa.dev)** — attribution of AI vs human code, not cost tracking

**No one does per-PR/feature AI cost attribution in OSS.**

## What It Would Do
- Parse AI tool logs (Claude Code, Copilot, Cursor, Codex) for token usage
- Correlate token consumption with git activity (PRs, commits, branches)
- Generate per-PR/feature/repo cost breakdowns
- Dashboard: "PR #342 cost $2.40 in Claude Code tokens + $0.80 in Copilot"
- Alert when a feature exceeds cost budget
- Export to GitHub Actions (cost report as PR comment)

## Architecture
- Git hook or GitHub Action that captures AI tool telemetry
- Lightweight CLI to parse logs from multiple AI tools
- SQLite for local storage, optional dashboard
- GitHub Action for CI integration

## Buildability
Weekend project for the core (log parsing + git correlation + basic reporting). Dashboard and multi-tool support adds another weekend.

## Monetization
- OSS core (local CLI + basic reports)
- Cloud tier: team dashboards, budget alerts, org-wide reporting
- GitHub Marketplace app for automatic PR cost comments

## Validation Signals
- GitHub's own blog post about token billing got massive engagement
- r/github and HackerNews threads full of "how do I track which PRs are expensive?"
- tokencost.app exists specifically because people care about AI costs
- Multiple "AI coding cost calculator" articles trending in May 2026

## Status: VALIDATED — ready to build
