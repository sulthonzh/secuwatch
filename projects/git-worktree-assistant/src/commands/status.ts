import chalk from 'chalk';
import ora from 'ora';
import { BaseCommand } from './base';

export class WorktreeStatusCommand extends BaseCommand {
  async execute(): Promise<void> {
    await this.initialize();
    
    const spinner = ora('Checking worktree status...').start();
    
    try {
      const [repoInfo, worktrees] = await Promise.all([
        this.manager.getGitRepoInfo(),
        this.manager.getAllWorktrees()
      ]);
      
      spinner.succeed();
      
      // Display repo info
      console.log(chalk.bold('\n📁 Repository Information'));
      console.log(`   Root: ${chalk.green(repoInfo.root)}`);
      console.log(`   Current Branch: ${chalk.blue(repoInfo.currentBranch)}`);
      console.log(`   Current Worktree: ${repoInfo.currentWorktree ? chalk.yellow(repoInfo.currentWorktree) : chalk.gray('None')}`);
      
      // Display context
      const context = await this.manager.detectContext();
      console.log(`   Project Type: ${chalk.magenta(context.type)} (${context.name})`);
      
      // Display worktrees
      if (worktrees.length === 0) {
        console.log(chalk.yellow('\n🌳 No worktrees found'));
        console.log('   Use "git-worktree-assistant create" to create your first worktree');
        return;
      }
      
      console.log(chalk.bold('\n🌳 Worktrees'));
      
      worktrees.forEach((worktree, index) => {
        const prefix = worktree.isCurrent ? '▶' : '○';
        const status = [];
        
        if (worktree.isCurrent) {
          status.push(chalk.green('current'));
        }
        if (worktree.hasChanges) {
          status.push(chalk.yellow('dirty'));
        }
        if (worktree.isStale) {
          status.push(chalk.red('stale'));
        }
        
        const statusText = status.length > 0 ? `(${status.join(', ')})` : '';
        const branchColor = worktree.isCurrent ? chalk.green : chalk.blue;
        
        console.log(`   ${prefix} ${worktree.path}`);
        console.log(`      Branch: ${branchColor(worktree.branch)} ${statusText}`);
        
        if (worktree.isStale) {
          console.log(`      ${chalk.red('⚠️  This worktree may be stale - the branch may have been deleted or merged')}`);
        }
        
        if (index < worktrees.length - 1) {
          console.log();
        }
      });
      
      // Show summary
      const staleCount = worktrees.filter(w => w.isStale).length;
      const dirtyCount = worktrees.filter(w => w.hasChanges).length;
      
      if (staleCount > 0 || dirtyCount > 0) {
        console.log(chalk.bold('\n📊 Summary'));
        if (staleCount > 0) {
          console.log(`   ${staleCount} stale worktree${staleCount > 1 ? 's' : ''} - consider running "git-worktree-assistant cleanup"`);
        }
        if (dirtyCount > 0) {
          console.log(`   ${dirtyCount} worktree${dirtyCount > 1 ? 's' : ''} with uncommitted changes`);
        }
      }
      
    } catch (error) {
      spinner.fail(`Failed to get worktree status: ${error}`);
      throw error;
    }
  }
}