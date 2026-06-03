"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProjectMonitor = void 0;
const ConfigManager_1 = require("../config/ConfigManager");
const ProjectScanner_1 = require("../scanner/ProjectScanner");
const ProjectScanner_2 = require("../scanner/ProjectScanner");
class ProjectMonitor {
    config;
    constructor(config) {
        this.config = config;
    }
    async monitorAll() {
        const projects = await this.config.getProjects();
        const results = [];
        const summary = {
            totalProjects: projects.length,
            vulnerableProjects: 0,
            outdatedProjects: 0,
            criticalVulnerabilities: 0,
            highVulnerabilities: 0,
            mediumVulnerabilities: 0,
            lowVulnerabilities: 0,
            totalOutdated: 0
        };
        for (const project of projects) {
            try {
                const scanner = new ProjectScanner_1.ProjectScanner();
                const result = await scanner.scan(project.path);
                results.push(result);
                // Update summary
                if (result.vulnerabilities.length > 0) {
                    summary.vulnerableProjects++;
                }
                if (result.outdated.length > 0) {
                    summary.outdatedProjects++;
                    summary.totalOutdated += result.outdated.length;
                }
                result.vulnerabilities.forEach(vuln => {
                    switch (vuln.severity) {
                        case 'critical':
                            summary.criticalVulnerabilities++;
                            break;
                        case 'high':
                            summary.highVulnerabilities++;
                            break;
                        case 'medium':
                            summary.mediumVulnerabilities++;
                            break;
                        case 'low':
                            summary.lowVulnerabilities++;
                            break;
                    }
                });
                // Update last scanned time
                await this.config.updateProject(project.name, {
                    lastScanned: new Date().toISOString()
                });
            }
            catch (error) {
                // Continue with other projects even if one fails
            }
        }
        return {
            timestamp: new Date().toISOString(),
            projects: results,
            summary
        };
    }
    async monitorProject(projectName) {
        const project = await this.config.getProject(projectName);
        if (!project) {
            throw new Error(`Project '${projectName}' not found`);
        }
        const scanner = new ProjectScanner_1.ProjectScanner();
        const result = await scanner.scan(project.path);
        // Update last scanned time
        await this.config.updateProject(projectName, {
            lastScanned: new Date().toISOString()
        });
        return result;
    }
    async shouldNotify() {
        // For now, just return true to enable notifications
        return true;
    }
}
exports.ProjectMonitor = ProjectMonitor;
//# sourceMappingURL=ProjectMonitor.js.map