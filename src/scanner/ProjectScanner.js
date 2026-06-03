"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProjectScanner = void 0;
const fs_extra_1 = __importDefault(require("fs-extra"));
const path_1 = __importDefault(require("path"));
const child_process_1 = require("child_process");
class ProjectScanner {
    constructor() { }
    async scan(projectPath, options = {}) {
        const targetPath = projectPath || process.cwd();
        const projectName = await this.getProjectName(targetPath);
        const result = {
            project: projectName,
            path: targetPath,
            scannedAt: new Date().toISOString(),
            vulnerabilities: [],
            outdated: [],
            warnings: []
        };
        try {
            // Check if it's a valid project
            const isValidProject = await this.isValidProject(targetPath);
            if (!isValidProject) {
                result.warnings.push('Not a valid npm project (package.json not found)');
                return result;
            }
            // Load package info
            result.packageInfo = await this.loadPackageInfo(targetPath);
            // Run npm audit
            if (options.severity !== 'none') {
                result.vulnerabilities = await this.runNpmAudit(targetPath, options);
            }
            // Check outdated packages
            result.outdated = await this.checkOutdatedPackages(targetPath);
            // Additional checks
            if (options.verbose) {
                result.warnings.push(...await this.runAdditionalChecks(targetPath));
            }
        }
        catch (error) {
            result.warnings.push(`Scan failed: ${error instanceof Error ? error.message : String(error)}`);
        }
        return result;
    }
    async getProjectName(projectPath) {
        try {
            const packageInfo = await this.loadPackageInfo(projectPath);
            return packageInfo.name || path_1.default.basename(projectPath);
        }
        catch {
            return path_1.default.basename(projectPath);
        }
    }
    async isValidProject(projectPath) {
        const packageJsonPath = path_1.default.join(projectPath, 'package.json');
        return fs_extra_1.default.pathExists(packageJsonPath);
    }
    async loadPackageInfo(projectPath) {
        const packageJsonPath = path_1.default.join(projectPath, 'package.json');
        const packageJson = await fs_extra_1.default.readJson(packageJsonPath);
        return {
            name: packageJson.name || 'unnamed',
            version: packageJson.version || '0.0.0',
            private: packageJson.private || false,
            scripts: packageJson.scripts || {},
            dependencies: packageJson.dependencies || {},
            devDependencies: packageJson.devDependencies || {},
            peerDependencies: packageJson.peerDependencies || {},
            optionalDependencies: packageJson.optionalDependencies || {}
        };
    }
    async runNpmAudit(projectPath, options) {
        try {
            // Run npm audit --json
            const jsonOutput = (0, child_process_1.execSync)('npm audit --json', {
                cwd: projectPath,
                encoding: 'utf8',
                maxBuffer: 1024 * 1024 * 10, // 10MB
                timeout: 30000
            });
            const auditData = JSON.parse(jsonOutput);
            if (!auditData.advisories) {
                return [];
            }
            const vulnerabilities = [];
            Object.values(auditData.advisories).forEach((advisory) => {
                const severity = this.mapSeverity(advisory.severity);
                // Filter by severity threshold
                if (this.getSeverityLevel(severity) < this.getSeverityLevel(options.severity || 'medium')) {
                    return;
                }
                vulnerabilities.push({
                    id: advisory.id.toString(),
                    title: advisory.title,
                    severity,
                    description: advisory.description || advisory.summary || 'No description',
                    affected: advisory.modules || [],
                    patched: advisory.patched_versions,
                    fix: advisory.fix_versions,
                    advisory: advisory.url
                });
            });
            return vulnerabilities;
        }
        catch (error) {
            // npm audit might fail on some systems or for network reasons
            if (error.signal === 'SIGTERM' || error.signal === 'SIGKILL') {
                throw new Error('npm audit timed out');
            }
            // Return empty array for audit-specific errors, but throw for others
            if (error.stdout?.includes('code 1') || error.stdout?.includes('audit failed')) {
                return []; // Audit failed but no specific info
            }
            throw error;
        }
    }
    async checkOutdatedPackages(projectPath) {
        try {
            // Run npm outdated --json
            const jsonOutput = (0, child_process_1.execSync)('npm outdated --json', {
                cwd: projectPath,
                encoding: 'utf8',
                maxBuffer: 1024 * 1024 * 10, // 10MB
                timeout: 30000
            });
            if (!jsonOutput || jsonOutput.trim() === '') {
                return [];
            }
            const outdatedData = JSON.parse(jsonOutput);
            const outdated = [];
            Object.entries(outdatedData).forEach(([name, data]) => {
                outdated.push({
                    name,
                    current: data.current || '0.0.0',
                    latest: data.latest || '0.0.0',
                    type: this.getDependencyType(name, data.current),
                    wanted: data.wanted,
                    latestFrom: data.latestFrom
                });
            });
            return outdated;
        }
        catch (error) {
            // npm outdated might fail, but we don't want to break the whole scan
            return [];
        }
    }
    async runAdditionalChecks(projectPath) {
        const warnings = [];
        // Check for deprecated packages
        try {
            const deprecated = await this.checkDeprecatedPackages(projectPath);
            warnings.push(...deprecated);
        }
        catch {
            // Ignore deprecated check failures
        }
        // Check for security issues in package scripts
        try {
            const scriptIssues = await this.checkPackageScripts(projectPath);
            warnings.push(...scriptIssues);
        }
        catch {
            // Ignore script check failures
        }
        return warnings;
    }
    async checkDeprecatedPackages(projectPath) {
        const warnings = [];
        try {
            const packageInfo = await this.loadPackageInfo(projectPath);
            for (const [name, version] of Object.entries(packageInfo.dependencies || {})) {
                try {
                    // This would check npm registry for deprecated packages
                    // For now, placeholder implementation
                    // const info = await fetch(`https://registry.npmjs.org/${name}`);
                    // if (info.deprecated) {
                    //   warnings.push(`Package ${name} is deprecated: ${info.deprecated}`);
                    // }
                }
                catch {
                    // Ignore registry check failures
                }
            }
        }
        catch {
            // Ignore package load failures
        }
        return warnings;
    }
    async checkPackageScripts(projectPath) {
        const warnings = [];
        try {
            const packageInfo = await this.loadPackageInfo(projectPath);
            Object.values(packageInfo.scripts || {}).forEach(script => {
                const dangerousScripts = ['rm -rf /', 'sudo rm -rf', 'del /f /s /q'];
                for (const dangerous of dangerousScripts) {
                    if (script.includes(dangerous)) {
                        warnings.push(`Potentially dangerous script detected: "${script}"`);
                        break;
                    }
                }
            });
        }
        catch {
            // Ignore script check failures
        }
        return warnings;
    }
    mapSeverity(severity) {
        const severityMap = {
            info: 'low',
            low: 'low',
            moderate: 'medium',
            high: 'high',
            critical: 'critical'
        };
        return severityMap[severity.toLowerCase()] || 'medium';
    }
    getSeverityLevel(severity) {
        const levels = { low: 0, medium: 1, high: 2, critical: 3 };
        return levels[severity] || 1;
    }
    getDependencyType(name, current) {
        // This is a simplified implementation - in a real implementation,
        // we would need to check the package.json to determine the dependency type
        return 'dependencies';
    }
}
exports.ProjectScanner = ProjectScanner;
//# sourceMappingURL=ProjectScanner.js.map