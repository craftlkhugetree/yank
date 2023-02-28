import Vue from 'vue'
import VueRouter from 'vue-router'
// import store from '../store/store'
import basic from '@/pages/basic'
import Login from '@/pages/login'
import Index from '@/pages/index/index'
import Person from '@/pages/person'
import Appoint from '@/pages/appoint/index'
import Monitor from '@/pages/monitor'
import Writemonitor from '@/pages/monitor/writemonitor'
import Selectmonitor from '@/pages/monitor/selectmonitor'
import AppointSelect from '@/pages/appoint/appointSelect'
import OccupySelect from '@/pages/index/occupySelect'
import Rule from '@/pages/rule'
import Notice from '@/pages/notice'
import NoticeDetail from '@/pages/notice/noticeDetail'
import OrderHistory from '@/pages/person/orderHistory'
import MonitorHistory from '@/pages/person/monitorHistory'
import Timedetail from '@/pages/index/timedetail'
import AddCommon from '@/pages/person/addCommon'
import Breakrecord from '@/pages/person/breakrecord'
import Ranking from '@/pages/person/ranking'
import Sign from '@/pages/index/sign'

Vue.use(VueRouter)
const routes = [
  {
    path: "/login",
    component: Login
  },
  {
    path: "/",
    name: "basic",
    component: basic,
    redirect: "index",
    children: [
      {
        path: "index",
        name: "index",
        component: Index
      },
      {
        path: "person",
        name: "person",
        component: Person
      }
    ]
  },
  {
    path: "/camera",
    name: "camera",
    component: () => import("@/camera")
  },
  {
    path: "/appoint",
    name: "appoint",
    component: Appoint
  },
  {
    path: "/monitor",
    name: "monitor",
    component: Monitor
  },
  {
    path: "/writemonitor",
    name: "writemonitor",
    component: Writemonitor,
    props: route => ({
      roomname: route.query.roomname,
      roomid: route.query.roomid,
      seatname: route.query.seatname,
      seatid: route.query.seatid,
      orderid: route.query.orderid,
      type: route.query.type
    })
  },
  {
    path: "/selectmonitor",
    name: "selectmonitor",
    component: Selectmonitor,
    props: route => ({
      roomname: route.query.roomname,
      roomid: route.query.roomid,
      seatname: route.query.seatname,
      seatid: route.query.seatid,
      orderid: route.query.orderid,
      type: route.query.type
    })
  },
  {
    path: "/appointSelect",
    name: "appointSelect",
    component: AppointSelect,
    props: route => ({
      id: route.query.id,
      opendate: route.query.opendate,
      ruleid: route.query.ruleid,
      name: route.query.name,
      location: route.query.location,
      orderunit: route.query.orderunit,
      islocakers: route.query.islocakers
    })
  },
  {
    path: "/occupySelect",
    name: "occupySelect",
    component: OccupySelect,
    props: route => ({
      opentime: route.query.opentime,
      id: route.query.id,
      name: route.query.name,
      location: route.query.location,
      islocakers: route.query.islocakers,
      pickendtime: route.query.pickendtime,
      ruleid: route.query.ruleid,
      seatname: route.query.seatname,
      seatid: route.query.seatid
    })
  },
  {
    path: "/rule",
    name: "rule",
    component: Rule
  },
  {
    path: "/notice",
    name: "notice",
    component: Notice
  },
  {
    path: "/noticeDetail",
    name: "noticeDetail",
    component: NoticeDetail,
    props: route => ({
      id: route.query.id
    })
  },
  {
    path: "/addCommon",
    name: "addCommon",
    component: AddCommon,
    props: route => ({
      onlyid: route.query.onlyid
    })
  },
  {
    path: "/timedetail",
    name: "timedetail",
    component: Timedetail,
    props: route => ({
      sectionname: route.query.sectionname,
      location: route.query.location,
      seatname: route.query.seatname,
      type: route.query.type,
      islocakers: route.query.islocakers
    })
  },
  {
    path: "/orderHistory",
    name: "orderHistory",
    component: OrderHistory
  },
  {
    path: "/monitorHistory",
    name: "monitorHistory",
    component: MonitorHistory
  },
  {
    path: "/breakrecord",
    name: "breakrecord",
    component: Breakrecord
  },
  {
    path: "/ranking",
    name: "ranking",
    component: Ranking
  },
  //签到跳转页面
  {
    path: "/sign",
    name: "sign",
    component: Sign,
    props: route => ({
      signData: route.query.signData
    })
  },
];
const config = require("@/../config");
const router = new VueRouter({
  routes,
  // mode: "history",
  // base: process.env.NODE_ENV === 'production' ? config.build.assetsPublicPath
  //   : config.dev.assetsPublicPath,
})


export default router
