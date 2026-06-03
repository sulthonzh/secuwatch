import fs from 'fs-extra';
import path from 'path';
import { execSync } from 'child_process';

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

export class ProjectScanner {
  constructor() {}

  async scan(projectPath?: string, options: any = {}): Promise<ScanResult> {
    const targetPath = projectPath || process.cwd();
    const projectName = await this.getProjectName(targetPath);
    const result: ScanResult = {
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

    } catch (error) {
      result.warnings.push(`Scan failed: ${error instanceof Error ? error.message : String(error)}`);
    }

    return result;
  }

  private async getProjectName(projectPath: string): Promise<string> {
    try {
      const packageInfo = await this.loadPackageInfo(projectPath);
      return packageInfo.name || path.basename(projectPath);
    } catch {
      return path.basename(projectPath);
    }
  }

  private async isValidProject(projectPath: string): Promise<boolean> {
    const packageJsonPath = path.join(projectPath, 'package.json');
    return fs.pathExists(packageJsonPath);
  }

  private async loadPackageInfo(projectPath: string): Promise<PackageInfo> {
    const packageJsonPath = path.join(projectPath, 'package.json');
    const packageJson = await fs.readJson(packageJsonPath);
    
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

  private async runNpmAudit(projectPath: string, options: any): Promise<Vulnerability[]> {
    try {
      // Run npm audit --json
      const jsonOutput = execSync('npm audit --json', {
        cwd: projectPath,
        encoding: 'utf8',
        maxBuffer: 1024 * 1024 * 10, // 10MB
        timeout: 30000
      });

      const auditData = JSON.parse(jsonOutput);
      
      if (!auditData.advisories) {
        return [];
      }

      const vulnerabilities: Vulnerability[] = [];
      
      Object.values(auditData.advisories).forEach((advisory: any) => {
        const severity = this.mapSeverity(advisory.severity);
        
        // Filter by severity threshold
        const severityThreshold = options.severity || 'medium';
        if (this.getSeverityLevel(severity) < this.getSeverityLevel(severityThreshold)) {
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
    } catch (error: any) {
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

  private async checkOutdatedPackages(projectPath: string): Promise<OutdatedPackage[]> {
    try {
      // Run npm outdated --json
      const jsonOutput = execSync('npm outdated --json', {
        cwd: projectPath,
        encoding: 'utf8',
        maxBuffer: 1024 * 1024 * 10, // 10MB
        timeout: 30000
      });

      if (!jsonOutput || jsonOutput.trim() === '') {
        return [];
      }

      const outdatedData = JSON.parse(jsonOutput);
      const outdated: OutdatedPackage[] = [];

      Object.entries(outdatedData).forEach(([name, data]: [string, any]) => {
        outdated.push({
          name,
          current: data.current || '0.0.0',
          latest: data.latest || '0.0.0',
          type: this.getDependencyType(),
          wanted: data.wanted,
          latestFrom: data.latestFrom
        });
      });

      return outdated;
    } catch (error) {
      // npm outdated might fail, but we don't want to break the whole scan
      return [];
    }
  }

  private async runAdditionalChecks(projectPath: string): Promise<string[]> {
    const warnings: string[] = [];

    // Check for deprecated packages
    try {
      const deprecated = await this.checkDeprecatedPackages(projectPath);
      warnings.push(...deprecated);
    } catch {
      // Ignore deprecated check failures
    }

    // Check for security issues in package scripts
    try {
      const scriptIssues = await this.checkPackageScripts(projectPath);
      warnings.push(...scriptIssues);
    } catch {
      // Ignore script check failures
    }

    return warnings;
  }

  private async checkDeprecatedPackages(projectPath: string): Promise<string[]> {
    const warnings: string[] = [];
    
    try {
      const packageInfo = await this.loadPackageInfo(projectPath);
      
      Object.entries(packageInfo.dependencies || {}).forEach(() => {
        try {
          // This would check npm registry for deprecated packages
          // For now, placeholder implementation
          // const info = await fetch(`https://registry.npmjs.org/${package}`);
          // if (info.deprecated) {
          //   warnings.push(`Package is deprecated`);
          // }
        } catch {
          // Ignore registry check failures
        }
      });
    } catch {
      // Ignore package load failures
    }

    return warnings;
  }

  private async checkPackageScripts(projectPath: string): Promise<string[]> {
    const warnings: string[] = [];
    
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
    } catch {
      // Ignore script check failures
    }

    return warnings;
  }

  private mapSeverity(severity: string): 'low' | 'medium' | 'high' | 'critical' {
    const severityMap: Record<string, 'low' | 'medium' | 'high' | 'critical'> = {
      info: 'low',
      low: 'low',
      moderate: 'medium',
      high: 'high',
      critical: 'critical'
    };
    
    return severityMap[severity.toLowerCase()] || 'medium';
  }

  private getSeverityLevel(severity: string): number {
    const levels = { low: 0, medium: 1, high: 2, critical: 3 };
    return levels[severity as keyof typeof levels] || 1;
  }

  private getDependencyType(): 'dependencies' | 'devDependencies' | 'peerDependencies' | 'optionalDependencies' {
    // This is a simplified implementation - in a real implementation,
    // we would need to check the package.json to determine the dependency type
    return 'dependencies';
  }
}