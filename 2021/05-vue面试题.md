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

```js
// <div  ref="div"  style width="width" />
// <button @click="changeWidth" />
// width: 100px

changeWidth(){
    console.log(this.$refs.div.style.width) // 100px
    this.width = 200px
    this.$nextTick(()=>{
      console.log(this.$refs.div.style.width) // 100px
    })
}
mounted() {
  console.log(this.$refs.div.style.width) // 100px
  this.$nextTick(()=>{
    console.log(this.$refs.div.style.width) // 200px
  })
  this.width = '200px'
}
// 在点击事件里边第一次点击，是不会获取更新数据的，包括nextTick函数中，第二次点击可以得到上次的变化
// mounted 生命周期里边是 可以得到更细数据的
```

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

```js
data(){
 return {
   age:5,
   type: 'child'
 }
},
computed: {
 naive(){
   console.log('check is naive')
   if(this.age < 10 || this.type === 'child'){
     return 'yes'
   }
   return  'no'
 }
}
// 更新this.type会输出check is naive吗？ 不会输出！！！
// 看条件判断,重点在条件判断地方
```

我们在组件中使用computed计算属性时，当组件初始化的时候系统变会对为个定义的key都创建了对应的watcher, 并有一个特殊的参数lazy,然后调用了自己的getter方法,这样就收集了这个计算属性依赖的所有data,那么所依赖的data会收集这个订阅者同时会针对computed中的key添加属性描述符创建了独有的get方法，当调用计算属性的时候，这个get判断dirty是否为true，为真则表示要要重新计算，反之直接返回value。当依赖的data 变化的时候会触发数据的set方法调用update()通知更新，此时会把dirty设置成true，所以computed 就会重新计算这个值，从而达到动态计算的目的。

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

## 20、在Vue3.0优雅的使用v-model

在Vue2.0中如何实现双向数据绑定：

一种是v-model，另一种是.sync。

因为一个组件只能用于一个v-model，但是有的组件需要有多个可以双向响应的数据，所以就出现了.sync。

在Vue3.0中为了实现统一，实现了让一个组件可以拥有多个v-model，同时删除掉了.sync。

在vue3.0中，v-model后面需要跟一个modelValue，即要双向绑定的属性名，Vue3.0就是通过给不同的v-model指定不同的modelValue来实现多个v-model。

参考地址: https://v3.vuejs.org/guide/migration/v-model.html#overview

## 21、v-model 和 event.target.value

当input事件是由IME （即由输入法触发）构成触发的，会直接return，不再获取值。

v-model是value和oninput事件的结合，能够动态地对value进行改变，就是若是value被改变了，能够很快地反映到对应的组件当中，改变该组件的value

## 22、vue 怎么监听数组的？

在将数组处理成响应式数据后，如果使用数组原始方法改变数组时，数组值会发生变化，但是并不会触发数组的setter来通知所有依赖该数组的地方进行更新，为此，vue通过重写数组的某些方法来监听数组变化，重写后的方法中会手动触发通知该数组的所有依赖进行更新。

array.js中重写了数组的push、pop、shift、unshift、splice、sort、reverse七种方法，重写方法在实现时除了将数组方法名对应的原始方法调用一遍并将执行结果返回外，还通过执行ob.dep.notify()将当前数组的变更通知给其订阅者，这样当使用重写后方法改变数组后，数组订阅者会将这边变化更新到页面中。

重写完数组的上述7种方法外，我们还需要将这些重写的方法应用到数组上，因此在Observer构造函数中，可以看到在监听数据时会判断数据类型是否为数组。当为数组时，如果浏览器支持__proto__，则直接将当前数据的原型__proto__指向重写后的数组方法对象arrayMethods，如果浏览器不支持__proto__，则直接将arrayMethods上重写的方法直接定义到当前数据对象上；当数据类型为非数组时，继续递归执行数据的监听。

