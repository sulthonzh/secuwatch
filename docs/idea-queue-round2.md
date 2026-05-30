# Open-Source Idea Queue — Round 2

_Last updated: 2026-05-24_

_Queue 1 complete. 25 ideas researched, 1 BUILD candidate (sahamcli, 22/30)._
_Generated 20 new ideas based on research patterns and developer pain points._

## Research Queue

### Round 5: Regional/Niche Developer Tools (High Uniqueness)
- [ ] MCP server template/boilerplate generator — MCP is exploding, no good starter template
- [ ] Indonesian KTP/NIK validator library — parse NIK to extract DOB, gender, region
- [ ] Indonesian bank account validator — verify bank code + account format for major banks
- [ ]东南亚 e-invoice generator CLI — Faktur Pajak, e-Bupot, e-Filing automation
- [ ] Ollama model benchmark runner — compare local models on standardized tasks, output JSON

### Round 6: Developer Experience (DX) Tools
- [ ] CLI tool to generate API documentation from TypeScript types — zero-config
- [ ] Git stash organizer — search, tag, and manage git stashes with descriptions
- [ ] npm dependency health checker — audit for deprecated, abandoned, or risky packages
- [ ] JSON log viewer CLI — pretty-print, filter, and tail structured JSON logs
- [ ] SSH config manager — organize, search, and sync SSH configs across machines

### Round 7: Data & Utility
- [ ] CSV/Excel to JSON schema inferencer — analyze data files, generate TypeScript types
- [ ] CLI tool for managing .env across multiple environments — dev/staging/prod sync
- [ ] Web scraper DSL — declarative YAML config for scraping, no code required
- [ ] Database diff tool — compare schemas between two databases, generate migration SQL
- [ ] Markdown changelog generator from conventional commits — better than standard-version

### Round 8: AI Developer Tools (Niche Angles)
- [ ] LLM response cache proxy — cache AI responses locally, save API costs during dev
- [ ] AI token counter CLI — count tokens in files/pipes before sending to LLM
- [ ] Ollama model manager — download, organize, prune, and update local models
- [ ] Prompt version diff tool — compare two prompts and see semantic differences
- [ ] AI code migration assistant — migrate code between frameworks (e.g., Express → Hono)

## Completed Research (All Rounds)

See previous queue for full history. Summary:
- 25 ideas researched across 4 rounds
- 24 killed (saturated, no demand, or too complex)
- 1 BUILD candidate: **sahamcli** (IDX stock data CLI, 22/30)

## Key Patterns from Round 1 Research

| Pattern | Implication |
|---------|-------------|
| Dev tool space is hyper-competitive | Avoid "yet another X" for any common task |
| Regional tools have real gaps | Indonesian/SEA developer tools are underserved |
| AI wrappers are crowded | Differentiate on domain, not AI |
| Official SDKs kill community tools | Don't build wrappers around official APIs |
| Zero existing tools often means zero demand | No competition AND no demand = dead end |
| TypeScript gap in Python niches | TS alternatives can capture npm ecosystem |
