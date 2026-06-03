"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProjectCommand = void 0;
const ConfigManager_1 = require("../config/ConfigManager");
const ProjectScanner_1 = require("../scanner/ProjectScanner");
class ProjectCommand {
    async execute(options = {}) {
        const config = new ConfigManager_1.ConfigManager();
        if (options.add) {
            await this.addProject(config, options.add);
            return;
        }
        if (options.remove) {
            await this.removeProject(config, options.remove);
            return;
        }
        if (options.list) {
            await this.listProjects(config);
            return;
        }
        if (options.status) {
            await this.checkProjectStatus(config, options.status);
            return;
        }
        this.showUsage();
    }
    async addProject(config, projectName) {
        try {
            // Ask for project path
            const { projectPath } = await this.prompt([
                {
                    type: 'input',
                    name: 'projectPath',
                    message: `Enter path for project '${projectName}':`,
                    default: process.cwd()
                }
            ]);
            // Validate path exists
            const pathExists = await this.pathExists(projectPath);
            if (!pathExists) {
                console.log('Project path does not exist');
                console.log('Please provide a valid path to an existing project directory.');
                return;
            }
            // Check if it's a valid project (has package.json)
            const hasPackageJson = await this.hasPackageJson(projectPath);
            if (!hasPackageJson) {
                console.log('Not a valid project');
                console.log('The selected directory does not contain a package.json file.');
                return;
            }
            await config.addProject(projectName, projectPath);
            console.log(`Added project: ${projectName}`);
        }
        catch (error) {
            console.error('Failed to add project:', error instanceof Error ? error.message : error);
        }
    }
    async removeProject(config, projectName) {
        try {
            const projects = await config.getProjects();
            const project = projects.find(p => p.name === projectName);
            if (!project) {
                console.log(`Project '${projectName}' not found in configuration.`);
                return;
            }
            const confirmed = await this.prompt([
                {
                    type: 'confirm',
                    name: 'confirmed',
                    message: `Remove project '${projectName}'?`,
                    default: false
                }
            ]);
            if (!confirmed.confirmed) {
                console.log('Project removal cancelled');
                return;
            }
            await config.removeProject(projectName);
            console.log(`Removed project: ${projectName}`);
        }
        catch (error) {
            console.error('Failed to remove project:', error instanceof Error ? error.message : error);
        }
    }
    async listProjects(config) {
        const projects = await config.getProjects();
        if (projects.length === 0) {
            console.log('No projects configured');
            return;
        }
        console.log('Configured projects:');
        projects.forEach((project, index) => {
            console.log(`${index + 1}. ${project.name}`);
            console.log(`   Path: ${project.path}`);
            console.log(`   Added: ${project.added || 'Unknown'}`);
            console.log();
        });
    }
    async checkProjectStatus(config, projectName) {
        try {
            const projects = await config.getProjects();
            const project = projects.find(p => p.name === projectName);
            if (!project) {
                console.log(`Project '${projectName}' not found in configuration.`);
                return;
            }
            const scanner = new ProjectScanner_1.ProjectScanner();
            const result = await scanner.scan(project.path, {
                severity: 'low',
                verbose: true
            });
            console.log(`Status check completed for ${projectName}`);
            this.displayProjectStatus(project, result);
        }
        catch (error) {
            console.error('Status check failed:', error instanceof Error ? error.message : error);
        }
    }
    displayProjectStatus(project, result) {
        console.log(`Project: ${project.name}`);
        console.log(`Path: ${project.path}`);
        console.log();
        if (result.vulnerabilities && result.vulnerabilities.length > 0) {
            console.log(`Vulnerabilities: ${result.vulnerabilities.length}`);
            result.vulnerabilities.forEach((vuln) => {
                console.log(`  - ${vuln.title} (${vuln.severity})`);
            });
            console.log();
        }
        else {
            console.log('✅ No vulnerabilities detected');
        }
        if (result.outdated && result.outdated.length > 0) {
            console.log(`Outdated packages: ${result.outdated.length}`);
            result.outdated.slice(0, 5).forEach((pkg) => {
                console.log(`  - ${pkg.name}: ${pkg.current} → ${pkg.latest}`);
            });
            if (result.outdated.length > 5) {
                console.log(`  ... and ${result.outdated.length - 5} more`);
            }
            console.log();
        }
        else {
            console.log('✅ All packages up to date');
        }
        if (result.warnings && result.warnings.length > 0) {
            console.log('Warnings:');
            result.warnings.forEach((warning) => {
                console.log(`  - ${warning}`);
            });
        }
    }
    showUsage() {
        console.log('SecuWatch Project Management');
        console.log('=============================');
        console.log('Use one of the following subcommands:');
        console.log('');
        console.log('  secuwatch project --add <name>     Add a new project');
        console.log('  secuwatch project --remove <name>  Remove a project');
        console.log('  secuwatch project --list          List all projects');
        console.log('  secuwatch project --status <name>  Check project status');
        console.log('');
        console.log('Please specify a project subcommand.');
    }
    async pathExists(path) {
        try {
            const fs = await import('fs-extra');
            return fs.existsSync(path);
        }
        catch {
            return false;
        }
    }
    async hasPackageJson(path) {
        try {
            const fs = await import('fs-extra');
            const packageJsonPath = require('path').join(path, 'package.json');
            return fs.existsSync(packageJsonPath);
        }
        catch {
            return false;
        }
    }
    async prompt(questions) {
        const inquirer = await import('inquirer');
        return inquirer.default.prompt(questions);
    }
}
exports.ProjectCommand = ProjectCommand;
//# sourceMappingURL=project.js.map