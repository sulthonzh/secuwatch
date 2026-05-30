# Branch Cleanup - BUILD-READY SPECIFICATION
_Updated: 2026-05-28 15:48 UTC_

## 🎯 PRODUCT SPECS

### Exact Tool Name
`branchcleanup` - Smart Git Branch Cleanup CLI

### One-Liner
CLI that detects merged, squash-merged, and stale branches with interactive deletion.

### CLI Interface
```bash
# List all branches with status
branchcleanup list [--stale-threshold=30]

# Interactive cleanup with confirmation
branchcleanup cleanup [--dry-run] [--force]

# Show help and version
branchcleanup --help
branchcleanup --version
```

## 🛠️ TECHNICAL STACK

### Language + Build System
- **Language**: TypeScript (Node.js 18+)
- **Build System**: esbuild for fast compilation
- **Package Manager**: npm (for distribution)

### Why TypeScript?
1. **Type Safety**: Git operations involve many string operations where types prevent bugs
2. **Developer Experience**: Excellent tooling and IDE support
3. **Performance**: Node.js is perfect for CLI tools that spawn git commands
4. **Ecosystem**: Rich npm ecosystem for CLI building (inquirer, chalk, simple-git)

### Dependencies
```json
{
  "dependencies": {
    "simple-git": "^3.20.0",     // Git operations
    "inquirer": "^9.2.0",        // Interactive prompts
    "chalk": "^4.1.2",           // Terminal colors
    "cli-table3": "^0.6.3",     // Table formatting
    "ora": "^7.0.1"              // Loading spinners
  },
  "devDependencies": {
    "@types/node": "^20.0.0",
    "typescript": "^5.0.0",
    "esbuild": "^0.19.0",
    "@tsconfig/node18": "^18.0.0"
  }
}
```

## 🔍 CORE ALGORITHM

### Branch Detection Logic

#### 1. Merged Branches
```bash
git branch --merged main
```

#### 2. Squash-Merged Branches
```bash
# For each branch, check if all commits exist in main
git log --oneline --format="%H" <branch> | while read commit; do
  git merge-base --is-ancestor $commit main 2>/dev/null || exit 1
done
```

#### 3. Stale Branches
```bash
# Branches not touched in X days (default: 30)
git log --format=%at --date=short -1 <branch> | xargs -I {} date -d {} +%s
```

### Branch Classification
- **merged**: Standard git merge branches
- **squash-merged**: GitHub-style squash merges
- **stale**: Not touched in threshold days
- **protected**: main, master, develop, etc.
- **current**: Currently checked out branch

## 🏗️ PROJECT STRUCTURE

```
branchcleanup/
├── src/
│   ├── index.ts              // Main CLI entry point
│   ├── branch-detector.ts    // Branch detection logic
│   ├── branch-listener.ts    // Git event listeners
│   ├── interactive.ts        // Interactive prompts
│   ├── formatter.ts          // Output formatting
│   ├── config.ts             // Configuration management
│   └── utils.ts              // Utility functions
├── test/
│   ├── branch-detector.test.ts
│   ├── interactive.test.ts
│   └── integration.test.ts
├── build/
│   ├── cli.js                // Compiled CLI
│   └── cli.d.ts              // TypeScript declarations
├── package.json
├── tsconfig.json
├── README.md
└── .gitignore
```

## 💻 IMPLEMENTATION DETAILS

### Main CLI Flow
```typescript
// 1. Parse CLI arguments
const args = parseArgs(process.argv.slice(2));

// 2. Detect branches
const detector = new BranchDetector();
const branches = await detector.detect({
  staleThreshold: args.staleThreshold || 30,
  targetBranch: args.target || 'main'
});

// 3. Format and display
const formatter = new Formatter();
if (args.list) {
  console.log(formatter.table(branches));
} else if (args.cleanup) {
  await interactive.cleanup(branches, args);
}
```

### Branch Detection Class
```typescript
class BranchDetector {
  async detect(options: DetectionOptions): Promise<Branch[]> {
    const branches = await this.getAllBranches();
    const results = await Promise.all(
      branches.map(branch => this.analyzeBranch(branch, options))
    );
    return results.filter(Boolean);
  }

  private async analyzeBranch(branch: string, options: DetectionOptions) {
    const [isMerged, isSquashMerged, isStale, isProtected] = await Promise.all([
      this.isMerged(branch, options.targetBranch),
      this.isSquashMerged(branch, options.targetBranch),
      this.isStale(branch, options.staleThreshold),
      this.isProtected(branch)
    ]);

    return {
      name: branch,
      type: this.classifyBranch(isMerged, isSquashMerged, isStale),
      safeToDelete: this.canDelete(branch, isProtected),
      lastCommit: await this.getLastCommit(branch)
    };
  }
}
```

### Interactive Prompts
```typescript
class Interactive {
  async cleanup(branches: Branch[], options: CleanupOptions) {
    const deletable = branches.filter(b => b.safeToDelete);
    
    if (options.dryRun) {
      console.log('DRY RUN - Would delete:');
      deletable.forEach(b => console.log(`  ${b.name}`));
      return;
    }

    if (options.force) {
      await this.forceDelete(deletable);
    } else {
      await this.confirmAndDelete(deletable);
    }
  }

  private async confirmAndDelete(branches: Branch[]) {
    for (const branch of branches) {
      const { confirm } = await inquirer.prompt([
        {
          type: 'confirm',
          name: 'confirm',
          message: `Delete ${branch.name} (${branch.type})?`,
          default: false
        }
      ]);

      if (confirm) {
        await this.deleteBranch(branch.name);
        console.log(`✅ Deleted ${branch.name}`);
      }
    }
  }
}
```

