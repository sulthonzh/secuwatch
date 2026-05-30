import { ConfigManager } from '../config/ConfigManager';
import { ScanResult } from '../scanner/ProjectScanner';
export interface MonitorResult {
    timestamp: string;
    projects: ScanResult[];
    summary: {
        totalProjects: number;
        vulnerableProjects: number;
        outdatedProjects: number;
        criticalVulnerabilities: number;
        highVulnerabilities: number;
        mediumVulnerabilities: number;
        lowVulnerabilities: number;
        totalOutdated: number;
    };
}
export declare class ProjectMonitor {
    private config;
    constructor(config: ConfigManager);
    monitorAll(): Promise<MonitorResult>;
    monitorProject(projectName: string): Promise<ScanResult | null>;
    shouldNotify(): Promise<boolean>;
}
//# sourceMappingURL=ProjectMonitor.d.ts.map