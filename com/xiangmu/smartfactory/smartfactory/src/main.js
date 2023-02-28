import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import 'babel-polyfill'
import promise from 'es6-promise'
promise.polyfill()

Vue.config.productionTip = false

// 公共的css
import './assets/css/public.scss'
import './assets/fonts/iconfont.css'

// element
import ElementUI from 'element-ui'
import './assets/css/element-variables.scss'
Vue.use(ElementUI)

// util
import util from './assets/js/util'
Vue.prototype.util = util

// common
import common from './assets/js/common'
Vue.prototype.common = common

// 打印
// import Print from './assets/js/print'
// Vue.use(Print)

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
