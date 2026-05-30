import chalk from 'chalk';
import { ScanResult } from '../scanner/ProjectScanner';

export class SecurityReporter {
  displayScanResults(result: ScanResult): void {
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

  displayReport(report: any): void {
    this.printHeader('Security Report');
    console.log(`Generated: ${new Date(report.generatedAt).toLocaleString()}`);
    console.log(`Period: ${report.period}\n`);
    
    if (report.projects && report.projects.length > 0) {
      report.projects.forEach((project: any) => {
        this.printProjectReport(project);
      });
    } else {
      console.log(chalk.yellow('No projects configured for monitoring'));
    }
    
    this.printReportSummary(report);
  }

  private printHeader(title: string): void {
    console.log(chalk.bold.blue('\n' + '='.repeat(60)));
    console.log(chalk.bold.blue(title.toUpperCase()));
    console.log(chalk.bold.blue('='.repeat(60) + '\n'));
  }

  private printPackageInfo(packageInfo: any): void {
    console.log(chalk.bold.blue('Package Information:'));
    console.log(`  Name: ${packageInfo.name}`);
    console.log(`  Version: ${packageInfo.version}`);
    console.log(`  Type: ${packageInfo.private ? 'Private' : 'Public'}`);
    console.log(`  Scripts: ${Object.keys(packageInfo.scripts || {}).length} defined`);
    console.log();
  }

  private printVulnerabilities(vulnerabilities: any[]): void {
    if (vulnerabilities.length === 0) {
      console.log(chalk.green('✅ No vulnerabilities detected'));
      console.log();
      return;
    }

    console.log(chalk.bold.red('Vulnerabilities Found:'));
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
        console.log(`   Advisory: ${chalk.blue.underline(vuln.advisory)}`);
      }
      
      console.log();
    });
  }

  private printOutdatedPackages(outdated: any[]): void {
    if (outdated.length === 0) {
      console.log(chalk.green('✅ All packages up to date'));
      console.log();
      return;
    }

    console.log(chalk.bold.yellow('Outdated Packages:'));
    console.log(`  Total: ${outdated.length}\n`);

    outdated.forEach((pkg, index) => {
      console.log(`${index + 1}. ${chalk.yellow.bold(pkg.name)}`);
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

  private printWarnings(warnings: string[]): void {
    if (warnings.length === 0) return;

    console.log(chalk.bold.yellow('Warnings:'));
    warnings.forEach((warning, index) => {
      console.log(`${index + 1}. ${this.truncateText(warning, 80)}`);
    });
    console.log();
  }

  private printSummary(result: ScanResult): void {
    console.log(chalk.bold.blue('Summary:'));
    
    let status = '✅ Clean';
    let statusColor = chalk.green;
    
    if (result.vulnerabilities.length > 0) {
      status = `🚨 ${result.vulnerabilities.length} vulnerabilities`;
      statusColor = chalk.red;
    } else if (result.outdated.length > 0) {
      status = `⚠️  ${result.outdated.length} outdated packages`;
      statusColor = chalk.yellow;
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

  private printProjectReport(project: any): void {
    console.log(chalk.bold.blue(`\nProject: ${project.name}`));
    console.log(`  Path: ${project.path}`);
    console.log(`  Scanned: ${new Date(project.scannedAt).toLocaleString()}`);
    
    if (project.vulnerabilities.length > 0) {
      console.log(chalk.red(`  Vulnerabilities: ${project.vulnerabilities.length}`));
    } else {
      console.log(chalk.green('  Vulnerabilities: 0'));
    }
    
    if (project.outdated.length > 0) {
      console.log(chalk.yellow(`  Outdated packages: ${project.outdated.length}`));
    } else {
      console.log(chalk.green('  Outdated packages: 0'));
    }
    
    if (project.warnings.length > 0) {
      console.log(chalk.yellow('  Warnings:'));
      project.warnings.forEach((warning: string) => {
        console.log(`    - ${this.truncateText(warning, 80)}`);
      });
    }
  }

  private printReportSummary(report: any): void {
    console.log(chalk.bold.blue('\nOverall Summary:'));
    
    if (!report.summary) {
      console.log(chalk.yellow('No summary data available'));
      return;
    }
    
    const { summary } = report;
    
    console.log(`  Total projects: ${summary.totalProjects}`);
    console.log(`  Vulnerable projects: ${summary.vulnerableProjects}`);
    console.log(`  Projects with outdated packages: ${summary.outdatedProjects}`);
    console.log(`  Total vulnerabilities: ${summary.criticalVulnerabilities + summary.highVulnerabilities + summary.mediumVulnerabilities + summary.lowVulnerabilities}`);
    console.log(`  Total outdated packages: ${summary.totalOutdated}`);
    
    if (summary.criticalVulnerabilities > 0) {
      console.log(chalk.red(`  Critical vulnerabilities: ${summary.criticalVulnerabilities}`));
    }
    if (summary.highVulnerabilities > 0) {
      console.log(chalk.red(`  High severity vulnerabilities: ${summary.highVulnerabilities}`));
    }
    if (summary.mediumVulnerabilities > 0) {
      console.log(chalk.yellow(`  Medium severity vulnerabilities: ${summary.mediumVulnerabilities}`));
    }
    if (summary.lowVulnerabilities > 0) {
      console.log(chalk.blue(`  Low severity vulnerabilities: ${summary.lowVulnerabilities}`));
    }
    
    console.log();
  }

  private getSeverityColor(severity: string): chalk.Chalk {
    switch (severity) {
      case 'critical': return chalk.red;
      case 'high': return chalk.red;
      case 'medium': return chalk.yellow;
      case 'low': return chalk.blue;
      default: return chalk.gray;
    }
  }

  private getSeverityEmoji(severity: string): string {
    switch (severity) {
      case 'critical': return '🔥';
      case 'high': return '⚠️';
      case 'medium': return '⚡';
      case 'low': return 'ℹ️';
      default: return '📋';
    }
  }

  private countSeverities(vulnerabilities: any[]): Record<string, number> {
    const counts: Record<string, number> = {};
    vulnerabilities.forEach(vuln => {
      counts[vuln.severity] = (counts[vuln.severity] || 0) + 1;
    });
    return counts;
  }

  private formatSeverityBreakdown(counts: Record<string, number>): string {
    const parts = Object.entries(counts).map(([severity, count]) => {
      const color = this.getSeverityColor(severity);
      return `${color(severity)}: ${count}`;
    });
    return parts.join(', ');
  }

  private truncateText(text: string, maxLength: number): string {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength - 3) + '...';
  }
}