import Vue from "vue";
import Vuex from "vuex";
import util from "../assets/js/util";
import global from "../assets/js/global";
import common from "../assets/js/common";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    userInfo: "",                // 用户信息
    userId: "", // 用户id
  },


  mutations: {
    // 设置用户信息
    setUserInfo(state, res) {
      state.userInfo = res;
      state.userId = res.ID;
    },
  },
  actions: {
    // 获取用户信息
    getUserInfo({commit}) {
      return new Promise((resolve, reject) => {
        util.postAjax({
          code: global.authCode,
          url: "/User/userDetail"
        })
        .then(res => {
          if (res.success && res.item) {
            commit("setUserInfo", res.item);
          } else {
            reject(res);
          }
        }).catch(err => {
          reject(err);
        })
      })
    },
  }
})
