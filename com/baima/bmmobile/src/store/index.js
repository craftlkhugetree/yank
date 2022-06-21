import Vue from 'vue'
import Vuex from 'vuex'
import util from "../assets/js/util";
import global from "../assets/js/global";
Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    isShowTabBar: false,
    userInfo: {},
    userRoles: [], // 角色
    orgList: [],   // 学院列表
    // 水资源申请状态
    applyStatus: [{
        name: "草稿",
        id: "0"
      },
      {
        name: "审批中",
        id: "1"
      },
      {
        name: "未接收",
        id: "2"
      },
      {
        name: "已完成",
        id: "3"
      },
      {
        name: "已驳回",
        id: "8"
      },
      {
        name: "已撤回",
        id: "9"
      },
    ],
    // 实习申请状态
    processStatus: [{
      name: "草稿",
      id: "0"
    }, {
      name: "单位领导审批中",
      id: "1"
    }, {
      name: "白马办审批中",
      id: "2"
    }, {
      name: "已完成",
      id: "3"
    }, {
      name: "超时,系统退回",
      id: "7"
    }, {
      name: "已驳回",
      id: "8"
    }, {
      name: "已撤回",
      id: "9"
    }],

    //资源申请单状态
    resApplyStatus: [{
      name: "单位领导审批中",
      id: "1"
    }, {
      name: "白马办审批中",
      id: "2"
    }, {
      name: "已完成",
      id: "3"
    }, {
      name: "已驳回",
      id: "8"
    }],
    // 入驻申请状态
    usestatus: [{
      name: "空闲",
      id: "1"
    }, {
      name: "未入驻",
      id: "2"
    }, {
      name: "已入驻",
      id: "3"
    }, {
      name: "已退出",
      id: "4"
    }, {
      name: "申请中",
      id: "5"
    }],
    fileUrl: window.g.file + "rest/FileOut/view/", // 文件地址
    uploadUrl: window.g.file + "rest/FileOut/saveFile", // 上传地址
    downUrl: window.g.file + "rest/FileOut/down?ID=", // 下载地址
  },
  mutations: {
    // 设置用户信息
    setUserInfo(state, res) {
      state.userInfo = res;
    },
    // 设置用户角色
    setUserRoles(state, res) {
      state.userRoles = res;
    },
    // 设置学院列表
    setOrgList(state, res) {
      state.orgList = res;
    },
    setIsShowTabBar(state) {
      state.isShowTabBar = !state.isShowTabBar;
    }
  },
  actions: {
    // 获取用户信息
    getUserInfo({
      commit
    }) {
      return new Promise((resolve, reject) => {
        util
          .postAjax({
            code: global.authCode,
            url: "rest/User/userDetail"
          }).then(res => {
            if (res.success && res.item) {
              commit("setUserInfo", res.item);
              // 获取用户角色
              util
                .postAjax({
                  code: global.authCode,
                  url: "rest/AuthOut/getUserRoles",
                  isRep: true,
                  data: {
                    USERID: res.item.ID
                  }
                })
                .then(res => {
                  if (res.success && res.data) {
                    commit("setUserRoles", res.data);
                    resolve(res.data)
                  } else {
                    reject(res)
                  }
                }).catch(err => {
                  reject(err)
                })
            } else {
              reject(res)
            }
          }).catch((err) => {
            reject(err)
          })
      })
    },


    //获取学院列表
    getOrgList({
      commit
    }) {
      return new Promise((resolve, reject) => {
        util.postAjax({
          code: global.bmCode,
          url: "/user/orgList",
        }).then(res => {
          if (res.success == true) {
            if (res.items) {
              commit("setOrgList", res.items);
              resolve(res.items)
            } else {
              reject(res)
            }
          } else {
            reject(res)
          }
        }).catch(err => {
          reject(err)
        })
      })
    }
  }
})