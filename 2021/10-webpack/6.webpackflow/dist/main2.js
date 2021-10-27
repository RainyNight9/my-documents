(function (modules) {
  function __webpack_require__(moduleId) {
    var module = { exports: {} };
    modules[moduleId].call(
      module.exports,
      module,
      module.exports,
      __webpack_require__
    );
    return module.exports;
  }
  return __webpack_require__("./src/app.js");
})({
  "./src/app.js": function (module, exports, __webpack_require__) {
    var title = __webpack_require__("./src/title.js");
    console.log(title);
  },
  "./src/title.js": function (module) {
    module.exports = "title";
  },
});