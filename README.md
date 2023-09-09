## webpack5搭建react+ts项目
### 初始化项目基本目录
- 新建项目文件夹typescript-react
- 初始化package.json
```
npm init -y
```
- 项目文件夹下新增以下目录结构和文件
```
- config
  - webpack.common.js    // 基本配置
  - webpack.dev.js       // 开发环境配置
  - webpack.prod.js      // 打包环境配置
  - webpack.analysis.js  // 打包分析配置
- public
  - index.html  // html模版          
- src
  - app.tsx     // react代码
  - index.tsx   // react应用入口页面
- tsconfig.json // ts配置
- package.json
```
- 安装react依赖
```
npm i react react-dom -S
```
- 安装react类型依赖
```
npm i @types/react @types/react-dom -D
```
- 添加public/index.html内容
```
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>typescript-react</title>
</head>
<body>
  <noscript>You need to enable JavaScript to run this app.</noscript>
  <div id="root"></div>
</body>
</html>
```
- 添加tsconfig.json内容
```
{
  "compilerOptions": {
    "target": "es5",
    "lib": ["dom", "dom.iterable", "esnext"],
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
  "include": ["src"]
}
```
- 添加src/app.tsx内容
```
import React from 'react';

const App = () => <div>app</div>;
export default App;
```
- 添加src/index.tsx内容
```
import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './app';

const root = document.getElementById('root');
createRoot(root).render(<App />);
```
### 安装webpack依赖
```
npm i webpack webpack-cli -D
```
### 配置webpack的entry和output
```
// webpack.common.js
const path = require('path');

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
}
```
### 设置模块如何被解析 resolve.extensions
> 尝试按顺序解析这些后缀名文件，能够使用户在引入模块时不带文件扩展名。如果有多个文件有相同的名字但后缀名不同，webpack会解析列在数组首位的后缀的文件并跳过其余的后缀。

```
// webpack.common.js
module.exports = {
  // ...
  resolve: {
    // 默认是.js和.json。以下配置解决ts文件无法被引用解析的问题
    extensions: ['.tsx', '.ts', '.jsx', '.js', '.json'],
  },
}
```
### 配置babel-loader(添加babel.config.js文件配置babel相关配置)
#### 解析ts/tsx和js/jsx
> webpack默认只能识别js文件不能识别ts、jsx语法，需要使用@babel/preset-typescript将ts语法转为js语法，再使用@babel/preset-react来转化jsx语法。

- 安装依赖
```
npm i babel-loader @babel/core @babel/preset-react @babel/preset-typescript -D
```
- 修改webpack.common.js配置
```
module.exports = {
  // ...
  module: {
    rules: [
      {
        test: /\.(ts|js)x?$/,
        use: 'babel-loader'
      }
    ]
  }
}
```
- 添加babel.config.js文件
```
module.exports = {
  // 预设执行顺序由右往左，所以先处理ts再处理jsx
  presets: [
    "@babel/preset-react",
    "@babel/preset-typescript"
  ]
}
```
#### babel处理js兼容
> js新增很多方便好用的标准语法来方便开发，甚至还有非标准语法比如装饰器。但前者标准语法很多低版本浏览器不支持，后者非标准语法所有的浏览器都不支持。所以需要借助babel把最新的标准语法转换为低版本语法，把非标准语法转换为标准语法才能让浏览器识别解析。

