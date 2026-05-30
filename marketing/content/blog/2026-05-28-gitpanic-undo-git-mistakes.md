---
title: "I Accidentally force-pushed to main at 11 PM — So I Built an Interactive Git Undo Tool"
tags: git, opensource, devtools, javascript
published: true
description: How gitpanic auto-detects git disasters and walks you through recovery — like reflog with a safety net.
cover_image:
---

We've all been there. It's late. You're tired. You run `git push --force` and realize — half a second too late — you're on `main`, not your feature branch.

Your heart drops. Your teammates' commits are gone. You open Stack Overflow in a panic.

That exact scenario happened to me (okay, it was a branch, not main — but the fear was real). After the third time digging through `git reflog` output at midnight, I built **gitpanic** — an interactive CLI that auto-detects git disasters and walks you through recovery.

## The Problem: git reflog is Powerful but Hostile

`git reflog` is the right tool for the job. But let's be honest:

```bash
$ git reflog
a1b2c3d HEAD@{0}: checkout: moving from feature/login to main
e4f5g6h HEAD@{1}: commit: add login validation
i7j8k9l HEAD@{2}: commit: fix auth middleware
m0n1o2p HEAD@{3}: checkout: moving from main to feature/login
```

Cool. Now what? Which SHA do I use? What command fixes a deleted branch vs. a bad merge? Is `git reset --hard` safe here or am I about to make things worse?

**Every developer knows this feeling.** Stack Overflow's most upvoted git questions aren't about advanced workflows — they're all "how do I undo X":

- "How to undo last commit" — 16k+ upvotes
- "How to undo git push" — 5k+ upvotes  
- "How to recover deleted branch" — 3k+ upvotes

The knowledge exists. The UX is the problem.

## Enter gitpanic

[gitpanic](https://github.com/sulthonzh/gitpanic) is a zero-config CLI that does three things:

1. **Auto-detects** what went wrong by analyzing your git state
2. **Explains** the problem in plain English with confidence levels
3. **Guides** you through recovery with risk-rated options and confirmation prompts

```bash
npx gitpanic
```

That's it. No arguments, no config files, no documentation to read while sweating.

## How It Detects Disasters

gitpanic runs multiple "detectors" against your current repository state:

### 1. Reflog Analysis
It scans recent reflog entries looking for red flags:
- Recent force pushes (within the last hour)
- Branch deletions
- Sudden HEAD movements that suggest accidental operations

### 2. Working Tree State
- Uncommitted changes that might be about to get lost
- Detached HEAD state (happens more than you'd think)
- Merge conflicts left unresolved

### 3. Timing Heuristics
- Commits made less than 2 minutes ago → probably accidental
- Rapid branch switches → possibly confused about where you are

Each detector returns a finding with a **confidence score**. If confidence is high enough, it surfaces the issue.

## Real-World Example: Recovering a Deleted Branch

Here's what happens when you accidentally delete a branch:

```bash
$ gitpanic
🔍 Analyzing your git state...

⚠️  Found 1 potential issue:

1. 🔴 Deleted Branch
   Branch "feature/login" was deleted 45 seconds ago.
   Confidence: 90%

Select an issue to fix [1-1]: 1

🔧 Recovery options for: Deleted Branch

1. ✅ Restore branch "feature/login"
   Recreate the branch from the deleted commit
   Risk: safe
   Steps:
   - git branch feature/login abc1234
   - git checkout feature/login

Select a recovery option [1-1]: 1
⚠️  Confirm: "Restore branch \"feature/login\""? This can be undone. [y/N]: y

🚀 Executing recovery...

✅ Recovery complete!
```

Notice the risk rating — **safe**. gitpanic never marks destructive operations as safe. You always know what you're getting into.

## Recovery Options Are Tiered by Risk

Every disaster comes with multiple recovery strategies:

| Risk Level | What It Means | Examples |
|------------|--------------|---------|
| ✅ Safe | Can be easily undone | Stash, soft reset, branch restore |
| ⚡ Medium | May need manual cleanup | Cherry-pick, rebase |
| ⚠️ High | Destructive, no undo | Hard reset, force push |

This matters because when you're panicking, you don't always make the best decisions. gitpanic shows you the safest option first and clearly marks dangerous ones.

## The Dry Run Safety Net

Not sure what will happen? Use dry run mode:

```bash
gitpanic --dry-run
```

This shows you exactly what commands would run without executing anything. Perfect for learning or when you want to handle recovery manually but need guidance on the right commands.

## Under the Hood: Building Disaster Detectors

Here's a simplified version of how the "accidental commit" detector works:

```typescript
async function detectAccidentalCommit(repo: Repository): Promise<Finding | null> {
  const lastCommit = await repo.getHeadCommit();
  const commitAge = Date.now() - lastCommit.date().getTime();
  
  // If the last commit was made less than 2 minutes ago
  if (commitAge < 120_000) {
    return {
      type: 'accidental_commit',
      severity: 'low',
      confidence: 0.8,
      message: `You just committed "${lastCommit.message()}" ${secondsAgo}s ago.`,
      recoveries: [
        {
          name: 'Undo commit, keep changes staged',
          risk: 'safe',
          steps: ['git reset --soft HEAD~1']
        }
      ]
    };
  }
  
  return null;
}
```

The key insight: **timing is the strongest signal**. A commit made 10 seconds ago is very different from one made 10 hours ago. By combining timing with reflog patterns, you can surface the right problem at the right time.

## What It Can Detect (So Far)

| Disaster | Detection Method | Confidence |
|----------|-----------------|------------|
| Detached HEAD | `git status` | 100% |
| Deleted Branch | Reflog scan | 90% |
| Force Push | Reflog analysis | 85% |
| Botched Merge | MERGE_HEAD file | 95% |
| Accidental Commit | Timing heuristics | 80% |
| Uncommitted Changes | `git status` | 100% |
| Wrong Branch Commit | Branch comparison | 70% |

## When NOT to Use gitpanic

Let's be honest — if you're a git wizard who lives in the reflog, this tool isn't for you. It's for:

- Developers who've been coding for 2 years and still Google "how to undo git commit"
- Junior devs who are afraid of `git reset`
- Anyone working late at night when judgment is impaired
- Teams that want a safer workflow for git operations

## Get Started

```bash
# Install globally
npm install -g gitpanic

# Or use without installing
npx gitpanic

# Preview without making changes
gitpanic --dry-run
```

**GitHub:** [sulthonzh/gitpanic](https://github.com/sulthonzh/gitpanic)  
**License:** MIT

---

The goal isn't to replace `git reflog` — it's to make recovery accessible when you're in full panic mode. Because the worst time to learn git internals is when your production branch is hanging by a thread.

If you've ever panicked after a bad git operation, give gitpanic a try. And if you have ideas for new disaster detectors, PRs are welcome — there's a clean plugin architecture for adding new ones.
