// webpack.prod.js
const CssMinimizerWebpackPlugin = require('css-minimizer-webpack-plugin')

module.exports = {
  mode: 'production',
  devtool: 'source-map',
  plugins: [
    // 压缩css代码
    new CssMinimizerWebpackPlugin(),
  ]
}