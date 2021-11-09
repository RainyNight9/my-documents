# this

## 1、默认绑定

```js
function sayHi(){
  console.log('Hello,', this.name);
}
var name = 'YvetteLau';
sayHi();
// node  Hello, undefined 因为node中name并不是挂在全局对象上的。
// 浏览器  Hello, YvetteLau
```

## 2、隐式绑定

```js
function sayHi() {
  console.log('Hello,', this.name);
}
var person = {
  name: 'YvetteLau',
  sayHi: sayHi
}
var name = 'Wiliam';
person.sayHi();
// Hello, YvetteLau
```

```js
function sayHi(){
    console.log('Hello,', this.name);
}
var person2 = {
    name: 'Christina',
    sayHi: sayHi
}
var person1 = {
    name: 'YvetteLau',
    friend: person2
}
person1.friend.sayHi();
// Hello, Christina
// 不管有多少层，在判断this的时候，我们只关注最后一层，即此处的friend
```

```js
function sayHi(){
    console.log('Hello,', this.name);
}
var person = {
    name: 'YvetteLau',
    sayHi: sayHi
}
var name = 'Wiliam';
var Hi = person.sayHi;
Hi();
// Hello, Wiliam
// Hi直接指向了sayHi的引用，在调用的时候，跟person没有半毛钱的关系，
// 针对此类问题，只需牢牢记住这个格式:XXX.fn();fn()前如果什么都没有，那么肯定不是隐式绑定。
```

```js
function sayHi(){
    console.log('Hello,', this.name);
}
var person1 = {
    name: 'YvetteLau',
    sayHi: function(){
        setTimeout(function(){
            console.log('Hello,',this.name);
        })
    }
}
var person2 = {
    name: 'Christina',
    sayHi: sayHi
}
var name='Wiliam';
person1.sayHi();
setTimeout(person2.sayHi,100);
setTimeout(function(){
    person2.sayHi();
},200);
// Hello, Wiliam
// Hello, Wiliam
// Hello, Christina
// 第一条输出很容易理解，setTimeout的回调函数中，this使用的是默认绑定，非严格模式下，执行的是全局对象
// 第二条其实这里我们可以这样理解: setTimeout(fn,delay){ fn(); },相当于是将person2.sayHi赋值给了一个变量，最后执行了变量，这个时候，sayHi中的this显然和person2就没有关系了。
// 第三条虽然也是在setTimeout的回调中，但是我们可以看出，这是执行的是person2.sayHi()使用的是隐式绑定，因此这是this指向的是person2，跟当前的作用域没有任何关系。
```

## 3、显式绑定

```js
function sayHi(){
    console.log('Hello,', this.name);
}
var person = {
    name: 'YvetteLau',
    sayHi: sayHi
}
var name = 'Wiliam';
var Hi = person.sayHi;
Hi.call(person); // Hi.apply(person)
// Hello, YvetteLau
```

```js
function sayHi(){
    console.log('Hello,', this.name);
}
var person = {
    name: 'YvetteLau',
    sayHi: sayHi
}
var name = 'Wiliam';
var Hi = function(fn) {
    fn();
}
Hi.call(person, person.sayHi); 
// Hello, Wiliam
// Hi.call(person, person.sayHi)的确是将this绑定到Hi中的this了。
// 但是在执行fn的时候，相当于直接调用了sayHi方法
// 记住: person.sayHi已经被赋值给fn了，隐式绑定也丢了，没有指定this的值，对应的是默认绑定。
```

```js
function sayHi(){
    console.log('Hello,', this.name);
}
var person = {
    name: 'YvetteLau',
    sayHi: sayHi
}
var name = 'Wiliam';
var Hi = function(fn) {
    fn.call(this);
}
Hi.call(person, person.sayHi);
// Hello, YvetteLau
```

## 4、new 绑定

### 使用new来调用函数，会自动执行下面的操作

  1、创建一个空对象，构造函数中的this指向这个空对象
  2、这个新对象被执行 [[原型]] 连接
  3、执行构造函数方法，属性和方法被添加到this引用的对象中
  4、如果构造函数中没有返回其它对象，那么返回this，即创建的这个的新对象，否则，返回构造函数中返回的对象。

```js
function _new() {
    let target = {}; // 创建的新对象
    // 第一个参数是构造函数
    let [constructor, ...args] = [...arguments];
    // 执行[[原型]]连接;target 是 constructor 的实例
    target.__proto__ = constructor.prototype;
    // 执行构造函数，将属性或方法添加到创建的空对象上
    let result = constructor.apply(target, args);
    if (result && (typeof (result) == "object" || typeof (result) == "function")) {
        // 如果构造函数执行的结构返回的是一个对象，那么返回这个对象
        return result;
    }
    // 如果构造函数返回的不是一个对象，返回创建的新对象
    return target;
}
```

