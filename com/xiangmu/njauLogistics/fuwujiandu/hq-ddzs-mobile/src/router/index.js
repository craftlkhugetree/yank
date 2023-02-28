import Vue from "vue";
import Router from "vue-router";
import g from "@/assets/js/global";
import common from "@/assets/js/common";

Vue.use(Router);

import Home from "@/pages";

const config = require("@/../config");

// 解决报错
const originalPush = Router.prototype.push;
const originalReplace = Router.prototype.replace;
// 针对 push 方法
Router.prototype.push = function push(location, onResolve, onReject) {
  if (onResolve || onReject)
    return originalPush.call(this, location, onResolve, onReject);
  return originalPush.call(this, location).catch(err => err);
};
// 针对 replace 方法
Router.prototype.replace = function push(location, onResolve, onReject) {
  if (onResolve || onReject)
    return originalReplace.call(this, location, onResolve, onReject);
  return originalReplace.call(this, location).catch(err => err);
};

const ROUTER = new Router({
  mode: "history",
  base:
    process.env.NODE_ENV === "production"
      ? config.build.assetsPublicPath
      : config.dev.assetsPublicPath,
  routes: [
    {
      path: "/",
      redirect: "/choose-role",
      component: () => import("@/pages/chooseRole")
    },
    {
      path: "/choose-role",
      name: "ChooseRole",
      component: () => import("@/pages/chooseRole")
    },
    {
      path: "/index",
      name: "index",
      component: Home
    },
    {
      path: "/index-ywzx",
      name: "ywzx",
      component: () => import("@/pages/ywzxIndex")
    },
    {
      path: "/index-admin",
      name: "admin",
      component: () => import("@/pages/admin")
    },
    {
      path: "/moreLabel",
      name: "MoreLabel",
      component: () => import("@/pages/moreLabel")
    },
    {
      path: "/labelDetail",
      name: "LabelDetail",
      component: () => import("@/pages/labelMapFilter"),
      props: route => ({
        title: route.query.title
      })
    },
    {
      path: "/report",
      name: "Report",
      component: () => import("@/pages/report")
    },
    {
      path: "/report-map",
      name: "ReportMap",
      component: () => import("@/pages/report/map.vue")
    },
    {
      path: "/report-map-list",
      name: "ReportMapList",
      component: () => import("@/pages/report/mapList.vue")
    },
    {
      path: "/report-handleDeptId",
      name: "ReportHandleDept",
      component: () => import("@/pages/report/handleDept.vue")
    },
    {
      path: "/report-handleDeptId-jz",
      name: "ReportJZ",
      component: () => import("@/pages/report/jz.vue")
    },
    {
      path: "/success",
      name: "Success",
      component: () => import("@/components/success")
    },
    {
      path: "/detail/:id",
      name: "Detail",
      component: () => import("@/pages/detail"),
      props: route => ({
        id: route.params.id
      })
    }
  ]
});

// 组件在加载时调用，此时组件实例还没有被加载
ROUTER.beforeEach((to, from, next) => {
  let pathArr = g.routeId.map(r => r.path);
  if (pathArr.includes(to.path) && from.path === "/") {
    sessionStorage.removeItem(g.TAB.tab1);
    sessionStorage.removeItem(g.TAB.tab2);
  }
  let aim = common.getStore("userRoles");
  if (to.path === "/choose-role" && aim.length === 1) {
    next(aim[0].path);
  }
  next();
});

export default ROUTER;
