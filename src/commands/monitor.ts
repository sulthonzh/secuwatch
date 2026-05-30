import { ConfigManager } from '../config/ConfigManager';
import { ProjectMonitor, MonitorResult } from '../monitor/ProjectMonitor';
import { SecurityReporter } from '../reporter/SecurityReporter';

// eslint-disable-next-line @typescript-eslint/no-unused-vars

export class MonitorCommand {
  async execute(options: any = {}) {
    const config = new ConfigManager();
    const monitor = new ProjectMonitor(config);

    try {
      if (options.quiet) {
        await this.runMonitor(monitor, true);
      } else {
        console.log('Starting project monitoring...');
        const interval = parseInt(options.interval) || 3600;
        
        if (interval < 60) {
          console.error('Interval must be at least 60 seconds');
          process.exit(1);
        }

        await this.runMonitor(monitor, false, options);
        
        if (interval > 0) {
          console.log(`Monitoring every ${interval} seconds. Press Ctrl+C to stop.`);
          await this.startContinuousMonitoring(monitor, interval);
        }
      }
    } catch (error) {
      console.error('Monitor failed:', error instanceof Error ? error.message : error);
      process.exit(1);
    }
  }

  private async runMonitor(monitor: ProjectMonitor, quiet: boolean, options: any = {}): Promise<MonitorResult> {
    const result = await monitor.monitorAll();
    
    if (options.json) {
      console.log(JSON.stringify(result, null, 2));
    } else if (!quiet) {
      this.displayResults(result);
    }

    return result;
  }

  private async startContinuousMonitoring(monitor: ProjectMonitor, interval: number) {
    // For now, just log the interval and return
    console.log('Continuous monitoring would run here');
    console.log(`Next check in ${interval} seconds`);
  }

  private displayResults(result: MonitorResult): void {
    const reporter = new SecurityReporter();
    
    console.log(`Security Monitor Report - ${new Date().toLocaleString()}`);
    console.log(`====================================`);
    console.log();
    
    console.log(`Projects monitored: ${result.summary.totalProjects}`);
    console.log(`Projects with vulnerabilities: ${result.summary.vulnerableProjects}`);
    console.log(`Projects with outdated packages: ${result.summary.outdatedProjects}`);
    console.log();
    
    if (result.summary.criticalVulnerabilities > 0) {
      console.log(`🔥 CRITICAL vulnerabilities: ${result.summary.criticalVulnerabilities}`);
    }
    if (result.summary.highVulnerabilities > 0) {
      console.log(`🚨 HIGH severity vulnerabilities: ${result.summary.highVulnerabilities}`);
    }
    if (result.summary.mediumVulnerabilities > 0) {
      console.log(`⚠️  MEDIUM severity vulnerabilities: ${result.summary.mediumVulnerabilities}`);
    }
    if (result.summary.lowVulnerabilities > 0) {
      console.log(`ℹ️  LOW severity vulnerabilities: ${result.summary.lowVulnerabilities}`);
    }
    
    if (result.summary.totalOutdated > 0) {
      console.log(`📦 Outdated packages: ${result.summary.totalOutdated}`);
    }
    
    console.log();
    
    // Display individual project results
    result.projects.forEach((project, index) => {
      console.log(`Project ${index + 1}: ${project.project}`);
      console.log(`  Path: ${project.path}`);
      
      if (project.vulnerabilities && project.vulnerabilities.length > 0) {
        console.log(`  Vulnerabilities: ${project.vulnerabilities.length}`);
        project.vulnerabilities.forEach(vuln => {
          console.log(`    - ${vuln.title} (${vuln.severity})`);
        });
      }
      
      if (project.outdated && project.outdated.length > 0) {
        console.log(`  Outdated packages: ${project.outdated.length}`);
      }
      
      console.log();
    });
  }
}