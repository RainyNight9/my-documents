'use strict';

const fs = require('fs');
const errorOverlayMiddleware = require('react-dev-utils/errorOverlayMiddleware');
const evalSourceMapMiddleware = require('react-dev-utils/evalSourceMapMiddleware');
const ignoredFiles = require('react-dev-utils/ignoredFiles');
const redirectServedPath = require('react-dev-utils/redirectServedPathMiddleware');
const paths = require('./paths');
const host = process.env.HOST || '0.0.0.0';

module.exports = function(proxy, allowedHost) {
  return {
    //禁用主机检查
    disableHostCheck: true,
    //启动gzip压缩
    compress: true,
    //禁用WebpackDevServer自己的日志,警告和错误还是可以显示的
    clientLogLevel: "none",
    //静态文件根目录
    contentBase: paths.appPublic,
    contentBasePublicPath: paths.publicUrlOrPath,
    //默认情况下contentBase里的文件变更不会触发页面刷新
    watchContentBase: true,
    //启用热更新
    hot: true,
    //使用ws而非socketjs-node模块
    transportMode: "ws",
    //不需要注入WS客户端
    injectClient: false,
    //访问路径
    publicPath: paths.publicUrlOrPath.slice(0, -1),
    //更少的WebpackDevServer日志
    quiet: true,
    watchOptions: {
      ignored: ignoredFiles(paths.appSrc), //不要监控src目录
    },
    host,
    historyApiFallback: {
      //禁用dotRule
      disableDotRule: true,
      index: paths.publicUrlOrPath,
    },
    public: allowedHost,
    //proxy会在before和after之间执行
    proxy,
    before(app, server) {
      //在出错的时候获取源码内容
      app.use(evalSourceMapMiddleware(server));
      //让我们从运行时错误打开文件
      app.use(errorOverlayMiddleware());
      //由于代理注册的中间件 
      if (fs.existsSync(paths.proxySetup)) {
        require(paths.proxySetup)(app);
      }
    },
    after(app) {
      //如果URL不匹配重定向到`PUBLIC_URL` or `homepage` from `package.json`
      app.use(redirectServedPath(paths.publicUrlOrPath));
    },
  };
};
