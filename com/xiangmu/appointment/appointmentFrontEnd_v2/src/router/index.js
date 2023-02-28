import Vue from 'vue';
import VueRouter from 'vue-router';

// 解决ElementUI导航栏中的vue-router在3.0版本以上重复点菜单报错问题
const originalPush = VueRouter.prototype.push;
VueRouter.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => err);
};
Vue.use(VueRouter);

import Login from '../views/login';
import AdminLayout from '../layout/admin/layout';
import TplManage from '../views/admin/tplManage';
import ResManage from '../views/admin/resManage';
import Roles from '../views/admin/sysManage/roles';
import UsergroupManage from '../views/admin/usergroupManage';
import EditRes from '../views/admin/resManage/res/editRes';
import ResDetail from '../views/admin/resManage/res/detail';
import AppointManage from '../views/admin/appointManage';
import AuditManage from '../views/admin/auditManage';
import NoRight from '../views/admin/noRight';

import ClientLayout from '../layout/client/layout';
const routes = [
  {
    path: '/login',
    name: 'login',
    component: Login,
  },
  {
    path: '/no-right',
    name: 'noRight',
    component: NoRight,
  },
  // 管理后台
  {
    path: '/admin',
    name: 'admin',
    component: AdminLayout,
    children: [
      // 修改密码
      {
        path: '/changePwd',
        name: 'changePwd',
        component: () => import('@/views/admin/changePwd'),
        meta: {
          showNotInMenu: true,
        },
      },
      // 模板管理
      {
        path: '/tpl-manage',
        name: 'tplManage',
        component: TplManage,
      },
      // 用户组管理
      {
        path: '/usergroup-manage',
        name: 'usergroupManage',
        component: UsergroupManage,
      },
      // 资源管理
      {
        path: '/res-manage',
        name: 'resManage',
        component: ResManage,
      },
      // 资源管理--编辑资源
      {
        path: '/res-manage/edit-res/:resId',
        name: 'editRes',
        component: EditRes,
        props: route => ({
          resId: route.params.resId,
          isCopy: route.query.isCopy,
        }),
      },
      // 资源管理--资源详情
      {
        path: '/res-manage/detail/:resId',
        name: 'resDetail',
        component: ResDetail,
        props: route => ({
          resId: route.params.resId,
        }),
      },
      // 预约管理
      {
        path: '/appoint-manage',
        name: 'appointManage',
        component: AppointManage,
      },
      // 审核管理
      {
        path: '/audit-manage',
        name: 'auditManage',
        component: AuditManage,
      },
      // 系统管理
      {
        path: '/entrance-guard-manage',
        name: 'entGuardManage',
        component: () => import('@/views/admin/entranceGuardManagement'),
      },
      // 系统管理-角色权限
      {
        path: '/sys-manage/roles',
        name: 'roles',
        component: Roles,
      },
      // 系统管理-黑名单管理
      {
        path: '/sys-manage/blacklist',
        name: 'blacklist',
        component: () => import('@/views/admin/sysManage/blacklist'),
      },
      // 统计分析-资源统计
      {
        path: '/analyze/resource',
        name: 'analyzeresource',
        component: () => import('@/views/admin/analyze/resource'),
      },
      // 统计分析-系统统计
      {
        path: '/analyze/system',
        name: 'analyzesystem',
        component: () => import('@/views/admin/analyze/system'),
      },
    ],
  },

  //平台
  {
    path: '/client',
    name: 'client',
    component: ClientLayout,
    children: [
      // 修改密码
      {
        path: '/changeClientPwd',
        name: 'changeClientPwd',
        component: () => import('@/views/client/changePwd'),
        meta: {
          showNotInMenu: true,
        },
      },
      //首页
      {
        path: '/home',
        name: 'home',
        component: () => import('@/views/client/home.vue'),
      },
      //资源列表页
      {
        path: '/list',
        name: 'res-list',
        component: () => import('@/views/client/resource/list.vue'),
      },
      //资源详情页
      {
        path: '/detail/:resId',
        name: 'res-detail',
        component: () => import('@/views/client/resource/detail.vue'),
        props: route => ({
          resId: route.params.resId,
        }),
      },
      //个人中心
      {
        path: '/center',
        name: 'center',
        component: () => import('@/views/client/center/index.vue'),
      },
      //预约详情页
      // {
      //   path: "/appoint-detail",
      //   name: "appointDetail",
      //   component: () => import('@/views/client/center/appointDetail.vue'),
      //   props: (route) => ({
      //     id: route.params.id,
      //   })
      // },
    ],
  },

  {
    path: '/search',
    name: 'res-search',
    component: () => import('@/views/client/resource/searchRes.vue'),
  },
  {
    path: '/',
    redirect: '/home',
  },
];

const router = new VueRouter({
  // mode: "history",
  // base: process.env.BASE_URL,
  routes,
});

export default router;
