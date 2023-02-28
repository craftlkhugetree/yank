var mainURL = 'http://seat.dev.angke.cn';
// var mainURL = 'https://xj.dev.angke.cn';
// var mainURL = 'http://172.20.1.251:8010';
window.base = {
    mainURL: mainURL,
    // 读者教育2
    baseURL: mainURL + '/lres_nh/rest/',
    // baseURL:mainURL+'/lres/rest/',
    idsURL: mainURL + '/idsweb/rest/',
    tenantURL: 'http://seat.dev.angke.cn/tenantweb/rest/',
    sourceurl: 'http://seat.dev.angke.cn',
    titles: '新生入馆考试系统',
    mainDomain: 'angke',
    needstudy: true,//学习资料是否必学 true：开启  false：不开启
    cz: false,//是不是常州大学的，是：绑定的时候后面加密码后6位的提示
    nh: true,//是不是南航的
    activity: false,//开启活动模块
    activityURL: mainURL + '/activityweb/rest/',
    activityimgURL: mainURL + '/fileweb/rest/FileOut/view/',
    activityimgsaveURL: mainURL + '/fileweb/rest/FileOut/saveFile',
    activitytemplateURL: mainURL + '/templateweb/rest/',
    placeholderCardText: '请输入证件号',
    placeholderPassText: '请输入密码',
    other: false,//新生绑定不需要验证身份证--辽东
    loginToUrl: '/lres_nh/mobile/index.html#/bind',//本地登陆时配置
    //loginToUrl:'nh',
    nuist: false,//南信大   登录都跳转统一的统一登录页面
    nhLoginInfo: '所有新生都凭身份证号码登录，如果无法登陆，请稍等几天再试',//南航不是第一次登录 下面的登陆提示
    isCx:true //是否超星平台
}

// 2021-7-15 新增需求：南航的在点击开始考试按钮的时候，如果是第一次登录，就先显示一个弹窗
//2021-7-29 南信大登录都跳转统一的统一登录页面
//2021-8-5 南航的提示卡片去掉 在线学习规则和在线考试规则


//index.html 分3个版本，通用版本，常州大学和南工程