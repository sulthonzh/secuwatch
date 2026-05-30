# Agent Snapshot Testing (agentsnap)

**Date:** 2026-05-30
**Score:** 8/10

## Problem
When you update an AI coding agent's skills, prompts, or model, you have NO way to know if its behavior regressed on your codebase. Existing eval tools (DeepEval, Promptfoo, Inspect AI) test LLM outputs in isolation. Nobody does snapshot-style behavior regression testing for coding agents against real repos.

You upgrade from Claude Sonnet to Opus, swap a skill, or tweak a system prompt — and suddenly your agent starts missing edge cases, using wrong patterns, or hallucinating imports. You only find out when it breaks something in production.

## Gap Evidence
- Eval frameworks (LangSmith, Braintrust, Helicone, Phoenix, Promptfoo/now OpenAI) all focus on prompt-level eval, not agent session-level regression
- codegraph (21K stars) proves devs care about agent context optimization
- addyosmani/agent-skills holding monthly chart — skill compositions change constantly with no validation
- 6 of top 10 trending repos are local-first / on-device — devs want this running locally
- Zero OSS tools for "replay an agent session against a new config and diff the results"

## Idea: agentsnap
A CLI that records coding agent sessions (tool calls, file reads/writes, decisions) as JSONL, then replays the same task against a new model/skill config and diffs the behavior.

```
agentsnap record --agent codex --task "add auth middleware"
# → saves session to .agentsnap/auth-middleware.jsonl

agentsnap replay --agent codex --config new-skills/ --task "add auth middleware"
# → runs same task, compares results

agentsnap diff --baseline .agentsnap/auth-middleware.jsonl --current .agentsnap/auth-middleware-latest.jsonl
# → shows: tool calls changed, files touched different, tokens used, time taken
```

## Why Buildable in a Weekend
- Core is JSONL ingestion + diff engine (most coding agents already output JSONL)
- Wrap existing agent CLIs, don't need to modify them
- Diff logic is straightforward (compare tool call sequences, file changes, errors)
- MVP: record via agent stdout/stderr, replay via subprocess, diff via JSON comparison

## Monetization
- OSS core CLI (MIT)
- Cloud tier: team-wide snapshot history, CI integration, regression alerts
- Enterprise: compliance trails for regulated industries (financial services, healthcare)

## Competition
- **Promptfoo** — prompt-level eval, not session-level. Acquired by OpenAI.
- **DeepEval** — LLM metric eval (faithfulness, relevance), not agent behavior regression
- **LangSmith** — tracing/observability, no replay/diff
- **Inspect AI** — model eval framework, not agent session regression

None do what agentsnap does. The gap is real.

## Risks
- Agent output is non-deterministic, so "exact diff" won't work — need semantic diff (LLM-powered comparison)
- Need to support multiple agent formats (Codex, Claude Code, Cursor, OpenCode)
- Market might be early — teams using agents at scale are still emerging

## Related Gaps
- Agent behavior CI/CD (run agentsnap in your pipeline)
- Skill compatibility matrix (which skill combos produce regressions)
