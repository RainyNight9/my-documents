# vue

## 1、v-if和v-for哪个优先级高

源码中找答案compiler/codegen/index.js

    1、v-for优先于v-if 被解析

    2、如果同时出现，每次渲染都会先执行循环在判断条件，无论如何，循环都不可避免，浪费了性能

    3、要避免出现这种情况，可以在外层嵌套 template，在这一层加v-if，然后内部进行v-for循环

    4、如果条件出现在循环内部，可通过计算属性提前过滤掉那些不需要显示的项

## 2、Vue组件data选项为什么必须是个函数而Vue的根实例则没有此限制

源码中找答案：src\core\instance\state.js - initData()

>函数每次执行都会返回全新data对象实例

    1、vue组件可能存在多个实例，如果使用对象形式定义data，则会导致它们共用一个data对象，那么状态变更将会影响所有组件实例，这是不合理的

    2、采用函数形式定义，在initData() 时会将其作为工厂函数返回全新data实例，有效规避多实例之间状态污染问题

    3、vue根实例创建过程中，则不存在该限制，也是因为根实例只有一个，不需要担心这种情况。

## 3、你知道vue中key的作用和工作原理吗？说说你对它的理解

源码中找答案：src\core\vdom\patch.js - updateChildren()

    1、key 的作用主要就是为了高效的更新DOM，其原理是vue在patch过程中通过key可以精准判断两个节点是否是同一个，从而避免频繁的更新相同元素，使得整个patch过程更加高效，减少DOM操作量，提高性能。

    2、如果不设置key，还可能在列表更新时引发一些隐藏bug

    3、vue中在使用相同标签名元素的过度切换时，也会使用到key属性，其目的也是为了让vue可以区分它们，否则vue 只会替换其内部属性而不会触发过度效果。

## 4、你怎么理解vue中的diff算法？

源码分析1：必要性，lifecycle.js - mountComponent()

组件中可能存在很多个data中的key使用

源码分析2：执行方式，patch.js - patchVnode()

patchVnode是diff发生的地方，整体策略：深度优先，同层比较

源码分析3：高效性，patch.js - updateChildren()

    1、diff算法是虚拟DOM技术的必然产物：通过新旧虚拟DOM做对比，将变化的地方更新在真实DOM上，另外，也需要diff高效的执行对比过程，从而降低时间复杂度为O(n)

    2、vue2中为了降低Watcher粒度，每个组件只有一个Watcher与之对应，只有引入diff才能精确找到发生变化的地方。

    3、vue中diff执行的时刻是组件实例执行更新函数时，它会比对上一次的渲染结果oldVnode和新渲染结果newVnode，此过程称之为patch

    4、diff过程整体遵循深度优先、同层比较的策略。两个节点之间比较会根据它们是否拥有字节点或者文本节点做不同操作。比较两组子节点是算法的重点，首先假设头尾节点可能相同做4次比对尝试，如果没有找到相同节点才按照通用方式遍历查找，查找结束再按情况处理剩下的节点，借助key通常可以非常精确的找到相同节点，因此整个patch过程非常高效。

## 5、谈一谈对vue组件化的理解

源码分析1：组件定义，src\core\global-api\assets.js

>vue-loader会编译template为render函数，最终导出的依然是组件配置对象。

源码分析2：组件化优点，lifecycle.js - mountComponent()

>组件、Watcher、渲染函数和更新函数之间的关系

源码分析3：组件化实现，构造函数，src\core\global-api\extend.js 实例化及挂载，src\core\vdom\patch.js - createElm()

    1、组件是独立和可复用的代码组织单元，组件系统是Vue核心特性之一，它使开发者使用小型、独立和通常可复用的组件构建大型应用。

    2、组件化开发能大幅度提高应用开发效率，测试性，复用性等。

    3、组件使用按分类有：页面组件、业务组件、通用组件。

    4、vue的组件是基于配置的，我们通常编写的组件是组件配置而非组件，框架后续会生成其构造函数，他们基于VueComponent，扩展于vue

    5、vue中常见的组件化技术有：属性prop，自定义事件，插槽等，它们主要用于组件通信、扩展等

    6、合理的划分组件，有助于提升应用性能

    7、组件应该是高内聚，低耦合的。

    8、遵循单向数据流的原则

