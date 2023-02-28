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
    GROUPID: `${util.webUserID}`, // 当前应用的id
    userRoles: [], // 用户角色
    userInfo: {}, // 用户信息
    userMenu: [], // 用户菜单
    userDept: JSON.parse(sessionStorage.getItem("userDept")) || {}, // 用户单位
    deptList: [], // 维修单位列表
    repairTypeList: [
      // 维修类型列表
      {
        id: "1",
        name: "后勤"
      }
      // {
      //   id: "2",
      //   name: "网络"
      // },
      // {
      //   id: "3",
      //   name: "消防"
      // }
    ],
    repairTypeList2: [
      // 维修类型列表
      {
        id: "1",
        name: "后勤"
      },
      {
        id: "2",
        name: "网络"
      }
    ],
    // 报修流程
    repairFlow: [
      {
        question: "需要报修的网络类型？",
        id: "00",
        options: [
          {
            text: "有线",
            qid: "01"
          },
          {
            text: "无线",
            qid: "07"
          }
        ]
      },
      {
        question:
          "在电脑端，使用快捷键组合win+R，然后在文本框输入ncpa.cpl，回车，出现网络状态显示界面，查看无线网络状态，连接状态还是未连接状态？",
        id: "07",
        options: [
          {
            text: "连接状态",
            qid: "08"
          },
          {
            text: "未连接状态",
            qid: "16"
          }
        ],
        guideTitle: "检查网络状态",
        guideImg: ["@/../static/tw/tw-jcwl.png"]
      },
      {
        question:
          "关闭无线连接，过一会儿再打开，重连信号NJIT，能否成功连上信号NJIT？",
        id: "16",
        options: [
          {
            text: "是，可以上网",
            qid: "success"
          },
          {
            text: "是，不能上网",
            qid: "08"
          },
          {
            text: "否",
            qid: "fail"
          }
        ]
      },
      {
        question: "检查无线网络获取到的IP地址：",
        id: "08",
        options: [
          {
            text: "192.168.X.X     办公室存在路由器且有问题送至图书馆A104",
            qid: "success"
          },
          {
            text: "169.254.X.X     无地址，进入报修流程",
            qid: "fail"
          },
          {
            text: "10.20.X.X",
            qid: "09"
          }
        ],
        guideTitle: "检查IP地址",
        guideImg: [
          "@/../static/tw/tw-jcwl.png",
          "@/../static/tw/tw-jcip.png",
          "@/../static/tw/tw-jcip-2.png"
        ]
      },
      {
        question: "打开浏览器，输入认证网址10.0.1.1",
        id: "09",
        options: [
          {
            text: "认证界面",
            qid: "10"
          },
          {
            text: "注销界面或无界面",
            qid: "15"
          }
        ]
      },
      {
        question: "您的身份是教职工还是学生？",
        id: "10",
        options: [
          {
            text: "教职工身份",
            qid: "11"
          },
          {
            text: "学生身份",
            qid: "11"
          }
        ]
      },
      {
        question: "进入认证界面，输入账号密码选择“外网”进行认证。",
        id: "11",
        options: [
          {
            text: "认证成功",
            qid: "12"
          },
          {
            text: "账号密码问题",
            qid: "13"
          },
          {
            text: "AC认证失败",
            qid: "14"
          },
          {
            text: "错误代码 04   超时 当月不能继续使用",
            qid: "success"
          },
          {
            text: "错误代码 05   欠费 在宿舍等地的多媒体圈存机划钱至校园公寓网",
            qid: "success"
          },
          {
            text:
              "userid error16或者Authentication Fail ErrCode=16--时间策略设置本时段不允许上网 ",
            qid: "success"
          },
          {
            text: "其他情况，进入报修流程",
            qid: "fail"
          }
        ]
      },
      {
        question: "网络是否可以正常使用了？",
        id: "12",
        options: [
          {
            text: "是，网络正常可用。",
            qid: "success"
          },
          {
            text: "否",
            qid: "15"
          }
        ]
      },
      {
        question:
          '点击网址<a href="http://nic.njit.edu.cn/info/1009/1681.htm">http://nic.njit.edu.cn/info/1009/1681.htm</a>，进入自助修改信息门户密码链接(无线上网的账号和密码与信息门户的账号密码是同步的)，完成密码修改后，重新认证，是否可以正常上网？',
        id: "13",
        options: [
          {
            text: "是，结束流程",
            qid: "success"
          },
          {
            text: "否，进入报修流程",
            qid: "fail"
          }
        ]
      },
      {
        question: "已断网15分钟，重连无线网络，能否正常上网？",
        id: "14",
        options: [
          {
            text: "可以，结束流程",
            qid: "success"
          },
          {
            text: "不能正常上网,进入报修流程。",
            qid: "fail"
          }
        ]
      },
      {
        question:
          "检查DNS，将DNS设为202.119.160.11/202.119.160.12，是否可以上网？",
        id: "15",
        options: [
          {
            text: "是。",
            qid: "success"
          },
          {
            text: "否。",
            qid: "fail"
          }
        ],
        guideTitle: "检查修改DNS",
        guideImg: [
          "@/../static/tw/tw-jcwl.png",
          "@/../static/tw/tw-jcip.png",
          "@/../static/tw/tw-jcdns.png",
          "@/../static/tw/tw-jcdns-2.png",
          "@/../static/tw/tw-jcdns-3.png",
          "@/../static/tw/tw-jcdns-4.png"
        ]
      },
      {
        question: "检查网络？",
        id: "01",
        options: [
          {
            text: "红叉未连接",
            qid: "02"
          },
          {
            text: "未识别的网络",
            qid: "03"
          }
        ],
        guideTitle: "检查网络状态",
        guideImg: ["@/../static/tw/tw-jcwl.png"]
      },
      {
        question: "检查网线，重新插拔网口.",
        id: "02",
        options: [
          {
            text: "仍然红叉未连接",
            qid: "fail"
          },
          {
            text: "正在识别 已连接",
            qid: "success"
          },
          {
            text: "仍未识别的网络",
            qid: "03"
          }
        ]
      },
      {
        question: "检查IP地址",
        id: "03",
        options: [
          {
            text: "192.168.X.X   办公室存在路由器且有问题送至图书馆A104。",
            qid: "success"
          },
          {
            text: "169.254.X.X",
            qid: "fail"
          },
          {
            text: "10.20.X.X / 10.25.X.X  /  10.128.X.X",
            qid: "04"
          }
        ],
        guideTitle: "检查IP地址",
        guideImg: [
          "@/../static/tw/tw-jcwl.png",
          "@/../static/tw/tw-jcip.png",
          "@/../static/tw/tw-jcip-2.png"
        ]
      },
      {
        question: "地址正常 输入10.0.1.1",
        id: "04",
        options: [
          {
            text: "认证界面",
            qid: "05"
          },
          {
            text: "注销界面",
            qid: "06"
          },
          {
            text: "无界面",
            qid: "18"
          }
        ]
      },
      {
        question: "输入工号密码认证",
        id: "05",
        options: [
          {
            text: "认证成功",
            qid: "success"
          },
          {
            text: "认证失败",
            qid: "fail"
          }
        ]
      },
      {
        question: "检查修改DNS  202.119.160.11/202.119.160.12",
        id: "06",
        options: [
          {
            text: "是",
            qid: "success"
          },
          {
            text: "否",
            qid: "fail"
          }
        ],
        guideTitle: "检查修改DNS",
        guideImg: [
          "@/../static/tw/tw-jcwl.png",
          "@/../static/tw/tw-jcip.png",
          "@/../static/tw/tw-jcdns.png",
          "@/../static/tw/tw-jcdns-2.png",
          "@/../static/tw/tw-jcdns-3.png",
          "@/../static/tw/tw-jcdns-4.png"
        ]
      },
      {
        question: "清理电脑及浏览器缓存或更换浏览器。",
        id: "18",
        options: [
          {
            text: "已解决",
            qid: "success"
          },
          {
            text: "未解决",
            qid: "fail"
          }
        ]
      }
    ],
        repairAreaList2: [
      // 维修区域
      {
        id: "2",
        name: "校园其他楼宇"
      }],
    repairAreaList: [
      // 维修区域
      {
        id: "1",
        name: "学生公寓"
      },
      {
        id: "2",
        name: "校园其他楼宇"
      }
      // {
      //   id: "6",
      //   name: "校园绿化"
      // },
      // {
      //   id: "3",
      //   name: "校园公共区域"
      // },
      // {
      //   id: "4",
      //   name: "家属区"
      // },
      // {
      //   id: "5",
      //   name: "浦口校区"
      // }
    ],
    statusList: [
      // 维修状态
      {
        id: "1,2",
        name: "等待派单"
      },
      {
        id: "3",
        name: "维修中"
      },
      {
        id: "4",
        name: "维修完工"
      },
      {
        id: "5",
        name: "维修结束"
      }
    ],
    curItem: "", // 当前报修单
    curRepairItem: "", // 当前维修单
    handleList: [
      // 维修负责人操作列表
      {
        id: "1",
        name: "派单"
      },
      {
        id: "4",
        name: "重复报修"
      },
      {
        id: "3",
        name: "暂不维修"
      },
      {
        id: "2",
        name: "已维修"
      },
      {
        id: "5",
        name: "不维修"
      }
    ]
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
    }
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
              local: true
            }
          })
          .then(res => {
            if (res.success && res.data) {
              commit("setUserRoles", res.data);
              resolve(res.data);
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
            if (res.success) {
              let data = res.item || {};
              commit("setUserInfo", data);
              resolve(data);
            } else {
              reject(res);
            }
          })
          .catch(err => {
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
              local: true
            }
          })
          .then(res => {
            let data = res || [];
            commit("setUserMenu", data);

            // 用户所有菜单的链接
            let urls = [];
            data.map(i => {
              if (i.ISLEAF === "1") {
                urls.push(i.DISPLAYURL);
              } else {
                i.children.forEach(j => {
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
              i => i.children && i.children.length > 0
            );
            secondMenus.forEach(i => {
              sessionStorage.setItem(i.NAME, JSON.stringify(i.children));
            });

            resolve(urls);
          })
          .catch(err => {
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
              appid: state.GROUPID
            }
          })
          .then(res => {
            if (res.success) {
              let data = res.items || [];
              let userDept = null;
              if (data.length > 0) {
                userDept = data[0];
              }
              userDept &&
                sessionStorage.setItem("userDept", JSON.stringify(userDept));
              commit("setUserDept", userDept);
              resolve(data);
            } else {
              reject(res);
            }
          })
          .catch(err => {
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
              APPID: state.GROUPID
            }),
            limit: 10000,
            page: 1,
            ISDELETE: "0"
          }
        })
        .then(res => {
          if (res.success) {
            let data = res.items || [];
            commit("setDeptList", data);
          }
        })
        .catch(err => {});
    }
  }
});
