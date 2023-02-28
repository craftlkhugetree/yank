import Vue from 'vue'
import Router from 'vue-router'
import home from "../pages/home"
import check from "../pages/check/check"
import checked from "../pages/checked/checked"
import count from "../pages/count/count"
import remark from "../pages/remark/remark"
import backup from "../pages/backup/backup"

Vue.use(Router)

let lresRouter= new Router({
  routes: [
    {
      path: '/',
      redirect:"/check",
      name: 'home',
      component: home,
      children:[
        {
          path: '/check',
          name: 'check',
          component: check,
        },{
          path: '/checked',
          name: 'checked',
          component: checked,
        },{
          path: '/count',
          name: 'count',
          component: count,
        },{
          path: '/remark',
          name: 'remark',
          component: remark,
        },{
          path: '/backup',
          name: 'backup',
          component: backup,
        },
      ]
    }
  ]
});

lresRouter.beforeEach((to,from,next)=>{
  let toPath = to.fullPath.split("&");
  if(toPath.length > 1){
    next({path:toPath[0]});
  }else{
    next();
  }
})

export default lresRouter;
