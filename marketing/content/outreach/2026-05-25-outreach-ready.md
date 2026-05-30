# Outreach Drafts — Ready to Post

## 🔴 MANUAL POSTING REQUIRED

These drafts are ready for Sulthon to manually post to Reddit and HackerNews. Do NOT post automatically — these communities require manual posting to avoid spam detection.

---

## Draft 1: Reddit — r/node

**Title:** I Replaced 70MB Node.js Log Viewer with a 172KB Zig Binary

**Body:**
```
Hey /r/node — just published a small log viewer tool that might interest you if you're tired of Node.js devtools bloat.

Context: I was debugging logs from a Node.js service and realized I had to spin up the full Chrome DevTools (70MB+) just to view and search logs. That felt ridiculous for such a simple task.

So I built `logchef-zig` — a CLI log viewer written in Zig. It's:
- 172KB binary (static, no dependencies)
- Fast search/filtering (regex support)
- Color-coded log levels
- Works with any log format (just pipe to it)
- Cross-platform (Linux/macOS/Windows)

GitHub: https://github.com/sulthonzh/logchef-zig
Install: `cargo install logchef-zig` or download binary from releases

Full writeup here: https://dev.to/sulthonzh/i-replaced-70mb-nodejs-log-viewer-with-a-172kb-zig-binary

Curious to hear thoughts: Would you use a Zig CLI tool for log viewing, or is Node.js/Bun fine for you?
```

---

## Draft 2: HackerNews

**Title:** Show HN: logchef-zig — 172KB Zig log viewer, no dependencies

**Body:**
```
Hi HN — built a CLI log viewer in Zig because I was tired of opening 70MB+ browser devtools just to grep through logs.

logchef-zig is a small (172KB), fast log viewer:
- No dependencies (static binary)
- Regex search/filter
- Color-coded levels (ERROR, WARN, INFO, DEBUG)
- Pipe any log format to it
- Linux/macOS/Windows binaries

GitHub: https://github.com/sulthonzh/logchef-zig
Docs: https://dev.to/sulthonzh/i-replaced-70mb-nodejs-log-viewer-with-a-172kb-zig-binary

I'm a Zig beginner — feedback welcome on both the tool and the code!
```

---

## Draft 3: Reddit — r/zig

**Title:** My first Zig CLI — 172KB log viewer (wrote it because I hated Node.js devtools)

**Body:**
```
Hey /r/zig — just released my first Zig CLI tool and wanted to share + get feedback.

`logchef-zig` is a log viewer I built to replace Node.js DevTools (which are 70MB+). The Zig binary is 172KB and does most of what I need:

- Read logs from stdin or file
- Search with regex
- Filter by log level
- Color-coded output
- Cross-platform (tested on macOS and Linux)

GitHub: https://github.com/sulthonzh/logchef-zig

I'm new to Zig — would love feedback on:
- Code structure (it's pretty simple, ~600 LOC)
- Memory usage patterns
- Build config improvements
- Whether this is even a good use case for Zig

Full writeup: https://dev.to/sulthonzh/i-replaced-70mb-nodejs-log-viewer-with-a-172kb-zig-binary
```

---

## Posting Checklist

- [ ] Post to Reddit — r/node
- [ ] Post to Reddit — r/zig
- [ ] Post to HackerNews (HN frontpage or /show)
- [ ] Wait 1-2 hours, check for comments
- [ ] Respond to all comments within 24h
- [ ] Update tracker.md with post URLs and engagement

---

## Notes

- Best time to post: 9-11 AM EST (for HN) or 8-10 AM local time (for Reddit)
- Monitor for spam flagging — engage authentically, don't just dump links
- Respond to ALL comments, even criticism
- Track upvotes/comments in tracker.md

---

_Last updated: 2026-05-25 (Phase 3 — Outreach Execution)_