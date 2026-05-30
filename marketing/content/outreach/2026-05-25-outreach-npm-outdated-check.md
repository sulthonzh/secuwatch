# Additional Outreach Drafts — npm-outdated-check

## Draft 4: Reddit — r/javascript

**Title:** I automated dependency updates in CI with a custom npm outdated wrapper

**Body:**
```
Hey /r/javascript — built a small tool that turns `npm outdated` into a CI gate.

Context: We kept missing dependency updates because npm's `outdated` command doesn't exit with an error code. So production would run on outdated packages until someone remembered to check.

`npm-outdated-check` wraps `npm outdated` and:
- Exits with error 1 if any outdated packages found
- Exits with error 2 if npm isn't installed
- Works in GitHub Actions, GitLab CI, Jenkins
- Zero config — just drop it into your pipeline

GitHub: https://github.com/sulthonzh/npm-outdated-check
Install: `npm install -g npm-outdated-check`

Full writeup: https://dev.to/sulthonzh/i-turned-npm-outdated-into-a-ci-gate-here-s-how

Sample CI config:
```yaml
- name: Check for outdated dependencies
  run: npm-outdated-check
```

Curious: How do y'all handle dependency updates in CI? Automate or manual?
```

---

## Draft 5: Reddit — r/node

**Title:** npm outdated as a CI gate? Here's a simple wrapper

**Body:**
```
Quick tool I built for /r/node — turns `npm outdated` into a CI-blocking check.

The problem: `npm outdated` prints outdated packages but exits with code 0. Your CI passes even if dependencies are old.

The solution: `npm-outdated-check` is a 20-line Node.js script that:
- Runs `npm outdated` under the hood
- Exits 1 if any packages are outdated
- Exits 2 if npm is missing
- Works anywhere npm works (GitHub Actions, GitLab, etc.)

GitHub: https://github.com/sulthonzh/npm-outdated-check
Full article: https://dev.to/sulthonzh/i-turned-npm-outdated-into-a-ci-gate-here-s-how

It's not rocket science — just a missing feature from npm itself. Would love to see this integrated into npm CLI eventually.

How do you handle this?
```

---

## Draft 6: HackerNews

**Title:** Show HN: npm-outdated-check — Turn npm outdated into a CI gate

**Body:**
```
Hi HN — built a tiny tool because `npm outdated` doesn't exit with an error code when dependencies are outdated.

npm-outdated-check is a simple wrapper that:
- Runs `npm outdated` internally
- Exits with error 1 if any outdated packages found
- Exits with error 2 if npm isn't installed
- Zero config — just add to your CI pipeline

GitHub: https://github.com/sulthonzh/npm-outdated-check
Full writeup: https://dev.to/sulthonzh/i-turned-npm-outdated-into-a-ci-gate-here-s-how

GitHub Actions example:
```yaml
- name: Check for outdated dependencies
  run: npm-outdated-check
```

It's basically a missing feature from npm. Would love to see npm CLI add a `--fail-if-outdated` flag eventually.
```

---

## Posting Checklist (npm-outdated-check)

- [ ] Post to Reddit — r/javascript
- [ ] Post to Reddit — r/node
- [ ] Post to HackerNews (HN frontpage or /show)
- [ ] Wait 1-2 hours, check for comments
- [ ] Respond to all comments within 24h
- [ ] Update tracker.md with post URLs and engagement

---

## Notes

- These are secondary outreach posts (logchef-zig is primary focus for this cycle)
- Don't post all 6 at once — space them out by 1-2 days
- Monitor for spam flagging
- Respond authentically, not just "thanks!"

---

_Last updated: 2026-05-25 (Phase 3 — Outreach Execution)_