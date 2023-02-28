var url = "http://app.dev.angke.com.cn/"; // 开发环境
var url_1 = "http://172.20.0.14:11088/"; // 开发环境
window.g = {
    // 配置服务器地址
    url:          url_1 + "netrepair-api/rest/",
    // url:          url + "rest/",
    authUrl:      url + "authweb/",
    appportalUrl: url + "appportalweb/",
    fileUrl:      url + "fileweb/",
    idsUrl:       url + "idsweb/rest/"
}


// 是否启用本地的登录页面
window.isLocalLogin = true;