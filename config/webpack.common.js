const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  // 入口文件
  entry: path.resolve(__dirname, '../src/index.tsx'),
  // 打包文件出口
  output: {
    publicPath: '/', // 打包后文件的公共前缀路径
    path: path.resolve(__dirname, '../build'), // 打包结果输出目录
    filename: 'static/js/[name].[contenthash:8].js', // 打包文件名
    clean: true, // 每一次打包清除上一次打包内容，webpack4需要配置clean-webpack-plugin
  },
  resolve: {
    // 默认是.js和.json。以下配置解决ts文件无法被引用解析的问题
    extensions: ['.tsx', '.ts', '.jsx', '.js', '.json'],
  },
  module: {
    rules: [
      {
        test: /\.(ts|js)x?$/,
        use: 'babel-loader',
        exclude: [
          /\bcore-js\b/,
          /\bwebpack\/buildin\b/
        ],
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
      },
      {
        test: /.(scss|sass)$/,
        use: [
          'style-loader',
          'css-loader',
          'sass-loader'
        ]
      },
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      // html模板
      template: path.resolve(__dirname, '../public/index.html'),
    }),
    new webpack.DefinePlugin({
      // webpack通过命令将自定义的process.env.BASE_ENV环境变量注入到业务代码
      'process.env.BASE_ENV': JSON.stringify(process.env.BASE_ENV)
    })
  ]
}