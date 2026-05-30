# Multi-Platform Skill Adapter

**Date:** 2026-05-29
**Status:** Researched
**Confidence:** High

## The Problem
AI coding tools each have their own skill/plugin format:
- Claude Code → CLAUDE.md / skill files
- Codex → Codex skill format
- Cursor → .cursorrules
- Gemini CLI → Gemini skill format
- Kiro, Hermes, OpenCode, AntiGravity → each their own thing

The cybersecurity skills repo (11.8k stars) explicitly lists "20+ platforms" compatibility. That means maintaining 20+ versions of the same skill. "taste-skill" and "stop-slop" both exist as separate per-platform variants.

## The Opportunity
A **universal skill adapter** — write your skill once in a neutral format, compile to any platform. Like Babel for AI coding tool skills.

## Why Now
- Anthropic just launched official plugin directory (28.5k stars)
- Claude Code plugins are the hottest thing on GitHub this week
- Multiple "skill" repos are trending simultaneously
- The ecosystem is fragmenting FAST — standardization moment

## Validation
- 20+ platforms need skills (from Anthropic-Cybersecurity-Skills README)
- "taste-skill" has 27k stars — people clearly want cross-platform skills
- "stop-slop" 6.7k stars — same pattern
- Every new AI coding tool adds its own format

## Competition
- Nobody is doing this yet. Each platform expects you to write native format.
- Some skills manually claim "works with X, Y, Z" but it's copy-paste, not compiled.

## Monetization
- Registry/marketplace for skills (like npm but for AI coding tool skills)
- Premium skill validation/testing CI
- Enterprise: custom skill pipelines for teams

## Weekend Buildable?
Yes. MVP: a YAML-based skill definition + compilers for top 5 platforms (Claude Code, Codex, Cursor, Gemini CLI, Copilot). Could ship in 2 days.

## Risk
- Platforms might standardize on their own (Anthropic could release a universal format)
- But history says they won't — each wants lock-in
- First mover advantage is real here

## Score: 8/10
Huge demand signal, no competition, buildable fast, clear monetization. The only risk is platform-level standardization, which is unlikely given incentives.
