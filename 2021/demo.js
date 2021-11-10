const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const log = console.log
createTask([
  () => delay(1000).then(() => log(1)),
  () => log(2),
  () => delay(3000).then(() => log(3)),
  () => log(4),
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