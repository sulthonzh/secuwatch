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
export declare class ConfigManager {
    private configPath;
    private config;
    constructor();
    private getDefaultConfig;
    private ensureConfigDir;
    load(): Promise<SecuWatchConfig>;
    save(): Promise<void>;
    get<T extends keyof SecuWatchConfig>(key: T): Promise<SecuWatchConfig[T]>;
    set(newConfig: Partial<SecuWatchConfig>): Promise<void>;
    getAll(): Promise<SecuWatchConfig>;
    reset(): Promise<void>;
    addProject(name: string, path: string): Promise<void>;
    removeProject(name: string): Promise<void>;
    getProjects(): Promise<ProjectConfig[]>;
    getProject(name: string): Promise<ProjectConfig | null>;
    updateProject(name: string, updates: Partial<ProjectConfig>): Promise<void>;
    getConfigPath(): string;
    getProjectPath(): string;
}
//# sourceMappingURL=ConfigManager.d.ts.map