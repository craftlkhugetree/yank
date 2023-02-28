let loginToUrl = window.base.loginToUrl;
let nuist = window.base.nuist;

let prods = process.env.NODE_ENV;
let projectState;
if (prods === "development") {
  projectState = 1;
} else if (prods === "test") {
  projectState = 2;
} else if (prods === "production") {
  projectState = 3;
}

let getAppportalwebUrl = function () {
  if (projectState === 1) {
    return devAppportalurl;
  } else if (projectState === 2) {
    return 'http://app.dev.angke.com.cn/appportalweb/rest/';
  } else if (projectState === 3) {
    let pathName = document.location.pathname;
    let projectName = pathName.substring(0, pathName.substr(1).indexOf('/') + 1);
    // let projectName = "/appportalweb"
    let url = location.protocol + '//' + location.host + projectName;
    return url + '/rest/';
  } else {
    throw '项目状态输入错误！';
  }
};
let getReadFile = function () {
  if (projectState === 1) {
    return '/fileweb/rest/FileOut/view';
  } else if (projectState === 2) {
    return '/fileweb/rest/FileOut/view';
  } else if (projectState === 3) {
    return `${location.protocol}//${location.host}/fileweb/rest/FileOut/view/`;
  } else {
    throw '项目状态输入错误！';
  }
}
let loginurl = function (Url) {
  if (Url) {
    return Url;
  } else {
    let pathName = window.document.location.pathname;
    let projectName = pathName.substring(0, pathName.substr(1).indexOf('/') + 1);
    let url = projectName + "/";
    let purl = document.location.href;//
    return url + 'rest/Idsclient/reqLogin?reqUrl=' + encodeURIComponent(purl);
  }

}

let getLoginUrl = function () {

  if (projectState === 1) {
    return location.href;
  } else if (projectState === 2 || projectState === 3) {
    if (nuist) {
      let pathName = window.document.location.pathname;
      let projectName = pathName.substring(0, pathName.substr(1).indexOf('/') + 1);
      let url = projectName + "/";
      let purl = document.location.href;//
      purl = purl.replace('bind', 'campus').split('#')[0];
      return loginurl(url + 'rest/Idsclient/reqLogin?reqUrl=' + encodeURIComponent(purl));
    } else {
      return loginurl(loginToUrl);
    }

  } else {
    throw '项目状态输入错误！';
  }

};

let getUploadUrl = function () {

  if (projectState === 1) {
    return 'http://file.dev.angke.com.cn/fileweb/rest/FileOut/saveFile';
  } else if (projectState === 2) {
    return 'http://file.dev.angke.com.cn/fileweb/rest/FileOut/saveFile';
  } else if (projectState === 3) {
    return `${location.protocol}//${location.host}/fileweb/rest/FileOut/saveFile/`;
  } else {
    throw '项目状态输入错误！';
  }

};

let toast = function (message) {
  let _div = document.createElement('div');
  let divCss = {
    'position': 'fixed',
    'top': '50%',
    'width': '100%',
  }
  for (let i in divCss) {
    _div.style[i] = divCss[i];
  }
  let _message = document.createElement('sapn');
  _message.innerText = message;
  let spanCss = {
    'background-color': 'rgba(0,0,0,0.5)',
    'padding': '15px 15px',
    'border-radius': '5px',
    'color': '#FFF',
    'margin': '0 auto',
    'font-size': '1rem'
  }
  for (let i in spanCss) {
    _message.style[i] = spanCss[i];
  }
  _div.appendChild(_message);
  let _body = document.getElementsByTagName('body')[0];
  _body.appendChild(_div);
  setTimeout(function () {
    _body.removeChild(_div);
  }, 3000)
}


export default {
  getReadFile: getReadFile(),
  getLoginUrl: getLoginUrl(),
  getUploadUrl: getUploadUrl(),
  getAppportalwebUrl: getAppportalwebUrl(),
  tips(message) {
    return toast(message);
  }

}
