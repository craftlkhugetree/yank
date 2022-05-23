// var mainURL = 'http://172.20.1.249:8080';
var mainURL = 'http://app.dev.angke.com.cn';
var fileURL = 'http://app.dev.angke.com.cn';
window.base = {
    mainURL: mainURL,
    baseURL: mainURL + '/seat_v2/rest/',
    // loginToUrl: mainURL + '/seat_v2/mobile/#/login', //线上登录地址
    loginToUrl: mainURL + '/mseat/#/login',
    authURL: mainURL + '/authweb/rest/',
    idsURL: mainURL + '/idsweb/rest/',
    fileUrl: fileURL + "/fileweb/",
    uploadUrl: fileURL + "/fileweb/rest/FileOut/saveFile", // 上传地址
    fileUrl: fileURL + "/fileweb/rest/FileOut/view", // 文件预览地址
    downUrl: fileURL + "/fileweb/rest/FileOut/down?ID=", // 下载地址
    IsOnlyWXSign: false,//是否只支持微信签到
    IsLocalLogin: true,
    WXSIGN_TYPE: 'uniapp_mp', // 微信环境下扫一下 wx(原始config) uniapp_mp（uniapp小程序，跳到小程序扫完跳回）
    uniapp_mp_scan: '/microportal/ScanCode/index'
}
