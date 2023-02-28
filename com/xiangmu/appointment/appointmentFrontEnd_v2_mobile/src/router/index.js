import Vue from 'vue';
import VueRouter from 'vue-router';

Vue.use(VueRouter);

import Start from '@/views/start';
import AppointManage from '@/views/admin/appointManage';
import AppointManageDetail from '@/views/admin/appointManage/appointDetail';
import AppointManageSearch from '@/views/admin/appointManage/search';
import AuditManage from '@/views/admin/auditManage';
import AuditManageDetail from '@/views/admin/auditManage/auditDetail';
import AuditManageSearch from '@/views/admin/auditManage/search';
import TabbarLayout from '../layout/client/tabbarLayout';
import basicLayout from '../layout/client/basicLayout';
const routes = [
  {
    // 功能首页
    path: '/start',
    name: 'start',
    component: Start,
  },
  // 修改密码
  {
    path: '/changePwd',
    name: 'changePwd',
    component: () => import('@/views/admin/changePwd'),
    meta: {
      showNotInMenu: true,
    },
  },
  // 系统管理-黑名单管理
  {
    path: '/sys-manage/blacklist',
    name: 'blacklist',
    component: () => import('@/views/admin/blacklist'),
  },
  // 系统管理-黑名单规则
  {
    path: '/sys-manage/blacklistrule',
    name: 'blacklistrule',
    component: () => import('@/views/admin/blacklist/blacklistrule.vue'),
  },
  // 系统管理-添加黑名单
  {
    path: '/sys-manage/addblacklist',
    name: 'addblacklist',
    component: () => import('@/views/admin/blacklist/addblacklist.vue'),
  },
  // 预约管理
  {
    path: '/appoint-manage',
    name: 'appointManage',
    component: AppointManage,
  },
  // 预约管理-详情
  {
    path: '/appoint-manage/detail/:id',
    name: 'appointManageDetail',
    component: AppointManageDetail,
    props: route => ({
      id: route.params.id,
    }),
  },
  // 预约管理-查询
  {
    path: '/appoint-manage/search',
    name: 'appointManageSearch',
    meta: {
      isSearch: true,
    },
    component: AppointManageSearch,
  },
  // 预约审核
  {
    path: '/audit-manage',
    name: 'auditManage',
    component: AuditManage,
  },
  // 预约审核-详情
  {
    path: '/audit-manage/detail/:id/:activeTab',
    name: 'auditManageDetail',
    component: AuditManageDetail,
    props: route => ({
      id: route.params.id,
      activeTab: route.params.activeTab,
    }),
  },
  // 预约审核-查询
  {
    path: '/audit-manage/search/:activeTab',
    name: 'auditManageSearch',
    meta: {
      isSearch: true,
    },
    component: AuditManageSearch,
    props: route => ({
      activeTab: route.params.activeTab,
    }),
  },

  //用户端
  {
    path: '/client',
    name: 'client',
    component: TabbarLayout,
    children: [
      //首页
      {
        path: '/index',
        name: 'index',
        component: () => import('@/views/client/home.vue'),
      },
      //个人中心
      {
        path: '/center',
        name: 'center',
        component: () => import('@/views/client/center/index.vue'),
      },
      //我的预约
      {
        path: '/appoint',
        name: 'appoint',
        component: () => import('@/views/client/appoint/index'),
      },
    ],
  },
  {
    path: '/resource',
    name: 'resource',
    component: basicLayout,
    children: [
      //更多资源列表页
      {
        path: '/list',
        name: 'res-list',
        component: () => import('@/views/client/resource/resList.vue'),
      },
      //搜索资源
      {
        path: '/resList',
        name: 'res-search',
        component: () => import('@/views/client/resource/searchList.vue'),
      },
      //预约规则
      {
        path: '/appointRule',
        name: 'appoint-rule',
        component: () => import('@/views/client/resource/appointRule.vue'),
      },
      //管理办法
      {
        path: '/manageInfo',
        name: 'manage-info',
        component: () => import('@/views/client/resource/manageInfo.vue'),
      },
      //资源详情页
      {
        path: '/detail/',
        name: 'res-detail',
        component: () => import('@/views/client/resource/resDetail.vue'),
      },
      //预约申请
      {
        path: '/appointApply',
        name: 'appoint-apply',
        component: () => import('@/views/client/resource/appointApply.vue'),
      },
      //预约成功
      {
        path: '/appointSuccess',
        name: 'appoint-success',
        component: () => import('@/views/client/resource/appointSuccess.vue'),
      },

      // 我的预约-详情
      {
        path: '/appoint/detail/:id',
        name: 'appointDetail',
        component: () => import('@/views/client/appoint/appointDetail'),
        props: route => ({
          id: route.params.id,
        }),
      },
      //签到成功
      {
        path: '/checkSuccess',
        name: 'check-success',
        component: () => import('@/views/client/appoint/checkSuccess.vue'),
      },

      //通知消息
      {
        path: '/message',
        name: 'message',
        component: () => import('@/views/client/center/message.vue'),
      },
      //个人中心日历
      {
        path: '/calendar',
        name: 'calendar',
        component: () => import('@/views/client/center/calendar.vue'),
      },
      //资源日历选择
      {
        path: '/selectCalendar',
        name: 'select-calendar',
        component: () => import('@/views/client/resource/components/selectCalendar.vue'),
      },
    ],
  },
];

const router = new VueRouter({
  routes,
});

export default router;
