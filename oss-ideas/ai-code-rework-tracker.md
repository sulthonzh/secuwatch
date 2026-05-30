# AI Code Rework Tracker (working name: codechurn-oss)

## The Gap
Teams using AI coding tools have NO open-source way to measure if AI-generated code is actually good or just gets reverted/rewritten later.

## Validation
- Exceeds AI (commercial) built entire business around this: AI code has 1.7x more issues, 2.74x more security vulns, 68% more incidents per PR
- git-ai (947★, Rust) does attribution (which AI wrote what) but NOT quality tracking
- agent-coordinator handles cross-tool context but not post-merge quality
- CodeRabbit does PR review but not long-term outcome tracking
- Stack Overflow 2025: 66% of devs frustrated with "almost right" AI code
- NO open-source tool does: attribution + churn + revert rate + quality correlation

## What It Does
1. Reads git history, attributes code to AI vs human (via git-ai or commit conventions)
2. Tracks what happens to AI-touched lines over time (reverted? rewritten? caused bugs?)
3. Generates "AI quality report" — your AI code has X% revert rate vs Y% for human code
4. Per-model breakdown: Claude vs GPT vs Copilot quality comparison
5. Flags "high churn AI files" — code AI keeps rewriting

## Why Buildable in a Weekend
- Core is just git blame + diff analysis + some heuristics
- git-ai provides attribution, we just need the analytics layer on top
- CLI tool, zero config, run against any repo

## Monetization
- OSS core (single repo analysis)
- Paid: team dashboards, org-wide trends, CI integration

## Competition
- Exceeds AI: commercial only, enterprise pricing
- LinearB/Jellyfish: metadata only, not AI-aware
- git-ai: attribution only, no quality metrics
- Nobody does this open source

## Status: VALIDATED, OPEN GAP
