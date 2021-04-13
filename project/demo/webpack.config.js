const path = require('path');
const packageName = 'noix.demo-plugin';
const clientWebpack = require('@noix/client/webpack.config');
module.exports = {
  ...clientWebpack,
  entry: path.resolve(__dirname, 'src/main.ts'),
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: `${packageName}.js`
  },
  resolve: {
    extensions: ['.ts', '.js']
  }
};