```js
function sayHi(name){
    this.name = name;
}
var Hi = new sayHi('Yevtte');
console.log('Hello,', Hi.name);
// Hello, Yevtte
```

## 绑定优先级

>这四种绑定的优先级为: new绑定 > 显式绑定 > 隐式绑定 > 默认绑定

## 绑定例外

如果我们将null或者是undefined作为this的绑定对象传入call、apply或者是bind,这些值在调用时会被忽略，实际应用的是默认绑定规则。

```js
var foo = {
    name: 'Selina'
}
var name = 'Chirs';
function bar() {
    console.log(this.name);
}
bar.call(null); //Chirs
// Chirs
```

## 箭头函数

箭头函数没有自己的this，它的this继承于外层代码库中的this。

箭头函数在使用时，需要注意以下几点:

  （1）函数体内的this对象，继承的是外层代码块的this。
  （2）不可以当作构造函数，也就是说，不可以使用new命令，否则会抛出一个错误。
  （3）不可以使用arguments对象，该对象在函数体内不存在。如果要用，可以用 rest 参数代替。
  （4）不可以使用yield命令，因此箭头函数不能用作 Generator 函数。
  （5）箭头函数没有自己的this，所以不能用call()、apply()、bind()这些方法去改变this的指向.

```js
var obj = {
    hi: function(){
        console.log(this);
        return ()=>{
            console.log(this);
        }
    },
    sayHi: function(){
        return function() {
            console.log(this);
            return ()=>{
                console.log(this);
            }
        }
    },
    say: ()=>{
        console.log(this);
    }
}
let hi = obj.hi();  // 输出obj对象
hi();               // 输出obj对象
let sayHi = obj.sayHi();
let fun1 = sayHi(); // 输出window
fun1();             // 输出window
obj.say();          // 输出window
// 1、obj.hi(); 对应了this的隐式绑定规则，this绑定在obj上，所以输出obj
// 2、hi(); 这一步执行的就是箭头函数，箭头函数继承上一个代码库的this，刚刚我们得出上一层的this是obj，显然这里的this就是obj.
// 3、执行sayHi();这一步也很好理解，我们前面说过这种隐式绑定丢失的情况，这个时候this执行的是默认绑定，this指向的是全局对象window.
// 4、fun1(); 这一步执行的是箭头函数，按照箭头函数的this是继承于外层代码库的this就很好理解了。外层代码库我们刚刚分析了，this指向的是window，因此这儿的输出结果是window.
// 5、obj.say(); 执行的是箭头函数，当前的代码块obj中是不存在this的，只能往上找，就找到了全局的this，指向的是window.
```

```js
var obj = {
    hi: function(){
        console.log(this);
        return ()=>{
            console.log(this);
        }
    },
    sayHi: function(){
        return function() {
            console.log(this);
            return ()=>{
                console.log(this);
            }
        }
    },
    say: ()=>{
        console.log(this);
    }
}
let sayHi = obj.sayHi();
let fun1 = sayHi();  // 输出window
fun1();              // 输出window

let fun2 = sayHi.bind(obj)(); // 输出obj
fun2();                       // 输出obj
```

## 如何准确判断this指向的是什么

  1、函数是否在new中调用(new绑定)，如果是，那么this绑定的是新创建的对象。
  2、函数是否通过call,apply调用，或者使用了bind(即硬绑定)，如果是，那么this绑定的就是指定的对象。
  3、函数是否在某个上下文对象中调用(隐式绑定)，如果是的话，this绑定的是那个上下文对象。一般是obj.foo()
  4、如果以上都不是，那么使用默认绑定。如果在严格模式下，则绑定到undefined，否则绑定到全局对象。
  5、如果把null或者undefined作为this的绑定对象传入call、apply或者bind，这些值在调用时会被忽略，实际应用的是默认绑定规则。
  6、如果是箭头函数，箭头函数的this继承的是外层代码块的this。

## 执行过程解析

```js
var number = 5;
var obj = {
    number: 3,
    fn: (function () {
        var number;
        this.number *= 2; // 10
        number = number * 2; // NaN
        number = 3; // 3
        // number=3 this.number=10
        return function () {
            var num = this.number; // 10 3
            this.number *= 2; // 20 6
            console.log(num); // 10 3
            number *= 3; // 9 27
            console.log(number); // 9 27
        }
    })()
}
var myFun = obj.fn;
myFun.call(null); // 10 9
obj.fn(); // 3 27
console.log(window.number); // 20
```
