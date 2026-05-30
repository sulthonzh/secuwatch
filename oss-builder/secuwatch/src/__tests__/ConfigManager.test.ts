import { ConfigManager } from '../config/ConfigManager';
import fs from 'fs-extra';

jest.mock('fs-extra');

const mockedFs = fs as jest.Mocked<typeof fs>;

describe('ConfigManager', () => {
  let configManager: ConfigManager;
  let mockConfigPath: string;

  beforeEach(() => {
    mockConfigPath = '/home/user/.secuwatch/config.json';
    jest.spyOn(require('os'), 'homedir').mockReturnValue('/home/user');
    configManager = new ConfigManager();
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('load and save', () => {
    it('should load default config when no config exists', async () => {
      mockedFs.pathExists.mockResolvedValue(false);
      mockedFs.ensureDir.mockResolvedValue();
      mockedFs.writeJson.mockResolvedValue();

      const config = await configManager.load();

      expect(config.projectsDir).toBe('/home/user/projects');
      expect(config.severity).toBe('medium');
      expect(config.checkInterval).toBe(3600);
      expect(config.emailNotifications).toBe(false);
    });

    it('should load existing config file', async () => {
      const existingConfig = {
        projectsDir: '/custom/projects',
        severity: 'high',
        checkInterval: 1800,
        emailNotifications: true,
        emailRecipient: 'test@example.com',
        projects: [
          { name: 'test-project', path: '/test/path', added: '2023-01-01T00:00:00.000Z' }
        ]
      };

      mockedFs.pathExists.mockResolvedValue(true);
      mockedFs.readJson.mockResolvedValue(existingConfig);

      const config = await configManager.load();

      expect(config).toEqual(existingConfig);
    });

    it('should handle corrupt config file gracefully', async () => {
      mockedFs.pathExists.mockResolvedValue(true);
      mockedFs.readJson.mockImplementation(() => {
        throw new Error('Invalid JSON');
      });
      mockedFs.ensureDir.mockResolvedValue();
      mockedFs.writeJson.mockResolvedValue();

      const config = await configManager.load();

      // Should return default config
      expect(config.severity).toBe('medium');
    });
  });

  describe('get and set', () => {
    beforeEach(async () => {
      mockedFs.pathExists.mockResolvedValue(true);
      mockedFs.readJson.mockResolvedValue({
        projectsDir: '/test/projects',
        severity: 'medium',
        checkInterval: 3600,
        emailNotifications: false,
        projects: []
      });
      mockedFs.writeJson.mockResolvedValue();
      await configManager.load();
    });

    it('should get configuration values', async () => {
      const severity = await configManager.get('severity');
      expect(severity).toBe('medium');

      const checkInterval = await configManager.get('checkInterval');
      expect(checkInterval).toBe(3600);
    });

    it('should set configuration values', async () => {
      await configManager.set({ severity: 'high', checkInterval: 7200 });

      const severity = await configManager.get('severity');
      expect(severity).toBe('high');

      const checkInterval = await configManager.get('checkInterval');
      expect(checkInterval).toBe(7200);
    });
  });

  describe('project management', () => {
    beforeEach(async () => {
      mockedFs.pathExists.mockResolvedValue(true);
      mockedFs.readJson.mockResolvedValue({
        projectsDir: '/test/projects',
        severity: 'medium',
        checkInterval: 3600,
        emailNotifications: false,
        projects: []
      });
      mockedFs.writeJson.mockResolvedValue();
      await configManager.load();
    });

    it('should add a new project', async () => {
      const project = {
        name: 'my-app',
        path: '/path/to/my-app',
        added: '2023-01-01T00:00:00.000Z'
      };

      await configManager.addProject(project.name, project.path);

      const projects = await configManager.getProjects();
      expect(projects).toHaveLength(1);
      expect(projects[0]).toEqual(project);

      // Verify file was saved
      expect(mockedFs.writeJson).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          projects: [project]
        }),
        { spaces: 2 }
      );
    });

    it('should not add duplicate projects', async () => {
      await configManager.addProject('my-app', '/path/to/my-app');

      await expect(configManager.addProject('my-app', '/another/path')).rejects.toThrow(
        "Project 'my-app' already exists"
      );
    });

    it('should remove a project', async () => {
      await configManager.addProject('my-app', '/path/to/my-app');
      await configManager.addProject('another-app', '/path/to/another-app');

      await configManager.removeProject('my-app');

      const projects = await configManager.getProjects();
      expect(projects).toHaveLength(1);
      expect(projects[0].name).toBe('another-app');
    });

    it('should get a specific project', async () => {
      await configManager.addProject('my-app', '/path/to/my-app');

      const project = await configManager.getProject('my-app');
      expect(project).toEqual({
        name: 'my-app',
        path: '/path/to/my-app',
        added: expect.any(String)
      });

      const nonExistentProject = await configManager.getProject('non-existent');
      expect(nonExistentProject).toBeNull();
    });

    it('should update project information', async () => {
      await configManager.addProject('my-app', '/path/to/my-app');

      await configManager.updateProject('my-app', {
        lastScanned: '2023-01-02T00:00:00.000Z'
      });

      const project = await configManager.getProject('my-app');
      expect(project?.lastScanned).toBe('2023-01-02T00:00:00.000Z');
    });

    it('should throw error when updating non-existent project', async () => {
      await expect(configManager.updateProject('non-existent', { path: '/new/path' }))
        .rejects.toThrow("Project 'non-existent' not found");
    });
  });

  describe('reset', () => {
    it('should reset to default configuration', async () => {
      mockedFs.pathExists.mockResolvedValue(true);
      mockedFs.readJson.mockResolvedValue({
        projectsDir: '/custom/projects',
        severity: 'high',
        checkInterval: 1800
      });
      mockedFs.writeJson.mockResolvedValue();

      await configManager.reset();

      const config = await configManager.getAll();
      expect(config.projectsDir).toBe('/home/user/projects');
      expect(config.severity).toBe('medium');
      expect(config.checkInterval).toBe(3600);
    });
  });
});