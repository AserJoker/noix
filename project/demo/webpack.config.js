const path = require('path');
const packageName = 'noix.demo';
module.exports = {
  mode: 'development',
  devtool: 'source-map',
  entry: path.resolve(__dirname, 'src/main.ts'),
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: `${packageName}.js`
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: ['ts-loader']
      }
    ]
  },
  resolve: {
    extensions: ['.ts'],
    alias: {
      '@src': path.resolve(__dirname, 'src')
    }
  },

  target: 'async-node'
};
