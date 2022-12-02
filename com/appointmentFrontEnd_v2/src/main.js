import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import "babel-polyfill";
import promise from "es6-promise";
promise.polyfill();

Vue.config.productionTip = false;

// 公共的css
import './assets/css/public.scss'
import './assets/fonts/iconfont.css'
import './assets/css/client-public.scss'


// element
import ElementUI from 'element-ui'
import './assets/css/element-variables.scss'
Vue.use(ElementUI)

// util
import util from "./assets/js/util"
Vue.prototype.util = util;

// lodash
import _ from 'lodash'

// common
import common from "./assets/js/common";
Vue.prototype.common = common;

// moment
import moment from "moment";
Vue.prototype.moment = moment;

import * as echarts from 'echarts/lib/echarts.js';
import { GridComponent } from 'echarts/components';
import { BarChart } from 'echarts/charts';
echarts.use([GridComponent, BarChart]);

export default new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");