## 23、Vue router两种路由方式分别什么实现原理

    HashHistory window.addEventListener("hashchange", funcRef, false)
    HTML5History
        window.history.pushState(stateObject, title, URL)
        window.history.replaceState(stateObject, title, URL)
        popState
    transitionTo( )函数
        HashHistory.push() HashHistory.replace()
        HTML5History.pushState()和HTML5History.replaceState(）

## 24、vue生命周期 父子组件生命周期

    父beforeCreate->父created->父beforeMount->子beforeCreate->子created->子beforeMount->子mounted->父mounted
    父beforeUpdate->子beforeUpdate->子updated->父updated
    父beforeDestroy->子beforeDestroy->子destroyed->父destroyed
    父create->子created->子mounted->父mounted

## 25、Vue mixin 左右、原理、覆盖顺序

    Mixins：则是在引入组件之后与组件中的对象和方法进行合并，相当于扩展了父组件的对象与方法，可以理解为形成了一个新的组件。

## 26、vue的inject provide是怎么做的？

    1、mergeOptions函数
    2、normalizeInject(child, vm);
    3、vm.$options.inject = {"parentValue": {"from": "parentValue"}}
    4、实例化子组件时对inject的处理。在_init时会调用initInjections函数
    5、从resolveInject函数可以看到通过while循环，以及source = source.$parent 找到父组件中的_provided属性，拿到其值，**也就拿到父组件提供的provide了**
    6、调用了mergeOptions对父组件中的provide属性进行了处理
    7、vm.$options.provide 就是mergedInstanceDataFn函数。通过调用这个函数我们_provided就成为了{"parentValue":"here is parent data"}

## 27、vuex 为什么不是响应式的

    原来获取 vuex 中的值一定要用计算属性获取

## 28、v-show和v-if区别

    与v-if不同的是，无论v-show的值为true或false，元素都会存在于HTML代码中；display：none； 恢复默认
    而只有当v-if的值为true，元素才会存在于HTML代码中

## 29、Vue2 和 Vue3 有什么区别

对 Vue3 的了解 / Vue3 是怎么得更快的？

    * 新增了三个组件：Fragment 支持多个根节点、Suspense 可以在组件渲染之前的等待时间显示指定内容、Teleport 可以让子组件能够在视觉上跳出父组件(如父组件overflow:hidden)
    * 新增指令 v-memo，可以缓存 html 模板，比如 v-for 列表不会变化的就缓存，简单说就是用内存换时间
    * 支持 Tree-Shaking，会在打包时去除一些无用代码，没有用到的模块，使得代码打包体积更小
    * 新增 Composition API 可以更好的逻辑复用和代码组织，同一功能的代码不至于像以前一样太分散，虽然 Vue2 中可以用 minxin 来实现复用代码，但也存在问题，比如方法或属性名会冲突，代码来源也不清楚等
    * 用 Proxy 代替 Object.defineProperty 重构了响应式系统，可以监听到数组下标变化，及对象新增属性，因为监听的不是对象属性，而是对象本身，还可拦截 apply、has 等13种方法
    * 重构了虚拟 DOM，在编译时会将事件缓存、将 slot 编译为 lazy 函数、保存静态节点直接复用(静态提升)、以及添加静态标记、Diff 算法使用 最长递增子序列 优化了对比流程，使得虚拟 DOM 生成速度提升 200%
    * 支持在 <style></style> 里使用 v-bind，给 CSS 绑定 JS 变量(color: v-bind(str))
    * 删除了两个生命周期 beforeCreate、created，直接用 setup 代替了
    * 新增了开发环境的两个钩子函数，在组件更新时 onRenderTracked 会跟踪组件里所有变量和方法的变化、每次触发渲染时 onRenderTriggered 会返回发生变化的新旧值，可以让我们进行有针对性调试
    * 毕竟 Vue3 是用 TS 写的，所以对 TS 的支持度更好
    * Vue3 不兼容 IE11

## 30、说一下 Composition API，和 Options API 的区别？

Composition API 也叫组合式 API，它主要就是为了解决 Vue2 中 Options API 的问题。

一是在 Vue2 中只能固定用 data、computed、methods 等选项组织代码，在组件越来越复杂的时候，一个功能相关的属性和方法就会在文件上中下到处都有，很分散，变越来越难维护

二是 Vue2 中虽然可以用 minxin 来做逻辑的提取复用，但是 minxin 里的属性和方法名会和组件内部的命名冲突，还有当引入多个 minxin 的时候，我们使用的属性或方法是来于哪个 minxin 也不清楚

而 Composition API 刚刚就解决了这两个问题，可以让我们自由的组织代码，同一功能相关的全部放在一起，代码有更好的可读性更便于维护，单独提取出来也不会造成命名冲突，所以也有更好的可扩展性

## 31、说一下 setup

```js
// 方法
setup(props, context){ return { name:'沐华' } }

// 语法糖
<script setup> ... </script>
```

setup() 方法是在 beforeCreate() 生命周期函数之前执行的函数；

它接收两个参数 props 和 context。它里面不能使用 this，而是通过 context 对象来代替当前执行上下文绑定的对象，context 对象有四个属性：attrs、slots、emit、expose

里面通过 ref 和 rective 代替以前的 data 语法，return 出去的内容，可以在模板直接使用，包括变量和方法

而使用 setup 语法糖时，不用写 export default {}，子组件只需要 import 就直接使用，不需要像以前一样在 components 里注册，属性和方法也不用 return。

并且里面不需要用 async 就可以直接使用 await，因为这样默认会把组件的 setup 变为 async setup

用语法糖时，props、attrs、slots、emit、expose 的获取方式也不一样了

3.0~3.2版本变成了通过 import 引入的 API：defineProps、defineEmit、useContext(在3.2版本已废弃)，useContext 的属性 { emit, attrs, slots, expose }

3.2+版本不需要引入，而直接调用：defineProps、defineEmits、defineExpose、useSlots、useAttrs

## 32、watch 和 watchEffect 的区别

watch 作用是对传入的某个或多个值的变化进行监听；触发时会返回新值和老值；也就是说第一次不会执行，只有变化时才会重新执行

```js
const name = ref('沐华')
watch(name, (newValue, oldValue)=>{ ... }, {immediate:true, deep:true})

// 响应式对象
const boy = reactive({ age:18 })
watch(()=>boy.age, (newValue, oldValue)=>{ ... })

// 监听多个
watch( [name, ()=>boy.age], (newValue, oldValue)=>{ ... } )
```

watchEffect 是传入一个立即执行函数，所以默认第一次也会执行一次；不需要传入监听内容，会自动收集函数内的数据源作为依赖，在依赖变化的时候又会重新执行该函数，如果没有依赖就不会执行；而且不会返回变化前后的新值和老值

```js
watchEffect(onInvalidate =>{ ... })
```

共同点是 watch 和 watchEffect 会共享以下四种行为：

    * 停止监听：组件卸载时都会自动停止监听
    * 清除副作用：onInvalidate 会作为回调的第三个参数传入
    * 副作用刷新时机：响应式系统会缓存副作用函数，并异步刷新，避免同一个 tick 中多个状态改变导致的重复调用
    * 监听器调试：开发模式下可以用 onTrack 和 onTrigger 进行调试

## 33、Vue3 响应式原理和 Vue2 的区别

Vue2 数据响应式是通过 Object.defineProperty() 劫持各个属性 getter 和 setter，在数据变化时发布消息给订阅者，触发相应的监听回调，而这之间存在几个问题：

    * 初始化时需要遍历对象所有 key，如果对象层次较深，性能不好
    * 通知更新过程需要维护大量 dep 实例和 watcher 实例，额外占用内存较多
    * Object.defineProperty 无法监听到数组元素的变化，只能通过劫持重写数组方法
    * 动态新增，删除对象属性无法拦截，只能用特定 set/delete API 代替
    * 不支持 Map、Set 等数据结构

而在 Vue3 中为了解决这些问题，使用原生的 proxy 代替，支持监听对象和数组的变化，并且多达13种拦截方法，动态属性增删都可以拦截，新增数据结构全部支持，对象嵌套属性只代理第一层，运行时递归，用到才代理，也不需要维护特别多的依赖关系，性能取得很大进步

## 34、defineProperty 和 Proxy 的区别

为什么要用 Proxy 代替 defineProperty ？好在哪里？

    * Object.defineProperty 是 Es5 的方法，Proxy 是 Es6 的方法
    * defineProperty 不能监听到数组下标变化和对象新增属性，Proxy 可以
    * defineProperty 是劫持对象属性，Proxy 是代理整个对象
    * defineProperty 局限性大，只能针对单属性监听，所以在一开始就要全部递归监听。Proxy 对象嵌套属性运行时递归，用到才代理，也不需要维护特别多的依赖关系，性能提升很大，且首次渲染更快
    * defineProperty 会污染原对象，修改时是修改原对象，Proxy 是对原对象进行代理并会返回一个新的代理对象，修改的是代理对象
    * defineProperty 不兼容 IE8，Proxy 不兼容 IE11

## 35、Vue3 的生命周期

基本上就是在 Vue2 生命周期钩子函数名基础上加了 on；beforeDestory 和 destoryed 更名为 onBeforeUnmount 和 onUnmounted；然后删了两个钩子函数 beforeCreate 和 created；新增了两个开发环境用于调试的钩子

## Vue3 Diff算法和 Vue2 的区别

我们知道在数据变更触发页面重新渲染，会生成虚拟 DOM 并进行 patch 过程，这一过程在 Vue3 中的优化有如下

编译阶段的优化：

    * 事件缓存：将事件缓存(如: @click)，可以理解为变成静态的了
    * 静态提升：第一次创建静态节点时保存，后续直接复用
    * 添加静态标记：给节点添加静态标记，以优化 Diff 过程

由于编译阶段的优化，除了能更快的生成虚拟 DOM 以外，还使得 Diff 时可以跳过"永远不会变化的节点"，Diff 优化如下：

    * Vue2 是全量 Diff，Vue3 是静态标记 + 非全量 Diff
    * 使用最长递增子序列优化了对比流程

根据尤大公布的数据就是 Vue3 update 性能提升了 1.3~2 倍
