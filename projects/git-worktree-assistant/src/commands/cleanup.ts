import chalk from 'chalk';
import ora from 'ora';
import inquirer from 'inquirer';
import { BaseCommand } from './base';
import { WorktreeInfo } from '../worktree-manager';


export class WorktreeCleanupCommand extends BaseCommand {
  async execute(): Promise<void> {
    await this.initialize();
    
    const spinner = ora('Checking for stale worktrees...').start();
    
    try {
      const worktrees = await this.manager.getAllWorktrees();
      const staleWorktrees = worktrees.filter(wt => this.isStale(wt));
      
      spinner.stop();
      
      if (staleWorktrees.length === 0) {
        console.log(chalk.green('✅ No stale worktrees found'));
        return;
      }
      
      console.log(chalk.blue('\n🧹 Found stale worktrees:'));
      staleWorktrees.forEach((wt: WorktreeInfo, index: number) => {
        console.log(`${index + 1}. ${wt.path} (${wt.branch})`);
        console.log(`   Status: ${wt.isStale ? 'stale' : 'active'}`);
      });
      
      const { confirm } = await inquirer.prompt([
        {
          type: 'confirm',
          name: 'confirm',
          message: `Remove ${staleWorktrees.length} stale worktrees?`,
          default: false
        }
      ]);
      
      if (confirm) {
        const cleanupSpinner = ora('Cleaning up stale worktrees...').start();
        
        for (const wt of staleWorktrees) {
          try {
            await this.manager.removeWorktree(wt.path);
            console.log(chalk.green(`✅ Removed ${wt.path}`));
          } catch (error) {
            console.log(chalk.red(`❌ Failed to remove ${wt.path}: ${(error as Error).message}`));
          }
        }
        
        cleanupSpinner.stop();
        console.log(chalk.green(`\n✅ Cleanup complete. Removed ${staleWorktrees.length} worktrees`));
      } else {
        console.log(chalk.yellow('Cleanup cancelled'));
      }
    } catch (error) {
      spinner.stop();
      console.error(chalk.red('Error:'), (error as Error).message);
      process.exit(1);
    }
  }
  
  private isStale(worktree: WorktreeInfo): boolean {
    // For now, consider worktree stale if branch is deleted
    // TODO: Add last updated tracking
    return worktree.isStale;
  }
}