
let basecode = "http://app.dev.angke.com.cn/";//域名
let signbasecode = "http://seat.dev.angke.cn/lres_nh/mobile/";//域名
// let basecode="http://172.20.1.251:8010/";//域名

window.g = {
  ApiUrl: basecode + 'authweb/rest', // 配置服务器地址,
  // ApiUrl3:basecode+'lres/rest', // 配置服务器地址,
  ApiUrl3: basecode + 'lres_nh/rest', // 配置服务器地址,
  ApiUrl4: basecode + 'fileweb/',  // 配置服务器地址,
  ApiUrl1: basecode + 'appportalweb/rest/', // 配置服务器地址,
  viewImg: basecode,
  loginToUrl:basecode+'lres/control',
  signbasecode: signbasecode,
  activityURL: basecode + 'activityweb/rest/',
  activityimgURL: basecode + 'fileweb/rest/FileOut/view/',
  activityimgsaveURL: basecode + 'fileweb/rest/FileOut/saveFile',
  activitytemplateURL: basecode + 'templateweb/rest/',
};
