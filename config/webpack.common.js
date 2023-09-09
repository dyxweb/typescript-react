const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const isDev = process.env.NODE_ENV === 'development'; // 是否是开发模式

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
        use: [
          isDev ? 'style-loader' : MiniCssExtractPlugin.loader, // 开发环境使用style-loader，打包模式抽离css
          'css-loader', 
          'postcss-loader'
        ]
      },
      {
        test: /.(scss|sass)$/,
        use: [
          isDev ? 'style-loader' : MiniCssExtractPlugin.loader, // 开发环境使用style-loader，打包模式抽离css
          {
            loader: require.resolve('css-loader'),
            // 开启css module
            options: {
              modules: {
                localIdentName: '[folder]_[local]_[hash:base64:5]',
              },
            },
          },
          'postcss-loader',
          'sass-loader'
        ]
      },
      {
        test: /.(png|jpg|jpeg|gif|svg)$/, // 匹配图片文件
        type: "asset", // type选择asset
        parser: {
          dataUrlCondition: {
            maxSize: 10 * 1024, // 小于10kb转base64位
          }
        },
        generator: {
          filename: 'static/images/[name].[contenthash:8][ext]', // 文件输出目录和命名
        },
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