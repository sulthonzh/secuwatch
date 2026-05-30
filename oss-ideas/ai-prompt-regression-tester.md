# AI Prompt Regression Tester (prompt-bisect)

## The Problem
When OpenAI, Anthropic, Google update their models, your carefully-tuned prompts silently break or change behavior. There's no CI for prompts. Teams find out days later when outputs drift.

## Evidence
- Every model update thread on HN/Reddit: "our prompts broke after gpt-4o update"
- LangChain, DSPy exist for prompt management but not regression testing
- Promptfoo exists (2.8k★) but focuses on evaluation/benchmarking, not CI regression
- No OSS tool watches your prompt outputs over time and alerts on behavioral drift

## Competition
- **Promptfoo** (2.8k★) — evaluation framework, good but not CI-native, not "watch and alert"
- **DSPy** — prompt optimization, different problem
- **LangSmith** — commercial observability, expensive, not regression-focused
- **Helicone** — commercial logging, not regression testing

## Gap
An OSS tool that:
1. Snapshots prompt + expected output pairs ("golden set")
2. Runs on CI (GitHub Action) every time model provider updates
3. Diffs semantic output changes (not just string diff — embedding similarity)
4. Alerts on drift with before/after examples
5. Supports bisecting: "which prompt changed and when?"

## Why Now
- Multi-model is standard — teams run GPT-4o + Claude + Gemini in prod
- Model updates are opaque and frequent (monthly)
- No one tests prompts like they test code, but the impact is identical

## Buildability: Weekend MVP
- Core: snapshot JSON files + OpenAI embeddings for semantic diff
- GitHub Action wrapper for CI
- ~500 lines of TypeScript

## Monetization
- OSS core (self-hosted)
- Cloud: managed golden sets, team dashboards, Slack alerts
- Enterprise: compliance audit trail for prompt changes

## Score: 8/10
Real pain, no direct OSS competitor, buildable fast, clear SaaS angle.
