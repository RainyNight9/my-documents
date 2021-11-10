# promise

    * Promise 是异步编程的一种解决方案：从语法上讲，promise是一个对象，从它可以获取异步操作的消息；
    * 从本意上讲，它是承诺，承诺它过一段时间会给你一个结果。
    * promise有三种状态：pending(等待态)，fulfiled(成功态)，rejected(失败态)；
    * 状态一旦改变，就不会再变。
    * 创造promise实例后，它会立即执行。
    * promise可以解决异步的问题，本身不能说promise是异步的

    1、Promise 是一个类，在执行这个类的时候会传入一个执行器，这个执行器会立即执行
    2、Promise 会有三种状态
        Pending 等待
        Fulfilled 完成
        Rejected 失败
    3、状态只能由 Pending --> Fulfilled 或者 Pending --> Rejected，且一但发生改变便不可二次修改；
    4、Promise 中使用 resolve 和 reject 两个函数来更改状态；
    5、then 方法内部做但事情就是状态判断
        如果状态是成功，调用成功回调函数
        如果状态是失败，调用失败回调函数

## event loop它的执行顺序

    1、一开始整个脚本作为一个宏任务执行
    2、执行过程中同步代码直接执行，宏任务进入宏任务队列，微任务进入微任务队列
    3、当前宏任务执行完出队，检查微任务列表，有则依次执行，直到全部执行完
    4、执行浏览器UI线程的渲染工作
    5、检查是否有Web Worker任务，有则执行
    6、执行完本轮的宏任务，回到2，依此循环，直到宏任务和微任务队列都为空

    微任务包括：MutationObserver、Promise.then()或catch()、Promise为基础开发的其它技术，比如fetch API、V8的垃圾回收过程、Node独有的process.nextTick。
    宏任务包括：script 、setTimeout、setInterval 、setImmediate 、I/O 、UI rendering。

>注意⚠️：在所有任务开始的时候，由于宏任务中包括了script，所以浏览器会先执行一个宏任务，在这个过程中你看到的延迟任务(例如setTimeout)将被放到下一轮宏任务中来执行。

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
  // resolve和reject为什么要用箭头函数？
  // 如果直接调用的话，普通函数this指向的是window或者undefined
  // 用箭头函数就可以让this指向当前实例对象
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
    // 如果不传，就使用默认函数
    onFulfilled = typeof onFulfilled === 'function' ? onFulfilled : val => val
    onRejected = typeof onRejected === 'function' ? onRejected : reason => { throw reason }
    // 为了链式调用这里直接创建一个 MyPromise，并在后面 return 出去
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
  // promises是一个promise的数组
  return new Promise(function (resolve, reject) {
    let arr = []; // arr是最终返回值的结果
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

function createTask(promiseArray) {
  promiseArray.reduce((promiseTotal, promiseItem) => {
    return promiseTotal.then(() => {
      return new Promise(resolve => {
        resolve(promiseItem())
      })
    })
  }, Promise.resolve())
}
```

## 使用Promise实现每隔1秒输出1,2,3

```js
const arr = [1, 2, 3]
arr.reduce((p, x) => {
  return p.then(() => {
    return new Promise(r => {
      setTimeout(() => r(console.log(x)), 1000)
    })
  })
}, Promise.resolve())

// 或者
const arr = [1, 2, 3]
arr.reduce((p, x) => p.then(() => new Promise(r => setTimeout(() => r(console.log(x)), 1000))), Promise.resolve())

const arr = [1, 2, 3];
const result = arr.reduce((p, x) => p.then(new Promise(r => setTimeout(() => r(console.log(x)), 1000))), Promise.resolve());
```

## 实现mergePromise函数

```js
const time = (timer) => {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve()
    }, timer)
  })
}
const ajax1 = () => time(2000).then(() => {
  console.log(1);
  return 1
})
const ajax2 = () => time(1000).then(() => {
  console.log(2);
  return 2
})
const ajax3 = () => time(1000).then(() => {
  console.log(3);
  return 3
})

function mergePromise () {
  // 在这里写代码
}

mergePromise([ajax1, ajax2, ajax3]).then(data => {
  console.log("done");
  console.log(data); // data 为 [1, 2, 3]
});

// 要求分别输出
// 1
// 2
// 3
// done
// [1, 2, 3]

