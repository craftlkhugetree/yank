import Vue from 'vue'
import Router from 'vue-router'
import HelloWorld from '@/components/HelloWorld'
import index from '@/pages/index'
import bookreimbursement from '@/pages/bookreimbursement'
import periodicalreimbursement from '@/pages/periodicalreimbursement'
import addupload from '@/pages/addupload'
import adddetail from '@/pages/adddetail'
import detail from '@/pages/detail'

Vue.use(Router)

let bookRouter = new Router({
  // mode:'history',
  routes: [
    {
      path: '/',
      name: 'index',
      component: index
    },{
      path: '/bookreimbursement',
      name: 'bookreimbursement',
      component: bookreimbursement
    },{
      path: '/periodicalreimbursement',
      name: 'periodicalreimbursement',
      component: periodicalreimbursement
    },{
      path: '/addupload',
      name: 'addupload',
      component: addupload
    },{
      path: '/adddetail',
      name: 'adddetail',
      component: adddetail
    },{
      path: '/detail',
      name: 'detail',
      component: detail
    }
  ]
})

bookRouter.beforeEach((to,from,next) => {//微信端跳转页面时候路由后面的一长串
  // console.log(to)
  // console.log(from)
  let getUrl = to.fullPath.split('&');//根据&截取
  if(getUrl.length > 1){//如果是数组，就取第一个，就是路由
    next({path:getUrl[0]});
  }else{
    next();
  }
})

export default bookRouter