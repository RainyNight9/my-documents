import Vue from 'vue'
import App from './App.vue'
import router from './router'
import {registerApplication,start} from 'single-spa';
Vue.config.productionTip = false

async function loadScript(url){
  return new Promise((resolve,reject)=>{
    let script = document.createElement('script');
    script.src = url;
    script.onload = resolve;
    script.onerror = reject;
    document.head.appendChild(script);
  })
}
// singleSpa 缺陷 不够灵活 不能动态加载js文件
// 样式不隔离 没有js沙箱的机制

registerApplication('myVueApp',
  async ()=>{
      // systemJS
      console.log('load')
      await loadScript(`http://localhost:10000/js/chunk-vendors.js`);
      await loadScript(`http://localhost:10000/js/app.js`)
      return window.singleVue; // bootstrap mount unmount
  },
  location => location.pathname.startsWith('/vue'), // 用户切换到/vue 的路径下，我需要加载刚才定义子子应用
)
start();


new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
