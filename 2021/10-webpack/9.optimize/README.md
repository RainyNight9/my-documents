## 1. 安装
```js
cnpm i react react-dom  -S
cnpm install  webpack webpack-cli webpack-dev-server image-webpack-loader mini-css-extract-plugin purgecss-webpack-plugin babel-loader @babel/core @babel/preset-env @babel/preset-react terser-webpack-plugin html-webpack-plugin optimize-css-assets-webpack-plugin mini-css-extract-plugin qiniu webpack-bundle-analyzer -D
```

## 2.压缩JS
```diff
  optimization: {
    minimize: true,
    minimizer: [
      //压缩JS
+     new TerserPlugin({})
    ]
  },
```

## 3. 压缩CSS
```diff
  optimization: {
    minimize: true,
    minimizer: [
      //压缩CSS
+      new OptimizeCSSAssetsPlugin({}),
    ]
  },
```

## 4. 压缩图片
```diff
      {
        test: /\.(png|svg|jpg|gif|jpeg|ico)$/,
        use: [
          "file-loader",
          {
+            loader: "image-webpack-loader",
+            options: {
+              mozjpeg: {
+                progressive: true,
+                quality: 65,
+              },
+              optipng: {
+                enabled: false,
+              },
+              pngquant: {
+                quality: "65-90",
+                speed: 4,
+              },
+              gifsicle: {
+                interlaced: false,
+              },
+              webp: {
+                quality: 75,
+              }
+            }
+          }
        ]
      }
```

## 5. 清除无用的CSS
- 单独提取CSS并清除用不到的CSS

```diff
const path = require("path");
+const MiniCssExtractPlugin = require("mini-css-extract-plugin");
+const PurgecssPlugin = require("purgecss-webpack-plugin");
module.exports = {
  module: {
    rules: [
       {
        test: /\.css$/,
        include: path.resolve(__dirname, "src"),
        exclude: /node_modules/,
        use: [
          {
+            loader: MiniCssExtractPlugin.loader,
          },
          "css-loader",
        ],
      }
    ]
  },
  plugins: [
+    new MiniCssExtractPlugin({
+      filename: "[name].css",
+    }),
+    new PurgecssPlugin({
+      paths: glob.sync(`${PATHS.src}/**/*`,  { nodir: true }),
+    })
  ]
  devServer: {},
};

```

## 6. Tree Shaking
- 一个模块可以有多个方法，只要其中某个方法使用到了，则整个文件都会被打到bundle里面去，tree shaking就是只把用到的方法打入bundle,没用到的方法会uglify阶段擦除掉
- 原理是利用es6模块的特点,只能作为模块顶层语句出现,import的模块名只能是字符串常量
- webpack默认支持，在.babelrc里设置module:false即可在production mode下默认开启

```diff
module.exports = {
+    mode:'production',
+    devtool:false,
     module: {
        rules: [
            {
                test: /\.js/,
                include: path.resolve(__dirname, "src"),
                use: [
                    {
                        loader: "babel-loader",
                        options: {
+                            presets: [["@babel/preset-env", { "modules": false }]],
                        },
                    },
                ],
            }
     }
}
```

## 7. Scope Hoisting
- Scope Hoisting 可以让 Webpack 打包出来的代码文件更小、运行的更快， 它又译作 "作用域提升"，是在 Webpack3 中新推出的功能。
- scope hoisting的原理是将所有的模块按照引用顺序放在一个函数作用域里，然后适当地重命名一些变量以防止命名冲突
- 这个功能在mode为`production`下默认开启,开发环境要用 `webpack.optimize.ModuleConcatenationPlugin`插件

hello.js
```js
export default 'Hello';
```

index.js
```js
import str from './hello.js';
console.log(str);
```

main.js
```js:
var hello = ('hello');
console.log(hello);
```

## 8. 代码分割
- 对于大的Web应用来讲，将所有的代码都放在一个文件中显然是不够有效的，特别是当你的某些代码块是在某些特殊的时候才会被用到。
- webpack有一个功能就是将你的代码库分割成chunks语块，当代码运行到需要它们的时候再进行加载

### 8.1 入口点分割
- Entry Points：入口文件设置的时候可以配置
- 这种方法的问题
  - 如果入口 chunks 之间包含重复的模块(lodash)，那些重复模块都会被引入到各个 bundle 中
  - 不够灵活，并且不能将核心应用程序逻辑进行动态拆分代码

```js
entry: {
        index: "./src/index.js",
        login: "./src/login.js"
}
```

