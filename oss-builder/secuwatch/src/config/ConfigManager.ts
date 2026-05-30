import fs from 'fs-extra';
import path from 'path';
import os from 'os';

export interface ProjectConfig {
  name: string;
  path: string;
  added?: string;
  lastScanned?: string;
}

export interface SecuWatchConfig {
  projectsDir: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  checkInterval: number;
  emailNotifications: boolean;
  emailRecipient?: string;
  notifications: {
    slack?: {
      webhook?: string;
      channel?: string;
    };
    discord?: {
      webhook?: string;
      channel?: string;
    };
  };
  projects: ProjectConfig[];
}

export class ConfigManager {
  private configPath: string;
  private config: SecuWatchConfig;

  constructor() {
    this.configPath = path.join(os.homedir(), '.secuwatch', 'config.json');
    this.config = this.getDefaultConfig();
    this.ensureConfigDir();
  }

  private getDefaultConfig(): SecuWatchConfig {
    return {
      projectsDir: path.join(os.homedir(), 'projects'),
      severity: 'medium',
      checkInterval: 3600, // 1 hour
      emailNotifications: false,
      notifications: {},
      projects: []
    };
  }

  private async ensureConfigDir() {
    const configDir = path.dirname(this.configPath);
    await fs.ensureDir(configDir);
    
    if (!(await fs.pathExists(this.configPath))) {
      await this.save();
    }
  }

  async load(): Promise<SecuWatchConfig> {
    try {
      const data = await fs.readJson(this.configPath);
      this.config = { ...this.getDefaultConfig(), ...data };
      return this.config;
    } catch (error) {
      // If config doesn't exist or is corrupted, create default
      await this.save();
      return this.config;
    }
  }

  async save(): Promise<void> {
    await fs.writeJson(this.configPath, this.config, { spaces: 2 });
  }

  async get<T extends keyof SecuWatchConfig>(key: T): Promise<SecuWatchConfig[T]> {
    await this.load();
    return this.config[key];
  }

  async set(newConfig: Partial<SecuWatchConfig>): Promise<void> {
    await this.load();
    this.config = { ...this.config, ...newConfig };
    await this.save();
  }

  async getAll(): Promise<SecuWatchConfig> {
    await this.load();
    return this.config;
  }

  async reset(): Promise<void> {
    this.config = this.getDefaultConfig();
    await this.save();
  }

  async addProject(name: string, path: string): Promise<void> {
    await this.load();
    
    // Check if project already exists
    const exists = this.config.projects.some((p: ProjectConfig) => p.name === name);
    if (exists) {
      throw new Error(`Project '${name}' already exists`);
    }

    const project: ProjectConfig = {
      name,
      path,
      added: new Date().toISOString()
    };

    this.config.projects = [...this.config.projects, project];
    await this.save();
  }

  async removeProject(name: string): Promise<void> {
    await this.load();
    
    const projects = this.config.projects.filter((p: ProjectConfig) => p.name !== name);
    this.config.projects = projects;
    await this.save();
  }

  async getProjects(): Promise<ProjectConfig[]> {
    await this.load();
    return this.config.projects || [];
  }

  async getProject(name: string): Promise<ProjectConfig | null> {
    await this.load();
    return this.config.projects.find((p: ProjectConfig) => p.name === name) || null;
  }

  async updateProject(name: string, updates: Partial<ProjectConfig>): Promise<void> {
    await this.load();
    
    const index = this.config.projects.findIndex((p: ProjectConfig) => p.name === name);
    if (index === -1) {
      throw new Error(`Project '${name}' not found`);
    }

    this.config.projects[index] = { ...this.config.projects[index], ...updates };
    await this.save();
  }

  getConfigPath(): string {
    return this.configPath;
  }

  getProjectPath(): string {
    return this.configPath;
  }
}