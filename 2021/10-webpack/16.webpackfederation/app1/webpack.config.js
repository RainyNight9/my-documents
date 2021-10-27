const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ModuleFederationPlugin = require("webpack/lib/container/ModuleFederationPlugin");

module.exports = {
  mode: 'development',
  entry: './src/index.js',
  devtool: false,
  devServer: {
    contentBase: path.join(__dirname, "dist"),
    port: 3001
  },
  plugins: [
    new ModuleFederationPlugin({
        name: "app1",
        library: { type: "var", name: "app1" },
        remotes: {
            app2: "app2"
        },
        shared: []
    }),
    new HtmlWebpackPlugin({
        template: "./src/index.html"
    })
  ],
  output: {
    publicPath: "http://localhost:3001/"
  },
};