import { ProjectScanner } from '../scanner/ProjectScanner';
import fs from 'fs-extra';
import path from 'path';

jest.mock('fs-extra');
jest.mock('child_process');

const mockedFs = fs as jest.Mocked<typeof fs>;
const mockedExecSync = jest.requireMock('child_process').execSync;

describe('ProjectScanner', () => {
  let scanner: ProjectScanner;

  beforeEach(() => {
    scanner = new ProjectScanner();
    
    // Reset all mocks
    jest.clearAllMocks();
    
    // Default mock behaviors
    (mockedFs.existsSync as jest.MockedFunction<any>).mockReturnValue(true);
    (mockedFs.pathExists as jest.MockedFunction<any>).mockResolvedValue(true);
    (mockedFs.readJson as jest.MockedFunction<any>).mockResolvedValue({
      name: 'test-project',
      version: '1.0.0',
      private: true,
      scripts: { start: 'node index.js' },
      dependencies: {}
    });
    
    (mockedExecSync as jest.MockedFunction<any>).mockReturnValue(JSON.stringify({
      advisories: {}
    }));
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('isValidProject', () => {
    it('should validate a valid project directory', () => {
      const isValid = (scanner as any).isValidProject('/valid/project');
      expect(isValid).toBe(true);
    });

    it('should reject an invalid project directory', () => {
      (mockedFs.pathExists as jest.MockedFunction<any>).mockResolvedValue(false);
      const isValid = (scanner as any).isValidProject('/invalid/project');
      expect(isValid).toBe(false);
    });
  });

  describe('loadPackageInfo', () => {
    it('should load package information correctly', async () => {
      const mockPackageJson = {
        name: 'test-project',
        version: '1.0.0',
        private: true,
        scripts: { start: 'node index.js' },
        dependencies: { 'express': '^4.17.0' },
        devDependencies: { '@types/node': '^14.0.0' }
      };

      (mockedFs.readJson as jest.MockedFunction<any>).mockResolvedValue(mockPackageJson);

      const result = (scanner as any).loadPackageInfo('/test-project');

      expect(result.name).toBe('test-project');
      expect(result.version).toBe('1.0.0');
      expect(result.private).toBe(true);
      expect(result.scripts).toEqual({ start: 'node index.js' });
      expect(result.dependencies).toEqual({ 'express': '^4.17.0' });
      expect(result.devDependencies).toEqual({ '@types/node': '^14.0.0' });
    });
  });

  describe('runNpmAudit', () => {
    it('should run npm audit successfully', () => {
      const auditOutput = JSON.stringify({
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
      });
      
      (mockedExecSync as jest.MockedFunction<any>).mockReturnValue(auditOutput);

      const result = (scanner as any).runNpmAudit('/test-project');

      expect(result).toEqual(JSON.parse(auditOutput));
    });

    it('should handle npm audit failures gracefully', () => {
      (mockedExecSync as jest.MockedFunction<any>).mockImplementation(() => {
        throw new Error('npm audit failed');
      });

      const result = (scanner as any).runNpmAudit('/test-project');

      expect(result).toBeNull();
    });
  });

  describe('processAuditOutput', () => {
    it('should process audit output with vulnerabilities', () => {
      const auditOutput = {
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
      };

      const result = (scanner as any).processAuditOutput(auditOutput);

      expect(result).toHaveLength(1);
      expect(result[0].title).toBe('Test vulnerability');
      expect(result[0].severity).toBe('high');
      expect(result[0].description).toBe('A test vulnerability');
      expect(result[0].module).toBe('express');
      expect(result[0].patchedVersions).toBe('4.18.0');
    });

    it('should handle empty audit output', () => {
      const auditOutput = {
        advisories: {}
      };

      const result = (scanner as any).processAuditOutput(auditOutput);

      expect(result).toEqual([]);
    });

    it('should filter vulnerabilities by severity', () => {
      const auditOutput = {
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
      };

      const result = (scanner as any).processAuditOutput(auditOutput, 'high');

      expect(result).toHaveLength(1);
      expect(result[0].severity).toBe('critical');
    });
  });
});