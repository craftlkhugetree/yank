// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'
// 转换es6中新的API
import 'babel-polyfill';
// 配合postcss-pxtorem解决移动端适配
import 'lib-flexible';

Vue.config.productionTip = false

// global
import global from './assets/js/global'
Vue.prototype.global = global

// util
import util from './assets/js/util'
Vue.prototype.util = util;

// common
import common from './assets/js/common'
Vue.prototype.common = common;

// 公共的css
import './assets/css/public.scss'
import './assets/font/style.css';

// 解决移动设备浏览器300毫秒延迟，从而立即触发点击事件
// import fastclick from 'fastclick';
// fastclick.attach(document.body);

// 引入vant
import Vant from 'vant';
import 'vant/lib/index.css';
Vue.use(Vant);

// 将所有 Toast 的展示时长设置为 2500 毫秒
import { Toast } from 'vant';
Vue.use(Toast);
Toast.setDefaultOptions({ duration: 2500 });

// 按需引入ElementUi
import { Table, TableColumn, Checkbox, Dropdown, Input, DropdownItem, DropdownMenu, Image, Alert } from 'element-ui';
Vue.use(Table)
  .use(TableColumn)
  .use(Checkbox)
  .use(Dropdown)
  .use(Input)
  .use(DropdownMenu)
  .use(DropdownItem)
  .use(Image)
  .use(Alert)

new Vue({
  el: '#app',
  router,
  store,
  components: {
    App
  },
  template: '<App/>'
})
