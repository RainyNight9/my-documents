/* let n = Symbol(),
    m = Symbol();
console.log(n === m); //false

n = Symbol('A');
m = Symbol('A');
console.log(n === m); //false */

/* let n = Symbol('N');
let obj = {
    name: "珠峰培训",
    age: 11,
    [n]: 100
}; */

/* // 宏管理：消除魔术字符串
const vote_plus = Symbol('vote_plus');
function reducer(action) {
    let state = {
        count: 0
    };
    switch (action.type) {
        case vote_plus:
            state.count++;
            break;
    }
    return state;
}
reducer({
    type: vote_plus
}); */


/* let obj = {
    name: "珠峰培训",
    age: 11,
    [Symbol('A')]: 100,
    [Symbol('B')]: 200
};
 */
// for in迭代/Object.keys/Object.getOwnPropertyNames/JSON.stringify 的时候不能遍历Symbol属性
/* for (let key in obj) {
    console.log(key);
} */
// console.log(JSON.parse(JSON.stringify(obj)));

/* let [n, m] = Object.getOwnPropertySymbols(obj);
console.log(obj[n]);
Object.getOwnPropertySymbols(obj).forEach(key => {
    console.log(obj[key]);
}); */
/* 

let arr1 = [1, 2, 3],
    arr2 = [4, 5, 6];
console.log(arr2[Symbol.isConcatSpreadable]); //undefined
console.log(arr1.concat(arr2));

arr1[Symbol.isConcatSpreadable] = false;
arr2[Symbol.isConcatSpreadable] = false;
console.log(arr1.concat(arr2)); */


// 所有可被迭代的对象才能用 for of 循环
// 可被迭代对象：拥有Symbol.iterator这个属性的
/* let obj = {
    0: 1,
    1: 2,
    length: 2,
    [Symbol.iterator]: Array.prototype[Symbol.iterator]
};
for (let item of obj) {
    console.log(item);
} */



/* let a = {
    value: 0,
    [Symbol.toPrimitive](hint) {
        console.log(hint);
        // default:可能转换为数字，也可能是字符串
        // number
        // string
        return ++this.value;
    }
};
/!* if (a == 1 && a == 2 && a == 3) {
    console.log('OK');
} *!/
String(a); */

/* class Person {
    get[Symbol.toStringTag]() {
        return "Person";
    }
}
let p1 = new Person;
console.log(({}).toString.call(p1)); //"[object Person]" */