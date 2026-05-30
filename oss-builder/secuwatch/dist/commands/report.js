"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
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
            const fs = await Promise.resolve().then(() => __importStar(require('fs-extra')));
            const path = await Promise.resolve().then(() => __importStar(require('path')));
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