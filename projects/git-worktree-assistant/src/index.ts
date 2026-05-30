#!/usr/bin/env node

import { Command } from 'commander';
import chalk from 'chalk';
import { WorktreeManager } from './worktree-manager';
import { WorktreeStatusCommand } from './commands/status';
import { WorktreeCreateCommand } from './commands/create';
import { WorktreeListCommand } from './commands/list';
import { WorktreeSwitchCommand } from './commands/switch';
import { WorktreeCleanupCommand } from './commands/cleanup';
import { WorktreeDepsCommand } from './commands/deps';

const program = new Command();
const assistant = new WorktreeManager();

program
  .name('git-worktree-assistant')
  .description('Smart git worktree management with context awareness and automated workflows')
  .version('1.0.0');

// Status command
program
  .command('status')
  .description('Show current workspace context and all worktrees')
  .action(() => {
    new WorktreeStatusCommand(assistant).execute();
  });

// Create command
program
  .command('create')
  .description('Create new worktree')
  .option('-b, --branch <branch>', 'branch to create worktree from')
  .option('-p, --path <path>', 'path for worktree')
  .action((options) => {
    new WorktreeCreateCommand(assistant).execute(options);
  });

// List command
program
  .command('list')
  .description('List all worktrees with status')
  .action(() => {
    new WorktreeListCommand(assistant).execute();
  });

// Switch command
program
  .command('switch')
  .description('Switch to worktree with fuzzy search')
  .action(() => {
    new WorktreeSwitchCommand(assistant).execute();
  });

// Cleanup command
program
  .command('cleanup')
  .description('Clean up stale worktrees interactively')
  .action(() => {
    new WorktreeCleanupCommand(assistant).execute();
  });

// Deps command
program
  .command('deps')
  .description('Show worktree dependencies and relationships')
  .action(() => {
    new WorktreeDepsCommand(assistant).execute();
  });

// Daemon command (optional)
program
  .command('daemon')
  .description('Run in daemon mode to auto-detect worktree context')
  .option('-i, --interval <seconds>', 'interval for checks', '60')
  .action((options) => {
    console.log(chalk.yellow('Daemon mode not yet implemented'));
  });

program.parse();