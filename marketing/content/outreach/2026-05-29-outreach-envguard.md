# EnvGuard Outreach Drafts — 2026-05-29

## Reddit r/devops

**Title:** Found AWS keys in a .env file that was pushed to a public repo — so I built a CLI that scans for that

**Body:**

Had a scare last month where someone on the team accidentally pushed `.env` with live AWS keys. GitHub's secret scanning caught it after 20 minutes, but by then the keys were already in a few clones.

I wanted something that catches this BEFORE the push, not after. Built `envguard` — a zero-dep CLI that validates `.env` files and scans for leaked secrets.

```bash
npx envguard secrets .env
```

It catches:
- AWS Access Keys (AKIA...)
- AWS Secret Access Keys
- GitHub tokens (ghp_, ghs_)
- Generic API keys (20+ chars)
- JWTs (eyJ...)
- Private keys

Exit code 1 if secrets found, so it works as a CI gate:

```yaml
- name: Scan for secrets
  run: npx envguard secrets
```

It also does env validation — checks your `.env` against `.env.example` with type annotations:

```env
# .env.example
DATABASE_URL=     # @required @type url
PORT=3000         # @type number
DEBUG=false       # @type boolean
```

We've been running it in CI for a few weeks now. Zero deps (besides commander), dual CJS/ESM.

Repo: https://github.com/sulthonzh/envguard

Happy to hear what other teams are using for this. I know git-secrets and detect-secrets exist — built this because I wanted something simpler that also does env validation in one tool.

## Reddit r/node

**Title:** I built a CLI that validates .env files AND detects leaked secrets — zero deps

**Body:**

Same as above but emphasize the Node.js ecosystem angle — npx envguard check, dual CJS/ESM, works as devDependency.

## HackerNews

**Title:** Show HN: EnvGuard – .env validation + secret scanning CLI (zero deps)

**Body:**

One-liner: CLI tool that validates .env files against .env.example schemas and scans for leaked secrets (AWS keys, GitHub tokens, JWTs, private keys). CI-friendly exit codes, zero runtime deps, dual CJS/ESM.

I kept running into two separate problems: missing env vars causing crashes in staging, and accidentally committing secrets. Existing tools handle one or the other. EnvGuard does both in a single `npx` call.

The secret detection uses regex patterns for common key formats (AWS AKIA*, GitHub ghp_*, JWTs, etc.) with masked output so you can see WHAT was found without leaking the actual value in CI logs.

Type validation via annotations in .env.example — supports string, number, boolean, url, email, json.

Would love feedback on what other secret patterns people need detected.

https://github.com/sulthonzh/envguard
