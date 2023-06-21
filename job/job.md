xss 前端防御，脚本，原生 api 改写，img.src 自定义上报，DOM 事件流，useCapture。 capture.html, compatible.html, httphijack。
v-html 富文本 xss.js 白名单。
前端异常及降级处理，https://www.jianshu.com/p/53ae5aee0859
this 绑定规则，https://xiaohuochai.site/JS/ECMA/this/binding.html

大屏：字体、尺寸、背景图片缩放，没有 webpack 打包，IOS 夏令时兼容

民国库：高亮搜索，繁体字多种，正则(非贪婪?， ?:非捕获分组， 反向引用\1$1，?=正向预查 ?<=反向预查)

netRepair-njit: webpack plugin 过滤‘ac5d ’

生产环境，上千条数据要删除，没有批量按钮，直接数据库删除？ 前端模拟点击，如何确保完成并对异步并发的错误结果进行处理？浏览器都会限制单个域下边的并发连接数，当然对于总的并发连接数也有限制。

nginx -s reload createFile error gitbash cmd taskkill awk
nginx -s stop

中文传递到后台是乱码，要在 tomcat 的配置文件的 Connector 标签,在末尾添 URIEncoding=“UTF-8”，前端 post 时可指明，get 则只能反向回去查 iso 再解码。

BMap：地图掩膜，步行路线等。

chrome 插件 api， popup inject manifest.json csdn 的全部展开

148. webpack 中 loader 和 plugin 的区别是什么？（平安）
     loader，它是一个转换器，将 A 文件进行编译成 B 文件，比如：将 A.less 转换为 A.css，单纯的文件转换过程。
     plugin 是一个扩展器，它丰富了 webpack 本身，针对是 loader 结束后，webpack 打包的整个过程，它
     并不直接操作文件，而是基于事件机制工作，会监听 webpack 打包过程中的某些节点，执行广泛的任务
     注：webpack 本质上是一种事件流的机制，它的工作流程就是将各个插件串联起来，而实现这一切的核
     心就是 Tapable，Tapable 就像 nodejs 中 EventEmitter,提供对事件的注册 on 和触发 emit。Webpack
     会在特定的时间点广播出特定的事件，插件在监听到感兴趣的事件后会执行特定的逻辑。

element-ui 修改 lib，然后编译打包，上传 npm。

ios11 不只是 ES6 的扩展运算符， ios12 支持。 用 xcode 模拟 ios11 版本，Babel 处理代码。但是第三方库还是有扩展运算符，第三方的包默认是没有被 Babel 处理过的，所以给 vue.config.js 的配置文件中 transpileDependencies 配置选项中添加上出问题的包的名称就可以了。
https://baijiahao.baidu.com/s?id=1674088474520357497&wfr=spider&for=pc

签到机时间不准，它从服务器读取前端文件并定时生成二维码。微信扫二维码签到。所以要服务器接口或 ngnix 接口提供时间。

微信浏览器 缓存机制， ngnix 不生效 add_header Cache-Control “no-store,max-age=0”;
过的 js 文件上加上 hash 过的后缀，所以 js 一般在上线后都会更新。但是 index.html 不会，由于 index.html 被缓存而引用了老的 js 文件，如果这些老的文件在微信端被缓存那用用户登上去看的时候就不会发现有更新。其他浏览器没有这个问题。
或者 location ~ .\*\.(?:htm|html)$ { # 由于服务器部署多套项目环境，所以配置具体的项目目录。
root jimei-admin # 缓存设置 -1 为永不缓存
expires -1; # 添加返回头字段，设置 HTTP 请求头
add_header Cache-Control "private, no-store, no-cache, must-revalidate, proxy-revalidate";
}

149. 对于小于 8k 的图片，会将图片转成 base64 直接插入图片，不会再在 dist 目录生成新图片。对于大于 8k 的图片，会打包进 dist 目录，之后将新图片地址返回给 src。
     vue 的图片一定会被编译，而动态添加的 src 编译过后的地址，与图片文件编译过后的地址不一致，导致无法正确的引入资源，所以叫‘动态添加的 src 会被当做静态资源’。
     静态资源：一般客户端发送请求到 web 服务器，web 服务器从内存在取到相应的文件，返回给客户端，客户端解析并渲染显示出来。
     动态资源：一般客户端请求的动态资源，先将请求交于 web 容器，web 容器连接数据库，数据库处理数据之后，将内容交给 web 服务器，web 服务器返回给客户端解析渲染处理。

