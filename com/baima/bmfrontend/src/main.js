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

import directives from './assets/js/directives'
Vue.use(directives);

Vue.config.productionTip = false;

import 'viewerjs/dist/viewer.css'
import Viewer from 'v-viewer'
Vue.use(Viewer);

// 公共的css
import "./assets/css/public.scss";
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

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})
