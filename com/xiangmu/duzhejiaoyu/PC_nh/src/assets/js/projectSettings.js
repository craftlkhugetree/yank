// Vue => commonjs使用说明
// step1  安装axios,qs，ajax请求依赖于这两个插件;
//         npm install axios,qs -S

// step2  把projectSettings.js,util.js放入同一个文件夹，util依赖于projectSetting。

// step3  修改此下方的projectState,devAppportalurl参数
//        projectState参数只需在不同开发状态之间切换
//        devAppportalurl为测试用url,只用设置一次,一般为mock地址
//设置开发时所用url,一般为mock
let devAppportalurl = 'http://mock.dev.angke.com.cn/mock/5c773c0935040d0010510d43/rest/';

let resLoginurl = window.g.loadingUrl;
// let testTargeturl = '';
// step4  在main.js中对Vue对象注入util
//        import util from 'util路径'
//        Vue.prototype.util = util;

// setp5  在项目中使用
//        this.util.functions..

// 方法说明
// 1.ajax函数
// postAjax
// 参数
// postAjax({
//  code : '项目code',
//  url : '接口url',
//  data: 如果有的话data
// }).then(function(res){
//   业务逻辑
// })
//
// 2.获取真实url
// getUrlByCode
// getUrlByCode({
//  code : '项目code',
//  url : '接口url',
// }).then(function(res){
//   业务逻辑
// })
//
// 3.获取cookie
// getCookieByName
// 参数1 cookie名字:字符串
// 返回：cookie值
//
// 4.获取url参数
// getUrlParam
// 参数1 url键:字符串
// 返回 url值
//
// 5.转换秒参数
// formatSeconds
// 参数1 秒数 :字符串/数字
// 返回 hh:mm:ss
// 133581 => 37:06:21
//
// 6.时间函数
// formatTime
// 参数1  时间
// 可接受格式：14/17位字符串 ：20181030162030
//          13位时间戳 new Date().getTime()
//          8位字符串 ： 20181030
//
// 参数2  输出格式
// 可接受格式 YYYY年，MM月，DD日，hh时，mm分，ss秒
//  formatTime('20181030162030','YYYY年MM月DD日 hh:mm:ss')
//  输出 2018年10月30日 16:20:30
let prods = process.env.NODE_ENV;
let projectState;
if(prods === "development"){
  projectState = 1;
}else if(prods === "test"){
  projectState = 2;
}else if(prods === "production"){
  projectState = 3;
}

let getAppportalwebUrl = function () {
    if(projectState === 1){
        return devAppportalurl;
    }else if(projectState === 2) {
        return 'http://seat.dev.angke.cn/appportalweb/rest/';
    }else if(projectState === 3){
        let pathName = document.location.pathname;
        // let projectName = pathName.substring(0, pathName.substr(1).indexOf('/') + 1);
        let projectName = 'appportalweb';
        let url=location.protocol+'//'+ location.host+projectName;
        return url + '/rest/';
    }else{
        throw '项目状态输入错误！';
    }
};

let loginurl = function (Url) {
  if(Url){
    return Url
  }else{
    let pathName = window.document.location.pathname;
    let projectName = pathName.substring(0, pathName.substr(1).indexOf('/') + 1);
    let url=projectName+"/";
    let purl=document.location.href;//
    return url+'rest/Idsclient/reqLogin?reqUrl='+encodeURIComponent(purl);
  }

}

let getLoginUrl = function () {

    if(projectState === 1){
        return location.href;
    }else if(projectState === 2 ||projectState === 3){
        return loginurl(resLoginurl);
    }else{
        throw '项目状态输入错误！';
    }

};

let getUploadUrl = function () {

    if(projectState === 1){
        return 'http://file.dev.angke.com.cn/fileweb/rest/FileOut/saveFile';
    }else if(projectState === 2) {
        return 'http://file.dev.angke.com.cn/fileweb/rest/FileOut/saveFile';
    }else if(projectState === 3){
        return `${location.protocol}//${location.host}/fileweb/rest/FileOut/view/`;
    }else{
        throw '项目状态输入错误！';
    }

};

let toast = function (message) {
  let _div = document.createElement('div');
  let divCss = {
    'position': 'fixed',
    'top':'50%',
    'width': '100%',
  }
  for (let i in divCss){
    _div.style[i] = divCss[i];
  }
  let _message = document.createElement('sapn');
  _message.innerText = message;
  let spanCss = {
    'background-color' : 'rgba(0,0,0,0.5)',
    'padding': '15px 15px',
    'border-radius': '5px',
    'color': '#FFF',
    'margin': '0 auto',
    'font-size' : '1rem'
  }
  for (let i in spanCss){
    _message.style[i] = spanCss[i];
  }
  _div.appendChild(_message);
  let _body = document.getElementsByTagName('body')[0];
  _body.appendChild(_div);
  setTimeout(function () {
    _body.removeChild(_div);
  },3000)
}


export default {
  getLoginUrl : getLoginUrl(),
  getUploadUrl : getUploadUrl(),
  getAppportalwebUrl : getAppportalwebUrl(),
  tips(message){
    return toast(message);
  }

}
