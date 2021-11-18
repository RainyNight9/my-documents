# vue3

## 1、核心API

### CDN安装（便于学习）

```html
<script src="https://unpkg.com/vue@next"></script>
```

### 模版语法

1、插值 - interpolations (双⼤括号) 的⽂本插值
2、特性 - attributes 应该使⽤v-bind指令
3、HTML内容 应该使⽤v-html指令

>具体代码详见 `01-hello.html`

### 计算属性和侦听器

1、计算属性

模板内的表达式⾮常便利，但是设计它们的初衷是⽤于简单运算的。在**模板中放⼊太多的逻辑会让模板过重且难以维护**。例如，想要把 title 反转⼀下：

```html
<h4>{{ title.split('').reverse().join('') }}</h4>
```

所以，对于任何包含响应式数据的复杂逻辑，你都应该使⽤计算属性。

2、侦听器

**当需要在数据变化时执⾏异步或开销较⼤的操作时**，这个⽅式是最有⽤的。

>具体代码详见 `01-hello.html`

### 动态样式绑定

1、class与style绑定

将 v-bind ⽤于 class 和 style 时，Vue.js 做了专⻔的增强。**表达式结果的类型除了字符串之外，还可以是对象或数组。**

2、绑定内联样式

>具体代码详见 `01-hello.html`

### 条件和列表渲染

1、列表渲染
2、条件渲染

>具体代码详见 `02-list.html`

### 事件处理

可以⽤ v-on 指令监听 DOM 事件，并在触发时运⾏⼀些 JavaScript 代码。

>具体代码详见 `02-list.html`

### 表单输⼊绑定

你可以⽤ v-model 指令在表单 `<input>`、 `<textarea>` 及 `<select>` 元素上创建双向数据绑定。**它会根据控件类型⾃动选取正确的⽅法来更新元素。** v-model本质上是**语法糖**。它将转换为输⼊事件以更新数据，并对⼀些极端场景进⾏⼀些特殊处理。

>具体代码详见 `02-list.html`

### ⽣命周期钩⼦

<img src="./images/lifecycle.svg" width="840" height="auto" loading="lazy" alt="实例的生命周期" style="margin: 0px auto; display: block; max-width: 100%;">

基本可划分为三个阶段：

  初始化阶段：beforeCreate、created、beforeMount、mounted
  更新阶段：beforeUpdate、updated
  销毁阶段：beforeUnmount、unmounted

| Vue3            | Vue2          |
| :-------------- | :------------ |
| beforeCreate    | beforeCreate  |
| created         | created       |
| beforeMount     | beforeMount   |
| mounted         | mounted       |
| beforeUpdate    | beforeUpdate  |
| updated         | updated       |
| beforeUnmount   | beforeDestroy |
| unmounted       | destroyed     |
| errorCaptured   | errorCaptured |
| renderTracked   | -             |
| renderTriggered | -             |

>具体代码详见 `04-lifecycle.html`

## 组件化开发

组件系统是 Vue 的另一个重要概念，因为它是一种抽象，允许我们使用小型、独立和通常可复用的组件构建大型应用。

1、组件注册（全局注册、局部注册）
2、数据传递
3、⾃定义事件

  与组件和 prop 一样，事件名提供了自动的大小写转换。
  如果用驼峰命名的子组件中触发一个事件，你将可以在父组件中添加一个 kebab-case (短横线分隔命名) 的监听器。

4、检验事件
5、在组件上使⽤v-model
6、通过插槽分发内容

>具体代码详见 `03-component.html`

## Composition API

⼀组低侵⼊式的、函数式的 API，使得我们能够更灵活地「组合」组件的逻辑。

当我们的组件开始变得更大时，逻辑关注点的列表也会增长。尤其对于那些一开始没有编写这些组件的人来说，这会导致组件难以阅读和理解。

如果能够将同⼀个逻辑关注点相关的代码配置在⼀起会更好，这正是 Composition API设计的动机。

