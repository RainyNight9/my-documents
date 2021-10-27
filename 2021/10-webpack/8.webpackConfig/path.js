// 当前的工作目录
let path = require("path");
const appDirectory = process.cwd();;
console.log(appDirectory);
// 从相对路径中解析绝对路径
const resolveApp = (relativePath) => {
  return path.resolve(appDirectory, relativePath);
}
let r = resolveApp('./index.js');
console.log(r);