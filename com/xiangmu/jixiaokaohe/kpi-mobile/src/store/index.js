import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    GROUPID: "20210604", // 项目ID
    userRoles: [], // 用户角色
    userInfo: {}, // 用户信息
    userDetail: {},  //用户业务相关信息
    levelList: [], // 领导岗位级别列表
    groupList: [], // 考核分组列表
  },
  mutations: {
    setUserRoles(state, data) {
      state.userRoles = data;
    },
    setUserInfo(state, data) {
      state.userInfo = data;
    },
    setUserDetail(state, data) {
      state.userDetail = data;
    },
    setLevelList(state, data) {
      state.levelList = data;
    },
    setGroupList(state, data) {
      state.groupList = data;
    }
  },
  actions: {},
  modules: {}
})