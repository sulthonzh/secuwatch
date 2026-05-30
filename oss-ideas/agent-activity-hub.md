# Agent Activity Hub — "agentfeed"

## The Problem

Developers now run 3-5+ AI coding agents simultaneously (Claude Code, Codex, Cursor, Copilot, Gemini CLI, oh-my-pi, etc). Each writes to its own logs, its own format, its own terminal. There's zero unified visibility into what all your agents are doing right now.

You switch between terminal tabs wondering: "wait, which agent touched that file? did cursor just overwrite what claude wrote?"

## The Gap

- **Zero tools** exist for local, cross-agent activity aggregation
- GitHub search for unified agent activity feed: **0 results**
- Microsoft's agent-governance-toolkit (3.3k stars) is enterprise/policy, not dev productivity
- ECC (198k stars) optimizes single agents, doesn't coordinate across them
- agnix lints config files but doesn't show runtime activity

## The Idea: "agentfeed"

A lightweight local daemon that:
1. **Watches** file changes, git operations, and agent log outputs across all running AI agents
2. **Parses** activity from Claude Code, Codex, Cursor, Copilot, Gemini CLI (known output formats)
3. **Shows** a unified real-time activity feed in terminal (TUI) or web dashboard
4. **Detects conflicts** — "Claude just edited file X, but Cursor edited it 30s ago"
5. **Timeline view** — what each agent did, when, to what files

## Why Now

The multi-agent dev explosion just happened. Look at trending:
- ECC: 198k stars (agent optimizer)
- Understand-Anything: 44k (code graphs for agents)  
- CodeGraph: 33k (same)
- Claude plugins official: 28k
- Cursor plugins: 1.2k
- oh-my-pi: 8.4k (terminal agent)

Everyone IS running multiple agents. Nobody can see what they're all doing.

## Competition

- **None** in the local dev productivity space
- Enterprise: ServiceNow "Agent Control Tower" exists but it's enterprise SaaS
- Observatory tools (Langfuse, etc.) focus on LLM calls, not file/code activity

## Buildability

**Weekend project.** Core loop:
1. File watcher (chokidar) — 2h
2. Git event listener — 1h
3. Agent output parsers (regex on known formats) — 4h
4. TUI feed (ink/blessed) — 3h
5. Conflict detection (file edit proximity) — 2h

Tech: TypeScript, Node.js, SQLite for history.

## Monetization

- OSS core (local TUI feed)
- Pro: team dashboard, cloud sync, alert rules ($10/dev/month)
- Enterprise: audit trail, compliance exports

## Score: 8/10

- Real pain: ✅ (every multi-agent user feels this)
- Buildable in weekend: ✅
- No competition: ✅
- Growing market: ✅ (agent ecosystem exploding)
- Monetization: ✅ (clear free/pro split)

## Validation Signals

- GitHub trending: 5+ agent tools with 8k+ stars each
- Multi-agent coordination is mentioned in Microsoft's governance toolkit rationale
- "agentguard" (our previous idea) solves file locking — this solves visibility, complementary
- Reddit/HN: devs complain about "which agent broke my code" but no tool addresses it
