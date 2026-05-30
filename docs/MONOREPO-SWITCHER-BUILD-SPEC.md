# Monorepo Switcher - BUILD-READY SPECIFICATION
_Updated: 2026-05-28 17:02 UTC_

## 🎯 PRODUCT SPECS

### Exact Tool Name
`monorepo-switcher` - Intelligent CLI for fast monorepo workspace switching

### One-Liner
CLI that instantly discovers and switches between packages in monorepos with context awareness.

### CLI Interface
```bash
# List all packages with context
monorepo-switcher

# Quick switch to specific package
monorepo-switcher backend

# Fuzzy search for packages
monorepo-switcher --fuzzy

# Show recently used packages
monorepo-switcher --recent

# Show help and version
monorepo-switcher --help
monorepo-switcher --version
```

## 🛠️ TECHNICAL STACK

### Language + Build System
- **Language**: TypeScript (Node.js 18+)
- **Build System**: esbuild for fast compilation
- **Package Manager**: npm (for distribution)

### Why TypeScript?
1. **Type Safety**: Package parsing and file operations benefit from strict types
2. **Developer Experience**: Excellent tooling for CLI development
3. **Performance**: Node.js is perfect for filesystem operations
4. **Ecosystem**: Rich npm ecosystem for CLI building (commander, chalk, etc.)

### Dependencies
```json
{
  "dependencies": {
    "commander": "^11.1.0",      // CLI argument parsing
    "chalk": "^4.1.2",           // Terminal colors
    "cli-table3": "^0.6.3",      // Table formatting
    "ora": "^7.0.1",             // Loading spinners
    "fast-glob": "^3.3.2",       // Fast file pattern matching
    "simple-git": "^3.20.0"      // Git operations
  },
  "devDependencies": {
    "@types/node": "^20.0.0",
    "typescript": "^5.0.0",
    "esbuild": "^0.19.0",
    "@tsconfig/node18": "^18.0.0",
    "jest": "^29.7.0",
    "@types/jest": "^29.5.8"
  }
}
```

## 🔍 CORE ALGORITHM

### Package Discovery Logic
```typescript
interface PackageInfo {
  name: string;
  path: string;
  type: 'node' | 'react' | 'next' | 'react-native' | 'docs' | 'unknown';
  dependencies: string[];
  scripts: string[];
  gitStatus: 'clean' | 'modified' | 'untracked';
  recentActivity: Date;
  description?: string;
}
```

### Package Detection
```bash
# Find all package.json files
find . -name "package.json" -not -path "./node_modules/*"

# Parse package.json for metadata
cat package.json | jq -r '.name, .description, .scripts'

# Detect package type based on dependencies
if grep -q "react" package.json; then echo "react"; fi
```

### Git Status Detection
```bash
# Check git status for package directory
cd package-path
git status --porcelain
```

## 🏗️ PROJECT STRUCTURE

```
monorepo-switcher/
├── src/
│   ├── index.ts              // Main CLI entry point
│   ├── discovery.ts          // Package discovery and parsing
│   ├── context.ts            // Session context tracking
│   ├── navigator.ts          // Fast workspace switching
│   ├── git-status.ts         // Git state detection
│   ├── formatter.ts          // Output formatting
│   ├── config.ts             // Configuration management
│   └── utils.ts              // Utility functions
├── test/
│   ├── discovery.test.ts
│   ├── navigator.test.ts
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
const program = new Command();
program
  .name('monorepo-switcher')
  .description('Intelligent CLI for fast monorepo workspace switching')
  .version('1.0.0');

// 2. Discover packages
const discovery = new PackageDiscovery();
const packages = await discovery.discover();

// 3. Handle commands
program
  .command('')
  .description('List all packages with context')
  .action(() => {
    const formatter = new Formatter();
    console.log(formatter.table(packages));
  });

program
  .command('<package>')
  .description('Switch to specific package')
  .action((packageName) => {
    const navigator = new WorkspaceNavigator();
    navigator.switch(packageName);
  });

program.parse();
```

### Package Discovery Class
```typescript
class PackageDiscovery {
  async discover(): Promise<PackageInfo[]> {
    const packageFiles = await this.findPackageFiles();
    const packages = await Promise.all(
      packageFiles.map(file => this.parsePackage(file))
    );
    return packages.filter(Boolean);
  }

  private async findPackageFiles(): Promise<string[]> {
    return fastGlob('**/package.json', {
      ignore: ['**/node_modules/**'],
      cwd: process.cwd()
    });
  }

  private async parsePackage(filePath: string): Promise<PackageInfo> {
    const content = await fs.readFile(filePath, 'utf8');
    const pkg = JSON.parse(content);
    const relativePath = path.dirname(filePath);
    
    return {
      name: pkg.name || relativePath,
      path: relativePath,
      type: this.detectPackageType(pkg),
      dependencies: Object.keys(pkg.dependencies || {}),
      scripts: Object.keys(pkg.scripts || {}),
      gitStatus: await this.checkGitStatus(relativePath),
      recentActivity: await this.getLastModified(relativePath),
      description: pkg.description
    };
  }

  private detectPackageType(pkg: any): PackageInfo['type'] {
    const deps = Object.keys(pkg.dependencies || {});
    
    if (deps.includes('react')) return 'react';
    if (deps.includes('next')) return 'next';
    if (deps.includes('react-native')) return 'react-native';
    if (pkg.name?.includes('docs')) return 'docs';
    if (deps.some(d => d.startsWith('@types/') || d === 'typescript')) return 'node';
    return 'unknown';
  }
}
```

