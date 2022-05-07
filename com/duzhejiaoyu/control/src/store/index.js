import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

// 数据持久化
import createPersistedState from "vuex-persistedstate"


import {
  fetchModuleList
} from "@/api/modules"
import {
  fetchSchoolList,
  fetchUserTypeList
} from '@/api/params'
import {
  fetchGradeList,fetchDeptList
} from '@/api/users'

export default new Vuex.Store({
  state: {
    appId: "20220216", // 項目ID
    adminRoleId: "110002", // 管理员角色ID
    newbornLogin: null, // 是否新生身份证登录
    userInfo: {}, // 用户信息
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
    // 年级列表
    gradeList: [],
    // 所属列表
    deptList: [],
    // 模块列表
    moduleList: [],
    // 校区列表
    campusList: [],
    // 用户类型
    userTypeList: [],
    // 培训资料形式
    trainTypeList: [{
        label: "视频",
        value: "1"
      },
      {
        label: "文档",
        value: "2"
      },
      {
        label: "在线文章",
        value: "3"
      }
    ],
    // 题目类别
    questionTypeList: [{
        label: "判断题",
        value: "3"
      },
      {
        label: "单选题",
        value: "1"
      },
      {
        label: "多选题",
        value: "2"
      }
    ],
    // 考试类别
    examTypeList: [{
        label: "普通考试",
        value: "1"
      },
      {
        label: "闯关考试",
        value: "2"
      }
    ]
  },

  getters: {},

  mutations: {
    setUserInfo(state, data) {
      state.userInfo = data
    },
    setGradeList(state, data) {
      state.gradeList = data
    },
    setDeptList(state, data) {
      state.deptList = data
    },
    setNewbornLogin(state, data) {
      state.newbornLogin = data
    },
    setModuleList(state, data) {
      state.moduleList = data
    },
    setCampusList(state, data) {
      state.campusList = data
    },
    setUserTypeList(state, data) {
      state.userTypeList = data
    }
  },

  actions: {
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

    // 获取用户类型列表
    getUserTypeList({
      commit
    }) {
      return new Promise((resolve, reject) => {
        fetchUserTypeList({})
          .then(res => {
            if (res.code == "000000") {
              let data = res.data || []
              commit("setUserTypeList", data);
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

    // 获取年级列表
    getGradeList({
      commit
    }) {
      return new Promise((resolve, reject) => {
        fetchGradeList({}).then(res => {
          if (res.code == "000000") {
            let data = res.data || []
            commit("setGradeList", data);
            resolve(data)
          } else {
            reject(res.msg)
          }
        }).catch(err => {
          reject(err)
        })
      })
    },

    // 获取所属列表
    getDeptList({
      commit
    }) {
      return new Promise((resolve, reject) => {
        fetchDeptList({}).then(res => {
          if (res.code == "000000") {
            let data = res.data || []
            commit("setDeptList", data);
            resolve(data)
          } else {
            reject(res.msg)
          }
        }).catch(err => {
          reject(err)
        })
      })
    }
  },

  modules: {},

  plugins: [createPersistedState({
    storage: window.sessionStorage
  })]
})