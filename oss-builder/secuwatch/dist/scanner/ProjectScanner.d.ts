export interface ScanResult {
    project: string;
    path: string;
    scannedAt: string;
    vulnerabilities: Vulnerability[];
    outdated: OutdatedPackage[];
    warnings: string[];
    packageInfo?: PackageInfo;
}
export interface Vulnerability {
    id: string;
    title: string;
    severity: 'low' | 'medium' | 'high' | 'critical';
    description: string;
    affected: string[];
    patched?: string[];
    fix?: string;
    advisory?: string;
}
export interface OutdatedPackage {
    name: string;
    current: string;
    latest: string;
    type: 'dependencies' | 'devDependencies' | 'peerDependencies' | 'optionalDependencies';
    wanted?: string;
    latestFrom?: string;
}
export interface PackageInfo {
    name: string;
    version: string;
    private: boolean;
    scripts: Record<string, string>;
    dependencies: Record<string, string>;
    devDependencies?: Record<string, string>;
    peerDependencies?: Record<string, string>;
    optionalDependencies?: Record<string, string>;
}
export declare class ProjectScanner {
    constructor();
    scan(projectPath?: string, options?: any): Promise<ScanResult>;
    private getProjectName;
    private isValidProject;
    private loadPackageInfo;
    private runNpmAudit;
    private checkOutdatedPackages;
    private runAdditionalChecks;
    private checkDeprecatedPackages;
    private checkPackageScripts;
    private mapSeverity;
    private getSeverityLevel;
    private getDependencyType;
}
//# sourceMappingURL=ProjectScanner.d.ts.map