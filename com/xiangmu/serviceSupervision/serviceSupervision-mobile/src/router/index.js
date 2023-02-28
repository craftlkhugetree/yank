import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

import Layout from "@/layout/basicLayout"
import Home from "@/pages"
import Reply from "@/pages/reply"
import Move from "@/pages/move/move.vue"
import managerReply from "@/pages/managerReply/reply.vue"
import Score from "@/pages/score"
import Talk from "@/pages/talk"
import Search from "@/pages/search"
import Detail from "@/pages/detail"

const config = require("@/../config");
export default new Router({
  mode: "history",
  base: process.env.NODE_ENV === 'production'
  ? config.build.assetsPublicPath
  : config.dev.assetsPublicPath,
  routes: [{
      path: '/',
      redirect: '/index',
      component: Layout,
      children: [{
          path: '/index',
          name: "index",
          component: Home
        },
        {
          path: '/reply',
          name: "reply",
          component: Reply
        }
      ]
    },
    {
      path: '/move/:id/:version',
      name: "move",
      component: Move
    },
    {
      path: '/managerReply/:id/:version',
      name: "managerReply",
      component: managerReply
    },
    {
      path: '/score/:id/:version',
      name: "score",
      component: Score,
      props: (route) => ({
        id: route.params.id,
        version : route.params.version
      })
    },
    {
      path: '/talk',
      name: "talk",
      component: Talk
    },
    {
      path: '/search',
      name: "search",
      component: Search,
      meta: {
        keepAlive: false
      }
    },
    {
      path: '/detail/:id',
      name: "detail",
      component: Detail,
      props: (route) => ({
        id: route.params.id,
        operType: route.query.operType
      })
    }
  ]
})
