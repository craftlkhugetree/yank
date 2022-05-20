import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

import LoginLayout from "@/views/login/layout"
import Login from "@/views/login/login"
import Campus from "@/views/login/campus"
import NewbornLogin from "@/views/login/newbornLogin"
import Layout from "@/layout/layout"
import Qjdl from "@/views/qjdl"
import Exam from "@/views/exam"
import ExamLearn from "@/views/exam/learn"
import ExamExaming from "@/views/exam/examing"
import ExamResult from "@/views/exam/examResult"
import UserCenter from "@/views/userCenter"

const routes = [{
  path: "/",
  redirect: "/exam",
}, {
  path: "/login-layout",
  name: "loginLayout",
  component: LoginLayout,
  children: [{
    path: "/login",
    name: "login",
    component: Login
  },{
    path: "/newbornlogin",
    name: "newbornLogin",
    component: NewbornLogin
  },{
    path: "/campus",
    name: "campus",
    component: Campus
  }]
},{
  path: "/layout",
  name: "layout",
  component: Layout,
  children: [{
    path: "/qjdl",
    name: "qjdl",
    component: Qjdl
  },{
    path: "/exam",
    name: "exam",
    component: Exam
  },{
    path: "/exam/learn",
    name: "examLearn",
    component: ExamLearn
  },{
    path: "/exam/examing",
    name: "examExaming",
    component: ExamExaming
  },{
    path: "/exam/result",
    name: "examResult",
    component: ExamResult
  },{
    path: "/usercenter",
    name: "userCenter",
    component: UserCenter
  }]
}]

const router = new VueRouter({
  // mode: 'history',
  // base: process.env.BASE_URL,
  routes
})

export default router