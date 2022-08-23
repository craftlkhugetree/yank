# // 数组去重的三种办法
let arr4 = [1, 3, 2, 5, 3, 1, 2, 7, 8];
let newArr = arr4.reduce((pre,cur)=>{
    if (!pre.includes(cur)) {
        return pre.concat(cur)
    } else {
        return pre
    }
}, []);
console.log(newArr, '数组去重')
// [1, 3, 2, 5, 7, 8] 

const tmp = new Set(arr4);
console.log(Array.from(tmp), tmp.length)

const filtArr = arr4.filter((cur,index,arr)=>{
    return arr.indexOf(cur) === index
})
console.log(filtArr)



# // 将二维数组转换成一维数组
let arr5 = [[1, 2], [3, 4], [5, 7]];
let newArr2 = arr5.reduce((pre,cur)=>{
    return pre.concat(cur)
}, []);
console.log(newArr2, '二维转成一维')
// [1, 2, 3, 4, 5, 7]

const tmp = arr5.flat(1)
console.log(tmp)
// flat() 函数将删除原始数组中存在的所有空值。默认深度为1。

# // 将多维数组转换成一维数组
    let arr6 = [1,3,[4,5,6,[7,8,4]],[7,0,[2,4],9]];
    let newArr3 = this.flatArr(arr6);
    console.log(newArr3, '多维转一维') // [1, 3, 4, 5, 6, 7, 8, 4, 7, 0, 2, 4, 9]
   
   flatArr(arr){
      return arr.reduce((pre,cur)=>{
        return pre.concat(Array.isArray(cur)?this.flatArr(cur):cur)
      },[])
   }

# //4、操作对象数组中的对象属性
const data = [
      {
        id:1,
        name:'安徽'
      },
      {
        id:2,
        name:'南京'
      },
      {
        id:3,
        name:'上海'
      },
      {
        id:4,
        name:'杭州'
      },
      {
        id:5,
        name:'天津'
      },
      {
        id:6,
        name:'北京'
      },
      {
        id:7,
        name:'山东'
      },
      {
        id:8,
        name:'河南'
      },
      {
        id:9,
        name:'重庆'
      },
      {
        id:10,
        name:'成都'
      },
      {
        id:11,
        name:'合肥'
      },
    ]
    const city_list = data.reduce((prev, item, idx) => {
      let key =
      idx > 8
        ? `${idx + 1}00`
        : `0${idx + 1}00`;
      prev[key] = item.name;
      return prev;
    }, {});
    console.log(city_list, '转换后的城市列表')

  # // 计算数组中每个元素出现的次数
    let arr7 =['红','黄','黑','黄','蓝','红']
    let num = arr7.reduce((pre,cur)=>{
      if(cur in pre){
        pre[cur]++
      }else {
        pre[cur] = 1
      }
      return pre
    },{})
    console.log(num,'num对象') //{红: 2, 黄: 2, 黑: 1, 蓝: 1} 


  # // 在数组中查找最大值和最小值
const arr = [1, 2, 3]; 
Math.max(…arr); // 3

// 函数:函数的name属性;
# rest参数是真正意义上的数组，可以使用数组的任何方法
// ES5
function fn() {
  console.log(arguments)  //[Arguments] { '0': 1, '1': 2, '2': 3, '3': 4 }
}
fn(1,2,3,4)

// ES6
function fn(...rest) {
  console.log(rest) //[ 1, 2, 3, 4, 5 ]
}
fn(1,2,3,4,5)

# rest参数只能作为最后一个参数，在它之后不能存在任何其他的参数，否则会报错。函数的length属性，不包含rest。
function fn(a, b, ...rest) {  
}
console.log(fn.length)  //2

<!-- arguments.callee代表函数名，多用于递归调用，防止函数执行与函数名紧紧耦合的现象，对于没有函数名的匿名函数也非常起作用。 -->

<!-- fn.apply(null, finalArgs);    apply方法的第一个参数，是要替代的对象。没有要替代的，用null。 -->

<!-- 队列操作
head： 取出队列的第一个非空成员。
last： 取出有限队列的最后一个非空成员。
tail： 取出除了“队列头”以外的其他非空成员。
init： 取出除了“队列尾”以外的其他非空成员。 -->
const xs = [1,2,3,4]
let f = {};
f.head = (...xs) => xs[0];
f.last = (...xs) => xs.slice(-1);
f.tail = (...xs) => Array.prototype.slice.call(xs, 1);
f.init = (...xs) => xs.slice(0, -1);


<!-- 合并操作 -->
let f = {};
f.concat =
  (...xs) => xs.reduce((a, b) => a.concat(b));
f.concatMap =
  (fun, ...xs) => f.concat(xs.map(fun));

f.concat([5], [27], [3]) // [5, 27, 3]
f.concatMap(x => 'hi ' + x, 1, [[2]], 3) // ['hi 1', 'hi 2', 'hi 3']
<!-- 前者就是将多个数组合成一个，后者则是先处理一下参数，然后再将处理结果合成一个数组。 -->

// best
function getFullName({ firstName, lastName }) {
}
// 使用 Array.from 方法，将类似数组的对象转为数组。

<!-- 所有配置项(常量)都应该集中在一个对象，放在最后一个参数，布尔值不可以直接作为参数。 -->
function divide(a, b, { option = false, num = 9 } = {}) {
}

let { option = false, num = 9 } = {}
let { x:zzz, kkk } = {x:1, y:2}
console.log(option, zzz, kkk, num); // false 1 undefined 9