function mergePromise (arr) {
  // 在这里写代码
  const data = []
  let promise = Promise.resolve()
  arr.forEach(item => {
    promise = promise.then(item).then(res => {
      data.push(res)
      return data
    })
  }) 
  return promise
}
```

## 封装一个异步加载图片的方法

```js
function loadImg(url) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = function () {
      console.log("一张图片加载完成");
      resolve(img);
    };
    img.onerror = function () {
      reject(new Error('Could not load image at' + url));
    };
    img.src = url;
  })
}
```

## 限制异步操作的并发个数（3个）并尽可能快的完成全部

```js
var urls = [
  "https://hexo-blog-1256114407.cos.ap-shenzhen-fsi.myqcloud.com/AboutMe-painting1.png",
  "https://hexo-blog-1256114407.cos.ap-shenzhen-fsi.myqcloud.com/AboutMe-painting2.png",
  "https://hexo-blog-1256114407.cos.ap-shenzhen-fsi.myqcloud.com/AboutMe-painting3.png",
  "https://hexo-blog-1256114407.cos.ap-shenzhen-fsi.myqcloud.com/AboutMe-painting4.png",
  "https://hexo-blog-1256114407.cos.ap-shenzhen-fsi.myqcloud.com/AboutMe-painting5.png",
  "https://hexo-blog-1256114407.cos.ap-shenzhen-fsi.myqcloud.com/bpmn6.png",
  "https://hexo-blog-1256114407.cos.ap-shenzhen-fsi.myqcloud.com/bpmn7.png",
  "https://hexo-blog-1256114407.cos.ap-shenzhen-fsi.myqcloud.com/bpmn8.png",
];
function loadImg(url) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = function () {
      console.log("一张图片加载完成");
      resolve(img);
    };
    img.onerror = function () {
      reject(new Error('Could not load image at' + url));
    };
    img.src = url;
  });
}

function limitLoad(urls, handler, limit) {
  let sequence = [].concat(urls); // 复制urls
  // 这一步是为了初始化 promises 这个"容器"
  let promises = sequence.splice(0, limit).map((url, index) => {
    return handler(url).then(() => {
      // 返回下标是为了知道数组中是哪一项最先完成
      console.log(`第${index}张图片加载完成`);
      return index;
    });
  });
  
  // 注意这里要将整个变量过程返回，这样得到的就是一个Promise，可以在外面链式调用
  return sequence
    .reduce((pCollect, url) => {
      return pCollect
        .then(() => {
          return Promise.race(promises); // 返回已经完成的下标
        })
        .then(fastestIndex => { // 获取到已经完成的下标
          // 将"容器"内已经完成的那一项替换
          promises[fastestIndex] = handler(url).then(
            () => {
              return fastestIndex; // 要继续将这个下标返回，以便下一次变量
            }
          );
        })
        .catch(err => {
          console.error(err);
        });
    }, Promise.resolve()) // 初始化传入
    .then(() => { // 最后三个用.all来调用
      return Promise.all(promises);
    });
}

limitLoad(urls, loadImg, 8)
  .then(res => {
    console.log("图片全部加载完毕");
    console.log(res);
  })
  .catch(err => {
    console.error(err);
  });
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

## promise执行过程

```js
Promise.resolve().then(() => {
  console.log(0);
  return Promise.resolve(4);
}).then((res) => {
  console.log(res)
})

Promise.resolve().then(() => {
  console.log(1);
}).then(() => {
  console.log(2);
}).then(() => {
  console.log(3);
}).then(() => {
  console.log(5);
}).then(() =>{
  console.log(6);
})
// 0、1、2、3、4、5、6
```

Js引擎为了让microtask尽快的输出，做了一些优化，连续的多个then(3个)如果没有reject或者resolve会交替执行then而不至于让一个堵太久完成用户无响应，不单单v8这样其他引擎也是这样，因为其实promuse内部状态已经结束了。这块在v8源码里有完整的体现

总结：
    1、Promise的状态一经改变就不能再改变。
    2、then和.catch都会返回一个新的Promise。
    3、catch不管被连接到哪里，都能捕获上层未捕捉过的错误。
    4、在Promise中，返回任意一个非 promise 的值都会被包裹成 promise 对象，例如return 2会被包装为return Promise.resolve(2)。
    5、Promise的 .then 或者 .catch 可以被调用多次, 但如果Promise内部的状态一经改变，并且有了一个值，那么后续每次调用.then或者.catch的时候都会直接拿到该值。
    6、then 或者 .catch 中 return 一个 error 对象并不会抛出错误，所以不会被后续的 .catch 捕获。
    7、then 或 .catch 返回的值不能是 promise 本身，否则会造成死循环。
    8、then 或者 .catch 的参数期望是函数，传入非函数则会发生值透传。
    9、then方法是能接收两个参数的，第一个是处理成功的函数，第二个是处理失败的函数，再某些时候你可以认为catch是.then第二个参数的简便写法。
    10、finally方法也是返回一个Promise，他在Promise结束的时候，无论结果为resolved还是rejected，都会执行里面的回调函数。

```js
const promise = new Promise((resolve, reject) => {
  console.log(1);
  resolve('success')
  console.log(2);
});
promise.then(() => {
  console.log(3);
});
console.log(4);
// 1 2 4 3
```

```js
const promise = new Promise((resolve, reject) => {
  console.log(1);
  console.log(2);
});
promise.then(() => {
  console.log(3);
});
console.log(4);
// 1 2 4
```

