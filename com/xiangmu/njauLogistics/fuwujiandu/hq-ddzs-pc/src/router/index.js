import Vue from "vue";
import Router from "vue-router";
import Store from "../store";
Vue.use(Router);

import layout from "@/layout/";
import noRight from "@/layout/noRight";

import settings from "@/view/settings";
import businessArea from "@/view/settings/businessArea";
import roles from "@/view/settings/roles";

const config = require("@/../config");
const router = new Router({
  mode: "history",
  base:
    process.env.NODE_ENV === "production"
      ? config.build.assetsPublicPath
      : config.dev.assetsPublicPath,
  routes: [
    {
      path: "/",
      name: "pcIndex",
      component: layout,
      redirect: "/settings",
      children: [
        {
          path: "/noRight",
          name: "noRight",
          component: noRight
        },
        // 系统配置
        {
          path: "/settings",
          name: "settings",
          component: settings,
          redirect: "/settings/roles",
          children: [
            // 角色权限
            {
              path: "/settings/roles",
              name: "roles",
              component: roles
            },
            //  业务领域
            {
              path: "/settings/business-area",
              name: "businessArea",
              component: businessArea
            }
          ]
        }

      ]
    }
  ]
});

function doNext(urls, to, next) {
  let targetUrl = to.path;
  if (
    targetUrl.indexOf("/index") !== -1 ||
    targetUrl.indexOf("/noRight") !== -1
  ) {
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
    next("/noRight");
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
