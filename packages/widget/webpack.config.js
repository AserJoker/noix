const path = require('path');
const packageName = 'noix.widget';
module.exports = {
  mode: 'development',
  devtool: 'source-map',
  entry: path.resolve(__dirname, 'src/index.ts'),
  output: {
    path: path.resolve(__dirname, 'dist'),
    publicPath: '/dist/',
    libraryTarget: 'commonjs',
    filename: `${packageName}.lib.js`
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
    extensions: ['.ts']
  }
};
