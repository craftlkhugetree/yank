import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import 'babel-polyfill';
import promise from 'es6-promise';
promise.polyfill();

Vue.config.productionTip = false;

// 公共的css
import './assets/css/public.scss';
import './assets/fonts/iconfont.css';
import './assets/css/client-public.scss';

// element
import ElementUI from 'element-ui';
import './assets/css/element-variables.scss';
Vue.use(ElementUI);

// util
import util from './assets/js/util';
Vue.prototype.util = util;

// common
import common from './assets/js/common';
Vue.prototype.common = common;

// moment
import moment from 'moment';
Vue.prototype.moment = moment;

import registeGlobalComponent from '@/components';
registeGlobalComponent(Vue); //注册全局组件

export default new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app');

