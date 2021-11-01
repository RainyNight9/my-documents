let ob = new MutationObserver(()=>{
  console.log('change')
})

ob.observe(document.body, {attributes: true})

document.body.className = 'foo'

setTimeout(()=>{
  ob.disconnect()
  document.body.className = 'bar'
}, 0)