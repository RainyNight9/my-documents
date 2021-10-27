// 迭代器是新的数据结构：next
/* function createIterator(items) {
    let i = 0;
    return {
        next() {
            let done = (i >= items.length);
            let value = !done ? items[i++] : undefined;
            return {
                done,
                value
            };
        }
    };
} */

/* let arr = [10, 20, 30];
let it = createIterator(arr); //arr[Symbol.iterator](arr);
console.log(it.next()); //{value: 10, done: false}
console.log(it.next()); //{value: 20, done: false}
console.log(it.next()); //{value: 30, done: false}
console.log(it.next()); //{value: undefined, done: true}
console.log(it.next()); //{value: undefined, done: true} */

/* // 生成器GeneratorFunction
function* gen() {
    yield 1;
    yield 2;
    yield 3;
}
// 基于生成器函数执行的返回结果就是一个迭代器
let g = gen();
console.log(g.next()); //{value: 1, done: false}
console.log(g.next()); //{value: 2, done: false}
console.log(g.next()); //{value: 3, done: false}
console.log(g.next()); //{value: undefiend, done: true} */

// 管理异步编程：尤其是数据请求的异步任务（防止回调地域）
function API(num) {
    return new Promise(resolve => {
        setTimeout(() => {
            resolve(num);
        }, 1000);
    });
}
/* 
API(10).then(data => {
    return API(data + 10);
}).then(data => {
    console.log(data);
}); */

/* async function func() {
    let data = await API(10);
    data = await API(data + 10);
    console.log(data);
}
func(); */

// async/await底层实现的机制就是基于GeneratorFunction实现的
// 传递给我一个Generator函数，我可以把函数中的内容基于Iterator迭代器的特点一步步的执行
function asyncFunc(generator) {
    const iterator = generator();
    const next = data => {
        let {
            done,
            value
        } = iterator.next(data);
        if (done) return;
        value.then(data => {
            next(data);
        });
    };
    next();
}

asyncFunc(function* () {
    let data = yield API(10);
    data = yield API(data + 10);
    console.log(data);
});

// redux-saga / dva / umi
// vuex 