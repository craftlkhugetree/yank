import axios from "axios";
import qs from "qs";

axios.defaults.headers.post["Content-Type"] =
  "application/x-www-form-urlencoded;charset=UTF-8";

/** Function : ajax方法封装修改 , Created By HarryC on 2019/1/31 0031 */
let startAjax = function (options) {
  return new Promise(function (resolve, reject) {
    let ajaxSettings = {
      url: options.url,
      method: options.type,
      data: options.isRep ? options.data : qs.stringify(options.data) || "",
      // 对于给定的HTTP 响应状态码是 resolve 或 reject
      validateStatus: function (status) {
        return status >= 200 && status < 500;
      },
    };
    axios(ajaxSettings)
      .then((res) => {
        let data = res.data;
        resolve(data);
      })
      .catch((data) => {
        reject(data);
      });
  });
};

export default {
  postAjax(options) {
    return startAjax(options);
  },
};
