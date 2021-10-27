import '../webpackHotDevClient';
let root = document.getElementById("root");
function render() {
  let title = require("./title");
  root.innerHTML = title;
}
render();


if(module.hot){
  module.hot.accept(['./title'],()=>{
      render();
  });
}