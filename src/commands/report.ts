import { ConfigManager } from '../config/ConfigManager';
import { SecurityReporter } from '../reporter/SecurityReporter';
import { HtmlReporter } from '../reporter/HtmlReporter';
import { EmailReporter } from '../reporter/EmailReporter';

export class ReportCommand {
  async execute(options: any = {}) {
    const config = new ConfigManager();
    const reporter = new SecurityReporter();

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
      
    } catch (error) {
      console.error('Report generation failed:', error instanceof Error ? error.message : error);
      process.exit(1);
    }
  }

  private async generateReport(config: ConfigManager, days: number) {
    const now = new Date();

    const projects = await config.getProjects();
    const reportData: any = {
      generatedAt: now.toISOString(),
      period: `${days} days`,
      projects: projects.map((project: any) => ({
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

  private async sendEmailReport(reportData: any, recipient: string) {
    try {
      await EmailReporter.sendReport(reportData, recipient);
      console.log(`Email report sent to ${recipient}`);
    } catch (error) {
      console.error('Failed to send email report:', error instanceof Error ? error.message : error);
      process.exit(1);
    }
  }

  private async generateHtmlReport(reportData: any) {
    try {
      const html = await HtmlReporter.generateHtml(reportData);
      const fs = await import('fs-extra');
      const path = await import('path');
      
      const outputPath = path.join(process.cwd(), 'security-report.html');
      await fs.writeFile(outputPath, html);
      
      console.log(`HTML report generated: ${outputPath}`);
    } catch (error) {
      console.error('Failed to generate HTML report:', error instanceof Error ? error.message : error);
      process.exit(1);
    }
  }
}