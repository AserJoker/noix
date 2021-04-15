import { SystemApplication, Bootstrap } from '@noix/core';
import commander from 'commander';
import path from 'path';
import fs from 'fs';
@Bootstrap
export class ServerApplication extends SystemApplication {
  private _config: Record<string, unknown> = {};
  public async main() {
    const commandLine = this.ResolveCommandLine();
    if (commandLine.config) {
      this._config = await this.LoadConfigFile(
        path.resolve(process.cwd(), commandLine.config)
      );
    }
  }

  public ResolveCommandLine() {
    return commander
      .option(
        '-C, --config <config>',
        'config file for server',
        'noix.server.js'
      )
      .version('0.0.1')
      .parse(process.argv)
      .opts();
  }

  public async LoadConfigFile(filePath: string) {
    if (fs.existsSync(filePath)) {
      return require(filePath);
    } else {
      return {};
    }
  }
}
