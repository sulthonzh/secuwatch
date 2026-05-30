import { ConfigManager } from '../config/ConfigManager';
import { ProjectScanner, ScanResult } from '../scanner/ProjectScanner';
import { SecurityReporter } from '../reporter/SecurityReporter';

export class ScanCommand {
  async execute(path: string = process.cwd(), options: any = {}) {
    try {
      const config = new ConfigManager();
      const scanner = new ProjectScanner();
      
      const result = await scanner.scan(path, {
        severity: options.severity || 'low',
        verbose: options.verbose || false
      });

      if (options.json) {
        console.log(JSON.stringify(result, null, 2));
      } else {
        this.displayResults(result);
      }

      if (result.vulnerabilities && result.vulnerabilities.length > 0) {
        process.exit(1);
      }
    } catch (error) {
      console.error('Error:', error instanceof Error ? error.message : error);
      process.exit(1);
    }
  }

  private displayResults(result: ScanResult): void {
    const reporter = new SecurityReporter();
    reporter.displayScanResults(result);
  }
}