### 1、setup

  setup 函数是⼀个新的组件选项。作为在组件内使⽤ Composition API 的⼊⼝点。
  setup 也可以返回⼀个函数，该函数会作为组件渲染函数。
  setup 参数： setup(props, {attrs, slots, emit})
  props是响应式的，但是不能解构，否则将失去响应能⼒

### 2、Reactivity API

* reactive ：对象响应式。接收⼀个普通对象然后返回该普通对象的响应式代理。等同于 vue 2.x 的 Vue.observable()
* ref ：单值响应式。接受⼀个参数值并返回⼀个响应式Ref 对象。Ref 对象拥有⼀个指向内部值的单⼀属性 value。
* toRefs 把⼀个响应式对象转换成普通对象，该普通对象的每个属性都是⼀个Ref。
* computed ：计算属性。传⼊⼀个 getter 函数，返回⼀个不可⼿动修改的 Ref 对象。
* watchEffect ：副作⽤侦听器。⽴即执⾏传⼊的⼀个函数，并收集响应式的依赖，当依赖变更时重新运⾏该函数。
* watch ：侦听器。watch 侦听特定数据源，并在回调函数中执⾏副作⽤。watcher 也可以使⽤数组来同时侦听多个源。

对⽐ watchEffect 和 watch：

* watch懒执⾏副作⽤；
* watch需明确哪些状态改变触发重新执⾏副作⽤；
* watch可访问侦听状态变化前后的值。

### 3、⽣命周期钩⼦

⽣命周期钩⼦可以通过 onXXX 形式导⼊并在setup内部注册。可以多次注册，按顺序执⾏。

与 2.x 版本⽣命周期相对应的组合式 API:

* beforeCreate -> 直接写到 setup()
* created -> 直接写到 setup()
* beforeMount -> onBeforeMount
* mounted -> onMounted
* beforeUpdate -> onBeforeUpdate
* updated -> onUpdated
* beforeDestroy -> onBeforeUnmount **变化**
* destroyed -> onUnmounted **变化**
* errorCaptured -> onErrorCaptured
* onRenderTracked **新增**
* onRenderTriggered **新增**

### 4、依赖注⼊

在setup中依赖注⼊使⽤ provide 和 inject。

### 5、模板引⽤

当使⽤组合式 API 时，reactive refs 和 template refs 的概念已经是统⼀的。为了获得对模板内元素或组件实例的引⽤，我们可以像往常⼀样在 setup() 中声明⼀个 ref 并返回它。

>具体代码详见 `05-composition.html`

## 可复用性

### 混入 Mixin

Mixin 提供了一种非常灵活的方式，来分发 Vue 组件中的可复用功能。一个 mixin 对象可以包含任意组件选项。当组件使用 mixin 对象时，所有 mixin 对象的选项将被“混合”进入该组件本身的选项。

>具体代码详见 `06-mixin.html`

### ⾃定义指令 directive

需要对普通 DOM 元素进⾏底层操作，会⽤到⾃定义指令。

一个指令定义对象可以提供如下几个钩子函数 (均为可选)：

* created：在绑定元素的 attribute 或事件监听器被应用之前调用。在指令需要附加须要在普通的 v-on 事件监听器前调用的事件监听器时，这很有用。
* beforeMount：当指令第一次绑定到元素并且在挂载父组件之前调用。
* mounted：在绑定元素的父组件被挂载后调用。
* beforeUpdate：在更新包含组件的 VNode 之前调用。
* updated：在包含组件的 VNode 及其子组件的 VNode 更新后调用。
* beforeUnmount：在卸载绑定元素的父组件之前调用
* unmounted：当指令与元素解除绑定且父组件已卸载时，只调用一次。

>具体代码详见 `07-directive.html`

### Teleport 传送

有时组件模板的⼀部分在逻辑上属于该组件，⽽从技术⻆度来看，最好将模板的这⼀部分移动到 DOM
中 Vue app 之外的其他位置，⽐如⼀个弹窗内容、消息通知等。

>具体代码详见 `08-teleport.html`

### 渲染函数 render

渲染函数给我们提供完全JS编程能⼒，可以解决更复杂的模板需求。

