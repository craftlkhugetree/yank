var url = "http://app.dev.angke.com.cn/"; // 开发环境
var url_1 = "http://172.20.1.249:8080/"; // 徐宇鹏环境
window.g = {
  // 配置服务器地址
  url: url + "njit-netrepair-api/rest/",
  // url:  url + "rest/",
  // url:
  //   window.location.host.indexOf("localhost") > -1
  //     ? url + "njit-netrepair-api/rest/"
  //     : url + "rest/",
  authUrl: url + "authweb/",
  appportalUrl: url + "appportalweb/",
  fileUrl: url + "fileweb/",
  fwzxUrl: "http://hqfwdt.njau.edu.cn/hqweb",

  idsUrl: url + "idsweb/rest/",
  name: "/njitrepair"
};
