// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'
import "babel-polyfill"
import promise from "es6-promise"
promise.polyfill();
import $ from 'jquery'    

Vue.config.productionTip = false

// element
import ElementUI from "element-ui";
import './assets/css/element-variables.scss'
Vue.use(ElementUI);

// 公共的css
import "./assets/css/public.scss";
import "./assets/css/public_.css"
import "./assets/fonts/iconfont.css";

// util
import util from "./assets/js/util.js";
Vue.prototype.util = util;

// global
import global from "./assets/js/global";
Vue.prototype.global = global;

// loadsh
import _ from "loadsh";

// common
import common from "./assets/js/common";
Vue.prototype.common = common;

// api
import api from "./assets/js/api";
Vue.prototype.api = api;

// baidu
import BaiduMap from "vue-baidu-map";
Vue.use(BaiduMap, {
  // ak 是在百度地图开发者平台申请的密钥 详见 http://lbsyun.baidu.com/apiconsole/key */
  ak: "HUHdUbHBU9rkKXBerPdRSdMBSqSMxgxW"
});

/* eslint-disable no-new */
export default new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})
