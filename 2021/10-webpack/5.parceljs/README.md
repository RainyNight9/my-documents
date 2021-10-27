##　 1. Parcel

- [Parcel](https://parceljs.org/getting_started.html)
  内置了一个开发服务器，这会在你更改文件时自动重建你的应用程序，并支持模块热替换 ，以便你快速开发。你只需指定入口文件即可：
- 零配置 快
- parcel 是快速、零配置的 web 应用程序打包器
- 目前 parcel 只能用来构建用于运行在浏览器中的网页，这也是他的出发点和专注点

## 优点

    parcel 内置了常见场景的构建方案及其依赖，无需再安装各种依赖
    parcel 能以html为入口，自动检测和打包依赖资源
    parcel 默认支持模块热替换，真正的开箱即用

## 缺点

    不支持SourceMap
    不支持剔除无效代码（tree-shaking）
    配置不灵活

## 1.Parcel 安装

```js
yarn global add parcel-bundler
npm install -g parcel-bundler

parcel -V
```
