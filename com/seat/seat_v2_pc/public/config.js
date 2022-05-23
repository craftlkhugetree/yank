
var url = "http://app.dev.angke.com.cn/";   // 开发环境

window.g = {

  // 配置服务器地址
  url: url + "seat_v2/rest/",
  authUrl: url + "authweb/",
  appportalUrl: url + "appportalweb/",
  fileUrl: url + "fileweb/",
  idsUrl: url + "idsweb/rest/",

  // 文件地址
  viewUrl: url + "fileweb/rest/FileOut/view/",    // 预览地址
  uploadUrl: url + "fileweb/rest/FileOut/saveFile", // 上传地址
  downUrl: url + "fileweb/rest/FileOut/down?ID=", // 下载地址

}

// 是否启用本地的登录页面
window.isLocalLogin = false;
