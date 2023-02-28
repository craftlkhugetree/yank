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
    GROUPID: "9100002", // 当前应用的id
    userRoles: [], // 用户角色
    userInfo: {}, // 用户信息
    userMenu: [], // 用户菜单
    userDept: {}, // 用户单位
    deptList: [], // 维修单位列表
    repairTypeList: [
      // 维修类型列表
      {
        id: "1",
        name: "后勤",
      },
      {
        id: "2",
        name: "网络",
      },
      {
        id: "3",
        name: "消防",
      },
    ],
    repairAreaList: [
      // 维修区域
      {
        id: "1",
        name: "学生公寓(卫岗)",
      },
      {
        id: "7",
        name: "学生公寓(浦口)",
      },
      {
        id: "2",
        name: "校园其他楼宇",
      },
      {
        id: "6",
        name: "校园绿化",
      },
      {
        id: "3",
        name: "校园公共区域",
      },
      {
        id: "4",
        name: "家属区",
      },
      {
        id: "5",
        name: "浦口校区",
      },
    ],
    statusList: [
      // 维修状态
      {
        id: "1,2",
        name: "等待派单",
      },
      {
        id: "3",
        name: "维修中",
      },
      {
        id: "4",
        name: "维修完工",
      },
      {
        id: "5",
        name: "维修结束",
      },
    ],
    curItem: "", // 当前报修单
    curRepairItem: "", // 当前维修单
    handleList: [
      // 维修负责人操作列表
      {
        id: "1",
        name: "派单",
      },
      {
        id: "4",
        name: "重复报修",
      },
      {
        id: "3",
        name: "暂不维修",
      },
      {
        id: "2",
        name: "已维修",
      },
      {
        id: "5",
        name: "不维修",
      },
    ],
  },
  mutations: {
    setUserRoles(state, data) {
      state.userRoles = data;
    },
    setUserInfo(state, data) {
      state.userInfo = data;
    },
    setUserMenu(state, data) {
      state.userMenu = data;
    },
    setUserDept(state, data) {
      state.userDept = data;
    },
    setDeptList(state, data) {
      state.deptList = data;
    },
    setCurItem(state, data) {
      state.curItem = data;
    },
    setCurRepairItem(state, data) {
      state.curRepairItem = data;
    },
  },
  actions: {
    // 获取用户角色
    getUserRoles({ commit, state }) {
      return new Promise((resolve, reject) => {
        util
          .postAjax({
            code: global.authCode,
            url: "rest/AuthOut/getMyRoles",
            isRep: true,
            data: {
              gid: state.GROUPID,
              local: true,
            },
          })
          .then((res) => {
            if (res.success && res.data) {
              commit("setUserRoles", res.data);
              resolve(res.data);
            } else {
              reject(res);
            }
          })
          .catch((err) => {
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
            url: "rest/User/userDetail",
          })
          .then((res) => {
            if (res.success) {
              let data = res.item || {};
              commit("setUserInfo", data);
              resolve(data);
            } else {
              reject(res);
            }
          })
          .catch((err) => {
            reject(err);
          });
      });
    },

    // 获取用户菜单
    getUserMenu({ commit, state }) {
      return new Promise((resolve, reject) => {
        util
          .postAjax({
            code: global.menuCode,
            url: "rest/Portal/getUserMenu",
            data: {
              menupid: state.GROUPID,
              local: true,
            },
          })
          .then((res) => {
            let data = res || [];
            commit("setUserMenu", data);

            // 用户所有菜单的链接
            let urls = [];
            data.map((i) => {
              if (i.ISLEAF === "1") {
                urls.push(i.DISPLAYURL);
              } else {
                i.children.forEach((j) => {
                  urls.push(j.DISPLAYURL);
                });
              }
            });

            // 如果没有菜单,则让用户能够访问首页
            if (urls.length == 0) {
              urls.push("/index");
            }

            // 如果有首页，则加上我要报修页面
            if (urls.includes("/index")) {
              urls.push("/repair-apply");
              urls.push("/draft");
            }
            sessionStorage.setItem("urls", JSON.stringify(urls));

            // 如果存在二级菜单, 将二级菜单缓存
            let secondMenus = data.filter(
              (i) => i.children && i.children.length > 0
            );
            secondMenus.forEach((i) => {
              sessionStorage.setItem(i.NAME, JSON.stringify(i.children));
            });

            resolve(urls);
          })
          .catch((err) => {
            reject(err);
          });
      });
    },

    // 获取用户单位
    getUserDept({ commit, state }) {
      return new Promise((resolve, reject) => {
        util
          .postAjax({
            code: global.authCode,
            url: "rest/UserGroup/getUserGroup",
            data: {
              appid: state.GROUPID,
            },
          })
          .then((res) => {
            if (res.success) {
              let data = res.items || [];
              let userDept = {};
              if (data.length > 0) {
                userDept = data[0];
              }
              commit("setUserDept", userDept);
              resolve(data);
            } else {
              reject(res);
            }
          })
          .catch((err) => {
            reject(err);
          });
      });
    },

    // 获取维修单位列表
    getDeptList({ commit, state }) {
      util
        .postAjax({
          code: global.authCode,
          url: "rest/UserGroup/getList",
          data: {
            filter: JSON.stringify({
              APPID: state.GROUPID,
            }),
            limit: 10000,
            page: 1,
            ISDELETE: "0",
          },
        })
        .then((res) => {
          if (res.success) {
            let data = res.items || [];
            commit("setDeptList", data);
          }
        })
        .catch((err) => {});
    },
  },
});
