# Outreach Drafts — gitpanic + docker-remote-deployment-action

## ⚠️ MANUAL POSTING REQUIRED
Post these manually. Do NOT auto-post.

---

## Draft 1: Reddit — r/git

**Title:** I accidentally force-pushed to main at 11 PM — so I built an interactive git undo tool

**Body:**
```
Hey r/git — sharing a tool I built after the worst git mistake of my life.

The story: It was 11 PM, I was tired, and I ran `git push --force` on main instead of my feature branch. Lost 3 commits. Panicked. Spent 2 hours digging through reflog.

So I built `gitpanic` — an interactive CLI that walks you through common git disasters:

- Undo last commit (keep changes)
- Undo last commit (trash changes)
- Unstage everything
- Recover from force push (reflog browser)
- Restore deleted branch
- Clean untracked files

It's basically `git reflog` but you don't need to remember the commands. Interactive menu, confirmations before destructive actions, and it explains what each operation does.

GitHub: https://github.com/sulthonzh/gitpanic
Install: `npm install -g gitpanic`

Full story: https://dev.to/sulthonzh/i-accidentally-force-pushed-to-main-at-11-pm-so-i-built-an-interactive-git-undo-tool

Has this happened to you? What's your worst git disaster?
```

---

## Draft 2: HackerNews — gitpanic

**Title:** Show HN: gitpanic — Interactive git disaster recovery CLI

**Body:**
```
Hi HN — built a small CLI tool for when git goes wrong and you're too tired to remember reflog commands.

gitpanic is an interactive menu that handles common git mistakes:
- Undo commits (with or without keeping changes)
- Unstage everything
- Recover from force pushes via reflog browser
- Restore deleted branches
- Clean untracked files

The idea: instead of Googling "how to undo git push force" at midnight, just run `gitpanic` and pick from a menu.

GitHub: https://github.com/sulthonzh/gitpanic
npm: `npm install -g gitpanic`

Zero dependencies. Node.js. Works on any git repo.

Inspired by real 11 PM mistakes.
```

---

## Draft 3: Reddit — r/docker

**Title:** I got tired of SSH-ing into servers to deploy — so I made a GitHub Action for remote Docker deploy

**Body:**
```
Hey r/docker — open-sourcing a GitHub Action I've been using for remote Docker deployments.

The problem: I wanted to deploy from GitHub Actions to a remote server, but every solution was either:
1. Overkill (Kubernetes, full CI/CD platforms)
2. Insecure (SSH keys in env vars, no verification)
3. Too many manual steps

So I built `docker-remote-deployment-action`:
- Deploy to any remote Docker host via SSH
- Supports docker-compose and raw docker commands
- Pre/post deployment scripts
- SSH key verification
- Multi-server support

Usage in GitHub Actions:
```yaml
- uses: sulthonzh/docker-remote-deployment-action@v1
  with:
    remote_docker_host: user@your-server.com
    ssh_key: ${{ secrets.SSH_KEY }}
    deploy_path: /opt/myapp
    stack_file: docker-compose.yml
```

GitHub: https://github.com/sulthonzh/docker-remote-deployment-action
Just released v1.0.0 (graduated from beta).

Works great for: VPS deployments, homelab, staging servers. Not for enterprise — use Kubernetes for that.

What do you use for deploying Docker containers from CI?
```

---

## Draft 4: HackerNews — docker-remote-deployment-action

**Title:** Show HN: docker-remote-deployment-action — Deploy to remote Docker hosts from GitHub Actions

**Body:**
```
Hi HN — open-sourced a GitHub Action for deploying Docker containers to remote servers.

docker-remote-deployment-action handles SSH, docker-compose, and deployment scripts from a GitHub Actions workflow.

Features:
- SSH to remote Docker host
- Run docker-compose up or custom commands
- Pre/post deployment hooks
- Multi-server support
- SSH key verification

Simple example:
```yaml
- uses: sulthonzh/docker-remote-deployment-action@v1
  with:
    remote_docker_host: user@server.com
    ssh_key: ${{ secrets.SSH_KEY }}
    stack_file: docker-compose.yml
```

Just released v1.0.0 (was in beta). It has 8 stars — the most popular of my open source tools.

GitHub: https://github.com/sulthonzh/docker-remote-deployment-action

Good for: VPS, homelab, staging. Not trying to replace Kubernetes.
```

---

## Draft 5: Reddit — r/github

**Title:** GitHub Action for remote Docker deployment — just released v1.0.0

**Body:**
```
Hey r/github — sharing a GitHub Action I built for deploying Docker containers to remote servers.

`docker-remote-deployment-action` lets you:
- Connect to any Docker host via SSH from your GitHub Actions workflow
- Run docker-compose or raw docker commands
- Execute pre/post deployment scripts
- Deploy to multiple servers

```yaml
- uses: sulthonzh/docker-remote-deployment-action@v1
  with:
    remote_docker_host: user@yourserver.com
    ssh_key: ${{ secrets.SSH_KEY }}
    deploy_path: /opt/app
    stack_file: docker-compose.yml
```

Just graduated from beta to v1.0.0. Used it in production for several months before stable release.

GitHub: https://github.com/sulthonzh/docker-remote-deployment-action

Feedback welcome — especially on the action.yml interface and docs.
```

---

## Posting Schedule

| Day | Platform | Draft | Product |
|------|----------|-------|---------|
| Day 1 | r/git | Draft 1 | gitpanic |
| Day 2 | HackerNews | Draft 2 | gitpanic |
| Day 3 | r/docker | Draft 3 | docker-remote-deployment-action |
| Day 4 | HackerNews | Draft 4 | docker-remote-deployment-action |
| Day 5 | r/github | Draft 5 | docker-remote-deployment-action |

Space out 1 day between posts. Don't post same product to multiple platforms on same day.

---

_Last updated: 2026-05-28 (Phase C, Cycle 5)_
