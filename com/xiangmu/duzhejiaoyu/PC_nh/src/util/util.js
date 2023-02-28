//  Vue Commonjs 使用说明projectSetting
//  项目开发配置全放置于projectSetting中，此文件理论上不须做修改
import setting from './projectSettings.js'
import axios from 'axios';
import qs from 'qs';
import { parse } from 'querystring';
let Axios = axios;
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=UTF-8';
let global = {
  url: {},
  ysu: '',
  nuist: ''
};
// global.url['appportal'] = setting.getAppportalwebUrl;
global.url['lres'] = window.base.baseURL;
global.url['tenant'] = window.base.tenantURL;
global.url['idsweb'] = window.base.idsURL;
global.url['auth'] = window.base.tenantURL;
global.ysu = window.base.ysu;
global.nuist = window.base.nuist;
/** Function : 获取url , Created By HarryC on 2019/1/31 0031 */
let getRealUrl = function (code, url) {
  return new Promise(function (resolve, reject) {
    let realUrl = global.url[code] ? global.url[code] : false;
    if (!realUrl) {
      startAjax({
        code: 'appportal',
        url: 'Portal/getPhyAppByCODEs',
        data: { CODEs: JSON.stringify([code]) },
      }).then(function (data) {
        let res = data;
        if (res.success) {
          for (let i = 0; i < res.data.length; i++) {
            global.url[res.data[i].CODE] = res.data[i].URL + 'rest/';
          }
          resolve(global.url[code] + url);
        } else {
          reject('fail!');
          setting.tips('获取Url失败！');
        }
        resolve(global.url[code] + url)
      }).catch(function (data) {
        reject('fail!');
        reject(data);
      })
    } else {
      resolve(global.url[code] + url)
    }
  });
}
/** Function : ajax方法封装修改 , Created By HarryC on 2019/1/31 0031 */
let startAjax = function (options) {
  return new Promise(function (resolve, reject) {
    if (options && options.url && options.code) {
      getRealUrl(options.code, options.url).then(function (data) {
        var loginurl = data.split('/rest')[1];
        var cookieheaders = {
          // "FRONT_IDSTGC": getCookie("FRONT_IDSTGC") || 'a01b75e89bbf4284902300fff33fad7d',
          // "FRONT_IDSTGC": getCookie("FRONT_IDSTGC"),
          "IDSTGC": getCookie("IDSTGC")
        }
        // if (global.nuist || global.nuaa) {
        //   cookieheaders = {
        //     "IDSTGC": getCookie("IDSTGC")
        //   }
        // }
        let ajaxSettings = {
          url: data,
          method: 'POST',
          headers: cookieheaders,
          data: options.isRep ? (options.data) : (qs.stringify(options.data) || ''),
        }
        return Axios(ajaxSettings).then(function (data) {
          let orgindata = data;
          let res = data.data;
          if (res.login === false) {
            
            if (loginurl == '/user/userInfo') {//跳转绑定页面一直刷新，所以过滤
              resolve(res);
              return
            } else {
              resolve(res);
              redirectToLogin();
            }
          } else {
            // if(res.success === false){
            //   // setting.tips(res.message);
            //   // setting.tips(res.errInf.metailBusInf);
            //   // orgindata.login = false;
            //   resolve(orgindata);
            // }else{
            resolve(res);
            // }
          }
        }).catch(function (data) {
          reject(data);
        })
      }).catch(function (data) {
        reject(data);
      });
    } else {
      reject('参数错误！');
      setting.tips('参数错误！');
    }
  })
}
/** Function :获取cookie , Created By HarryC on 2019/1/31 0031 */
let getCookie = function (name) {
  let arr, reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)");
  if (arr = document.cookie.match(reg))
    return unescape(arr[2]);
  else
    return null;
}
/** Function : 登录页面 , Created By HarryC on 2019/1/31 0031 */
let redirectToLogin = function () {
  location.href = setting.getLoginUrl;
}
/** Function : 时间函数封装 , Created By HarryC on 2019/1/31 0031 */
let formatTime = function (time, format) {
  let timeLength = '' + time;
  let tf = function (d) {
    return d >= 10 ? d : '0' + d;
  }
  let dateObj;
  switch (timeLength.length) {
    case 14 || 17:
      dateObj = new Date(parseInt(timeLength.substring(0, 4)),
        parseInt(timeLength.substring(4, 6)) - 1,
        parseInt(timeLength.substring(6, 8)),
        parseInt(timeLength.substring(8, 10)),
        parseInt(timeLength.substring(10, 12)),
        parseInt(timeLength.substring(12, 14)));
      break;
    case 13:
      dateObj = new Date(time);
      break;
    case 8:
      dateObj = new Date(parseInt(timeLength.substring(0, 4)),
        parseInt(timeLength.substring(4, 6)) - 1,
        parseInt(timeLength.substring(6, 8))
      );
      break;
    default:
      throw "Ow<这是一条来自common的提示：format参数输入错误";
  }
  let timeString = format.replace(/YYYY/gi, dateObj.getFullYear() + '')
    .replace(/MM/g, tf(dateObj.getMonth() + 1))
    .replace(/DD/gi, tf(dateObj.getDate()))
    .replace(/hh/gi, tf(dateObj.getHours()))
    .replace(/mm/g, tf(dateObj.getMinutes()))
    .replace(/ss/gi, tf(dateObj.getSeconds()));
  return timeString;
}
let formatTime_ = function (myDate, type) {
  var month = myDate.getMonth() + 1;
  if (month >= 1 && month <= 9) {//月
    month = "0" + month;
  }
  var strDate = myDate.getDate();
  if (strDate >= 0 && strDate <= 9) {//日
    strDate = "0" + strDate;
  }
  var hour = myDate.getHours(); // 时

  if (hour >= 0 && hour <= 9) {
    hour = "0" + hour;
  }
  var minutes = myDate.getMinutes(); // 分
  if (minutes >= 0 && minutes <= 9) {
    minutes = "0" + minutes;
  }
  var seconds = myDate.getSeconds(); // 分
  if (seconds >= 0 && seconds <= 9) {
    seconds = "0" + seconds;
  }
  if (type == 'end') {
    return '' + myDate.getFullYear() + month + strDate + '235959';
  } else {
    return '' + myDate.getFullYear() + month + strDate + hour + minutes + seconds;
  }

}
//返回当前时间的年月日
var ymd = function () {
  var myDate = new Date();
  var month = myDate.getMonth() + 1;
  if (month >= 1 && month <= 9) {//月
    month = "0" + month;
  }
  var strDate = myDate.getDate();
  if (strDate >= 0 && strDate <= 9) {//日
    strDate = "0" + strDate;
  }
  var hour = myDate.getHours(); // 时

  if (hour >= 0 && hour <= 9) {
    hour = "0" + hour;
  }
  var minutes = myDate.getMinutes(); // 分
  if (minutes >= 0 && minutes <= 9) {
    minutes = "0" + minutes;
  }
  return myDate.getFullYear() + '-' + month + '-' + strDate;
}

