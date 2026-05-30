export class HtmlReporter {
  static async generateHtml(report: any): Promise<string> {
    const timestamp = new Date(report.generatedAt).toLocaleString();
    
    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Security Report - SecuWatch</title>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            margin: 0;
            padding: 20px;
            background-color: #f5f5f5;
            color: #333;
        }
        .container {
            max-width: 1200px;
            margin: 0 auto;
            background: white;
            border-radius: 8px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            overflow: hidden;
        }
        .header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 30px;
            text-align: center;
        }
        .header h1 {
            margin: 0;
            font-size: 2.5em;
            font-weight: 700;
        }
        .header p {
            margin: 10px 0 0;
            opacity: 0.9;
            font-size: 1.1em;
        }
        .summary {
            padding: 30px;
            background: #f8f9fa;
            border-bottom: 1px solid #dee2e6;
        }
        .summary-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 20px;
            margin-top: 20px;
        }
        .summary-card {
            background: white;
            padding: 20px;
            border-radius: 8px;
            text-align: center;
            border: 1px solid #e9ecef;
        }
        .summary-card h3 {
            margin: 0 0 10px;
            color: #495057;
        }
        .summary-card .number {
            font-size: 2em;
            font-weight: bold;
            margin: 10px 0;
        }
        .critical { color: #dc3545; }
        .high { color: #fd7e14; }
        .medium { color: #ffc107; }
        .low { color: #28a745; }
        .projects {
            padding: 30px;
        }
        .project {
            background: #f8f9fa;
            border-radius: 8px;
            margin-bottom: 30px;
            overflow: hidden;
        }
        .project-header {
            background: #495057;
            color: white;
            padding: 15px 20px;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        .project-header h3 {
            margin: 0;
            font-size: 1.3em;
        }
        .project-status {
            padding: 5px 12px;
            border-radius: 20px;
            font-size: 0.9em;
            font-weight: bold;
        }
        .status-clean { background: #28a745; }
        .status-warning { background: #ffc107; color: #333; }
        .status-danger { background: #dc3545; }
        .project-content {
            padding: 20px;
        }
        .project-info {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 15px;
            margin-bottom: 20px;
        }
        .info-item {
            background: white;
            padding: 15px;
            border-radius: 6px;
            border: 1px solid #dee2e6;
        }
        .info-item label {
            font-weight: bold;
            color: #6c757d;
            display: block;
            margin-bottom: 5px;
        }
        .vulnerabilities, .outdated {
            margin-top: 20px;
        }
        .section-title {
            font-size: 1.2em;
            font-weight: bold;
            margin-bottom: 15px;
            display: flex;
            align-items: center;
            gap: 10px;
        }
        .vulnerability-item, .outdated-item {
            background: white;
            border-radius: 6px;
            padding: 15px;
            margin-bottom: 10px;
            border-left: 4px solid #dee2e6;
        }
        .vulnerability-item.critical {
            border-left-color: #dc3545;
        }
        .vulnerability-item.high {
            border-left-color: #fd7e14;
        }
        .vulnerability-item.medium {
            border-left-color: #ffc107;
        }
        .vulnerability-item.low {
            border-left-color: #28a745;
        }
        .outdated-item {
            border-left-color: #17a2b8;
        }
        .vulnerability-title {
            font-weight: bold;
            margin-bottom: 5px;
        }
        .severity-badge {
            display: inline-block;
            padding: 2px 8px;
            border-radius: 12px;
            font-size: 0.8em;
            font-weight: bold;
            margin-left: 10px;
        }
        .severity-critical {
            background: #dc3545;
            color: white;
        }
        .severity-high {
            background: #fd7e14;
            color: white;
        }
        .severity-medium {
            background: #ffc107;
            color: #333;
        }
        .severity-low {
            background: #28a745;
            color: white;
        }
        .warning {
            background: #fff3cd;
            border: 1px solid #ffeaa7;
            border-radius: 6px;
            padding: 15px;
            margin: 20px 0;
        }
        .footer {
            background: #f8f9fa;
            padding: 20px;
            text-align: center;
            border-top: 1px solid #dee2e6;
            color: #6c757d;
        }
        .emoji {
            font-size: 1.2em;
            margin-right: 5px;
        }
        @media (max-width: 768px) {
            .header h1 {
                font-size: 2em;
            }
            .summary-grid {
                grid-template-columns: repeat(2, 1fr);
            }
            .project-header {
                flex-direction: column;
                gap: 10px;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🔒 Security Report</h1>
            <p>Generated by SecuWatch - ${timestamp}</p>
        </div>

        <div class="summary">
            <h2>Overall Summary</h2>
            <div class="summary-grid">
                <div class="summary-card">
                    <h3>Total Projects</h3>
                    <div class="number">${report.summary?.totalProjects || 0}</div>
                </div>
                <div class="summary-card">
                    <h3>Vulnerable Projects</h3>
                    <div class="number critical">${report.summary?.vulnerableProjects || 0}</div>
                </div>
                <div class="summary-card">
                    <h3>Outdated Projects</h3>
                    <div class="number warning">${report.summary?.outdatedProjects || 0}</div>
                </div>
                <div class="summary-card">
                    <h3>Critical Vulnerabilities</h3>
                    <div class="number critical">${report.summary?.criticalVulnerabilities || 0}</div>
                </div>
                <div class="summary-card">
                    <h3>High Vulnerabilities</h3>
                    <div class="number high">${report.summary?.highVulnerabilities || 0}</div>
                </div>
                <div class="summary-card">
                    <h3>Total Outdated</h3>
                    <div class="number">${report.summary?.totalOutdated || 0}</div>
                </div>
            </div>
        </div>

        <div class="projects">
            <h2>Project Details</h2>
            
            ${report.projects ? report.projects.map((project: any) => this.generateProjectHtml(project)).join('') : ''}
            
            ${!report.projects || report.projects.length === 0 ? '<p class="warning">No projects configured for monitoring</p>' : ''}
        </div>

        <div class="footer">
            <p>Generated by SecuWatch v1.0.0 | Security monitoring for developers</p>
        </div>
    </div>

    <script>
        // Add some interactivity
        document.addEventListener('DOMContentLoaded', function() {
            // Smooth scrolling
            document.querySelectorAll('a[href^="#"]').forEach(anchor => {
                anchor.addEventListener('click', function (e) {
                    e.preventDefault();
                    const target = document.querySelector(this.getAttribute('href'));
                    if (target) {
                        target.scrollIntoView({ behavior: 'smooth' });
                    }
                });
            });

            // Add expand/collapse functionality for sections
            const sections = document.querySelectorAll('.vulnerabilities, .outdated');
            sections.forEach(section => {
                const header = section.querySelector('.section-title');
                if (header) {
                    header.style.cursor = 'pointer';
                    header.addEventListener('click', function() {
                        const content = section.querySelector('.vulnerability-list, .outdated-list') || section;
                        content.style.display = content.style.display === 'none' ? 'block' : 'none';
                    });
                }
            });
        });
    </script>
</body>
</html>`;
  }

  private static generateProjectHtml(project: any): string {
    const vulnerabilities = project.vulnerabilities || [];
    const outdated = project.outdated || [];
    const warnings = project.warnings || [];
    
    // Determine project status
    let statusClass = 'status-clean';
    let statusText = 'Clean';
    let statusEmoji = '✅';
    
    if (vulnerabilities.length > 0) {
      statusClass = 'status-danger';
      statusText = 'Vulnerable';
      statusEmoji = '🚨';
    } else if (outdated.length > 0) {
      statusClass = 'status-warning';
      statusText = 'Outdated';
      statusEmoji = '⚠️';
    }
    
    let html = `
        <div class="project">
            <div class="project-header">
                <h3>${statusEmoji} ${project.name}</h3>
                <span class="project-status ${statusClass}">${statusText}</span>
            </div>
            <div class="project-content">
                <div class="project-info">
                    <div class="info-item">
                        <label>Path</label>
                        <div>${project.path}</div>
                    </div>
                    <div class="info-item">
                        <label>Scanned At</label>
                        <div>${new Date(project.scannedAt).toLocaleString()}</div>
                    </div>
                    <div class="info-item">
                        <label>Vulnerabilities</label>
                        <div class="${vulnerabilities.length > 0 ? 'critical' : ''}">${vulnerabilities.length}</div>
                    </div>
                    <div class="info-item">
                        <label>Outdated Packages</label>
                        <div class="${outdated.length > 0 ? 'warning' : ''}">${outdated.length}</div>
                    </div>
                </div>
    `;
    
    // Add warnings if any
    if (warnings.length > 0) {
      html += `
        <div class="warning">
            <strong>Warnings:</strong>
            <ul>
                ${warnings.map((warning: string) => `<li>${warning}</li>`).join('')}
            </ul>
        </div>
      `;
    }
    
    // Add vulnerabilities section
    if (vulnerabilities.length > 0) {
      html += `
        <div class="vulnerabilities">
            <div class="section-title">
                <span class="emoji">🔍</span>
                Vulnerabilities (${vulnerabilities.length})
            </div>
            <div class="vulnerability-list">
                ${vulnerabilities.map((vuln: any) => this.generateVulnerabilityHtml(vuln)).join('')}
            </div>
        </div>
      `;
    }
    
    // Add outdated packages section
    if (outdated.length > 0) {
      html += `
        <div class="outdated">
            <div class="section-title">
                <span class="emoji">📦</span>
                Outdated Packages (${outdated.length})
            </div>
            <div class="outdated-list">
                ${outdated.map((pkg: any) => this.generateOutdatedHtml(pkg)).join('')}
            </div>
        </div>
      `;
    }
    
    html += `
            </div>
        </div>
    `;
    
    return html;
  }

  private static generateVulnerabilityHtml(vuln: any): string {
    return `
        <div class="vulnerability-item ${vuln.severity}">
            <div class="vulnerability-title">
                ${vuln.title}
                <span class="severity-badge severity-${vuln.severity}">${vuln.severity.toUpperCase()}</span>
            </div>
            <div>${this.escapeHtml(vuln.description || 'No description')}</div>
            ${vuln.affected ? `<div><strong>Affected:</strong> ${vuln.affected.join(', ')}</div>` : ''}
            ${vuln.patched ? `<div><strong>Patched:</strong> ${vuln.patched.join(', ')}</div>` : ''}
            ${vuln.advisory ? `<div><strong>Advisory:</strong> <a href="${vuln.advisory}" target="_blank">${vuln.advisory}</a></div>` : ''}
        </div>
    `;
  }

  private static generateOutdatedHtml(pkg: any): string {
    return `
        <div class="outdated-item">
            <div class="vulnerability-title">${pkg.name}</div>
            <div><strong>Current:</strong> ${pkg.current}</div>
            <div><strong>Latest:</strong> ${pkg.latest}</div>
            ${pkg.wanted && pkg.wanted !== pkg.latest ? `<div><strong>Wanted:</strong> ${pkg.wanted}</div>` : ''}
            ${pkg.latestFrom ? `<div><strong>Latest from:</strong> ${pkg.latestFrom}</div>` : ''}
        </div>
    `;
  }

  private static escapeHtml(text: string): string {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }
}