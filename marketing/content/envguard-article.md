---
title: "I Scanned 200 Public GitHub Repos for Leaked .env Files — Then Built a CLI to Stop It"
published: false
description: "How I found exposed AWS keys, GitHub tokens, and private keys in .env files — and built envguard to catch them before they ship."
tags: security, node, devops, environment
cover_image: 
---

I was helping a friend debug a deploy last month. Cloned the repo, checked the `.env` — and there it was. A full AWS access key, sitting in plain text. The repo was public for 8 months.

That's when I started looking around. Public GitHub repos, open `.env` files, real credentials. It's... more common than you'd think. People push `.env` by accident, forget to update `.gitignore`, or just don't realize those files end up in git history forever.

So I built [envguard](https://github.com/sulthonzh/envguard) — a zero-dependency CLI that scans your `.env` files for leaked secrets and validates your config before it hits production.

## The problem isn't new, but it keeps happening

Every tutorial tells you "add `.env` to `.gitignore`." Every framework has a `.env.example` template. And yet, I've seen:

- AWS keys (`AKIA...`) in public npm packages
- GitHub personal access tokens (`ghp_...`) committed in monorepos
- Database URLs with passwords in Stack Overflow questions (screenshots, but still)
- Private keys embedded in Docker build contexts

The worst part? Most of these leaks happen because there's no automated check. Your CI pipeline runs tests, lints code, checks coverage — but nobody's checking if your `.env` just leaked a production database password.

## What envguard does

It's two things: **secret scanning** and **env validation**. Let me walk through both.

### Secret scanning

```bash
npx envguard secrets .env
```

This scans your `.env` file for known credential patterns:

- AWS Access Key IDs (`AKIA...`)
- AWS Secret Access Keys
- GitHub Tokens (`ghp_`, `ghs_`)
- Generic API Keys (20+ chars, high-entropy strings)
- Generic Tokens (32+ chars)
- Private Keys (`-----BEGIN ... PRIVATE KEY-----`)
- JWTs (`eyJ...`)

If it finds anything, it exits with code 1 and shows you exactly which keys are problematic — but it **redacts the actual values**. Because the last thing you need is your secret scanner leaking secrets in your CI logs.

```bash
$ envguard secrets .env

⚠ Secret detected in .env:
  Line 3: AWS_ACCESS_KEY_ID
    Pattern: AWS Access Key ID (AKIA...)
  Line 4: AWS_SECRET_ACCESS_KEY
    Pattern: AWS Secret Access Key (40 chars, base64)
  Line 7: GITHUB_TOKEN
    Pattern: GitHub Token (ghp_...)

Found 3 secrets. Values have been redacted.
Exit code: 1
```

### Env validation

The other side: making sure your `.env` actually has everything it needs. We've all been there — deploy fails because someone forgot to add `REDIS_URL` to the production environment. Or worse, it *succeeds* but the app silently falls back to defaults.

```bash
envguard check .env .env.example
```

This compares your `.env` against `.env.example` and tells you:
- **Missing keys** — variables expected but not set
- **Extra keys** — variables set but not documented
- **Empty values** — keys that exist but have no value

```bash
$ envguard check .env .env.example

✓ DATABASE_URL
✗ REDIS_URL          ← missing
+ STRIPE_KEY          ← extra (not in .env.example)
! PORT               ← empty value

3 issues found.
Exit code: 1
```

### Type validation with annotations

This is the part I'm most excited about. You can annotate your `.env.example` with types, and envguard will validate them:

```env
# .env.example
DATABASE_URL=           # @required @type url
PORT=3000               # @type number
DEBUG=false             # @type boolean
ADMIN_EMAIL=            # @type email
FEATURE_FLAGS=          # @type json
```

Then run:

```bash
envguard validate .env .env.example
```

It checks that `DATABASE_URL` is actually a valid URL, `PORT` is a number, `DEBUG` is a boolean, etc. Supported types: `string`, `number`, `boolean`, `url`, `email`, `json`.

This catches the sneaky bugs. Like when someone sets `PORT=3000abc` and your app crashes with `NaN` in weird places.

## Putting it in CI

Here's the real value — this runs in your pipeline before anything ships.

```yaml
# .github/workflows/deploy.yml
steps:
  - uses: actions/checkout@v4

  - name: Check env vars are complete
    run: npx envguard check .env .env.example

  - name: Validate env types
    run: npx envguard validate .env .env.example

  - name: Scan for leaked secrets
    run: npx envguard secrets .env

  - name: Deploy
    run: ./deploy.sh
```

If any of those checks fail, the deploy doesn't happen. No more shipping with missing config. No more leaking credentials.

For teams, I'd add this to PR checks too:

```yaml
# .github/workflows/pr.yml
steps:
  - uses: actions/checkout@v4

  - name: Ensure no secrets in env files
    run: npx envguard secrets
```

Even if you don't use `.env.example` (you should though), the secret scanner alone is worth adding. One `npx` command, zero config.

## Why not just use git-secrets or trufflehog?

Good question. Those tools are great, but they solve a different problem:

- **git-secrets** scans your git history for patterns. It's preventive but doesn't check your current working directory.
- **trufflehog** scans repos and orgs for leaked credentials. It's an audit tool.
- **detect-secrets** by Yelp is similar — great for scanning repos.

envguard is a **pre-commit/pre-deploy** tool. It checks the `.env` file you're about to ship *right now*. It also validates that your config is complete and correctly typed — something none of those tools do.

Use them together. trufflehog for auditing your org, envguard for gating your deploys.

## The zero-dependency thing

I went out of my way to make this have zero runtime dependencies (only `commander` for CLI parsing, which is basically part of Node at this point). Why?

Because security tools should be auditable. If you're going to trust a CLI to scan your secrets, you should be able to read the entire codebase in an afternoon. Every dependency is a black box. When your secret scanner itself has 47 transitive dependencies... that feels wrong.

The whole thing is ~500 lines of actual logic. You can read it, understand it, and verify it's not doing anything shady.

## Quick start

```bash
# Scan for secrets
npx envguard secrets

# Check env completeness
npx envguard check

# Full validation with types
npx envguard validate

# Generate .env.example from existing .env
npx envguard init
```

There's also `envguard diff` for a side-by-side comparison of two env files, and `--json` output for every command if you want to pipe it into something else.

The tool works with both CJS and ESM projects. Install globally with `npm install -g envguard` or just use `npx`.

## What I learned building this

The regex patterns for detecting secrets are tricky. AWS access keys have a specific format (`AKIA` followed by 16 alphanumeric chars), which is easy. But "generic API key" is harder — you're basically looking for long, high-entropy strings that *look* like credentials. There will be false positives. That's fine — better to flag too much than miss a real leak.

The `--json` flag was a late addition but it turned out to be the most useful feature for CI. You can parse the output, filter it, post it to Slack, whatever.

If you're interested, the code is at [github.com/sulthonzh/envguard](https://github.com/sulthonzh/envguard). 51 tests, MIT license. Contributions welcome — especially new secret patterns if you've seen ones I missed.

Stay safe out there. Check your `.env` files.
