
const { merge } = require("webpack-merge");
let config = require('./webpack.config');
let devServerConfig = require('./webpackDevServer.config');
module.exports = merge(config('development'), {
  devServer: devServerConfig()
});