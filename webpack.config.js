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
    libraryExport: 'default',
    publicPath: '/'
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader'
      },
      {
        test: /\.(png|jpg|jpeg|gif)$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 1000,
              name: 'public/[name].[ext]?[hash:7]'
            }
          }
        ]
      },
      {
        test: /\.html$/,
        loader: 'html-loader'
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      hash: true,
      template: './index.html',
      filename: 'index.html'
    })
  ]
};

const devConfig = {
  devServer: {
    contentBase: path.resolve(__dirname, 'dist'),
    publicPath: '/',
    compress: true,
    port: 8080,
    inline: true,
    open: true
  }
};

const prodConfig = {
  devtool: 'source-map',
  plugins: [
    new CleanWebpackPlugin('dist')
  ]
};

module.exports = (env, argv) => {
  const mode = argv.mode;
  
  if (mode === 'development') {
    return merge({ mode: mode }, baseConfig, devConfig);
  }

  if (mode === 'production') {
    return merge({ mode: mode }, baseConfig, prodConfig);
  } 
}

