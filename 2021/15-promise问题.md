# promise

    * Promise 是异步编程的一种解决方案：从语法上讲，promise是一个对象，从它可以获取异步操作的消息；
    * 从本意上讲，它是承诺，承诺它过一段时间会给你一个结果。
    * promise有三种状态：pending(等待态)，fulfiled(成功态)，rejected(失败态)；
    * 状态一旦改变，就不会再变。
    * 创造promise实例后，它会立即执行。
    * promise可以解决异步的问题，本身不能说promise是异步的
  
## promise可以用来解决这些问题

    1、回调地狱，代码难以维护，常常第一个的函数的输出是第二个函数的输入这种现象
    2、promise可以支持多个并发的请求，获取并发请求中的数据

## 实现promise

```js
class MyPromise {
  constructor(executor) {
    this.initValue()
    this.initBind()
    // 执行时可能会发生异常
    try {
      executor(this.resolve, this.reject)
    } catch (e) {
      this.reject(e)
    }
  }
  initValue() {
    this.PromiseState = 'pending'
    this.PromiseResult = null
    this.onFulfilledCallbacks = []
    this.onRejectedCallbacks = []
  }
  initBind() {
    this.resolve = this.resolve.bind(this)
    this.reject = this.reject.bind(this)
  }
  resolve(value) {
    if (this.PromiseState !== 'pending') return
    this.PromiseState = 'fulfilled'
    this.PromiseResult = value
    while (this.onFulfilledCallbacks.length) {
      this.onFulfilledCallback.shift()(this.PromiseResult)
    }
  }
  reject(reason) {
    if (this.PromiseState !== 'pending') return
    this.PromiseState = 'rejected'
    this.PromiseResult = reason
    while (this.onRejectedCallbacks.length) {
      this.onRejectedCallbacks.shift()(this.PromiseResult)
    }
  }
  then(onFulfilled, onRejected) {
    onFulfilled = typeof onFulfilled === 'function' ? onFulfilled : val => val
    onRejected = typeof onRejected === 'function' ? onRejected : reason => { throw reason }
    let thenPromise = new MyPromise(() => {
      const resolvePromise = cb => {
        setTimeout(() => {
          try {
            const x = cb(this.PromiseResult)
            if (x === thenPromise) {
              throw new Error('不能返回自身...')
            }
            if (x instanceof MyPromise) {
              x.then(resolve, reject)
            } else {
              resolve(x)
            }
          } catch (e) {
            reject(e)
          }
        })
      }
      if (this.PromiseState === 'fulfilled') {
        // onFulfilled(this.PromiseState)
        resolvePromise(onFulfilled)
      } else if (this.PromiseState === 'rejected') {
        // onRejected(this.PromiseState)
        resolvePromise(onRejected)
      } else if (this.PromiseState === 'pending') {
        // this.onFulfilledCallbacks.push(onFulfilled.bind(this))
        // this.onRejectedCallbacks.push(onRejected.bind(this))
        this.onFulfilledCallbacks.push(resolvePromise.bind(this, onFulfilled))
        this.onRejectedCallbacks.push(resolvePromise.bind(this, onRejected))
      }
    })
    return thenPromise
  }
}
```

## Promise.all

谁跑的慢，以谁为准执行回调。all接收一个数组参数，里面的值最终都算返回Promise对象

场景：一些游戏类的素材比较多的应用，打开网页时，预先加载需要用到的各种资源如图片、flash以及各种静态文件。所有的都加载完后，我们再进行页面的初始化。

```js
Promise.all = function (promises) {
  //promises是一个promise的数组
  return new Promise(function (resolve, reject) {
    let arr = []; //arr是最终返回值的结果
    let i = 0; // 表示成功了多少次
    function processData(index, data) {
      arr[index] = data;
      if (++i === promises.length) {
        resolve(arr);
      }
    }
    for (let i = 0; i < promises.length; i++) {
      promises[i].then(function (data) {
        processData(i, data)
      }, reject)
    }
  })
}
```

## Promise.race

谁跑的快，以谁为准执行回调

场景：比如我们可以用race给某个异步请求设置超时时间，并且在超时后执行相应的操作，代码如下：

```js
// 请求某个图片资源
function requestImg() {
  var p = new Promise((resolve, reject) => {
    var img = new Image();
    img.onload = function () {
      resolve(img);
    }
    img.src = '图片的路径';
  });
  return p;
}
// 延时函数，用于给请求计时
function timeout() {
  var p = new Promise((resolve, reject) => {
    setTimeout(() => {
      reject('图片请求超时');
    }, 5000);
  });
  return p;
}
Promise.race([requestImg(), timeout()]).then((data) => {
  console.log(data);
}).catch((err) => {
  console.log(err);
});
```

