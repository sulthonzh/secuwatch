---
title: I Turned npm outdated into a CI Gate — Here’s How
published: true
description: How I built npm-outdated-check to stop dependency drift without breaking CI
tags: javascript, typescript, node, ci, devtools, cli
canonical_url: https://github.com/sulthonzh/npm-outdated-check
---

You run `npm outdated` and see a list of stale packages. But your CI doesn't care. It passes anyway. Dependencies drift until something explodes in production. There's no built-in way to fail the build when versions drift too far.

## The Problem

`npm outdated` lists outdated dependencies, but:

- No exit codes — CI cannot gate builds on the result
- No threshold configuration — you can't say "fail if >2 minors behind"
- No distinction between prod and dev dependencies in many workflows
- Manual updates become a fire drill instead of a controlled process

A typical scenario: Your team wants to stay current with security patches, but you can't update everything. You need a rule: "No production dependency more than 2 minor versions behind latest." `npm outdated` can't enforce that.

## The Solution

I built `npm-outdated-check` to turn `npm outdated` into a first-class CI citizen with:

- Semantic version thresholding (major/minor/patch drift limits)
- Meaningful exit codes (0 = pass, 1 = violation, 2 = config error, 3 = network error)
- Configurable via CLI flags or a `.npm-outdated-check.json` config file
- Production/dev dependency filtering
- Multiple output formats (text, table, JSON)

## How It Works

The tool reads your `package.json`, queries the npm registry for each dependency, calculates the semantic version difference, and flags anything that exceeds your thresholds.

Key implementation details:

1. **Registry fetching**: Hit the npm registry endpoint for each package and extract the `dist-tags.latest` version
2. **Semver diff**: Use `semver` to parse `coerce(current)` and `parse(latest)`, then compute `major/minor/patch` differences
3. **Violation logic**: A package violates if any diff exceeds its configured `maxMajor`/`maxMinor`/`maxPatch`
4. **Exit codes**: CI reads the exit code and fails the build when violations exist

Sample threshold calculation:

```typescript
const majorDiff = latest.major - current.major;
const minorDiff = latest.minor - current.minor;
const patchDiff = latest.patch - current.patch;

const isViolation =
  majorDiff > config.maxMajor ||
  minorDiff > config.minorDiff ||
  patchDiff > config.maxPatch;
```

## Getting Started

Install globally or as a dev dependency:

```bash
npm install -D npm-outdated-check
```

Run it in CI with sensible defaults (major=0, minor=2, patch=5):

```bash
npx npm-outdated-check
```

Add it to GitHub Actions:

```yaml
name: Dependency Check

on: [push, pull_request]

jobs:
  outdated-check:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '18'
      - run: npm install
      - run: npx npm-outdated-check --max-minor 3
```

If a dependency is 4 minor versions behind, CI fails and you get notified.

## Why This Matters

- **Controlled updates**: Set thresholds to avoid surprise breaking changes
- **Security posture**: Enforce staying within N patch versions of latest
- **Team consistency**: Config rules checked automatically in CI
- **Zero config**: Works out of the box with smart defaults

## What's Next

Roadmap items include:

- Configurable notification channels (Slack, email)
- Automated PR generation for outdated packages
- Support for Yarn and pnpm lockfiles
- Monorepo workspace awareness

## Links

- GitHub: https://github.com/sulthonzh/npm-outdated-check
- Try it: `npm install -D npm-outdated-check`