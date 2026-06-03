"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReportCommand = void 0;
const ConfigManager_1 = require("../config/ConfigManager");
const SecurityReporter_1 = require("../reporter/SecurityReporter");
const HtmlReporter_1 = require("../reporter/HtmlReporter");
const EmailReporter_1 = require("../reporter/EmailReporter");
class ReportCommand {
    async execute(options = {}) {
        const config = new ConfigManager_1.ConfigManager();
        const reporter = new SecurityReporter_1.SecurityReporter();
        try {
            const days = parseInt(options.days) || 7;
            const reportData = await this.generateReport(config, days);
            if (options.json) {
                console.log(JSON.stringify(reportData, null, 2));
                return;
            }
            if (options.email) {
                await this.sendEmailReport(reportData, options.email);
                return;
            }
            if (options.html) {
                await this.generateHtmlReport(reportData);
                return;
            }
            // Default console report
            reporter.displayReport(reportData);
        }
        catch (error) {
            console.error('Report generation failed:', error instanceof Error ? error.message : error);
            process.exit(1);
        }
    }
    async generateReport(config, days) {
        const now = new Date();
        const projects = await config.getProjects();
        const reportData = {
            generatedAt: now.toISOString(),
            period: `${days} days`,
            projects: projects.map((project) => ({
                name: project.name,
                path: project.path,
                scannedAt: now.toISOString(),
                vulnerabilities: [],
                outdated: [],
                warnings: []
            }))
        };
        // TODO: Actually scan projects and collect data
        // This is a placeholder - would implement actual scanning logic
        console.log('Scanning projects for report data...');
        return reportData;
    }
    async sendEmailReport(reportData, recipient) {
        try {
            await EmailReporter_1.EmailReporter.sendReport(reportData, recipient);
            console.log(`Email report sent to ${recipient}`);
        }
        catch (error) {
            console.error('Failed to send email report:', error instanceof Error ? error.message : error);
            process.exit(1);
        }
    }
    async generateHtmlReport(reportData) {
        try {
            const html = await HtmlReporter_1.HtmlReporter.generateHtml(reportData);
            const fs = await import('fs-extra');
            const path = await import('path');
            const outputPath = path.join(process.cwd(), 'security-report.html');
            await fs.writeFile(outputPath, html);
            console.log(`HTML report generated: ${outputPath}`);
        }
        catch (error) {
            console.error('Failed to generate HTML report:', error instanceof Error ? error.message : error);
            process.exit(1);
        }
    }
}
exports.ReportCommand = ReportCommand;
//# sourceMappingURL=report.js.map