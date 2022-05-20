//  Vue Commonjs 使用说明projectSetting
//  项目开发配置全放置于projectSetting中，此文件理论上不须做修改
import setting from './projectSettings.js'
import axios from 'axios';
import qs from 'qs';
import router from '@/router'
import store from '@/store'

let Axios = axios;
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=UTF-8';

let global = {
    url: {}
};

global.url['url'] = window.g.url;
global.url['appportal'] = window.g.appportalUrl;
global.url['auth'] = window.g.authUrl;
global.url['file'] = window.g.fileUrl;
global.url['idsweb'] = window.g.idsUrl;
global.url['third'] = window.g.thirdUrl;

// global.url['book2'] = "/book2/rest/";
/** Function : 获取url , Created By HarryC on 2019/1/31 0031 */
let getRealUrl = function (code, url) {
    return new Promise(function (resolve, reject) {
        let realUrl = global.url[code] ? global.url[code] : false;
        if (!realUrl) {
            startAjax({
                code: 'appportal',
                url: 'Portal/getPhyAppByCODEs',
                data: {
                    CODEs: JSON.stringify([code])
                },
            }).then(function (data) {
                let res = data;
                if (res.success) {
                    for (let i = 0; i < res.data.length; i++) {
                        global.url[res.data[i].CODE] = res.data[i].URL;
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
        // debugger
        if (options && options.url && options.code) {
            getRealUrl(options.code, options.url).then(function (data) {
                let ajaxSettings = {
                  url: data,
                  method: options.isGet ? "GET" : "POST",
                  headers: {
                    // "IDSTGC": getCookie('IDSTGC')
                    IDSTGC:
                      getCookie("IDSTGC") || "1aecdd94392244b799479d81dfd3b41c",
                  },
                  data: options.isRep
                    ? options.data
                    : qs.stringify(options.data) || "",
                };
                if (!options.data || (options.data.isLoading === undefined || options.data.isLoading)) {
                  store.commit("setLoading", true);
                }
                return Axios(ajaxSettings).then(function (data) {
                    store.commit('setLoading', false)
                    let orgindata = data;
                    let res = data.data;
                    if (res.login === false || (typeof (res) === 'string' && res.includes("<html>"))) {
                        redirectToLogin();
                    } else {
                        if (res.success === false) {
                            // if(!res.errInf || res.errInf.metailBusInf.indexOf('错误唯一流水码') != -1){
                            //   setting.tips(res.message);
                            // }
                            resolve(orgindata);
                        } else {
                            resolve(res);
                        }
                    }
                }).catch(function (data) {
                    store.commit('setLoading', false)
                    // IE浏览器
                    let isIE = isIEBrowser();
                    if (isIE) {
                        redirectToLogin();
                    }
                    reject(data);
                })
            }).catch(function (data) {
                store.commit('setLoading', false)
                reject(data);
            });
        } else {
            reject('参数错误！');
            setting.tips('参数错误！');
        }
    })
}

/** Function: 导出文件 */
let exportFile = function (url, isGet, params, fileName, fileType) {
    Axios({
      url: window.g.url + url,
      method: isGet ? "GET" : "POST",
      responseType: "blob",
      headers: {
        IDSTGC: getCookie("IDSTGC") || "73a20404f48b4dd49ba9fe9169282a7e",
        // "IDSTGC": getCookie('IDSTGC') || "9bbcf08746984754838e537222e0e6d2"
      },
      data: params,
    }).then((res) => {
      let url = window.URL.createObjectURL(res.data);
      let link = document.createElement("a");
      link.href = url;
      link.style.display = "none";
      link.setAttribute("download", fileName + "." + fileType);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    });
}

/** Function: 判断是否为IE浏览器 */
let isIEBrowser = function () {
    let userAgent = navigator.userAgent;
    let isEdge = userAgent.indexOf("Edge") > -1;
    let isIE11 = userAgent.indexOf('Trident') > -1 && userAgent.indexOf("rv:11.0") > -1;
    let isIE = userAgent.indexOf("MSIE") > -1;
    return isEdge || isIE11 || isIE;
}

/** Function : 获取cookie , Created By HarryC on 2019/1/31 0031 */
let getCookie = function (name) {
    let arr, reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)");
    if (arr = document.cookie.match(reg))
        return unescape(arr[2]);
    else
        return null;
}
/** Function : 登录页面 , Created By HarryC on 2019/1/31 0031 */
let redirectToLogin = function () {
    if (window.base.isLocalLogin) {
        router.push("/login")
    } else {
        location.href = setting.getLoginUrl;
    }
}
/** Function : 时间函数封装 , Created By HarryC on 2019/1/31 0031 */
let formatTime = function (time, format) {
    let timeLength = '' + time;
    let tf = function (d) {
        return d >= 10 ? d : '0' + d;
    }
    let dateObj;
    switch (timeLength.length) {
        case 17:
        case 16:
        case 15:
        case 14:
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
            dateObj = "";
            // throw "Ow<这是一条来自common的提示：format参数输入错误";
            console.log("format参数输入错误");
    }
    let timeString = "";
    if (dateObj) {
        timeString = format.replace(/YYYY/gi, dateObj.getFullYear() + '')
            .replace(/MM/g, tf(dateObj.getMonth() + 1))
            .replace(/DD/gi, tf(dateObj.getDate()))
            .replace(/hh/gi, tf(dateObj.getHours()))
            .replace(/mm/g, tf(dateObj.getMinutes()))
            .replace(/ss/gi, tf(dateObj.getSeconds()));
    } else {
        timeString = "--"
    }
    return timeString;
}
//返回当前时间的年月日 2019-05-20
var ymd = function () {
    var myDate = new Date();
    var month = myDate.getMonth() + 1;
    if (month >= 1 && month <= 9) { //月
        month = "0" + month;
    }
    var strDate = myDate.getDate();
    if (strDate >= 0 && strDate <= 9) { //日
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
    return myDate.getFullYear() + month + strDate;
}
//截取时间
var slicetime = function (val) {
    return val.slice(0, 4) - val.slice(4, 6) - val.slice(6, 8);
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

export default {
    global,

    exportFile,

    //返回当前的年月日
    formatMYD() {
        return ymd()
    },
    slicetime() {
        return slicetime()
    },
    //已知tan的值，求出角度
    angle(tan) {
        return Math.atan(tan) * 180 / Math.PI
    },
    //随机数
    GenNonDuplicateID() {
        return Number(Math.random().toString().substr(3, 8) + Date.now()).toString(36);
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
            } else if ((code >= 0x800 && code <= 0xd7ff) ||
                (code >= 0xe000 && code <= 0xffff)) {
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
        num: /^([1-9][0-9]*)+(.[0-9]{1,2})?$/, //有1~3位小数的正实数
        znum: /^[1-9]\d*$/, //有1~3位小数的正实数
        isbn: /^(\d[- ]*){12}[\dxX]$/, //验证标准的13位isbn号,
        idCard_15: /^[1-9]\d{5}\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{2}$/, //十五位身份证号码
        idCard_18: /^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/, //十八位身份证号码
        idCard: /(^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$)|(^[1-9]\d{5}\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{2}$)/, //身份证号码
        URL: "rest",
        PREURL: ''
    },

}