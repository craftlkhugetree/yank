import Vue from 'vue';
import Router from 'vue-router';
Vue.use(Router);
import store from '../store';

import BasicLayout from '../layout/basicLayout';
import BasicSuccess from '../components/BasicSuccess';
import IrrgateApply from '../pages/irrgate/irrgateApply';
import IrrgateApplyInfo from '../pages/irrgate/irrgateApply/apply';
import IrrgateDetail from '../pages/irrgate/irrgateDetail';
import IrrgateManage from '../pages/irrgate/irrgateManage';
import IrrgateManageAdd from '../pages/irrgate/irrgateManage/manage/addRes';
import IrrgateWorker from '../pages/irrgate/irrgateWorker';
import ServiceInfo from '../pages/serviceInfo';
import ServiceInfoView from '../pages/serviceInfo/fileView';
import Practice from '../pages/practice';
import PracticeApply from '../pages/practice/prApply/apply';
import PracticeDetail from '../pages/practice/prDetail';
import PracticeBm from '../pages/practice/prBm';
import PracticeLeader from '../pages/practice/prLeader';
import EduResStaff from '../pages/eduResource/eduStaff';
import EduResLeader from '../pages/eduResource/eduLeader';
import EduResBm from '../pages/eduResource/eduBm';
import EduResAddType from '../pages/eduResource/resType/addType';
import EduResResInfoManage from '../pages/eduResource/resInfoMange';
import EduResAddResInfo from '../pages/eduResource/resInfoMange/addRes';
import EduResResDetail from '../pages/eduResource/resInfoMange/resDetail';
import EduResStaffResDetail from '../pages/eduResource/resApply/resDetail';
import EduResResUseRecord from '../pages/eduResource/resInfoMange/useRecord';
import EduResApplyDetail from '../pages/eduResource/resApplyDetail';
import EduResApply from '../pages/eduResource/resApply/resApply';
import EduResCallReapir from '../pages/eduResource/resApply/callRepair';
import EduResFileView from '../pages/eduResource/fileView';
import ChooseRole from '../pages/chooseRole';