- 安装依赖
```
npm i @babel/preset-env @babel/plugin-transform-runtime -D
npm i core-js @babel/runtime -S
```
- 修改babel.config.js的配置
```
// babel.config.js
module.exports = {
  sourceType: "unambiguous",
  // 执行顺序由右往左，所以先处理ts再处理jsx，最后再转换为低版本浏览器支持的语法
  presets: [
    [
      "@babel/preset-env",
      {
        // 设置兼容目标浏览器版本，这里可以不写，babel-loader会自动寻找配置好的.browserslistrc文件
        // "targets": {
        //   > 0.2% in CN
        //   last 10 versions
        // },
        useBuiltIns: "usage", // 根据配置的浏览器兼容，以及代码中使用到的api进行引入polyfill按需添加
        corejs: {
          version: 3,
          proposals: true
        } // 配置使用core-js使用的版本
      }
    ],
    "@babel/preset-react",
    "@babel/preset-typescript"
  ],
  plugins: [
    [
      "@babel/plugin-transform-runtime",
    ],
  ]
}
```
- babel-loader添加exclude配置避免报错
```
module.exports = {
  // ...
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
    ]
  }
}
```
- 添加.browserslistrc文件
```
> 0.2% in CN
last 10 versions
```
### 使用html-webpack-plugin将webpack最终构建好的静态资源都引入到html文件中
- 安装依赖
```
npm i html-webpack-plugin -D
```
- 修改webpack.common.js配置
```
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  // ...
  plugins: [
    new HtmlWebpackPlugin({
      // html模板
      template: path.resolve(__dirname, '../public/index.html'),
    }),
  ]
}
```
### webpack开发环境配置
- 安装依赖
> 使用webpack-dev-server启动本地服务，还需要依赖webpack-merge来合并基本配置。

```
npm i webpack-dev-server webpack-merge -D
```
- 修改webpack.dev.js文件配置开发环境
```
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
```
- package.json添加启动本地服务脚本
```
// package.json
"scripts": {
  "start": "webpack-dev-server --config config/webpack.dev.js"
},
```
### webpack打包环境配置
- 修改webpack.prod.js文件配置打包环境
```
const { merge } = require('webpack-merge');
const commonConfig = require('./webpack.common.js');

module.exports = merge(commonConfig, {
  mode: 'production', // 生产模式
})
```
- package.json添加打包脚本
```
"scripts": {
  // ...
  "build": "webpack --config config/webpack.prod.js"
},
```
- 浏览器查看打包结果
> 执行npm run build，最终打包在build文件夹中，在本地借助node服务器serve启动打包后的项目。

```
// 全局安装serve
npm i serve -g

// 启动打包后的项目
serve -s build
```
### 配置环境变量
> 通过环境变量可以区分是开发模式还是打包构建模式，可以使用较为通用process.env.NODE_ENV环境变量进行区分。区分项目业务环境比如开发、测试、预发、正式，可以自定义一个process.env.BASE_ENV环境变量。

- 安装cross-env
```
npm i cross-env -D
```
- 修改package.json的scripts脚本字段
```
"scripts": {
  "start": "cross-env NODE_ENV=development BASE_ENV=development webpack-dev-server --config config/webpack.dev.js",
  "start:test": "cross-env NODE_ENV=development BASE_ENV=test webpack-dev-server --config config/webpack.dev.js",
  "build": "cross-env NODE_ENV=production BASE_ENV=development webpack --config config/webpack.prod.js",
  "build:test": "cross-env NODE_ENV=production BASE_ENV=test webpack --config config/webpack.prod.js",
},
```
- process.env.NODE_ENV环境变量webpack会自动根据设置的mode字段来给业务代码注入对应的development和production，在命令中再次设置环境变量NODE_ENV是为了在webpack和babel的配置文件中访问到。
- 测试webpack中可以访问到设置的环境变量，执行npm run start:test
```
// webpack.common.js
console.log('NODE_ENV', process.env.NODE_ENV) // NODE_ENV development
console.log('BASE_ENV', process.env.BASE_ENV) // BASE_ENV test
```
- 将环境变量注入到业务代码中
```
// webpack.common.js
const webpack = require('webpack');

module.export = {
  // ...
  plugins: [
    // ...
    new webpack.DefinePlugin({
      // webpack通过命令将自定义的process.env.BASE_ENV环境变量注入到业务代码
      'process.env.BASE_ENV': JSON.stringify(process.env.BASE_ENV)
    })
  ]
```
- 测试业务代码中可以访问到注入的环境变量，执行npm run start:test
```
// src/index.tsx
console.log('NODE_ENV', process.env.NODE_ENV) // NODE_ENV development
console.log('BASE_ENV', process.env.BASE_ENV) // BASE_ENV test
```
### 支持css使用
- css-loader
> 会分析出各个css文件之间的关系，把各个css文件合并为一大段css，然后将css文件编译为CommonJS模块，并把该模块引入到JS中。

