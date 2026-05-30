# Open-Source Lab — 24/7 Autonomous Builder

**Mission:** Research, design, build, and publish useful open-source projects continuously.

**Philosophy:**
- Build tools people actually need (not clones of existing tools)
- Ship fast, iterate based on real usage
- Every project gets: GitHub repo, docs, LICENSE, CI/CD
- Focus on developer tools, CLI utilities, libraries, and micro-frameworks

## Pipeline

```
Idea Research → Validate → Build → Test → Publish → Maintain
     ↓             ↓          ↓       ↓        ↓         ↓
  ideas/      validate   projects/  test   GitHub    watch stars
              + web            + code        + docs   + issues
```

## Directory Structure

```
open-source-lab/
├── README.md
├── docs/
│   ├── pipeline.md          # Pipeline tracker
│   ├── idea-queue.md        # Research queue
│   └── knowledge-base.md    # Lessons & patterns
├── ideas/                   # Research docs per idea
├── projects/                # Built projects (each is a git repo)
└── templates/               # Scaffolding templates
```

## Tech Stack Preferences

- **Languages:** TypeScript/Node.js, Python, Rust (if performance critical)
- **Framework:** Next.js for web apps, plain TS for libraries
- **Package:** npm/pip publishable
- **CI:** GitHub Actions
- **License:** MIT (default)

## Evaluation Criteria (per idea)

| Criteria | Weight | Description |
|----------|--------|-------------|
| Usefulness | 25% | Does it solve a real pain point? |
| Uniqueness | 20% | Does something similar exist? Is our angle different? |
| Buildability | 20% | Can 1 person build it in 1-2 weeks? |
| Community Appeal | 15% | Will developers want to star/fork/use it? |
| Maintenance Cost | 10% | Low ongoing maintenance needed? |
| AI Leverage | 10% | Can AI help build/maintain it? |
