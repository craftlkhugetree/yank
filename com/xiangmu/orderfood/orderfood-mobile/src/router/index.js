import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

import Home from '@/views/food/home'
import Scan from '@/views/food/scan'
import MenuList from '@/views/food/shop/menuList'
import Record from '@/views/food/record/index'
import Detail from '@/views/food/shop/detail'
import Order from '@/views/food/shop/order'
import OrderSuccess from '@/views/food/shop/orderSuccess'
import OrderSelfSuccess from '@/views/food/shop/orderSelfSuccess'
import OrderFail from '@/views/food/shop/orderFail'
import OrderQuota from '@/views/food/shop/orderQuota'
import Address from '@/views/food/shop/address'
import Reason from '@/views/food/shop/reason'
import CompanyOrder from '@/views/food/record/companyOrder'
import CompanySuccess from '@/views/food/record/components/companySuccess'
import PersonalOrder from '@/views/food/record/personalOrder'
import EditOrder from '@/views/food/record/editOrder'
import SelfSuccess from '@/views/food/record/components/selfSuccess'
import CancelOrder from '@/views/food/record/components/cancelOrder'
import basicLayout from "../layout/client/basicLayout"
import tabbarLayout from "../layout/client/tabbarLayout"

const routes = [{
  path: '/',
  redirect: "/home"
},


{
  path: "/meal",
  name: "meal",
  component: tabbarLayout,
  children: [
    //首页--餐厅列表
    {
      path: '/home',
      name: 'home',
      component: Home
    },
    {
      //扫码页
      path: '/doScan',
      name: 'doScan',
      component: Scan
    },
    //订餐记录
    {
      path: '/record',
      name: 'record',
      component: Record,
    },
  ]
},

{
  path: "/food",
  name: "food",
  component: basicLayout,
  children: [
    //具体餐厅的菜品列表
    {
      path: '/menuList/:shopId',
      name: 'menu-list',
      component: MenuList,
      props: (route) => ({
        shopId: route.params.shopId,
        shopTypeId: route.query.shopTypeId,
      })
    },
    //菜详情页
    {
      path: '/detail/:id',
      name: 'detail',
      component: Detail,
      props: (route) => ({
        id: route.params.id,
      })
    },
    //确认订单
    {
      path: '/order/:shopId',
      name: 'order',
      component: Order,
      props: (route) => ({
        shopId: route.params.shopId,
        shopTypeId: route.query.shopTypeId,
        activeTab: route.query.activeTab,
        isShowAddress: route.query.isShowAddress
      })
    },
    //单位订单提交成功
    {
      path: '/orderSuccess/:shopId',
      name: 'orderSuccess',
      component: OrderSuccess,
      props: (route) => ({
        shopId: route.params.shopId,
      })
    },
    //个人订单支付成功
    {
      path: '/orderSelfSuccess/:shopId',
      name: 'orderSelfSuccess',
      component: OrderSelfSuccess,
      props: (route) => ({
        shopId: route.params.shopId,
      })
    },
    //订单支付失败
    {
      path: '/orderFail/:orderId',
      name: 'orderFail',
      component: OrderFail,
      props: (route) => ({
        orderId: route.params.orderId,
        msg: route.query.msg
      })
    },
    //订单支付超额
    {
      path: '/orderQuota/:orderId',
      name: 'orderQuota',
      component: OrderQuota,
      props: (route) => ({
        orderId: route.params.orderId,
        msg: route.query.msg
      })
    },
    //配送地址
    {
      path: '/address/:adsId',
      name: 'address',
      component: Address,
      props: (route) => ({
        adsId: route.params.adsId,
        isOrder: route.query.shopId,
        shopId: route.query.shopId,
        shopTypeId: route.query.shopTypeId,
        activeTab: route.query.activeTab,
      })
    },
    //订餐事由
    {
      path: '/reason',
      name: 'reason',
      component: Reason,
      props: (route) => ({
        isOrder: route.query.isOrder,
        shopId: route.query.shopId,
        shopTypeId: route.query.shopTypeId,
      })
    },

    //查看餐厅订单
    {
      path: '/companyOrder/:orderId',
      name: 'companyOrder',
      component: CompanyOrder,
      props: (route) => ({
        orderId: route.params.orderId,
      })
    },
    //餐厅确认订单
    {
      path: '/companySuccess/:shopId',
      name: 'companySuccess',
      component: CompanySuccess,
      props: (route) => ({
        shopId: route.params.shopId,
      })
    },
    //查看个人订单
    {
      path: '/personalOrder/:orderId',
      name: 'personalOrder',
      component: PersonalOrder,
      props: (route) => ({
        orderId: route.params.orderId,
      })
    },
    //修改订单
    {
      path: '/editOrder/:shopId',
      name: 'edit-order',
      component: EditOrder,
      props: (route) => ({
        shopId: route.params.shopId,
        orderId: route.query.orderId,
        activeTab: route.query.activeTab,
        isShowAddress: route.query.isShowAddress
      })
    },
    //餐厅确认订单
    {
      path: '/selfSuccess/:shopId',
      name: 'selfSuccess',
      component: SelfSuccess,
      props: (route) => ({
        shopId: route.params.shopId,
      })
    },
    //个人餐厅取消订单
    {
      path: '/cancelOrder/:shopId',
      name: 'cancelOrder',
      component: CancelOrder,
      props: (route) => ({
        shopId: route.params.shopId,
        orderStatus: route.query.orderStatus,
      })
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