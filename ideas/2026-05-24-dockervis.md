# dockervis - Terminal Dashboard for Docker Containers

## One-Liner
A modern TypeScript terminal dashboard for Docker containers, providing real-time monitoring and management with a lightweight alternative to the outdated ctop tool.

## Problem (with evidence URLs)
Docker developers struggle with monitoring containers using outdated terminal tools. ctop (14k⭐, last updated 2022) shows its age with unmaintained code, poor TypeScript integration, and limited features. The need for a modern, maintained terminal dashboard is evident from:

- Docker's continued growth and adoption in development workflows
- lazydocker's popularity (35k⭐) proving demand for terminal-based Docker tools
- Containerized development becoming standard across platforms
- Legacy tools like ctop failing to keep up with Docker API changes

## Existing Solutions & Gaps (star counts)
- **ctop** (14,095⭐) - Last updated 2022, Go-based, unmaintained
- **lazydocker** (35,482⭐) - Go-based, comprehensive but complex (full management vs monitoring)
- **docui** (1,298⭐) - Rust-based, focuses on container creation/management, not monitoring
- **portainer** (28,963⭐) - Web-based GUI, not terminal-focused

**Gaps identified:**
1. **No modern TypeScript alternative** - All major tools use Go/Rust, missing npm ecosystem advantages
2. **Monitoring-only focus** - lazydocker is feature-heavy; a lightweight monitoring-only tool is needed
3. **API compatibility** - ctop incompatible with newer Docker APIs (Docker v29+)
4. **Modern UX patterns** - Lack of keyboard shortcuts, real-time metrics, and clean interfaces

## Our Angle
dockervis provides a **lightweight, TypeScript-based monitoring dashboard** that:
- Targets the monitoring-only use case (vs lazydocker's full management)
- Uses modern Docker APIs (v24+) for compatibility
- Leverages npm ecosystem for easy installation and updates
- Provides a focused, clean interface for quick container status checks
- Implements TypeScript for type safety and better developer experience

## Security Assessment
**Attack Surface:** Low - reads only Docker API, writes minimal container operations
**Data Handled:** Container names, IDs, resource usage, status information
**Controls:** Requires Docker socket access (standard security practice)
**CVEs:** None found in similar tools; standard Docker API usage is safe

**.env.example:**
```bash
DOCKER_HOST=unix:///var/run/docker.sock
DOCKER_API_VERSION=auto
REFRESH_INTERVAL=2000
```

**.gitignore:**
```bash
node_modules/
dist/
*.log
.env.local
.env.development.local
.env.test.local
.env.production.local
```

## Technical Design
### Architecture
- **Core:** Node.js runtime with TypeScript
- **Docker API:** Official Docker SDK for Node.js (`dockerode`)
- **UI:** Terminal interface using `blessed` or `ink` for rich TUI
- **Real-time:** Event-driven updates via Docker API streams

### API/CLI Examples
```bash
# Installation
npm install -g dockervis

# Basic usage
dockervis

# Filter by container state
dockervis --filter running

# Monitor specific containers
dockervis --include app,db,web

# Export metrics to JSON
dockervis --export metrics.json

# Auto-detect Docker socket
dockervis --detect
```

### Core Features
1. **Real-time container list** with status, CPU, memory, network usage
2. **Interactive filtering** by name, status, labels
3. **Container details** on-demand (inspect functionality)
4. **Resource usage graphs** with ASCII art
5. **Quick actions** (restart, stop, remove, logs) via keyboard shortcuts
6. **Auto-refresh** with configurable intervals

## Competition Matrix
| Tool | Language | Stars | Focus | Last Update | TypeScript Gap |
|------|----------|-------|-------|-------------|---------------|
| dockervis | TypeScript | 0 (proposed) | Monitoring-focused | 2026 | ✅ Built-in TS |
| ctop | Go | 14k | Monitoring | 2022 | ❌ Go only |
| lazydocker | Go | 35k | Full management | 2025 | ❌ Go only |
| docui | Rust | 1.3k | Creation/management | 2024 | ❌ Rust only |
| portainer | Go | 29k | Web GUI | 2025 | ❌ Go only |

## Build Estimate
- **Phase 1 (MVP):** Basic container listing, status display, resource usage - 5 days
- **Phase 2:** Interactive filtering, keyboard shortcuts, real-time updates - 3 days  
- **Phase 3:** Container actions (restart, stop), export functionality - 2 days
- **Total:** 10 days for full-featured release

## Score Card /35
| Criteria | Score | Rationale |
|----------|-------|-----------|
| **Clear Gap** | ✅ 8/8 | No modern TypeScript alternative; ctop outdated, lazydocker too complex |
| **Demand Evidence** | ✅ 7/7 | 35k+ stars for lazydocker proves terminal Docker tool demand |
| **Build Time** | ✅ 6/7 | 10 days reasonable for focused monitoring tool |
| **Standalone Value** | ✅ 6/7 | Monitoring-only focus creates clear differentiation from lazydocker |
| **Security** | ✅ 6/7 | Low attack surface, standard Docker API usage |
| **Total Score** | **33/35** | **BUILD** |

### Key Success Factors
1. **Lightweight vs. comprehensive** - Stay focused on monitoring, avoid scope creep
2. **TypeScript advantages** - Leverage npm ecosystem, type safety, developer experience
3. **Modern API compatibility** - Support current Docker versions (v24+)
4. **Clean interface** - Prioritize readability over feature density

## Implementation Notes
- Use `dockerode` for Docker API compatibility
- Consider `blessed` for terminal UI (battle-tested, event-driven)
- Implement proper error handling for Docker socket permissions
- Add Docker Swarm support for multi-container environments
- Include configuration file for customization (hot-reloadable)