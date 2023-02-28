import Vue from "vue";
import Vuex from "vuex";
import util from "../assets/js/util";
import global from "../assets/js/global";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    fileUrl: window.g.fileUrl + "rest/FileOut/view/", // 文件地址
    uploadUrl: window.g.fileUrl + "rest/FileOut/saveFile", // 上传地址
    downUrl: window.g.fileUrl + "rest/FileOut/down?ID=", // 下载地址
    GROUPID: "9100002njit2", // 当前应用的id
    userInfo: {
      userId: "",
      userName: "",
      userOrg: "",
      userOrgId: "",
      userType: "9100002njit2-1" //9100002njit2-1一般用户/9100002njit2-2接报修人员/9100002njit2-3派单人员/9100002njit2-4维修工
    }
  },
  mutations: {
    // 设置用户信息
    setUserInfo(state, data) {
      let userInfo = _.cloneDeep(state.userInfo);
      userInfo = _.assign(userInfo, data);
      state.userInfo = userInfo;
      sessionStorage.setItem("userInfo", JSON.stringify(userInfo));
    },
    // 设置用户部门
    setDeparments(state, data) {
      state.departments = data;
    },
    // 设置用户角色
    setUserRoles(state, res) {
      state.userRoles = res;
    }
  },
  actions: {
    getUserInfo({ commit, state }) {
      util
        .postAjax({
          code: global.authCode,
          url: "rest/AuthOut/getMyRoles",
          data: {
            local: true
          },
          isRep: true
        })
        .then(res => {
          let types = [
            "9100002njit2-2",
            "9100002njit2-3",
            "9100002njit2-4",
            "9100002njit2-1"
          ];
          let usertype = "";
          for (let i = 0; i < types.length; i++) {
            for (let k = 0; k < res.data.length; k++) {
              if (types[i] === res.data[k].ID) {
                usertype = types[i];
                break;
              }
            }
            if (usertype) {
              break;
            }
          }
          commit("setUserInfo", {
            userType: usertype
          });
        });
      util
        .postAjax({
          code: global.authCode,
          url: "rest/User/userDetail"
        })
        .then(res => {
          commit("setUserInfo", {
            userName: res.item.NAME,
            userId: res.item.ID
          });
          util
            .postAjax({
              code: global.authCode,
              url: "rest/UserGroup/getUserGroup",
              data: {
                appid: state.GROUPID
              }
            })
            .then(res => {
              if (res.items) {
                let data = res.items || [];
                let userDept = {};
                if (data.length > 0) {
                  userDept = data[0];
                }
                commit("setUserInfo", {
                  userOrg: userDept.NAME,
                  userOrgId: userDept.ID
                });
              } else {
                commit("setUserInfo", {
                  userOrg: "",
                  userOrgId: "-1"
                });
              }
            });
        });
    }
  }
});
