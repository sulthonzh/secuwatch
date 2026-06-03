"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConfigManager = void 0;
const fs_extra_1 = __importDefault(require("fs-extra"));
const path_1 = __importDefault(require("path"));
const os_1 = __importDefault(require("os"));
class ConfigManager {
    configPath;
    config;
    constructor() {
        this.configPath = path_1.default.join(os_1.default.homedir(), '.secuwatch', 'config.json');
        this.config = this.getDefaultConfig();
        this.ensureConfigDir();
    }
    getDefaultConfig() {
        return {
            projectsDir: path_1.default.join(os_1.default.homedir(), 'projects'),
            severity: 'medium',
            checkInterval: 3600, // 1 hour
            emailNotifications: false,
            notifications: {},
            projects: []
        };
    }
    async ensureConfigDir() {
        const configDir = path_1.default.dirname(this.configPath);
        await fs_extra_1.default.ensureDir(configDir);
        if (!(await fs_extra_1.default.pathExists(this.configPath))) {
            await this.save();
        }
    }
    async load() {
        try {
            const data = await fs_extra_1.default.readJson(this.configPath);
            this.config = { ...this.getDefaultConfig(), ...data };
            return this.config;
        }
        catch (error) {
            // If config doesn't exist or is corrupted, create default
            await this.save();
            return this.config;
        }
    }
    async save() {
        await fs_extra_1.default.writeJson(this.configPath, this.config, { spaces: 2 });
    }
    async get(key) {
        await this.load();
        return this.config[key];
    }
    async set(newConfig) {
        await this.load();
        this.config = { ...this.config, ...newConfig };
        await this.save();
    }
    async getAll() {
        await this.load();
        return this.config;
    }
    async reset() {
        this.config = this.getDefaultConfig();
        await this.save();
    }
    async addProject(name, path) {
        await this.load();
        // Check if project already exists
        const exists = this.config.projects.some((p) => p.name === name);
        if (exists) {
            throw new Error(`Project '${name}' already exists`);
        }
        const project = {
            name,
            path,
            added: new Date().toISOString()
        };
        this.config.projects = [...this.config.projects, project];
        await this.save();
    }
    async removeProject(name) {
        await this.load();
        const projects = this.config.projects.filter((p) => p.name !== name);
        this.config.projects = projects;
        await this.save();
    }
    async getProjects() {
        await this.load();
        return this.config.projects || [];
    }
    async getProject(name) {
        await this.load();
        return this.config.projects.find((p) => p.name === name) || null;
    }
    async updateProject(name, updates) {
        await this.load();
        const index = this.config.projects.findIndex((p) => p.name === name);
        if (index === -1) {
            throw new Error(`Project '${name}' not found`);
        }
        this.config.projects[index] = { ...this.config.projects[index], ...updates };
        await this.save();
    }
    getConfigPath() {
        return this.configPath;
    }
    getProjectPath() {
        return this.configPath;
    }
}
exports.ConfigManager = ConfigManager;
//# sourceMappingURL=ConfigManager.js.map