// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'

Vue.config.productionTip = false
// Axios
import axios from 'axios'
import qs from 'qs'
Vue.prototype.$ajax = axios
Vue.prototype.$qs = qs
//mint-ui
import Mint from 'mint-ui'
Vue.use(Mint)
import 'mint-ui/lib/style.css'
import {Indicator,Toast,MessageBox} from 'mint-ui'
Vue.prototype.Toast = Toast
Vue.prototype.Indicator = Indicator
Vue.prototype.MessageBox = MessageBox
//util
import util from './util/util'
Vue.prototype.util = util;
//store.js
import store from './store/store'
//公共的css
import "../src/assets/css/public.css"
//图片放大
import preview from 'vue-photo-preview'
import 'vue-photo-preview/dist/skin.css'
Vue.use(preview)

/* eslint-disable no-new */
// this.util.postAjax({
//   code:code.base,
//   url:code.getUser,
// }).then( res => {
//   this.ID= res.ID;
//   //获取列表需要的id存起来
//   window.sessionStorage.setItem('getlistID',res.ID)
  // this.getList(res.ID)
  new Vue({
    el: '#app',
    router,
    store,
    components: { App },
    template: '<App/>'
  })
// }).catch(err=>{
//   new Vue({
//     el: '#app',
//     router,
//     store,
//     components: { App },
//     template: '<App/>'
//   })
// })