## 6、谈一谈对vue的设计原则的理解

    1、渐进式JS框架

        * vue被设计为可以自底向上逐层应用。
        * vue的核心库只关注视图层，不仅易于上手，还便于与第三方库或既有项目整合。
        * 当与现代化工具链以及各种支持类库结合使用时，Vue也完全能够为复杂的单页应用提供驱动。

    2、易用性

        * vue提供数据响应式、声明式模版语法和基于配置的组件系统等核心特性
        * 使我们只关注应用的核心业务即可，只会写js，css，html就能轻松过编写vue应用

    3、灵活性

        * 渐进式框架最大的优点就是灵活性，如果应用足够小，我们可能仅需要vue核心特性即可完成功能
        * 随着应用不断扩大，才可能逐渐引入路由，状态管理，等工具和库，不管是应用体积还是学习难度都是一个逐渐增加的平和曲线

    4、高效性

        * 超快的虚拟DOM 和diff算法使我们的应用拥有极佳的性能表现
        * 追求高效的过程还在继续，vue3中引入proxy对数据响应式改进以及编译器中对于静态内容编译的改进都会让vue更加高效

## 7、谈谈你对MVC、MVP和MVVM的理解

    1、这三个都是框架模式，它们设计的目标都是解决Model和View的耦合问题

    2、MVC模式出现比较早，主要应用在后端，在前端领域的早期也有应用，如Backbone.js。它的优点是分层清晰，缺点是数据流混乱，灵活性带来的维护性问题

    3、MVP模式是MVC的进化形式，Presenter作为中间层负责MV通信，解决了两者耦合问题，但P层过于臃肿会导致维护问题

    4、MVVM模式在前端领域有广泛的应用，它不仅解决MV耦合问题，还同时解决了维护两者映射关系的大量繁杂代码和DOM操作代码，在提高开发效率、可读性同时还保持了优越的性能表现。

## 8、你了解哪些vue性能优化的方法

    1、路由懒加载

    2、keep-alive缓存页面

    3、v-show复用DOM

    4、v-for遍历避免同时使用v-if

    5、长列表性能优化

        * 纯数据，非响应式的可以 使用 object.freeze 冻结
        * 大数据长列表，可采用虚拟滚动，只渲染少部分内容 （vue-virtual-scroller、vue-virtual-scroll-list）

    6、事件的销毁

    7、图片的懒加载 （vue-lazyload）

    8、第三方插件按需引入

    9、无状态组件标记为函数组件 functional

    10、子组件分割

    11、变量本地化

    12、SSR （SEO、首屏渲染）

## 9、vue3新特性

    1、更快

        * 虚拟DOM重写（编译时提示减少运行时开销，使用更有效的代码创建虚拟节点。组件快速路径+单个调用+子节点类型检查。跳过不必要的条件分支。js引擎更容易优化）
        * 优化slots的生成（vue3中可以单独重新渲染父级和子级。确保实例正确的跟踪依赖关系。避免不必要的父子组件重新渲染）
        * 静态树提升（内存换时间，Vue3 的编译器将能够检测到什么是静态的，然后将其提升，从而降低了渲染成本。跳过修补整棵树，从而降低渲染成本。即使多次出现也能正常工作 ）
        * 静态属性提升 （Vue3 打补丁时将跳过这些属性不会改变的节点）
        * 基于Proxy的响应式系统 （组件实例初始化的速度提高100％ 。使用Proxy节省以前一半的内存开销，加快速度，但是存在低浏览器版本的不兼容。为了继续支持IE11，Vue3 将发布一个支持旧观察者机制和新 Proxy 版本的构建）

    2、更小

        * 通过摇树优化核心库体积

    3、更容易维护

        * TS+模块化 （它不仅会使用 TypeScript，而且许多包被解耦，更加模块化。）

    4、更加友好

        * 跨平台：编译器核心和运行时核心与平台无关

    5、更容易使用

        * 改进ts支持，编译器提供更好的类型检查和错误及警告
        * 更好的调试支持
        * 独立的响应式模块
        * Composition API