### 8.2  动态导入和懒加载
用户当前需要用什么功能就只加载这个功能对应的代码，也就是所谓的按需加载 在给单页应用做按需加载优化时
- 一般采用以下原则：
  - 对网站功能进行划分，每一类一个chunk
  - 对于首次打开页面需要的功能直接加载，尽快展示给用户,某些依赖大量代码的功能点可以按需加载
  - 被分割出去的代码需要一个按需加载的时机

hello.js
```js
module.exports = "hello";
```

index.js
```js
document.querySelector('#clickBtn').addEventListener('click',() => {
    import('./hello').then(result => {
        console.log(result.default);
    });
});
```

index.html

```html
<button id="clickBtn">点我</button>
```

### 8.3 preload(预先加载)
- preload通常用于本页面要用到的关键资源，包括关键js、字体、css文件
- preload将会把资源得下载顺序权重提高，使得关键数据提前下载好,优化页面打开速度
- 在资源上添加预先加载的注释，你指明该模块需要立即被使用
- 一个资源的加载的优先级被分为五个级别,分别是
  - Highest 最高
  - High 高
  - Medium 中等
  - Low 低
  - Lowest 最低
- 异步/延迟/插入的脚本（无论在什么位置）在网络优先级中是 `Low`  

```js
<link rel="preload" as="script" href="utils.js">
```

```js
import(
  `./utils.js`
  /* webpackPreload: true */
  /* webpackChunkName: "utils" */
)
```

### 8.4 prefetch(预先拉取)
- prefetch 跟 preload 不同，它的作用是告诉浏览器未来可能会使用到的某个资源，浏览器就会在闲时去加载对应的资源，若能预测到用户的行为，比如懒加载，点击到其它页面等则相当于提前预加载了需要的资源

```html
<link rel="prefetch" href="utils.js" as="script">
```

```js
button.addEventListener('click', () => {
  import(
    `./utils.js`
    /* webpackPrefetch: true */
    /* webpackChunkName: "utils" */
  ).then(result => {
    result.default.log('hello');
  })
});

```

### 8.5 preload vs prefetch
- preload 是告诉浏览器页面必定需要的资源，浏览器一定会加载这些资源
- 而 prefetch 是告诉浏览器页面可能需要的资源，浏览器不一定会加载这些资源
- 所以建议：对于当前页面很有必要的资源使用 preload,对于可能在将来的页面中使用的资源使用 prefetch

### 8.6 提取公共代码
#### 8.6.1 为什么需要提取公共代码
- 大网站有多个页面，每个页面由于采用相同技术栈和样式代码，会包含很多公共代码，如果都包含进来会有问题
- 相同的资源被重复的加载，浪费用户的流量和服务器的成本；
- 每个页面需要加载的资源太大，导致网页首屏加载缓慢，影响用户体验。
- 如果能把公共代码抽离成单独文件进行加载能进行优化，可以减少网络传输流量，降低服务器成本

#### 8.6.2 如何提取
- 基础类库，方便长期缓存
- 页面之间的公用代码
- 各个页面单独生成文件

#### 8.6.3 splitChunks

##### 8.6.3.1 module chunk  bundle
- module：就是js的模块化webpack支持commonJS、ES6等模块化规范，简单来说就是你通过import语句引入的代码
- chunk: chunk是webpack根据功能拆分出来的，包含三种情况
  - 你的项目入口（entry）
  - 通过import()动态引入的代码
  - 通过splitChunks拆分出来的代码
- bundle：bundle是webpack打包之后的各个文件，一般就是和chunk是一对一的关系，bundle就是对chunk进行编译压缩打包等处理之后的产出

##### 8.6.3.2  默认配置
webpack.config.js

```js
  entry: {
    page1: "./src/page1.js",
    page2: "./src/page2.js",
    page3: "./src/page3.js",
  },
 optimization: {
  splitChunks: {
      chunks: "all", //默认作用于异步chunk，值为all/initial/async
      minSize: 0, //默认值是30kb,代码块的最小尺寸
      minChunks: 1, //被多少模块共享,在分割之前模块的被引用次数
      maxAsyncRequests: 2, //限制异步模块内部的并行最大请求数的，说白了你可以理解为是每个import()它里面的最大并行请求数量
      maxInitialRequests: 4, //限制入口的拆分数量
      name: true, //打包后的名称，默认是chunk的名字通过分隔符（默认是～）分隔开，如vendor~
      automaticNameDelimiter: "~", //默认webpack将会使用入口名和代码块的名称生成命名,比如 'vendors~main.js'
      cacheGroups: {
        //设置缓存组用来抽取满足不同规则的chunk,下面以生成common为例
        vendors: {
          chunks: "all",
          test: /node_modules/, //条件
          priority: -10, ///优先级，一个chunk很可能满足多个缓存组，会被抽取到优先级高的缓存组中,为了能够让自定义缓存组有更高的优先级(默认0),默认缓存组的priority属性为负值.
        },
        commons: {
          chunks: "all",
          minSize: 0, //最小提取字节数
          minChunks: 2, //最少被几个chunk引用
          priority: -20
        }
      }
    }
```

