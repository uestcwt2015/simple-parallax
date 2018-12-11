/** 
 * @file webpack.config.js
 */

const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const merge = require('webpack-merge');

const baseConfig = {
  entry: './src/parallax.js',
  output: {
    filename: 'parallax.min.js',
    path: path.resolve(__dirname, 'dist'),
    library: 'Parallax',
    libraryTarget: 'umd',
    libraryExport: 'default'
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader'
        }
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      hash: true,
      template: './index.html',
      filename: 'index.html'
    }),
    new CleanWebpackPlugin('dist')
  ]
};

const devConfig = {
  devServer: {
    contentBase: path.resolve(__dirname, 'dist'),
    compress: true,
    port: 8080,
    inline: true,
    open: true
  }
};

module.exports = (env, argv) => {
  const mode = argv.mode;
  
  if (mode === 'development') {
    return merge({ mode: mode }, baseConfig, devConfig);
  }
}

