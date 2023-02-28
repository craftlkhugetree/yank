import util from "./util";
import global from "./global";
import store from "../../store/index"

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
            resolve(res)
          } else {
            reject(res)
          }
        })
        .catch(err => {
          reject(err)
        });
    })

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
            resolve(res)
          } else {
            reject(res)
          }
        })
        .catch(err => {
          reject(err)
        });
    })
  },
}
