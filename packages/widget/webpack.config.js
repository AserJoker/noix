const path = require('path');
const { VueLoaderPlugin } = require('vue-loader');
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
        test: /\.tsx?$/,
        loader: 'ts-loader',
        exclude: /node_modules/,
        options: {
          appendTsSuffixTo: [/\.vue$/]
        }
      },
      {
        test: /\.vue$/,
        use: ['vue-loader']
      },
      {
        test: /\.css$/,
        use: ['vue-style-loader', 'css-loader']
      },
      {
        test: /\.js$/,
        use: {
          loader: 'babel-loader'
        },
        exclude: '/node_modules/'
      }
    ]
  },
  resolve: {
    extensions: ['.ts', '.js', '.vue']
  },
  plugins: [new VueLoaderPlugin()],
  externals: {
    '@noix/core': '@noix/core'
  }
};
