import chalk from 'chalk';
import { BaseCommand } from './base';

export class WorktreeListCommand extends BaseCommand {
  async execute(): Promise<void> {
    await this.initialize();
    
    try {
      const worktrees = await this.manager.getAllWorktrees();
      
      if (worktrees.length === 0) {
        console.log(chalk.yellow('🌳 No worktrees found'));
        console.log('   Use "git-worktree-assistant create" to create your first worktree');
        return;
      }
      
      console.log(chalk.bold('\n🌳 Worktrees'));
      console.log('─'.repeat(80));
      
      worktrees.forEach((worktree: any, index: number) => {
        const prefix = worktree.isCurrent ? '▶' : '○';
        const status: string[] = [];
        const statusColors: Function[] = [];
        
        if (worktree.isCurrent) {
          status.push('current');
          statusColors.push(chalk.green);
        }
        if (worktree.hasChanges) {
          status.push('dirty');
          statusColors.push(chalk.yellow);
        }
        if (worktree.isStale) {
          status.push('stale');
          statusColors.push(chalk.red);
        }
        
        const statusText = status.length > 0 ? 
          status.map((s, i) => statusColors[i](s)).join(', ') : '';
        
        const branchColor = worktree.isCurrent ? chalk.green : chalk.blue;
        const pathColor = worktree.isCurrent ? chalk.green : chalk.gray;
        
        console.log(`${prefix} ${pathColor(worktree.path)}`);
        console.log(`   Branch: ${branchColor(worktree.branch)} ${statusText ? `(${statusText})` : ''}`);
        
        if (worktree.isStale) {
          console.log(`   ${chalk.red('⚠️  This worktree may be stale - the branch may have been deleted or merged')}`);
        }
        
        if (index < worktrees.length - 1) {
          console.log();
        }
      });
      
      // Summary
      const total = worktrees.length;
      const current = worktrees.filter(w => w.isCurrent).length;
      const stale = worktrees.filter(w => w.isStale).length;
      const dirty = worktrees.filter(w => w.hasChanges).length;
      
      console.log('─'.repeat(80));
      console.log(chalk.bold(`Summary: ${total} worktree${total > 1 ? 's' : ''}`));
      console.log(`   Current: ${current} | Stale: ${stale} | Dirty: ${dirty}`);
      
    } catch (error) {
      console.error(chalk.red(`❌ Failed to list worktrees: ${error}`));
      throw error;
    }
  }
}