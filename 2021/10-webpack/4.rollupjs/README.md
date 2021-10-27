Rollup 是一个 JavaScript 模块打包器，可以将小块代码编译成大块复杂的代码，例如 library 或应用程序。

Rollup 对代码模块使用新的标准化格式，这些标准都包含在 JavaScript 的 ES6 版本中，而不是以前的特殊解决方案，如 CommonJS 和 AMD。ES6 模块可以使你自由、无缝地使用你最喜爱的 library 中那些最有用独立函数，而你的项目不必携带其他未使用的代码。ES6 模块最终还是要由浏览器原生实现，但当前 Rollup 可以使你提前体验。

- rollup 下一代 ES6 模块化工具，最大的亮点是利用 ES6 模块设计，利用 tree-shaking 生成更简洁、更简单的代码
- 一般而言，对于应用使用 webpack，对于类库使用 rollup
- 需要代码拆分（code splitting），或者很多静态资源需要处理，再或者构建的项目需要引入很多 Commonjs 模块的依赖时，使用 webpack
- 代码库是 基于 ES6 模块，而且希望代码能够被其他人直接使用，使用 rollup

## 优点

    用标准化的格式（es6）来写代码，通过减少死代码尽可能的缩小包体积

## 缺点

    对代码拆分、静态资源、commonjs模块支持不好

https://www.rollupjs.com/guide/tools/#babel
