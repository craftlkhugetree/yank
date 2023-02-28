import Vue from 'vue';
import VueRouter from 'vue-router';

// 解决ElementUI导航栏中的vue-router在3.0版本以上重复点菜单报错问题
const originalPush = VueRouter.prototype.push;
VueRouter.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => err);
};
Vue.use(VueRouter);

import AdminLayout from '@/layout/layout';
const routes = [
  // 管理后台
  {
    path: '/admin',
    name: 'admin',
    component: AdminLayout,
    children: [
      {
        path: '/home',
        name: 'home',
        component: () => import('@/views/home'),
      },
      // 校友捐赠
      {
        path: '/tc/alumnaSponser',
        name: 'alumnaSponser',
        component: () => import('@/views/specialSponser'),
        props: route => ({
          name: route.query.name || '',
          rs: 4,
          identity: '校友',
        }),
      },
      {
        path: '/tc/alumnaSponser/:id',
        name: 'alumnaSponserId',
        component: () => import('@/views/specialSponser/detail'),
        props: route => ({
          id: route.params.id,
          rs: 4,
          route: '/tc/alumnaSponser',
          identity: '校友',
        }),
      },
      // 专家捐赠
      {
        path: '/tc/specialSponser',
        name: 'specialSponser',
        component: () => import('@/views/specialSponser'),
        props: route => ({
          name: route.query.name || '',
          rs: 3,
          identity: '专家',
        }),
      },
      {
        path: '/tc/specialSponser/:id',
        name: 'specialSponserId',
        component: () => import('@/views/specialSponser/detail'),
        props: route => ({
          id: route.params.id,
          rs: 3,
          route: '/tc/specialSponser',
          identity: '专家',
        }),
      },
      // 著作管理
      {
        path: '/tc/famous',
        name: 'famous',
        component: () => import('@/views/famous'),
        props: route => ({
          name: route.query.name || '',
        }),
      },
      // 名师管理
      {
        path: '/tc/teacher',
        name: 'teacher',
        component: () => import('@/views/teacher'),
        props: route => ({
          name: route.query.name || '',
          rs: 2,
        }),
      },
      {
        path: '/tc/teacher/:id',
        name: 'teacherId',
        component: () => import('@/views/teacher/detail'),
        props: route => ({
          id: route.params.id,
          rs: 2,
          route: '/tc/teacher',
        }),
      },
      // 院士管理
      {
        path: '/tc/academician',
        name: 'academician',
        component: () => import('@/views/academician'),
        props: route => ({
          name: route.query.name || '',
          rs: 1,
        }),
      },
      {
        path: '/tc/academician/:id',
        name: 'academicianId',
        component: () => import('@/views/academician/detail'),
        props: route => ({
          id: route.params.id,
          rs: 1,
          route: '/tc/academician',
        }),
      },
    ],
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
