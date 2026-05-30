import { ConfigManager } from '../config/ConfigManager';

export class ConfigCommand {
  async execute(options: any = {}) {
    const config = new ConfigManager();

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

  private async initConfig(config: ConfigManager) {
    try {
      await config.reset();
      console.log('Configuration initialized successfully');
      console.log('Default settings:');
      console.log('  Severity: medium');
      console.log('  Check interval: 3600 seconds (1 hour)');
      console.log('  Email notifications: disabled');
    } catch (error) {
      console.error('Failed to initialize configuration:', error instanceof Error ? error.message : error);
    }
  }

  private async setConfig(config: ConfigManager, setting: string) {
    try {
      const [key, value] = setting.split('=');
      if (!key || !value) {
        console.error('Invalid format. Use: --set key=value');
        return;
      }

      await config.set({ [key]: this.parseValue(value) });
      console.log(`Set ${key} = ${value}`);
    } catch (error) {
      console.error('Failed to set configuration:', error instanceof Error ? error.message : error);
    }
  }

  private async getConfig(config: ConfigManager, key: string) {
    try {
      const value = await config.get(key as any);
      console.log(`${key} = ${JSON.stringify(value)}`);
    } catch (error) {
      console.error('Failed to get configuration:', error instanceof Error ? error.message : error);
    }
  }

  private async listConfig(config: ConfigManager) {
    try {
      const all = await config.getAll();
      console.log('Current configuration:');
      for (const [key, value] of Object.entries(all)) {
        if (key !== 'projects') {
          console.log(`  ${key} = ${JSON.stringify(value)}`);
        }
      }
    } catch (error) {
      console.error('Failed to list configuration:', error instanceof Error ? error.message : error);
    }
  }

  private parseValue(value: string): any {
    if (value === 'true') return true;
    if (value === 'false') return false;
    if (/^\d+$/.test(value)) return parseInt(value, 10);
    if (/^\d+\.\d+$/.test(value)) return parseFloat(value);
    return value;
  }

  private showUsage() {
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