import Vue from 'vue'
import Router from 'vue-router'
import Store from '../store'
Vue.use(Router)

import layout from '@/layout/'
import noRight from '@/layout/noRight'
import index from '@/view/index/index.vue'
import supervision from '@/view/supervision/supervision.vue'
import replyList from '@/view/reply/replyList.vue'
import reply from '@/view/reply/reply.vue'
import search from '@/view/search/search.vue'
import settings from '@/view/settings'
import businessArea from '@/view/settings/businessArea'
import quickReply from '@/view/settings/quickReply'
import roles from '@/view/settings/roles'
import sysStatistics from '@/view/sysStatistics/index'
import qusetionAmount from '@/view/sysStatistics/qusetionAmount/qusetionAmount'
import questionType from '@/view/sysStatistics/questionType/questionType'
import questionArea from '@/view/sysStatistics/questionArea/questionArea'
import replies from '@/view/sysStatistics/replies/replies'
import rates from '@/view/sysStatistics/rates/rates'
import hotWord from '@/view/sysStatistics/hotWord/hotWord'
// 部门统计
import deptsysStatistics from '@/view/deptStatistics/index'
import deptQusetionAmount from '@/view/deptStatistics/qusetionAmount/qusetionAmount'
import deptQuestionType from '@/view/deptStatistics/questionType/questionType'
import deptQuestionArea from '@/view/deptStatistics/questionArea/questionArea'
import deptReplies from '@/view/deptStatistics/replies/replies'
import deptRates from '@/view/deptStatistics/rates/rates'
import deptHotWord from '@/view/deptStatistics/hotWord/hotWord'


const config = require("@/../config");
const router = new Router({
  mode: "history",
  base: process.env.NODE_ENV === 'production' ?
    config.build.assetsPublicPath :
    config.dev.assetsPublicPath,
  routes: [{
    path: '/',
    name: 'pcIndex',
    component: layout,
    redirect: '/index',
    children: [{
        path: '/noRight',
        name: 'noRight',
        component: noRight
      },
      {
        path: '/index',
        name: 'index',
        component: index
      },
      // 系统配置
      {
        path: '/settings',
        name: 'settings',
        component: settings,
        redirect: '/settings/roles',
        children: [
          // 角色权限
          {
            path: "/settings/roles",
            name: "roles",
            component: roles
          },
          //  业务领域
          {
            path: '/settings/business-area',
            name: 'businessArea',
            component: businessArea
          },
          //  快捷回复
          {
            path: '/settings/quick-reply',
            name: 'quickReply',
            component: quickReply
          }
        ]
      },
      // 统计分析
      {
        path: '/sys',
        name: 'sysStatistics',
        component: sysStatistics,
        redirect: '/stats/search',
        children: [{
          path: '/stats/search',
          name: 'search',
          component: search,
        }, {
          path: "/sys/total",
          name: "qusetionAmount",
          component: qusetionAmount
        }, {
          path: "/sys/type",
          name: "questionType",
          component: questionType
        }, {
          path: "/sys/reply",
          name: "replies",
          component: replies
        }, {
          path: "/sys/rate",
          name: "rates",
          component: rates
        }, {
          path: "/sys/word",
          name: "hotWord",
          component: hotWord
        }, ]
      },
      {
        path: '/dept',
        name: 'deptsysStatistics',
        component: sysStatistics,
        redirect: '/dept/total',
        children: [{
          path: "/dept/total",
          name: "deptQusetionAmount",
          component: deptQusetionAmount
        }, {
          path: "/dept/type",
          name: "deptQuestionType",
          component: deptQuestionType
        }, {
          path: "/dept/area",
          name: "deptQuestionArea",
          component: deptQuestionArea
        }, {
          path: "/dept/reply",
          name: "deptReplies",
          component: deptReplies
        }, {
          path: "/dept/rate",
          name: "deptRates",
          component: deptRates
        }, {
          path: "/dept/word",
          name: "deptHotWord",
          component: deptHotWord
        }, ]
      },
      {
        path: '/supervision',
        name: 'supervision',
        component: supervision,
      },
      {
        path: '/replyList',
        name: 'replyList',
        component: replyList,
      },
      {
        path: '/reply/:id/:version',
        name: 'reply',
        component: reply,
      }
    ]
  }, ]
})

function doNext(urls, to, next) {
  let targetUrl = to.path;
  if (targetUrl.indexOf('/index') !== -1 ||
    targetUrl.indexOf('/noRight') !== -1 ||
    targetUrl.indexOf('/reply') !== -1) {
    next();
    return;
  }
  let routerFlag = false;
  for (let i = 0; i < urls.length; i++) {
    if (urls[i].DISPLAYURL.indexOf(targetUrl) !== -1) {
      routerFlag = true;
    }
  }
  if (routerFlag) {
    next();
  } else {
    next('/noRight');
  }

}
// router.beforeEach((to, from, next) => {
//   let userAuthedMenu = Store.state.userAuthedMenu;
//   // 判断所进入的页面是否在用户菜单中
//   if (userAuthedMenu.length) {
//     doNext(userAuthedMenu, to, next);
//   } else {
//     Store.dispatch("getUserMenu").then((res) => {
//       doNext(res, to, next);
//     }).catch(err => {
//       next()
//     })
//   }
// })
export default router;
