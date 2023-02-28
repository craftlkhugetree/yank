var mainURL = 'http://app.dev.angke.com.cn';
// var mainURL = 'http://seat.dev.angke.cn';
// var mainURL = 'http://172.20.1.249:8080';
window.base = {
    mainURL:mainURL,
    projectName:'/lres_nh',
    // 读者教育2
    baseURL:mainURL+'/lres_nh/rest/',
    // baseURL:mainURL+'/lres/rest/',
    idsURL:mainURL+'/idsweb/rest/',
    authURL:mainURL+'/lres/rest/',
    // baseURL:'http://app.dev.angke.com.cn/lres/rest/',
    sourceurl:mainURL,
    tenantURL:mainURL+'/authweb/rest/',
    titles:'新生入馆考试系统',
    mainDomain:'angke',
    needstudy:true,//学习资料是否必学 true：开启  false：不开启
    cz:false,//是不是常州大学的，是：绑定的时候后面加密码后6位的提示
    nh:false,//是不是南航的
    placeholderCardText:'请输入证件号',
    placeholderPassText:'请输入密码',
    activity:false,//false 不开启活动菜单  true 开启活动菜单
    activityURL:mainURL+'/activityweb/rest/',
    activityimgURL:mainURL+'/fileweb/rest/FileOut/view/',
    activityimgsaveURL:mainURL+'/fileweb/rest/FileOut/saveFile',
    activitytemplateURL:mainURL+'/templateweb/rest/',
    other:false,//other?'证件号':'身份证号'
    loginToUrl:mainURL+'/lres_nh/web/index.html#/bind',//绑定的地址
    ysu:false,//参数后面的validateKey=FRONT_IDSTGC，true，不要 ，false要的
    nuist:false,//南信大
    nhLoginInfo:'所有新生都凭身份证号码登录，如果无法登陆，请稍等几天再试',//南航不是第一次登录 下面的登陆提示
    tips_status:true,
    isFysf:true,//判断是否是阜阳师范
    tips:"初始密码为身份证后六位。<a href='https://lib.cslg.edu.cn/bencandy.php?fid=227&id=818'>修改密码说明</a>"
}
//2021-11-16 新增提示控制开关，尽量使用学校自定义提示
// 2021-7-15 新增需求：南航的在点击开始考试按钮的时候，如果是第一次登录，就先显示一个弹窗
//2021-7-29 南信大登录都跳转统一的统一登录页面
