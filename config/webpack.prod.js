const CssMinimizerWebpackPlugin = require('css-minimizer-webpack-plugin')
const CompressionPlugin = require('compression-webpack-plugin')

module.exports = {
  mode: 'production',
  devtool: 'source-map',
  plugins: [
    // 压缩css代码
    new CssMinimizerWebpackPlugin(),
    // 开启gzip压缩
    new CompressionPlugin({
      algorithm: 'gzip',
      test: new RegExp('\\.(js|css)$'),
      threshold: 10240,
      minRatio: 0.8
    })
  ]
}