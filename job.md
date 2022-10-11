xss前端防御，脚本，原生api改写，img.src自定义上报，DOM事件流，useCapture。  capture.html, compatible.html, httphijack。 
v-html富文本 xss.js白名单。
前端异常及降级处理，https://www.jianshu.com/p/53ae5aee0859
this绑定规则，https://xiaohuochai.site/JS/ECMA/this/binding.html

大屏：字体、尺寸、背景图片缩放，没有webpack打包，IOS夏令时兼容

民国库：高亮搜索，繁体字多种，正则(非贪婪?， ?:非捕获分组， 反向引用\1$1，?=正向预查 ?<=反向预查)

netRepair-njit:  webpack plugin过滤‘ac5d ’

148. webpack 中 loader 和 plugin 的区别是什么？（平安）
loader，它是一个转换器，将A文件进行编译成B文件，比如：将A.less转换为A.css，单纯的文件转换过程。
plugin是一个扩展器，它丰富了webpack本身，针对是loader结束后，webpack打包的整个过程，它
并不直接操作文件，而是基于事件机制工作，会监听webpack打包过程中的某些节点，执行广泛的任务
注：webpack本质上是一种事件流的机制，它的工作流程就是将各个插件串联起来，而实现这一切的核
心就是Tapable，Tapable就像nodejs中EventEmitter,提供对事件的注册on和触发emit。Webpack
会在特定的时间点广播出特定的事件，插件在监听到感兴趣的事件后会执行特定的逻辑。

element-ui 修改lib，然后编译打包，上传npm。

ios11不只是ES6 的扩展运算符， ios12支持。  用xcode模拟ios11版本，Babel处理代码。但是第三方库还是有扩展运算符，第三方的包默认是没有被Babel处理过的，所以给vue.config.js的配置文件中transpileDependencies配置选项中添加上出问题的包的名称就可以了。
https://baijiahao.baidu.com/s?id=1674088474520357497&wfr=spider&for=pc

签到机时间不准，它从服务器读取前端文件并定时生成二维码。微信扫二维码签到。所以要服务器接口或ngnix接口提供时间。

微信浏览器 缓存机制，  ngnix不生效 add_header Cache-Control “no-store,max-age=0”;
过的js文件上加上hash过的后缀，所以js一般在上线后都会更新。但是index.html不会，由于index.html被缓存而引用了老的js文件，如果这些老的文件在微信端被缓存那用用户登上去看的时候就不会发现有更新。其他浏览器没有这个问题。
或者  location ~ .*\.(?:htm|html)$ {
    # 由于服务器部署多套项目环境，所以配置具体的项目目录。
    root    jimei-admin
    # 缓存设置 -1为永不缓存
    expires      -1;
    # 添加返回头字段，设置HTTP请求头
    add_header Cache-Control "private, no-store, no-cache, must-revalidate, proxy-revalidate";
}

