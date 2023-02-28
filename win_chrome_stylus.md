# win

win + i 打开设置
win + x 打开系统快捷菜单-网络连接
win + s 搜索‘代理’
win + r ncpa.cpl
**\* snippingtool 截图；control 控制面板，calc 计算器，eventvwr 事件查看器，gpedit.msc 组策略，mstsc 远程桌面，dxdiag 诊断；**

win + x + a 打开设置菜单，可选管理员 cmd
管理员 shell： 输入 cmd 后 ctrl+shift+enter
taskkill /PID 19768 /F

# chrome

To activate search completion, type o to activate vomnibar and then type the search completion keyword as defined in settings (such as 'g') and press space.
map ` visitPreviousTab
map d removeTab
map u restoreTab

"chrome.exe" --test-type --ignore-certificate-errors
代理设置 socks=127.0.0.1 10808
switchy Omega：https://raw.githubusercontent.com/gfwlist/gfwlist/master/gfwlist.txt

pdf reader 插件设置：
.active, .textLayer {
background-color: green; /_ 设置成你想要的背景色 _/
}

模拟微信浏览器：network conditions 界面去掉 user agernt 的勾选，选择 custom，并在输入框中输入设备模拟参数
iPhone 手机模拟参数：
Mozilla/5.0 (iPhone; CPU iPhone OS 8_0 like Mac OS X) AppleWebKit/600.1.4 (KHTML, like Gecko) Mobile/12A365 MicroMessenger/5.4.1 NetType/WIFI

安卓手机模拟参数：
Mozilla/5.0 (Linux; Android 5.0; SM-G900P Build/LRX21T) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/33.0.0.0 Mobile Safari/537.36 MicroMessenger/6.0.0.54_r849063.501 NetType/WIFI

查看本地已安装的插件源码路径：C:\Users\用户名\AppData\Local\Google\Chrome\User Data\Default\Extensions

chrome://flags webgl

# stylus

^(?!._(seat.dev.angke.cn|z.angke.com.cn|localhost|127.0.0.1|172.20.1.251|172.20|testseat.xuanhaozuo.com|tsgyy.sjzc.edu.cn/))._$
^(?!.*(seat.dev.angke.cn|z.angke.com.cn|localhost|127.0.0.1|172.20.)).*$
html,
body {
/_ font-family: "SF UI Text", "BlinkMacSystemFont", "Helvetica Neue", "Source Han Sans SC", "Segoe UI", "Roboto", "Microsoft Yahei", sans-serif; _/
font-weight: bold;
background-color: #C7EDCC !important;
filter: brightness(0.8);
/_ background-color:#606266 !important; _/
}

table,
span,
p,
i,
a,
article, section {
/_ //兼容不同浏览器 _/
/_ -webkit-filter: brightness(0.8);
-o-filter: brightness(0.8);
-moz-filter: brightness(0.8);
filter: brightness(0.8); _/
/_ //设置亮度值，范围：0-1 _/
}
.hx-warp,.left-toolbox,.\_1Jdfvb {
display: none !important
}

@-moz-document domain("zhihu.com") {
body {
font-family: "SF UI Text", "BlinkMacSystemFont", "Helvetica Neue", "Source Han Sans SC", "Segoe UI", "Roboto", "Microsoft Yahei", sans-serif;
}
.zu-top {
background: white;
border-top: 3px solid #086ed5;
box-shadow: 0 5px 2px -2px rgba(200,200,200,0.2);
border-bottom: none;
}
.zu-top-link-logo {
background-image: url(http://tianyuf.github.io/zhihu-minimal/logo_2x.png)!important;
background-size: 61px 30px;
}
li.zu-top-nav-li.current {
background: #fff;
box-shadow: none;
color: #0e78e7;
font-weight: 700;
}
.zu-top-nav-li, .zu-top-nav-link, .zu-top-nav-link:visited {
color: #0e78e7;
text-shadow: none;
}
.zu-top-nav-link:hover {
color: #259;
}
/_ Navbar profile item _/
.top-nav-profile .zu-top-nav-userinfo, .zu-top-nav-userinfo a {
color: #0e78e7;
text-shadow: none;
text-align: center;
text-indent: inherit;
background: none;
}
.top-nav-profile a, .zu-top-nav-userinfo:hover, .zu-top-nav-userinfo.selected, html.no-touchevents .top-nav-profile:hover .zu-top-nav-userinfo {
background-color: #fff!important;
background: #fff!important;
box-shadow: none;
font-size: 13px;
font-weight: 300;
}
/_ Profile dropdown _/
.top-nav-dropdown li a {
color: #0e78e7;
padding-left: 30px;
box-shadow: none;
border-top: none;
text-shadow: none;
font-size: 13px;
}
.top-nav-dropdown li a:hover {
color: #259;
}
.zg-icon-dd-home, .zg-icon-dd-pm, .zg-icon-dd-settings, .zg-icon-dd-logout {
display: none;
}
.zu-top-nav-userinfo .Avatar {
display: none;
}
/_ iOS style notification badge _/
.zg-noti-number {
font-weight: 300;
background: #fe0002;
border: 1px solid #fe0002;
box-shadow: none;
}
/_ Question Icon _/
.zu-top-add-question, .zu-top-add-question:active {
background: transparent!important;
color: #0e78e7;
border: none;
box-shadow: none;
font-size: 13px;
width: 50px;
height: 25px;
line-height: 25px;
margin-top: 9.5px;
text-shadow: none;
font-weight: 500;
}
.zu-top-add-question:hover {
color: #259;
}
.zu-top-search-input, .zu-top-search-input:active {
width: 100%;
color: #49525c;
font-size: 13px;
background-color: transparent!important;
border: none;
border-radius: 0px;
box-shadow: none;
outline: 0;
}
.zu-top-search-input:focus {
background-color: #fff;
box-shadow: none;
}
.zu-top-search-form {
width: inherit;
}
/_ Search button _/
.zu-top-search-form .zu-top-search-button {
display: none;
background: #fff!important;
border: none;
border-top-right-radius: 0px;
border-bottom-right-radius: 0px;
box-shadow: none;
box-sizing: border-box;
outline: 0;
cursor: pointer;
}
.zu-top-nav, .zu-top-search {
float: right;
}
.topnav-noauth a {
color: #0e78e7;
text-shadow: none;
}
.topnav-noauth a:hover {
color: #259;
text-shadow: none;
}
}
