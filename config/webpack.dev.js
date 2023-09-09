const path = require('path');
const { merge } = require('webpack-merge');
const commonConfig = require('./webpack.common.js');

// 合并基本配置，并添加开发环境配置
module.exports = merge(commonConfig, {
  mode: 'development', // 开发模式
  devtool: 'cheap-module-source-map',
  devServer: {
    port: 8000, // 端口号
    compress: false, // gzip压缩开发环境不开启，提升热更新速度
    open: true, // 自动打开浏览器
    hot: true, // 开启热更新
    historyApiFallback: true, // 解决history路由404问题
    static: {
      directory: path.resolve(__dirname, "../public"), // 托管静态资源public文件夹
    }
  }
})