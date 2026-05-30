#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const commander_1 = require("commander");
const scan_1 = require("./commands/scan");
const monitor_1 = require("./commands/monitor");
const config_1 = require("./commands/config");
const project_1 = require("./commands/project");
const report_1 = require("./commands/report");
const program = new commander_1.Command();
const version = '1.0.0';
program
    .name('secuwatch')
    .description('Security vulnerability and dependency monitoring CLI')
    .version(version);
program
    .command('scan')
    .description('Scan a project for security vulnerabilities')
    .argument('[path:string]', 'Project path to scan (default: current directory)')
    .option('-j, --json', 'Output results in JSON format')
    .option('-v, --verbose', 'Verbose output')
    .option('-s, --severity <level>', 'Minimum severity level (low, medium, high, critical)')
    .action(async (path = process.cwd(), options) => {
    const scanCommand = new scan_1.ScanCommand();
    await scanCommand.execute(path, options);
});
program
    .command('monitor')
    .description('Monitor configured projects for security issues')
    .option('-j, --json', 'Output results in JSON format')
    .option('-q, --quiet', 'Quiet mode (no output)')
    .option('--interval <seconds>', 'Check interval in seconds', '3600')
    .action(async (options) => {
    const monitorCommand = new monitor_1.MonitorCommand();
    await monitorCommand.execute(options);
});
program
    .command('config')
    .description('Configure SecuWatch settings')
    .option('--init', 'Initialize configuration')
    .option('--set <key=value>', 'Set configuration value')
    .option('--get <key>', 'Get configuration value')
    .option('--list', 'List all configuration')
    .action(async (options) => {
    const configCommand = new config_1.ConfigCommand();
    await configCommand.execute(options);
});
program
    .command('project')
    .description('Manage monitored projects')
    .option('--add <name>', 'Add a new project')
    .option('--remove <name>', 'Remove a project')
    .option('--list', 'List all projects')
    .option('--status <name>', 'Check project status')
    .action(async (options) => {
    const projectCommand = new project_1.ProjectCommand();
    await projectCommand.execute(options);
});
program
    .command('report')
    .description('Generate security reports')
    .option('--json', 'Output in JSON format')
    .option('--email <recipient>', 'Send report via email')
    .option('--html', 'Generate HTML report')
    .option('--days <number>', 'Report timeframe in days', '7')
    .action(async (options) => {
    const reportCommand = new report_1.ReportCommand();
    await reportCommand.execute(options);
});
program.parse();
//# sourceMappingURL=index.js.map