# api

# chrome

"chrome.exe" --test-type --ignore-certificate-errors

# stylus

^(?!._(seat.dev.angke.cn|z.angke.com.cn))._$
^(?!._(localhost|z.angke.com.cn))._$
html,
body {
font-family: "SF UI Text", "BlinkMacSystemFont", "Helvetica Neue", "Source Han Sans SC", "Segoe UI", "Roboto", "Microsoft Yahei", sans-serif;
font-weight: bold;
background-color: #C7EDCC !important;
/_ background-color:#606266 !important; _/
}

table,
span,
p,
i,
a,
article {
/_ //兼容不同浏览器 _/
-webkit-filter: brightness(0.8);
-o-filter: brightness(0.8);
-moz-filter: brightness(0.8);
filter: brightness(0.8);
/_ //设置亮度值，范围：0-1 _/
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
