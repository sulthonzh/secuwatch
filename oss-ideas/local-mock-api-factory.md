# local-mock-api-factory

**One-liner:** Spin up a realistic mock API server from your OpenAPI spec / TypeScript types in 5 seconds, with smart relationships and realistic fake data. Zero config.

## The Gap

GitHub trending is drowning in AI agent tools (codegraph, agentmemory, ruflo, 9router — all 15k+ stars). But for boring everyday dev work like testing against APIs? Still sucks.

Current options:
- **json-server** (70k+ stars) — but it's a flat JSON file, no relationships, no types, last meaningful update was years ago
- **msw** (16k stars) — great for frontend mocking but you write every handler by hand
- **prism** (Stoplight) — validates against OpenAPI but generates boring data, no smart relationships
- **wiremock** — JVM-heavy, overkill for most frontend/fullstack devs

Nobody does: "give me a spec or type file → get a running server with realistic, relational data."

## Why Now

- The TypeScript ecosystem explosion means everyone has types already defined
- OpenAPI specs are everywhere but underutilized for dev workflows
- The "vibe coding" era means people prototype fast but stub APIs poorly
- AI agents (cursor, claude code, codex) could generate specs automatically — this could be their companion tool

## What It Does

1. `npx mock-factory ./openapi.yaml` → running server on :3001
2. Auto-generates realistic data with relationships (user has posts, posts have comments)
3. Respects constraints from OpenAPI/JSON Schema (enums, ranges, formats)
4. Supports CRUD out of the box with proper HTTP methods
5. Persist to file or keep in-memory
6. Delay simulation, error simulation flags
7. TypeScript types mode: point at your `types/` folder → instant API

## Monetization

- Core is OSS (MIT)
- Cloud version: share mock APIs with your team, persist across environments
- IDE extension: VS Code integration for visual editing of mock data
- Enterprise: compliance-ready test data (GDPR-safe fake PII)

## Buildable in a Weekend?

Yes. V1 is essentially:
- Parse OpenAPI/TS types
- Generate realistic data (use faker.js)
- relationships from `$ref` and naming conventions
- Spin up express/hono server with CRUD routes
- CLI with npx support

Maybe 2-3 days for a solid v1.

## Competition Risk

Low. json-server is the incumbent but hasn't innovated. MSW serves a different use case. Nobody owns the "spec → mock server" flow with smart data.

## Stars Estimate

Realistic: 2k-5k in first month if positioned well.
Potential: 10k+ if it becomes the default for API mocking in the TypeScript ecosystem.
