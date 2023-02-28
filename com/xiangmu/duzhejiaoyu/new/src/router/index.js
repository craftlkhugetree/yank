import Vue from "vue"
import Router from "vue-router"

Vue.use(Router)

import BasicLayout from "../layout/BasicLayout"
import store from "../store";

const router = new Router({
  // mode: 'history',
  routes: [
    {
      path: "/",
      component: BasicLayout,
      redirect: "quesManage",
      children: [
        {
          path: "/quesManage",
          name: "题库管理",
          component: () => import( /* webpackChunkName: "personalInfo" */ "../pages/quesManagement/index"),
        },
        {
          path: "/noAuth",
          name: "无权限",
          component: () => import( /* webpackChunkName: "personalInfo" */ "../pages/noAuth/index"),
        },
        {
          path: "/quesClassifyManage",
          name: "题库类型管理",
          component: () => import( /* webpackChunkName: "personalInfo" */ "../pages/quesTypeManagement/index"),
        },

        {
          path: "/campusManage",
          name: "校区管理",
          component: () => import( /* webpackChunkName: "personalInfo" */ "../pages/campusManagement/index"),
        },

        {
          path: "/examManage",
          name: "试卷管理",
          component: () => import( /* webpackChunkName: "personalInfo" */ "../pages/examManagement/index"),
        },

        {
          path: "/examManage/set-exam",
          name: "试卷设置",
          component: () => import( /* webpackChunkName: "personalInfo" */ "../pages/examManagement/setExam"),
          props: (route) => ({
            pageType: "add",
            currentPage: Number(route.query.currentPage)
          })
        },

        {
          path: "/examManage/set-exam/:id",
          name: "试卷设置",
          component: () => import( /* webpackChunkName: "personalInfo" */ "../pages/examManagement/setExam"),
          props: (route) => ({
            id: route.params.id,
            pageType: "edit",
            currentPage: Number(route.query.currentPage)
          })
        },

        {
          path: "/userInfo",
          name: "用户信息",
          component: () => import( /* webpackChunkName: "personalInfo" */ "../pages/userManagement/userInfo"),
          props: (route) => ({
            grade: route.query.grade,
            dept: route.query.dept,
          })
        }, {
          path: "/erruserInfo",
          name: "考试异常",
          component: () => import( /* webpackChunkName: "personalInfo" */ "../pages/userManagement/erruserInfo"),
          // props: (route) => ({
          //   dept : route.query.dept
          // })
        },

        {
          path: "/userType",
          name: "用户类型",
          component: () => import( /* webpackChunkName: "personalInfo" */ "../pages/userManagement/userType"),

        },

        {
          path: "/studyManage",
          name: "学习资料管理",
          component: () => import( /* webpackChunkName: "personalInfo" */ "../pages/studyManagement/index.vue"),
        },

        {
          path: "/quesCount",
          name: "题目统计",
          component: () => import( /* webpackChunkName: "personalInfo" */ "../pages/accountManagement/quesAccount"),
        },

        {
          path: "/classCount",
          name: "查询统计",
          component: () => import( /* webpackChunkName: "personalInfo" */ "../pages/accountManagement/classAccount"),
        },
        {
          path: "/collegeCount",
          name: "学院统计",
          component: () => import( /* webpackChunkName: "personalInfo" */ "../pages/accountManagement/collegeAccount"),
        },
        {
          path: "/gradeCount",
          name: "年级统计",
          component: () => import( /* webpackChunkName: "personalInfo" */ "../pages/accountManagement/gradeAccount"),
        },

        // {
        //   path: "/password",
        //   name: "密码管理",
        //   component: () => import( /* webpackChunkName: "personalInfo" */ "../pages/password/index"),
        // },

        {
          path: "/userMatain",
          name: "用户维护",
          component: () => import( /* webpackChunkName: "personalInfo" */ "../pages/userMaintain/index"),
        },
        {
          path: "/roleMatain",
          name: "角色维护",
          component: () => import( /* webpackChunkName: "personalInfo" */ "../pages/roleMaintain/index"),
        },
        {
          path: "/roleMatain/right-management",
          name: "权限管理",
          component: () => import( /* webpackChunkName: "personalInfo" */ "../pages/roleMaintain/rightManagement"),
          props: (route) => ({
            ROLEID: route.query.ROLEID,
          })
        },
        {
          path: "/password",
          name: "修改密码",
          component: () => import( /* webpackChunkName: "personalInfo" */ "../pages/password/index.vue"),
        },
        {
          path: "/setting",
          name: "参数设置",
          component: () => import( /* webpackChunkName: "personalInfo" */ "../pages/setting/index.vue"),
        },
        {
          path: "/activityList",
          name: "活动列表",
          component: () => import( /* webpackChunkName: "personalInfo" */ "../pages/activity/activityList"),
        },
        {
          path: "/activitySign",
          name: "活动签到码",
          component: () => import( /* webpackChunkName: "personalInfo" */ "../pages/activity/activityList/sign"),
          props: (route) => ({
            ID: route.query.ID,
          })
        },
        {
          path: "/activityDraft",
          name: "草稿箱",
          component: () => import( /* webpackChunkName: "personalInfo" */ "../pages/activity/draft"),
        },
        {
          path: "/activityShow",
          name: "活动风采",
          component: () => import( /* webpackChunkName: "personalInfo" */ "../pages/activity/activityshow"),
          props: (route) => ({
            ID: route.query.ID,
            activityNAME: route.query.activityNAME,
          })
        },
        {
          path: "/activityApply",
          name: "报名管理",
          component: () => import( /* webpackChunkName: "personalInfo" */ "../pages/activity/activityApply"),
          props: (route) => ({
            ID: route.query.ID,
            activityNAME: route.query.activityNAME,
          })
        },
        {
          path: "/activityClass",
          name: "活动类别",
          component: () => import( /* webpackChunkName: "personalInfo" */ "../pages/activity/activityClass"),
        },
        {
          path: "/createActivity",
          name: "创建活动",
          component: () => import( /* webpackChunkName: "personalInfo" */ "../pages/activity/activityList/createActivity"),
          props: (route) => ({
            id: route.query.id,
            edit: route.query.edit
          })
        },
        {
          path: "/demo",
          name: "demo",
          component: () => import( /* webpackChunkName: "personalInfo" */ "../pages/activity/demo"),
        },

        // {
        //   path: "/test",
        //   name: "参数设置",
        //   component: () => import( /* webpackChunkName: "personalInfo" */ "../pages/test2"),
        // },

      ]
    }]
})

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
