const path = require('path');
const packageName = 'noix.client';
module.exports = {
  mode: 'development',
  devtool: 'source-map',
  entry: path.resolve(__dirname, 'src/ClientApplication.ts'),
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
    extensions: ['.ts', '.js']
  }
};
