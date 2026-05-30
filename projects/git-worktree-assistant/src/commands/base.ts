import { WorktreeManager } from '../worktree-manager';

export abstract class BaseCommand {
  protected manager: WorktreeManager;

  constructor(protected worktreeDir?: string) {
    this.manager = new WorktreeManager(worktreeDir);
  }

  protected async initialize(): Promise<void> {
    await this.manager.initialize();
  }

  abstract execute(): Promise<void>;
}