"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ScanCommand = void 0;
const ConfigManager_1 = require("../config/ConfigManager");
const ProjectScanner_1 = require("../scanner/ProjectScanner");
const SecurityReporter_1 = require("../reporter/SecurityReporter");
class ScanCommand {
    async execute(path = process.cwd(), options = {}) {
        try {
            const config = new ConfigManager_1.ConfigManager();
            const scanner = new ProjectScanner_1.ProjectScanner();
            const result = await scanner.scan(path, {
                severity: options.severity || 'low',
                verbose: options.verbose || false
            });
            if (options.json) {
                console.log(JSON.stringify(result, null, 2));
            }
            else {
                this.displayResults(result);
            }
            if (result.vulnerabilities && result.vulnerabilities.length > 0) {
                process.exit(1);
            }
        }
        catch (error) {
            console.error('Error:', error instanceof Error ? error.message : error);
            process.exit(1);
        }
    }
    displayResults(result) {
        const reporter = new SecurityReporter_1.SecurityReporter();
        reporter.displayScanResults(result);
    }
}
exports.ScanCommand = ScanCommand;
//# sourceMappingURL=scan.js.map