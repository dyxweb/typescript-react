## webpack5搭建基于typescript的react项目
### 项目整体目录结构
```
- config
  - webpack.common.js
  - webpack.dev.js
  - webpack.prod.js
  - webpack.config.js
- public
  - index.html
  - logo.png
- src
  - index.tsx
- package.json
- .browserslistrc
- tsconfig.json
- .babelrc
```
### 初始项目目录
- 新建typescript-react文件夹
- 初始化package.json
```
npm init
```
- 新建public文件夹及文件夹下的index.html、logo.png
```
// index.html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="description" content="typescript-react" />
    <title>typescript-react</title>
  </head>
  <body>
    <noscript>You need to enable JavaScript to run this app.</noscript>
    <div id="root"></div>
  </body>
</html>
```
### 安装webpack相关依赖包
```
npm i -D webpack webpack-cli webpack-dev-server
```
### 安装react、typescript相关依赖
- 安装react相关依赖
```
npm i react react-dom
```
- 安装ts相关依赖
```
npm i -D typescript @types/react @types/react-dom
```
- ts配置初始化
```
// tsconfig.json
{
  "compilerOptions": {
    "target": "es5",
    "lib": [
      "dom",
      "dom.iterable",
      "esnext"
    ],
    "paths": {
      "@/*": ["src/*"]
    },
    "allowJs": true,
    "skipLibCheck": true,
    "esModuleInterop": true,
    "allowSyntheticDefaultImports": true,
    "strict": true,
    "forceConsistentCasingInFileNames": true,
    "noFallthroughCasesInSwitch": true,
    "module": "esnext",
    "moduleResolution": "node",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx"
  },
  "include": [
    "src",
    "global.d.ts"
  ]
}
```
### 新建config目录配置webpack
- webpack.common.js // 通用的配置
- webpack.config.js // 根据命令执行不同的配置文件
- webpack.dev.js // 开发环境自有的配置
- webpack.prod.js // 生产环境自有的配置
### 配置webpack的entry和output
```
// webpack.common.js
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
```
### 使用html-webpack-plugin定义html模板
```
npm i -D html-webpack-plugin

// webpack.common.js
const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
  entry: path.resolve(__dirname, '../src/index.tsx'),
  output: {
    publicPath: '/',
    path: path.resolve(__dirname, '../build'),
    filename: 'static/js/[name].[contenthash:8].js',
    // 每一次打包清除上一次打包内容
    clean: true,
  },
  plugins: [
    new HtmlWebpackPlugin({
      // html模板
      template: path.resolve(__dirname, '../public/index.html'),
      // 页签icon
      favicon: path.resolve(__dirname, '../public/logo.png')
    }),
  ]
}
```
### 设置模块如何被解析
- resolve.extensions
> 尝试按顺序解析这些后缀名文件。能够使用户在引入模块时不带文件扩展名。如果有多个文件有相同的名字，但后缀名不同，webpack 会解析列在数组首位的后缀的文件并跳过其余的后缀。

```
// webpack.common.js
const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')

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
  },
  plugins: [
    new HtmlWebpackPlugin({
      // html模板
      template: path.resolve(__dirname, '../public/index.html'),
      // 页签icon
      favicon: path.resolve(__dirname, '../public/logo.png')
    }),
  ]
}
```
- resolve.alias
> 创建 import 或 require 的别名，来确保模块引入变得更简单。需要在tsconfig中配置path。

```
// webpack.common.js
const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')

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
  plugins: [
    new HtmlWebpackPlugin({
      // html模板
      template: path.resolve(__dirname, '../public/index.html'),
      // 页签icon
      favicon: path.resolve(__dirname, '../public/logo.png')
    }),
  ]
}

// tsconfog.json
{
  "compilerOptions": {
    // ...
    "paths": {
      "@/*": ["src/*"]
    },
    // ...
  },
  "include": [
    "src",
    "global.d.ts"
  ]
}
```
### babel相关配置
- 安装babel相关依赖
```
npm i -D @babel/core @babel/preset-env @babel/preset-react @babel/preset-typescript babel-loader
```
- .babelrc进行配置
```
{
  "presets": [
    "@babel/preset-env",
    [
      "@babel/preset-react",
      {
        "runtime": "automatic"
      }
    ],
    "@babel/preset-typescript"
  ]
}
```
- webpack配置babel-loader
```
// webpack.common.js
const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')

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
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      // html模板
      template: path.resolve(__dirname, '../public/index.html'),
      // 页签icon
      favicon: path.resolve(__dirname, '../public/logo.png')
    }),
  ]
}
```
### 样式相关配置
#### css-loader
> 会分析出各个 CSS文件之间的关系，把各个CSS文件合并为一大段 CSS，然后将 CSS 文件编译为 CommonJS 模块，并把该模块引入到 JS 中。

#### style-loader
> 从 JS 中提取出刚才引入的编译后的 CSS，在页面的 header 中创建 style 标签，并插入该css。

