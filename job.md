xss前端防御，脚本，原生api改写，img.src自定义上报，DOM事件流，capture。  capture.html, compatible.html, httphijack。 
富文本 xss.js白名单。
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
