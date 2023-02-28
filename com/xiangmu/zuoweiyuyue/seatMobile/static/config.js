//var mainURL = 'http://172.20.1.249:8080';
var mainURL = 'http://app.dev.angke.com.cn';
// var mainURL = "http://testseat.xuanhaozuo.com";
var fileURL = 'http://app.dev.angke.com.cn';
window.base = {
  mainURL: mainURL,
  baseURL: mainURL + "/seat_v2/rest/",
  // loginToUrl: mainURL + '/seat_v2/mobile/#/login', //线上登录地址
  loginToUrl: mainURL + "/mseat/#/login",
  authURL: mainURL + "/authweb/rest/",
  idsURL: mainURL + "/idsweb/rest/",
  fileUrl: fileURL + "/fileweb/",
  uploadUrl: fileURL + "/fileweb/rest/FileOut/saveFile", // 上传地址
  fileUrl: fileURL + "/fileweb/rest/FileOut/view", // 文件预览地址
  downUrl: fileURL + "/fileweb/rest/FileOut/down?ID=", // 下载地址
  IsOnlyWXSign: false, //是否只支持微信签到
  IsLocalLogin: true,
  WXSIGN_TYPE: "wx", // 微信环境下扫一下 wx(原始config) uniapp_mp（uniapp小程序，跳到小程序扫完跳回） js(非微信扫码，必须是https协议才可使用)
  uniapp_mp_scan: "/pages/scanCode/scanCode",
  scan_callback: mainURL + "/mseat/#/index", //首页地址
  isSjzkj: false, //是否是正定师范学院登录
  isXj: false, //是否是西京学院
  isSeatYyzc: true, //是否阜阳理工智慧校园app
  //  true可自由选择预约时间；false 默认选择所有时间 并且不可更改
  isAppointedWeekTime: 0,
  isAppointedDayTime: 1,
  hwwxindex:false//使用汇文登录的时候使用，默认false
};
