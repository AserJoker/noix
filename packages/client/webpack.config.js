const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');
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
    extensions: ['.ts', '.js'],
    alias: {
      '@src': path.resolve(__dirname, 'src')
    }
  },
  devServer: {
    contentBase: './dist',
    port: 8001
  },
  plugins: [
    new HtmlWebpackPlugin(),
    new webpack.ProvidePlugin({ $core: '@noix/core' })
  ]
};
