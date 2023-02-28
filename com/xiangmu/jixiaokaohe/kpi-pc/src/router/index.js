import Vue from 'vue'
import VueRouter from 'vue-router'

// 解决ElementUI导航栏中的vue-router在3.0版本以上重复点菜单报错问题
const originalPush = VueRouter.prototype.push
VueRouter.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => err)
}

Vue.use(VueRouter)

import NoRight from "@/views/noRight"
import AdminLayout from "@/layout/layout"
import MonthInput from "@/views/performanceManage/monthInput"
import AnnualBonusInput from "@/views/performanceManage/annualBonusInput"
import Roles from "@/views/sysSetting/roles"
import Users from "@/views/sysSetting/users"
import Group from "@/views/sysSetting/group"
import Salary from "@/views/sysSetting/salary"
import Quota from "@/views/sysSetting/quota"
import LeaderLevel from "@/views/sysSetting/leaderLevel"
import CheckFiles from "@/views/performanceManage/checkFiles/index"
import CheckFilesManage from "@/views/performanceManage/checkFiles/manage"
import AwardDetail from "@/views/performanceManage/awardDetail"
import AwardList from "@/views/performanceManage/awardList"
import AwardListDetail from "@/views/performanceManage/awardList/detail"
import UserKpiList from "@/views/performanceManage/userKpiList"
import UserKpiDetail from "@/views/performanceManage/userKpiList/detail"
import GroupList from "@/views/performanceManage/groupList"
import Check from "@/views/performanceManage/check"
import Release from "@/views/performanceManage/release"
import ReleaseInput from "@/views/performanceManage/releaseInput"
import InputHistory from "@/views/performanceManage/releaseInput/historyInput"
import CheckDetial from "@/views/performanceManage/check/monthDetail"
import CheckYearDetial from "@/views/performanceManage/check/yearDetail"
import ReleaseUncollect from "@/views/performanceManage/release/uncollect"
import ReleaseSystem from "@/views/performanceManage/release/system"
import ReleaseCollected from "@/views/performanceManage/release/collected"
import ReleaseSpecial from "@/views/performanceManage/release/special"

const routes = [
  // 没有权限
  {
    path: "/no-right",
    name: "noRight",
    component: NoRight
  },
  // 管理后台
  {
    path: "/",
    name: "admin",
    component: AdminLayout,
    children: [
      // 个人查询
      {
        path: "/award-detail",
        name: "awardDetail",
        component: AwardDetail
      },
      // 考核文件查看
      {
        path: "/check-files",
        name: "checkFiles",
        component: CheckFiles
      },
      // 月度绩效录入
      {
        path: "/kpi/month-input",
        name: "monthInput",
        component: MonthInput
      },
      // 绩效奖励查询
      {
        path: "/kpi/user-kpi-list",
        name: "userKpiList",
        component: UserKpiList
      },
      // 绩效奖励查询-详情
      {
        path: "/kpi/user-kpi-list/detail/:userid",
        name: "userKpiDetail",
        component: UserKpiDetail,
        props: (route) => ({
          userid: route.params.userid,
          year: route.query.year
        })
      },
      // 年终奖录入
      {
        path: "/kpi/bonus-input",
        name: "annualBonusInput",
        component: AnnualBonusInput
      },
      //考核组信息查看
      {
        path: "/kpi/group-list",
        name: "groupList",
        component: GroupList
      },
      //绩效审核
      {
        path: "/kpi/check",
        name: "check",
        component: Check
      },
      // 审核--详情
      {
        path: "/kpi/check/month/:kpiId",
        name: "checkDetial",
        component: CheckDetial,
        props: (route) => ({
          kpiId: route.params.kpiId,
          isCheck: route.query.isCheck,
          activeTab: route.query.activeTab
        })
      },
      // 审核--详情 年度审核
      {
        path: "/kpi/check/year/:kpiId",
        name: "checkYearDetial",
        component: CheckYearDetial,
        props: (route) => ({
          kpiId: route.params.kpiId,
          isCheck: route.query.isCheck,
          activeTab: route.query.activeTab
        })
      },
      // 发放记录
      {
        path: "/kpi/award-list",
        name: "awardList",
        component: AwardList
      },
      // 发放记录-详情
      {
        path: "/kpi/award-list/detail/:kpiid",
        name: "awardListDetail",
        component: AwardListDetail,
        props: (route) => ({
          kpiid: route.params.kpiid,
          title: route.query.title
        })
      },
      // 绩效考核文件管理
      {
        path: "/kpi-manage/file-manage",
        name: "checkFilesManage",
        component: CheckFilesManage
      },
      // 人员管理
      {
        path: "/kpi-manage/users",
        name: "users",
        component: Users
      },
      // 考核分组管理
      {
        path: "/kpi-manage/group",
        name: "group",
        component: Group
      },
      // 领导岗位级别管理
      {
        path: "/kpi-manage/leader-level",
        name: "leaderLevel",
        component: LeaderLevel
      },
      // 外挂工资管理
      {
        path: "/kpi-manage/salary",
        name: "salary",
        component: Salary
      },
      // 绩效额度管理
      {
        path: "/kpi-manage/quota",
        name: "quota",
        component: Quota
      },
      //绩效发放
      {
        path: "/release",
        name: "release",
        component: Release
      },
      // 绩效发放--详情未汇总
      {
        path: "/release/uncollect/:kpiId",
        name: "releaseUncollect",
        component: ReleaseUncollect,
        props: (route) => ({
          kpiId: route.params.kpiId,
          isCheck: route.query.isCheck,
          orignal: route.query.orignal,
        })
      },
      // 绩效发放--详情未汇总
      {
        path: "/release/collected/:kpiId",
        name: "releaseCollected",
        component: ReleaseCollected,
        props: (route) => ({
          kpiId: route.params.kpiId,
          isCheck: route.query.isCheck,
          orignal: route.query.orignal,
        })
      },

      // 绩效发放--系统生成的部门领导
      {
        path: "/release/system/:kpiId",
        name: "releaseSystem",
        component: ReleaseSystem,
        props: (route) => ({
          kpiId: route.params.kpiId,
          isEdit: route.query.isEdit,
          orignal: route.query.orignal,
        })
      },
      // 绩效发放--特殊发放
      {
        path: "/release/special/:kpiId",
        name: "releaseSpecial",
        component: ReleaseSpecial,
        props: (route) => ({
          kpiId: route.params.kpiId,
          isEdit: route.query.isEdit,
          orignal: route.query.orignal,
        })
      },
      //发放录入
      {
        path: "/input",
        name: "input",
        component: ReleaseInput
      },
      //发放录入记录历史
      {
        path: "/inputHistory",
        name: "inputHistory",
        component: InputHistory
      },

      // 系统配置——角色权限
      {
        path: "sys-setting/roles",
        name: "roles",
        component: Roles
      },
    ]
  }
]

const router = new VueRouter({
  routes,
  mode: "history",
  base: process.env.BASE_URL
})

export default router