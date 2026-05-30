# Idea: local-stack-orchestrator

## Problem
Every dev working with microservices has the same pain: "I need to run 6 services locally to test one feature." Docker Compose kinda works but it's static — no smart startup ordering, no dependency-aware hot reload, no per-service env switching. Tilt, Skaffold, and Telepresence exist but they're Kubernetes-bound and heavy. Nobody has a lightweight, zero-config local orchestrator that just works.

## Evidence
- GitHub trending shows grpc-rust, containerd, perspective, Nango all trending — infra complexity is growing
- Backstage exists but it's a full portal framework, overkill for solo/small teams
- Docker Compose has 36k+ stars but everyone complains about the dev experience (no hot reload, slow rebuilds, unclear service dependency management)
- Tilt (8.5k stars) and Skaffold (15k stars) are K8s-only
- No good middle ground: "I have 4-8 services and just want them running with smart defaults"

## Gap
A lightweight CLI that:
1. Reads your repo structure (or a simple config) to discover services
2. Starts them with smart dependency ordering (based on imports/API calls, not manual `depends_on`)
3. Hot-reloads only what changed
4. Provides a single dashboard showing all service health, logs, and ports
5. Works without Docker/K8s — just processes + port management
6. Zero config for monorepos (auto-detects package.json, Cargo.toml, go.mod, etc.)

## Why Now
- Microservices are standard but local dev tooling hasn't caught up
- Solo devs and small teams are priced out of K8s-based solutions
- The "just use Docker Compose" answer keeps getting weaker as stacks get more complex

## Monetization
- Open source core, cloud sync for team shared configs (paid)
- Marketplace for service templates

## Buildable in a weekend?
First version (auto-detect + start + health dashboard): yes, 2-3 days
Full version with dependency graph and hot reload: ~2 weeks

## Competition
- Docker Compose — static, no smart defaults
- Tilt — K8s only, heavy
- Skaffold — K8s only, Google-maintained but complex
- Foreman/Honcho — Ruby/Python only, very basic
- concurrently/npm-run-all — Node only, no health monitoring

## Score: 8/10
Real pain point, clear gap, buildable MVP, underserved market segment (small teams, no K8s).