静态资源就是直接存放在项目中的资源，这些资源不需要我们发送专门的请求进行获取。比如 assets 目录下面的图片，视频，音频，字体文件，css 样式表等。
动态资源就是需要发送请求获取到的资源。比如我们刷淘宝的时候，不同的商品信息是发送的专门的请求获取到的，就可以称之为动态资源。

module.exports = {
// 使用 configureWebpack 对象，下面可以直接按照 webpack 中的写法进行编写
// 编写的内容，最终会被 webpack-merge 插件合并到 webpack.config.js 主配置文件中
configureWebpack: {
module: {
rules: [
{
test: /\.(png|jpe?g|gif|webp|avif)(\?.*)?$/,
type: 'asset',
parser: {
dataUrlCondition: {
// 这里我将默认的大小限制改成 6k。
// 当图片小于 6k 时候，使用 base64 引入图片；大于 6k 时，打包到 dist 目录下再进行引入
maxSize: 1024 * 6
}
}
}
]
}
}
}
当我们使用 require 方法引入一张图片的时候，webpack 会将这张图片当成一个模块，并根据配置文件中的规则进行打包。我们可以将 require 当成一个桥梁，使用了 require 方法引入的资源，该资源就会当成模块并根据配置文件进行打包，并返回最终的打包结果。
那么调用 require 方法引入一张图片之后发生了什么： 1.如果这张图片小于项目中设置的资源限制大小，则会返回图片的 base64 插入到 require 方法的调用处 2.如果这张图片大于项目中设置的资源限制大小，则会将这个图片编译成一个新的图片资源。require 方法返回新的图片资源路径及文件名

当你在 JavaScript、CSS 或  \*.vue  文件中使用相对路径 (必须以  .  开头) 引用一个静态资源时，该资源将会被包含进入 webpack 的依赖图中。在其编译过程中，所有诸如  <img src="...">、background: url(...)  和 CSS @import  的资源 URL  都会被解析为一个模块依赖。
例如，url(./image.png)  会被翻译为  require('./image.png')，而：
<img src="./image.png">
将会被编译到：
h('img', { attrs: { src: require('./image.png') }})

那么动态添加 src 的时候也会使用 require 引入，为什么 src 编译过后的地址，与图片资源编译过后的资源地址不一致？
答：因为动态引入一张图片的时候，src 后面的属性值，实际上是一个变量。webpack 会根据 v-bind 指令去解析 src 后面的属性值。并不会通过 reuqire 引入资源路径。这也是为什么需要手动的添加 require。
任何放置在 public 文件夹的静态资源都会被简单的复制，而不经过 webpack。需要通过绝对路径来引用它们。所以使用 require 引入资源的前提的该资源是 webpack 解析的模块，而 public 下的文件压根就不会走编译，也就不会使用到 require。

# vue2 中的 Object.defineProperty() 实际是通过 定义 或 修改 对象属性 的描述符来实现 数据劫持，其对应的缺点也是没法被忽略的：

只能拦截对象属性的 get 和 set 操作，比如无法拦截 delete、in、方法调用 等操作

动态添加新属性（响应式丢失）

保证后续使用的属性要在初始化声明 data 时进行定义
使用 this.$set() 设置新属性
通过 delete 删除属性（响应式丢失）

使用 this.$delete() 删除属性
使用数组索引 替换/新增 元素（响应式丢失）

使用 this.$set() 设置新元素
使用数组 push、pop、shift、unshift、splice、sort、reverse 等 原生方法 改变原数组时（响应式丢失）

使用 重写/增强 后的 push、pop、shift、unshift、splice、sort、reverse 方法
一次只能对一个属性实现 数据劫持，需要遍历对所有属性进行劫持

数据结构复杂时（属性值为 引用类型数据），需要通过 递归 进行处理。

# Object.defineProperty 可用于实现对象属性的 get 和 set 拦截，而数组其实也是对象，那自然是可以实现对应的拦截操作，那 Vue2 为什么不使用 Object.defineProperty 拦截 Array？性能问题到底指的是什么呢？下面是总结：

1. 数组 和 普通对象 在使用场景下有区别，在项目中使用数组的目的大多是为了 遍历，即比较少会使用 array[index] = xxx 的形式，更多的是使用数组的 Api 的方式;
2. 数组长度是多变的，不可能像普通对象一样先在 data 选项中提前声明好所有元素，比如通过 array[index] = xxx 方式赋值时，一旦 index 的值超过了现有的最大索引值，那么当前的添加的新元素也不会具有响应式;
3. 数组存储的元素比较多，不可能为每个数组元素都设置 getter/setter;
4. 无法拦截数组原生方法如 push、pop、shift、unshift 等的调用，最终仍需 重写/增强 原生方法。

