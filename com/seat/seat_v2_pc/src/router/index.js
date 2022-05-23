import Vue from "vue";
import VueRouter from "vue-router";

Vue.use(VueRouter);

import Login from "../views/login";
import Layout from "../layout/layout";
import NoRight from "@/views/noRight";
import SectionManage from "@/views/sectionManage/index.vue";
import UpdateSection from "@/views/sectionManage/updateSection.vue";
import RULES from "@/views/ruleManage/rules/index.vue";
import UpateRule from "@/views/ruleManage/rules/updateRule.vue";
import Params from "@/views/ruleManage/params/index.vue";
import BlackList from "@/views/dailyManage/blacklist/";
import UnsignRecord from "@/views/dailyManage/unsignrecord/";
import Report from "@/views/dailyManage/report/";
import UserManage from "@/views/userManage/";
import AllVisitor from "@/views/statistic/visitors";
import OpenSection from "@/views/statistic/openSection";
import SectionVisitor from "@/views/statistic/sectionVisitor";
import EpidemicLocation from "@/views/epidemicLocation/";
import NoticeInform from "@/views/notice/inform/";
import NoticeRuleInfo from "@/views/notice/ruleinfo/";

const routes = [
  {
    path: "/login",
    name: "login",
    component: Login,
  },
  {
    path: "/no-right",
    name: "noRight",
    component: NoRight,
  },
  //区间管理
  {
    path: "/",
    component: Layout,
    redirect: "/section-manage",
    children: [
      {
        path: "/section-manage",
        name: "sectionManage",
        component: SectionManage,
      },
      //区间编辑
      {
        path: "/section-manage/update/:id",
        name: "updateSection",
        component: UpdateSection,
        props: (route) => ({
          id: route.params.id,
        }),
      },
    ],
  },
  //规则管理
  {
    path: "/rule-manage",
    component: Layout,
    children: [
      //预约规则
      {
        path: "/rule-manage/rules",
        name: "rules",
        component: RULES,
      },
      {
        path: "/rule-manage/rules/update/:id",
        name: "updateRule",
        component: UpateRule,
        props: (route) => ({
          id: route.params.id,
        }),
      },
      //参数设置
      {
        path: "/rule-manage/params",
        name: "params",
        component: Params,
      },
    ],
  },
  //日常管理
  {
    path: "/daily-manage",
    component: Layout,
    children: [
      // 座位预分配
      {
        path: "/daily-manage/preAssign",
        name: "preAssign",
        component: () => import("@/views/dailyManage/preAssign"),
      },
      // 预约记录
      {
        path: "/daily-manage/preAssign/:id",
        name: "assignRecord",
        component: () => import("@/views/dailyManage/preAssign/assignRecord"),
        props: (route) => ({
          id: route.query.id,
          name: route.query.name,
        }),
      },
      // 预约的区间座位信息
      {
        path: "/daily-manage/preAssign/assignMap",
        name: "assignMap",
        component: () => import("@/views/dailyManage/preAssign/assignDialog"),
        props: (route) => ({
          row: route.query.row
        }),
      },

      //黑名单
      {
        path: "/daily-manage/blacklist",
        name: "blacklist",
        component: BlackList,
      },
      //未签到记录
      {
        path: "/daily-manage/unsignrecord",
        name: "unsignrecord",
        component: UnsignRecord,
      },
      //占座举报
      {
        path: "/daily-manage/report",
        name: "report",
        component: Report,
      },
    ],
  },
  //用户管理
  {
    path: "/user",
    component: Layout,
    children: [
      {
        path: "/user-manage",
        name: "user-manage",
        component: UserManage,
      },
    ],
  },
  //统计查询
  {
    path: "/statistic",
    component: Layout,
    children: [
      {
        path: "/statistic/all-visitor",
        name: "all-visitor",
        component: AllVisitor,
      },
      {
        path: "/statistic/open-section",
        name: "open-section",
        component: OpenSection,
      },
      {
        path: "/statistic/section-visitor",
        name: "section-visitor",
        component: SectionVisitor,
      },
    ],
  },
  //疫定位
  {
    path: "/epidemic",
    component: Layout,
    children: [
      {
        path: "/epidemic-location",
        name: "epidemic-location",
        component: EpidemicLocation,
      },
    ],
  },

  //通知公告
  {
    path: "/notice",
    component: Layout,
    children: [
      {
        path: "/notice-inform",
        name: "notice-inform",
        component: NoticeInform,
      },
      {
        path: "/notice-ruleinfo",
        name: "notice-ruleinfo",
        component: NoticeRuleInfo,
      },
    ],
  },
];

const router = new VueRouter({
  routes,
  // mode: "history",
  // base: process.env.BASE_URL
});

export default router;