#### 配置 css-loader 和 style-loader，使 webpack 具有处理 CSS 资源的能力。
```
npm install -D css-loader style-loader

// webpack.common.js
const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')

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
        use: ['style-loader', 'css-loader']
      },
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      // html模板
      template: path.resolve(__dirname, '../public/index.html'),
      // 页签icon
      favicon: path.resolve(__dirname, '../public/logo.png')
    }),
  ]
}
```
#### 支持scss使用
```
npm install -D sass sass-loader

// webpack.common.js
const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')

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
      // 页签icon
      favicon: path.resolve(__dirname, '../public/logo.png')
    }),
  ]
}
```
#### CSS 兼容性处理
> 由于浏览器兼容性不同，需要进行 CSS 兼容性的处理。如果手动编写各种兼容样式，工作量较大，可使用 postcss-loader 来实现 CSS 的兼容性。

- postcss-loader 依赖于 postcss。post-css 有大量的配置，我们可以使用它的预设 postcss-preset-env，该预设包括了 autoprefixer等。
```
npm install -D postcss-loader postcss postcss-preset-env
```
- 定义通用的 postcss-loader 配置
```
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
```
- 在每个css相关的loader配置中添加上面定义的loader。定义的 commonPostcssLoader 需要在 css-loader 之前执行，在 css 预处理器的loader之后执行。
```
// webpack.common.js
const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')

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
        use: ['style-loader', 'css-loader', commonPostcssLoader]
      },
      {
        test: /.(scss|sass)$/,
        use: [
          'style-loader',
          'css-loader',
          commonPostcssLoader,
          'sass-loader'
        ]
      },
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      // html模板
      template: path.resolve(__dirname, '../public/index.html'),
      // 页签icon
      favicon: path.resolve(__dirname, '../public/logo.png')
    }),
  ]
}
```
- 添加 .browserslistrc 文件
> 在项目根目录下创建 .browserslistrc 文件，该文件告诉 postcss-loader 需要支持的浏览器。

```
// 占有率大于1%、并且最新的10个版本、并且存在的浏览器
> 1%
last 10 version
not dead
```
#### 支持css module形式
```
// webpack.common.js
const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')

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
        use: ['style-loader', 'css-loader', commonPostcssLoader]
      },
      {
        test: /.(scss|sass)$/,
        use: [
          'style-loader',
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
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      // html模板
      template: path.resolve(__dirname, '../public/index.html'),
      // 页签icon
      favicon: path.resolve(__dirname, '../public/logo.png')
    }),
  ]
}
```
#### 提取出独立的 CSS 文件 mini-css-extract-plugin
> 将css资源打包进js文件这种配置，在浏览器中运行时，首先会加载 JS 文件，之后才会创建 style 标签来插入样式，很多情况下会出现闪屏现场，导致用户体验不好。可通过配置 mini-css-extract-plugin 提取出独立的 CSS 文件，通过 link 标签加载样式。

- 将module.rules 中所有 style-loader 替换为该插件提供的loader：MiniCssExtractPlugin.loader。
```
npm install -D mini-css-extract-plugin

// webpack.common.js
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
        use: [MiniCssExtractPlugin.loader,, 'css-loader', commonPostcssLoader]
      },
      {
        test: /.(scss|sass)$/,
        use: [
          MiniCssExtractPlugin.loader,,
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
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      // html模板
      template: path.resolve(__dirname, '../public/index.html'),
      // 页签icon
      favicon: path.resolve(__dirname, '../public/logo.png')
    }),
  ]
}
```
- 在 plugins 中添加该插件。
```
// webpack.common.js
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
```
#### css-minimizer-webpack-plugin 压缩css代码
```
npm install -D css-minimizer-webpack-plugin

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
```
### 静态资源模块相关配置
> webpack5 通过添加 4 种新的模块类型，来替换之前相关处理资源的loader。

- asset/resource 发送一个单独的文件并导出 URL。之前通过使用 file-loader 实现。
- asset/inline 导出一个资源的 data URI。之前通过使用 url-loader 实现。
- asset/source 导出资源的源代码。之前通过使用 raw-loader 实现。
- asset 在导出一个 data URI 和发送一个单独的文件之间自动选择。之前通过使用 url-loader，并且配置资源体积限制实现。
```
// webpack.common.js
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
```
### webpack-dev-server配置
```
// webpack.dev.js
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
```
### 开发环境状态重置问题（更改相关代码保存后，state状态会重置）
```
npm install -D @pmmmwh/react-refresh-webpack-plugin react-refresh

// webpack.dev.js
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
```
### 开启gzip压缩
```
npm install -D compression-webpack-plugin

// webpack.prod.js
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
```
### 根据传入环境使用不同环境webpack配置  
- webapck配置
```
npm install -D webpack-merge

// webpack.config.js
const { merge } = require('webpack-merge')
const commonConfig = require('./webpack.common.js')
module.exports = envVars => {
  const { env } = envVars
  const envConfig = require(`./webpack.${env}.js`)
  const config = merge(commonConfig, envConfig)
  return config
}
```
- package.json配置webpack执行命令
```
"scripts": {
  // 启动命令加  --history-api-fallback 开发环境页面支持刷新
  "start": "webpack serve --config config/webpack.config.js --env env=dev --history-api-fallback",
  "build": "webpack --config config/webpack.config.js --env env=prod"
},
```
### 创建src目录，在目录下的index.tsx中编写业务代码
```
import React from 'react';
import ReactDOM from 'react-dom';

const App = () => <div>app</div>;

ReactDOM.render(<App />, document.getElementById('root'));
```