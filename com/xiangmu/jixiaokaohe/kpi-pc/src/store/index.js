import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)


import {
  getUserRole
} from "@/api/admin/user.js"
import {
  fetchGroupList,
  getUserWorkGroups
} from "@/api/admin/group.js";

export default new Vuex.Store({
  state: {
    GROUPID: "20210604", // 项目ID
    userRoles: [], // 用户角色
    userInfo: {}, // 用户信息
    userDetail: {}, // 该系统中用户的详情
    levelList: [], // 领导岗位级别列表
    groupList: [], // 考核分组列表
    userRoleGroupList: [] // 用户有权限查看的考核分组列表
  },
  mutations: {
    setUserRoles(state, data) {
      state.userRoles = data;
    },
    setUserInfo(state, data) {
      state.userInfo = data;
    },
    setUserDetail(state, data) {
      state.userDetail = data;
    },
    setLevelList(state, data) {
      state.levelList = data;
    },
    setGroupList(state, data) {
      state.groupList = data;
    },
    setUserRoleGroupList(state, data) {
      state.userRoleGroupList = data;
    }
  },
  actions: {
    // 获取用户有权限查看的考核分组
    getUserRoleGroupList({
      commit,
      state
    }) {
      return new Promise((resolve, reject) => {
        // 获取用户角色
        getUserRole().then(res => {
          if (res.success) {
            let data = res.data || [];
            commit("setUserRoles", data);
            let roles = data.map(i => i.ID);
            let param = {};
            let func = null;
            // 如果是系统管理员、绩效发放人员、分管领导，则获取所有工作组，其余用户获取该用户负责的工作组
            if (
              roles.includes("20210604-5") ||
              roles.includes("20210604-4") ||
              roles.includes("20210604-3")
            ) {
              func = fetchGroupList;
            } else {
              func = getUserWorkGroups;
              param = {
                userid: state.userInfo.ID
              };
            }
            func(param)
              .then(res => {
                if(res.success) {
                  let group = res.data || [];
                  commit("setUserRoleGroupList",group);
                  resolve(group)
                } else {
                  reject("获取失败！");
                }
              })
              .catch(err => {
                reject("获取失败！");
              });
          }
        });

      })
    },
  },
  modules: {}
})