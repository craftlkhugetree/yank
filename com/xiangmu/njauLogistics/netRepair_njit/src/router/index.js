import Vue from "vue";
import Router from "vue-router";
import Store from "../store/index";

Vue.use(Router);

import BasicLayout from "@/layout/BasicLayout";
import LeftMenuLayout from "@/layout/LeftMenuLayout";
import Index from "@/pages";
import RepairApply from "@/pages/repairApply/index";
import Draft from "@/pages/repairApply/draft";
import Continue from "@/pages/repairApply/continue";
import RepairDispatch from "@/pages/repairManage/dispatch";
import RepairHandle from "@/pages/repairManage/handle";
import RepairRecord from "@/pages/repairManage/record";
import RepairRecordRecord from "@/pages/repairManage/record/record";
import Area from "@/pages/settings/area";
import Dept from "@/pages/settings/dept";
import Roles from "@/pages/settings/roles";
import StatisticsSearch from "@/pages/statistics/search";
import StatisticsRepair from "@/pages/statistics/repair";
import StatisticsRepairHandle from "@/pages/statistics/repairHandle";
import StatisticsMaintain from "@/pages/statistics/maintain";
import StatisticsScore from "@/pages/statistics/score";
import SysStatisticsSearch from "@/pages/sysStatistics/search";
import SysStatisticsRepair from "@/pages/sysStatistics/repair";
import SysStatisticsRepairHandle from "@/pages/sysStatistics/repairHandle";
import SysStatisticsMaintain from "@/pages/sysStatistics/maintain";
import SysStatisticsScore from "@/pages/sysStatistics/score";
import MyRepair from "@/pages/workerRepair/myRepair";

const config = require("@/../config");
const router = new Router({
  mode: "history",
  base:
    process.env.NODE_ENV === "production"
      ? config.build.assetsPublicPath
      : config.dev.assetsPublicPath,
  routes: [
    {
      path: "/login",
      name: "login",
      component: () => import("@/pages/login")
    },
    // {
    //   path: "/map",
    //   name: "map",
    //   component: () => import("@/pages/map")
    // },
    {
      path: "/",
      component: BasicLayout,
      redirect: "/index",
      children: [
        {
          path: "/index",
          name: "index",
          component: Index
        },
        {
          path: "/repair-apply",
          name: "repairApply",
          component: RepairApply
        },
        {
          path: "/draft/:id",
          name: "draft",
          component: Draft,
          props: route => ({
            id: route.params.id
          })
        },
        {
          path: "/continue/:id",
          name: "continue",
          component: Continue,
          props: route => ({
            id: route.params.id
          })
        },
        {
          path: "/settings",
          name: "settings",
          component: LeftMenuLayout,
          props: {
            menuType: "系统配置"
          },
          children: [
            //  报修区域
            {
              path: "/settings/area",
              name: "area",
              component: Area
            },
            //  维修单位
            {
              path: "/settings/dept",
              name: "dept",
              component: Dept
            },
            //  角色权限
            {
              path: "/settings/roles",
              name: "roles",
              component: Roles
            }
          ]
        },
        {
          path: "/repair-manage",
          name: "repairManage",
          component: LeftMenuLayout,
          props: {
            menuType: "报修管理"
          },
          children: [
            //  维修办理
            {
              path: "/repair-manage/handle",
              name: "repairHandle",
              component: RepairHandle
            },
            //  报修录单
            {
              path: "/repair-manage/record",
              name: "repairRecord",
              component: RepairRecord
            },
            //  报修录单-录单
            {
              path: "/repair-manage/record/record",
              name: "repairRecordRecord",
              component: RepairRecordRecord
            },
            //  派单管理
            {
              path: "/repair-manage/dispatch",
              name: "repairDispatch",
              component: RepairDispatch
            }
          ]
        },
        {
          // 系统统计
          path: "/sys-statistics",
          name: "sysStatistics",
          component: LeftMenuLayout,
          redirect: "/sys-statistics/search",
          props: {
            menuType: "系统统计"
          },
          children: [
            //  维修查询
            {
              path: "/sys-statistics/search",
              name: "sysStatisticsSearch",
              component: SysStatisticsSearch
            },
            //  报修统计
            {
              path: "/sys-statistics/repair",
              name: "sysSatisticsRepair",
              component: SysStatisticsRepair
            },
            //  报修处理统计
            {
              path: "/sys-statistics/repair-handle",
              name: "sysStatisticsRepairHandle",
              component: SysStatisticsRepairHandle
            },
            //  维修量统计
            {
              path: "/sys-statistics/maintain",
              name: "sysStatisticsMaintain",
              component: SysStatisticsMaintain
            },
            //  评价分析
            {
              path: "/sys-statistics/score",
              name: "sysStatisticsScore",
              component: SysStatisticsScore
            }
          ]
        },
        {
          // 单位统计
          path: "/dept-statistics",
          name: "deptStatistics",
          component: LeftMenuLayout,
          redirect: "/dept-statistics/search",
          props: {
            menuType: "单位统计"
          },
          children: [
            //  维修查询
            {
              path: "/dept-statistics/search",
              name: "deptStatisticsSearch",
              component: StatisticsSearch
            },
            //  报修统计
            {
              path: "/dept-statistics/repair",
              name: "deptStatisticsRepair",
              component: StatisticsRepair
            },
            //  报修处理统计
            {
              path: "/dept-statistics/repair-handle",
              name: "deptStatisticsRepairHandle",
              component: StatisticsRepairHandle
            },
            //  维修量统计
            {
              path: "/dept-statistics/maintain",
              name: "deptStatisticsMaintain",
              component: StatisticsMaintain
            },
            //  评价分析
            {
              path: "/dept-statistics/score",
              name: "deptStatisticsScore",
              component: StatisticsScore
            }
          ]
        },
        {
          path: "/worker-repair",
          name: "workerRepair",
          component: LeftMenuLayout,
          props: {
            menuType: "我的维修"
          },
          children: [
            //  我的维修
            {
              path: "/worker-repair/my-repair",
              name: "myRepair",
              component: MyRepair
            }
          ]
        }
      ]
    }
  ]
});

const doNext = function(urls, to, next) {
  // 判断要进入的页面是否在菜单中
  if (urls.some(i => to.path.includes(i))) {
    next();
  } else {
    next(false);
  }
};

// 全局路由导航卫士
// router.beforeEach((to, from, next) => {
//   // 判断所进入的页面是否在用户菜单中
//   let urls = sessionStorage.getItem("urls");
//   if (urls) {
//     doNext(JSON.parse(urls), to, next);
//   } else {
//     Store.dispatch("getUserMenu").then((res) => {
//       doNext(res, to, next);
//     })
//   }
// })

export default router;
