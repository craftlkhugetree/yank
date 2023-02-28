// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import App from './App';
import router from './router';
import store from "./store";
import "babel-polyfill";
import promise from "es6-promise";
promise.polyfill();

import ElementUI from "element-ui";
import "element-ui/lib/theme-chalk/index.css";
Vue.use(ElementUI);

Vue.config.productionTip = false;

// 公共的css
import "./assets/css/reset.scss";
import "./assets/css/public-new.scss";
// import "./assets/fonts/style.css";

// util
import util from "./assets/js/util.js";
Vue.prototype.util = util;

// common
import common from "./assets/js/common.js";
Vue.prototype.common = common;

// global
import global from "./assets/js/global";
Vue.prototype.global = global;

// options
import options from "./assets/js/options";
Vue.prototype.options = options;



// VueKindEditor
// import VueKindEditor from '../src/plugin/kindeditor'
// import '../static/kindeditor/themes/default/default.css'
// import '../static/kindeditor/kindeditor-all'
// import '../static/kindeditor/lang/zh-CN'
// Vue.use(VueKindEditor)
import angkeeditor from 'angkeeditor';
Vue.use(angkeeditor)

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})
