module.exports = {
  mode: 'development',
  devtool: 'cheap-module-source-map',
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
}