```js
// 只要有一个promise成功了 就算成功。如果第一个失败了就失败了
Promise.race = function (promises) {
  return new Promise((resolve, reject) => {
    for (var i = 0; i < promises.length; i++) {
      promises[i].then(resolve, reject)
    }
  })
}
```

## 实现promise.retry

## 将一个同步callback包装成promise形式

## promise、async await、Generator的区别

## u.console('breakfast').setTimeout(3000).console('lunch').setTimeout(3000).console('dinner')，实现这个u

```js
class U {
  constructor() {
    this.promise = Promise.resolve();
  }
  console(val) {
    this.promise = this.promise.then(() => {
      console.log(val);
    });
    return this;
  }
  setTimeout(wait) {
    this.promise = this.promise.then(() => {
      return new Promise(resolve => {
        setTimeout(() => {
          resolve()
        }, wait);
      });
    })
    return this;
  }
}
const u = new U()
u.console('breakfast').setTimeout(3000).console('lunch').setTimeout(3000).console('dinner')
```

## 红灯三秒亮一次，绿灯一秒亮一次，黄灯2秒亮一次；如何让三个灯不断交替重复亮灯？（用Promise实现）

```js
function redToYellowToGreen() {
  function light(color) {
    l.style.background = color
    console.log(color)
  }

  function lightDelay(color, delay) {
    return new Promise((resolve) => {
      let timer = setTimeout(() => {
        light(color)
        resolve(timer)
      }, delay)
    })
  }

  async function oneCycle() {
    const timer1 = await lightDelay('red', 3000)
    const timer2 = await lightDelay('yellow', 2000)
    const timer3 = await lightDelay('green', 1000)
    clearTimeout(timer1)
    clearTimeout(timer2)
    clearTimeout(timer3)
  }

  setInterval(() => {
    oneCycle()
  }, 6000)
}

redToYellowToGreen()
```

## 6、promise 串行

```js
function serialPromises(arr=[]) {
  //promise的结果数组
  const result = [];
  const arrLength = arr.length;
  return new Promise((resolve, reject) => {
    let index = 1;
    //then的回调函数，通过该函数实现promise依次调用
    function resolvePromise(v) {
      result.push(v);
      //不是最后一个
      if (index + 1 < arrLength) {
        //调用index下标的函数生成下一个promise
        arr[index++]().then(resolvePromise);
      } else {
        //最后一个promise完成后，resolve返回的promise
        arr[index]().then((v) => {
            result.push(v);
            resolve(result);
          }).catch((err) => {
            reject(err);
          });
      }
    }
    if (arrLength === 0) {
      resolve(result)
    } else {
      //触发第一个promise
      arr[0]().then(resolvePromise);
    }
  });
}

function promiseCreator(time){
  return new Promise((resolve, reject) => {
    setTimeout(()=>{
      resolve(time)
    }, time*1000)
  })
}
const  arr = [
  promiseCreator.bind(null, 1),
  promiseCreator.bind(null, 3),
  promiseCreator.bind(null, 5),
  promiseCreator.bind(null, 4),
  promiseCreator.bind(null, 2),
];
serialPromises(arr).then(console.log).catch(console.error); //大概15秒后打印出 [1,3,5,4,2]
```

## 实现不使用async await,实现函数 createTask 延迟一秒输出1,然后2延迟3秒输出3,然后4

```js
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const log = console.log
createTask([
    ()=>delay(1000).then(()=>log(1)),
    ()=>log(2),
    ()=>delay(3000).then(()=>log(3)),
    ()=>log(4),
])
```

## 18、异步调度器

```js
class Scheduler {
  constructor(maxNum) {
    this.taskList = [];
    this.count = 0;
    this.maxNum = maxNum;
  }
  async add(promiseCreator) {
    if (this.count >= this.maxNum) {
      await new Promise((resolve) => {
        this.taskList.push(resolve)
      })
    }
    this.count ++;
    const result = await promiseCreator();
    this.count --;
    if (this.taskList.length > 0) {
      this.taskList.shift()();
    }
    return result;
  }
}
const timeout = (time) => new Promise(resolve => {
  setTimeout(resolve, time)
})
const scheduler = new Scheduler(2);
const addTask = (time, val) => {
  scheduler.add(() => {
    return timeout(time).then(() => {
      console.log(val)
    })
  })
}
addTask(1000, '1');
addTask(500, '2');
addTask(300, '3');
addTask(400, '4');
```
