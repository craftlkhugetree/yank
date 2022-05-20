import Vue from "vue";
import VueRouter from "vue-router";

Vue.use(VueRouter);
import LoginLayout from "@/layout/loginLayout";
import Login from "@/views/login/login";
import Campus from "@/views/login/campus";
import NewbornLogin from "@/views/login/newbornLogin";
import MainLayout from "@/layout/mainLayout";
import Qjdl from "@/views/qjdl";
import UserCenter from "@/views/userCenter";
import Exam from "@/views/exam";

const routes = [
  {
    path: "/",
    redirect: "/usercenter",
  },
  {
    path: "/loginLayout",
    name: "loginLayout",
    component: LoginLayout,
    children: [
      {
        path: "/login",
        name: "login",
        component: Login,
      },
      {
        path: "/newbornlogin",
        name: "newbornLogin",
        component: NewbornLogin,
      },
      {
        path: "/campus",
        name: "campus",
        component: Campus,
      },
    ],
  },
  {
    path: "/mainLayout",
    name: "mainLayout",
    component: MainLayout,
    children: [
      {
        path: "/qjdl",
        name: "qjdl",
        component: Qjdl,
      },
      {
        path: "/usercenter",
        name: "userCenter",
        component: UserCenter,
      },
      {
        path: "/exam",
        name: "exam",
        component: Exam,
      },
      {
        path: "/exam/learn",
        name: "exam_learn",
        component: () => import("@/views/exam/learn.vue"),
      },
      {
        path: "/exam/learn/:id",
        name: "exam_learn_id",
        component: () => import("@/views/exam/learnId.vue"),
      },
      {
        path: "/exam/examing",
        name: "exam_examing",
        component: () => import("@/views/exam/examing.vue"),
      },
    ],
  },
];

const router = new VueRouter({
  // mode: "history",
  // base: process.env.BASE_URL,
  routes,
});

export default router;
