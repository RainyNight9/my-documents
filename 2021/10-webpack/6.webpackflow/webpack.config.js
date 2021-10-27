const path = require("path");
const RunPlugin = require("./plugins/RunPlugin");
const DonePlugin = require("./plugins/DonePlugin");

module.exports = {
  context: process.cwd(), // 当前的根目录
  mode: "development", // 工作模 式 是开发模 式
  devtool: false, // 不生成sourcemap
  entry: "./src/app.js", // 入口文件
  output: {
    path: path.resolve(__dirname, "dist"), // 输出的路径
    filename: "main.js", // 文件名
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-env"],
          },
        },
        include: path.join(__dirname, "src"),
        exclude: /node_modules/,
      },
    ],
  },
  plugins: [new RunPlugin(), new DonePlugin()],
  devServer: {},
};
