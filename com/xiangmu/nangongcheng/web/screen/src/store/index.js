import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    GROUPID: '20221123',
    userRoles: [], // 用户角色
    userInfo: {}, // 用户信息
  },
  mutations: {
    setUserRoles(state, data) {
      state.userRoles = data;
    },
    setUserInfo(state, data) {
      state.userInfo = data;
    },
  },
  actions: {},
  modules: {},
});