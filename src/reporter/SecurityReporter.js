"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SecurityReporter = void 0;
const chalk_1 = __importDefault(require("chalk"));
const ProjectScanner_1 = require("../scanner/ProjectScanner");
class SecurityReporter {
    displayScanResults(result) {
        this.printHeader(`Security Scan Results - ${result.project}`);
        if (result.warnings.length > 0) {
            this.printWarnings(result.warnings);
        }
        if (result.packageInfo) {
            this.printPackageInfo(result.packageInfo);
        }
        this.printVulnerabilities(result.vulnerabilities);
        this.printOutdatedPackages(result.outdated);
        this.printSummary(result);
    }
    displayReport(report) {
        this.printHeader('Security Report');
        console.log(`Generated: ${new Date(report.generatedAt).toLocaleString()}`);
        console.log(`Period: ${report.period}\n`);
        if (report.projects && report.projects.length > 0) {
            report.projects.forEach((project) => {
                this.printProjectReport(project);
            });
        }
        else {
            console.log(chalk_1.default.yellow('No projects configured for monitoring'));
        }
        this.printReportSummary(report);
    }
    printHeader(title) {
        console.log(chalk_1.default.bold.blue('\n' + '='.repeat(60)));
        console.log(chalk_1.default.bold.blue(title.toUpperCase()));
        console.log(chalk_1.default.bold.blue('='.repeat(60) + '\n'));
    }
    printPackageInfo(packageInfo) {
        console.log(chalk_1.default.bold.blue('Package Information:'));
        console.log(`  Name: ${packageInfo.name}`);
        console.log(`  Version: ${packageInfo.version}`);
        console.log(`  Type: ${packageInfo.private ? 'Private' : 'Public'}`);
        console.log(`  Scripts: ${Object.keys(packageInfo.scripts || {}).length} defined`);
        console.log();
    }
    printVulnerabilities(vulnerabilities) {
        if (vulnerabilities.length === 0) {
            console.log(chalk_1.default.green('✅ No vulnerabilities detected'));
            console.log();
            return;
        }
        console.log(chalk_1.default.bold.red('Vulnerabilities Found:'));
        console.log(`  Total: ${vulnerabilities.length}\n`);
        vulnerabilities.forEach((vuln, index) => {
            const severity = this.getSeverityColor(vuln.severity);
            const emoji = this.getSeverityEmoji(vuln.severity);
            console.log(`${index + 1}. ${severity.bold} ${emoji} ${vuln.title}`);
            console.log(`   Severity: ${severity(vuln.severity.toUpperCase())}`);
            if (vuln.description) {
                console.log(`   Description: ${this.truncateText(vuln.description, 80)}`);
            }
            if (vuln.affected && vuln.affected.length > 0) {
                console.log(`   Affected packages: ${vuln.affected.join(', ')}`);
            }
            if (vuln.patched && vuln.patched.length > 0) {
                console.log(`   Patched in: ${vuln.patched.join(', ')}`);
            }
            if (vuln.fix) {
                console.log(`   Fix available: ${vuln.fix.join(', ')}`);
            }
            if (vuln.advisory) {
                console.log(`   Advisory: ${chalk_1.default.blue.underline(vuln.advisory)}`);
            }
            console.log();
        });
    }
    printOutdatedPackages(outdated) {
        if (outdated.length === 0) {
            console.log(chalk_1.default.green('✅ All packages up to date'));
            console.log();
            return;
        }
        console.log(chalk_1.default.bold.yellow('Outdated Packages:'));
        console.log(`  Total: ${outdated.length}\n`);
        outdated.forEach((pkg, index) => {
            console.log(`${index + 1}. ${chalk_1.default.yellow.bold(pkg.name)}`);
            console.log(`   Current: ${pkg.current}`);
            console.log(`   Latest: ${pkg.latest}`);
            if (pkg.wanted && pkg.wanted !== pkg.latest) {
                console.log(`   Wanted: ${pkg.wanted} (compatible with your semver range)`);
            }
            if (pkg.latestFrom) {
                console.log(`   Latest from: ${pkg.latestFrom}`);
            }
            console.log();
        });
    }
    printWarnings(warnings) {
        if (warnings.length === 0)
            return;
        console.log(chalk_1.default.bold.yellow('Warnings:'));
        warnings.forEach((warning, index) => {
            console.log(`${index + 1}. ${this.truncateText(warning, 80)}`);
        });
        console.log();
    }
    printSummary(result) {
        console.log(chalk_1.default.bold.blue('Summary:'));
        let status = '✅ Clean';
        let statusColor = chalk_1.default.green;
        if (result.vulnerabilities.length > 0) {
            status = `🚨 ${result.vulnerabilities.length} vulnerabilities`;
            statusColor = chalk_1.default.red;
        }
        else if (result.outdated.length > 0) {
            status = `⚠️  ${result.outdated.length} outdated packages`;
            statusColor = chalk_1.default.yellow;
        }
        console.log(`  Status: ${statusColor(status)}`);
        console.log(`  Path: ${result.path}`);
        console.log(`  Scanned: ${new Date(result.scannedAt).toLocaleString()}`);
        if (result.vulnerabilities.length > 0) {
            const severityCounts = this.countSeverities(result.vulnerabilities);
            console.log(`  Severity breakdown: ${this.formatSeverityBreakdown(severityCounts)}`);
        }
        console.log();
    }
    printProjectReport(project) {
        console.log(chalk_1.default.bold.blue(`\nProject: ${project.name}`));
        console.log(`  Path: ${project.path}`);
        console.log(`  Scanned: ${new Date(project.scannedAt).toLocaleString()}`);
        if (project.vulnerabilities.length > 0) {
            console.log(chalk_1.default.red(`  Vulnerabilities: ${project.vulnerabilities.length}`));
        }
        else {
            console.log(chalk_1.default.green('  Vulnerabilities: 0'));
        }
        if (project.outdated.length > 0) {
            console.log(chalk_1.default.yellow(`  Outdated packages: ${project.outdated.length}`));
        }
        else {
            console.log(chalk_1.default.green('  Outdated packages: 0'));
        }
        if (project.warnings.length > 0) {
            console.log(chalk_1.default.yellow('  Warnings:'));
            project.warnings.forEach((warning) => {
                console.log(`    - ${this.truncateText(warning, 80)}`);
            });
        }
    }
    printReportSummary(report) {
        console.log(chalk_1.default.bold.blue('\nOverall Summary:'));
        if (!report.summary) {
            console.log(chalk_1.default.yellow('No summary data available'));
            return;
        }
        const { summary } = report;
        console.log(`  Total projects: ${summary.totalProjects}`);
        console.log(`  Vulnerable projects: ${summary.vulnerableProjects}`);
        console.log(`  Projects with outdated packages: ${summary.outdatedProjects}`);
        console.log(`  Total vulnerabilities: ${summary.criticalVulnerabilities + summary.highVulnerabilities + summary.mediumVulnerabilities + summary.lowVulnerabilities}`);
        console.log(`  Total outdated packages: ${summary.totalOutdated}`);
        if (summary.criticalVulnerabilities > 0) {
            console.log(chalk_1.default.red(`  Critical vulnerabilities: ${summary.criticalVulnerabilities}`));
        }
        if (summary.highVulnerabilities > 0) {
            console.log(chalk_1.default.red(`  High severity vulnerabilities: ${summary.highVulnerabilities}`));
        }
        if (summary.mediumVulnerabilities > 0) {
            console.log(chalk_1.default.yellow(`  Medium severity vulnerabilities: ${summary.mediumVulnerabilities}`));
        }
        if (summary.lowVulnerabilities > 0) {
            console.log(chalk_1.default.blue(`  Low severity vulnerabilities: ${summary.lowVulnerabilities}`));
        }
        console.log();
    }
    getSeverityColor(severity) {
        switch (severity) {
            case 'critical': return chalk_1.default.red;
            case 'high': return chalk_1.default.red;
            case 'medium': return chalk_1.default.yellow;
            case 'low': return chalk_1.default.blue;
            default: return chalk_1.default.gray;
        }
    }
    getSeverityEmoji(severity) {
        switch (severity) {
            case 'critical': return '🔥';
            case 'high': return '⚠️';
            case 'medium': return '⚡';
            case 'low': return 'ℹ️';
            default: return '📋';
        }
    }
    countSeverities(vulnerabilities) {
        const counts = {};
        vulnerabilities.forEach(vuln => {
            counts[vuln.severity] = (counts[vuln.severity] || 0) + 1;
        });
        return counts;
    }
    formatSeverityBreakdown(counts) {
        const parts = Object.entries(counts).map(([severity, count]) => {
            const color = this.getSeverityColor(severity);
            return `${color(severity)}: ${count}`;
        });
        return parts.join(', ');
    }
    truncateText(text, maxLength) {
        if (text.length <= maxLength)
            return text;
        return text.substring(0, maxLength - 3) + '...';
    }
}
exports.SecurityReporter = SecurityReporter;
//# sourceMappingURL=SecurityReporter.js.map