src\page1.js
```js
import utils1 from "./module1";
import utils2 from "./module2";
import $ from "jquery";
console.log(utils1, utils2, $);
import(/* webpackChunkName: "asyncModule1" */ "./asyncModule1");
```

src\page2.js
```js
import utils1 from "./module1";
import utils2 from "./module2";
import $ from "jquery";
console.log(utils1, utils2, $);
```

src\page3.js
```js
import utils1 from "./module1";
import utils3 from "./module3";
import $ from "jquery";
console.log(utils1, utils3, $);
```

src\module1.js
```js
console.log("module1");
```

src\module2.js
```js
console.log("module2");
```

src\module3.js
```js
console.log("module3");
```

src\asyncModule1.js
```js
import _ from 'lodash';
console.log(_);
```

```js
                             Asset       Size                     Chunks             Chunk Names
             asyncModule1.chunk.js  740 bytes               asyncModule1  [emitted]  asyncModule1
                        index.html  498 bytes                             [emitted]
                          page1.js   10.6 KiB                      page1  [emitted]  page1
              page1~page2.chunk.js  302 bytes                page1~page2  [emitted]  page1~page2
        page1~page2~page3.chunk.js  308 bytes          page1~page2~page3  [emitted]  page1~page2~page3
                          page2.js   7.52 KiB                      page2  [emitted]  page2
                          page3.js   7.72 KiB                      page3  [emitted]  page3
     vendors~asyncModule1.chunk.js    532 KiB       vendors~asyncModule1  [emitted]  vendors~asyncModule1
vendors~page1~page2~page3.chunk.js    282 KiB  vendors~page1~page2~page3  [emitted]  vendors~page1~page2~page3
Entrypoint page1 = vendors~page1~page2~page3.chunk.js page1~page2~page3.chunk.js page1~page2.chunk.js page1.js
Entrypoint page2 = vendors~page1~page2~page3.chunk.js page1~page2~page3.chunk.js page1~page2.chunk.js page2.js
Entrypoint page3 = vendors~page1~page2~page3.chunk.js page1~page2~page3.chunk.js page3.js
```

