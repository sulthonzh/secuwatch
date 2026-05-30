# Agent File Guard (agentguard)

## The Gap

Look at GitHub trending right now: ECC (198k stars), Claude plugins official (28k), Cursor plugins (1.2k), oh-my-pi (8.4k), Microsoft agent-governance-toolkit (3.3k). Everyone is running multiple AI coding agents simultaneously — Claude Code in one terminal, Cursor in the IDE, Copilot in VS Code, maybe Codex on the side.

**Nobody is coordinating file access between them.**

When two agents edit the same file simultaneously, you get:
- Silent overwrites (one agent clobbers the other's changes)
- Merge conflicts that the agent doesn't know how to resolve
- Broken code because agent A depended on agent B's incomplete edit

This is the **multi-agent coordination problem** for local dev, and it's going to get 10x worse in the next 6 months as teams run 3-5 agents per developer.

## The Tool: agentguard

A lightweight file-level lock service for AI coding agents running on the same machine.

**How it works:**
- Runs as a tiny local daemon (WebSocket or IPC)
- Agents (or their plugins) acquire/release locks on files before editing
- If file is locked by another agent → queue or reject with context about who's editing
- Deadlock detection + auto-release after timeout
- Works with Claude Code, Cursor, Copilot, Codex, any agent that follows the protocol

**MVP (weekend build):**
1. Local lock server (Node.js, ~200 LOC)
2. CLI: `agentguard lock src/auth.ts --agent claude-code --reason "refactoring auth"`
3. MCP plugin so Claude Code / Cursor can auto-acquire locks
4. Status dashboard: `agentguard status` shows who's touching what

**Why it matters now:**
- ECC (198k stars) literally optimizes multi-agent harnesses — but no file coordination
- Microsoft's agent-governance-toolkit focuses on enterprise security, not local file conflicts
- Cursor + Claude Code + Copilot all running simultaneously is already common
- Every "agent harness" tool ignores this problem

## Validation

- **Demand signal:** High — every developer running 2+ agents hits this
- **Competition:** None. Found zero tools for local multi-agent file coordination
- **Weekend buildable:** Yes. Core is a lock server + MCP plugin
- **Monetization:** Free OSS core, paid team features (multi-machine, analytics)
- **Viral potential:** High — solves an immediate pain every multi-agent user feels

## Score: 8/10

- Real pain point that's getting worse fast
- Zero competition in this specific niche
- Tiny MVP scope
- Natural integration point with existing agent ecosystems (MCP, plugins)
- Risk: requires agent ecosystem buy-in, but MCP makes adoption easy