- style-loader
> 从JS中提取出刚才引入的编译后的css，在页面的header中创建style标签并插入该css。

- 安装依赖
```
npm i css-loader style-loader -D
```
- 修改webpack.common.js配置
```
// webpack.common.js
module.exports = {
  // ...
  module: {
    rules: [
      // ...
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
      },
    ]
  }
}
```
- 添加css文件测试
```
// src/app.css
.app {
  color: red;
}

// src/app.tsx
import React from 'react';
import './app.css';

const App = () => <div className="app">app</div>;
export default App;
```
- 新建global.d.ts文件添加css类型声明
```
declare module '*.css';
```
- tsconfig.json文件的include属性值添加global.d.ts
```
{
  // ...
  "include": ["src", "global.d.ts"]
}
```
### 支持css预处理器使用(以scss为例)
- 安装依赖
```
npm i sass sass-loader -D
```
- 修改webpack.common.js配置
```
module.exports = {
  // ...
  module: {
    rules: [
      // ...
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
  }
}
```
- 添加scss文件测试
```
// src/app.scss
.app {
  color: blue;
}

// src/app.tsx
import React from 'react';
import './app.scss';

const App = () => <div className="app">app</div>;
export default App;
```
- global.d.ts文件中添加scss类型声明
```
declare module '*.scss';
```
### css兼容性处理
> 由于浏览器兼容性不同，需要进行css兼容性的处理。如果手动编写各种兼容样式工作量较大，可使用postcss-loader来实现css的兼容性。

- postcss-loader依赖于postcss。postcss有大量的配置我们可以使用它的预设postcss-preset-env，该预设包括了autoprefixer等。
```
npm i postcss-loader postcss postcss-preset-env -D
```
- 定义通用的postcss-loader配置，根目录新建postcss.config.js，postcss.config.js是postcss-loader的配置文件，postcss-loader会自动读取配置。
```
// postcss.config.js
module.exports = {
  plugins: ['postcss-preset-env']
}
```
- postcss-loader会根据.browserslistrc文件判断要加哪些浏览器的前缀
- 在每个css相关的loader配置中添加postcss-loader。postcss-loader需要在css-loader之前执行，在css预处理器的loader之后执行。
```
// webpack.common.js
module.exports = {
  // ...
  module: {
    rules: [
      // ...
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader', 'postcss-loader']
      },
      {
        test: /.(scss|sass)$/,
        use: [
          'style-loader',
          'css-loader',
          'postcss-loader',
          'sass-loader'
        ]
      },
    ]
  },
}
```
- 添加样式测试，css样式已经加上了浏览器内核前缀。
```
// src/app.scss
.app {
  color: blue;
  transform: translateY(100px);
}
```
### 支持css module形式
- 添加css-loader的options配置
```
// webpack.common.js
module.exports = {
  // ...
  module: {
    rules: [
      // ...
      {
        test: /\.css$/,
        use: [
          'style-loader',
          'css-loader',
          'postcss-loader'
        ]
      },
      {
        test: /.(scss|sass)$/,
        use: [
          'style-loader',
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
    ]
  },
}
```
- 修改样式使用形式测试效果
```
// src/app.tsx
import React from 'react';
import styles from './app.scss';

const App = () => <div className={styles.app}>app</div>;
export default App;
```
### 抽取css样式文件
> 开发环境我们希望css嵌入在style标签里面方便样式热替换但打包时我们希望把css单独抽离出来，方便配置http缓存策略。

