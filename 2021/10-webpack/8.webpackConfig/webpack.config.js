'use strict';

const webpack = require('webpack');
const paths = require("./paths");
const CaseSensitivePathsPlugin = require("case-sensitive-paths-webpack-plugin");
const TerserPlugin = require("terser-webpack-plugin");
const PnpWebpackPlugin = require("pnp-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const ManifestPlugin = require("webpack-manifest-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");
const InlineChunkHtmlPlugin = require("react-dev-utils/InlineChunkHtmlPlugin");
const WatchMissingNodeModulesPlugin = require("react-dev-utils/WatchMissingNodeModulesPlugin");
const ModuleScopePlugin = require("react-dev-utils/ModuleScopePlugin");
const InterpolateHtmlPlugin = require("react-dev-utils/InterpolateHtmlPlugin");
const ModuleNotFoundPlugin = require("react-dev-utils/ModuleNotFoundPlugin");
const getClientEnvironment = require("./env");
const cssRegex = /\.css$/;
const sassRegex = /\.(scss|sass)$/;

module.exports = function (webpackEnv) {
  console.log("webpackEnv", webpackEnv); // webpackEnv production
  process.env;
  // 开发环境
  const isEnvDevelopment = webpackEnv === "development"; // false
  // 生产环境
  const isEnvProduction = webpackEnv === "production"; // true
  // set GENERATE_SOURCEMAP=false  是否在生产环境下生成sourcemap文件
  const shouldUseSourceMap = process.env.GENERATE_SOURCEMAP !== "false";
  // 是否把运行时的runtime内置到html中
  const shouldInlineRuntimeChunk = process.env.INLINE_RUNTIME_CHUNK !== "false";
  console.log("shouldInlineRuntimeChunk", shouldInlineRuntimeChunk);
  // %PUBLIC_URL% in `index.html` and `process.env.PUBLIC_URL` in JavaScript.
  // 忽略结束的/  把环境变量中的变量注入到当前应用中来
  const env = getClientEnvironment(paths.publicUrlOrPath.slice(0, -1));
  console.log("env", env);
  const getStyleLoaders = (cssOptions, preProcessor) => {
    const loaders = [
      isEnvDevelopment && require.resolve("style-loader"),
      isEnvProduction && {
        loader: MiniCssExtractPlugin.loader,
      },
      {
        loader: require.resolve("css-loader"),
        options: cssOptions,
      },
      {
        loader: require.resolve("postcss-loader"),
      },
    ].filter(Boolean);
    if (preProcessor) {
      loaders.push(
        {
          loader: require.resolve("resolve-url-loader"),
        },
        {
          loader: require.resolve(preProcessor),
          options: {
            sourceMap: true,
          },
        }
      );
    }
    return loaders;
  };
  return {
    mode: isEnvProduction ? "production" : "development",
    devtool: isEnvProduction
      ? shouldUseSourceMap
        ? "source-map"
        : false
      : isEnvDevelopment && "cheap-module-source-map",
    entry: [
      isEnvDevelopment &&
      require.resolve("react-dev-utils/webpackHotDevClient"),
      paths.appIndexJs,
    ].filter(Boolean),
    output: {
      path: isEnvProduction ? paths.appBuild : undefined, //输出的目标路径
      //一个main bundle一个文件,每个异步代码块也对应一个文件 ,在生产环境中,并不产出真正的文件
      filename: isEnvProduction
        ? "static/js/[name].[contenthash:8].js"
        : "static/js/bundle.js",
      //如果使用了代码分割的话,这里有额外的JS代码块文件
      chunkFilename: isEnvProduction
        ? "static/js/[name].[contenthash:8].chunk.js"
        : "static/js/[name].chunk.js",
      //打包后的文件的访问路径
      publicPath: paths.publicUrlOrPath,
    },
    optimization: {
      minimize: isEnvProduction,//生产环境要压缩 开发环境不压缩
      minimizer: [
        //压缩JS
        new TerserPlugin({}),
        //压缩CSS
        new OptimizeCSSAssetsPlugin({}),
      ],
      //自动分割第三方模块和公共模块
      splitChunks: {
        chunks: "all",
        name: false,
      },
      //为了长期缓存保持运行时代码块是单独的文件
      runtimeChunk: {
        name: (entrypoint) => `runtime-${entrypoint.name}`,
      },
    },
    resolve: {
      //设置modules的目录
      modules: ["node_modules", paths.appNodeModules],
      //指定扩展名
      extensions: paths.moduleFileExtensions.map((ext) => `.${ext}`),
      alias: {
        //设置别名
        "react-native": "react-native-web",
      },
      plugins: [
        //PnpWebpackPlugin,
        //防止用户引用在src或者node_modules之外的文件
        new ModuleScopePlugin(paths.appSrc, [paths.appPackageJson]),
      ],
    },
    resolveLoader: {
      //plugins: [PnpWebpackPlugin.moduleLoader(module)],
    },
    module: {
      rules: [
        //在babel处理之前执行linter
        {
          test: /\.(js|mjs|jsx|ts|tsx)$/,
          enforce: "pre",
          use: [
            {
              loader: require.resolve("eslint-loader"),
            },
          ],
          include: paths.appSrc,
        },
        {
          //OneOf会遍历接下来的loader直到找一个匹配要求的,如果没有匹配的会走file-loader
          oneOf: [
            {
              test: [/\.bmp$/, /\.gif$/, /\.jpe?g$/, /\.png$/],
              loader: require.resolve("url-loader"),
            },
            {
              test: /\.(js|mjs|jsx|ts|tsx)$/,
              include: paths.appSrc,
              loader: require.resolve("babel-loader"),
            },
            {
              test: cssRegex,
              //用于配置css-loader,作用于@import资源之前有多少个loader
              //0=>无(默认) 1=>postcss-loader 2 postcss-loader sass-loader
              use: getStyleLoaders({ importLoaders: 1 }),
            },
            {
              test: sassRegex,
              //postcss-loader  sass-loader
              use: getStyleLoaders({ importLoaders: 3 }, "sass-loader"),
            },
            {
              loader: require.resolve("file-loader"),
              exclude: [/\.(js|mjs|jsx|ts|tsx)$/, /\.html$/, /\.json$/],
              options: {
                name: "static/media/[name].[hash:8].[ext]",
              },
            },
          ],
        },
      ],
    },
    plugins: [
      //使用插入的script标签生成一个index.html插件
      new HtmlWebpackPlugin({
        inject: true,
        template: paths.appHtml,
      }),
      //把运行时插入到html里,这样可以节约一个请求
      isEnvProduction &&
      shouldInlineRuntimeChunk &&
      new InlineChunkHtmlPlugin(HtmlWebpackPlugin, [/runtime-.+[.]js/]),
      //保证在index.html中获取到环境变量public URL可以通过%PUBLIC_URL%获取
      new InterpolateHtmlPlugin(HtmlWebpackPlugin, env.raw),
      //模块找不到的时候提供一些必要上下文信息
      new ModuleNotFoundPlugin(paths.appPath),
      //保证在JS中获取到环境变量if (process.env.NODE_ENV === 'production') { ... }
      new webpack.DefinePlugin(env.stringified),
      //模块热更新插件
      isEnvDevelopment && new webpack.HotModuleReplacementPlugin(),
      //当你大小写拼错的时候进行提示
      isEnvDevelopment && new CaseSensitivePathsPlugin(),
      //重新安装模块后不用重新启动开发服务器
      isEnvDevelopment &&
      new WatchMissingNodeModulesPlugin(paths.appNodeModules),
      //提取CSS
      isEnvProduction &&
      new MiniCssExtractPlugin({
        filename: "static/css/[name].[contenthash:8].css",
        chunkFilename: "static/css/[name].[contenthash:8].chunk.css",
      }),
      //生成一个manifest文件
      new ManifestPlugin({
        fileName: "asset-manifest.json",
        publicPath: paths.publicUrlOrPath,
        generate: (seed, files, entrypoints) => {
          const manifestFiles = files.reduce((manifest, file) => {
            manifest[file.name] = file.path;
            return manifest;
          }, seed);
          const entrypointFiles = entrypoints.main.filter(
            (fileName) => !fileName.endsWith(".map")
          );

          return {
            files: manifestFiles,
            entrypoints: entrypointFiles,
          };
        },
      }),
    ].filter(Boolean),
  };
};
