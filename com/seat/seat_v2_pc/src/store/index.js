import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    GROUPID: "10006_new", // 座位预约
    userInfo: {}, // 用户信息
    isAdmin: false, // 是否管理员
    statusList: [  // 区间状态
      { value: "1", text: "开放" },
      { value: "2", text: "关闭" },
      { value: "3", text: "临时关闭" },
    ],
    seatOptions: [// 座位素材
      { type: 'wall', value: "4", text: "墙" },
      { type: 'window', value: "6", text: "窗" },
      { type: 'door', value: "5", text: "门" },
      { type: 'pillar', value: "3", text: "书架" },
      { type: 'pass', value: "2", text: "过道" },
      { type: 'seat', value: "1", text: "座位" },
      { type: 'interval-seat', value: "7", text: "疫情座位" },
    ],
  },
  mutations: {

    setUserInfo(state, data) {
      state.userInfo = data;
    },
    setIsAdmin(state, data) {
      state.isAdmin = data;
    },

  },
  actions: {},
  modules: {}
});