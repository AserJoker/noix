#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const cprocess = require('child_process');
if (!fs.existsSync(path.resolve(process.cwd(), 'noix.config.js'))) {
  console.error('ERROR:no noix.config.js find');
} else {
  const config = require(path.resolve(process.cwd(), 'noix.config.js'));
  const plugins = config.plugins || [];
  fs.writeFileSync(
    path.resolve(__dirname, './src/Plugin.ts'),
    `
    import { QueryInterface } from '@noix/core';
    export const LoadClientPlugins = async () => {
      return new Promise<void>((resolve) => {
        try {
          Reflect.set(window, 'QueryInterface', QueryInterface);
          Promise.all([${plugins
            .map((p) => `import('${p.main}')`)
            .join(',')}]).then(() => resolve());
        } catch (e) {
          resolve();
        }
      });
    };
    
  `
  );
  const cp = cprocess.exec(
    `webpack-dev-server --config ${path.resolve(
      __dirname,
      'webpack.config.js'
    )}`
  );
  cp.stdout.on('data', (data) => console.log(data));
  cp.stderr.on('data', (data) => console.error(data));
}
