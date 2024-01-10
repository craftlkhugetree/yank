xss 前端防御，脚本，原生 api 改写，img.src 自定义上报，DOM 事件流，useCapture。 capture.html, compatible.html, httphijack。座位预约
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
答：因为动态引入一张图片的时候，src 后面的属性值，实际上是一个变量。webpack 会根据 v-bind 指令去解析 src 后面的属性值。并不会通过 require 引入资源路径。这也是为什么需要手动的添加 require。
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


<el-input-number>没有@change，因为它要等blur后校验完再决定实际的value，所以要想在el-form内通过 trigger: change 来校验它必须另辟蹊径：
:ref="item.prop + item.name"
@input.native="v => inputNumberNativeChange(v, item)"

    inputNumberNativeChange(ev, item) {
      let prop = item.prop;
      let ref = item.prop + item.name;
      let iptNumRef = this.$refs[ref];
      console.log(ev, iptNumRef, iptNumRef.displayValue, prop);
      // refs in v-for are Array
      this.form1[prop] = iptNumRef[0].displayValue;
      this.$refs.form1.validateField(prop);
    },


浏览器的有的时候数据转换会出错；一般情况下我们看 Network里面的Preview和Response的结果似乎一模一样。
在Preview(预览功能)中，控制台会把发送过来的json数据自动转换成javascript的对象格式；id是由雪花生成器产生，而超过16位的js Number类型会溢出。
因为数据为Long型，返回给浏览器以后，浏览器转换数据格式的时候出现问题。

initiator查看url调用链，iframe发起者为http则无所谓，若为https则调用链中不能有http。


通过 window.opener 获取到源页面的 window 对象， 这就埋下了安全隐患。 比如：
1. 你自己的网站 A，点击如上链接打开了第三方网站 B。
2. 此时网站 B 可以通过 window.opener 获取到 A 网站的 window 对象。
3. 然后通过 window.opener.location.href = ‘www.baidu.com’ 这种形式跳转到一个钓鱼网站，泄露用户信息。
为了避免这样的问题，可以添加引入了 rel=“noopener” 属性， 这样新打开的页面便获取不到来源页面的 window 对象了， 此时 window.opener 的值是 null。
————————————————
原文链接：https://blog.csdn.net/qq_43531694/article/details/134182789
来自具有rel=”noreferrer”属性的链接流量将显示为直接访问的流量而不是引荐。


先cd再执行命令是不行的，需要在执行命令时加入其目录参数cwd
exec('git status', {cwd: '/home/ubuntu/distro'}, /* ... */);
还是不行只能用 source调用sh脚本，脚本中执行node的puppeteer，node返回的ids数据存到缓存文件中，再由sh脚本msg=$(cat fileName)读取到变量$msg中，但要注意win下node里fs.writeFile保存的路径与sh脚本中cat读取的路径格式不同。


在POSIX系统（Linux，OSX等）中，subprocess不能修改父进程的环境。 这包括修改父进程的工作目录和环境variables。
当你在命令行上，你去执行你的Node脚本时，你当前的进程（ bash ， zsh ，whatever）产生一个新的进程，它有自己的环境，通常是你当前环境的一个副本（可以通过改变系统调用;但这超出了本答复的范围），允许该进程完成任何需要完全隔离的操作。 当subprocess退出时，控制权交还给你的shell进程，环境没有受到影响。

执行脚本时候，系统只是在当前的shell下创建了一个子进程，切换目录的操作只对该子进程中相关后续指令有效，不能改变shell父进程的工作目录，因此shell父进程的当前工作目录在workdir.sh脚本子进程退出时并没有变化。

要解决这个问题，我们需要改变执行脚本的命令行输入方式

一、. ./workdir.sh
以上命令的以两点 开头，两点之间要有空格，意思如下：

第一个点是bash的内部命令，表示在当前shell进程中运行

后面的“./workdir.sh”是命令的参数，即要在当前shell进程中运行执行的脚本，由于当前环境是shell进程自己，因此改变目录成功。

二、source workdir.sh
        其实source命令也称为“点命令”，也就是一个点符号（.），是bash的内部命令。
        注意：该命令通常用命令“.”来替代


三、“source scriptfile”与“sh scriptfile”、“./scriptfile” 区别
这三个命令都可以用于执行一个脚本文件，那么它们之间的区别如下：

