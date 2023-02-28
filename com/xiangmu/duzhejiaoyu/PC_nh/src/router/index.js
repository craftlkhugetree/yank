import Vue from 'vue'
import Router from 'vue-router'
import index from "../pages/index"
import exam from "../pages/exam/exam"
import examing from "../pages/exam/examing"
import fightexaming from "../pages/exam/fightexaming"

import errlog from "../pages/exam/errlog"
import person from "../pages/person/person"
import study from "../pages/study/study"
import shouye from "../pages/shouye/index"
import bind from "../pages/bind/bind"
import newbind from "../pages/bind/newbind"
import addInfo from "../pages/bind/addInfo"

import campus from "../pages/bind/campus"
Vue.use(Router)

var redirecturl = 'redirect';
if (window.base.ysu || window.base.nuist || window.base.nh) {
  redirecturl = 'campus'
} else {
  redirecturl = 'bind'
}
let lresRouter = new Router({
  // mode: 'history',
  routes: [
    {
      path: '/',
      name: 'index',
      component: index,
      redirect: redirecturl,
      children: [{
        path: 'campus',
        name: 'campus',
        component: campus,
      }, {
        path: 'bind',
        name: 'bind',
        component: bind,
      }, {
        path: 'addInfo',
        name: 'addInfo',
        component: addInfo,
      }, {
        path: 'newbind',
        name: 'newbind',
        component: newbind,
      }, {
        path: 'exam',
        name: 'exam',
        component: exam,
      }, {
        path: 'fightexaming',
        name: 'fightexaming',
        component: fightexaming,
      }, {
        path: 'examing',
        name: 'examing',
        component: examing,
      }, {
        path: 'errlog',
        name: 'errlog',
        component: errlog,
      }, {
        path: 'person',
        name: 'person',
        component: person,
      }, {
        path: 'study',
        name: 'study',
        component: study,
      }, {
        path: 'vediodetail',
        name: 'vediodetail',
        // component: vediodetail,
        component: () =>
          import( /* webpackChunkName: "memberInfo" */ "@/pages/study/vediodetail"),
        props: (route) => ({
          id: route.query.id,
          ended: route.query.ended,
          islearnnum: route.query.islearnnum,

        }),
      }, {
        path: 'docdetail',
        name: 'docdetail',
        // component: docdetail,
        component: () =>
          import( /* webpackChunkName: "memberInfo" */ "@/pages/study/docdetail"),
        props: (route) => ({
          id: route.query.id,
          ended: route.query.ended,
          islearnnum: route.query.islearnnum,
        }),
      }, {
        path: 'arcdetail',
        name: 'arcdetail',
        // component: arcdetail,
        component: () =>
          import( /* webpackChunkName: "memberInfo" */ "@/pages/study/arcdetail"),
        props: (route) => ({
          id: route.query.id,
          ended: route.query.ended,
          islearnnum: route.query.islearnnum,
        }),
      }, {
        path: 'shouye',
        name: 'shouye',
        component: shouye,
      }, {
        path: 'activityIndex',
        name: '活动列表',
        component: () =>
          import( /* webpackChunkName: "memberInfo" */ "@/pages/activity/view"),
      }, {
        path: 'myactivity',
        name: '我的活动',
        component: () =>
          import( /* webpackChunkName: "memberInfo" */ "@/pages/activity/view/myactivity"),
      }, {
        path: 'allactivity',
        name: '全部活动',
        component: () =>
          import( /* webpackChunkName: "memberInfo" */ "@/pages/activity/view/allactivity"),
      }, {
        path: 'activityShow',
        name: '精彩回顾',
        component: () =>
          import( /* webpackChunkName: "memberInfo" */ "@/pages/activity/view/activityShow"),
      }, {
        path: 'sign',
        name: '报名',
        component: () =>
          import( /* webpackChunkName: "memberInfo" */ "@/pages/activity/view/sign"),
        props: (route) => ({
          ID: route.query.ID,
        }),
      }


      ]
    }
    // ,{
    //   path: '/',
    //   name: 'bind',
    //   component: bind,
    // }
  ]
})

lresRouter.beforeEach((to, from, next) => {//微信端跳转页面时候路由后面的一长串
  // console.log(to)
  // console.log(from)
  if (from.name == 'examing' || from.name == 'fightexaming') {
    if (to.name == 'errlog' || to.name == 'exam') {
      next();
    } else {
      var r = confirm("确定退出考试？");
      if (r == true) {
        next();
      }
    }

  } else {
    next();
  }
})
export default lresRouter