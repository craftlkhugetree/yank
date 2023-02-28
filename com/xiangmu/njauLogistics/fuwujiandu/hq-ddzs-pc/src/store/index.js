import Vue from "vue";
import Vuex from "vuex";
import util from "../assets/js/util";
import global from "../assets/js/global";
import {
  stat
} from "fs";
import _ from 'loadsh'
Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    fileUrl: window.g.fileUrl + "rest/FileOut/view/", // 文件地址
    uploadUrl: window.g.fileUrl + "rest/FileOut/saveFile", // 上传地址
    downUrl: window.g.fileUrl + "rest/FileOut/down?ID=", // 下载地址
    GROUPID: "20230203", // 当前应用的id
    userInfo: {
      userName: "李恒贝",
      userID: "",
      userOrg: "",
      userOrgId: ""
    },
    departments: [],
    setMenu: [], // 系统设置菜单
    statsMenu: [], // 统计分析菜单
    userAuthedMenu: [],
    userRoles: [],
  },
  mutations: {
    setUserInfo(state, data) {
      let userInfo = _.cloneDeep(state.userInfo);
      userInfo = _.assign(userInfo, data);
      state.userInfo = userInfo;
      sessionStorage.setItem('userInfo', JSON.stringify(userInfo));
    },
    setDeparments(state, data) {
      state.departments = data;
    },
    setSetMenu(state, data) {
      state.setMenu = data;
    },
    setStatsMenu(state, data) {
      state.statsMenu = data;
    },
    setUserAuthedMenu(state, data) {
      state.userAuthedMenu = data;
    },
    setUserRoles(state, res) {
      state.userRoles = res;
    },
  },
  actions: {
    getUserInfo({
      commit,
      state
    }) {
      util
        .postAjax({
          code: global.authCode,
          url: "rest/UserGroup/getUserGroup",
          data: {
            appid: state.GROUPID
          }
        })
        .then((res) => {
          // let deptids = [];
          // _.forEach(res.data, data => {
          //     deptids.push(data.id);
          // })
          let data = res.items || [];
          commit("setUserInfo", {
            userOrgId: data
          });
        });
      util
        .postAjax({
          code: global.authCode,
          url: "rest/User/userDetail",
        })
        .then((res) => {
          commit("setUserInfo", {
            userName: res.item.NAME || '',
            userID: res.item.ID || ''
          });

        });

    },
    getDepartments({
      commit,
      state
    }) {
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
        .then((res) => {
          if (res.success) {
            commit("setDeparments", res.items);
          }
        })
    },
    getUserMenu({
      commit
    }) {
      return new Promise((reslove, reject) => {
        util
          .postAjax({
            code: global.menuCode,
            url: "/rest/Portal/getUserMenu",
            data: {
              menupid: '20230203',
            },
          }).then(res => {
            let allMenus = [];

            function loopGetUrl(resurls) {
              _.forEach(resurls, url => {
                if (url.DISPLAYURL) {
                  allMenus.push({
                    DISPLAYURL: url.DISPLAYURL
                  })
                }
                if (url.children) {
                  loopGetUrl(url.children)
                }
              })
            }
            loopGetUrl(res);
            commit("setUserAuthedMenu", allMenus);
            reslove(allMenus)

          })
      })

    },
    // 获取用户角色
    getUserRoles({
      commit,
      state
    }) {
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
            let roles = res.data.filter(i => i.GROUPID === state.GROUPID)
            commit("setUserRoles", roles);
          }
        })
    },
  }
})