<!-- 柯里化函数逻辑的复用 -->
// 譬如在程序中，我们需要把5和另外一个数字相加
// 常规操作
function sum(m, n) {
 return m + n
}
console.log(sum(5,10))
 
// 转成柯里化
function makeAdder(count) {
  return function(num) {
   return count + num
 }
}
 
var result = makeAdder(5)(10)
console.log(result) // 输出 15
 
<!-- 又或者封装成这种方式，直接使用中间件adderNum()，柯里化代码，复用了部分函数 -->
var adderNum = makeAdder(5)
adderNum(10) // 输出 15
adderNum(3) // 输出 8

<!-- 带含义的正则柯里化 -->
//平常写法，正则校验
function check(reg, txt) {
    return reg.test(txt);
}
check(/\d+/g, '123')       //true+
check(/[a-z]+/g, 'test')    //true
 
//柯里化后的写法
 
// curry 后
function curringCheck(reg) {
    return function(txt) {
        return reg.test(txt)
    }
}
 
// 中间函数， 预先设定规则
var hasNumber = curryingCheck(/\d+/g)
var hasLetter = curryingCheck(/[a-z]+/g)
 
hasNumber('123')      // true
hasLetter('test')      // true

<!-- 柯里化函数的实现hyCurrying  -->
function add1(x, y, z) {
  return x + y + z
}
function hyCurrying(fn) {
// 传入一个函数，返回一个新的函数
 function curried(...args) {
  // 判断当前已经接收的参数个数，与参数本身需要接收的参数是否已经一致
  // 当已经传入的参数 大于等于 需要的参数时，就执行函数 
  if (args.length >= fn.length) {
   // fn.call(this, ...args) 用call也可以
   return fn.apply(this, args)
  } else {
    // 没有达到个数时，需要返回一个新的函数curried2，继续接收来的参数
    return function (...args2) {
    // 接收到参数时，需要递归调用curried来检查函数参数的个数是否达到
      return curried.apply(this, [...args, ...args2])
    }
  }
 }
  return curried
}
 
var curryAdd = hyCurrying(add1) // add1作为fn只是在这里站一下
console.log(curryAdd(10,20,30)) // 输出60
console.log(curryAdd(10,20)(30)) // 输出60
console.log(curryAdd(10)(20)(30)) // 输出60， curryAdd(10): curried(10): curried2(20): curried(10, 20): curried2(30): curried(10,20,30) : add1(10,20,30)

// 多参数传递（同上）
function currying(fn, args) {
    var _this = this;
    var len = fn.length;
    var args = args || [];
 
    return function() {
        var _args = Array.prototype.slice.call(arguments);
        Array.prototype.push.apply(args, _args);
 
        // 如果参数个数小于最初的fn.length，则递归调用，继续收集参数
        if (_args.length < len) {
            return currying.call(_this, fn, _args);
        }
        return fn.apply(this, _args);
    }
}

//单个参数封装
var curryingSingle = function(fn) {
    args = Array.prototype.slice.call(arguments, 1);
    return function() {
        var newArgs = args.concat(Array.prototype.slice.call(arguments));
        return fn.apply(this, newArgs);
    }
}
————————————————

<!-- 组合函数不是一种函数类型，只是创建一个新函数将多种功能的函数合并起来 -->
<!-- 需要对某一个数据执行两个函数fn1和fn2，这两个函数是依次执行的；那么如果每次我们都需要进行两个函数的调用，操作上就会显得重复； -->
function mul(m) {
  return m * 2
}

function square(n) {
  return n * n
}

// 组合函数
function compose(m, n) {
  return function (i) {
    return m(n(i))
  }
}
var fn = compose(mul, square)
console.log(fn(5))

function compose(...fns){
    //遍历所有的原生如果不是函数，那么直接报错
    var length = fns.length;
    for(var i = 0 ;i < length; i++){
        var fn = fns[i];
        if(typeof fn !== 'function'){
            throw new TypeError('Expected a function');
        }
    }

    //取出所有的函数一次调用，最终返回一个函数
    return function(...args){
        //先获取到第一次执行的结果
        var index = 0;
        var result = length ? fns[index].apply(this,args): args;
        while(++index<length){
            result = fns[index].call(this,result);
        }
        return result;
    }
}


# Promise
setTimeout(function () {
  console.log('macro');
}, 0);

Promise.resolve().then(function () {
  console.log('micro');
});

let p = new Promise((resolve, reject) => {
  console.log('inside promise')
  resolve('then')
}).then(res => {
  console.log(res)
})

console.log(p, 'normal');
<!-- 立即resolve()的 Promise 对象，是在本轮“事件循环”（event loop）的结束时执行，而不是在下一轮“事件循环”的开始时。 -->
// inside promise
// Promise {<pending>} 'normal'
// micro
// then
// undefined
// macro


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


  function readFile(url) {
    var param;
    $.ajax({
      url: url, // 文件位置
      type: 'GET', // 请求方式为get
      async: false,
      dataType: 'xml', // 返回数据格式为xml
      success: function (data) {
        param = data;
        genXmlDocMap(data);
      },
    });
    return param;
  }
});
  axios({
        url,
        responseType: "blob",
        data: {},
        method: "GET",
      })
        .then(res => {
          let url = window.URL.createObjectURL(res.data);
          let link = document.createElement("a");
          link.href = url;
          link.style.display = "none";
          link.setAttribute("download", fileName + "." + "docx");
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          window.URL.revokeObjectURL(url);
        })