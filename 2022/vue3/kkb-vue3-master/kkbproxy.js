
// function reactive(target){
//   let baseHander = { get,set}
//   return new Proxy(target, baseHander )
// }

let obj = {name:'开课吧', location:{ city:'beijing'}}
// let obj = [1,2,3]
let o = new Proxy(obj, {
  get(target, key){
    console.log('获取值', key)
    // return target[key]
    return Reflect.get(target, key)
  },
  set(target, key, val){
    console.log('修改值', key, val)
    return Reflect.set(target, key, val)
  }
})
o.location.city='shanghai'
// o.unshift(4)
// o.name="vue3"
// console.log(o.name)

// 1. 数组多次触发

// 2。 对象嵌套

