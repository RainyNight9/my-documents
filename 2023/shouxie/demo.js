Function.prototype.myBind = function(thisArg) {
  if (typeof this !== 'function') {
    throw new Error('bind must be a function')
  }

  const args = Array.prototype.slice.call(arguments, 1)
  const self = this
  const nop =  function() {}
  const bound = function() {
    return self.apply(
      this instanceof nop ? this : thisArg,
      args.concat(Array.prototype.slice.call(arguments))
    )
  }

  if (this.prototype) {
    nop.prototype = this.prototype
  }

  bound.prototype = new nop()
  return bound
}

Function.prototype.myBind = function(ctx) {
  const self = this
  const args = Array.prototype.slice.call(arguments, 1)

  return function () {
    return self.apply(ctx, args.concat(Array.prototype.slice.call(arguments)))
  }
}

Function.prototype.MyCall = function(thisArg) {
  const args = [...arguments].slice(1)

  thisArg = thisArg || window
  thisArg.fn = this

  const result = thisArg.fn(...arg)
  delete thisArg.fn

  return result
}

Function.prototype.myCall = function(context) {
  // 判断调用对象
  if (typeof this !== 'function') {
      console.error('type error');
      return;
  }

  // 获取参数
  let args = [...arguments].slice(1),
      result = null;

  // 判断 context 是否传入，如果未传入则设置为 window
  context = context || window;

  // 将调用函数设为对象的方法
  context.fn = this;

   // 调用该方法
   result = context.fn(...args);
   
   // 删除该方法
   delete context.fn;
   
   return result;
}

Function.prototype.myApply = function(context, arr) {
  // 判断调用对象是否为函数
  if (typeof this !== 'function') {
      throw new TypeError('Not a function');
  }

  let result;

  // 判断 context 是否存在，如果未传入则为 window
  context = context || window;

  // 将调用函数设为对象的方法
  context.fn = this;

   // 调用方法
   if (!arr) {
       result = context.fn();
   } else {
       result = context.fn(...arr);
   }

   // 删除该方法
   delete context.fn;
   
   return result;
}

function myReduce(array, reducer, initialValue) {
  let accumulator = initialValue === undefined ? array[0] : initialValue;
  for(let i = (initialValue === undefined ? 1 : 0); i < array.length; i++) {
      accumulator = reducer(accumulator, array[i], i, array);
  }
  return accumulator;
}

function myNew(constructor, ...args) {
  // 创建一个新对象，并将其原型链接到构造函数的原型
  var obj = Object.create(constructor.prototype);
  
  // 绑定 this 并执行构造函数代码
  var result = constructor.apply(obj, args);
  
  // 如果构造函数返回了一个 "object" 或者 "function",就使用它，否则使用前面创建的新对象。
  return (result && (typeof result === 'object' || typeof result === 'function')) ? result : obj;
}

// 测试代码：
function Test(a, b) {
  this.a = a;
  this.b = b;
}

Test.prototype.sayHello = function() {
  return `Hello ${this.a} and ${this.b}`;
}

var testInstance = myNew(Test, 'world', '!'); 
console.log(testInstance.sayHello()); // 输出： Hello world and !

function create(obj) {
  function fun() {}
  fun.prototype = obj
  return new fun()
}

function myNew(constructor, ...args) {
  let obj = Object.create(constructor.prototype)

  let res = constructor.apply(obj, args)

  return (typeof res === 'object' || typeof res === 'function') ? res : obj
}

// 手写 myBind
Function.prototype.myBind = function(context) {
  const self = this
  const args = Array.prototype.slice.call(arguments, 1)

  return function() {
    return self.apply(context, args.concat(Array.prototype.slice.call(arguments)))
  }
}