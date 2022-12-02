import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    GROUPID: "9200001", // 预约平台ID
    ScoolGROUPID: "9200001-1",//全校师生组ID
    tplImages: [ // 模板图片列表
      {
        id: "1",
        img: require("@/assets/img/tpl-1.png")
      },
      {
        id: "2",
        img: require("@/assets/img/tpl-2.png")
      },
      {
        id: "3",
        img: require("@/assets/img/tpl-3.png")
      },
      {
        id: "4",
        img: require("@/assets/img/tpl-4.png")
      }
    ],
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
  modules: {}
});