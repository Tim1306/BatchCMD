import Vue from 'vue'
import App from './App.vue'
import './antdv'
import 'ant-design-vue/dist/antd.css'

Vue.config.productionTip = false

if(process.env.IS_ELECTRON){
  const electron = window.require('electron')
  Vue.prototype.$electron = electron
  Vue.prototype.$set = Vue.set
  Vue.prototype.$delete = Vue.delete
}

new Vue({
  render: h => h(App),
}).$mount('#app')
