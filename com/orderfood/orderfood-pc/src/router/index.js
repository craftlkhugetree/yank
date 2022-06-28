import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

import NoRight from "@/views/noRight"
import AdminLayout from "@/layout/layout"
import Roles from "@/views/sysSetting/roles"
import Cafe from "@/views/sysSetting/cafe"
import CafeType from "@/views/sysSetting/cafeType"
import Company from "@/views/sysSetting/company"
import Building from "@/views/sysSetting/building"
import FoodSet from "@/views/cafeSetting/food"
import CafeSet from "@/views/cafeSetting/cafe"
import Order from "@/views/order"
import OrderCafe from "@/views/order/cafe"
import ShopCart from "@/views/order/shopCart"
import Detail from "@/views/detail"
import Record from "@/views/record"
import RecordEdit from "@/views/record/edit"
import Settle from "@/views/settle"
import SettledView from "@/views/settle/components/settleView.vue"
import UnsettledView from "@/views/settle/components/unsettleView.vue"
import OrderManage from "@/views/orderManage"
import SettleManage from "@/views/settleManage"
import AccountView from "@/views/settleManage/accountView"
import CafeStatistic from "@/views/statistic/cafe"
import SysStatistic from "@/views/statistic/sys"

const routes = [
  // 没有权限
  {
    path: '/no-right',
    name: 'noRight',
    component: NoRight
  },
  {
    path: '/',
    name: 'admin',
    component: AdminLayout,
    children: [
      // 我要订餐
      {
        path: "order",
        name: "order",
        component: Order,
        meta: { noBg: true }
      },
      // 我要订餐-餐厅
      {
        path: "order/:cafeId",
        name: "orderCafe",
        component: OrderCafe,
        meta: { noBg: true },
        props: (route) => ({
          shopid: route.params.cafeId,
          shopname: route.query.shopname
        })
      },
      // 购物车
      {
        // path: "order/shopCart/:id/:typeid",
        path: "order/shopCart/:id",
        name: "shopCart",
        component: ShopCart,
        props: (route) => ({
          shopid: route.params.id,
          shopname: route.query.name,
          // typeid: route.params.typeid
        })
      },
      // 订餐记录
      {
        path: "record",
        name: "record",
        component: Record
      },
      // 订餐记录——详情
      {
        path: "record/view/:id",
        name: "recordDetail",
        component: Detail,
        props: (route) => ({
          id: route.params.id,
          viewType: "record"
        })
      },
      // 订餐记录——修改
      {
        path: "record/edit/:id",
        name: "recordEdit",
        component: RecordEdit,
        props: (route) => ({
          id: route.params.id
        })
      },
      // 订单管理
      {
        path: "manage",
        name: "manage",
        component: OrderManage
      },
      // 订单管理——详情
      {
        path: "manage/detail/:id",
        name: "manageDetail",
        component: Detail,
        props: (route) => ({
          id: route.params.id,
          viewType: "manage"
        })
      },
      // 餐厅配置——菜品配置
      {
        path: "cafe-setting/food",
        name: "foodSet",
        component: FoodSet
      },
      // 餐厅配置——餐厅配置
      {
        path: "cafe-setting/cafe",
        name: "cafeSet",
        component: CafeSet
      },
      // 系统配置——角色权限
      {
        path: "sys-setting/roles",
        name: "roles",
        component: Roles
      },
      // 系统配置——餐厅管理
      {
        path: "sys-setting/cafe",
        name: "cafe",
        component: Cafe
      },
      // 系统配置——餐厅类别管理
      {
        path: "sys-setting/cafetype",
        name: "cafeType",
        component: CafeType
      },
      // 系统配置——企业管理
      {
        path: "sys-setting/company",
        name: "company",
        component: Company
      },
      // 系统配置——楼宇管理
      {
        path: "sys-setting/building",
        name: "building",
        component: Building
      },
      // 订餐结算
      {
        path: "settle",
        name: "settle",
        component: Settle
      },
      // 未结算记录——详情
      {
        path: "settle/view/unsettled/:id",
        name: "unsettledView",
        component: UnsettledView,
        props: (route) => ({
          id: route.params.id,
          hasTag: route.query.hasTag
        })
      },
      // 订餐结算记录——详情
      {
        path: "settle/view/settled/:id",
        name: "settledView",
        component: SettledView,
        props: (route) => ({
          id: route.params.id,
        })
      },
      // 结帐管理
      {
        path: "checkout",
        name: "checkout",
        component: SettleManage,
        props: (route) => ({
          curActiveTab: route.query.curActiveTab,
        })
      },
      // 转账管理——详情
      {
        path: "checkout/accountView/:id",
        name: "accountView",
        component: AccountView,
        props: (route) => ({
          id: route.params.id,
          curActiveTab: route.query.curActiveTab
        })
      },
      // 餐厅统计
      {
        path: "cafe-statistic",
        name: "cafeStatistic",
        component: CafeStatistic,
        meta: { noBg: true }
      },
      // 系统统计
      {
        path: "sys-statistic",
        name: "sysStatistic",
        component: SysStatistic,
        meta: { noBg: true }
      }
    ]
  }
]

const router = new VueRouter({
  routes,
  mode: "history",
  base: process.env.BASE_URL
})

export default router
