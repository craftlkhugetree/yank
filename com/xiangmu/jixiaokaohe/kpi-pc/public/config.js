
var url = "http://app.dev.angke.com.cn/";   // 开发环境
window.g = {

  // 配置服务器地址
  url: url + "kpi/rest/",
  authUrl: url + "authweb/",
  appportalUrl: url + "appportalweb/",
  fileUrl: url + "fileweb/",
  idsUrl: url + "idsweb/rest/",

  // 文件地址
  viewUrl: url + "fileweb/rest/FileOut/view/",    // 预览地址
  uploadUrl: url + "fileweb/rest/FileOut/saveFile", // 上传地址
  excelUrl: url + "kpi/rest/kpi/excelData",//解析模板导入数据
  downUrl: url + "fileweb/rest/FileOut/down?ID=", // 下载地址

}
