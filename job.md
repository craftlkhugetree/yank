xss前端防御，脚本，原生api改写，img.src自定义上报，DOM事件流，useCapture。  capture.html, compatible.html, httphijack。 
v-html富文本 xss.js白名单。
前端异常及降级处理，https://www.jianshu.com/p/53ae5aee0859
this绑定规则，https://xiaohuochai.site/JS/ECMA/this/binding.html

大屏：字体、尺寸、背景图片缩放，没有webpack打包，IOS夏令时兼容

民国库：高亮搜索，繁体字多种，正则(非贪婪?， ?:非捕获分组， 反向引用\1$1，?=正向预查 ?<=反向预查)

netRepair-njit:  webpack plugin过滤‘ac5d ’

生产环境，上千条数据要删除，没有批量按钮，直接数据库删除？ 前端模拟点击，如何确保完成并对异步并发的错误结果进行处理？浏览器都会限制单个域下边的并发连接数，当然对于总的并发连接数也有限制。

nginx -s reload  createFile error    gitbash cmd taskkill awk
nginx -s stop

中文传递到后台是乱码，要在tomcat的配置文件的Connector标签,在末尾添URIEncoding=“UTF-8”，前端post时可指明，get则只能反向回去查iso再解码。

chrome插件api， popup inject manifest.json

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

149. 对于小于8k的图片，会将图片转成base64 直接插入图片，不会再在dist目录生成新图片。对于大于8k的图片，会打包进dist目录，之后将新图片地址返回给src。
vue的图片一定会被编译，而动态添加的src编译过后的地址，与图片文件编译过后的地址不一致，导致无法正确的引入资源，所以叫‘动态添加的src会被当做静态资源’。
静态资源：一般客户端发送请求到web服务器，web服务器从内存在取到相应的文件，返回给客户端，客户端解析并渲染显示出来。
动态资源：一般客户端请求的动态资源，先将请求交于web容器，web容器连接数据库，数据库处理数据之后，将内容交给web服务器，web服务器返回给客户端解析渲染处理。

静态资源就是直接存放在项目中的资源，这些资源不需要我们发送专门的请求进行获取。比如assets目录下面的图片，视频，音频，字体文件，css样式表等。
动态资源就是需要发送请求获取到的资源。比如我们刷淘宝的时候，不同的商品信息是发送的专门的请求获取到的，就可以称之为动态资源。

module.exports = {
    // 使用configureWebpack对象，下面可以直接按照webpack中的写法进行编写
    // 编写的内容，最终会被webpack-merge插件合并到webpack.config.js主配置文件中
  configureWebpack: { 
    module: {
      rules: [
        {
          test: /\.(png|jpe?g|gif|webp|avif)(\?.*)?$/,
          type: 'asset',
          parser: {
            dataUrlCondition: {
             // 这里我将默认的大小限制改成6k。
              // 当图片小于6k时候，使用base64引入图片；大于6k时，打包到dist目录下再进行引入
              maxSize: 1024 * 6
            }
          }
        }
      ]
    }
  }
}
当我们使用require方法引入一张图片的时候，webpack会将这张图片当成一个模块，并根据配置文件中的规则进行打包。我们可以将require当成一个桥梁，使用了require方法引入的资源，该资源就会当成模块并根据配置文件进行打包，并返回最终的打包结果。
那么调用require方法引入一张图片之后发生了什么：
1.如果这张图片小于项目中设置的资源限制大小，则会返回图片的base64插入到require方法的调用处
2.如果这张图片大于项目中设置的资源限制大小，则会将这个图片编译成一个新的图片资源。require方法返回新的图片资源路径及文件名

当你在 JavaScript、CSS 或 *.vue 文件中使用相对路径 (必须以 . 开头) 引用一个静态资源时，该资源将会被包含进入 webpack 的依赖图中。在其编译过程中，所有诸如 <img src="...">、background: url(...) 和 CSS @import 的资源 URL 都会被解析为一个模块依赖。
例如，url(./image.png) 会被翻译为 require('./image.png')，而：
<img src="./image.png">
将会被编译到：
h('img', { attrs: { src: require('./image.png') }})

那么动态添加src的时候也会使用require引入，为什么src编译过后的地址，与图片资源编译过后的资源地址不一致？
答：因为动态引入一张图片的时候，src后面的属性值，实际上是一个变量。webpack会根据v-bind指令去解析src后面的属性值。并不会通过reuqire引入资源路径。这也是为什么需要手动的添加require。
任何放置在 public 文件夹的静态资源都会被简单的复制，而不经过 webpack。需要通过绝对路径来引用它们。所以使用require引入资源的前提的该资源是webpack解析的模块，而public下的文件压根就不会走编译，也就不会使用到require。

# vue2中的Object.defineProperty() 实际是通过 定义 或 修改 对象属性 的描述符来实现 数据劫持，其对应的缺点也是没法被忽略的：
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

# Object.defineProperty 可用于实现对象属性的 get 和 set 拦截，而数组其实也是对象，那自然是可以实现对应的拦截操作，那Vue2 为什么不使用 Object.defineProperty 拦截 Array？性能问题到底指的是什么呢？下面是总结：
1. 数组 和 普通对象 在使用场景下有区别，在项目中使用数组的目的大多是为了 遍历，即比较少会使用 array[index] = xxx 的形式，更多的是使用数组的 Api 的方式;
2. 数组长度是多变的，不可能像普通对象一样先在 data 选项中提前声明好所有元素，比如通过 array[index] = xxx 方式赋值时，一旦 index 的值超过了现有的最大索引值，那么当前的添加的新元素也不会具有响应式;
3. 数组存储的元素比较多，不可能为每个数组元素都设置 getter/setter;
4. 无法拦截数组原生方法如 push、pop、shift、unshift 等的调用，最终仍需 重写/增强 原生方法。

typescript 类型推导及其内部api
百度语音识别node sdk服务器，前端录音，后端识别。