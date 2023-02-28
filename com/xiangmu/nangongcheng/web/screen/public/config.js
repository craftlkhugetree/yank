
var url = "http://app.dev.angke.com.cn/";   // 开发环境
window.g = {
  // 配置服务器地址
  url: url + 'college-show/rest/',
  authUrl: url + 'authweb/',
  appportalUrl: url + 'appportalweb/',
  fileUrl: url + 'fileweb/',
  idsUrl: url + 'idsweb/rest/',

  // 文件地址
  viewUrl: url + 'college-show/rest/attach/view/', // 预览地址
  uploadUrl: url + 'college-show/rest/attach/upload', // 上传地址
  downUrl: url + 'fileweb/rest/FileOut/down?ID=', // 下载地址
};

// 是否启用本地的登录页面
window.isLocalLogin = true;