let router = new Router({
  routes: [
    {
      path: '/',
      redirect: '/choose-role',
    },
    {
      path: '/fun-module',
      name: '功能模块',
      component: () => import('@/pages/funModule'),
    },
    {
      path: '/tab',
      name: 'index',
      component: BasicLayout,
      children: [
        {
          path: '/edures-staff',
          name: '科教资源-教职工',
          component: EduResStaff,
        },
        {
          path: '/edures-leader',
          name: '科教资源-单位领导',
          component: EduResLeader,
        },
        {
          path: '/edures-bm',
          name: '科教资源-白马',
          component: EduResBm,
        },
        {
          path: '/irrgate-apply',
          name: '水资源申请',
          component: IrrgateApply,
        },
        {
          path: '/irrgate-manage',
          name: '水资源管理',
          component: IrrgateManage,
        },
        {
          path: '/service-info',
          name: '农服信息页面',
          component: ServiceInfo,
          props: route => ({
            operType: 'edit',
          }),
        },
        {
          path: '/service-info-view',
          name: '农服信息页面（查看）',
          component: ServiceInfo,
          props: route => ({
            operType: 'view',
          }),
        },
        {
          path: '/practice',
          name: '本科生实习',
          component: Practice,
        },
        {
          path: '/practice-audit-leader',
          name: '单位领导实习审批',
          component: PracticeLeader,
          props: route => ({
            operDev: 'leader',
          }),
        },
        {
          path: '/practice-audit-bm',
          name: '白马实习审批',
          component: PracticeBm,
          props: route => ({
            operDev: 'bm',
          }),
        },
      ],
    },
    {
      path: '/repair',
      name: '在线维修',
      component: () => import('@/pages/repair/repair'),
    },
    {
      path: '/repair/handle',
      name: '维修办理',
      component: () => import('@/pages/repair/repaired/handle'),
    },
    {
      path: '/report',
      name: '在线报修',
      component: () => import('@/pages/repair/report'),
    },
    {
      path: '/report/add',
      name: '新增报修',
      component: () => import('@/pages/repair/editReport'),
    },
    {
      path: '/report/edit',
      name: '编辑报修',
      component: () => import('@/pages/repair/editReport'),
    },
    {
      path: '/report/judge',
      name: '报修评价',
      component: () => import('@/pages/repair/reported/judge'),
    },
    {
      path: '/report/detail',
      name: '报修详情',
      component: () => import('@/pages/repair/reported/detail'),
    },
    {
      path: '/choose-role',
      name: '选择角色',
      component: ChooseRole,
    },
    {
      path: '/irrgate-worker',
      name: '水电工页面',
      component: IrrgateWorker,
    },
    {
      path: '/irrgate-apply/apply',
      name: '水资源申请页面',
      component: IrrgateApplyInfo,
      props: route => ({
        id: route.query.id,
        operType: 'apply',
      }),
    },
    {
      path: '/irrgate-apply/apply-success',
      name: '申请成功页面',
      component: BasicSuccess,
      props: route => ({
        title: '申请成功',
        des: '已发送申请，请耐心等待审批结果',
        path: '/irrgate-apply',
      }),
    },
    {
      path: '/irrgate-apply/detail/:id',
      name: '申请详情',
      component: IrrgateDetail,
      props: route => ({
        id: route.params.id,
      }),
    },
    {
      path: '/irrgate-apply/edit/:id',
      name: '申请编辑页面',
      component: IrrgateApplyInfo,
      props: route => ({
        id: route.params.id,
        operType: 'applyEdit',
      }),
    },
    {
      path: '/irrgate-manage/add',
      name: '灌溉资源新增页面',
      component: IrrgateManageAdd,
    },
    {
      path: '/irrgate-manage/add-success',
      name: '灌溉资源新增成功页面',
      component: BasicSuccess,
      props: route => ({
        title: '提交成功',
        des: '',
        path: '/irrgate-manage',
      }),
    },
    {
      path: '/irrgate-manage/edit/:id',
      name: '灌溉资源编辑页面',
      component: IrrgateManageAdd,
      props: route => ({
        id: route.params.id,
        orgname: route.query.orgname,
      }),
    },
    {
      path: '/irrgate-manage/audit/detail/:id',
      name: '水资源审批详情页面',
      component: IrrgateDetail,
      props: route => ({
        id: route.params.id,
      }),
    },
    {
      path: '/irrgate-manage/audit/edit/:id',
      name: '水资源审批编辑页面',
      component: IrrgateApplyInfo,
      props: route => ({
        id: route.params.id,
        operType: 'auditEdit',
      }),
    },
    {
      path: '/irrgate-manage/audit/audit/:id',
      name: '水资源审批审批页面',
      component: IrrgateDetail,
      props: route => ({
        id: route.params && route.params.id,
        operType: 'audit',
      }),
    },
    {
      path: '/service-info-view/file-view/:fileid',
      name: '农服信息文件预览',
      component: ServiceInfoView,
      props: route => ({
        fileid: route.params.fileid,
        ftype: route.query.ftype,
        title: route.query.title,
      }),
    },
    {
      path: '/practice/apply',
      name: '实习申请',
      component: PracticeApply,
    },
    {
      path: '/practice/apply-success',
      name: '实习申请成功页面',
      component: BasicSuccess,
      props: route => ({
        title: '申请成功',
        des: '已发送申请，请耐心等待审批结果',
        path: '/practice',
      }),
    },
    {
      path: '/practice/edit/:id',
      name: '实习申请编辑页面',
      component: PracticeApply,
      props: route => ({
        id: route.params.id,
      }),
    },
    {
      path: '/practice/detail/:id',
      name: '实习申请详情页面',
      component: PracticeDetail,
      props: route => ({
        id: route.params.id,
      }),
    },
    {
      path: '/practice-audit-leader/audit/:id',
      name: '实习审批单位领导审批页面',
      component: PracticeDetail,
      props: route => ({
        id: route.params.id,
        operDev: 'leader',
        operType: 'audit',
      }),
    },
    {
      path: '/practice-audit-bm/audit/:id',
      name: '实习审批白马审批页面',
      component: PracticeDetail,
      props: route => ({
        id: route.params.id,
        operDev: 'bm',
        operType: 'audit',
      }),
    },
    {
      path: '/practice-audit-bm/edit/:id',
      name: '实习审批白马编辑页面',
      component: PracticeApply,
      props: route => ({
        id: route.params.id,
        operDev: 'bm',
        operType: 'auditEdit',
      }),
    },
    {
      path: '/edures-bm/add-type',
      name: '科教资源-白马-新增资源类型',
      component: EduResAddType,
    },
    {
      path: '/edures-bm/edit-type/:id',
      name: '科教资源-白马-编辑资源类型',
      component: EduResAddType,
      props: route => ({
        id: route.params.id,
      }),
    },
    {
      path: '/edures-bm/res-info-manage/:id',
      name: '科教资源-白马-资源信息管理',
      component: EduResResInfoManage,
      props: route => ({
        id: route.params.id,
      }),
    },
    {
      path: '/edures-bm/res-info-manage/:restypeid/add-res',
      name: '科教资源-白马-资源信息管理-新增',
      component: EduResAddResInfo,
      props: route => ({
        restypeid: route.params.restypeid,
      }),
    },
    {
      path: '/edures-bm/res-info-manage/:restypeid/edit-res/:id',
      name: '科教资源-白马-资源信息管理-编辑',
      component: EduResAddResInfo,
      props: route => ({
        restypeid: route.params.restypeid,
        id: route.params.id,
      }),
    },
    {
      path: '/edures-bm/res-info-manage/:restypeid/detail-res/:id',
      name: '科教资源-白马-资源信息管理-详情',
      component: EduResResDetail,
      props: route => ({
        restypeid: route.params.restypeid,
        id: route.params.id,
      }),
    },
    {
      path: '/edures-staff/res-list/:restypeid/detail-res/:id',
      name: '科教资源-教职工-资源详情',
      component: EduResStaffResDetail,
      props: route => ({
        restypeid: route.params.restypeid,
        id: route.params.id,
      }),
    },
    {
      path: '/edures-bm/res-info-manage/use-records/:id',
      name: '科教资源-白马-资源信息-入驻历史信息',
      component: EduResResUseRecord,
      props: route => ({
        id: route.params.id,
      }),
    },
    {
      path: '/edures-bm/res-audit/:id',
      name: '科教资源-白马-审批页面',
      component: EduResApplyDetail,
      props: route => ({
        id: route.params.id,
        operDev: 'bm',
        operType: 'audit',
      }),
    },
    {
      path: '/edures-leader/res-audit/:id',
      name: '科教资源-单位领导-审批页面',
      component: EduResApplyDetail,
      props: route => ({
        id: route.params.id,
        operDev: 'leader',
        operType: 'audit',
      }),
    },
    {
      path: '/edures/res-apply/detail/:id',
      name: '科教资源-资源申请-详情',
      component: EduResApplyDetail,
      props: route => ({
        id: route.params.id,
      }),
    },
    {
      path: '/edures/file-view/:resid',
      name: '科教资源-文件预览',
      component: EduResFileView,
      props: route => ({
        resid: route.params.resid,
        filetype: route.query.filetype,
      }),
    },
    {
      path: '/edures-staff/res-apply/:usetype/:restypeid/:resid',
      name: '科教资源-资源申请',
      component: EduResApply,
      props: route => ({
        usetype: route.params.usetype, // 1申请  2续租
        restypeid: route.params.restypeid,
        resid: route.params.resid,
        rescode: route.query.rescode,
      }),
    },
    {
      path: '/edures-staff/res-list/call-repair-res/:resid',
      name: '科教资源-资源报修',
      component: EduResCallReapir,
      props: route => ({
        resid: route.params.resid,
      }),
    },
  ],
});

// 全局路由导航卫士
router.beforeEach((to, from, next) => {
  let userRoles = store.state.userRoles;
  // 判断是否获取用户角色，如果没有则重新获取
  if (userRoles.length === 0) {
    store
      .dispatch('getUserInfo')
      .then(() => {
        next();
      })
      .catch(() => {
        next(false);
      });
  } else {
    next();
  }
});

export default router;
