const { merge } = require('webpack-merge');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CssMinimizerWebpackPlugin = require('css-minimizer-webpack-plugin');
const commonConfig = require('./webpack.common.js');

module.exports = merge(commonConfig, {
  mode: 'production', // 生产模式
  optimization: {
    minimizer: [
      new CssMinimizerWebpackPlugin(), // 压缩css
    ],
  },
  plugins: [
    // 抽离css插件
    new MiniCssExtractPlugin({
      filename: 'static/css/[name].[contenthash:8].css' // 抽离css的输出目录和名称
    }),
  ]
})