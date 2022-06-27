import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    GROUPID: "20210729", // 项目ID
    userRoles: [], // 用户角色
    userInfo: {}, // 用户信息
    typeList: [],  // 菜品分类
    msgList: [],   // 消息列表
    loading: false,
  },
  mutations: {
    setLoading(state, data) {
      state.loading = data;
    },
    setUserRoles(state, data) {
      state.userRoles = data;
    },
    setUserInfo(state, data) {
      state.userInfo = data;
    },
    setTypeList(state, data) {
      state.typeList = data;
    },
    setMsgList(state, data) {
      state.msgList.push(data);
    }
  },
  actions: {
  },
  modules: {}
})