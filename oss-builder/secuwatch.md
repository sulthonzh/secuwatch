# SecuWatch - Security Vulnerability Monitor

A CLI tool for monitoring security vulnerabilities and outdated dependencies across your projects.

## Features

- Multi-project monitoring
- Security vulnerability scanning (npm audit, snyk, etc.)
- Dependency version checks
- Automated reports and notifications
- Integration with CI/CD pipelines
- Configurable severity levels
- JSON output for automation

## Installation

```bash
npm install -g secuwatch
```

## Usage

### Basic scanning
```bash
secuwatch scan                    # Scan current directory
secuwatch scan /path/to/project   # Scan specific project
```

### Multi-project monitoring
```bash
secuwatch monitor                # Monitor configured projects
secuwatch add-project my-app      # Add project to monitoring
secuwatch list-projects          # List all monitored projects
```

### Configuration
```bash
secuwatch config                 # Interactive configuration
secuwatch set-threshold critical  # Set severity threshold
```

### Reports
```bash
secuwatch report                # Generate security report
secuwatch report --json         # JSON output
secuwatch report --email        # Email report
```

## Roadmap

- [ ] Initial CLI structure
- [ ] Project discovery and configuration
- [ ] npm audit integration
- [ ] Multi-package manager support (yarn, pnpm)
- [ ] Snyk API integration
- [ ] Email notifications
- [ ] CI/CD pipeline integration
- [ ] Historical tracking
- [ ] Dashboard UI
- [ ] Team collaboration features