![splitChunks](http://img.zhufengpeixun.cn/splitChunks.jpg)


## 6. CDN
- 最影响用户体验的是网页首次打开时的加载等待。 导致这个问题的根本是网络传输过程耗时大，CDN的作用就是加速网络传输。
- CDN 又叫内容分发网络，通过把资源部署到世界各地，用户在访问时按照就近原则从离用户最近的服务器获取资源，从而加速资源的获取速度
- 缓存配置
  - HTML文件不缓存，放在自己的服务器上，关闭自己服务器的缓存，静态资源的URL变成指向CDN服务器的地址
  - 静态的JavaScript、CSS、图片等文件开启CDN和缓存，并且文件名带上HASH值
  - 为了并行加载不阻塞，把不同的静态资源分配到不同的CDN服务器上
- 域名限制
  - 同一时刻针对同一个域名的资源并行请求是有限制
  - 可以把这些静态资源分散到不同的 CDN 服务上去
  - 多个域名后会增加域名解析时间
  - 可以通过在 HTML HEAD 标签中 加入<link rel="dns-prefetch" href="http://img.zhufengpeixun.cn">去预解析域名，以降低域名解析带来的延迟

### 6.1 webpack.config.js
```diff
const path = require("path");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const PurgecssPlugin = require("purgecss-webpack-plugin");
const TerserPlugin = require("terser-webpack-plugin");
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const UploadPlugin = require("./plugins/UploadPlugin");
const glob = require("glob");
const PATHS = {
    src: path.join(__dirname, "src"),
};
module.exports = {
  mode: "development",
  devtool: false,
  context: process.cwd(),
  entry: {
    main: "./src/index.js",
  },
  output: {
    path: path.resolve(__dirname, "dist"),
+    filename: "[name].[hash].js",
+    chunkFilename: "[name].[hash].chunk.js",
+    publicPath: "http://img.zhufengpeixun.cn/",
  },
  optimization: {
    minimize: true,
    minimizer: [
      //压缩JS
      /* new TerserPlugin({
        sourceMap: false,
        extractComments: false,
      }),
      //压缩CSS
      new OptimizeCSSAssetsPlugin({}), */
    ],
    //自动分割第三方模块和公共模块
    splitChunks: {
      chunks: "all", //默认作用于异步chunk，值为all/initial/async
      minSize: 0, //默认值是30kb,代码块的最小尺寸
      minChunks: 1, //被多少模块共享,在分割之前模块的被引用次数
      maxAsyncRequests: 2, //限制异步模块内部的并行最大请求数的，说白了你可以理解为是每个import()它里面的最大并行请求数量
      maxInitialRequests: 4, //限制入口的拆分数量
      name: true, //打包后的名称，默认是chunk的名字通过分隔符（默认是～）分隔开，如vendor~
      automaticNameDelimiter: "~", //默认webpack将会使用入口名和代码块的名称生成命名,比如 'vendors~main.js'
      cacheGroups: {
        //设置缓存组用来抽取满足不同规则的chunk,下面以生成common为例
        vendors: {
          chunks: "all",
          test: /node_modules/, //条件
          priority: -10, ///优先级，一个chunk很可能满足多个缓存组，会被抽取到优先级高的缓存组中,为了能够让自定义缓存组有更高的优先级(默认0),默认缓存组的priority属性为负值.
        },
        commons: {
          chunks: "all",
          minSize: 0, //最小提取字节数
          minChunks: 2, //最少被几个chunk引用
          priority: -20,
          reuseExistingChunk: true, //如果该chunk中引用了已经被抽取的chunk，直接引用该chunk，不会重复打包代码
        },
      },
    },
    //为了长期缓存保持运行时代码块是单独的文件
    /*  runtimeChunk: {
      name: (entrypoint) => `runtime-${entrypoint.name}`,
    }, */
  },
  module: {
    rules: [
      {
        test: /\.js/,
        include: path.resolve(__dirname, "src"),
        use: [
          {
            loader: "babel-loader",
            options: {
              presets: [
                ["@babel/preset-env", { modules: false }],
                "@babel/preset-react",
              ],
            },
          },
        ],
      },
      {
        test: /\.css$/,
        include: path.resolve(__dirname, "src"),
        exclude: /node_modules/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
          },
          "css-loader",
        ],
      },
      {
        test: /\.(png|svg|jpg|gif|jpeg|ico)$/,
        use: [
          "file-loader",
          {
            loader: "image-webpack-loader",
            options: {
              mozjpeg: {
                progressive: true,
                quality: 65,
              },
              optipng: {
                enabled: false,
              },
              pngquant: {
                quality: "65-90",
                speed: 4,
              },
              gifsicle: {
                interlaced: false,
              },
              webp: {
                quality: 75,
              },
            },
          },
        ],
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      inject: true,
      template: "./src/index.html",
    }),
    new MiniCssExtractPlugin({
+      filename: "[name].[hash].css",
    }),
    new PurgecssPlugin({
      paths: glob.sync(`${PATHS.src}/**/*`, { nodir: true }),
    }),
    new UploadPlugin({}),
  ],
  devServer: {},
};
```

### 6.2 UploadPlugin.js
```js
const qiniu = require("qiniu");
const path = require("path");
//https://developer.qiniu.com/kodo/sdk/1289/nodejs
require("dotenv").config();
const defaultAccessKey = process.env.accessKey;
const defaultSecretKey = process.env.secretKey;
class UploadPlugin {
  constructor(options) {
    this.options = options || {};
  }
  apply(compiler) {
    compiler.hooks.afterEmit.tap("UploadPlugin", (compilation) => {
      let assets = compilation.assets;
      let promises = Object.keys(assets).filter(item=>!item.includes('.html')).map(this.upload.bind(this));
      Promise.all(promises).then((err, data) => console.log(err, data));
    });
  }
  upload(filename) {
    return new Promise((resolve, reject) => {
      let {
        bucket = "cnpmjs",
        accessKey = defaultAccessKey,
        secretKey = defaultSecretKey,
      } = this.options;
      let mac = new qiniu.auth.digest.Mac(accessKey, secretKey);
      let options = {
        scope: bucket,
      };

      let putPolicy = new qiniu.rs.PutPolicy(options);
      let uploadToken = putPolicy.uploadToken(mac);
      let config = new qiniu.conf.Config();

      let localFile = path.resolve(__dirname, "../dist", filename);
      let formUploader = new qiniu.form_up.FormUploader(config);
      let putExtra = new qiniu.form_up.PutExtra();
      formUploader.putFile(
        uploadToken,
        filename,
        localFile,
        putExtra,
        (err, body, info) => {
          err ? reject(err) : resolve(body);
        }
      );
    });
  }
}

module.exports = UploadPlugin;
```