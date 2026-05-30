# SecuWatch 🔒

Security vulnerability and dependency monitoring CLI for developers.

## What is SecuWatch?

SecuWatch is a command-line tool that helps developers monitor security vulnerabilities and outdated dependencies across their projects. It integrates with your development workflow to provide real-time security insights and automated reporting.

## Features

### 🔍 Security Scanning
- **npm audit integration** - Detects vulnerabilities in your dependencies
- **Severity filtering** - Focus on critical and high-severity issues
- **Detailed vulnerability reports** - Shows affected packages, fixes, and advisories

### 📦 Dependency Management
- **Outdated package detection** - Identifies packages with newer versions
- **Multi-package manager support** - Works with npm, yarn, and pnpm
- **Version compatibility checking** - Shows wanted vs latest versions

### 🎯 Project Monitoring
- **Multi-project support** - Monitor multiple repositories from one place
- **Automated monitoring** - Scheduled security checks
- **Real-time alerts** - Get notified when new issues are detected

### 📊 Comprehensive Reporting
- **Console output** - Colored, readable reports in your terminal
- **JSON export** - Machine-readable output for CI/CD integration
- **HTML reports** - Beautiful, shareable security reports
- **Email notifications** - Automated alerts for security issues

## Installation

```bash
# Install globally
npm install -g secuwatch

# Or use npx
npx secuwatch --version
```

## Quick Start

### 1. Initial Setup
```bash
# Initialize configuration
secuwatch config --init

# Add your first project
secuwatch project --add my-app
```

### 2. Scan a Project
```bash
# Scan current directory
secuwatch scan

# Scan specific project
secuwatch scan /path/to/project
```

### 3. Monitor Projects
```bash
# Run one-time check
secuwatch monitor

# Continuous monitoring (1 hour intervals)
secuwatch monitor --interval 3600

# Quiet mode for CI/CD
secuwatch monitor --quiet
```

## Usage Examples

### Basic Scanning
```bash
# Scan with default settings
secuwatch scan

# Scan with custom severity threshold
secuwatch scan --severity high

# Scan and output JSON
secuwatch scan --json

# Verbose output
secuwatch scan --verbose
```

### Project Management
```bash
# List all projects
secuwatch project --list

# Add a project
secuwatch project --add my-api --path /projects/my-api

# Check project status
secuwatch project --status my-api

# Remove a project
secuwatch project --remove my-api
```

### Configuration
```bash
# Initialize interactive setup
secuwatch config --init

# Set configuration values
secuwatch config --set severity=high
secuwatch config --set checkInterval=7200

# Get specific config
secuwatch config --get severity

# List all configuration
secuwatch config --list
```

### Reporting
```bash
# Generate console report
secuwatch report

# Generate JSON report
secuwatch report --json

# Generate HTML report
secuwatch report --html

# Send email report
secuwatch report --email admin@company.com
```

## Configuration

SecuWatch stores its configuration in `~/.secuwatch/config.json`. You can manage it through:

### Interactive Setup
```bash
secuwatch config
```

### Manual Configuration
```json
{
  "projectsDir": "~/projects",
  "severity": "medium",
  "checkInterval": 3600,
  "emailNotifications": false,
  "emailRecipient": "",
  "notifications": {
    "slack": {
      "webhook": "",
      "channel": "#security"
    },
    "discord": {
      "webhook": "",
      "channel": "#alerts"
    }
  },
  "projects": [
    {
      "name": "my-app",
      "path": "/path/to/my-app",
      "added": "2023-01-01T00:00:00.000Z",
      "lastScanned": "2023-01-01T00:00:00.000Z"
    }
  ]
}
```

## Severity Levels

| Level | Color | Description |
|-------|-------|-------------|
| **critical** | 🔴 | Immediate attention required, likely exploitable |
| **high** | 🟠 | Serious security risk, recommended patching |
| **medium** | 🟡 | Moderate security concern, plan for patching |
| **low** | 🔵 | Minor security issue, minimal risk |

