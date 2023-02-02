const path = require('path')

module.exports = {
  entry: path.resolve(__dirname, '../src/index.tsx'),
  output: {
    publicPath: '/',
    path: path.resolve(__dirname, '../build'),
    filename: 'static/js/[name].[contenthash:8].js',
    // 每一次打包清除上一次打包内容
    clean: true,
  },
}