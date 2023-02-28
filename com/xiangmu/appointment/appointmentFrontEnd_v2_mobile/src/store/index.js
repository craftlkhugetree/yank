import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    GROUPID: "9200001", // 预约平台ID
    ScoolGROUPID: "9200001-1",//全校师生组ID，默认所有人员都属于全校师生组
    userRoles: [], // 用户角色
    userInfo: {}, // 用户信息
    statusList: [  // 状态
      { id: "1-1", name: "已预约" },
      { id: "1-2", name: "审核中" },
      { id: "2", name: "审核通过" },
      { id: "3", name: "审核不通过" },
      { id: "8", name: "已完成" },
      { id: "9", name: "已取消" }
    ],
    isCanCancel: false, // 是否可以取消预约
    appointDay: new Date(),// 选中的预约日期
    currentResDetail: {},//查看的详情页内容
  },
  mutations: {
    setUserRoles(state, data) {
      state.userRoles = data;
    },
    setUserInfo(state, data) {
      state.userInfo = data;
    },
    setIsCanCancel(state, data) {
      state.isCanCancel = data;
    },
    setAppointDay(state, data) {
      state.appointDay = data;
    },
    setCurrentResDetail(state, data) {
      state.currentResDetail = data;
    },

  },
  actions: {},
  modules: {}
});