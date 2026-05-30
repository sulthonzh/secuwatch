import { exec } from 'child_process';
import { promisify } from 'util';
import path from 'path';
import fs from 'fs/promises';
import chalk from 'chalk';
import ora from 'ora';

const execAsync = promisify(exec);

export interface WorktreeInfo {
  path: string;
  branch: string;
  isCurrent: boolean;
  hasChanges: boolean;
  isStale: boolean;
}

export interface GitRepoInfo {
  root: string;
  currentBranch: string;
  currentWorktree?: string;
}

export class WorktreeManager {
  private gitRepoRoot: string | null = null;

  constructor(private worktreeDir?: string) {}

  async initialize(): Promise<void> {
    try {
      const { stdout } = await execAsync('git rev-parse --show-toplevel');
      this.gitRepoRoot = stdout.trim();
    } catch (error) {
      throw new Error('Not a git repository');
    }
  }

  async getCurrentWorktree(): Promise<string | undefined> {
    try {
      const { stdout } = await execAsync('git worktree list --porcelain');
      const lines = stdout.split('\n');
      const currentLine = lines.find(line => line.startsWith('HEAD'));
      
      if (currentLine) {
        const parts = currentLine.split(/\s+/);
        return parts[1] || undefined;
      }
      return undefined;
    } catch (error) {
      return undefined;
    }
  }

  async getAllWorktrees(): Promise<WorktreeInfo[]> {
    try {
      const { stdout } = await execAsync('git worktree list --porcelain');
      const lines = stdout.split('\n').filter(line => line.trim());
      
      const worktrees: WorktreeInfo[] = [];
      let currentWorktreePath = await this.getCurrentWorktree();
      
      for (let i = 0; i < lines.length; i += 3) {
        if (i + 2 < lines.length) {
          const headLine = lines[i];
          const worktreeLine = lines[i + 1];
          const branchLine = lines[i + 2];
          
          if (headLine.startsWith('HEAD') && worktreeLine.startsWith('worktree')) {
            const worktreePath = worktreeLine.split(/\s+/)[1];
            const branch = branchLine.replace(/^branch\s+/, '');
            const isCurrent = worktreePath === currentWorktreePath;
            const hasChanges = await this.hasUncommittedChanges(worktreePath);
            const isStale = await this.isWorktreeStale(worktreePath, branch);
            
            worktrees.push({
              path: worktreePath,
              branch,
              isCurrent,
              hasChanges,
              isStale
            });
          }
        }
      }
      
      return worktrees;
    } catch (error) {
      throw new Error(`Failed to get worktrees: ${error}`);
    }
  }

  async hasUncommittedChanges(worktreePath: string): Promise<boolean> {
    try {
      const { stdout } = await execAsync('git status --porcelain', { cwd: worktreePath });
      return stdout.trim().length > 0;
    } catch (error) {
      return false;
    }
  }

  async isWorktreeStale(worktreePath: string, branch: string): Promise<boolean> {
    try {
      // Check if the branch still exists
      const { stdout } = await execAsync(`git rev-parse --verify --quiet ${branch}`, { cwd: worktreePath });
      return stdout.trim() === '';
    } catch (error) {
      return true;
    }
  }

  async createWorktree(branch: string, customPath?: string): Promise<string> {
    if (!this.gitRepoRoot) {
      throw new Error('Git repository not initialized');
    }

    const worktreeName = branch.replace(/[^a-zA-Z0-9-]/g, '-');
    const defaultPath = path.join(this.gitRepoRoot, '..', `${path.basename(this.gitRepoRoot)}-${worktreeName}`);
    const worktreePath = customPath || defaultPath;

    try {
      await fs.access(worktreePath);
      throw new Error(`Worktree path already exists: ${worktreePath}`);
    } catch (error) {
      if ((error as any).code !== 'ENOENT') {
        throw error;
      }
    }

    const spinner = ora(`Creating worktree for branch ${chalk.blue(branch)}...`).start();
    
    try {
      await execAsync(`git worktree add ${worktreePath} ${branch}`, { cwd: this.gitRepoRoot });
      spinner.succeed(`Worktree created at ${chalk.green(worktreePath)}`);
      return worktreePath;
    } catch (error) {
      spinner.fail(`Failed to create worktree: ${error}`);
      throw error;
    }
  }

  async removeWorktree(worktreePath: string): Promise<void> {
    const spinner = ora(`Removing worktree at ${worktreePath}...`).start();
    
    try {
      await execAsync(`git worktree remove ${worktreePath}`);
      spinner.succeed(`Worktree removed successfully`);
    } catch (error) {
      spinner.fail(`Failed to remove worktree: ${error}`);
      throw error;
    }
  }

  async getGitRepoInfo(): Promise<GitRepoInfo> {
    if (!this.gitRepoRoot) {
      throw new Error('Git repository not initialized');
    }

    try {
      const { stdout: branch } = await execAsync('git branch --show-current', { cwd: this.gitRepoRoot });
      const currentWorktree = await this.getCurrentWorktree();
      
      return {
        root: this.gitRepoRoot,
        currentBranch: branch.trim(),
        currentWorktree
      };
    } catch (error) {
      throw new Error(`Failed to get git repo info: ${error}`);
    }
  }

  async detectContext(): Promise<{ type: string; name: string }> {
    if (!this.gitRepoRoot) {
      throw new Error('Git repository not initialized');
    }

    try {
      const dirName = path.basename(this.gitRepoRoot);
      
      // Try to detect project type
      try {
        await fs.access(path.join(this.gitRepoRoot, 'package.json'));
        return { type: 'node', name: dirName };
      } catch (error) {
        // Not a Node.js project
      }
      
      try {
        await fs.access(path.join(this.gitRepoRoot, 'Cargo.toml'));
        return { type: 'rust', name: dirName };
      } catch (error) {
        // Not a Rust project
      }
      
      try {
        await fs.access(path.join(this.gitRepoRoot, 'pyproject.toml'));
        return { type: 'python', name: dirName };
      } catch (error) {
        // Not a Python project
      }
      
      return { type: 'unknown', name: dirName };
    } catch (error) {
      return { type: 'unknown', name: 'unknown' };
    }
  }
}