## 🎨 OUTPUT FORMATTING

### Table Format
```
┌─────────────────────┬──────────────┬──────────────┐
│ Branch             │ Type         │ Safe to Delete│
├─────────────────────┼──────────────┼──────────────┤
│ feature/user-auth  │ squash-merged│ ✅ Yes       │
│ bugfix/login-page   │ merged       │ ✅ Yes       │
│ experiment/new-ui   │ stale-30d    │ ❌ No (old)   │
└─────────────────────┴──────────────┴──────────────┘
```

### Interactive Cleanup
```
$ branchcleanup cleanup
❓ Delete feature/user-auth (squash-merged)? [y/N] y
✅ Deleted feature/user-auth
❓ Delete bugfix/login-page (merged)? [y/N] y
✅ Deleted bugfix/login-page
❓ Delete experiment/new-ui (stale-30d)? [y/N] n
📝 Skipping experiment/new-ui (user declined)
```

## 🚀 BUILD PLAN

### Phase 1: Core Detection (2 days)
- [ ] Implement BranchDetector class
- [ ] Git command integration (simple-git)
- [ ] Branch classification logic
- [ ] Unit tests for detection

### Phase 2: CLI Interface (1 day)
- [ ] Argument parsing with yargs or similar
- [ ] Command structure (list, cleanup, help)
- [ ] Error handling and validation
- [ ] Basic output formatting

### Phase 3: Interactive Features (1 day)
- [ ] Inquirer integration for prompts
- [ ] Confirmation workflow
- [ ] Dry-run and force modes
- [ ] Progress indicators

### Phase 4: Safety & Configuration (1 day)
- [ ] Protected branch detection
- [ ] Configuration file support
- [ ] Stale threshold configuration
- [ ] Target branch configuration

### Phase 5: Documentation & Testing (1 day)
- [ ] Comprehensive README
- [ ] CLI help text
- [ ] Integration tests
- [ ] End-to-end testing

### Phase 6: Build & Distribution (1 day)
- [ ] TypeScript compilation with esbuild
- [ ] Package.json setup
- [ ] npm publishing preparation
- [ ] GitHub repository setup

## 📊 COMPETITIVE ANALYSIS

| Tool | Stars | Language | Squash Detection | Interactive | Safety | Last Updated |
|------|-------|----------|------------------|-------------|--------|--------------|
| **branchcleanup** (us) | - | TypeScript | ✅ YES | ✅ YES | ✅ YES | 2026 |
| `git branch --merged` | - | Shell | ❌ NO | ❌ NO | ❌ NO | - |
| `git-cleanup` (npm) | 0⭐ | Node.js | ❌ NO | ❌ NO | ❌ NO | 2021 |
| GitHub web UI | - | Web | ❌ NO | ❌ NO | ✅ YES | - |
| Manual scripts | 0-5 | Bash | ❌ NO | ❌ NO | ❌ NO | Various |

## 💰 INCOME PATH

### Primary: npm Pro + Consulting
1. **npm Pro Version**: $5/month with advanced features
   - Batch operations with regex patterns
   - CI/CD integration
   - Custom branch protection rules
   - API access for automation

2. **Consulting Services**: $100-200/hour
   - Git workflow optimization
   - Custom branch management solutions
   - Team training on proper branching

### Secondary: Reputation Building
1. **GitHub Stars**: Target 500+ stars in first 3 months
2. **Developer Community**: Active issue responses and feature requests
3. **Blog Content**: Tutorials on git workflow best practices

## 🎯 POSITIONING STRATEGY

### GitHub Description
> Smart Git branch cleanup CLI that detects squash-merged branches with interactive deletion. The first tool to properly detect GitHub's default merge method while keeping your repository clean and safe.

### Topics
- git
- git-branch
- github
- cli
- developer-tools
- typescript
- nodejs
- productivity
- code-quality

### First 100 Stars Plan
1. **Day 1**: Launch with basic functionality
2. **Week 1**: Respond to all issues, add requested features
3. **Week 2**: Tutorial blog posts and social media promotion
4. **Week 3**: Collaborate with git-related projects
5. **Week 4**: Target 100 stars through community engagement

## 📈 SUCCESS METRICS

### KILL CRITERIA (30 days)
- **< 50 stars** → Kill (no market interest)
- **< 100 npm downloads/week** → Kill (no adoption)
- **< 5 GitHub issues** → Kill (no engagement)
- **Major competitor launch** → Re-evaluate positioning

### SUCCESS TARGETS
- **500+ GitHub stars** in 3 months
- **1000+ npm downloads/week** by month 2
- **Active issue/PR discussion** with community
- **Positive feedback** on developer experience

## 🚨 RISK MITIGATION

### Technical Risks
- **Git API changes**: Use simple-git abstraction layer
- **Performance**: Optimize git command batching
- **Cross-platform**: Test on Windows, macOS, Linux

### Market Risks
- **Competition**: Focus on squash-merged detection (unique selling point)
- **Adoption**: Make it dead simple to use (zero config)
- **Maintenance**: Regular updates and community engagement

### Security Risks
- **Branch deletion safety**: Never delete without confirmation
- **Protected branch protection**: Hard-coded list + configuration
- **Dry-run mode**: Always preview before deletion