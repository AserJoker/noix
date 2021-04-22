const path = require('path');
const packageName = 'noix.demo.client';
// const clientWebpack = require('@noix/client/webpack.config');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { VueLoaderPlugin } = require('vue-loader');
module.exports = {
  entry: path.resolve(__dirname, 'src/main.ts'),
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: `${packageName}.js`
  },
  resolve: {
    extensions: ['.ts', '.js']
  },
  devServer: {
    contentBase: './dist'
  },
  plugins: [new HtmlWebpackPlugin(), new VueLoaderPlugin()],

  module: {
    rules: [
      {
        test: /\.ts$/,
        use: ['ts-loader']
      },
      {
        test: /\.vue$/,
        use: ['vue-loader']
      },
      {
        test: /\.css$/,
        use: ['vue-style-loader', 'css-loader']
      }
    ]
  }
};
