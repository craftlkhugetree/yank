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
    GROUPID: "9100003", // 当前应用的id
    userInfo: {},
    userDepts: [], // 部门
    userRoles: [], // 角色
    serviceTypes: [{
        type: 1,
        name: "咨询",
        icon: "iconfont iconzixun",
        image: "@/../static/images/talk-zixun.png"
      },
      {
        type: 2,
        name: "投诉",
        icon: "iconfont icontousu",
        image: "@/../static/images/talk-tousu.png"
      },
      {
        type: 3,
        name: "表扬",
        icon: "iconfont iconbiaoyang",
        image: "@/../static/images/talk-biaoyang.png"
      },
      {
        type: 4,
        name: "反馈",
        icon: "iconfont iconfankui",
        image: "@/../static/images/talk-fankui.png"
      },
      {
        type: 5,
        name: "其他",
        icon: "iconfont iconqita",
        image: "@/../static/images/talk-qita.png"
      },
    ],
    departments: []

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
  },
  actions: {
    // 获取用户信息
    getUserInfo({
      commit
    }) {
      // 获取用户信息
      util
        .postAjax({
          code: global.authCode,
          url: "rest/User/userDetail",
        })
        .then((res) => {
          commit("setUserInfo", res.item);
        });
    },

    // 获取用户部门
    getUserDepts({
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
          commit("setUserDepts", res.items || []);
        });
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

    // 获取部门列表
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
    }
  }
})
