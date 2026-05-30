#!/usr/bin/env node

import { Command } from 'commander';
import chalk from 'chalk';
import ora from 'ora';
import { PerformanceChecker } from './performance-checker';
import { formatResults } from './formatters';

const program = new Command();

program
  .name('webperf')
  .description('Zero-config CLI for web performance monitoring')
  .version('1.0.0');

program
  .argument('[urls...]', 'URLs to test')
  .option('-o, --output <file>', 'Save results to file')
  .option('-w, --watch', 'Continuous monitoring mode')
  .option('-p, --page <name>', 'Test specific page/route')
  .option('-d, --device <type>', 'Device type (mobile|desktop|tablet)', 'desktop')
  .option('-c, --connection <type>', 'Network condition (slow|4g|wifi)', 'wifi')
  .option('-t, --thresholds <file>', 'Custom performance thresholds file')
  .option('-j, --json', 'JSON output format')
  .option('-v, --verbose', 'Detailed output')
  .action(async (urls, options) => {
    try {
      // If no URLs provided, show help
      if (!urls || urls.length === 0) {
        console.log(chalk.red('Please provide at least one URL to test.'));
        console.log(chalk.gray('Example: webperf https://example.com'));
        process.exit(1);
      }

      const spinner = ora('Starting performance check...').start();
      
      // Initialize performance checker
      const checker = new PerformanceChecker({
        device: options.device as 'mobile' | 'desktop' | 'tablet',
        connection: options.connection as 'slow' | '4g' | 'wifi',
        verbose: options.verbose,
      });

      // Process each URL
      const results = [];
      for (const url of urls) {
        spinner.text = `Testing ${url}...`;
        const result = await checker.check(url);
        results.push(result);
      }

      spinner.stop();

      // Format and display results
      if (options.json) {
        console.log(JSON.stringify(results, null, 2));
      } else {
        console.log(formatResults(results));
      }

      // Save to file if requested
      if (options.output) {
        const fs = await import('fs');
        const output = options.json ? JSON.stringify(results, null, 2) : formatResults(results);
        fs.writeFileSync(options.output, output);
        console.log(chalk.green(`\nResults saved to: ${options.output}`));
      }

      // Exit with appropriate code
      const hasErrors = results.some(r => r.score < 50);
      process.exit(hasErrors ? 1 : 0);

    } catch (error) {
      console.error(chalk.red('Error:'), error instanceof Error ? error.message : 'Unknown error');
      process.exit(1);
    }
  });

program.parse();