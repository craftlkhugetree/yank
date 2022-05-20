import Vue from 'vue'
import VueRouter from 'vue-router'
Vue.use(VueRouter)


import AdminLayout from "@/layout/layout"
import NotFound from "@/views/notFound"
import NoRight from "@/views/noRight"
import Train from "@/views/train"
import TrainAdd from "@/views/train/editForm"
import TrainDetail from "@/views/train/detail"
import Question from "@/views/question"
import QuestionAdd from "@/views/question/editForm"
import Exam from "@/views/exam"
import ExamRecord from "@/views/exam/record"
import ExamCommonAdd from "@/views/exam/commonEditForm"
import ExamStageAdd from "@/views/exam/stageEditForm"
import Users from "@/views/sysSetting/users"
import UserRecord from "@/views/sysSetting/users/record"
import Params from "@/views/sysSetting/params"
import Modules from "@/views/sysSetting/modules"
import Admin from "@/views/sysSetting/admin"
import QuestionAnalysis from "@/views/analysis/question"
import ExamAnalysis from "@/views/analysis/exam"
import ExamAnalysisDetail from "@/views/analysis/exam/detail"

const routes = [
  // not found
  {
    path: "*",
    component: NotFound
  },
  // 没有权限
  {
    path: "/no-right",
    name: "noRight",
    component: NoRight
  },
  {
    path: '/',
    component: AdminLayout,
    children: [
      // 培训资料
      {
        path: 'train',
        name: 'train',
        component: Train
      },
      // 培训资料——新增资料
      {
        path: 'train/add',
        name: 'trainAdd',
        component: TrainAdd
      },
      // 培训资料——编辑资料
      {
        path: 'train/edit/:id',
        name: 'trainEdit',
        component: TrainAdd,
        props: (route) => ({
          id: route.params.id
        })
      },
      // 培训资料——查看资料
      {
        path: 'train/view/:type/:id',
        name: 'trainDetail',
        component: TrainDetail,
        props: (route) => ({
          id: route.params.id,
          type: route.params.type
        })
      },
      // 题库管理
      {
        path: 'question',
        name: 'question',
        component: Question,
        meta: { "noBg": true }
      },
      // 题库管理——新增题目
      {
        path: 'question/add',
        name: 'questionAdd',
        component: QuestionAdd
      },
      // 题库管理——编辑题目
      {
        path: 'question/edit/:id',
        name: 'questionEdit',
        component: QuestionAdd,
        props: (route) => ({
          id: route.params.id
        })
      },
      // 入馆考试
      {
        path: 'exam',
        name: 'exam',
        component: Exam
      },
      // 入馆考试-考试记录
      {
        path: 'exam/record',
        name: 'examRecord',
        component: ExamRecord
      },
      // 入馆考试-新增普通考试
      {
        path: 'exam/common-add',
        name: 'examCommonAdd',
        component: ExamCommonAdd
      },
      // 入馆考试-编辑普通考试
      {
        path: 'exam/common-edit/:id',
        name: 'examCommonEdit',
        component: ExamCommonAdd,
        props: (route) => ({
          id: route.params.id
        })
      },
      // 入馆考试-新增闯过考试
      {
        path: 'exam/stage-add',
        name: 'examStageAdd',
        component: ExamStageAdd
      },
      // 入馆考试-编辑闯过考试
      {
        path: 'exam/stage-edit/:id',
        name: 'examStageEdit',
        component: ExamStageAdd,
        props: (route) => ({
          id: route.params.id
        })
      },
      // 用户管理
      {
        path: 'sys-setting/users',
        name: 'users',
        component: Users
      },
      // 用户管理-考试记录
      {
        path: 'sys-setting/users/record/:userid',
        name: 'userRecord',
        component: UserRecord,
        props:(route) => ({
          userid: route.params.userid
        })
      },
      // 参数配置
      {
        path: 'sys-setting/params',
        name: 'params',
        component: Params,
        meta: { "noBg" : true }
      },
      // 模块管理
      {
        path: 'sys-setting/modules',
        name: 'modules',
        component: Modules
      },
      // 管理员管理
      {
        path: 'sys-setting/admin',
        name: 'admin',
        component: Admin
      },
      // 题目分析
      {
        path: 'analysis/question',
        name: 'questionAnalysis',
        component: QuestionAnalysis,
        meta: { "noBg": true }
      },
      // 考试分析
      {
        path: 'analysis/exam',
        name: 'examAnalysis',
        component: ExamAnalysis,
        meta: { "noBg": true }
      },
      // 考试分析——详情
      {
        path: 'analysis/exam/:id',
        name: 'examAnalysisDetail',
        component: ExamAnalysisDetail,
        meta: { "noBg": true },
        props: (route) => ({
          examid: route.params.id
        })
      }
    ]
  }
]

const router = new VueRouter({
  // mode: 'history',
  // base: process.env.BASE_URL,
  routes
})


export default router