## CI/CD Integration

### GitHub Actions Example
```yaml
name: Security Scan
on: [push, pull_request]

jobs:
  security:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      
      - name: Setup Node.js
        uses: actions/setup-node@v2
        with:
          node-version: '16'
          
      - name: Install SecuWatch
        run: npm install -g secuwatch
        
      - name: Run Security Scan
        run: |
          secuwatch project --add .
          secuwatch scan --severity high
          
      - name: Fail on critical issues
        run: |
          secuwatch monitor --quiet || exit 1
```

### Jenkins Pipeline
```groovy
pipeline {
  agent any
  
  stages {
    stage('Security Scan') {
      steps {
        sh '''
          npm install -g secuwatch
          secuwatch project --add .
          secuwatch scan --json | tee security-report.json
        '''
      }
    }
    
    stage('Security Gate') {
      steps {
        script {
          def report = readJSON file: 'security-report.json'
          if (report.vulnerabilities.any { it.severity == 'critical' }) {
            error('Critical vulnerabilities detected!')
          }
        }
      }
    }
  }
}
```

## API

### ProjectScanner
```typescript
import { ProjectScanner } from 'secuwatch';

const scanner = new ProjectScanner(config);
const result = await scanner.scan('/path/to/project', {
  severity: 'high',
  verbose: true
});
```

### ConfigManager
```typescript
import { ConfigManager } from 'secuwatch';

const config = new ConfigManager();
await config.load();
await config.set({ severity: 'critical' });
const projects = await config.getProjects();
```

## Development

### Building from Source
```bash
# Clone repository
git clone https://github.com/sulthonzh/secuwatch.git
cd secuwatch

# Install dependencies
npm install

# Build project
npm run build

# Run tests
npm test

# Development mode
npm run dev
```

### Project Structure
```
src/
├── commands/          # CLI command implementations
│   ├── scan.ts
│   ├── monitor.ts
│   ├── config.ts
│   ├── project.ts
│   └── report.ts
├── config/            # Configuration management
│   └── ConfigManager.ts
├── scanner/           # Security scanning logic
│   └── ProjectScanner.ts
├── monitor/           # Project monitoring
│   └── ProjectMonitor.ts
├── reporter/          # Report generators
│   ├── SecurityReporter.ts
│   ├── HtmlReporter.ts
│   └── EmailReporter.ts
└── __tests__/         # Test files
```

## Contributing

We welcome contributions! Please see our [Contributing Guidelines](CONTRIBUTING.md) for details.

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## License

MIT - see [LICENSE](LICENSE) file for details.

## Support

- 📧 **Email**: support@secuwatch.com
- 💬 **Discord**: [Join our community](https://discord.gg/secuwatch)
- 🐛 **Issues**: [GitHub Issues](https://github.com/sulthonzh/secuwatch/issues)
- 📖 **Documentation**: [Full Docs](https://secuwatch.com/docs)

## Roadmap

### ✅ Current Features
- [x] Basic CLI structure
- [x] Project discovery and configuration
- [x] npm audit integration
- [x] Multi-package manager support (yarn, pnpm)
- [x] Security vulnerability scanning
- [x] Outdated package detection
- [x] Console and JSON reporting
- [x] HTML report generation
- [x] Test suite

### 🚀 Planned Features
- [ ] CI/CD pipeline integration
- [ ] Email notifications
- [ ] Slack/Discord webhook integration
- [ ] Historical tracking
- [ ] Dashboard web UI
- [ ] Team collaboration
- [ ] Security policy enforcement
- [ ] Multi-language support (pip, gem, composer)
- [ ] Container scanning
- [ ] IaC security checks

### 🔮 Future Ideas
- [ ] AI-powered security recommendations
- [ ] Automatic vulnerability remediation
- [ ] Security score tracking
- [ ] Compliance reporting (SOC2, GDPR, HIPAA)
- [ ] Vulnerability disclosure program
- [ ] Integration with security platforms

---

Made with ❤️ by developers, for developers