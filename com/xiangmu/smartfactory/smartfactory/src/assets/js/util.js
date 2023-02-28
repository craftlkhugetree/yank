import axios from 'axios';
import qs from 'qs';
import router from '@/router';

axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=UTF-8';

let global = {
  url: {},
};

global.url['url'] = window.g.url;
global.url['admin'] = window.g.adminUrl;
global.url['auth'] = window.g.authUrl;
global.url['file'] = window.g.fileUrl;
// global.url['appportal'] = window.g.appportalUrl;
// global.url['idsweb'] = window.g.idsUrl;

/** Function : ajax方法封装修改 , Created By HarryC on 2019/1/31 0031 */
let startAjax = function (options) {
  return new Promise(function (resolve, reject) {
    if (options && options.url && options.code) {
      // 是否需要token
      let headers = options.noToken
        ? {}
        : {
            Authorization: 'Bearer ' + localStorage.getItem('access_token'),
          };
      let ajaxSettings = {
        url: global.url[options.code] + options.url,
        method: options.isGet ? 'GET' : 'POST',
        headers,
        data: options.isRep ? options.data : qs.stringify(options.data) || '',
        // 对于给定的HTTP 响应状态码是 resolve 或 reject
        validateStatus: function (status) {
          return status >= 200 && status < 500;
        },
      };
      axios(ajaxSettings)
        .then(res => {
          let data = res.data;
          if (data.code.indexOf('A002') == 0) {
            redirectToLogin();
          } else {
            resolve(data);
          }
        })
        .catch(data => {
          // IE浏览器
          let isIE = isIEBrowser();
          if (isIE) {
            redirectToLogin();
          }
          reject(data);
        });
    } else {
      reject('参数错误！');
    }
  });
};

/** Function: 判断是否为IE浏览器 */
let isIEBrowser = function () {
  let userAgent = navigator.userAgent;
  let isEdge = userAgent.indexOf('Edge') > -1;
  let isIE11 = userAgent.indexOf('Trident') > -1 && userAgent.indexOf('rv:11.0') > -1;
  let isIE = userAgent.indexOf('MSIE') > -1;
  return isEdge || isIE11 || isIE;
};

/** Function : 登录页面 , Created By HarryC on 2019/1/31 0031 */
let redirectToLogin = function () {
  router.push('/login');
};

/** Function: 导出文件 */
let exportFile = function (url, isGet, params, fileName, fileType) {
  axios({
    url: window.g.url + url,
    method: isGet ? 'GET' : 'POST',
    responseType: 'blob',
    headers: {
      Authorization: 'Bearer ' + localStorage.getItem('access_token'),
    },
    data: params,
  }).then(res => {
    let url = window.URL.createObjectURL(res.data);
    let link = document.createElement('a');
    link.href = url;
    link.style.display = 'none';
    link.setAttribute('download', fileName + '.' + fileType);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  });
};
var ymd = function (d) {
  var myDate = d || new Date();
  var month = myDate.getMonth() + 1;
  if (month >= 1 && month <= 9) {
    //月
    month = '0' + month;
  }
  var strDate = myDate.getDate();
  if (strDate >= 0 && strDate <= 9) {
    //日
    strDate = '0' + strDate;
  }
  var hour = myDate.getHours(); // 时

  if (hour >= 0 && hour <= 9) {
    hour = '0' + hour;
  }
  var minutes = myDate.getMinutes(); // 分
  if (minutes >= 0 && minutes <= 9) {
    minutes = '0' + minutes;
  }
  return '' + myDate.getFullYear() + '-' + month + '-' + strDate;
};

export default {
  global,
  /** Function : 重写ajax , Created By HarryC on 2019/1/31 0031 */
  postAjax(options) {
    return startAjax(options);
  },
  exportFile,
  ymd,
  regExps: {
    chinese: /^[\u4e00-\u9fa5]{0,}$/, // 匹配中文字符
    email: /^[\w-]+(\.[\w-]+)*@[\w-]+(\.[\w-]+)+$/, // email地址
    account: /^[a-zA-Z][a-zA-Z0-9_]{4,15}$/, // 字母开头，允许 5-16 字节，允许字母数字下划线
    pwd: /^[\u4e00-\u9fa5_a-zA-Z0-9]+$/, // 中文、英文、数字及下划线
    url: /^[http|ftp|https]:\/\/(\w+(-\w+)*)(\.(\w+(-\w+)*))*(\?\S*)?$/, // url地址
    qq: /^[1-9]\d{4,9}$/, // QQ
    phone: /^((0\d{2,3}-\d{7,8})|(1[358479]\d{9})|(\d{8}))$/,
    yphone: /^(13[0-9]|14[579]|15[0-3,5-9]|16[6]|17[0135678]|18[0-9]|19[89])\d{8}$/, // 手机号码
    floatNum: /^([1-9]\d{0,3}?(\.\d{1,2})?|0|0\.\d{1,2})$/, // max=9999.99
    num: /^([1-9][0-9]*)+(.[0-9]{1,2})?$/, //有1~3位小数的正实数
    znum: /^[1-9]\d*$/, //有1~3位小数的正实数
    isbn: /^(\d[- ]*){12}[\dxX]$/, //验证标准的13位isbn号,
    idCard_15: /^[1-9]\d{5}\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{2}$/, //十五位身份证号码
    idCard_18:
      /^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/, //十八位身份证号码
    idCard:
      /(^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$)|(^[1-9]\d{5}\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{2}$)/, //身份证号码
    URL: 'rest',
    PREURL: '',
  },
};
