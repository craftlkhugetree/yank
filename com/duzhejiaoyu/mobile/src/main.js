import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import 'babel-polyfill'
import promise from 'es6-promise'
promise.polyfill()
// 配合postcss-pxtorem解决移动端适配
import 'lib-flexible'

Vue.config.productionTip = false

// 公共的css
import './assets/css/public.scss'
import './assets/fonts/iconfont.css'

// moment
import moment from 'moment'
Vue.prototype.moment = moment

// util
import util from './assets/js/util'
Vue.prototype.util = util

// common
import common from './assets/js/common'
Vue.prototype.common = common

// 引入vant
import Vant from 'vant';
import 'vant/lib/index.css';
Vue.use(Vant);

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
