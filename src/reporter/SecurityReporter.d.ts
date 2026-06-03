import { ScanResult } from '../scanner/ProjectScanner';
export declare class SecurityReporter {
    displayScanResults(result: ScanResult): void;
    displayReport(report: any): void;
    private printHeader;
    private printPackageInfo;
    private printVulnerabilities;
    private printOutdatedPackages;
    private printWarnings;
    private printSummary;
    private printProjectReport;
    private printReportSummary;
    private getSeverityColor;
    private getSeverityEmoji;
    private countSeverities;
    private formatSeverityBreakdown;
    private truncateText;
}
//# sourceMappingURL=SecurityReporter.d.ts.map