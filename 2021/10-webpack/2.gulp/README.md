## gulp

- gulp 将开发流程中让人痛苦或耗时的任务自动化，从而减少你所浪费的时间、创造更大价值。
- 基于 nodejs 的 steam 流打包
- 定位是基于任务流的自动化构建工具
- gulp 是通过 task 对整个开发过程进行构建

## 优点

    流式的写法，简单直观
    API 简单，代码量少
    易于学习和使用
    适合多页面应用开发

## 缺点

    异常处理比较麻烦
    工作流程顺序难以精细控制
    不太适合单页或者自定义模块的开发

```js
cnpm install gulp-cli -g
cnpm install gulp -D
npx -p touch nodetouch gulpfile.js
gulp --help
```

##

```js
cnpm install --save-dev gulp-cli gulp gulp-babel @babel/core @babel/preset-env

```
