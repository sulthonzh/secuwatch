"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConfigCommand = void 0;
const ConfigManager_1 = require("../config/ConfigManager");
class ConfigCommand {
    async execute(options = {}) {
        const config = new ConfigManager_1.ConfigManager();
        if (options.init) {
            await this.initConfig(config);
            return;
        }
        if (options.set) {
            await this.setConfig(config, options.set);
            return;
        }
        if (options.get) {
            await this.getConfig(config, options.get);
            return;
        }
        if (options.list) {
            await this.listConfig(config);
            return;
        }
        this.showUsage();
    }
    async initConfig(config) {
        try {
            await config.reset();
            console.log('Configuration initialized successfully');
            console.log('Default settings:');
            console.log('  Severity: medium');
            console.log('  Check interval: 3600 seconds (1 hour)');
            console.log('  Email notifications: disabled');
        }
        catch (error) {
            console.error('Failed to initialize configuration:', error instanceof Error ? error.message : error);
        }
    }
    async setConfig(config, setting) {
        try {
            const [key, value] = setting.split('=');
            if (!key || !value) {
                console.error('Invalid format. Use: --set key=value');
                return;
            }
            await config.set({ [key]: this.parseValue(value) });
            console.log(`Set ${key} = ${value}`);
        }
        catch (error) {
            console.error('Failed to set configuration:', error instanceof Error ? error.message : error);
        }
    }
    async getConfig(config, key) {
        try {
            const value = await config.get(key);
            console.log(`${key} = ${JSON.stringify(value)}`);
        }
        catch (error) {
            console.error('Failed to get configuration:', error instanceof Error ? error.message : error);
        }
    }
    async listConfig(config) {
        try {
            const all = await config.getAll();
            console.log('Current configuration:');
            for (const [key, value] of Object.entries(all)) {
                if (key !== 'projects') {
                    console.log(`  ${key} = ${JSON.stringify(value)}`);
                }
            }
        }
        catch (error) {
            console.error('Failed to list configuration:', error instanceof Error ? error.message : error);
        }
    }
    parseValue(value) {
        if (value === 'true')
            return true;
        if (value === 'false')
            return false;
        if (/^\d+$/.test(value))
            return parseInt(value, 10);
        if (/^\d+\.\d+$/.test(value))
            return parseFloat(value);
        return value;
    }
    showUsage() {
        console.log('SecuWatch Configuration');
        console.log('=====================');
        console.log('Use one of the following subcommands:');
        console.log('');
        console.log('  secuwatch config --init         Initialize configuration');
        console.log('  secuwatch config --set key=value  Set configuration value');
        console.log('  secuwatch config --get key     Get configuration value');
        console.log('  secuwatch config --list        List all configuration');
        console.log('');
        console.log('Examples:');
        console.log('  secuwatch config --set severity=high');
        console.log('  secuwatch config --set checkInterval=7200');
        console.log('  secuwatch config --get severity');
        console.log('');
        console.log('Please specify a configuration subcommand.');
    }
}
exports.ConfigCommand = ConfigCommand;
//# sourceMappingURL=config.js.map