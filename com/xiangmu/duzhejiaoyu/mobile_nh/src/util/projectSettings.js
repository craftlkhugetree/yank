// Vue => commonjs使用说明
// step1  安装axios,qs，ajax请求依赖于这两个插件;
//         npm install axios,qs -S

// step2  把projectSettings.js,util.js放入同一个文件夹，util依赖于projectSetting。

// step3  修改此下方的projectState,devAppportalurl参数
//        projectState参数只需在不同开发状态之间切换
//        devAppportalurl为测试用url,只用设置一次,一般为mock地址
//设置开发时所用url,一般为mock
let devAppportalurl = 'http://mock.dev.angke.com.cn/mock/5c773c0935040d0010510d43/rest/';
// 设置登录的url，如果是PC端则不用填写，手机端或者需要自定义绑定页面则需要填写。
// let loginToUrl = 'http://seat.dev.angke.cn/lres/mobile/index.html#/bind';
let loginToUrl = window.base.loginToUrl;
let nuist = window.base.nuist;
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
        return 'http://app.dev.angke.com.cn/appportalweb/rest/';
    }else if(projectState === 3){
        let pathName = document.location.pathname;
        // let projectName = pathName.substring(0, pathName.substr(1).indexOf('/') + 1);
        let projectName = "/appportalweb"
        let url=location.protocol+'//'+ location.host+projectName;
        return url + '/rest/';
    }else{
        throw '项目状态输入错误！';
    }
};
let getReadFile = function() {
  if(projectState === 1){
    return '/fileweb/rest/FileOut/view';
  }else if(projectState === 2) {
    return '/fileweb/rest/FileOut/view';
  }else if(projectState === 3){
    return `${location.protocol}//${location.host}/fileweb/rest/FileOut/view/`;
  }else{
    throw '项目状态输入错误！';
  }
}
let loginurl = function (Url) {
    if(Url){
        return Url;
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
      if(nuist){
        let pathName = window.document.location.pathname;
        let projectName = pathName.substring(0, pathName.substr(1).indexOf('/') + 1);
        let url=projectName+"/";
        let purl=document.location.href;//
        purl = purl.replaceAll('bind','campus').split('#')[0];
        return loginurl(url+'rest/Idsclient/reqLogin?reqUrl='+encodeURIComponent(purl));
      }else{
          return loginurl(loginToUrl);
      }
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
        return `${location.protocol}//${location.host}/fileweb/rest/FileOut/saveFile/`;
    }else{
        throw '项目状态输入错误！';
    }

};

let toast = function (type) {
  let _divbox = document.getElementsByClassName('box');
  // console.log(_divbox)
  let _div = document.createElement('div');
  _div.setAttribute('class','box');
  let divCss = {
    'position': 'fixed',
    'width':'100%',
    'height':'100%',
    'top':'0',
    'left': '0',
    'background':'#fff',
    'z-index':'99999'
  }
  for (let i in divCss){
    _div.style[i] = divCss[i];
  }
  let _message = document.createElement('div');
  // _message.innerText = message;
  let spanCss = {
    'color': '#000',
    'position':'absolute',
    'margin': ' auto',
    'text-align':'center',
    'font-size' : '.7rem',
    'width':'80%',
    'height':'50%',
    'background':'url(./static/img/Mob.png) no-repeat center center',
    'background-size':'contain',
    'left': '0',
    'top': '0',
    'right': '0',
    'bottom': '0'
  }
  for (let i in spanCss){
    _message.style[i] = spanCss[i];
  }
  _div.appendChild(_message);
  let _body = document.getElementsByTagName('body')[0];
  _body.appendChild(_div);
  // if(type=='1'||type=='0'){
  //   setTimeout(function () {
  //     _body.removeChild(_div);
  //   },200)
  // }
  // setTimeout(function () {
  //   _body.removeChild(_div);
  // },200)
}
let toast_close = function(){
  let _div = document.getElementsByClassName('box');
  // console.log(_div)
  let _body = document.getElementsByTagName('body')[0];
  for (var i = 0; i < _div.length; i++) {
    _body.removeChild(_div[i]);
  }

  // _div.style.display='none'
  // _body.removeChild(_div);
}

export default {
  getReadFile : getReadFile(),
  getLoginUrl : getLoginUrl(),
  getUploadUrl : getUploadUrl(),
  getAppportalwebUrl : getAppportalwebUrl(),
  tips(message){
    return toast(message);
  },
  tipsclose(){
    return toast_close();
  }

}