shell的执行方式区别
命令方式	意义说明
./scriptfile	是因为当前目录没有在PATH中，所以"."是用来表示当前目录的。
会重新建立一个子shell进程，在子shell中执行脚本里面的语句，该子shell继承父shell的环境变量，但子shell是新建的，其改变的变量不会被带回父shell，除非使用export；
子shell改变的工作目录页不会影响当前shell进程
sh scriptfile	会重新建立一个子shell进程，在子shell中执行脚本里面的语句，该子shell继承父shell的环境变量，但子shell是新建的，其改变的变量不会被带回父shell，除非使用export；
子shell改变的工作目录页不会影响当前shell进程
source scriptfile	
读取脚本里面的语句依次在当前shell里面执行，没有建立新的子shell。那么脚本里面所有新建、改变变量的语句都会保存在当前shell里面。目录改变也是在当前shell进程里进行的。
该命令等同于(点命令)：

. ./scriptfile
————————————————
原文链接：https://blog.csdn.net/ababab12345/article/details/134325058


stage1. 使用token来鉴权，打开F12开发者工具拿到IDSTGC，在application里复制cookie并复制到项目的全局文件的全局变量；
stage2. 编写shell脚本提示输入token，并用sed正则修改多个项目（pc、移动）的全局文件中的全局变量；
stage3. puppeteer模拟登录，提示输入验证码; 对于滑块await page.mouse.move()直接滑到底; 复杂的拼图则使用rembrandt.js 库，移动鼠标，并在找到了结果图像与初始图像差异最轻微的拼图位置时松开鼠标。
stage4. 机器识别、ocr识别图像文字


post请求常见的数据格式（content-type）:
Content-Type: application/json ： 请求体中的数据会以json字符串的形式发送到后端
Content-Type: application/x-www-form-urlencoded：请求体中的数据会以普通表单形式（键值对）发送到后端
Content-Type: multipart/form-data： 它会将请求体的数据处理为一条消息，以标签为单元，用分隔符分开。既可以上传键值对，也可以上传文件。

# vue3 vue2
2023年底vue2停止维护。

Vue2的组件系统设计中，所有Vue实例是共享一个Vue构造函数对象的，包括全局指令/全局组件，无法做到相互隔离。
也就是说我们整个项目中，只有一个根Vue实例，其他的单文件组件创建的 Vue实例都会成为它的子实例。
而Vue3通过createApp方法可以返回一个提供应用上下文的应用实例。不同实例注册的组件无法在不同的实例下使用。

Vue3之所以能够支持组件模板具有多个根元素，是因为Vue 3在编译器层面上进行了一些改进和优化。 在Vue 3中，引入了基于标记片段（Fragment）的编译机制。 标记片段是一种特殊的数据结构，可以容纳多个子节点，并没有实际的DOM元素。 这使得Vue 3的编译器能够更好地处理具有多个根元素的组件模板。 在处理具有多个根元素的组件模板时，Vue 3的编译器会将模板中的每个根级标签（包括自定义组件）都编译为一个单独的标记片段。 然后，这些标记片段将作为一个数组，一起创建实际的渲染函数。 这样，每个根级标签都能够保留自己的作用域和响应式数据，并且它们可以并行地进行更新。

# setup是Vue3 的一大特性函数, 它有几个特性:
1、setup函数是处于 生命周期函数 beforeCreate 和 Created 两个钩子函数之间的函数
2、setup函数是 Composition API（组合API）的入口
3、在setup函数中定义的变量和方法最后都是需要 return 出去的 不然无法再模板中使用
setup函数的注意点：
vue3虽然支持vue2.x版本的写法,但也有一些要注意的地方
1、由于在执行 setup函数的时候，还没有执行 Created 生命周期方法，所以在 setup 函数中，无法使用 data 和 methods 的变量和方法
2、由于我们不能在 setup函数中使用 data 和 methods，所以 Vue 为了避免我们错误的使用，直接将 setup函数中的this修改成了 undefined
3、setup函数只能是同步的不能是异步的

上面的组件中用defineComponent包裹了组件;
defineComponent函数，只是对setup函数进行封装，返回options的对象；
defineComponent最重要的是：在TypeScript下，给予了组件 正确的参数类型推断 。
链接：https://juejin.cn/post/7198426159478456381


我们在vue2中使用options api时，可以使用this,但是当我们使用vue3中的composition api时，我们在setup中却无法使用this。
原因是：我们在options api中对其中的一些属性进行绑定，但是在composition api中的setup函数的执行并没有绑定实例对象。
————————————————
原文链接：https://blog.csdn.net/m0_68702564/article/details/126144710