typescript 类型推导及其内部 api
百度语音识别 node sdk 服务器，前端录音，后端识别。

vue上传插件，npm publish; vue install 库包 base-upload 视频、图片移动端 capture accept;   万年历 d.setDate(-3); fileUpload; imgCard; videoCover;

仿写 vue MVVM，类似 v-model 元素属性编译。

双图层叠加，v-show：如果先显示 BMap，那么之后切换显示 GIS 时会被遮挡一半，所以 mounted 必须先加载 GIS 并且 v-show 为 true 显示，再关掉永久开关，并加载显示 BMap。而且双图层叠加不能用 BMapGL，会导致百度地图 bg.png 灰图，所以要自定义覆盖物，
只能用 BMap 新建类的方法： CustomOverlay.prototype = new BMap.Overlay();
https://blog.csdn.net/qq_29176825/article/details/79120530
而不能用
https://lbs.baidu.com/jsdemo.htm#gl-overlay
// var label = new BMapGL.CustomOverlay(createDOM, {
// point: new BMapGL.Point(c.longitude, c.latitude),
// opacity: 0.5,
// offsetY: -40,
// offsetX: 50
// });

移动端 touch click 事件的比较

    1、touch click事件的执行顺序: touchstart > touchmove > touchend > click
    2、touchmove click事件互斥,即touchmove触发执行，click事件不再执行

    3、touch阶段取消掉 click 事件：touch事件内调用：e.preventDefault()

点透现象
点透发生的条件:

       A 和 B不是后代继承关系(如果是后代继承关系的话，就直接是冒泡之类的话题了)
       A发生touch(也可以是click)后立即消失,B事件绑定click

       A z-index大于B，即A显示在B浮层之上

    点透发生的原因:

       当手指触摸到屏幕的时候，系统生成两个事件，一个是touch 一个是click，touch先执行，touch执行完成后，A从文档树上面消失了，而且由于移动端click还有延迟200-300ms的关系，当系统要触发click的时候，发现在用户点击的位置上面，目前离用户最近的元素是B，所以就直接把click事件作用在B元素上面了

————————————————
原文链接：https://blog.csdn.net/tjcjava/article/details/80835252

```javascript
chrome.cookies.onChanged.addListener(function (event) {
  const cookie = event.cookie;
  refreshDomain(cookie.domain);
});
function refreshDomain(domain) {
  chrome.cookies.getAll({ domain: domain }, function (cookies) {});
}
```

chrome 中 Copy -> Copy as cURL，能用 curl 模拟登录，可以编写一个 chrome 插件，当 cookie 的变化触发了本地 node 服务器接口并存储 cookie。
然后本地在 shell 脚本中访问接口，并获取该域名的 IDSTGC，然后覆写 util.js 里对应的变量。

history 输错路由 返回根目录，是 ngnix 配置的.
hash 模式下路由改变后手动刷新页面不会报错（404），因为 hash 模式请求页面的地址永远是# 前面的内容，所以总是能请求成功，得到 index.html 页面，再通过路由渲染显示对应得组件

```javascript
router.beforeEach((to, from, next) => {
  if (to.matched.length === 0) {
    //匹配前往的路由不存在
    from.path
      ? next({
          path: from.path,
        })
      : next('/errorinfo'); //判断此跳转路由的来源路由是否存在，存在的情况跳转到来源路由，否则跳转到404页面
  } else {
    next(); //如果匹配到正确跳转
  }
});
[
  { path: '*', component: NotFound }, //全不匹配的情况下，匹配NotFound组件，路由按顺序从上到下，依次匹配。最后一个*能匹配全部，
  { path: '*', redirect: '/' }, //路由按顺序从上到下，依次匹配。最后一个*能匹配全部，然后重定向到主页面
];
```

el-table内若用了v-if ，就必须有key来防止串行。

代码结构必须解耦、健康，防止未知的更多的需求，比如新增需求“每个tab都要数量角标”，那么对每一个this.params需要call真正的this。


python Selenium 模拟302 重定向 location 登录

spark-echarts; ctx = canvas.getContext('2d');  
非零填充：看一块区域是否被填充，可以从这个区域拉一条线出去，看和这条直线相交的轨迹，如果遇到顺时针轨迹加1，如果遇到逆时针轨迹减1，将所以轨迹的值计算出来，如果是非零就填充，如果等于零不填充。