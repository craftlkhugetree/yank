// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'
import _ from 'loadsh'
// 转换es6中新的API
import 'babel-polyfill'
// 配合postcss-pxtorem解决移动端适配
import 'lib-flexible'

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
import './assets/fonts/iconfont.css'
//项目的css
import './assets/css/projectcss.scss'
// 引入vant
import Vant from 'vant';
import 'vant/lib/index.css';
Vue.use(Vant);

import {Form, Button, Input, FormItem} from 'element-ui'
import "element-ui/lib/theme-chalk/index.css";
Vue.use(Form).use(Button).use(Input).use(FormItem)

/* eslint-disable no-new */
export default new Vue({
    el: '#app',
    router,
    store,
    components: {
        App
    },
    template: '<App/>'
})