import { ProjectScanner } from '../scanner/ProjectScanner';
import { ConfigManager } from '../config/ConfigManager';
import fs from 'fs-extra';
import path from 'path';

jest.mock('fs-extra');
jest.mock('child_process');

const mockedFs = fs as jest.Mocked<typeof fs>;
const mockedExecSync = jest.requireMock('child_process').execSync;

describe('ProjectScanner', () => {
  let scanner: ProjectScanner;
  let config: ConfigManager;

  beforeEach(() => {
    config = new ConfigManager();
    scanner = new ProjectScanner(config);
    jest.clearAllMocks();
  });

  describe('scan', () => {
    it('should scan a project successfully', async () => {
      const mockPackageJson = {
        name: 'test-project',
        version: '1.0.0',
        scripts: {},
        dependencies: {
          'express': '4.17.0'
        }
      };

      mockedFs.existsSync.mockReturnValue(true);
      mockedFs.readJson.mockResolvedValue(mockPackageJson);
      mockedExecSync.mockReturnValue(JSON.stringify({
        advisories: {
          '123': {
            id: 123,
            title: 'Test vulnerability',
            severity: 'high',
            description: 'A test vulnerability',
            modules: ['express'],
            patched_versions: '4.18.0',
            fix_versions: ['4.18.0'],
            url: 'https://npmjs.com/advisories/123'
          }
        }
      }));

      const result = await scanner.scan('/test-project', { severity: 'medium' });

      expect(result.project).toBe('test-project');
      expect(result.path).toBe('/test-project');
      expect(result.vulnerabilities).toHaveLength(1);
      expect(result.vulnerabilities[0].title).toBe('Test vulnerability');
      expect(result.vulnerabilities[0].severity).toBe('high');
    });

    it('should handle invalid project directory', async () => {
      mockedFs.existsSync.mockReturnValue(false);

      const result = await scanner.scan('/invalid-project');

      expect(result.project).toBe('invalid-project');
      expect(result.warnings).toContain('Not a valid npm project (package.json not found)');
    });

    it('should handle npm audit failures gracefully', async () => {
      mockedFs.existsSync.mockReturnValue(true);
      mockedFs.readJson.mockResolvedValue({
        name: 'test-project',
        version: '1.0.0',
        scripts: {},
        dependencies: {}
      });
      mockedExecSync.mockImplementation(() => {
        throw new Error('npm audit failed');
      });

      const result = await scanner.scan('/test-project');

      expect(result.warnings).toContain('Scan failed: npm audit failed');
    });

    it('should filter vulnerabilities by severity', async () => {
      const mockPackageJson = {
        name: 'test-project',
        version: '1.0.0',
        scripts: {},
        dependencies: {
          'express': '4.17.0',
          'lodash': '4.17.0'
        }
      };

      mockedFs.existsSync.mockReturnValue(true);
      mockedFs.readJson.mockResolvedValue(mockPackageJson);
      mockedExecSync.mockReturnValue(JSON.stringify({
        advisories: {
          '123': {
            id: 123,
            title: 'Critical vuln',
            severity: 'critical',
            description: 'A critical vulnerability',
            modules: ['express']
          },
          '456': {
            id: 456,
            title: 'Low vuln',
            severity: 'low',
            description: 'A low vulnerability',
            modules: ['lodash']
          }
        }
      }));

      const result = await scanner.scan('/test-project', { severity: 'high' });

      expect(result.vulnerabilities).toHaveLength(1);
      expect(result.vulnerabilities[0].severity).toBe('critical');
    });
  });

  describe('loadPackageInfo', () => {
    it('should load package information correctly', async () => {
      const mockPackageJson = {
        name: 'test-project',
        version: '1.0.0',
        private: true,
        scripts: { start: 'node index.js' },
        dependencies: { express: '^4.17.0' },
        devDependencies: { jest: '^29.0.0' }
      };

      mockedFs.existsSync.mockReturnValue(true);
      mockedFs.readJson.mockResolvedValue(mockPackageJson);

      const result = await scanner.loadPackageInfo('/test-project');

      expect(result.name).toBe('test-project');
      expect(result.version).toBe('1.0.0');
      expect(result.private).toBe(true);
      expect(result.scripts).toEqual({ start: 'node index.js' });
      expect(result.dependencies).toEqual({ express: '^4.17.0' });
      expect(result.devDependencies).toEqual({ jest: '^29.0.0' });
    });
  });

  describe('mapSeverity', () => {
    it('should map severity strings correctly', () => {
      expect(scanner['mapSeverity']('info')).toBe('low');
      expect(scanner['mapSeverity']('low')).toBe('low');
      expect(scanner['mapSeverity']('moderate')).toBe('medium');
      expect(scanner['mapSeverity']('high')).toBe('high');
      expect(scanner['mapSeverity']('critical')).toBe('critical');
      expect(scanner['mapSeverity']('unknown')).toBe('medium');
    });
  });
});