## 10、vuex使用及理解

    1、state （...mapState可获取，mutate）

    2、getter （getter理解为计算属性）

    3、mutation （更改vuex的state中唯一的方式，必须是同步函数，commit）

    4、action （dispatch、ajax）

        * action提交的mutation，不是直接修改状态 
        * action可以包含异步操作，而mutation不行 
        * action中的回调函数第一个参数是context，是一个与store实例具有相同属性的方法的对象 
        * action通过store.dispatch触发，mutation通过store.commit提交

    5、module （vuex允许我们将store分割成模块）

## 11、vue中组件之间的通信方式？

    1、父子组件通信
        * props
        * $emit/$on
        * $children/$parent
        * $attrs/$listeners
        * ref
    2、兄弟组件
        * $parent
        * $root
        * eventbus
        * vuex
    3、跨层级关系
        * eventbus
        * vuex
        * provide/inject

## 12、vue-router中如何保护指定路由的安全？

    1、全局的钩子函数
        
        * beforeEach(to，from，next) 路由改变前调用。常用验证用户权限。to ：即将要进入的目标路由对象。from：当前正要离开的路由对象。next：路由控制参数。next()：如果一切正常，则调用这个方法进入下一个钩子。next(false)：取消导航（即路由不发生改变）。next('/login')：当前导航被中断，然后进行一个新的导航。next(error)：如果一个Error实例，则导航会被终止且该错误会被传递给router.onError()
  
        * afterEach (to，from) 路由改变后的钩子。常用自动让页面返回最顶端。用法相似，少了next参数。

    2、路由配置中的导航钩子

        * beforeEnter (to，from，next) 

    3、组件内的钩子函数

        * beforeRouteEnter(to,from,next)。该组件的对应路由被comfirm前调用。 此时实例还没被创建，所以不能获取实例（this） 

        * beforeRouteUpdate(to,from,next)。当前路由改变，当该组件被复用时候调用。该函数内可以访问组件实例(this)。举例来说，对于一个带有动态参数的路径 /foo/:id，在 /foo/1 和 /foo/2 之间跳转的时候，由于会渲染同样的 Foo 组件，因此组件实例会被复用。而这个钩子就会在这个情况下被调用。 

        * beforeRouteLeave(to,from,next)。当导航离开组件的对应路由时调用。 该函数内可以访问获取组件实例（this）
  
    4、路由监测变化（使用watch 来对$route 监听）

        * 监听到路由对象发生变化，从而对路由变化做出响应 

## 13、你知道nextTick吗？它是干什么的？实现原理是什么？

    1、 vue用异步队列的方式来控制DOM更新和nextTick回调先后执行 

    2、 microtask因为其高优先级特性，能确保队列中的微任务在一次事件循环前被执行完毕 

    3、 因为兼容性问题，vue不得不做了microtask向macrotask的降级方案

在下次dom更新循环结束之后执行延迟回调，可用于获取更新后的dom状态

  新版本中默认是microtasks, v-on中会使用macrotasks

  macrotasks任务的实现:
    setImmediate / MessageChannel / setTimeout

## 14、谈一谈你对vue响应式原理的理解？

    1、object.defineProperty

    2、proxy(兼容性不太好)

observer类

