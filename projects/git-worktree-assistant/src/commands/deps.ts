import chalk from 'chalk';
import { BaseCommand } from './base';
import { WorktreeInfo } from '../worktree-manager';

export class WorktreeDepsCommand extends BaseCommand {
  async execute(): Promise<void> {
    await this.initialize();
    
    try {
      const worktrees = await this.manager.getAllWorktrees();
      
      if (worktrees.length === 0) {
        console.log(chalk.yellow('🌳 No worktrees found'));
        console.log('   Use "git-worktree-assistant create" to create your first worktree');
        return;
      }
      
      console.log(chalk.bold('\n🔗 Worktree Dependencies & Relationships'));
      console.log('─'.repeat(80));
      
      // Group worktrees by branch
      const branchMap = new Map<string, WorktreeInfo[]>();
      worktrees.forEach(worktree => {
        if (!branchMap.has(worktree.branch)) {
          branchMap.set(worktree.branch, []);
        }
        branchMap.get(worktree.branch)!.push(worktree);
      });
      
      // Display branch relationships
      branchMap.forEach((worktreesForBranch, branch) => {
        const branchColor = worktreesForBranch.some(w => w.isCurrent) ? chalk.green : chalk.blue;
        console.log(chalk.bold(`Branch: ${branchColor(branch)}`));
        
        worktreesForBranch.forEach(worktree => {
          const prefix = worktree.isCurrent ? '▶' : '○';
          const pathColor = worktree.isCurrent ? chalk.green : chalk.gray;
          
          console.log(`   ${prefix} ${pathColor(worktree.path)}`);
          
          // Show status
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
          
          if (status.length > 0) {
            console.log(`      Status: ${status.join(', ')}`);
          }
        });
        
        console.log();
      });
      
      // Show relationships and dependencies
      console.log(chalk.bold('📊 Relationships & Dependencies'));
      console.log('─'.repeat(80));
      
      // Find shared branches (multiple worktrees for same branch)
      const sharedBranches = Array.from(branchMap.entries()).filter(([, worktrees]) => worktrees.length > 1);
      
      if (sharedBranches.length > 0) {
        console.log(chalk.yellow('⚠️  Multiple worktrees for the same branch:'));
        sharedBranches.forEach(([branch, worktrees]) => {
          console.log(`   ${branch}: ${worktrees.length} worktree${worktrees.length > 1 ? 's' : ''}`);
          worktrees.forEach(worktree => {
            console.log(`     - ${worktree.path}`);
          });
        });
        console.log();
      }
      
      // Find stale worktrees
      const staleWorktrees = worktrees.filter(w => w.isStale);
      if (staleWorktrees.length > 0) {
        console.log(chalk.red('🗑️  Stale worktrees (branch may have been deleted/merged):'));
        staleWorktrees.forEach(worktree => {
          console.log(`   ${worktree.path} (${worktree.branch})`);
        });
        console.log();
      }
      
      // Find dirty worktrees
      const dirtyWorktrees = worktrees.filter(w => w.hasChanges);
      if (dirtyWorktrees.length > 0) {
        console.log(chalk.yellow('💾 Worktrees with uncommitted changes:'));
        dirtyWorktrees.forEach(worktree => {
          console.log(`   ${worktree.path} (${worktree.branch})`);
        });
        console.log();
      }
      
      // Recommendations
      console.log(chalk.bold('💡 Recommendations'));
      console.log('─'.repeat(80));
      
      if (staleWorktrees.length > 0) {
        console.log(`• Consider running "git-worktree-assistant cleanup" to remove ${staleWorktrees.length} stale worktree${staleWorktrees.length > 1 ? 's' : ''}`);
      }
      
      if (dirtyWorktrees.length > 0) {
        console.log(`• ${dirtyWorktrees.length} worktree${dirtyWorktrees.length > 1 ? 's' : ''} have uncommitted changes - commit or stash changes before switching`);
      }
      
      if (sharedBranches.length > 0) {
        console.log(`• ${sharedBranches.length} branch${sharedBranches.length > 1 ? 'es' : ''} have multiple worktrees - consider cleaning up duplicates`);
      }
      
      // Summary
      console.log('─'.repeat(80));
      console.log(chalk.bold(`Summary: ${worktrees.length} worktree${worktrees.length > 1 ? 's' : ''} across ${branchMap.size} branch${branchMap.size > 1 ? 'es' : ''}`));
      
    } catch (error) {
      console.error(chalk.red(`❌ Failed to show worktree dependencies: ${error}`));
      throw error;
    }
  }
}