let formatMins = function (num) {
  if (typeof parseInt(num) === 'number') {
    num = parseInt(num);
  } else {
    throw "Ow<这是一条来自common的提示：传入的参数类型不正确，需要一个数字/数字字符串";
  }
  let tf = function (d) {
    return d >= 10 ? d : '0' + d;
  }
  let SS = parseInt(num % 60);
  let HH = parseInt(num / 3600);
  let MM = parseInt((num - HH * 3600) / 60)
  return `${tf(HH)}:${tf(MM)}:${tf(SS)}`;

}
//格式化姓名，只显示姓，其他*显示  eg：张*
var formatName = function (name) {
  return name.charAt(0) + Array(name.length).join('*');
};
//获取今天是周几
let weekD = function () {
  var today = new Date();
  var today_h = today.getHours();
  if (today_h < 10) {
    today_h = '0' + today_h;
  }
  var today_m = today.getMinutes();
  if (today_m < 10) {
    today_m = '0' + today_m;
  }
  var today_s = today.getSeconds();
  if (today_s < 10) {
    today_s = '0' + today_s;
  }
  var today_month = today.getMonth() + 1;
  if (today_month < 10) {
    today_month = '0' + today_month;
  }
  var today_day = today.getDate();
  if (today_day < 10) {
    today_day = '0' + today_day;
  }
  var today_xq = today.getDay();
  //设置星期几的数组
  var xqArr = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'];
  return xqArr[today_xq]
}
export default {
  //返回当前的年月日
  formatMYD() {
    return ymd()
  },
  //已知tan的值，求出角度
  angle(tan) {
    return Math.atan(tan) * 180 / Math.PI
  },
  weekD() {
    return weekD()
  },
  //将秒数转成分钟数
  formatmintomins(s) {
    return Math.floor(s / 60) + '分' + s % 60 + '秒'
  },
  //勾股定理
  dist(a, b) {
    return Math.sqrt(a * a + b * b);
  },
  /** Function : 时间函数封装 , Created By HarryC on 2019/1/31 0031 */
  formatTime(time, format) {
    return formatTime(time, format);
  },
  formatTime_(time, type) {
    return formatTime_(time, type);
  },
  /** Function : 重写ajax , Created By HarryC on 2019/1/31 0031 */
  postAjax(options) {
    return startAjax(options);
  },
  /** Function : 获取真实url,promise对象注意！ , Created By HarryC on 2019/1/31 0031 */
  getUrlByCode(code, url) {
    return getRealUrl(code, url);
  },
  /** Function : 获取cookie , Created By HarryC on 2019/1/31 0031 */
  getCookieByName(cookiename) {
    return getCookie(cookiename);
  },
  /** Function : 获取Url参数 , Created By HarryC on 2019/1/31 0031 */
  getUrlParam(name) {
    let reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
    let r = window.location.search.substr(1).match(reg);
    if (r != null) return decodeURI(r[2]); // 解码
    return '';
  },
  /** Function : 把秒数转换为hh:mm:ss形式 , Created By HarryC on 2019/3/1 0001 */
  formatSeconds(num) {
    return formatMins(num);
  },
  //格式化姓名，只显示姓，其他*显示  eg：张*
  formatName(name) {
    return formatName(name);
  },
  utf16Str(utf16Str) {
    var utf8Arr = [];
    var byteSize = 0;
    for (var i = 0; i < utf16Str.length; i++) {
      //获取字符Unicode码值
      var code = utf16Str.charCodeAt(i);

      //如果码值是1个字节的范围，则直接写入
      if (code >= 0x00 && code <= 0x7f) {
        byteSize += 1;
        utf8Arr.push(code);

        //如果码值是2个字节以上的范围，则按规则进行填充补码转换
      } else if (code >= 0x80 && code <= 0x7ff) {
        byteSize += 2;
        utf8Arr.push((192 | (31 & (code >> 6))));
        utf8Arr.push((128 | (63 & code)))
      } else if ((code >= 0x800 && code <= 0xd7ff)
        || (code >= 0xe000 && code <= 0xffff)) {
        byteSize += 3;
        utf8Arr.push((224 | (15 & (code >> 12))));
        utf8Arr.push((128 | (63 & (code >> 6))));
        utf8Arr.push((128 | (63 & code)))
      } else if (code >= 0x10000 && code <= 0x10ffff) {
        byteSize += 4;
        utf8Arr.push((240 | (7 & (code >> 18))));
        utf8Arr.push((128 | (63 & (code >> 12))));
        utf8Arr.push((128 | (63 & (code >> 6))));
        utf8Arr.push((128 | (63 & code)))
      }
    }

    return utf8Arr
  },
  /** Function : 正则表达式 , Created By HarryC on 2019/1/31 0031 */
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
    num: /^([1-9][0-9]*)+(.[0-9]{1,2})?$/,//有1~3位小数的正实数
    znum: /^[1-9]\d*$/,//有1~3位小数的正实数
    isbn: /^(\d[- ]*){12}[\dxX]$/, //验证标准的13位isbn号
    URL: "rest",
    PREURL: ''
  }
}

