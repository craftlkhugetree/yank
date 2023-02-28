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
import NoRight from '../views/admin/noRight';
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
      // 校友捐赠
      {
        path: '/tc/alumnaSponser',
        name: 'alumnaSponser',
        component: () => import('@/views/admin/alumnaSponser'),
      },
      {
        path: '/tc/alumnaSponser/:id',
        name: 'alumnaSponserId',
        component: () => import('@/views/admin/alumnaSponser/detail'),
        props: route => ({
          id: route.params.id,
        }),
      },
      // 专家捐赠
      {
        path: '/tc/specialSponser',
        name: 'specialSponser',
        component: () => import('@/views/admin/specialSponser'),
      },
      {
        path: '/tc/specialSponser/:id',
        name: 'specialSponserId',
        component: () => import('@/views/admin/specialSponser/detail'),
        props: route => ({
          id: route.params.id,
        }),
      },
      // 著作管理
      {
        path: '/tc/famous',
        name: 'famous',
        component: () => import('@/views/admin/famous'),
      },
      // 古籍管理
      {
        path: '/tc/old',
        name: 'old',
        component: () => import('@/views/admin/old'),
      },
      // 名师管理
      {
        path: '/tc/teacher',
        name: 'teacher',
        component: () => import('@/views/admin/teacher'),
      },
      {
        path: '/tc/teacher/:id',
        name: 'teacherId',
        component: () => import('@/views/admin/teacher/detail'),
        props: route => ({
          id: route.params.id,
        }),
      },
      // 院士管理
      {
        path: '/tc/academician',
        name: 'academician',
        component: () => import('@/views/admin/academician'),
      },
      {
        path: '/tc/academician/:id',
        name: 'academicianId',
        component: () => import('@/views/admin/academician/detail'),
        props: route => ({
          id: route.params.id,
        }),
      },
      // 系统管理-角色权限
      {
        path: '/sys-manage/roles',
        name: 'roles',
        component: () => import('@/views/sysManage/roles'),
      },
      // 系统管理-用户管理
      {
        path: '/sys-manage/user',
        name: 'user',
        component: () => import('@/views/sysManage/user'),
      },
      // 系统管理-用户中心
      {
        path: '/sys-manage/user-center',
        name: 'user-center',
        component: () => import('@/views/sysManage/userCenter'),
      },
    ],
  },
  {
    path: '/',
    redirect: '/tc/academician',
  },
];

const router = new VueRouter({
  // mode: "history",
  // base: process.env.BASE_URL,
  routes,
});

export default router;