- 安装依赖
```
npm i mini-css-extract-plugin -D
```
- 修改webpack.common.js，根据环境变量设置开发环境使用style-loader，打包模式抽离css。
```
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const isDev = process.env.NODE_ENV === 'development'; // 是否是开发模式

module.exports = {
  // ...
  module: {
    rules: [
      // ...
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
    ]
  },
}
```
- 修改webpack.prod.js, 打包时添加抽离css插件
```
const { merge } = require('webpack-merge');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const commonConfig = require('./webpack.common.js');

module.exports = merge(commonConfig, {
  mode: 'production', // 生产模式
  plugins: [
    // 抽离css插件
    new MiniCssExtractPlugin({
      filename: 'static/css/[name].[contenthash:8].css' // 抽离css的输出目录和名称
    }),
  ]
})
```
### 压缩css文件
- 安装依赖
```
npm i css-minimizer-webpack-plugin -D
```
- 修改webpack.prod.js配置
```
const { merge } = require('webpack-merge');
const CssMinimizerWebpackPlugin = require('css-minimizer-webpack-plugin');
const commonConfig = require('./webpack.common.js');

module.exports = merge(commonConfig, {
  mode: 'production', // 生产模式
  // ...
  optimization: {
    minimizer: [
      new CssMinimizerWebpackPlugin(), // 压缩css
    ],
  },
})
```
### 处理图片文件
- webpack4使用file-loader和url-loader来处理图片文件，webpack5使用自带的asset-module来处理。
```
// webpack.common.js
module.exports = {
  module: {
    rules: [
      // ...
      {
        test: /.(png|jpg|jpeg|gif|svg)$/, // 匹配图片文件
        type: "asset", // type选择asset
        parser: {
          dataUrlCondition: {
            maxSize: 10 * 1024, // 小于10kb转base64位
          }
        },
        generator:{ 
          filename: 'static/images/[name].[contenthash:8][ext]', // 文件输出目录和命名
        },
      },
    ]
  }
}
```
- 添加图片引用测试效果
```
// src/app.tsx
import React from 'react';
import smallImg from './assets/4kb.png';
import bigImg from './assets/20kb.png';
import styles from './app.scss';

const App = () => (
  <div className={styles.app}>
    <img src={smallImg} />
    <img src={bigImg} />
    app
  </div>
);
export default App;
```
- global.d.ts文件中添加图片类型声明
```
declare module '*.png';
```
### 处理字体和媒体文件
> 字体文件和媒体文件处理方式和处理图片一样，调整匹配的路径和打包后放置的路径即可。

```
// webpack.common.js
module.exports = {
  module: {
    rules: [
      // ...
      {
        test: /.(woff2?|eot|ttf|otf)$/, // 匹配字体图标文件
        type: "asset", // type选择asset
        parser: {
          dataUrlCondition: {
            maxSize: 10 * 1024, // 小于10kb转base64位
          }
        },
        generator: {
          filename: 'static/fonts/[name].[contenthash:8][ext]', // 文件输出目录和命名
        },
      },
      {
        test: /.(mp4|webm|ogg|mp3|wav|flac|aac)$/, // 匹配媒体文件
        type: "asset", // type选择asset
        parser: {
          dataUrlCondition: {
            maxSize: 10 * 1024, // 小于10kb转base64位
          }
        },
        generator: {
          filename: 'static/media/[name].[contenthash:8][ext]', // 文件输出目录和命名
        },
      },
    ]
  }
}
```
### react模块热更新
- 模块热更新在webpack5中只要设置devServer.hot为true即可。在webpack4中还需要在插件中添加HotModuleReplacementPlugin，webpack5已经内置该插件。
- 开发模式下修改css和less文件，页面样式可以在不刷新浏览器的情况实时生效，因为此时样式都在style标签里面，style-loader做了替换样式的热更新功能。
- 修改react相关代码，浏览器会自动刷新后再显示修改后的内容，我们期望的是在不需要刷新浏览器的前提下模块热更新，并且能够保留react组件的状态。
- 借助@pmmmwh/react-refresh-webpack-plugin插件来实现，该插件依赖于react-refresh。
- 安装依赖
```
npm i @pmmmwh/react-refresh-webpack-plugin react-refresh -D
```
- 修改webpack.dev.js配置
```
const { merge } = require('webpack-merge');
const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin');
const commonConfig = require('./webpack.common.js');

module.exports = merge(commonConfig, {
  // ...
  plugins: [
    new ReactRefreshWebpackPlugin(), // 添加热更新插件
  ]
})
```
- babel-loader配置react-refesh刷新插件，修改babel.config.js文件
```
const isDEV = process.env.NODE_ENV === 'development'; // 是否是开发模式

module.exports = {
  // ...
  "plugins": [
    // ...
    isDEV && require.resolve('react-refresh/babel'), // 如果是开发模式，就启动react热更新插件
  ].filter(Boolean) // 过滤空值
}
```
### 开启持久化存储缓存
- 在webpack5之前做缓存是使用babel-loader缓存js的解析结果，cache-loader缓存css等资源的解析结果，还有模块缓存插件hard-source-webpack-plugin，配置好缓存后第二次打包通过对文件做哈希对比来验证文件前后是否一致，如果一致则采用上一次的缓存，可以极大地节省时间。
- webpack5较于webpack4，新增了持久化缓存、改进缓存算法等。通过配置webpack持久化缓存来缓存生成的webpack模块和chunk，改善下一次打包的构建速度可提速 90%左右，配置也更为简单。
- 修改webpack.common.js配置
```
module.exports = {
  // ...
  cache: {
    type: 'filesystem', // 使用文件缓存
  },
}
```
### 配置alias别名
> 设置别名可以让后续引用的地方减少路径的复杂度。如下配置在项目中使用@/xxx.xx就会指向src/xxx.xx，在js/ts和css文件中都可以用。

