import chalk from 'chalk';
import inquirer from 'inquirer';
import { BaseCommand } from './base';

export class WorktreeSwitchCommand extends BaseCommand {
  async execute(): Promise<void> {
    await this.initialize();
    
    try {
      const worktrees = await this.manager.getAllWorktrees();
      
      if (worktrees.length === 0) {
        console.log(chalk.yellow('🌳 No worktrees found to switch to'));
        console.log('   Use "git-worktree-assistant create" to create worktrees first');
        return;
      }
      
      // Filter out current worktree
      const availableWorktrees = worktrees.filter(w => !w.isCurrent);
      
      if (availableWorktrees.length === 0) {
        console.log(chalk.yellow('🌳 No other worktrees available to switch to'));
        return;
      }
      
      // Create choices for fuzzy search
      const choices = availableWorktrees.map(worktree => ({
        name: `${worktree.branch} (${worktree.path})`,
        value: worktree,
        short: `${worktree.branch} → ${worktree.path}`
      }));
      
      const { selectedWorktree } = await inquirer.prompt([
        {
          type: 'list',
          name: 'selectedWorktree',
          message: 'Select a worktree to switch to:',
          choices,
          pageSize: 10
        }
      ]);
      
      // Confirm switch
      const { confirm } = await inquirer.prompt([
        {
          type: 'confirm',
          name: 'confirm',
          message: `Switch to worktree at ${chalk.green(selectedWorktree.path)}?`,
          default: true
        }
      ]);
      
      if (!confirm) {
        console.log(chalk.yellow('Switch cancelled'));
        return;
      }
      
      // Perform the switch by changing directory
      
      console.log(chalk.bold('\n🔄 Switching worktree...'));
      console.log(`   Current directory: ${process.cwd()}`);
      console.log(`   Target worktree: ${chalk.green(selectedWorktree.path)}`);
      
      // Use cd command - note this only works in the current shell session
      console.log(chalk.bold('\n💡 To complete the switch, run:'));
      console.log(`   cd ${selectedWorktree.path}`);
      console.log(`   git-worktree-assistant status`);
      
      // Also show the git command
      console.log(chalk.bold('\n📋 You can also use:'));
      console.log(`   cd ${selectedWorktree.path}`);
      
    } catch (error) {
      console.error(chalk.red(`❌ Failed to switch worktree: ${error}`));
      throw error;
    }
  }
}