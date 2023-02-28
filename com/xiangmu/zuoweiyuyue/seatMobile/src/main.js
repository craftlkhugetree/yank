// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'
//vuex
import Vuex from 'vuex'
Vue.use(Vuex)
// Axios
import axios from 'axios'
import qs from 'qs'
Vue.prototype.$ajax = axios
Vue.prototype.$qs = qs
Vue.config.productionTip = false
//引入公共样式
import './assets/css/public.css'
//util
import util from '@/util/util'
Vue.prototype.util = util;
// common
import common from '@/util/common'
Vue.prototype.common = common;

import code from '@/util/code'
Vue.prototype.code = code;
//查看图片放大的插件
import preview from 'vue-photo-preview'
import 'vue-photo-preview/dist/vue-photo-preview'
import 'vue-photo-preview/dist/skin.css'
Vue.use(preview);

import Vant from 'vant';
import { Toast, Dialog } from 'vant';
import 'vant/lib/index.css';
Vue.use(Vant);
Vue.prototype.Toast = Toast;
Vue.prototype.Dialog = Dialog;

import VueLazyload from 'vue-lazyload'
Vue.use(VueLazyload)

import VuePinch from 'vue-pinch'
Vue.use(VuePinch)

import myxss from './xss';
Vue.prototype.$xss = val => {
  return myxss.process(val);
};

// import voiceInputButton from "voice-input-button2";
// Vue.use(voiceInputButton, {
//   appId: "1b63f344", // 您申请的语音听写服务应用的ID
//   apiSecret: "ODMyMTFlNDhlMWRjMzg2NjQxMzQ4ZjRi", // 您开通的语音听写服务的 apiSecret
//   apiKey: "1fe443319e96410ffb4f9989ed7cafdc", // 您开通的语音听写服务的 apiKey
//   color: "#fff", // 按钮图标的颜色
//   tipPosition: "top" // 提示条位置
// });

// 配合postcss-pxtorem解决移动端适配
import 'lib-flexible'
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})
