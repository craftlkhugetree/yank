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

// element
import ElementUI from 'element-ui';
import './assets/css/element-variables.scss';
Vue.use(ElementUI);
//util
import util from './assets/js/util'
Vue.prototype.util = util;
// common
import common from './assets/js/common';
Vue.prototype.common = common;

// moment
import moment from 'moment';
Vue.prototype.moment = moment;
// lodash
import _ from 'lodash';

import myxss from './xss';
Vue.prototype.$xss = val => {
  return myxss.process(val);
};

// baidu map
import BaiduMap from 'vue-baidu-map';
Vue.use(BaiduMap, {
  // ak 是在百度地图开发者平台申请的密钥 详见 http://lbsyun.baidu.com/apiconsole/key */
  ak: 'HUHdUbHBU9rkKXBerPdRSdMBSqSMxgxW',
});

new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app');
