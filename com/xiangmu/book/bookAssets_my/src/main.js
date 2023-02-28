// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import "babel-polyfill"
import promise from "es6-promise"
import Vue from 'vue'
import App from './App'
import router from './router'
import store from "./store"
import axios from "axios"
import util from "./assets/js/util.js"
// import {domain} from "./assets/js/global"


//editor
/*import VueKindEditor from 'vue-kindeditor'
import 'kindeditor/kindeditor-all-min.js'
import 'kindeditor/themes/default/default.css'
Vue.use(VueKindEditor);*/

import ElementUI from "element-ui"
import echarts from "echarts"
import global from "./common/Global"
import "element-ui/lib/theme-chalk/index.css"

import "../src/assets/css/reset.css"
import "../src/assets/css/public.css"
import "../src/assets/css/dialogForm.css"



promise.polyfill();
Vue.config.productionTip = false;
Vue.prototype.axios=axios;
Vue.prototype.util = util;
// Vue.prototype.domain = domain;
Vue.prototype.global =global;
Vue.prototype.$echarts =echarts;
Vue.use(ElementUI);

//图片放大
import preview from 'vue-photo-preview'
import 'vue-photo-preview/dist/skin.css'
// let options = {
//   fullscreenEl: false
// };
function GetQueryString(name){
  var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
  // const url="http://160.255.0.246:8081/book2/bookAssets/index.html?amp_sec_version_=1&gid_=YnpKb1cwL0hTakJSK2ZhOE9jUEM1b1ZDZitEZG9iM3c2alBqWXloT0hxZmxqTTlGQjZpTTRXM3RNNnRTbzZ2ODYwVTdLbHlqZy9JY0tlUVBPUkxiNVE9PQ&EMAP_LANG=zh&THEME=teal&_ti=1558924948323"
  var r = window.location.search.substr(1).match(reg);
  if(r!=null)return  unescape(r[2]); return null;
}


import htmlToPdf from "../src/assets/js/htmlToPdf"
Vue.use(htmlToPdf)

util.postAjax({
  code:global.code,
  url:"/book/getUser",
  data:{
    gid_:GetQueryString("gid_")
  }
}).then((res)=> {
  sessionStorage.setItem("name",res.NAME);
  sessionStorage.setItem("id",res.ID);
  // sessionStorage.setItem("power", true);
  console.log(111111);
  if (res.POWER == true) {
    sessionStorage.setItem("power", true);
    sessionStorage.setItem("checkPower", "2");
    sessionStorage.setItem("checkedPower", "0,1");
  } else if (res.POWER == false) {
    sessionStorage.setItem("power", false);
    sessionStorage.setItem("checkPower", "0,2");
    sessionStorage.setItem("checkedPower", "1");
  }


  Vue.use(preview);

  /* eslint-disable no-new */
  new Vue({
    el: '#app',
    router,
    store,
    components: { App },
    template: '<App/>'
  })
}).catch(()=>{
  Vue.use(preview);
  /* eslint-disable no-new */
  new Vue({
    el: '#app',
    router,
    store,
    components: { App },
    template: '<App/>'
  })
});

