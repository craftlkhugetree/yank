import Vue from 'vue'
import Router from 'vue-router'
import Store from '../store/index'

Vue.use(Router)

import BasicLayout from '@/layout/BasicLayout'
import LeftMenuLayout from '@/layout/LeftMenuLayout'
import Index from '@/pages'
import RepairApply from '@/pages/repairApply/index'
import Draft from '@/pages/repairApply/draft'
import RepairDispatch from '@/pages/repairManage/dispatch'
import RepairHandle from '@/pages/repairManage/handle'
import RepairRecord from '@/pages/repairManage/record'
import RepairRecordRecord from '@/pages/repairManage/record/record'
import Area from '@/pages/settings/area'
import Goods from '@/pages/settings/goods'
import Dept from '@/pages/settings/dept'
import Workers from '@/pages/settings/workers'
import Roles from '@/pages/settings/roles'
import StatisticsSearch from '@/pages/statistics/search'
import StatisticsRepair from '@/pages/statistics/repair'
import StatisticsRepairHandle from '@/pages/statistics/repairHandle'
import StatisticsMaintain from '@/pages/statistics/maintain'
import SysStatisticsSearch from '@/pages/sysStatistics/search'
import SysStatisticsRepair from '@/pages/sysStatistics/repair'
import SysStatisticsRepairHandle from '@/pages/sysStatistics/repairHandle'
import SysStatisticsMaintain from '@/pages/sysStatistics/maintain'
import CommonFaults from '@/pages/commonFaults'
import Login from '@/pages/login'
import MyRepair from '@/pages/workerRepair/myRepair'
import SelfHelpSearch from '@/pages/statistics/selfHelp'

const router = new Router({
  routes: [{
    path: '/login',
    component: Login
  }, {
    path: '/',
    component: BasicLayout,
    children: [{
      path: '/index',
      name: 'index',
      component: Index
    }, {
      path: '/repair-apply',
      name: 'repairApply',
      component: RepairApply
    }, {
      path: '/draft/:id',
      name: 'draft',
      component: Draft,
      props: (route) => ({
        id: route.params.id
      })
    }, {
      path: '/common-faults',
      name: 'commonFaults',
      component: CommonFaults
    }, {
      path: '/settings',
      name: 'settings',
      component: LeftMenuLayout,
      props: {
        menuType: "系统配置"
      },
      children: [
        //  报修区域
        {
          path: '/settings/area',
          name: 'area',
          component: Area
        },
        //  物品类型
        {
          path: '/settings/goods',
          name: 'goods',
          component: Goods
        },
        //  维修单位
        {
          path: '/settings/dept',
          name: 'dept',
          component: Dept
        },
        //  维修工
        {
          path: '/settings/workers',
          name: 'workers',
          component: Workers
        },
        //  角色权限
        {
          path: '/settings/roles',
          name: 'roles',
          component: Roles
        }
      ]
    }, {
      path: '/repair-manage',
      name: 'repairManage',
      component: LeftMenuLayout,
      props: {
        menuType: "报修管理"
      },
      children: [
        //  维修办理
        {
          path: '/repair-manage/handle',
          name: 'repairHandle',
          component: RepairHandle,
        },
        //  报修录单
        {
          path: '/repair-manage/record',
          name: 'repairRecord',
          component: RepairRecord,
        },
        //  报修录单-录单
        {
          path: '/repair-manage/record/record',
          name: 'repairRecordRecord',
          component: RepairRecordRecord,
        },
        //  派单管理
        {
          path: '/repair-manage/dispatch',
          name: 'repairDispatch',
          component: RepairDispatch,
        }
      ]
    }, {
      // 系统统计
      path: '/sys-statistics',
      name: 'sysStatistics',
      component: LeftMenuLayout,
      redirect: '/sys-statistics/search',
      props: {
        menuType: "系统统计"
      },
      children: [
        //  维修查询
        {
          path: '/sys-statistics/search',
          name: 'sysStatisticsSearch',
          component: SysStatisticsSearch
        },
        //  报修统计
        {
          path: '/sys-statistics/repair',
          name: 'sysSatisticsRepair',
          component: SysStatisticsRepair
        },
        //  报修处理统计
        {
          path: '/sys-statistics/repair-handle',
          name: 'sysStatisticsRepairHandle',
          component: SysStatisticsRepairHandle
        },
        //  维修量统计
        {
          path: '/sys-statistics/maintain',
          name: 'sysStatisticsMaintain',
          component: SysStatisticsMaintain
        }
      ]
    }, {
      // 单位统计
      path: '/dept-statistics',
      name: 'deptStatistics',
      component: LeftMenuLayout,
      redirect: '/dept-statistics/search',
      props: {
        menuType: "单位统计"
      },
      children: [
        //  维修查询
        {
          path: '/dept-statistics/search',
          name: 'deptStatisticsSearch',
          component: StatisticsSearch
        },
        //  自助解决查询
        {
          path: '/dept-statistics/self-help-search',
          name: 'selfHelpSearch',
          component: SelfHelpSearch
        },
        //  报修统计
        {
          path: '/dept-statistics/repair',
          name: 'deptStatisticsRepair',
          component: StatisticsRepair
        },
        //  报修处理统计
        {
          path: '/dept-statistics/repair-handle',
          name: 'deptStatisticsRepairHandle',
          component: StatisticsRepairHandle
        },
        //  维修量统计
        {
          path: '/dept-statistics/maintain',
          name: 'deptStatisticsMaintain',
          component: StatisticsMaintain
        }
      ]
    }, {
      path: '/worker-repair',
      name: 'workerRepair',
      component: LeftMenuLayout,
      props: {
        menuType: "我的维修"
      },
      children: [
        //  我的维修
        {
          path: '/worker-repair/my-repair',
          name: 'myRepair',
          component: MyRepair,
        }
      ]

    }]
  }]
});


export default router;
