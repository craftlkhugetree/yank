import util from "./util";
import global from "./global";
import store from "../../store/index";

export default {
  /**
   * 获取区域列表
   * @param {*} page
   * @param {*} type "1"-学生公寓  "2"-校园其他楼宇
   * @param {*} keyword
   */
  getAreaList(page, type, keyword) {
    return new Promise((resolve, reject) => {
      util
        .postAjax({
          code: global.code,
          url: "area/pageQuery",
          isRep: true,
          data: {
            page: page,
            limit: 1000,
            filter: {
              name: keyword,
              type: type
            }
          }
        })
        .then(res => {
          if (res.success) {
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
  /**
   * 获取用户列表
   */
  getUserList(page, keyword) {
    return new Promise((resolve, reject) => {
      util
        .postAjax({
          code: global.authCode,
          url: "rest/User/simpleList",
          data: {
            page: page,
            limit: 1000,
            filter: JSON.stringify({
              KEYWORD: keyword
            })
          }
        })
        .then(res => {
          if (res.success) {
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
};

// 资源库维护列表查询
// export const eduTypePageQuery = data => {
//   return util.postAjax({
//     code: global.code,
//     url: "/eduType/pageQuery",
//     isRep: true,
//     data
//   });
// };

// 登录
export function doLogin(data) {
  return util.postAjax({
    code: "idsweb",
    url: "login2/authUser",
    data,
    loadingText: "登录中"
  });
}
// 获取openid
export function getOpenId(data) {
  return util.postAjax({
    code: "idsweb",
    url: "login2/getCode",
    data,
    isGet: true
  });
}
// 验证码
export function getYzm2(data) {
  return util.postAjax({
    code: "idsweb",
    url: "captcha/get2",
    data,
    isGet: true
  });
}