### Workspace Navigator Class
```typescript
class WorkspaceNavigator {
  private history: string[] = [];

  async switch(packageName: string): Promise<void> {
    const packagePath = await this.findPackagePath(packageName);
    if (!packagePath) {
      throw new Error(`Package '${packageName}' not found`);
    }

    // Update history
    this.updateHistory(packageName);
    
    // Change directory
    process.chdir(packagePath);
    console.log(`🎯 Switched to ${packageName} at ${packagePath}`);
  }

  private async findPackagePath(packageName: string): Promise<string | null> {
    const packages = await new PackageDiscovery().discover();
    return packages.find(p => 
      p.name === packageName || 
      p.path.includes(packageName)
    )?.path || null;
  }

  private updateHistory(packageName: string): void {
    this.history = this.history.filter(name => name !== packageName);
    this.history.unshift(packageName);
    // Keep only last 10 packages
    if (this.history.length > 10) {
      this.history = this.history.slice(0, 10);
    }
  }
}
```

## 🎨 OUTPUT FORMATTING

### Table Format
```
📦 Monorepo: /Users/dev/my-project (12 packages)

🎯 RECENTLY USED:
├── backend/          ⭐ 2 files modified
├── frontend/        ✅ clean
└── shared/          🔥 5 files modified (active)

🔍 ALL PACKAGES:
├── backend/ (Node.js) - REST API service
├── frontend/ (React) - Web UI  
├── shared/ (TypeScript) - Common utilities
├── admin/ (React) - Admin dashboard
├── mobile/ (React Native) - Mobile app
└── docs/ (Markdown) - Project documentation
```

### Switch Confirmation
```
$ monorepo-switcher backend
🎯 Switching to backend...
✅ Successfully switched to /Users/dev/my-project/backend
```

## 🚀 BUILD PLAN

### Phase 1: Core Discovery (2 days)
- [ ] Implement PackageDiscovery class
- [ ] File system scanning (fast-glob)
- [ ] Package.json parsing and validation
- [ ] Package type detection logic
- [ ] Unit tests for discovery

### Phase 2: CLI Interface (1 day)
- [ ] Commander.js integration
- [ ] Command structure (list, switch, help)
- [ ] Argument parsing and validation
- [ ] Error handling and user feedback
- [ ] Basic output formatting

### Phase 3: Git Integration (1 day)
- [ ] Simple-git integration
- [ ] Git status detection for packages
- [ ] Modified/untracked file detection
- [ ] Visual indicators for package status
- [ ] Integration with package display

### Phase 4: Context & History (1 day)
- [ ] Session history tracking
- [ ] Recently used packages
- [ ] Package context awareness
- [ ] Smart completion
- [ ] Configuration persistence

### Phase 5: Documentation & Testing (1 day)
- [ ] Comprehensive README
- [ ] CLI help text and examples
- [ ] Integration tests
- [ ] End-to-end testing
- [ ] Package installation guide

### Phase 6: Build & Distribution (1 day)
- [ ] TypeScript compilation with esbuild
- [ ] Package.json setup
- [ ] npm publishing preparation
- [ ] GitHub repository setup

## 📊 COMPETITIVE ANALYSIS

| Tool | Stars | Language | Switching Focus | Developer Workflow | Last Updated |
|------|-------|----------|----------------|-------------------|--------------|
| **monorepo-switcher** (us) | - | TypeScript | ✅ YES | ✅ YES | 2026 |
| turbo | 18k⭐ | Rust | ❌ NO | ❌ CI/CD focused | 2026 |
| nx | 18k⭐ | TypeScript | ❌ NO | ❌ Complex graphs | 2026 |
| pnpm | 43k⭐ | JavaScript | ❌ NO | ❌ Manual cd commands | 2026 |
| rush | 8k⭐ | TypeScript | ❌ NO | ❌ Heavy, slow | 2023 |
| lerna | 11k⭐ | JavaScript | ❌ NO | ❌ Legacy | 2022 |

## 💰 INCOME PATH

### Primary: npm Pro + Consulting
1. **npm Pro Version**: $5/month with advanced features
   - Fuzzy search and intelligent completion
   - Session persistence across terminal restarts
   - Custom monorepo configuration
   - VS Code/terminal integration
   - Package dependency visualization

2. **Consulting Services**: $100-200/hour
   - Monorepo workflow optimization
   - Custom switching solutions
   - Team training on efficient monorepo usage

### Secondary: Reputation Building
1. **GitHub Stars**: Target 500+ stars in first 3 months
2. **Developer Community**: Active issue responses and feature requests
3. **Blog Content**: Tutorials on monorepo best practices

## 🎯 POSITIONING STRATEGY

### GitHub Description
> Intelligent CLI tool for instantly switching between packages in monorepos with context awareness. The first tool focused purely on developer workflow velocity in large codebases.

### Topics
- monorepo
- cli
- developer-tools
- typescript
- nodejs
- productivity
- workflow
- vscode
- switching

### First 100 Stars Plan
1. **Day 1**: Launch with basic functionality
2. **Week 1**: Respond to all issues, add requested features
3. **Week 2**: Tutorial blog posts and social media promotion
4. **Week 3**: Collaborate with monorepo-related projects
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
- **Performance**: Optimize file system scanning with caching
- **Cross-platform**: Test on Windows, macOS, Linux
- **Large monorepos**: Handle repositories with 1000+ packages

### Market Risks
- **Competition**: Focus purely on switching (unique selling point)
- **Adoption**: Make it dead simple to use (zero config)
- **Maintenance**: Regular updates and community engagement

### Security Risks
- **Directory traversal**: Validate package paths
- **File access**: Only read within monorepo root
- **Git operations**: Safe read-only operations only