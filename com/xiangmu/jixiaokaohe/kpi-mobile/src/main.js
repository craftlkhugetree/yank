import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
// 转换es6中新的API
import 'babel-polyfill'
// 配合postcss-pxtorem解决移动端适配
import 'lib-flexible'


Vue.config.productionTip = false

// 公共的css
import './assets/fonts/iconfont.css'
import './assets/css/public.scss'

// util
import util from "./assets/js/util"
Vue.prototype.util = util;

// common
import common from "./assets/js/common";
Vue.prototype.common = common;

// loadsh
import _ from 'loadsh'

// moment
import moment from "moment";
Vue.prototype.moment = moment;

// 引入vant
import Vant from 'vant';
import 'vant/lib/index.css';
Vue.use(Vant);

//引入Element
import ElementUI from 'element-ui'
Vue.use(ElementUI)

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
