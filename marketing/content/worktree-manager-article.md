---
title: "I Stopped Switching Git Branches — And Started Using Worktrees Instead"
published: true
description: "How git worktrees eliminated my context-switching hell, and the CLI I built to make them actually pleasant to use."
tags: git, productivity, cli, javascript
cover_image: 
---

I used to be a `git stash` person. You know the dance — you're halfway through a feature, someone pings you about a bug on main, and suddenly you're stashing, switching, fixing, switching back, popping, and praying the stash applies cleanly.

Then I discovered git worktrees. And then I discovered why nobody uses them — the UX is *awful*.

## The Problem With Branch Switching

Here's a typical afternoon for me:

- Working on `feature/payment-flow` in VS Code
- Production bug comes in, needs a hotfix on `main`
- Stash changes (12 files modified)
- `git checkout main`
- Apply hotfix, test, push
- `git checkout feature/payment-flow`
- `git stash pop` — conflict. Of course.
- Spend 20 minutes resolving stash conflicts that have nothing to do with my actual work

Multiply this by 3-4 context switches a day and I'm losing an hour just to git gymnastics.

## Git Worktrees: The Concept

Git worktrees let you have multiple checkouts of the same repo simultaneously. Each worktree is a directory with its own working tree and branch, but they all share the same `.git` database.

```bash
# Instead of switching branches, you just cd to a different directory
cd ~/projects/myapp              # main branch
cd ~/projects/worktrees/bugfix   # bugfix branch, fully checked out
```

No stashing. No switching. Your IDE stays open. Your node_modules are intact. Your brain stays in context.

The problem? The commands are verbose and there's no automation:

```bash
git worktree add ../worktrees/feature-x feature-x
cd ../worktrees/feature-x
npm install              # gotta reinstall deps
cp ../../myapp/.env .    # gotta copy env files manually
# oh and the directory structure is ugly
```

Every single time, same repetitive steps. And cleaning up? `git worktree remove ../worktrees/feature-x` — if you even remember where you put it.

## So I Built worktree-manager

I wanted worktrees to be as easy as switching branches. So I built [worktree-manager](https://github.com/sulthonzh/worktree-manager) — a zero-config CLI that handles the tedious parts.

```bash
npm install -g worktree-manager
```

One command to create a worktree *and* set it up:

```bash
wtm add feature/payment-flow
```

That's it. Under the hood, it:

1. Creates the worktree at `../worktrees/feature/payment-flow`
2. Detects your project type (Node.js, Python, Go, Rust)
3. Copies dependency files (package.json, lock files)
4. Copies environment files (.env, .env.local, .env.example)
5. Runs setup commands (npm install, pip install, etc.)

The path generation is smart — it strips prefixes like `feature/` or `bugfix/` and nests cleanly. You end up with a structure like:

```
projects/
├── myapp/                      # main
└── worktrees/
    ├── payment-flow/           # feature/payment-flow
    ├── hotfix-login-bug/       # hotfix/login-bug
    └── refactor-api/           # refactor/api
```

## The Commands That Actually Matter

### Listing what you have

```bash
wtm list
```

Shows all your worktrees with branch names and paths. The `--verbose` flag adds commit hashes and last modified times. Honestly I use this more than I should because I forget what I have open.

### Cleaning up

This is the one that sold me. `git worktree` doesn't have a great cleanup story. Worktrees accumulate, directories go stale, and you end up with zombie checkouts.

```bash
wtm clean
```

It scans for stale worktrees (ones where the branch was deleted but the directory still exists) and removes them. One command instead of manually hunting directories.

### Removing a specific worktree

```bash
wtm remove feature/payment-flow
# or with the branch too:
wtm remove --with-branch feature/old-experiment
```

### Jumping between worktrees

```bash
wtm cd feature/payment-flow
```

This one's simple but I use it constantly. Instead of remembering the full path, just reference the branch name.

## How the Project Detection Works

This was the part I spent the most time on, because it's what separates "yet another wrapper" from something that actually saves time.

The detector checks for marker files in order:

```typescript
// Node.js: package.json, package-lock.json, yarn.lock, pnpm-lock.yaml
// Python: requirements.txt, setup.py, pyproject.toml, poetry.lock
// Go: go.mod, go.sum
// Rust: Cargo.toml, Cargo.lock
```

For each detected project type, it knows which env files to copy and which setup commands to run. Node.js gets `npm ci` (or `npm install` if no lock file). Python gets `pip install -r requirements.txt`. You get the idea.

If you don't want the auto-setup (maybe you're doing something custom), there's a flag:

```bash
wtm add --skip-setup feature/experiment
```

## A Real Workflow Example

Here's how my afternoon looks now:

```bash
# Working on main, bug report comes in
wtm add hotfix/login-timeout
# → worktree created, deps installed, .env copied, ready to code

cd ../worktrees/hotfix/login-timeout
# Fix the bug, test, commit, push

cd ~/projects/myapp
# Back to main, still exactly where I left off

# Later, clean up
wtm remove --with-branch hotfix/login-timeout
```

No stashing. No context loss. The `node_modules` in my main checkout never got touched. My VS Code windows for both branches stay open simultaneously if I want.

## Why Not Just Use Multiple Clones?

Fair question. I tried that first. The problems:

- **Disk space**: Each clone duplicates `.git` (can be 100MB+ for large repos)
- **Divergence**: Clones drift apart. You forget to fetch in one, push in another
- **Branch confusion**: Which clone has the latest `main`? Did I push to the right remote?
- **No shared state**: Git hooks, config, refs are all separate

Worktrees share the git database. One remote, one set of branches, one `.git/config`. But multiple working directories.

## The One Catch

Worktrees aren't perfect. A few things to be aware of:

1. **You can't have the same branch checked out in two worktrees** — this is a git limitation, not a tool limitation
2. **Some tools get confused** — older IDEs might not understand worktrees well (modern VS Code handles them fine)
3. **Path-based tooling** — if you have scripts that hardcode paths, they'll break in worktrees (use `git rev-parse --show-toplevel`)

## Wrapping Up

If you context-switch between branches more than twice a day, worktrees will save you real time. And if the raw git commands feel too manual, [worktree-manager](https://github.com/sulthonzh/worktree-manager) handles the boring parts.

```bash
npm install -g worktree-manager
wtm add your-branch-name
```

It's open source, MIT licensed, and works with Node.js 18+. Zero config, detects your project type, and gets out of your way.

The biggest shift for me was mental — instead of thinking "switch branches", I started thinking "open a new workspace". And that small change made a surprisingly big difference in how smoothly my day flows.