```js
/* observer 类会附加到每一个被侦测的object上 
* 一旦被附加上，observer会被object的所有属性转换为getter/setter的形式 
* 当属性发生变化时候及时通知依赖 
*/
// Observer 实例 
export class Observer {
  constructor(value) {
    this.value = value
    if (!Array.isArray(value)) { // 判断是否是数组 
      this.walk(value) // 劫持对象 
    }
  }
  walk(obj) { 
    // 将会每一个属性转换为getter/setter 形式来侦测数据变化
    const keys = Object.keys(obj) 
    for (let i = 0; i < keys.length; i++) {
      defineReactive(obj, keys[i], obj[key[i]]) // 数据劫持方法 
    }
  }
}

function defineReactive(data, key, val) {
  // 递归属性 
  if (typeof val === 'object') {
    new Observer(val)
  }
  let dep = new Dep()
  Object.defineProperty(data, key, {
    enumerable: true,
    configurable: true,
    get: function () {
      dep.depend()
      return val
    },
    set: function (newVal) {
      if (val === newVal) {
        return
      }
      val = newVal
      dep.notify()
    }
  })
}
```

Dep 依赖收集

```js
export default class Dep {
  constructor() {
    this.subs = [] // 观察者集合 
  }
  // 添加观察者 
  addSub(sub) {
    this.subs.push(sub)
  }
  // 移除观察者 
  removeSub(sub) {
    remove(this.subs, sub)
  }
  depend() {
    // 核心，如果存在 ，则进行依赖收集操作     
    if (window.target) {
      this.addDep(window.target)
    }
  }
  notify() {
    const subs = this.subs.slice() // 避免污染原来的集合 
    // 如果不是异步执行，先进行排序，保证观察者执行顺序 
    if (process.env.NODE_ENV !== 'production' && !config.async) {
      subs.sort((a, b) => a.id - b.id)
    }
    for (let i = 0, l = subs.length; i < l; i++) {
      subs[i].update() // 发布执行 
    }
  }
}
function remove(arr, item) {
  if (arr.length) {
    const index = arr.indexOf(item)
    if (index > -1) {
      return arr.splice(index, 1)
    }
  }
}
```

watcher

```js
export default class Watcher {
  constructor(vm, expOrFn, cb) {
    // 组件实例对象  
    // 要观察的表达式，函数，或者字符串，只要能触发取值操作 
    // 被观察者发生变化后的回调 
    this.vm = vm // Watcher有一个 vm 属性，表明它是属于哪个组件的       
    // 执行this.getter()及时读取数据 
    this.getter = parsePath(expOrFn)
    this.cb = cb
    this.value = this.get()
  }
  get() {
    window.target = this
    let value = this.getter.call(this.vm, this.vm)
    window.target = undefined
    return value
  }
  update() {
    const oldValue = this.value
    this.value = this.get()
    this.cb.call(this.vm, this.value, oldValue)
  }
}
```

    * data通过Observer转换成了getter/setter的形式来追踪变化 
    * 当外界通过Watcher读取数据时，会触发getter从而将watcher添加到依赖中 
    * 当数据变化时，会触发setter从而向Dep中的依赖（watcher）发送通知 
    * watcher接收通知后，会向外界发送通知，变化通知到外界后可能会触发视图更新，也有可能触发用户的某个回调函数等 

## 15、vue为什么要求组件模版只能有一个根元素?

    1、 new Vue({el:'#app'}) 
    2、 单文件组件中，template下的元素div。其实就是"树"状数据结构中的"根"。 
    3、 diff算法要求的，源码中，patch.js里patchVnode()。

## 16、生命周期

**beforeCreate( 创建前 )**

    在实例初始化之后，数据观测和事件配置之前被调用，此时组件的选项对象还未创建，el 和 data 并未初始化，因此无法访问methods， data， computed等上的方法和数据。

