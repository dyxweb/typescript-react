const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin')
module.exports = {
  mode: 'development',
  devServer: {
    hot: true,
    open: true,
    // 设置接口请求代理，解决跨域问题
    proxy: {
      '/api': {
        target: 'target',
        changeOrigin: true,
      },
      '/AdminApi': {
        target: 'target',
        changeOrigin: true,
      },
    }
  },
  plugins: [
    // 状态重置问题（更改相关代码保存后，state状态会重置）
    new ReactRefreshWebpackPlugin()
  ]
}