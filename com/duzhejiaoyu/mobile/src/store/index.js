import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

// 数据持久化
import createPersistedState from "vuex-persistedstate"


import {
  getLoginUserInfo,
  getIsFirstLogin
} from "@/api/user";
import {
  fetchSchoolList,
  fetchOtherParams
} from '@/api/params'
import {
  fetchModuleList
} from "@/api/modules"

export default new Vuex.Store({
  state: {
    appId: "20220216", // 項目ID
    newbornLogin: {}, // 是否新生身份证登录 val: "1"
    qjdl: {}, // 全景导航地址 val
    userInfo: {}, // 用户信息
    isFirstLogin: false, // 是否第一次登录
    // 校区列表
    campusList: [],
    // 模块列表
    moduleList: [],
    // 当前考试
    curExam: {},  
    // 当前考试题目及答案  
    curExamResult: [],
    // 当前考试对应的所有模块及培训资料
    examLearnData: [],
    // 当前学习模块index及当前培训材料index
    curLearn: {
      modelIndex: 0,
      learnIndex: 0
    },
    // 用户状态列表
    userStatusList: [{
        label: "注销",
        value: "0"
      },
      {
        label: "正常",
        value: "1"
      },
      {
        label: "挂失",
        value: "2"
      },
      {
        label: "停借",
        value: "3"
      },
    ],
    // circular
    isLoading: false,
    time: {now: 0, need: 0},
    tabbarHeight: 0,
  },
  mutations: {
    setNewbornLogin(state, data) {
      state.newbornLogin = data
    },
    setQjdlUrl(state, data) {
      state.qjdl = data
    },
    setUserInfo(state, data) {
      state.userInfo = data
      // state.userInfo.isPassExam = 0
    },
    setIsFirstLogin(state, data) {
      state.isFirstLogin = data
    },
    setCampusList(state, data) {
      state.campusList = data
    },
    setModuleList(state, data) {
      state.moduleList = data
    },
    setCurExam(state, data) {
      state.curExam = data
    },
    setCurExamResult(state, data) {
      state.curExamResult = data
    },
    setExamLearnData(state, data) {
      state.examLearnData = data
    },
    setCurLearn(state, data) {
      state.curLearn = data
    },
    setLoading(state, data) {
      state.isLoading = data
    },
    setTime(state, data) {
      state.time = Object.assign({}, state.time, {...data})
    },
    setTabbarHeight(state, data) {
      state.tabbarHeight = data
    }
  },
  actions: {
    // 获取登录用户信息
    getUserInfo({
      commit
    }) {
      return new Promise((resolve, reject) => {
        getLoginUserInfo({})
          .then(res => {
            if (res.code == "000000") {
              let data = res.data || []
              commit("setUserInfo", data);
              resolve(data)
            } else {
              reject(res.msg)
            }
          })
          .catch(err => {
            reject(err)
          })
      })
    },
    // 是否第一次登录
    getIsFirstLogin({
      commit
    }) {
      return new Promise((resolve, reject) => {
        getIsFirstLogin()
          .then(res => {
            if (res.code == "000000") {
              let data = res.data || []
              commit("setIsFirstLogin", data.isFirstLogin);
              resolve(data)
            } else {
              reject(res.msg)
            }
          })
          .catch(err => {
            reject(err)
          })
      })
    },
    // 获取其他参数：包括是否开启新生登录、全景导航地址
    getConfig({
      commit
    }) {
      return new Promise((resolve, reject) => {
        fetchOtherParams({})
          .then(res => {
            if (res.code == '000000') {
              let data = res.data || []
              let newbornLogin = data.find(i => i.code == 'A2') || {}
              let qjdl = data.find(i => i.code == "A1") || {}
              commit('setNewbornLogin', newbornLogin)
              commit('setQjdlUrl', qjdl)
              resolve(data)
            } else {
              reject(res.msg)
            }
          })
          .catch(err => {
            reject(err)
          })

      })
    },
    // 获取校区列表
    getCampusList({
      commit
    }) {
      return new Promise((resolve, reject) => {
        fetchSchoolList({})
          .then(res => {
            if (res.code == "000000") {
              let data = res.data || []
              commit("setCampusList", data);
              resolve(data)
            } else {
              reject(res.msg)
            }
          })
          .catch(err => {
            reject(err)
          })
      })
    },
    // 获取模块列表
    getModuleList({
      commit
    }) {
      return new Promise((resolve, reject) => {
        fetchModuleList({}).then(res => {
          if (res.code == "000000") {
            let data = res.data || [];
            data.sort((a, b) => {
              return a.level > b.level ? 1 : -1
            })
            commit("setModuleList", data);
            resolve(data)
          } else {
            reject(res.msg)
          }
        }).catch(err => {
          reject(err)
        })
      })
    },
  },
  modules: {},
  plugins: [createPersistedState({
    storage: window.sessionStorage
  })]
})