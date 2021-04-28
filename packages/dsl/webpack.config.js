const path = require('path');
const packageName = 'noix.dsl';
module.exports = {
  mode: 'development',
  devtool: 'source-map',
  entry: path.resolve(__dirname, 'src/index.ts'),
  output: {
    path: path.resolve(__dirname, 'dist'),
    libraryTarget: 'umd',
    filename: `${packageName}.lib.js`,
    umdNamedDefine: true,
    globalObject: 'this'
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
  },
  externals: {
    '@noix/core': '@noix/core'
  }
};
