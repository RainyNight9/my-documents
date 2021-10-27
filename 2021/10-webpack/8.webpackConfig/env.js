'use strict';

const fs = require('fs');
const path = require('path');
const paths = require('./paths');
//一般可能是production或者development set NODE_ENV=development
const NODE_ENV = process.env.NODE_ENV;

//环境变量的文件路径
const dotenvFiles = [
  `${paths.dotenv}.${NODE_ENV}.local`, // .env.development.local
  `${paths.dotenv}.${NODE_ENV}`,       // .env.development
  //在测试环境下不要包括.env.local
  NODE_ENV !== 'test' && `${paths.dotenv}.local`, // .env.local
  paths.dotenv,//.env
].filter(Boolean);

//从.env*文件中加载环境变量
process.env.username;
dotenvFiles.forEach(dotenvFile => {
  if (fs.existsSync(dotenvFile)) {
    require('dotenv-expand')(
      require('dotenv').config({
        path: dotenvFile,
      })
    );
  }
});
//process.env.PUBLIC_URL=//static2
//支持通过NODE_PATH加载解析模块 set NODE_PATH=modules;extraModules
const appDirectory = fs.realpathSync(process.cwd());
//配置node_modules
process.env.NODE_PATH = (process.env.NODE_PATH || '')
  .split(path.delimiter)
  .filter(folder => folder && !path.isAbsolute(folder))
  .map(folder => path.resolve(appDirectory, folder))
  .join(path.delimiter);
//把相对变绝对

//获取NODE_ENV and REACT_APP_*环境变量,并且准备通过DefinePlugin插入应用
//set REACT_APP_NAME=admin
const REACT_APP = /^REACT_APP_/i;
function getClientEnvironment(publicUrl) {
  const raw = Object.keys(process.env)
    .filter((key) => REACT_APP.test(key))
    .reduce(
      (env, key) => {
        env[key] = process.env[key];
        return env;
      },
      {
        //决定当前是否处于开发模式
        NODE_ENV: process.env.NODE_ENV || "development",
        //用来解析处于public下面的正确资源路径
        PUBLIC_URL: publicUrl,
      }
    );
  //把所有的值转成字符串以便在DefinePlugin中使用
  const stringified = {
    "process.env": Object.keys(raw).reduce((env, key) => {
      env[key] = JSON.stringify(raw[key]);
      return env;
    }, {}),
  };

  return { raw, stringified };
}

module.exports = getClientEnvironment;
