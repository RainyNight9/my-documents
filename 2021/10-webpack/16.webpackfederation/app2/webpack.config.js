const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
// const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const ModuleFederationPlugin = require("webpack/lib/container/ModuleFederationPlugin");

module.exports = {
  mode: "development",
  entry: "./src/index.js",
  devtool:false,
  devServer: {
    contentBase: "./dist",
    port: 3002,
  },
  plugins: [
    new ModuleFederationPlugin({
      name: "app2",
      library: { type: "var", name: "app2" },
      filename: "remoteEntry.js",
      exposes: {
        hello: "./src/hello.js"
      },
      shared: [],
    }),
    new HtmlWebpackPlugin({
      template: "./src/index.html",
    }),
  ],
  output: {
    publicPath: "http://localhost:3002/",
  },
};