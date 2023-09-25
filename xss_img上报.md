function xssCheck(str,reg){
        return str ? str.replace(reg || /[&<">'](?:(amp|lt|quot|gt|#39|nbsp|#\d+);)?/g, function (a, b) {
            if(b){
                return a;
            }else{
                return {
                    '<':'&lt;',
                    '&':'&amp;',
                    '"':'&quot;',
                    '>':'&gt;',
                    "'":''',
                }[a]
            }
        }) : '';
    }
replace()的第二个参数如果是function，则替换为function的返回值

function(match,p1,p2,offset,str)

match   匹配的子串。（对应于上述的$&。）
p1,p2, ...  假如replace()方法的第一个参数是一个RegExp 对象，则代表第n个括号匹配的字符串。（对应于$1，$2等。）
offset  匹配到的子字符串在原字符串中的偏移量。（比如，如果原字符串是“abcd”，匹配到的子字符串是“bc”，那么这个参数将是1）
string  被匹配的原字符串。

var str = "abcd-abcd-1234";
var result = str.replace(/([a-z]*)-([a-z]*)/gi, function(match, p1, p2, offset, str) {
    console.log(match);
    //abcd-abcd  匹配的内容    
    console.log(p1);
    //第一个括号中匹配的内容    
    console.log(p2);
    //第二个括号匹配的内容
    console.log(offset);
    //0 匹配到的字符串的索引(偏移量)   
    console.log(str);
    //原始字符串  
    return [p1, p2].join("+");
});
// 输出 abcd+abcd+1234// 原字符串中 abcd-abcd 被匹配后 被替换为function返回的内容
console.log(result);


# XSS（Cross Site Scripting）
httphijack-Github      https://wenku.baidu.com/view/b2d2dace9889680203d8ce2f0066f5335a816725.html
内联事件 <img src="{路径" onload="alert(/xss/)}" />
通过输入框或者留言板内的输入，攻击者提前关闭src属性。
静态模块：使用 MutationObserver 扫描。
动态模块：通过 API 钩子来拦截路径属性(createElement, 给src赋值的api)。
<body>
    <input type="text" id="text">
    <input type="button" id="s" value="按钮" onclick="test()">
    <div id='div'></div>
    <a href="ggg" onclick="alert(/xss/)" \\'>示范2</a>
    <script>
        function test(){
            var str = document.getElementById('text').value;    
            document.getElementById("div").innerHTML = "<a href='"+str+"' >testLink</a>";
        }
    </script>
</body>
首先用一个单引号闭合掉href的第一个单引号，然后插入一个onclick事件，最后再用注释符”//"注释掉第二个单引号。
' οnclick=alert(/xss/) //
或者
' οnclick=alert(/xss/)  \\
或者
' οnclick=alert(/xss/)  /\


*** 被动扫描： ***
最简单的办法，就是把页面里所有元素都扫描一遍，检测那些 on 开头的内联属性，看看是不是存在异常：
例如字符数非常多，正常情况下这是很少出现的，但 XSS 为了躲避转义有时会编码的很长；例如出现一些 XSS 经常使用的关键字，但在实际产品里几乎不会用到的。这些都可以作为漏洞出现的征兆，通知给开发人员。
不过，土办法终究存在很大的局限性。在如今清一色的 AJAX 时代，页面元素从来都不是固定的。伴随着用户各种交互，新内容随时都可能动态添加进来。即使换成定期扫描一次，XSS 也可能在定时器的间隔中触发，并销毁自己，那样永远都无法跟踪到了。况且，频繁的扫描对性能影响也是巨大的。

如同早期的安全软件一样，每隔几秒扫描一次注册表启动项，不仅费性能，而且对恶意软件几乎不起作用；但之后的主动防御系统就不同了，只有在真正调用 API 时才进行分析，不通过则直接拦截，完全避免了定时器的间隔遗漏。

因此，我们需要这种类似的延时策略 —— 仅在 XSS 即将触发时对其分析，对不符合策略的元素，进行拦截或者放行，同时发送报警到后台日志。

*** 主动防御： ***
这仅仅是执行优先级的事而已 —— 只要防御程序能运行在其他程序之前，我们就有了可进可退的主动权。对于无比强大的 HTML5 和灵活多变的 JavaScript，这些概念都可以被玩转出来。

继续回到刚才讨论的内联事件 XSS 上来。浏览器虽然没提供可操控内联事件的接口，但内联事件的本质仍是一个事件，无论怎样变化都离不开 DOM 事件模型。

attachEvent方法两个参数：第一个参数为事件名称，第二个参数为接收事件处理的函数；
addEventListener 有三个参数：
第一个参数表示事件名称（不含 on，如 "click"）；
第二个参数表示要接收事件处理的函数；
第三个参数叫useCapture，是一个boolean值，如果true的话就是瀏览器会使用Capture方式，false的话是Bubbling，只有在特定状况下才会有影响，通常建议是false，而会有影响的情形是目标元素(target element)有祖先元素(ancestor element)，而且也有同样的事件对应函数。
范例有两层div元素，而且都设定有click事件，一般来说，如果在内层蓝色的元素上click不只会触发蓝色元素的click事件，还会同时触发红色元素的click事件，而useCapture这个参数就是在控制这时候两个click事件的先后顺序。如果是false，那就会使用bubbling，他是从内而外的流程，所以会先执行蓝色元素的click事件再执行红色元素的click事件，如果是true，那就是capture，和bubbling相反是由外而内，会先执行红色元素的click事件才执行蓝色元素的click事件。
那如果不同层的元素使用的useCapture不同呢？就是会先从最外层元素往目标元素寻找设定为capture的事件，到达目标元素执行目标元素的事件后，再寻原路往外寻找设定为bubbling的事件。

<button onclick="console.log('xss')">CLICK ME</button>
<script>
	document.addEventListener('click', function(e) {
		console.log('bubble');
	});

	document.addEventListener('click', function(e) {
		var element = e.target;
		var code = element.getAttribute('onclick');

		if (/xss/.test(code)) {
      // 因为第三个参数是true，所以先capture，给document绑定的事件，在captrue阶段结束传播，自然取消了其子元素的bubbling。捕获程序运行在内联事件触发之前，并且完全有能力拦截之后的调用。
			e.stopImmediatePropagation();  
			alert('拦截可疑事件: ' + code);
		}
	}, true);
</script>
我们先在捕获阶段扫描内联事件字符，若是出现了『xss』这个关键字，后续的事件就被拦截了；换成其他字符，仍然继续执行。同理，我们还可以判断字符长度是否过多，以及更详细的黑白名单正则。
不过，上面的片段还有个小问题，就是把事件的冒泡过程也给屏蔽了，而我们仅仅想拦截内联事件而已。解决办法也很简单，把 e.stopImmediatePropagation() 换成 element.onclick = null 就可以了。

# DOM事件流，捕获、冒泡、useCapture、passive、事件委托 ————————  .\demo\compatible.html    .\demo\capture.html
通过addEventListener绑定事件，默认是在冒泡阶段触发事件，如果useCapture设置为true，则事件是在捕获阶段触发。一个事件只会触发一次，要么冒泡阶段，要么捕获阶段。

可以通过event.stopPropagation()阻止事件流，如果是在捕获阶段阻止了事件流，那也就没有冒泡阶段了。
event.stopImmediatePropagation()不仅阻止了事件流，连自身元素的其他相同类型的未执行事件也阻止了。
子元素的preventDefault()会被父元素捕获阶段的stop给屏蔽掉。

passive介绍
浏览器内核渲染页面时有2个线程，一个主线程，负责js执行，另一个绘制线程，负责绘制画面。当事件触发时，主线程负责执行事件回调函数，完事后告诉绘制线程可以绘制画面了，但是如果主线程一直很忙，事件回调函数就迟迟不能执行，绘制画面也就卡住了，用户就感知到了卡顿。

为什么绘制线程要等待主线程 ？

事件回调函数中可能存在event.preventDefault()语句，这个语句的执行是会影响绘制线程的执行的，所以要等待回调执行结束，才能知道回调函数中是不是有event.preventDefault()

passive如果设置为true，则绘制线程不用等待主线程了，它们可以并行执行，回调函数中的event.preventDefault()不再起作用，如果有，执行到这句时，浏览器会给出警告

parent.addEventListener("click", function (e) {
* // e.stopPropagation(); 不再派发事件。终止事件在传播过程的捕获、目标处理或起泡阶段进一步传播。调用该方法后，该节点上处理该事件的处理程序将被调用，事件不再被分派到其他节点。

* // e.target.nodeName 指当前点击的元素, e.currentTarget.nodeName绑定监听事件的元素
        console.log("parent 捕获", e.target.nodeName, e.currentTarget.nodeName);
    }, true);
e.preventDefault()可以阻止事件的默认行为发生，默认行为是指：点击a标签就转跳到其他页面、拖拽一个图片到浏览器会自动打开、点击表单的提交按钮会提交表单等等，因为有的时候我们并不希望发生这些事情，所以需要阻止默认行为

事件委托优点：
1、减少事件注册，节省内存。比如，
2、在table上代理所有td的click事件。
3、在ul上代理所有li的click事件。
4、简化了dom节点更新时，相应事件的更新。比如
5、不用在新添加的li上绑定click事件。
6、当删除某个li时，不用移解绑上面的click事件。

事件委托缺点：
1、事件委托基于冒泡，对于不冒泡的事件不支持
2、层级过多，冒泡过程中，可能会被某层阻止掉。
3、理论上委托会导致浏览器频繁调用处理函数，虽然很可能不需要处理。所以建议就近委托，比如在table上代理td，而不是在document上代理td。
4、把所有事件都用代理就可能会出现事件误判。比如，在document中代理了所有button的click事件，另外的人在引用改js时，可能不知道，造成单击button触发了两个click事件。

# mutationObserver监听节点变化并回调
  mounted() {
    let _this = this;
    let frame = document.getElementsByClassName("ke-edit-iframe");
    if (frame && frame.length) {
      let w = frame[0].contentWindow; // 获取iframe内部body
      let b = w.document.body;
      let MutationObserver =
        window.MutationObserver ||
        window.webkitMutationObserver ||
        window.MozMutationObserver;
      _this.mutationObserver = new MutationObserver(function (mutations) {
        let tmp = _this.transHtml(); // 给editForm.dhtml赋值
        _this.$refs.editForm.validate((valid) => {});
      });
      _this.mutationObserver.observe(b, {
        childList: true, // 子节点的变动（新增、删除或者更改）
        attributes: true, // 属性的变动
        characterData: true, // 节点内容或节点文本的变动
        subtree: true, // 是否将观察器应用于该节点的所有后代节点
        attributeFilter: ["class", "style"], // 观察特定属性
        attributeOldValue: true, // 观察 attributes 变动时，是否需要记录变动前的属性值
        characterDataOldValue: true, // 观察 characterData 变动，是否需要记录变动前的值
      });
    }
  },
  beforeDestroy() {
    this.mutationObserver.disconnect(); // 此处以后的不再监听
  },


  # 跨域
所用的协议，端口都要相同，且一级域名一致才可以用document.domain来指定域。
if(document.domain !== 'xxx.com'){
  document.domain = 'xxx.com';
}

# img上报
* 利用大部分浏览器会在页面卸载前实现图片的加载的个性，通过在页面增加img的形式上报数据。
在某次JS动态拉某服务器资源的时候，服务器做了统计，同时也用JS做了上报，但是统计的结果是，JS统计的总比服务端统计的少30%，天天如此，这个数据差值总是30%。当时查了几天都没有结果，后来猜测可能是这里的临时变量问题导致，把这个变量移植到window对象下作为全局变量，问题解决。

var img;
function report(){
    img=new Image();
    img.src="http://www.example.com/getRepor.php";
}
究竟是什么原因导致这个问题呢？
分析是这样的，在函数report ()里，局部变量img设置属性src以后，浏览器并不是立即就发起请求，或者请求准备发起但是还没有真正发起（回忆下网络请求的几个状态值），而函数report执行完毕，浏览器开始做垃圾回收工作，包括局部变量，上报请求还没有开始img就被回收了，那么这次的上报就被取消了，上报失败。而把img放到window对象下作为全局变量，则避免了这个问题，所以即使report()函数的所有资源被回收，也不会影响到其上报


# Token

Token 其实就是访问资源的凭证。
一般是用户通过用户名和密码登录成功之后，服务器将登陆凭证做数字签名，加密之后得到的字符作为 token。

它在用户登录成功之后会返回给客户端，客户端主要有这么几种存储方式：

1．存储在 localStorage 中，每次调用接口的时候都把它当成一个字段传给后台

2．存储在 cookie 中，让它自动发送，不过缺点就是不能跨域

3．拿到之后存储在 localStorage 中，每次调用接口的时候放在 HTTP 请求头的 Authorization 字段里

所以 token 在客户端一般存放于 localStorage、cookie 或 sessionStorage 中。

将 token 存放在 webstorage 中，可以通过同域的 js 来访问。这样会导致很容易受到 XSS 攻击，特别是项目中引入很多 第三方 js 类库的情况下。如果 js 脚本被盗用，攻击者就 可以轻易访问你的网站，webStroage 作为一种储存机制，在传输过程中不会执行任何安全标准。

XSS 攻击：cross-site Scripting (跨站脚本攻击） 是一种注入代码攻击。恶意攻击者在目标网站生注入 script 代码，当访问者浏览网站的时候通过执行注入的 script 代码达到窃取用户信息，盗用用户身份等。
网站中包含大量的动态内容以提高用户体验，比过去要复杂得多。所谓动态内容，就是根据用户环境和需要，Web 应用程序能够输出相应的内容。动态站点会受到一种名为“跨站脚本攻击”（Cross Site Scripting, 安全专家们通常将其缩写成 XSS,原本应当是 css，但为了和层叠样式表（Cascading Style Sheet,CSS ）有所区分，故称 XSS）的威胁，而静态站点则完全不受其影响。

将 token 存放在 cookie 中可以指定 httponly，来防止被 javascript 读取，也可以指定 secure ，来保证 token 只在 HTTPS 下传输。缺点是不符合 Restful 最佳实践，容易受到 CSRF 攻击。
CSRF 跨站点请求伪造(Cross-Site Request Forgery)，跟 XSS 攻击一样，存在巨大的危害性。简单来说就是恶意攻击者盗用已经认证过的用户信息，以用户信息名义进行一些操作（如发邮件、转账、购买商品等等）。由于身份已经认证过，所以目标网站会认为操作都是真正的用户操作的。CSRF 并不能拿到用户信息，它只是盗用的用户凭证去进行操作。
————————————————
