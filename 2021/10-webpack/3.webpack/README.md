# webpack

- webpack 是模块化管理工具和打包工具，通过 loader 的转换，任何像是的资源都可以试作模块，比如：Commonjs 模块、ADM 模块、ES6 模块、css、图片等。它可以将许多松散的模块按照依赖和规则打包成符合生产环境部署的前端资源
- 还可以将按需加载的模块进行代码分割，等到实际需要的时候再异步加载
- 它定位是模块打包器，而 gulp 和 grunt 属于构建工具，webpack 可以代替它们的一切功能，但不是一个职能的工具，可以配合使用

## 优点

    可以模块化的打包任何资源
    适配任何模块系统
    适合SPA单页应用的开发

## 缺点

    学习成本高，配置复杂
    通过babel的编译后的js代码打包后体积过大

```js
cnpm install webpack webpack-cli babel-loader @babel/core @babel/preset-env -D
```
