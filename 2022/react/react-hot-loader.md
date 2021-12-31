# React Hot Loader

实时调整 React 组件 ⚛️ ⚡️

## 安装

```sh
npm install react-hot-loader
```

## 开始

1、添加 `react-hot-loader/babel` to your `.babelrc`:

```json
// .babelrc
{
  "plugins": ["react-hot-loader/babel"]
}
```

或者

```json
// package.json
"babel": {
  "presets": [
    "react-app"
  ],
  "plugins": [
    "react-hot-loader/babel"
  ]
}
```

2、将根组件标记为 _hot-exported_:

```js
// App.js
import { hot } from 'react-hot-loader/root';
const App = () => <div>Hello World!</div>;
export default hot(App);
```

3、确保 `react-hot-loader` 在 `react` 和 `react-dom` 之前引用:

```js
// webpack.config.js
module.exports = {
  entry: ['react-hot-loader/patch', './src'],
  // ...
};
```

4、如果你需要支持 hooks, 请使用 [`@hot-loader/react-dom`](#hot-loaderreact-dom)

### 支持 hooks

如果 Hooks 应该更新的话，它们将在 HMR（HotModuleReplacementPlugin） 上自动更新。
它只有一个条件———非零依赖项列表。

```js
❄️ useState(initialState); // 将永远不会更新（保留状态)
❄️ useEffect(effect); // 无需更新，每次渲染时都会更新
❄️ useEffect(effect, []); // "挂载时" hook. "不更新"
🔥 useEffect(effect, [anyDep]); // 随依赖变化进行更新

🔥 useEffect(effect, ["hot"]); // 使 hook 可重新加载的最简单方法
```

#### 拓展

* 任何 hook 都会在函数更改时重新加载。默认情况下启用，由 `reloadHooksOnBodyChange` 选项控制。
* 通过将 `reloadLifeCycleHooks` 选项设置为 true，您可以将RHL配置为重新加载任何 hook。

**禁用 hooks 重载** - 设置配置选项:

```js
import { setConfig } from 'react-hot-loader';

setConfig({
  reloadHooks: false,
});
```

设置此选项后，**所有** `useEffects`、`useCallbacks`和`useMemo`将在热模块更换时更新。

### 重置 Hooks

如果 Hooks 的顺序发生变化，Hooks 将被重置。添加、删除或随意移动将导致本地树重新装载。

此操作需要 **Babel插件**。如果没有它，更改 Hooks 顺序将抛出一个错误，错误将传播到最近的基于类的组件。

## `@hot-loader/react-dom`

[`@hot-loader/react-dom`](https://github.com/hot-loader/react-dom) 替换了相同版本的 `react-dom` 包，但添加了支持热重载的附加补丁。

有两种安装方法:

* 使用 **yarn** 名称解析，因此将安装 `@hot-loader/react-dom`，而不是`react-dom`

```sh
yarn add react-dom@npm:@hot-loader/react-dom
```

* 使用 [webpack aliases](https://webpack.js.org/configuration/resolve/#resolvealias)

```sh
yarn add @hot-loader/react-dom
```

```js
// webpack.config.js
module.exports = {
  // ...
  resolve: {
    alias: {
      'react-dom': '@hot-loader/react-dom',
    },
  },
};
```

### TypeScript

一个简单的配置:

```js
{
  // ...您可能还需要配置常见的Webpack字段，如“mode”和“entry”
  resolve: { extensions: [".ts", ".tsx", ".js", ".jsx"] },
  module: {
    rules: [
      {
        test: /\.(j|t)sx?$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            cacheDirectory: true,
            babelrc: false,
            presets: [
              [
                "@babel/preset-env",
                { targets: { browsers: "last 2 versions" } } // or whatever your project requires
              ],
              "@babel/preset-typescript",
              "@babel/preset-react"
            ],
            plugins: [
              // plugin-proposal-decorators is only needed if you're using experimental decorators in TypeScript
              ["@babel/plugin-proposal-decorators", { legacy: true }],
              ["@babel/plugin-proposal-class-properties", { loose: true }],
              "react-hot-loader/babel"
            ]
          }
        }
      }
    ]
  },
  plugins: [
    new ForkTsCheckerWebpackPlugin()
  ]
};
```

[有关使用React Hot Loader和Babel最新beta版配置TypeScript的完整示例](https://github.com/gaearon/react-hot-loader/tree/master/examples/typescript)

### Parcel

Parcel支持开箱即用的热模块重新加载，只需遵循入门的步骤1和2即可。

[一个运行Parcel+React热加载程序的完整示例](https://github.com/gaearon/react-hot-loader/tree/master/examples/parcel)

## API

### `hot(Component, options)`

将组件标记为热组件。

#### Babel plugin

现在 `babel plugin` 只有一个选项，默认启用。

* `safetyNet` - 将帮助您正确设置ReactHotLoader。

您可以禁用它以获得对模块执行顺序的更多控制。

```js
//.babelrc
{
    "plugins": [
        [
            "react-hot-loader/babel",
            {
            "safetyNet": false
            }
        ]
    ]
}
```

#### Important

**!!** `hot` 仅在模块 `exports` 时使用，而不在模块 `imports` 时使用 **!!**

```js
import { hot } from 'react-hot-loader/root';

const App = () => 'Hello World!';

export default hot(App);
```
