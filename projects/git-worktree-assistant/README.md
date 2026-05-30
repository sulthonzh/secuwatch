# Git Worktree Assistant

Smart git worktree management with context awareness and automated workflows.

## Features

- 🎯 **Context Awareness**: Knows which worktree you're in and shows relevant information
- 🚀 **Quick Creation**: One-command worktree creation with smart defaults  
- 🔗 **Dependency Visualization**: See relationships between worktrees and branches
- 🧹 **Smart Cleanup**: Detect and safely remove stale worktrees
- ⚡ **Fast Switching**: Fuzzy search through all worktrees with smart history

## Installation

```bash
npm install -g git-worktree-assistant
```

## Quick Start

```bash
# Check current worktree status
git-worktree-assistant status

# Create new worktree from current branch
git-worktree-assistant create

# Switch to worktree with fuzzy search
git-worktree-assistant switch

# Clean up stale worktrees
git-worktree-assistant cleanup
```

## Why Use Git Worktree Assistant?

Git worktrees are powerful but cumbersome. This tool provides:

- **Automatic detection** of your current worktree context
- **Smart suggestions** based on your workflow patterns  
- **Visual relationships** between worktrees and branches
- **Automated cleanup** to prevent disk space issues
- **Cross-worktree coordination** for complex workflows

## Examples

See the [examples](./examples/) directory for common workflows and advanced usage patterns.

## Contributing

Welcome! Please see [CONTRIBUTING.md](./CONTRIBUTING.md) for guidelines.

## License

MIT - see [LICENSE](./LICENSE) for details.