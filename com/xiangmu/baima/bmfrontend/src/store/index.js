import Vue from "vue";
import Vuex from "vuex";
import util from "../assets/js/util";
import global from "../assets/js/global";
import options from "../assets/js/options";
import VuexPersistence from "vuex-persist";
Vue.use(Vuex);

const vuexLocal = new VuexPersistence({
  storage: window.localStorage
});

const store = new Vuex.Store({
  strict: false,
  plugins: [vuexLocal.plugin]
});

export default new Vuex.Store({
  state: {
    viewUrl: window.g.ApiUrl3 + "rest/FileOut/view/", // 文件地址
    uploadUrl: window.g.ApiUrl3 + "rest/FileOut/saveFile", // 上传地址
    downUrl: window.g.ApiUrl3 + "rest/FileOut/down?ID=", // 下载地址
    isAdmin: false, // 是否管理员
    userInfo: "", // 用户信息
    userId: "", // 用户id
    jzgList: [], //教职工列表
    leaderList: [], //领导列表
    irrtypeList: [], //灌溉资源类型列表
    // 所有角色信息
    roles: [],
    // 本角色
    userRoles: [],
    gLoading: false
  },

  mutations: {
    // 设置是否管理员
    setIsAdmin(state, res) {
      state.isAdmin = res;
    },

    // 设置用户信息
    setUserInfo(state, res) {
      state.userInfo = res;
      state.userId = res.ID;
      sessionStorage.setItem('createId', res.ID)
    },

    //设置灌溉资源类型列表
    setirrtypeList(state, res) {
      state.irrtypeList = res;
    },

    //设置教职工信息
    setJZGList(state, res) {
      state.jzgList = res;
    },

    //
    setLeaderList(state, res) {
      state.leaderList = res;
    },
    // 所有角色
    setRoles(state, data) {
      state.roles = data;
    },
    // 当前角色
    setUserRoles(state, data) {
      state.userRoles = data;
    },
    // 改变loading
    setGLoading(state, data) {
      state.gLoading = data;
    }
  },
  actions: {
    // 获取所有角色信息
    getRoles({ commit }) {
      return new Promise((resolve, reject) => {
        util
          .postAjax({
            code: global.authCode,
            url: "rest/AuthOut/getMyRoles",
            data: { gid: "16000" },
            isRep: true
          })
          .then(res => {
            if (res.success && res.item) {
              commit("setRoles", res.item);
              resolve(res);
            } else {
              reject(res);
            }
          })
          .catch(err => {
            reject(err);
          });
      });
    },

    // 获取用户信息
    getUserInfo({ commit }) {
      return new Promise((resolve, reject) => {
        util
          .postAjax({
            code: global.authCode,
            url: "rest/User/userDetail"
          })
          .then(res => {
            if (res.success && res.item) {
              commit("setUserInfo", res.item);
              options.userInfo = res.item;

              // 获取当前用户角色
              util
                .postAjax({
                  code: global.authCode,
                  url: "rest/AuthOut/getUserRoles",
                  data: { USERID: res.item.ID },
                  isRep: true
                })
                .then(r => {
                  if (r.success && r.data) {
                    commit("setUserRoles", r.data);
                  } else {
                    reject(r);
                  }
                })
                .catch(err => {
                  reject(err);
                });

              resolve(res);
            } else {
              reject(res);
            }
          })
          .catch(err => {
            reject(err);
          });
      });
    },

    // 获取教职工信息
    getJZGList({ commit }) {
      util
        .postAjax({
          code: global.code,
          url: "/user/userList"
        })
        .then(res => {
          if (res.success && res.items) {
            commit("setJZGList", res.items);
          }
        });

      /* return new Promise((resolve, reject) => {
        util.postAjax({
          code: global.code,
          url: "/user/userList"
        })
          .then(res => {
            if (res.success && res.item) {
              commit("setJZGList", res.item);
            } else {
              reject(res);
            }
          }).catch(err => {
          reject(err);
        })
      })*/
    },

    //获取单位领导列表
    getLeaderList({ commit }) {
      return new Promise((resolve, reject) => {
        util
          .postAjax({
            code: global.code,
            url: "/user/userLeaderList"
          })
          .then(res => {
            if (res.success && res.items) {
              commit("setLeaderList", res.items);
              resolve(res);
            } else {
              reject(res);
            }
          })
          .catch(err => {
            reject(err);
          });
      });
    },

    //获取灌溉类型下拉列表
    getResTypeList({ commit }) {
      return new Promise((resolve, reject) => {
        util
          .postAjax({
            code: global.code,
            url: "/irres/typeList"
          })
          .then(res => {
            if (res.success) {
              commit("setirrtypeList", res.items);
              resolve(res);
            } else {
              reject(res);
            }
          })
          .catch(err => {
            reject(err);
          });
      });
    }
  }
});
