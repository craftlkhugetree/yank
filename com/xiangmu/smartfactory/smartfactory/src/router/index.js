import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

import Login from "@/views/login"
import NoRight from "@/views/noRight"
import NotFound from "@/views/notFound"
import EditPwd from "@/views/editPwd"
import Layout from "@/layout"
import Params from "@/views/sysSetting/params"
import User from "@/views/sysSetting/user"
import Menu from "@/views/sysSetting/menu"
import Role from "@/views/sysSetting/role"
import Queuing from "@/views/queuing"
import Ghhw from "@/views/ghhw"
import Card from "@/views/card"
import CardRecord from "@/views/card/record"
import CardEditForm from "@/views/card/editForm"
import CardBack from "@/views/card/back"

const routes = [
  {
    path: '/',
    redirect: '/queuing',
  },
  {
    path: '/login',
    component: Login,
  },
  // not found
  {
    path: '*',
    component: NotFound,
  },
  // 没有权限
  {
    path: '/no-right',
    name: 'noRight',
    component: NoRight,
  },
  // 修改密码
  {
    path: '/edit-pwd',
    name: 'editPwd',
    component: EditPwd,
  },
  {
    path: '/admin',
    name: 'admin',
    component: Layout,
    children: [
      // 系统配置——参数管理
      {
        path: '/sys-setting/params',
        name: 'params',
        component: Params,
      },
      // 系统配置——用户管理
      {
        path: '/sys-setting/user',
        name: 'user',
        component: User,
      },
      // 系统配置——菜单管理
      {
        path: '/sys-setting/menu',
        name: 'menu',
        component: Menu,
      },
      // 系统配置——角色权限
      {
        path: '/sys-setting/role',
        name: 'role',
        component: Role,
      },
      // 排队叫号
      {
        path: '/queuing',
        name: 'queuing',
        component: Queuing,
      },
      // 罐号鹤位管理
      {
        path: '/ghhw',
        name: 'ghhw',
        component: Ghhw,
      },
      // 卸车单录单
      {
        path: '/recordUnload',
        name: 'recordUnload',
        component: () => import('@/views/recordUnload'),
      },
      // 一卡通管理
      {
        path: '/card',
        name: 'card',
        component: Card,
      },
      // 人工开卡
      {
        path: '/card/add',
        name: 'cardAdd',
        component: CardEditForm,
      },
      // 归还卡片
      {
        path: '/card/back',
        name: 'cardBack',
        component: CardBack,
      },
      // 一卡通管理-装车记录
      {
        path: '/card/record/:id',
        name: 'cardRecord',
        component: CardRecord,
        props: route => ({
          id: route.params.id,
        }),
      },
    ],
  },
];

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
