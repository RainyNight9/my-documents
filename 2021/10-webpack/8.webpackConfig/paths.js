'use strict';

const path = require('path');
const fs = require('fs');

// 当前的工作目录
const appDirectory = fs.realpathSync(process.cwd());
// 从相对路径中解析绝对路径
const resolveApp = relativePath => path.resolve(appDirectory, relativePath);
// 获取PublicUrlOrPath /static/
const publicUrlOrPath = require(resolveApp("package.json")).homepage || process.env.PUBLIC_URL || "";
// 默认的模块扩展名 常见的
const moduleFileExtensions = [
  'js',
  'ts',
  'tsx',
  'json',
  'jsx',
];
// 解析模块路径  './title.js' resolveFn? 从相对路径得到绝对路径
const resolveModule = (resolveFn, filePath) => {
  // js
  const extension = moduleFileExtensions.find(extension =>
    fs.existsSync(resolveFn(`${filePath}.${extension}`))
  );

  if (extension) {
    return resolveFn(`${filePath}.${extension}`); // ./title.js
  }

  return resolveFn(`${filePath}.js`); // 如果没有默认是.js
};

module.exports = {
  dotenv: resolveApp('.env'), // 客户端环境变量的文件名路径
  appPath: resolveApp('.'), // 当前工作路径
  appBuild: resolveApp('build'), // 输出的build目标路径
  appPublic: resolveApp('public'), // public目录
  appHtml: resolveApp('public/index.html'), // html文件绝对路径
  appIndexJs: resolveModule(resolveApp, 'src/index'), // 入口文件
  appPackageJson: resolveApp('package.json'), // package.json文件路径
  appSrc: resolveApp('src'), // src路径
  appTsConfig: resolveApp('tsconfig.json'),
  appJsConfig: resolveApp('jsconfig.json'),
  appNodeModules: resolveApp('node_modules'),
  publicUrlOrPath,
};

module.exports.moduleFileExtensions = moduleFileExtensions;
