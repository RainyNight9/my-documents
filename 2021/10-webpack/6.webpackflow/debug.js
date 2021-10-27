const webpack = require("webpack");
const config = require("./webpack.config.js"); // 1.读取配置文件

debugger;
const compiler = webpack(config);
function compilerCallback(err, stats) {
  const statsString = stats.toString();
  console.log(statsString);
}
compiler.run((err, stats) => {
  compilerCallback(err, stats);
});
