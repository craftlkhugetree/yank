import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

import Layout from "@/layout/basicLayout"
// import Home from "@/pages"


import search from "@/pages/search/search"
import index from "@/pages/index/index"
import reportOrder from "@/pages/userOrders/reportOrder/reportOrder"
import start from "@/pages/index/start"
import reporterSearch from "@/pages/search/reporterSearch"
import distributerSearch from "@/pages/search/distributerSearch"
import reportedSearch from "@/pages/search/reportedSearch"
import problems from "@/pages/index/problems"
// import OrderDetail from "@/pages/orderDetail/orderDetail"
//一般用户
import userOrderView from "@/pages/userOrders/userOrderView/userOrderView"
import rate from "@/pages/userOrders/rate/rate"

//接报修人员
import reportedOrderList from "@/pages/reporter/reportedList/reportedList"
import createdOrderList from "@/pages/reporter/createdOrder/createdOrderList"
import addOrder from "@/pages/reporter/addOrder/addOrder"
import handleOrder from "@/pages/reporter/handleOrder/handleOrder"
import withdraw from "@/pages/reporter/withdraw/withdraw"
//维修负责任人
import distributeList from "@/pages/distributer/distributeList/distributeList"
import distributeView from "@/pages/distributer/distributeView/distributeView"
import handleDistribute from "@/pages/distributer/handleDistribute/handleDistribute"
import callbackDistribute from "@/pages/distributer/callback/callbackDistribute"
import changeDistribute from "@/pages/distributer/changeDistribute/changeDistribute"
// 维修工
import maintenanceList from "@/pages/maintenance/maintenanceList/maintenanceList"
import repairHandle from "@/pages/maintenance/repairHandle/repairHandle"
import repairSearch from "@/pages/search/repairSearch"
import maintenanceStatistics from "@/pages/maintenance/statistic"
import myStatistics from "@/pages/maintenance/statistic/myStatistics"
// 企业微信
import qyWechat from "@/pages/wechat"
export default new Router({
    routes: [{
            path: '/',
            redirect: '/index',
            component: Layout,
            children: [{
                    path: 'start',
                    name: "start",
                    component: index
                },
                //接保修人员-待办里列表
                {
                    path: '/reportedOrderList',
                    name: 'reportedOrderList',
                    component: reportedOrderList
                },
                {
                    //用户--我要保修
                    path: '/reportOrder/:id',
                    name: 'reportOrder',
                    component: reportOrder
                },
                {
                    //接保修人员-直接录单
                    path: 'createdOrderList',
                    name: 'createdOrderList',
                    component: createdOrderList,

                },
                {
                    //维修负责人维修单列表
                    path: 'distributeList',
                    name: 'distributeList',
                    component: distributeList,

                },
                {
                    //维修工主页（维修单列表）
                    path: 'maintenanceList',
                    name: 'maintenanceList',
                    component: maintenanceList,

                },
                {
                    //维修统计
                    path: 'maintenanceStatistics',
                    name: 'maintenanceStatistics',
                    component: maintenanceStatistics
                }
            ]
        },
        {
            path: "/problems",
            name: 'problems',
            component: problems
        },
        {
            path: '/index',
            name: 'index',
            component: start
        },
        {
            //用户--我要保修
            path: '/reportOrder/:id',
            name: 'reportOrder',
            component: reportOrder
        },
        {
            //用户--打分
            path: '/rate/:id',
            name: 'rate',
            component: rate
        },
        {
            //用户--报修详情/所有从全部保修过来的
            path: '/userOrderView/:id',
            name: 'userOrderView',
            component: userOrderView
        },
        {
            //接报修人员--处理或者转移维修单
            path: '/handleOrder/:id',
            name: 'handleOrder',
            component: handleOrder
        },
        {
            //接报修人员--处理或者转移维修单
            path: '/withdraw/:id',
            name: 'withdraw',
            component: withdraw
        },
        {
            //接保修人员--录单
            path: '/addOrder',
            name: 'addOrder',
            component: addOrder
        },
        {
            //维修负责人--查看单子与处理
            path: '/distributeView/:id',
            name: 'distributeView',
            component: distributeView
        },
        {
            //维修负责人--处理单子（派单重复保修暂不维修已维修
            path: '/handleDistribute/:id',
            name: 'handleDistribute',
            component: handleDistribute
        },
        {
            //维修负责人--退回单子
            path: '/callbackDistribute/:id',
            name: 'callbackDistribute',
            component: callbackDistribute
        },
        {
            //维修负责人--派单后重新办理
            path: '/changeDistribute/:id',
            name: 'changeDistribute',
            component: changeDistribute
        },
        {
            //维修工
            path: '/repairHandle/:id',
            name: 'repairHandle',
            component: repairHandle
        },
        {
            //我的维修量统计
            path: '/myStatistics',
            name: 'myStatistics',
            component: myStatistics
        },
        {
            path: '/search',
            name: 'search',
            component: search,
            props: (route) => ({
                tab: route.query.tab
            })
        },
        {
            path: '/repairSearch',
            name: 'repairsearch',
            component: repairSearch
        },
        {
            path: '/reporterSearch',
            name: 'reportersearch',
            component: reporterSearch
        },
        {
            path: '/reportedSearch',
            name: 'reportedsearch',
            component: reportedSearch
        },
        {
            path: '/distributerSearch',
            name: 'distributersearch',
            component: distributerSearch
        },
        // 企业微信
        {
            path: '/qy-wechat',
            name: 'qyWechat',
            component: qyWechat
        }


    ]
})