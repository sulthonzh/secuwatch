last_cycle: 2026-05-31
status: completed
cycle_count: 29
recent_ideas: ["ai-prompt-regression-tester", "skill-conflict-detector", "agent-snapshot-test", "code-review-optimizer", "documentation-generator", "local-ai-copilot", "agent-orchestra-manager", "jsonl-agent-logger", "ai-model-monitor-drift-detector", "ai-tool-fatigue-manager", "ai-safety-alignment-toolkit", "ai-agent-orchestrator", "multi-platform-skill-adapter", "local-mock-api-factory", "local-stack-orchestrator", "dev-env-snapshot-diff", "polyrepo-sync-checker", "agent-file-guard", "tokencost", "agent-activity-hub", "skillguard", "ai-cost-attribution-per-pr"]
research_topics: ["AI debugging tools", "developer experience", "code review optimization", "documentation", "local AI development tools", "multi-agent systems", "agent observability", "AI model evaluation", "prompt engineering", "AI safety tools", "AI model monitoring and drift detection", "AI tool fatigue and workflow management", "AI agent orchestration", "specialized AI crawling", "code-to-knowledge integration", "AI coding tool skill/plugin ecosystem", "API mocking and testing tools", "local development environment management", "microservices dev tooling", "polyrepo config drift management", "multi-agent file coordination", "multi-agent activity visibility", "agent behavior regression testing", "agent skills security auditing", "AI coding cost observability", "AI code quality and rework analytics", "AI cost attribution per git unit of work"]
last_idea: ai-cost-attribution-per-pr (VALIDATED — no OSS tool breaks down AI coding costs per PR/feature/repo, and Copilot token billing launches literally tomorrow June 1 2026)
new_gaps: ["zero-dependency agent logging", "AI model evaluation tools", "prompt engineering optimization", "AI safety and alignment tools", "low-code AI integration", "AI model fine-tuning tools", "production AI model monitoring", "unified AI workspace", "AI governance frameworks", "specialized content crawling", "workflow-integrated knowledge graphs", "cross-platform AI coding skill compilation", "smart relational mock APIs from specs/types", "lightweight local microservice orchestration", "polyrepo config drift detection", "multi-agent file lock coordination", "cross-agent runtime activity visibility", "agent session snapshot testing and behavior regression", "skill functional composition testing", "AI coding cost attribution per feature/PR", "cross-agent session portability"]
current_focus: AI cost attribution per git unit of work; skill ecosystem tooling beyond security
notes: |
  Cycle 29 (May 31 1:23 AM):
  
  NEW IDEA: ai-cost-attribution-per-pr — per-PR/feature AI coding cost breakdown tool
  
  Timing is PERFECT:
  - GitHub Copilot switches to token-based AI Credits billing on June 1, 2026 (literally tomorrow)
  - Teams will suddenly need visibility into which PRs/repos/features burn through credits
  - No OSS tool exists for per-PR AI cost attribution
  - tokencost.app only does per-model estimates, not git-level attribution
  - GitHub's billing dashboard is org-level only, no repo/PR breakdown
  
  Competition check:
  - tokencost.app: model cost calculator, no git integration
  - GitHub billing: org-level only
  - WakaTime: time tracking, not cost
  - agentblame: code attribution, not cost
  
  Gap is REAL and TIMELY. Idea documented at oss-ideas/ai-cost-attribution-per-pr.md
  
  Also found: Microsoft has a Skill Testing Framework for Copilot SDK (acceptance criteria validation for SKILL.md files). This partially fills the skill composition testing gap but is Copilot-specific. Cross-agent skill testing is still unaddressed.
  
  Previous validated ideas still standing:
  1. codechurn-oss (AI code rework tracker) — no competitor
  2. prompt-bisect (prompt regression tester) — Promptfoo doesn't do CI drift
  3. ai-cost-attribution-per-pr (NEW) — no competitor, perfect timing
  
  Skill ecosystem update:
  - Microsoft Skill Testing Framework exists for Copilot — validates the skill testing direction but is vendor-locked
  - Cross-agent skill functional testing still wide open
  
  No notification this cycle — late night weekend, but this cost attribution idea is strong enough to surface next cycle or when human is active.

  Cycle 28 (May 31 12:23 AM):
  
  MAJOR UPDATE: skillsecurity gap is now CLOSED. Three serious players launched:
  - Cisco AI Defense: skill-scanner (GitHub, open source) — YAML+YARA patterns + LLM-as-judge + dataflow analysis
  2. Snyk: Agent Scan / Skill Inspector — free web tool, ToxicSkills audit (scanned 3,984 skills)
  3. SkillScan.dev — skill certification platform
  4. OWASP: Agentic Skills Top 10 project launched
  
  skillguard is now INVALID — market is well-served by enterprise players.
  
  skill-conflict-detector: SpecWeave (anton-abyzov/specweave) is building skill contradiction resolution. Still early (docs only), but signal that gap is narrowing. Also a dependency-resolver skill exists on multiple registries.
  
  Remaining validated ideas still standing:
  1. codechurn-oss (AI code rework tracker) — still no competitor for post-merge AI code lifecycle
  2. prompt-bisect (prompt regression tester) — Promptfoo doesn't do CI drift detection
  
  New areas to explore next cycles:
  - Skill composition/functional testing (not security, but does the skill actually work correctly?)
  - AI agent cost attribution per feature/PR (tokencost adjacent but finer-grained)
  - Cross-agent session portability tooling
  
  No notification this cycle — late night weekend, no breakthrough to share.
