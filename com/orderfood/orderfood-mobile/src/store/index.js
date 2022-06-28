import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    GROUPID: "20210729", // 平台ID   20210729
    userInfo: {}, // 用户信息    allShops: [],//所有餐厅的购物车
    reasonInfo: "", //事由
  },
  mutations: {
    setUserInfo(state, data) {
      state.userInfo = data;
    },
    setReasonInfo(state, data) {
      state.reasonInfo = data;
    },
  },
  actions: {},
  modules: {}
});