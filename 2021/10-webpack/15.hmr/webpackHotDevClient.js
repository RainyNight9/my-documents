let socket = io("/");//先通过socket.io连接服务器
let currentHash;//当前的hash
let lastHash;//上一次的hash
const onConnected = () => {
  console.log("客户端已经连接");
  //6. 客户端会监听到此hash消息
  socket.on("hash", (hash) => {
    currentHash = hash;
  });
  //7. 客户端收到`ok`的消息
  socket.on("ok", () => {
    hotCheck();
  });
  socket.on("disconnect", () => {
     lastHash = currentHash = null;
  });
};
//8.执行hotCheck方法进行更新
function hotCheck() {
  debugger
  if (!lastHash || lastHash === currentHash) {
    return (lastHash = currentHash);
  }
  //9.向 server 端发送 Ajax 请求，服务端返回一个hot-update.json文件，该文件包含了所有要更新的模块的 `hash` 值和chunk名
  hotDownloadManifest().then((update) => {
    let chunkIds = Object.keys(update.c);//['main']
    chunkIds.forEach((chunkId) => {
      //10. 通过JSONP请求获取到最新的模块代码
      hotDownloadUpdateChunk(chunkId);
    });
  });
}

function hotDownloadUpdateChunk(chunkId) {
  var script = document.createElement("script");
  script.charset = "utf-8";
  script.src = "/" + chunkId + "." + lastHash+ ".hot-update.js";
  document.head.appendChild(script);
}
function hotDownloadManifest() {
  var url = "/" + lastHash + ".hot-update.json";
  return fetch(url).then(res => res.json()).catch(error=>{console.log(error);});
}
//11. 补丁JS取回来后会调用`webpackHotUpdate`方法
window.webpackHotUpdate = (chunkId, moreModules) => {
  for (let moduleId in moreModules) {
    let oldModule = __webpack_require__.c[moduleId];//获取老模块
    let { parents } = oldModule;//父亲们 儿子们
    var module = (__webpack_require__.c[moduleId] = {
      i: moduleId,
      exports: {},
      parents,
      children,
      hot: window.hotCreateModule(),
    });
    moreModules[moduleId].call(
      module.exports,
      module,
      module.exports,
      __webpack_require__
    );
    parents.forEach((parent) => {
      let parentModule = __webpack_require__.c[parent];
      parentModule.hot &&
        parentModule.hot._acceptedDependencies[moduleId] &&
        parentModule.hot._acceptedDependencies[moduleId]();
    });
    lastHash = currentHash;
  }
};
socket.on("connect", onConnected);
window.hotCreateModule = () => {
  var hot = {
    _acceptedDependencies: {}, //接收的依赖
    accept: function (dep, callback) {
      for (var i = 0; i < dep.length; i++) {
        hot._acceptedDependencies[dep[i]] = callback;
        //hot._acceptedDependencies['./title']=callback
      }
    },
  };
  return hot;
}