**created ( 创建后 ）**

    实例已经创建完成之后被调用，在这一步，实例已完成以下配置：数据观测、属性和方法的运算，watch/event事件回调，完成了data 数据的初始化，el没有。 然而，挂载阶段还没有开始, $el属性目前不可见，这是一个常用的生命周期，因为你可以调用methods中的方法，改变data中的数据，并且修改可以通过vue的响应式绑定体现在页面上，，获取computed中的计算属性等等，通常我们可以在这里对实例进行预处理，也有一些童鞋喜欢在这里发ajax请求，值得注意的是，这个周期中是没有什么方法来对实例化过程进行拦截的，因此假如有某些数据必须获取才允许进入页面的话，并不适合在这个方法发请求，建议在组件路由钩子beforeRouteEnter中完成

**beforeMount**

    挂载开始之前被调用，相关的render函数首次被调用（虚拟DOM），实例已完成以下的配置： 编译模板，把data里面的数据和模板生成html，完成了el和data 初始化，注意此时还没有挂载html到页面上。

**mounted**

    挂载完成，也就是模板中的HTML渲染到HTML页面中，此时一般可以做一些ajax操作，mounted只会执行一次。

**beforeUpdate**

    在数据更新之前被调用，发生在虚拟DOM重新渲染和打补丁之前，可以在该钩子中进一步地更改状态，不会触发附加地重渲染过程

**updated（更新后）**

    在由于数据更改导致地虚拟DOM重新渲染和打补丁只会调用，调用时，组件DOM已经更新，所以可以执行依赖于DOM的操作，然后在大多是情况下，应该避免在此期间更改状态，因为这可能会导致更新无限循环，该钩子在服务器端渲染期间不被调用

**beforeDestroy（销毁前）**

    在实例销毁之前调用，实例仍然完全可用，

      这一步还可以用this来获取实例，
      一般在这一步做一些重置的操作，比如清除掉组件中的定时器 和 监听的dom事件

**destroyed（销毁后）**

    在实例销毁之后调用，调用后，所以的事件监听器会被移出，所有的子实例也会被销毁，该钩子在服务器端渲染期间不被调用

## 17、computed 和 watch的区别

计算属性computed:

    1. 支持缓存，只有依赖数据发生改变，才会重新进行计算
    2. 不支持异步，当computed内有异步操作时无效，无法监听数据的变化
    3. computed 属性值会默认走缓存，计算属性是基于它们的响应式依赖进行缓存的，也就是基于data中声明过或者父组件传递的props中的数据通过计算得到的值
    4. 如果一个属性是由其他属性计算而来的，这个属性依赖其他属性，是一个多对一或者一对一，一般用computed
    5. 如果computed属性属性值是函数，那么默认会走get方法；函数的返回值就是属性的属性值；在computed中的，属性都有一个get和一个set方法，当数据变化时，调用set方法。

侦听属性watch：

    1. 不支持缓存，数据变，直接会触发相应的操作；
    2. watch支持异步；
    3. 监听的函数接收两个参数，第一个参数是最新的值；第二个参数是输入之前的值；
    4. 当一个属性发生变化时，需要执行对应的操作；一对多；
    5. 监听数据必须是data中声明过或者父组件传递过来的props中的数据，当数据变化时，触发其他操作，函数有两个参数，
    　　immediate：组件加载立即触发回调函数执行，
    　　deep: 深度监听，为了发现对象内部值的变化，复杂类型的数据时使用，例如数组中的对象内容的改变，注意监听数组的变动不需要这么做。注意：deep无法监听到数组的变动和对象的新增，参考vue数组变异,只有以响应式的方式触发才会被监听到。
    6. 当需要在数据变化时执行异步或开销较大的操作时，这个方式是最有用的。这是和computed最大的区别，请勿滥用.

## 18、vue.$set vue.$delete

    实例创建后添加属性，并不会触发视图更新
    这时候需要使用 vue中 $set 方法,既可以新增属性，又可更新视图

    删除对象的 property。如果对象是响应式的，确保删除能触发更新视图。这个方法主要用于避开 Vue 不能检测到 property 被删除的限制，但是你应该很少会使用它。

## 19、自定义指令

```js
// 注册一个全局自定义指令 `v-focus`
Vue.directive('focus', {
  // 当被绑定的元素插入到 DOM 中时……
  inserted: function (el) {
    // 聚焦元素
    el.focus()
  }
})
```

## 20、v-model 和 event.target.value
