import Vue from 'vue'
import VueRouter from 'vue-router'

VueRouter.prototype.goBack = function() {
  this.isBack = true;
  this.go(-1);
}

Vue.use(VueRouter)

import Home from '@/views/home.vue'
import AwardDetail from '@/views/awardDetail'
import MonthConfirm from '@/views/monthConfirm'
import MonthConfirmDetail from '@/views/monthConfirm/detail'
import YearConfirm from '@/views/yearConfirm'
import YearConfirmDetail from '@/views/yearConfirm/detail'
import Audit from '@/views/audit'
import MonthDetail from '@/views/audit/monthDetail'
import YearDetail from '@/views/audit/yearDetail'
import Record from '@/views/record'
import FileList from '@/views/files/fileList'
import FileView from '@/views/files/fileView'

const routes = [{
    path: '/',
    name: 'home',
    component: Home
  },
  {
    path: '/award-detail',
    name: 'awardDetail',
    component: AwardDetail
  },
  {
    path: '/month-confirm',
    name: 'monthConfirm',
    component: MonthConfirm
  },
  {
    path: '/month-confirm/detail',
    name: 'monthConfirmDetail',
    component: MonthConfirmDetail,
    props: (route) => ({
      confirmType: route.query.confirmType
    })
  },
  {
    path: '/year-confirm',
    name: 'yearConfirm',
    component: YearConfirm
  },
  {
    path: '/year-confirm/detail',
    name: 'yearConfirmDetail',
    component: YearConfirmDetail,
    props: (route) => ({
      confirmType: route.query.confirmType
    })
  },
  {
    path: '/audit',
    name: 'audit',
    component: Audit
  },
  {
    path: '/audit/month-detail',
    name: 'monthDetail',
    component: MonthDetail,
    props: (route) => ({
      auditType: route.query.auditType
    })
  },
  {
    path: '/audit/year-detail',
    name: 'yearDetail',
    component: YearDetail,
    props: (route) => ({
      auditType: route.query.auditType
    })
  },
  {
    path: '/record',
    name: 'record',
    component: Record
  },
  {
    path: '/file-list',
    name: 'fileList',
    component: FileList
  },
  {
    path: '/file-view/:fileid',
    name: 'fileView',
    component: FileView,
    props: (route) => ({
      fileid: route.params.fileid,
      ftype: route.query.ftype,
      title: route.query.title
    })
  }
]

const router = new VueRouter({
  routes,
  mode: "history",
  base: process.env.BASE_URL
})

export default router