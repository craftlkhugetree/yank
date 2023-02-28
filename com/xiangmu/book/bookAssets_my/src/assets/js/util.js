//  Vue Commonjs 使用说明projectSetting
//  项目开发配置全放置于projectSetting中，此文件理论上不须做修改
import setting from './projectSettings.js'
import axios from 'axios';
import qs from 'qs';
let Axios = axios;
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=UTF-8';
let global = {
  url : {}
};
global.url['appportal'] = setting.getAppportalwebUrl;
global.url['book2'] = window.g.book2;
// global.url['book2'] = "/book2/rest/";




/** Function : 获取url , Created By HarryC on 2019/1/31 0031 */
let getRealUrl = function (code,url) {
  return new Promise(function (resolve,reject) {
    let realUrl = global.url[code] ? global.url[code] : false;
    // console.log(realUrl);
    if(!realUrl){
      startAjax({
        code : 'appportal',
        url:'Portal/getPhyAppByCODEs',
        data:{CODEs:JSON.stringify([code])},
      }).then(function (data) {
        let res = data;
        if(res.success){
          for(let i=0;i<res.data.length;i++){
            global.url[res.data[i].CODE] = res.data[i].URL+'rest/';
          }
          resolve(global.url[code] + url);
        }else{
          reject('fail!');
          setting.tips('获取Url失败！');
        }
        resolve(global.url[code] + url)
      }).catch(function (data) {
        reject('fail!');
        reject(data);
      })
    }else{
      resolve(global.url[code] + url)
    }
  });
}
/** Function : ajax方法封装修改 , Created By HarryC on 2019/1/31 0031 */
let startAjax = function (options) {
  return new Promise(function (resolve,reject) {
    if(options && options.url && options.code){
      getRealUrl(options.code,options.url).then(function (data) {
        let ajaxSettings = {
          url : data,
          method : 'POST',
          headers : {
            "IDSTGC" : getCookie("IDSTGC"),
          },
          data : qs.stringify(options.data) || '',
        }
        return Axios(ajaxSettings).then(function (data) {
          let orgindata = data;
          let res = data.data;
          if(res.login === false){
            redirectToLogin();
          }else{
            if(res.success === false){
              /*setting.tips(res.errInf.metailBusInf);
              resolve(orgindata);*/
              /*if(errMsg.indexOf('错误唯一流水码') != -1){
                setting.tips(res.message);
              }
              resolve(orgindata);*/

              if(res && res.message && res.message.indexOf('错误唯一流水码') != -1){//存在
                setting.tips('系统拥堵，稍后再试');
              }
              resolve(orgindata);

            }else{
              resolve(res);
            }
          }
        }).catch(function (data) {
          reject(data);
        })
      }).catch(function (data) {
        reject(data);
      });
    }else{
      reject('参数错误！');
      setting.tips('参数错误！');
    }
  })
}
/** Function :获取cookie , Created By HarryC on 2019/1/31 0031 */
let getCookie = function(name){
  let arr,reg=new RegExp("(^| )"+name+"=([^;]*)(;|$)");
  if(arr=document.cookie.match(reg))
    return unescape(arr[2]);
  else
    return null;
}
/** Function : 登录页面 , Created By HarryC on 2019/1/31 0031 */
let redirectToLogin = function(){
  location.href = setting.getLoginUrl;
}
/** Function : 时间函数封装 , Created By HarryC on 2019/1/31 0031 */
let formatTime = function (time,format) {
    let timeLength = '' + time;
    let tf = function (d) {
      return d >= 10 ? d : '0' + d;
    }
    let dateObj;
    switch (timeLength.length){
      case 14 || 17 :
        dateObj = new Date(parseInt(timeLength.substring(0,4)),
          parseInt(timeLength.substring(4,6)) - 1,
          parseInt(timeLength.substring(6,8)),
          parseInt(timeLength.substring(8,10)),
          parseInt(timeLength.substring(10,12)),
          parseInt(timeLength.substring(12,14)));
        break;
      case 13 :
        dateObj = new Date(time);
        break;
      case 8 :
        dateObj = new Date(parseInt(timeLength.substring(0,4)),
          parseInt(timeLength.substring(4,6)) - 1,
          parseInt(timeLength.substring(6,8))
        );
        break;
      default :
        throw "Ow<这是一条来自common的提示：format参数输入错误";
    }
    let timeString = format.replace(/YYYY/gi,dateObj.getFullYear() + '')
      .replace(/MM/g,tf(dateObj.getMonth() + 1))
      .replace(/DD/gi,tf(dateObj.getDate()))
      .replace(/hh/gi,tf(dateObj.getHours()))
      .replace(/mm/g,tf(dateObj.getMinutes()))
      .replace(/ss/gi,tf(dateObj.getSeconds()));
    return timeString;
  }


let formatMins = function(num){
  if(typeof parseInt(num) === 'number'){
      num = parseInt(num);
  }else{
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


export default{
    global,
    getUploadUrl(){
        return setting.getUploadUrl;
    },
  /** Function : 时间函数封装 , Created By HarryC on 2019/1/31 0031 */
  formatTime(time,format){
    return formatTime(time,format);
  },
  /** Function : 重写ajax , Created By HarryC on 2019/1/31 0031 */
  postAjax(options){
    return startAjax(options);
  },
  /** Function : 获取真实url,promise对象注意！ , Created By HarryC on 2019/1/31 0031 */
  getUrlByCode(code,url){
    return getRealUrl(code,url);
  },
  /** Function : 获取cookie , Created By HarryC on 2019/1/31 0031 */
  getCookieByName(cookiename){
    return getCookie(cookiename);
  },
  /** Function : 获取Url参数 , Created By HarryC on 2019/1/31 0031 */
  getUrlParam(name){
    let reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
    let r = window.location.search.substr(1).match(reg);
    if (r != null) return decodeURI(r[2]); // 解码
    return '';
  },
  /** Function : 把秒数转换为hh:mm:ss形式 , Created By HarryC on 2019/3/1 0001 */
  formatSeconds(num){
    return formatMins(num);
  },
  /** Function : 正则表达式 , Created By HarryC on 2019/1/31 0031 */
  regExps:{
    chinese: /^[\u4e00-\u9fa5]{0,}$/, // 匹配中文字符
    email: /^[\w-]+(\.[\w-]+)*@[\w-]+(\.[\w-]+)+$/, // email地址
    account: /^[a-zA-Z][a-zA-Z0-9_]{4,15}$/, // 字母开头，允许 5-16 字节，允许字母数字下划线
    pwd: /^[\u4e00-\u9fa5_a-zA-Z0-9]+$/, // 中文、英文、数字及下划线
    url: /^[http|ftp|https]:\/\/(\w+(-\w+)*)(\.(\w+(-\w+)*))*(\?\S*)?$/, // url地址
    qq: /^[1-9]\d{4,9}$/, // QQ
    phone:/^((0\d{2,3}-\d{7,8})|(1[358479]\d{9})|(\d{8}))$/,
    yphone: /^(13[0-9]|14[579]|15[0-3,5-9]|16[6]|17[0135678]|18[0-9]|19[89])\d{8}$/, // 手机号码
    floatNum: /^([1-9]\d{0,3}?(\.\d{1,2})?|0|0\.\d{1,2})$/, // max=9999.99
    num:/^([1-9][0-9]*)+(.[0-9]{1,2})?$/,//有1~3位小数的正实数
    znum:/^[1-9]\d*$/,//有1~3位小数的正实数
    isbn: /^(\d[- ]*){12}[\dxX]$/, //验证标准的13位isbn号
    URL:"rest",
    PREURL:''
  },
}
