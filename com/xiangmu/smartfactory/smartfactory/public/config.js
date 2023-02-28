
// var url = "http://172.20.1.249:9000/";         // 开发环境
var url = 'http://172.20.0.115:9000/';         // 开发环境
window.g = {

  // 配置服务器地址
  url:          url + "angke-smartfactory/",
  adminUrl:     url + "angke-admin/",
  authUrl:      url + "angke-auth/",
  fileUrl:      url + "fileweb/",
  // appportalUrl: url + "appportalweb/",
  // idsUrl:       url + "idsweb/rest/",

  // 文件地址
  viewUrl:      url + "fileweb/rest/FileOut/view/" ,    // 预览地址
  uploadUrl:    url + "fileweb/rest/FileOut/saveFile" , // 上传地址
  downUrl:      url + "fileweb/rest/FileOut/down?ID=" , // 下载地址
  
}

// 是否打开测试按钮
window.isTest = true
