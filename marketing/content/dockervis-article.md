---
title: "I Use lazydocker for Everything — Except When I Don't"
published: false
description: "A focused TypeScript terminal dashboard for Docker monitoring that does one thing well: show you what's running and let you act on it fast."
tags: docker, typescript, terminal, devtools
cover_image: 
---

I love lazydocker. Honestly, Jesse Duffield built something special — it's the first thing I install on a new machine. But here's the thing: 90% of the time I open it, I just want to check if my containers are healthy. I don't need to browse image layers, scroll through compose configs, or dig into volume mounts. I just want the pulse check.

And sometimes lazydocker feels like opening a control room when you just need a dashboard.

So I built [dockervis](https://github.com/sulthonzh/dockervis). It's a terminal dashboard that does one thing: show you what your Docker containers are doing, right now, and let you act on it with a single keypress.

## The Problem I Was Solving

My typical workflow looks like this:

1. Start 4-5 containers with docker compose
2. Something feels off — API is slow, or a cron job might've crashed
3. Open terminal, type `docker ps`, squint at the truncated output
4. Copy a container ID, run `docker stats --no-stream`
5. Realize it was the wrong container
6. Repeat

`docker stats` is fine but it's a firehose. `docker ps` doesn't show resource usage. And jumping between them gets old fast when you're debugging at 2 AM.

lazydocker solves this, but it also shows me every image, every volume, every compose file — when I just want to know if my app container is eating all the RAM again.

## What dockervis Does

```bash
npm install -g dockervis
dockervis
```

That's it. You get a live dashboard:

```
┌─────────────────────────────────────────────────────────────┐
│ dockervis - Docker Container Dashboard                      │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│ ● app (running)           CPU: 1.2%                        │
│ ● db (running)            Memory: 256 MB / 512 MB (50.0%)  │
│ ○ web (exited)            Network RX: 1.2 GB               │
│ ● redis (running)         Network TX: 512 MB               │
│                                                             │
└─────────────────────────────────────────────────────────────┘
q: Quit | r: Refresh | s: Stop | R: Restart | d: Delete
```

Every container, its state, CPU, memory, and network — updated live. No mouse needed. No panels to navigate. Just the info.

## The Keyboard Shortcuts That Actually Matter

Here's the part I use most. When something's stuck:

- Press `j` to move to the container
- Press `R` to restart it
- Done

Or when a container exited and I want it gone:
- Move to it with `k`/`j`
- Press `d` to delete it

The full set:

| Key | What it does |
|-----|-------------|
| `j` / `↓` | Move down |
| `k` / `↑` | Move up |
| `s` | Stop container |
| `R` | Restart container |
| `d` | Delete (exited only) |
| `r` | Force refresh |
| `q` | Quit |

vim-style navigation because, well, muscle memory.

## Filtering When You Have Too Many Containers

On my work machine I have like 20 containers. Most of them are from old projects I forgot to clean up. I don't need to see all of them.

```bash
# Only show running ones
dockervis --filter running

# Focus on specific services
dockervis --include app,db,redis

# Hide the noise
dockervis --exclude test,ci
```

The `--exclude` flag is my favorite. I have a bunch of test containers that I never touch — filtering them out makes the dashboard actually useful.

## Exporting Metrics (Because Sometimes You Need Proof)

Sometimes you need to show someone "hey, this container has been eating 80% CPU for three days." Or you want to log metrics over time.

```bash
# JSON export
dockervis --export metrics.json

# CSV if you need to throw it in a spreadsheet
dockervis --export metrics.csv --export-format csv
```

I use this in CI sometimes — run it once, dump to JSON, parse with `jq` in a health check script. Not glamorous but it works.

## Why TypeScript (And Not Go Like Everyone Else)

Most terminal Docker tools are written in Go — lazydocker, ctop, docui. Nothing wrong with Go. But I write TypeScript all day. When I want to fix something or add a feature, I want to do it in the language I'm fastest in.

dockervis uses:
- **dockerode** for the Docker API — battle-tested, well-documented
- **blessed** for the terminal UI — same library lazydocker uses under the hood (via tview/bubbletea equivalents)

The result is a tool that TypeScript/Node developers can actually contribute to without learning a new language. And the install is just `npm install -g` — no Go toolchain needed.

## When I Still Reach for lazydocker

I'm not going to pretend dockervis replaces lazydocker for everything. If I need to:
- Browse Docker Compose configs
- Inspect image layers
- Manage volumes and networks
- Read container logs in detail

...I still use lazydocker. It's the better Swiss Army knife.

But for the 5-second "is everything okay?" check? Or the "restart that one container real quick" moment? dockervis is faster. Less noise, less cognitive load.

## Quick Setup

```bash
# Install
npm install -g dockervis

# Make sure you have Docker socket access
sudo usermod -aG docker $USER
# (log out and back in)

# Run it
dockervis
```

If you want to tweak the refresh rate:
```bash
dockervis --interval 5000  # 5 seconds instead of default 2
```

And if Docker is running on a remote host:
```bash
DOCKER_HOST=tcp://192.168.1.100:2375 dockervis
```

## The Code

It's open source, MIT licensed: [github.com/sulthonzh/dockervis](https://github.com/sulthonzh/dockervis)

Issues and PRs welcome. Especially if you find bugs — I mainly tested this on my own machine (macOS + Docker Desktop), so Linux and Windows reports would be helpful.

---

*Building developer tools is my thing. Check out my other projects at [github.com/sulthonzh](https://github.com/sulthonzh)*