- 修改webpack.common.js配置
```
const path = require('path');

module.export = {
  // ...
   resolve: {
    // ...
    alias: {
      '@': path.resolve(__dirname, '../src')
    }
  }
}
```
- 修改tsconfig.json，添加baseUrl和paths
```
{
  "compilerOptions": {
    // ...
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"]
    }
  }
}
```
- 修改引用形式测试效果
```
// src/app.tsx
import React from 'react';
import smallImg from '@/assets/4kb.png';
import bigImg from '@/assets/20kb.png';
import styles from './app.scss';

const App = () => (
  <div className={styles.app}>
    <img src={smallImg} />
    <img src={bigImg} />
    app
  </div>
);
export default App;
```
### 代码分割第三方包和公共模块
- 一般第三方包的代码变化频率比较小，可以单独把node_modules中的代码单独打包，可以有效利用http缓存。
- 公共的模块也可以提取出来，避免重复打包加大代码整体体积。
- 修改webpack.prod.js配置
```
module.exports = {
  // ...
  optimization: {
    // ...
    splitChunks: { // 代码分割
      cacheGroups: {
        vendors: { // 提取node_modules代码
          test: /node_modules/, // 只匹配node_modules里面的模块
          name: 'vendors', // 提取文件命名为vendors，js后缀和chunkhash会自动加
          minChunks: 1, // 只要使用一次就提取出来
          chunks: 'initial', // 只提取初始化就能获取到的模块，不管异步的
          minSize: 0, // 提取代码体积大于0就提取出来
          priority: 1, // 提取优先级为1
        },
        commons: { // 提取页面公共代码
          name: 'commons', // 提取文件命名为commons
          minChunks: 2, // 只要使用两次就提取出来
          chunks: 'initial', // 只提取初始化就能获取到的模块，不管异步的
          minSize: 0, // 提取代码体积大于0就提取出来
        }
      }
    }
  }
}
```
### 压缩js文件
- 设置mode为production后webpack会使用内置插件terser-webpack-plugin压缩js文件，该插件默认支持多线程压缩。
- 但配置optimization.minimizer压缩css后js压缩就失效了，需要手动再添加一下。webpack内部安装了该插件，如果使用的pnpm需要手动再安装一下依赖。
- 压缩css的插件可以设置在plugins中避免js压缩失效的问题。
- 修改webpack.prod.js配置
```
const { merge } = require('webpack-merge');
const TerserPlugin = require('terser-webpack-plugin');
const commonConfig = require('./webpack.common.js');

module.exports = merge(commonConfig, {
  mode: 'production', // 生产模式
  // ...
  optimization: {
    // ...
    minimizer: [
      // ...
      new TerserPlugin({ // 压缩js
        parallel: true, // 开启多线程压缩
        terserOptions: {
          compress: {
            pure_funcs: ["console.log"] // 删除console.log
          }
        }
      }),
    ],
  },
})
```
### 开启gzip压缩
- 前端代码在浏览器运行需要从服务器把html、css、js资源下载执行，下载的资源体积越小页面加载速度就会越快。一般会采用gzip压缩，现在大部分浏览器和服务器都支持gzip，可以有效减少静态资源文件大小，压缩率在 70% 左右。
- nginx可以配置gzip: on来开启压缩，但是只在nginx层面开启会在每次请求资源时都对资源进行压缩，压缩文件会需要时间和占用服务器cpu资源，更好的方式是前端在打包的时候直接生成gzip资源，服务器接收到请求直接把对应压缩好的gzip文件返回给浏览器节省时间和cpu。
- 安装依赖
```
npm i compression-webpack-plugin -D
```
- 修改webpack.prod.js配置
```
const { merge } = require('webpack-merge');
const CompressionPlugin  = require('compression-webpack-plugin');
const commonConfig = require('./webpack.common.js');

module.exports = merge(commonConfig, {
  mode: 'production', // 生产模式
  // ...
  plugins: [
    // ...
    new CompressionPlugin({
      test: /.(js|css)$/, // 只生成css,js压缩文件
      algorithm: 'gzip', // 压缩格式，默认是gzip
      threshold: 10240, // 只有大小大于该值的资源会被处理。默认值是10k
      minRatio: 0.8 // 压缩率，默认值是0.8
    })
  ]
})
```
### 复制public下内容到构建出口文件夹中
- 安装依赖
```
npm i copy-webpack-plugin -D
```
- 修改webpack.prod.js配置
```
const path = require('path');
const { merge } = require('webpack-merge');
const CopyPlugin = require('copy-webpack-plugin');
const commonConfig = require('./webpack.common.js');

module.exports = merge(commonConfig, {
  mode: 'production', // 生产模式
  plugins: [
    // 复制文件插件
    new CopyPlugin({
      patterns: [
        {
          from: path.resolve(__dirname, '../public'), // 复制public下文件
          to: path.resolve(__dirname, '../build'), // 复制到build目录中
          filter: source => {
            return !source.includes('index.html') // 忽略index.html，html-webpack-plugin已处理
          }
        },
      ],
    }),
  ]
})
```
### 添加打包分析配置
- 安装依赖
```
npm i speed-measure-webpack-plugin webpack-bundle-analyzer -D
```
- webpack配置
```
// webpack.analysis.js
const { merge } = require('webpack-merge');
const SpeedMeasurePlugin = require('speed-measure-webpack-plugin');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
const prodConfig = require('./webpack.prod.js');
const smp = new SpeedMeasurePlugin();

module.exports = smp.wrap(merge(prodConfig, {
  plugins: [
    new BundleAnalyzerPlugin() // 配置分析打包结果插件
  ]
}))
```
- package.json添加scripts脚本
```
"scripts": {
  // ...
  "analysis": "cross-env NODE_ENV=production BASE_ENV=development webpack --config config/webpack.analysis.js",
},
```
### babel处理js非标准语法(以装饰器为例)
- 安装依赖
```
npm i @babel/plugin-proposal-decorators -D
```
- 开启一下ts装饰器支持，修改tsconfig.json文件
```
{
  "compilerOptions": {
    // ...
    // 开启装饰器使用
    "experimentalDecorators": true
  }
}
```
- 在babel.config.js中添加插件
```
module.exports = { 
  // ...
  "plugins": [
    // ...
    [
      "@babel/plugin-proposal-decorators",
      { "legacy": true }
    ]
  ]
}
```