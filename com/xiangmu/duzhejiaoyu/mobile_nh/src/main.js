// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
//vuex
import Vuex from 'vuex'
Vue.use(Vuex)
// Axios
import axios from 'axios'
import qs from 'qs'
Vue.prototype.$ajax = axios
Vue.prototype.$qs = qs
//store.js
import store from './store/store'
Vue.config.productionTip = false
//mint-ui
import Mint from 'mint-ui'
Vue.use(Mint)
import 'mint-ui/lib/style.css'
import {Indicator,Toast,MessageBox} from 'mint-ui'
Vue.prototype.Toast = Toast
Vue.prototype.Indicator = Indicator
Vue.prototype.MessageBox = MessageBox
//引入公共样式
import './assets/css/public.css'
//util
import util from '@/util/util'
Vue.prototype.util = util;
//查看图片放大的插件
import preview from 'vue-photo-preview'
import 'vue-photo-preview/dist/skin.css'
Vue.use(preview)

import Vant from 'vant';
import { Dialog } from 'vant';
import 'vant/lib/index.css';
Vue.use(Vant);
Vue.prototype.Dialog = Dialog;
//animated
import animated from 'animate.css' 
Vue.use(animated)

import Video from 'video.js'
import 'video.js/dist/video-js.css'
import video_zhCN from 'video.js/dist/lang/zh-CN.json'
import video_en from  'video.js/dist/lang/en.json'
Video.addLanguage('zh-CN', video_zhCN);
Video.addLanguage('en', video_en);
Vue.prototype.$video = Video

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})
