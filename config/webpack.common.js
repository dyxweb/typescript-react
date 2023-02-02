const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require("mini-css-extract-plugin")

// 定义通用的 postcss-loader 配置
const commonPostcssLoader = {
  loader: 'postcss-loader',
  options: {
    postcssOptions: {
      plugins: [
        'postcss-preset-env'
      ]
    }
  }
}

module.exports = {
  entry: path.resolve(__dirname, '../src/index.tsx'),
  output: {
    publicPath: '/',
    path: path.resolve(__dirname, '../build'),
    filename: 'static/js/[name].[contenthash:8].js',
    // 每一次打包清除上一次打包内容
    clean: true,
  },
  resolve: {
    // 默认是 .js 和 .json。以下配置解决ts文件无法被引用解析的问题
    extensions: ['.tsx', '.ts', '.jsx', '.js', '.json'],
    // 配置路径别名
    alias: {
      '@': path.resolve(__dirname, '../src'),
    },
  },
  module: {
    rules: [
      {
        test: /\.(ts|js)x?$/,
        exclude: /node_modules/,
        use: ['babel-loader']
      },
      {
        test: /\.css$/,
        use: [MiniCssExtractPlugin.loader, 'css-loader', commonPostcssLoader]
      },
      {
        test: /.(scss|sass)$/,
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: require.resolve("css-loader"),
            // 开启css module
            options: {
              modules: {
                localIdentName: "[path][name]-[local]",
              },
            },
          },
          commonPostcssLoader,
          'sass-loader'
        ]
      },
      {
        test: /\.(?:ico|gif|png|jpg|jpeg)$/i,
        type: 'asset/resource',
        generator: {
          filename: 'static/media/[hash][ext][query]'
        },
      },
      {
        test: /\.(woff(2)?|eot|ttf|otf|svg)$/,
        type: 'asset/inline'
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      // html模板
      template: path.resolve(__dirname, '../public/index.html'),
      // 页签icon
      favicon: path.resolve(__dirname, '../public/logo.png')
    }),
    // 将css独立打包
    new MiniCssExtractPlugin({
      filename: 'static/css/[name].[contenthash:8].css',
    }),
  ]
}