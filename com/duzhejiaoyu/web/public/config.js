// var url = "http://app.dev.angke.com.cn"
// var url = "http://172.20.0.116:11080/";
var url = "http://172.20.0.116/";

window.g = {
  // 配置服务器地址
  url: url + "lres2022/rest/",
  authUrl: url + "authweb/",
  appportalUrl: url + "appportalweb/",
  fileUrl: url + "fileweb/",
  idsUrl: url + "idsweb/rest/",

  // 图片地址
  viewUrl: url + "fileweb/rest/FileOut/view/", // 预览地址
  uploadUrl: url + "fileweb/rest/FileOut/saveFile", // 上传地址
  downUrl: url + "fileweb/rest/FileOut/down?ID=", // 下载地址

  // 视频上传转换地址
  videoUploadUrl: url + "lres2022/rest/format/video",  
  // 文档上传转换地址
  fileUploadUrl: url + "lres2022/rest/format/pdf",
  // 视频文档展示地址
  fileViewUrl: url + "lres2022/rest/learn/view/",
}

window.base = {
  isLocalLogin: true, // 本地登录页面：true,  统一认证登录页面：false
  isNh: true,  // 是否南航
}