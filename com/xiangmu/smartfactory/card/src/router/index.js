import Vue from 'vue';
import VueRouter from 'vue-router';

Vue.use(VueRouter);

import TakeCard from '@/views/takeCard';
import ScanIdCard from '@/views/takeCard/scanIdCard';
import SearchOrder from '@/views/takeCard/searchOrder';
import Success from '@/components/success';
import ReturnCard from '@/views/returnCard';
import AddInCard from '@/views/returnCard/addInCard';
import SearchReturnOrder from '@/views/returnCard/searchOrder';

const routes = [
  {
    path: '/',
    redirect: '/load_unload',
  },
  {
    path: '/load_unload',
    name: 'load_unload',
    component: () => import('@/views/takeCard/load_unload'),
  },
  {
    path: '/takecard',
    name: 'takeCard',
    component: TakeCard,
    redirect: '/takecard/scanidcard',
    children: [
      {
        path: '/takecard/scanidcard',
        name: 'scanIdCard',
        component: ScanIdCard,
      },
      {
        path: '/takecard/searchorder',
        name: 'searchOrder',
        component: SearchOrder,
      },
      {
        path: '/takecard/success',
        name: 'takeSuccess',
        component: Success,
        props: route => ({
          backUrl: '/load_unload',
          text: '取卡成功，10s 后将返回首页…',
        }),
      },
    ],
  },
  {
    path: '/returncard',
    name: 'returnCard',
    component: ReturnCard,
    redirect: '/returncard/addincard',
    children: [
      {
        path: '/returncard/addincard',
        name: 'addInCard',
        component: AddInCard,
      },
      {
        path: '/returncard/searchorder',
        name: 'searchReturnOrder',
        component: SearchReturnOrder,
      },
      {
        path: '/returncard/success',
        name: 'takeSuccess',
        component: Success,
        props: route => ({
          backUrl: '/returncard',
          text: '还卡成功，10s 后将返回首页…',
        }),
      },
    ],
  },
];

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
});

export default router;
