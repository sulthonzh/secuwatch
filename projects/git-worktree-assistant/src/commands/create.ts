import chalk from 'chalk';
import inquirer from 'inquirer';
import { BaseCommand } from './base';

interface CreateOptions {
  branch?: string;
  path?: string;
}

export class WorktreeCreateCommand extends BaseCommand {
  constructor(private options: CreateOptions = {}) {
    super();
  }

  async execute(): Promise<void> {
    await this.initialize();
    
    try {
      const context = await this.manager.detectContext();
      const repoInfo = await this.manager.getGitRepoInfo();
      
      let branch = this.options.branch;
      
      // If no branch specified, ask for it
      if (!branch) {
        const { selectedBranch } = await inquirer.prompt([
          {
            type: 'list',
            name: 'selectedBranch',
            message: 'Select a branch to create worktree from:',
            choices: await this.getAvailableBranches()
          }
        ]);
        branch = selectedBranch;
      }
      
      // Validate branch exists
      if (!branch || !await this.branchExists(branch)) {
        throw new Error(`Branch "${branch}" does not exist`);
      }
      
      // Handle path
      let worktreePath = this.options.path;
      
      if (!worktreePath) {
        const defaultPath = this.getDefaultPath(branch!, repoInfo.root);
        const { useDefaultPath } = await inquirer.prompt([
          {
            type: 'confirm',
            name: 'useDefaultPath',
            message: `Use default path: ${chalk.green(defaultPath)}?`,
            default: true
          }
        ]);
        
        if (useDefaultPath) {
          worktreePath = defaultPath;
        } else {
          const { customPath } = await inquirer.prompt([
            {
              type: 'input',
              name: 'customPath',
              message: 'Enter custom path for worktree:',
              validate: (input) => input.trim() !== '' || 'Path cannot be empty'
            }
          ]);
          worktreePath = customPath.trim();
        }
      }
      
      // Confirm before creating
      const { confirm } = await inquirer.prompt([
        {
          type: 'confirm',
          name: 'confirm',
          message: `Create worktree at ${chalk.green(worktreePath)} for branch ${chalk.blue(branch)}?`,
          default: true
        }
      ]);
      
      if (!confirm) {
        console.log(chalk.yellow('Worktree creation cancelled'));
        return;
      }
      
      // Create the worktree
      const createdPath = await this.manager.createWorktree(branch!, worktreePath);
      
      console.log(chalk.bold('\n✅ Worktree created successfully!'));
      console.log(`   Path: ${chalk.green(createdPath)}`);
      console.log(`   Branch: ${chalk.blue(branch)}`);
      console.log(`   Type: ${chalk.magenta(context.type)} project`);
      
      // Suggest next steps
      console.log(chalk.bold('\n💡 Next steps:'));
      console.log(`   cd ${chalk.green(createdPath)}`);
      console.log(`   git-worktree-assistant status`);
      
    } catch (error) {
      console.error(chalk.red(`❌ Failed to create worktree: ${error}`));
      throw error;
    }
  }

  private async getAvailableBranches(): Promise<string[]> {
    try {
      const { stdout } = await require('child_process').execSync('git branch --format="%(refname:short)"');
      return stdout.trim().split('\n').filter((branch: string) => branch.trim() !== '');
    } catch (error) {
      throw new Error('Failed to get available branches');
    }
  }

  private async branchExists(branch: string): Promise<boolean> {
    try {
      await require('child_process').execSync(`git rev-parse --verify --quiet ${branch!}`);
      return true;
    } catch (error) {
      return false;
    }
  }

  private getDefaultPath(branch: string, repoRoot: string): string {
    const worktreeName = branch.replace(/[^a-zA-Z0-9-]/g, '-');
    const repoName = require('path').basename(repoRoot);
    return require('path').join(require('path').dirname(repoRoot), `${repoName}-${worktreeName}`);
  }
}