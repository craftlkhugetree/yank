import Vue from "vue";
import Vuex from "vuex";
import util from "../assets/js/util";
import common from "../assets/js/common";
import global from "../assets/js/global";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    fileUrl: window.g.fileUrl + "rest/FileOut/view/", // 文件地址
    uploadUrl: window.g.fileUrl + "rest/FileOut/saveFile", // 上传地址
    downUrl: window.g.fileUrl + "rest/FileOut/down?ID=", // 下载地址
    GROUPID: "20230203", // 当前应用的id
    userInfo: {},
    userDepts: [], // 部门
    userRoles: [], // 角色
    departments: [],
    isBack2Report: false,
    form: {},
    reply: "",
    roleName: "",
    userId: "",
    depId: ""
  },
  mutations: {
    // 设置用户信息
    setUserInfo(state, data) {
      state.userInfo = data;
    },
    // 设置用户部门
    setUserDepts(state, data) {
      state.userDepts = data;
    },
    // 设置部门列表
    setDeparments(state, data) {
      state.departments = data;
    },
    // 设置用户角色
    setUserRoles(state, res) {
      state.userRoles = res;
    },
    setIsBack2Report(state, res) {
      state.isBack2Report = res;
    },
    set_reply(state, res) {
      state.reply = res;
    },
    set_form(state, res) {
      state.form = res;
    },
    set_roleName(state, res) {
      state.roleName = res;
    },
    set_userId(state, res) {
      state.userId = res;
    },
    set_depId(state, res) {
      state.depId = res;
    }
  },
  actions: {
    // 获取用户信息
    getUserInfo({ commit }) {
      // 获取用户信息
      util
        .postAjax({
          code: global.authCode,
          url: "rest/User/userDetail"
        })
        .then(res => {
          commit("setUserInfo", res.item);
          sessionStorage.setItem("dd_userInfo", JSON.stringify(res.item));
          common.setStore(global.userId, res.item.ID);
        });
    },

    // 获取用户部门
    getUserDepts({ commit, state }) {
      util
        .postAjax({
          code: global.authCode,
          url: "rest/UserGroup/getUserGroup",
          data: {
            appid: state.GROUPID
          }
        })
        .then(res => {
          commit("setUserDepts", res.items || []);
          sessionStorage.setItem(
            "dd_userDepts",
            JSON.stringify(res.items || [])
          );
        });
    },

    // 获取用户角色
    getUserRoles({ commit, state }) {
      util
        .postAjax({
          code: global.authCode,
          url: "rest/AuthOut/getMyRoles",
          isRep: true,
          data: {
            gid: state.GROUPID,
            local: true
          }
        })
        .then(res => {
          if (res.success && res.data) {
            let roles = res.data.filter(i => i.GROUPID === state.GROUPID);
            roles.forEach(u => {
              let tmp = global.routeId.find(r => r.name === u.NAME) || {};
              for (let p in tmp) {
                u[p] = tmp[p];
              }
            });
            let aim = roles.filter(i => i.path && i.rName) || [];
            commit("setUserRoles", aim);
            sessionStorage.setItem("dd_userRoles", JSON.stringify(aim));
          }
        });
    },

    // 获取部门列表
    getDepartments({ commit, state }) {
      util
        .postAjax({
          code: global.authCode,
          url: "rest/UserGroup/getList",
          data: {
            filter: JSON.stringify({
              APPID: state.GROUPID
            }),
            limit: 10000,
            page: 1,
            ISDELETE: "0"
          }
        })
        .then(res => {
          if (res.success) {
            commit("setDeparments", res.items);
          }
        });
    }
  }
});
