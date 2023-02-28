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

// util
import util from './assets/js/util'
Vue.prototype.util = util

// common
import common from './assets/js/common'
Vue.prototype.common = common

// 按需引入element-ui
// import 'element-ui/lib/theme-chalk/index.css';
import {
  Table,
  TableColumn,
} from 'element-ui'
Vue.use(Table)
Vue.use(TableColumn)

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')