```js
Promise.resolve().then(() => {
  console.log('promise1');
  const timer2 = setTimeout(() => {
    console.log('timer2')
  }, 0)
});
const timer1 = setTimeout(() => {
  console.log('timer1')
  Promise.resolve().then(() => {
    console.log('promise2')
  })
}, 0)
console.log('start');
// 'start'
// 'promise1'
// 'timer1'
// 'promise2'
// 'timer2'
```

```js
const promise = new Promise((resolve, reject) => {
  reject("error");
  resolve("success2");
});
promise
.then(res => {
    console.log("then1: ", res);
  }).then(res => {
    console.log("then2: ", res);
  }).catch(err => {
    console.log("catch: ", err);
  }).then(res => {
    console.log("then3: ", res);
  })
// "catch: " "error"
// "then3: " undefined
// catch不管被连接到哪里，都能捕获上层未捕捉过的错误。
// 至于then3也会被执行，那是因为catch()也会返回一个Promise，且由于这个Promise没有返回值，所以打印出来的是undefined。
```

```js
Promise.resolve(1)
  .then(2)
  .then(Promise.resolve(3))
  .then(console.log)
// 1
// 第一个then和第二个then中传入的都不是函数，一个是数字类型，一个是对象类型，因此发生了透传，将resolve(1) 的值直接传到最后一个then里。
```

```js
Promise.resolve('1')
  .then(res => {
    console.log(res)
  })
  .finally(() => {
    console.log('finally')
  })
Promise.resolve('2')
  .finally(() => {
    console.log('finally2')
  	return '我是finally2返回的值'
  })
  .then(res => {
    console.log('finally2后面的then函数', res)
  })
// '1'
// 'finally2'
// 'finally'
// 'finally2后面的then函数' '2'
```

```js
Promise.resolve('1')
  .finally(() => {
    console.log('finally1')
    throw new Error('我是finally中抛出的异常')
  })
  .then(res => {
    console.log('finally后面的then函数', res)
  })
  .catch(err => {
    console.log('捕获错误', err)
  })
// 'finally1'
// '捕获错误' Error: 我是finally中抛出的异常
```

```js
function promise1 () {
  let p = new Promise((resolve) => {
    console.log('promise1');
    resolve('1')
  })
  return p;
}
function promise2 () {
  return new Promise((resolve, reject) => {
    reject('error')
  })
}
promise1()
  .then(res => console.log(res))
  .catch(err => console.log(err))
  .finally(() => console.log('finally1'))

promise2()
  .then(res => console.log(res))
  .catch(err => console.log(err))
  .finally(() => console.log('finally2'))
// 'promise1'
// '1'
// 'error'
// 'finally1'
// 'finally2'
```

```js
function runAsync (x) {
  const p = new Promise(r => setTimeout(() => r(x, console.log(x)), 1000))
  return p
}
function runReject (x) {
  const p = new Promise((res, rej) => setTimeout(() => rej(`Error: ${x}`, console.log(x)), 1000 * x))
  return p
}
Promise.all([runAsync(1), runReject(4), runAsync(3), runReject(2)])
  .then(res => console.log(res))
  .catch(err => console.log(err))
// // 1s后输出
// 1
// 3
// // 2s后输出
// 2
// Error: 2
// // 4s后输出
// 4
// .catch是会捕获最先的那个异常，在这道题目中最先的异常就是runReject(2)的结果。
// 另外，如果一组异步操作中有一个异常都不会进入.then()的第一个回调函数参数中。
```

```js
async function async1 () {
  console.log('async1 start');
  await new Promise(resolve => {
    console.log('promise1')
  })
  console.log('async1 success');
  return 'async1 end'
}
console.log('srcipt start')
async1().then(res => console.log(res))
console.log('srcipt end')
// 'script start'
// 'async1 start'
// 'promise1'
// 'script end'
// 在async1中await后面的Promise是没有返回值的，也就是它的状态始终是pending状态，因此相当于一直在await，await，await却始终没有响应...
// 所以在await之后的内容是不会执行的，也包括async1后面的 .then。
```

```js
async function async1() {
  console.log("async1 start");
  await async2();
  console.log("async1 end");
}

async function async2() {
  console.log("async2");
}

console.log("script start");

setTimeout(function() {
  console.log("setTimeout");
}, 0);

async1();

new Promise(function(resolve) {
  console.log("promise1");
  resolve();
}).then(function() {
  console.log("promise2");
});
console.log('script end')
// 'script start'
// 'async1 start'
// 'async2'
// 'promise1'
// 'script end'
// 'async1 end'
// 'promise2'
// 'setTimeout'
```

```js
async function async1 () {
  await async2();
  console.log('async1');
  return 'async1 success'
}
async function async2 () {
  return new Promise((resolve, reject) => {
    console.log('async2')
    reject('error')
  })
}
async1().then(res => console.log(res))
// async2
// 如果在async函数中抛出了错误，则终止错误结果，不会继续向下执行。
```
