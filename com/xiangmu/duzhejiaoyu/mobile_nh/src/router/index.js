import Vue from 'vue'
import Router from 'vue-router'
import store from '../store/store'
import HelloWorld from '@/components/HelloWorld'
import basic from '@/pages/basic'
import index from '@/pages/index/index'
import exam from '@/pages/exam/exam'
import examing from '@/pages/exam/examing'
import errlog from '@/pages/exam/errlog'
import fightexam from '@/pages/exam/fightexam'
import fightexaming from '@/pages/exam/fightexaming'
import study from '@/pages/study/study'
import onlinearticle from '@/pages/study/onlinearticle'
import articlepdf from '@/pages/study/articlepdf'
import onlinevideo from '@/pages/study/onlinevideo'
import person from '@/pages/person/person'
import bigthing from '@/pages/person/bigthing'
import campus from '@/pages/bind/campus'
import bind from '@/pages/bind/bind'
import newbind from '@/pages/bind/newbind'

import demo from '@/pages/demo'
import demo1 from '@/pages/demo1'
import demo2 from '@/pages/demo2'
import { Dialog } from 'vant';
Vue.use(Router)
let lresRouter = new Router({
  // mode:'history',
  routes: [
    {
      path: '/',
      name: 'basic',
      component: basic,
      redirect:'campus',
      children:[{
        path: 'bind',
        name: 'bind',
        component: bind,
      },{
        path: 'newbind',
        name: 'newbind',
        component: newbind,
        // component: () =>
        //   import( /* webpackChunkName: "memberInfo" */ "@/pages/bind/newbind"),
        //   props: (route) => ({
        //     campusId: route.query.campusId
        // }),
      },{
        path: 'campus',
        name: 'campus',
        component: campus,
      },{
        path: 'index',
        name: 'index',
        component: index,
      },{
        path: 'exam',
        name: 'exam',
        component: exam,
        meta:{index:'e0'},   //页面下标,可以带到router中
      },{
        path: 'examing',
        name: 'examing',
        // component: examing,
        component: () =>
          import( /* webpackChunkName: "memberInfo" */ "@/pages/exam/examing"),
          props: (route) => ({
            examingDetails1: route.query.examingDetails1
        }),
        meta:{index:'e1'},   //页面下标,可以带到router中
      },{
        path: 'errlog',
        name: 'errlog',
        component: () =>
          import( /* webpackChunkName: "memberInfo" */ "@/pages/exam/errlog"),
        //   props: (route) => ({
        //     errlogDetails: route.query.errlogDetails,
        // }),
      },{
        path: 'fightexam',
        name: 'fightexam',
        // component: fightexam,
        component: () =>
          import( /* webpackChunkName: "memberInfo" */ "@/pages/exam/fightexam"),
          props: (route) => ({
            fightDetails: route.query.fightDetails,
        }),
      },{
        path: 'fightexaming',
        name: 'fightexaming',
        // component: fightexaming,
        component: () =>
          import( /* webpackChunkName: "memberInfo" */ "@/pages/exam/fightexaming"),
        //   props: (route) => ({
        //     fightques: route.query.fightques,
        // }),
      },{
        path: 'study',
        name: 'study',
        component: study,
        meta:{index:'s0'}, 
      },{
        path: 'onlinearticle',
        name: 'onlinearticle',
        // component: onlinearticle,
        component: () =>
          import( /* webpackChunkName: "memberInfo" */ "@/pages/study/onlinearticle"),
          props: (route) => ({
            ended: route.query.ended
        }),
        meta:{index:'s1'}, 
      },{
        path: 'articlepdf',
        name: 'articlepdf',
        // component: articlepdf,
        component: () =>
          import( /* webpackChunkName: "memberInfo" */ "@/pages/study/articlepdf"),
          props: (route) => ({
            ended: route.query.ended
        }),
        meta:{index:'s1'}, 
      },{
        path: 'onlinevideo',
        name: 'onlinevideo',
        // component: onlinevideo,
        component: () =>
          import( /* webpackChunkName: "memberInfo" */ "@/pages/study/onlinevideo"),
          props: (route) => ({
            ended: route.query.ended
        }),
        meta:{index:'s1'}, 
      },{
        path: 'person',
        name: 'person',
        component: person,
        meta:{index:'p0'},   //页面下标,可以带到router中
      },{
        path: 'bigthing',
        name: 'bigthing',
        component: bigthing,
        meta:{index:'p1'},   //页面下标,可以带到router中
      },{
        path: 'demo',
        name: 'demo',
        component: demo,
      },{
        path: 'demo1',
        name: 'demo1',
        component: demo1,
      },{
        path: 'demo2',
        name: 'demo2',
        component: demo2,
        // props:true
      },{
        path: 'myactivity',
        name: 'myactivity',
        // component: onlinevideo,
        component: () =>
          import( /* webpackChunkName: "memberInfo" */ "@/pages/activity/view/myactivity"),
      },{
        path: 'allactivity',
        name: 'allactivity',
        // component: onlinevideo,
        component: () =>
          import( /* webpackChunkName: "memberInfo" */ "@/pages/activity/view/allactivity"),
      },{
        path: 'activityIndex',
        name: 'activityIndex',
        // component: onlinevideo,
        component: () =>
          import( /* webpackChunkName: "memberInfo" */ "@/pages/activity/view/activityIndex"),
      },{
        path: 'datapicker',
        name: 'datapicker',
        // component: onlinevideo,
        component: () =>
          import( /* webpackChunkName: "memberInfo" */ "@/pages/activity/view/datapicker"),
      },{
        path: 'sign',
        name: 'sign',
        // component: onlinevideo,
        component: () =>
          import( /* webpackChunkName: "memberInfo" */ "@/pages/activity/view/sign"),
          props: (route) => ({
            apply: route.query.apply,
            // activityNAME: route.query.activityNAME,
          }),
      },{
        path: 'activitydetail',
        name: 'activitydetail',
        // component: onlinevideo,
        component: () =>
          import( /* webpackChunkName: "memberInfo" */ "@/pages/activity/view/activitydetail"),
          props: (route) => ({
            ID: route.query.ID
        }),
      },
      ]
    }
  ]
})

lresRouter.beforeEach((to,from,next) => {//微信端跳转页面时候路由后面的一长串
  // console.log(to)
  // console.log(from)
  var getUrl = to.fullPath.split('&');//根据&截取
  if(getUrl.length > 1){//如果是数组，就取第一个，就是路由
    next({path:getUrl[0]});
  }else{
    if(from.name=='examing'||from.name=='fightexaming'){
      if(to.name=='errlog'|| to.name =='exam'||to.name=='fightexam'){
        next();
      }else{
        Dialog.confirm({
          message: '是否退出考试？',
        })
        .then(() => {
          next();
        })
      }
    }else{
      next();
    }



    // if(from.name=='examing'){
    //   Dialog.confirm({
    //     message: '是否退出考试？',
    //   })
    //   .then(() => {
    //     next();
    //   })
    // }else{
    //   next();
    // }
  }
})
export default lresRouter