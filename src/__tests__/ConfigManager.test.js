"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ConfigManager_1 = require("../config/ConfigManager");
const fs_extra_1 = __importDefault(require("fs-extra"));
const path_1 = __importDefault(require("path"));
const os_1 = __importDefault(require("os"));
// Mock fs-extra and os
jest.mock('fs-extra');
jest.mock('os');
describe('ConfigManager', () => {
    let configManager;
    beforeEach(() => {
        // Setup mocks
        jest.spyOn(os_1.default, 'homedir').mockReturnValue('/home/user');
        // Reset all mocks
        jest.clearAllMocks();
        // Setup default mock behaviors
        fs_extra_1.default.ensureDir.mockResolvedValue();
        fs_extra_1.default.pathExists.mockResolvedValue(false); // Default: no config file exists
        fs_extra_1.default.readJson.mockResolvedValue({
            projectsDir: '/home/user/projects',
            severity: 'medium',
            checkInterval: 3600,
            emailNotifications: false,
            notifications: {},
            projects: []
        });
        fs_extra_1.default.writeJson.mockResolvedValue();
        // Create ConfigManager
        configManager = new ConfigManager_1.ConfigManager();
    });
    afterEach(() => {
        jest.restoreAllMocks();
    });
    describe('load', () => {
        it('should load default config when no config exists', async () => {
            // No config file exists
            fs_extra_1.default.pathExists.mockResolvedValue(false);
            const config = await configManager.load();
            expect(config.severity).toBe('medium');
            expect(config.checkInterval).toBe(3600);
            expect(config.emailNotifications).toBe(false);
            expect(config.projects).toEqual([]);
        });
        it('should load existing config file', async () => {
            // Config file exists
            const existingConfig = {
                projectsDir: '/custom/projects',
                severity: 'high',
                checkInterval: 1800,
                emailNotifications: true,
                notifications: {},
                projects: [
                    { name: 'test-project', path: '/test/path', added: '2023-01-01T00:00:00.000Z' }
                ]
            };
            fs_extra_1.default.pathExists.mockResolvedValue(true);
            fs_extra_1.default.readJson.mockResolvedValue(existingConfig);
            const config = await configManager.load();
            expect(config).toEqual(existingConfig);
        });
        it('should handle corrupt config file gracefully', async () => {
            // Config file exists but throws error
            fs_extra_1.default.pathExists.mockResolvedValue(true);
            fs_extra_1.default.readJson.mockRejectedValue(new Error('Invalid JSON'));
            const config = await configManager.load();
            // Should return default config
            expect(config.severity).toBe('medium');
            expect(config.checkInterval).toBe(3600);
            expect(config.emailNotifications).toBe(false);
            expect(config.projects).toEqual([]);
        });
    });
    describe('get and set', () => {
        beforeEach(async () => {
            // Load initial config
            fs_extra_1.default.pathExists.mockResolvedValue(true);
            fs_extra_1.default.readJson.mockResolvedValue({
                projectsDir: '/test/projects',
                severity: 'medium',
                checkInterval: 3600,
                emailNotifications: false,
                notifications: {},
                projects: []
            });
            await configManager.load();
        });
        it('should get configuration values', async () => {
            const severity = await configManager.get('severity');
            expect(severity).toBe('medium');
            const checkInterval = await configManager.get('checkInterval');
            expect(checkInterval).toBe(3600);
        });
        it('should set configuration values', async () => {
            // Mock the read to return updated config after save
            fs_extra_1.default.readJson.mockImplementation((filePath) => {
                if (filePath && filePath.toString().includes('config.json')) {
                    return Promise.resolve({
                        projectsDir: '/test/projects',
                        severity: 'high',
                        checkInterval: 7200,
                        emailNotifications: false,
                        notifications: {},
                        projects: []
                    });
                }
                return Promise.resolve({});
            });
            await configManager.set({ severity: 'high', checkInterval: 7200 });
            const config = await configManager.getAll();
            expect(config.severity).toBe('high');
            expect(config.checkInterval).toBe(7200);
        });
    });
    describe('project management', () => {
        beforeEach(async () => {
            // Load initial config with empty projects
            fs_extra_1.default.pathExists.mockResolvedValue(true);
            fs_extra_1.default.readJson.mockResolvedValue({
                projectsDir: '/test/projects',
                severity: 'medium',
                checkInterval: 3600,
                emailNotifications: false,
                notifications: {},
                projects: []
            });
            await configManager.load();
        });
        it('should get a specific project', async () => {
            const configWithProject = {
                projectsDir: '/test/projects',
                severity: 'medium',
                checkInterval: 3600,
                emailNotifications: false,
                notifications: {},
                projects: [
                    { name: 'my-app', path: '/path/to/my-app', added: '2023-01-01T00:00:00.000Z' }
                ]
            };
            fs_extra_1.default.readJson.mockResolvedValue(configWithProject);
            const project = await configManager.getProject('my-app');
            expect(project).toEqual({
                name: 'my-app',
                path: '/path/to/my-app',
                added: expect.any(String)
            });
            const nonExistentProject = await configManager.getProject('non-existent');
            expect(nonExistentProject).toBeNull();
        });
        it('should throw error when updating non-existent project', async () => {
            await expect(configManager.updateProject('non-existent', { path: '/new/path' }))
                .rejects.toThrow("Project 'non-existent' not found");
        });
    });
});
//# sourceMappingURL=ConfigManager.test.js.map