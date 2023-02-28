import Vue from "vue";
import Router from "vue-router";

Vue.use(Router);

import BasicLayout from "../layout/BasicLayout";
import store from "../store";

const router = new Router({
  routes: [
    {
      path: "/",
      component: BasicLayout,
      redirect: "/mission/my_message",
      children: [
        //我的消息
        {
          path: "/mission/my_message",
          name: "我的消息",
          component: () =>
            import(/* webpackChunkName: "bm" */ "../pages/mission/myMessage")
        },
        {
          path: "irrigate-apply",
          name: "灌溉申请",
          component: () =>
            import(/* webpackChunkName: "bm" */ "../pages/irrigateApply/index"),
          props: route => ({
            enterType: 1 //非详情页跳转
          })
        },
        {
          path: "/irrigate-apply/irrigate-apply-detail/:id",
          name: "灌溉申请详情",
          component: () =>
            import(/* webpackChunkName: "bm" */ "../components/irrDetail"),
          props: route => ({
            id: route.params.id,
            indexActiveName: route.query.activeName,
            indexCurrentPage: route.query.currentPage,
            breadList: [
              {
                path: "",
                name: "灌溉用水申请"
              },
              {
                path: "",
                name: "详情"
              }
            ]
          })
        },
        {
          path: "irrigate-res-management",
          name: "灌溉资源管理",
          component: () =>
            import(/* webpackChunkName: "bm" */ "../pages/resManagement/index")
          /* props: (route) => ({
           breadList:[{path:"",name:"灌溉用水"}, {path:"",name:"水资源管理"}]
         })*/
        },
        {
          path: "irrigate-audit",
          name: "基地灌溉审批",
          component: () =>
            import(/* webpackChunkName: "bm" */ "../pages/irrigateAudit/index")
          /* props: (route) => ({
           breadList:[{path:"",name:"灌溉用水"}, {path:"",name:"泵水审批"}]
         })*/
        },
        {
          path: "irrigate-audit/audit-detail/:id",
          name: "审批详情",
          component: () => import("../components/irrDetail"),
          props: route => ({
            id: route.params.id,
            indexActiveName: route.query.activeName,
            indexCurrentPage: route.query.currentPage,
            breadList: [
              {
                path: "",
                name: "灌溉用水"
              },
              {
                path: "/irrigate-audit",
                name: "泵水审批"
              },
              {
                path: "",
                name: "详情"
              }
            ]
          })
        },
        {
          path: "irrigate-audit/audit-operate/:id",
          name: "审批操作",
          component: () =>
            import(/* webpackChunkName: "bm" */ "../pages/irrigateAudit/audit"),
          props: route => ({
            id: route.params.id,
            indexActiveName: route.query.activeName,
            indexCurrentPage: route.query.currentPage,
            breadList: [
              {
                path: "",
                name: "灌溉用水"
              },
              {
                path: "/irrigate-audit",
                name: "泵水审批"
              },
              {
                path: "",
                name: "审批"
              }
            ]
          })
        },
        {
          path: "irrigate-worker",
          name: "水电工",
          component: () =>
            import(/* webpackChunkName: "bm" */ "../pages/irrigateWorker/index")
        },
        {
          path: "post-info",
          name: "基地发布信息",
          component: () =>
            import(/* webpackChunkName: "bm" */ "../pages/serviceInfo/postInfo")
        },
        {
          path: "BM-view-info",
          name: "基地查看信息",
          component: () =>
            import(/* webpackChunkName: "bm" */ "../pages/serviceInfo/viewInfo")
        },
        {
          path: "view-info",
          name: "教职工查看信息",
          component: () =>
            import(/* webpackChunkName: "bm" */ "../pages/serviceInfo/viewInfo")
        },
        //实习申请列表
        {
          path: "practive-apply",
          name: "教职申请列表",
          component: () =>
            import(/* webpackChunkName: "bm" */ "../pages/practiveApply/index")
        },
        {
          path: "practive-apply/detail/:id",
          name: "实习申请-详情",
          component: () =>
            import(/* webpackChunkName: "bm" */ "../components/prDetail"),
          props: route => ({
            id: route.params.id,
            indexActiveName: route.query.activeName,
            indexCurrentPage: route.query.currentPage,
            breadList: [
              {
                path: "",
                name: "本科生实习申请"
              },
              {
                path: "",
                name: "详情"
              }
            ]
          })
        },
        //实习申请单位领导审核
        {
          path: "practive-leader-audit",
          name: "单位领导审核pr",
          component: () =>
            import(/* webpackChunkName: "bm" */ "../pages/prLeaderAudit/index")
          /* props: (route) => ({
           breadList:[{path:"",name:"审批"}, {path:"",name:"本科生实习审批"}]
         })*/
        },
        {
          path: "practive-leader-audit/audit-detail/:id",
          name: "单位领导审核-详情",
          component: () =>
            import(/* webpackChunkName: "bm" */ "../components/prDetail"),
          props: route => ({
            id: route.params.id,
            indexActiveName: route.query.activeName,
            indexCurrentPage: route.query.currentPage,
            breadList: [
              {
                path: "",
                name: "审批"
              },
              {
                path: "/practive-leader-audit",
                name: "本科生实习审批"
              },
              {
                path: "",
                name: "详情"
              }
            ]
          })
        },
        {
          path: "practive-leader-audit/audit-operate/:id",
          name: "单位领导审核-审核",
          component: () =>
            import(/* webpackChunkName: "bm" */ "../components/prDetail"),
          props: route => ({
            id: route.params.id,
            indexActiveName: route.query.activeName,
            indexCurrentPage: route.query.currentPage,
            operType: "audit",
            auditDev: "leader",
            breadList: [
              {
                path: "",
                name: "审批"
              },
              {
                path: "/practive-leader-audit",
                name: "本科生实习审批"
              },
              {
                path: "",
                name: "审批"
              }
            ]
          })
        },
        //实习申请基地审核
        {
          path: "practive-BM-audit",
          name: "基地审核pr",
          component: () =>
            import(/* webpackChunkName: "bm" */ "../pages/prBMAudit/index")
          /* props: (route) => ({
           breadList:[{path:"",name:"本科生实习"}, {path:"",name:"实习审批"}]
         })*/
        },
        // 实习申请后勤审核
        {
          path: "practive-HQ-audit",
          name: "后勤审核",
          component: () =>
            import(/* webpackChunkName: "bm" */ "../pages/prBMAudit/index")
        },
        // 实习申请白马、后勤详情
        {
          path: "practive-BM-audit/audit-detail/:id",
          name: "基地审核-详情",
          component: () =>
            import(/* webpackChunkName: "bm" */ "../components/prDetail"),
          props: route => ({
            id: route.params.id,
            indexActiveName: route.query.activeName,
            indexCurrentPage: route.query.currentPage,
            breadList: [
              {
                path: "",
                name: "本科生实习"
              },
              {
                path: "/practive-BM-audit",
                name: "实习审批"
              },
              {
                path: "",
                name: "详情"
              }
            ]
          })
        },
        // 实习申请白马、后勤审批
        {
          path: "practive-BM-audit/audit-operate/:id",
          name: "基地审核-审核",
          component: () =>
            import(/* webpackChunkName: "bm" */ "../components/prDetail"),
          props: route => ({
            id: route.params.id,
            operType: "audit",
            auditDev: "bm",
            indexActiveName: route.query.activeName,
            indexCurrentPage: route.query.currentPage,
            breadList: [
              {
                path: "",
                name: "本科生实习"
              },
              {
                path: "/practive-BM-audit",
                name: "实习审批"
              },
              {
                path: "",
                name: "审核"
              }
            ]
          })
        },
        //资源类型管理
        {
          path: "resource-type-management",
          name: "资源类型管理",
          component: () =>
            import(
              /* webpackChunkName: "bm" */ "../pages/resourceManagement/resourceType/index"
            )
        },
        //资源类型跳转
        {
          path: "resource-type-management/jump",
          name: "资源类型跳转",
          component: () =>
            import(
              /* webpackChunkName: "bm" */ "@/pages/resourceManagement/rescourceInfo/jump"
            ),
          props: route => ({
            id: route.query.id,
            typeName: route.query.typeName,
            indexCurrentPage: route.query.currentPage
          })
        },

        //资源信息管理
        /*{
        path: "resource-type-management/info-list/:id",
        name: "资源信息管理",
        component: () => import( /!* webpackChunkName: "personalInfo" *!/ "../pages/resourceManagement/rescourceInfo/index"),
        props: (route) => ({
          id :route.params.id,
        })
      },*/

        //资源入驻管理
        {
          path: "resource-info-management",
          name: "资源入驻管理",
          component: () =>
            import(
              /* webpackChunkName: "bm" */ "../pages/resourceManagement/rescourceInfo/index2"
            )
        },

        //资源入驻管理详情
        {
          path: "/resource-info-management/detail/:id",
          // path: "/resource-type-management/info-list/:id/detail/:id",
          name: "资源信息管理详情",
          component: () =>
            import(
              /* webpackChunkName: "bm" */ "../pages/resourceManagement/resDetail"
            ),
          props: route => ({
            id: route.params.id,
            restypeid: route.query.restypeid,
            indexCurrentPage: route.query.currentPage,
            indexActiveName: route.query.activeName,
            prevPage: "resource-type-management",
            breadList: [
              {
                path: "",
                name: "科教资源"
              },
              {
                path: "/resource-info-management",
                name: "资源日常管理"
              },
              {
                path: "",
                name: "详情"
              }
            ]
          })
        },

        //我的资源
        {
          path: "/resource-apply",
          name: "资源信息申请",
          component: () =>
            import(
              /* webpackChunkName: "bm" */ "../pages/resourceManagement/resourceApply/index"
            )
          /*props: (route) => ({
          id :route.params.id,
          auditDev: "leader"
        })*/
        },

        // 空闲资源
        {
          path: "/idle-resource",
          name: "空闲资源",
          component: () =>
            import(
              /* webpackChunkName: "bm" */ "../pages/resourceManagement/idleResource/index"
            )
        },

        //我的资源详情
        {
          path: "/resource-apply/detail/:id",
          name: "我的资源详情",
          component: () =>
            import(
              /* webpackChunkName: "bm" */ "../pages/resourceManagement/resDetail"
            ),
          props: route => ({
            id: route.params.id,
            restypeid: route.query.restypeid,
            indexCurrentPage: route.query.currentPage,
            indexActiveName: route.query.activeName,
            limitday: route.query.limitday,
            prevPage: "resource-apply",
            breadList: [
              {
                path: "",
                name: "科教资源"
              },
              {
                path: "/resource-info-management",
                name: "资源日常管理"
              },
              {
                path: "",
                name: "详情"
              }
            ]
          })
        },

        // 资源库维护详情
        {
          path: "/jump/detail/:id",
          name: "资源库维护详情",
          component: () =>
            import(
              /* webpackChunkName: "bm" */ "../pages/resourceManagement/resDetail"
            ),
          props: route => ({
            // 某类型下的资源编号
            id: route.params.id,
            indexCurrentPage: route.query.currentPage,
            prevPage: route.query.prevPage,
            // 资源类型
            restypeid: route.query.restypeid
          })
        },

        //我的申请
        {
          path: "/my-apply",
          name: "申请记录",
          component: () =>
            import(
              /* webpackChunkName: "bm" */ "../pages/resourceManagement/myApply/index"
            )
        },

        //资源申请详情
        {
          path: "/my-apply/detail/:id",
          name: "资源申请详情",
          component: () =>
            import(
              /* webpackChunkName: "bm" */ "../pages/resourceManagement/myApply/detail"
            ),
          props: route => ({
            id: route.params.id,
            indexCurrentPage: route.query.currentPage,
            indexActiveName: route.query.activeName,
            breadList: [
              {
                path: "",
                name: "科教资源"
              },
              {
                path: "/my-apply",
                name: "申请记录"
              },
              {
                path: "",
                name: "详情"
              }
            ]
          })
        },

        //单位领导审核列表
        {
          path: "/resource-leader-audit",
          name: "单位领导审核列表",
          component: () =>
            import(
              /* webpackChunkName: "bm" */ "../pages/resourceManagement/resourceAudit/leaderAudit"
            )
        },

        //单位领导查看详情
        {
          path: "/resource-leader-audit/detail/:id",
          name: "单位领导查看详情",
          component: () =>
            import(
              /* webpackChunkName: "bm" */ "../pages/resourceManagement/resourceAudit/detail"
            ),
          props: route => ({
            id: route.params.id,
            indexCurrentPage: route.query.currentPage,
            indexActiveName: route.query.activeName,
            auditDev: "leader",
            breadList: [
              {
                path: "",
                name: "审批"
              },
              {
                path: "/resource-leader-audit",
                name: "科教资源审批"
              },
              {
                path: "",
                name: "详情"
              }
            ]
          })
        },

        //单位领导审核
        {
          path: "/resource-leader-audit/audit/:id",
          name: "单位领导审核",
          component: () =>
            import(
              /* webpackChunkName: "bm" */ "../pages/resourceManagement/resourceAudit/audit"
            ),
          props: route => ({
            id: route.params.id,
            indexCurrentPage: route.query.currentPage,
            indexActiveName: route.query.activeName,
            auditDev: "leader",
            breadList: [
              {
                path: "",
                name: "审批"
              },
              {
                path: "/resource-leader-audit",
                name: "科教资源审批"
              },
              {
                path: "",
                name: "审批"
              }
            ]
          })
        },

        //基地审核列表
        {
          path: "/resource-BM-audit",
          name: "基地审核列表",
          component: () =>
            import(
              /* webpackChunkName: "bm" */ "../pages/resourceManagement/resourceAudit/BMAudit"
            )
        },
        // 费用管理
        {
          path: "/resource-BM-fee",
          name: "基地缴费",
          component: () =>
            import(
              /* webpackChunkName: "bm" */ "../pages/resourceManagement/fee"
            ),
          props: route => ({
            identity: "bm"
          })
        },
        // 费用结算
        {
          path: "/resource-teacher-fee",
          name: "教师查看费用",
          component: () =>
            import(
              /* webpackChunkName: "bm" */ "../pages/resourceManagement/fee"
            ),
          props: route => ({
            identity: "teacher"
          })
        },

        //基地查看详情
        {
          path: "/resource-BM-audit/detail/:id",
          name: "基地查看详情",
          component: () =>
            import(
              /* webpackChunkName: "bm" */ "../pages/resourceManagement/resourceAudit/detail"
            ),
          props: route => ({
            id: route.params.id,
            indexCurrentPage: route.query.currentPage,
            indexActiveName: route.query.activeName,
            auditDev: "bm",
            breadList: [
              {
                path: "",
                name: "科教资源"
              },
              {
                path: "/resource-BM-audit",
                name: "申请审批"
              },
              {
                path: "",
                name: "详情"
              }
            ]
          })
        },

        //基地审核
        {
          path: "/resource-BM-audit/audit/:id",
          name: "基地审核",
          component: () =>
            import(
              /* webpackChunkName: "bm" */ "../pages/resourceManagement/resourceAudit/audit"
            ),
          props: route => ({
            id: route.params.id,
            indexCurrentPage: route.query.currentPage,
            indexActiveName: route.query.activeName,
            auditDev: "bm",
            breadList: [
              {
                path: "",
                name: "科教资源"
              },
              {
                path: "/resource-BM-audit",
                name: "申请审批"
              },
              {
                path: "",
                name: "详情"
              }
            ]
          })
        },

        //维修列表
        {
          path: "/repair-list",
          name: "维修列表",
          component: () =>
            import(
              /* webpackChunkName: "bm" */ "../pages/resourceManagement/repair/index"
            ),
          props: route => ({
            auditDev: "bm"
          })
        },

        //维修记录
        {
          path: "/repair-record-list",
          name: "维修记录",
          component: () =>
            import(
              /* webpackChunkName: "bm" */ "../pages/resourceManagement/repair/index"
            ),
          props: route => ({
            auditDev: "no-bm"
          })
        },

        //规则配置
        {
          path: "/rules",
          name: "规则配置",
          component: () =>
            import(
              /* webpackChunkName: "bm" */ "../pages/resourceManagement/rules/index"
            )
        },

        //科教资源使用
        {
          path: "/spresUse",
          name: "资源使用情况总表",
          component: () =>
            import(/* webpackChunkName: "bm" */ "../pages/summary/spresUse")
        },
        // 科教资源类型的空闲资源
        {
          path: "/spresUnusedList/:id",
          name: "资源未使用情况表",
          component: () =>
            import(
              /* webpackChunkName: "bm" */ "../pages/summary/spResUnusedList.vue"
            ),
          props: route => ({
            typeName: route.query.typeName,
            id: route.params.id
          })
        },

        //各类科教资源使用状况明细表
        {
          path: "/spresUseHistory",
          name: "各类科教资源使用状况明细表",
          component: () =>
            import(
              /* webpackChunkName: "bm" */ "../pages/summary/spresUseHistory"
            )
        },

        //各类科教资源当前使用情况
        {
          path: "/spresUsing",
          name: "各类科教资源当前使用情况",
          component: () =>
            import(/* webpackChunkName: "bm" */ "../pages/summary/spresUsing")
        },

        //故障报修统计
        {
          path: "/spresRepair",
          name: "故障报修统计",
          component: () =>
            import(/* webpackChunkName: "bm" */ "../pages/summary/spresRepair")
        },

        //统计科教资源欠费
        {
          path: "/needPay",
          name: "统计科教资源欠费",
          component: () =>
            import(/* webpackChunkName: "bm" */ "../pages/summary/needPay")
        },

        //统计科研项目
        {
          path: "/projectHistory",
          name: "统计科研项目",
          component: () =>
            import(
              /* webpackChunkName: "bm" */ "../pages/summary/projectHistory"
            )
        },

        // 单位领导统计科研项目
        {
          path: "/projectHistory/leadership",
          name: "本院科研项目统计",
          component: () =>
            import(
              /* webpackChunkName: "bm" */ "../pages/summary/projectHistory"
            ),
          props: () => ({
            isLeader: true
          })
        },

        //统计本科生实习
        {
          path: "/prapply",
          name: "统计本科生实习",
          component: () =>
            import(/* webpackChunkName: "bm" */ "../pages/summary/prapply")
        },
        // 单位领导统计本科生实习
        {
          path: "/prapply/leadership",
          name: "本院基地学生实习统计",
          component: () =>
            import(/* webpackChunkName: "bm" */ "../pages/summary/prapply"),
          props: () => ({
            isLeader: true
          })
        },
        //统计水资源调配
        {
          path: "/irapply",
          name: "统计水资源调配",
          component: () =>
            import(/* webpackChunkName: "bm" */ "../pages/summary/irapply")
        },

        //消息通知
        {
          path: "/message",
          name: "消息通知",
          component: () =>
            import(/* webpackChunkName: "bm" */ "../pages/message/index")
        },

        // 申请查询
        // 泵水申请查询
        {
          path: "/search/irrigateApply",
          name: "泵水申请查询",
          component: () =>
            import(/* webpackChunkName: "bm" */ "../pages/search/irrigateApply")
        },
        // 泵水申请查询 —— 详情
        {
          path: "/search/irrigateApply/:id",
          name: "泵水申请查询详情",
          component: () =>
            import(/* webpackChunkName: "bm" */ "../components/irrDetail"),
          props: route => ({
            id: route.params.id,
            breadList: [
              {
                path: "",
                name: "申请查询"
              },
              {
                path: "/search/irrigateApply",
                name: "泵水申请查询"
              },
              {
                path: "",
                name: "详情"
              }
            ]
          })
        },
        // 实习申请查询
        {
          path: "/search/practiveApply",
          name: "实习申请查询",
          component: () =>
            import(/* webpackChunkName: "bm" */ "../pages/search/practiveApply")
        },
        // 实习申请查询 —— 详情
        {
          path: "/search/practiveApply/:id",
          name: "实习申请查询详情",
          component: () =>
            import(/* webpackChunkName: "bm" */ "../components/prDetail"),
          props: route => ({
            id: route.params.id,
            breadList: [
              {
                path: "",
                name: "申请查询"
              },
              {
                path: "/search/practiveApply",
                name: "实习申请查询"
              },
              {
                path: "",
                name: "详情"
              }
            ]
          })
        },
        // 科教资源申请查询
        {
          path: "/search/resourceApply",
          name: "科教资源申请查询",
          component: () =>
            import(/* webpackChunkName: "bm" */ "../pages/search/resourceApply")
        },
        // 科教资源申请查询 —— 详情
        {
          path: "/search/resourceApply/:id",
          name: "科教资源申请查询详情",
          component: () =>
            import(
              /* webpackChunkName: "bm" */ "../pages/resourceManagement/resourceAudit/detail"
            ),
          props: route => ({
            id: route.params.id,
            breadList: [
              {
                path: "",
                name: "申请查询"
              },
              {
                path: "/search/resourceApply",
                name: "科教资源申请查询"
              },
              {
                path: "",
                name: "详情"
              }
            ]
          })
        },
        {
          path: "/repair/report",
          name: "我的报修",
          component: () =>
            import(/* webpackChunkName: "bm" */ "../pages/repair/report")
        },
        {
          path: "/repair/hq_handle",
          name: "hq报修办理",
          component: () =>
            import(/* webpackChunkName: "bm" */ "../pages/repair/handle")
        },
        {
          path: "/repair/bm_handle",
          name: "报修办理",
          component: () =>
            import(/* webpackChunkName: "bm" */ "../pages/repair/handle")
        }
      ]
    }
  ]
});

// 全局路由导航卫士
/*router.beforeEach((to, from, next) => {

  let userId = store.state.userId;
  let hasPath = to.path.includes("party-info/") || to.path.includes("branch-info") || to.path.includes("member-info");
  let zbOrg = sessionStorage.getItem("zbOrg");

  // 如果没有用户id
  if (!userId) {
    store.dispatch("getUserInfo").then(() => {
      // 如果页面需要用户组织信息
      if (hasPath && zbOrg == null) {
        store.dispatch("getUserOrg", "dp").then(() => {
          next();
        }).catch(err => {
          next();
        })
      } else {
        next();
      }
    }).catch(err => {
      next();
    })
  } else {
    // 如果页面需要用户组织信息
    if (hasPath && zbOrg == null) {
      store.dispatch("getUserOrg", "dp").then(() => {
        next();
      }).catch(err => {
        next();
      })
    } else {
      next();
    }
  }
})*/
export default router;
