const path = require("path");
const importPlugin = path.join(__dirname, "plugins", "babel-plugin-import.js");

module.exports = {
  mode: "development", // 开发模式
  devtool: false, // 不生成 sourcemap
  entry: "./src/app.js", // 入口文件
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "bundle.js",
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-env"],
            plugins: [[importPlugin, { libraryName: "lodash" }]],
          },
        },
        include: path.join(__dirname, "src"),
        exclude: /node_modules/,
      },
    ],
  },
  plugins: [],
  devServer: {},
};