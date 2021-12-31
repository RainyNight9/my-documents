# 再玩Hooks

## 背景

认识Hook

Hook 是什么？ Hook 是⼀个特殊的函数，它可以让你“钩⼊” React 的特性。例如，useState  是允许
你在 React 函数组件中添加 state 的 Hook。

什么时候我会⽤ Hook？ 如果你在编写函数组件并意识到需要向其添加一些 state，以前的做法是必须
将其它转化为 class。现在你可以在现有的函数组件中使⽤ Hook。

## 所有 API

1、useState
2、useEffect
3、useContext
4、useReducer
5、useCallback
6、useMemo
7、useRef
8、useImperativeHandle
9、useLayoutEffect
10、useDebugValue

## QS

1、hooks 开发中需要注意的问题和原因？

使用时候注意事项：

  1、只能在 React 函数中使用（函数式组件或自定义hooks）
  2、只能在函数最外层调用 hook，不能包括在 if， for 等语句中或者子函数中。
  3、useState 中存储的是引用类型的数据时，修改 state 时，一定要返回新的引用。

浅层原因：

  1、hooks 专为函数组件的逻辑复用而设计，所以只能用在函数式组件和自定义hooks
  2、hooks 在调用的时候，需要取保先后调用顺序，一个顺序出问题了，会导致整个程序混乱。
  3、如果在 useState 中存储的是引用类型，更新时不更新引用地址时的话，React 会认为我们没有更新数据没，则不进行组件更新。

深层原理：

