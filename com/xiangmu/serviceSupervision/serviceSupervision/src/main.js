// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'
import "babel-polyfill"
import promise from "es6-promise"
import _ from 'loadsh'
promise.polyfill();

Vue.config.productionTip = false
import echarts from 'echarts'
Vue.prototype.$echarts = echarts
    // element
import ElementUI from "element-ui";
import './assets/css/element-variables.scss'
Vue.use(ElementUI);

// 公共的css
import "./assets/css/public.scss";
import "./assets/css/public_.css"
import './assets/fonts/iconfont.css'

// util
import util from "./assets/js/util.js";
Vue.prototype.util = util;

// global
import global from "./assets/js/global";
Vue.prototype.global = global;

// common
import common from "./assets/js/common";
Vue.prototype.common = common;

/* eslint-disable no-new */
new Vue({
    el: '#app',
    router,
    store,
    components: {
        App
    },
    template: '<App/>'
})