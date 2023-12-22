# 划线改驼峰

function turnName(str){
return str.replace(/-[a-zA-Z]/g,match=>match.replace('-','').toUpperCase())
}

# 深度拷贝

1、用 new obj.constructor()构造函数新建一个空的对象，而不是使用{}或者[],这样可以保持原形链的继承；
2、用 obj.hasOwnProperty(key)来判断属性是否来自原型链上，因为 for..in..也会遍历其原型链上的可枚举属性。
**_ 可枚举属性是指那些内部 “可枚举 enumerable” 标志设置为 true 的属性，对于通过直接的赋值和属性初始化的属性，该标识值默认为即为 true，对于通过 Object.defineProperty 等定义的属性，该标识值默认为 false。 _**
Object.keys() JSON.stringify Object.assign() 三者只是对象自身的所有可枚举的属性
Object.getOwnPropertyNames()则是遍历自身所有属性（不论是否是可枚举的）,也是不包括原型链上面的。
3、用到递归算法，在函数名字不会变的情况下，这样定义没有问题。但问题是与函数名紧紧耦合在了一起。为了消除这种紧密耦合的现象，需要使用 arguments.callee。
————————————————
原文链接：https://blog.csdn.net/u013362969/article/details/86489246

```javascript
var deepClone = function (obj) {
  if (obj === null) return null;
  if (typeof obj !== 'object') return obj;
  if (obj.constructor === Date) return new Date(obj);
  if (obj.constructor === RegExp) return new RegExp(obj);
  var newObj = new obj.constructor(); //保持继承链
  for (var key in obj) {
    //如果obj有不可枚举的属性则复制不到，bug
    if (Object.hasOwnProperty.call(obj, key)) {
      //不遍历其原型链上的属性
      var val = obj[key];
      //arguments.callee 弃用的话就用函数名
      newObj[key] = typeof val === 'object' ? arguments.callee(val) : val; // 使用arguments.callee解除与函数名的耦合
    }
  }
  return newObj;
};
```

# 兼容 IOS 的日期

transIOS(str) {
var arr = str.split(/[-:./]|\s+/)
return new Date(arr[0], arr[1] - 1, arr[2], arr[3], arr[4]);
},

# // 数组去重的三种办法

let arr4 = [1, 3, 2, 5, 3, 1, 2, 7, 8];
let newArr = arr4.reduce((pre,cur)=>{
if (!pre.includes(cur)) {
return pre.concat(cur) // concat 生成一个新数组，push 返回的是数组 length。
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
// flat() 函数将删除原始数组中存在的所有空值。默认深度为 1。

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

// 函数:函数的 name 属性;

# rest 参数是真正意义上的数组，可以使用数组的任何方法

// ES5
function fn() {
console.log(arguments) //[Arguments] { '0': 1, '1': 2, '2': 3, '3': 4 }
}
fn(1,2,3,4)

// ES6
function fn(...rest) {
console.log(rest) //[ 1, 2, 3, 4, 5 ]
}
fn(1,2,3,4,5)

# rest 参数只能作为最后一个参数，在它之后不能存在任何其他的参数，否则会报错。函数的 length 属性，不包含 rest。

function fn(a, b, ...rest) {  
}
console.log(fn.length) //2

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

// 譬如在程序中，我们需要把 5 和另外一个数字相加
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
check(/\d+/g, '123') //true+
check(/[a-z]+/g, 'test') //true

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

hasNumber('123') // true
hasLetter('test') // true

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
// fn.call(this, ...args) 用 call 也可以
return fn.apply(this, args)
} else {
// 没有达到个数时，需要返回一个新的函数 curried2，继续接收来的参数
return function (...args2) {
// 接收到参数时，需要递归调用 curried 来检查函数参数的个数是否达到
return curried.apply(this, [...args, ...args2])
}
}
}
return curried
}

var curryAdd = hyCurrying(add1) // add1 作为 fn 只是在这里站一下
console.log(curryAdd(10,20,30)) // 输出 60
console.log(curryAdd(10,20)(30)) // 输出 60
console.log(curryAdd(10)(20)(30)) // 输出 60， curryAdd(10): curried(10): curried2(20): curried(10, 20): curried2(30): curried(10,20,30) : add1(10,20,30)

// 多参数传递（同上）
function currying(fn, args) {
var \_this = this;
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
  return m \* 2
}

function square(n) {
  return n \* n
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

<!-- 立即resolve()的 Promise 对象，是在本轮“事件循环”（event loop）的结束时执行，而不是在下一轮“事件循环”的开始时。原因：传递到 then() 中的函数被置入了一个微任务队列，而不是立即执行，这意味着它是在 JavaScript 事件队列的所有运行时结束了，事件队列被清空之后，才开始执行。-->
<!-- Promise.resolve方法会将这个对象转为 Promise 对象，然后就立即执行thenable对象的then方法。 -->
<!-- Promise.resolve方法允许调用时不带参数，直接返回一个resolved状态的 Promise 对象。 -->
<!-- .then()函数里不返回值或者返回的不是promise，那么 then 返回的 Promise 将会成为接受状态（resolve） -->

// inside promise
// Promise {<pending>} 'normal'
// micro 这俩看代码顺序
// then
// undefined
// macro

// Promise.resolve()方法的参数分成四种情况。
// 参数是一个 Promise 实例
// 如果参数是 Promise 实例，那么 Promise.resolve 将不做任何修改、原封不动地返回这个实例。
// 这是一个特殊的情况会和另一种 new Promise(r => r(v))产生不一样的效果，最后说明

      // 参数是一个thenable对象
      // thenable对象指的是具有then方法的对象，比如下面这个对象
      //   let thenable = {
      //     then: function(resolve, reject) {
      //       resolve(42);
      //     }
      //   };

      // Promise.resolve方法会将这个对象转为 Promise 对象，然后就立即执行thenable对象的then方法。

         let thenable = {
           then: function(resolve, reject) {
             resolve(42);
           }
         };
         let p1 = Promise.resolve(thenable);
         p1.then(function(value) {
           console.log(value); // => 42
         });
         console.log(p1) // Promise {<fulfilled>: 42}

         let thenable = {
           then123: function(resolve, reject) {
             resolve(42);
           }
         };
         let p1 = Promise.resolve(thenable);
         var promise = p1.then(function(value) {
           console.log(value); // => {then123: function(resolve, reject){}}
         });
         console.log(promise); // => Promise{__proto__: Promise, [[PromiseStatus]]: "resolved", [[PromiseValue]]: undefined}

      // thenable对象的then方法执行后，对象p1的状态就变为resolved，从而立即执行最后那个then方法指定的回调函数，输出 42

      //   参数不是具有then方法的对象，或根本就不是对象
      //   如果参数是一个原始值，或者是一个不具有then方法的对象，则Promise.resolve方法返回一个新的 Promise 对象，状态为resolved。
      //   const p = Promise.resolve("Hello");
      //   p.then(function(s) {
      //     console.log(s); // => Hello
      //   });
      //   由于字符串Hello不属于异步操作（判断方法是字符串对象不具有 then 方法），返回 Promise 实例的状态从一生成就是resolved，所以回调函数会执行。Promise.resolve方法的参数，会同时传给回调函数

      // 不带有任何参数
      // Promise.resolve方法允许调用时不带参数，直接返回一个resolved状态的 Promise 对象。

      //   setTimeout(function() {
      //     console.log("three");
      //   }, 0);
      //   Promise.resolve().then(function() {
      //     console.log("two");
      //   });
      //   console.log("one");
      // one
      // two
      // three

      // .then()函数里不返回值或者返回的不是promise，那么 then 返回的 Promise 将会成为接受状态（resolve）
      Promise.resolve()
        .then(() => console.log(2))
        .then(() => console.log(3));
      console.log(1); // => 1, 2, 3

      //   Promise.resolve(v)不等于new Promise(r => r(v))
      //   当v是一个Promise实例的时候就会出现一些不同的地方

      // v是一个实例化的promise，且状态为fulfilled
      let v = new Promise(resolve => {
        console.log("begin");
        resolve("then");
      });
      // 在promise里面resolve一个状态为fulfilled的promise
      // 模式一 new Promise里的resolve()
      // begin->1->2->3->then->4 可以发现then推迟了两个时序
      // 推迟原因：浏览器会创建一个 PromiseResolveThenableJob 去处理这个 Promise 实例，这是一个微任务。
      // 等到下次循环到来这个微任务会执行，也就是PromiseResolveThenableJob 执行中的时候，因为这个Promise 实例是fulfilled状态，所以又会注册一个它的.then()回调
      // 又等一次循环到这个Promise 实例它的.then()回调执行后，才会注册下面的这个.then(),于是就被推迟了两个时序
      new Promise(resolve => {
        resolve(v);
      }).then(v => {
        console.log(v);
      });
      //  模式二 Promise.resolve(v)直接创建
      // begin->1->then->2->3->4 可以发现then的执行时间正常了，第一个执行的微任务就是下面这个.then
      // 原因：Promise.resolve()API如果参数是promise会直接返回这个promise实例，不会做任何处理
      /*     Promise.resolve(v).then((v)=>{
        console.log(v)
    }); */
      new Promise(resolve => {
        console.log(1);
        resolve();
      })
        .then(() => {
          console.log(2);
        })
        .then(() => {
          console.log(3);
        })
        .then(() => {
          console.log(4);
        });

# file read

function readFile(url) {
var param;
$.ajax({
url: url, // 文件位置
type: 'GET', // 请求方式为 get
async: false,
dataType: 'xml', // 返回数据格式为 xml
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

# eval

1.在 ecma 规范中，eval 存在直接调用和间接调用两种方式，而直接调用时上下文为当前执行环境，间接调用时上下文为全局环境 2.直接调用 eval 时，为直接调用，而使用表达式计算得到的 eval 是间接调用
这样就很明了了，eval('this')和(0,eval)('this')的区别是，一个是在当前执行环境下，一个是在全局执行环境下，后面的调用方式才可百分百确定指向的是全局宿主对象

(global => {
// localStorage.getItem 有 5%几率返回空字符串。
const \_getItem = global.localStorage.getItem;
global.localStorage.getItem = function (...args) {
let result = \_getItem.call(global.localStorage, ...args);
if (Math.random() < 0.05) {
result = '';
}
return result;
}
})((0, eval)('this'));

# 函数重写

要理解惰性载入函数的原理，我们有必要先理解一下函数重写技术，由于一个函数可以返回另一个函数，因此可以在函数内部用新的函数来覆盖旧的函数。
function sayHi() {
console.info('Hi');
sayHi = function() {
console.info('Hello');
}
}
我们第一次调用 sayHi()函数时，控制台会打印出 Hi，全局变量 sayHi 被重新定义，被赋予了新的函数，从第二次开始之后的调用都会打印出 Hello。惰性载入函数的本质就是函数重写，惰性载入的意思就是函数执行的分支只会发生一次。
————————————————
原文链接：https://blog.csdn.net/heuguangxu/article/details/98615385

// 下述方法存在两个问题，一是污染了全局变量
// 二是每次调用都需要进行一次判断
var t;
function foo() {
if (t) return t;
t = new Date()
return t;
}

// 使用闭包来避免污染全局变量，
// 但是还是没有解决每次调用都需要进行一次判断的问题
var foo = (function() {
var t;
return function() {
if (t) return t;
t = new Date();
return t;
}
})();

// 函数也是一种对象，利用这个特性也可以解决
// 和方案二一样，还差一个问题没有解决
function foo() {
if (foo.t) return foo.t;
foo.t = new Date();
return foo.t;
}

// 利用惰性载入技巧，即重写函数
var foo = function() {
var t = new Date();
foo = function() {
return t;
};
return foo();
};

ajax 请求是一种官方推出的请求方式，通过 xhr 对象去实现，jsonp 是民间发明，script 标签实现的请求。
ajax 是一个异步请求，jsonp 是一个同步请求
ajax 存在同源检查，jsonp 不存在同源检查，后端无需做解决跨域的响应头。
ajax 支持各种请求的方式，而 jsonp 只支持 get 请求
ajax 的使用更加简便，而 jsonp 的使用较为麻烦。

# 用 return 直接退出方法会带来一个问题，如果在循环之后还有一些将被执行的代码呢？如果提前退出了整个方法，这些代码就得不到被执行的机会：

var func = function(){
for ( var i = 0; i < 10; i++ ){
for ( var j = 0; j < 10; j++ ){
if ( i \* j > 30 ){
return;
}
}
}
console.log( i ); // 这句代码没有机会被执行
};

为了解决这个问题，可以把循环后面的代码放到 return 后面，如果代码比较多，就应该把它们提炼成一个单独的函数：

var print = function( i ){
console.log( i );
};
var func = function(){
for ( var i = 0; i < 10; i++ ){
for ( var j = 0; j < 10; j++ ){
if ( i \* j > 30 ){
return print( i );
}
}
}
};
func();

# 在 JavaScript 中，如果想要将对象转换成基本类型时，再从基本类型转换为对应的 String 或者 Number，实质就是调用 valueOf 和 toString 方法，也就是所谓的拆箱转换。

const x = {
val: 0,
// valueOf
toString: () => {
x.val++
return x.val
},
}
给对象 x 设置一个属性 val 并赋值为 0，并修改其 valueOf、toString 方法，在 “x == 1 && x == 2 && x == 3”判断执行时，每次等式比较都会触发 valueOf、toString 方法，都会执行 val++ ，同时把最新的 val 值用于等式比较，三次等式判断时 val 值分别为 1、2、3 与等式右侧的 1、2、3 相同，从而使等式成立。

```javascript
% 删除 cookie：
var expires = new Date();
expires.setTime(expires.getTime() - 10000);
document.cookie =
"IDSTGC=" + escape("echo") + ";expires=" + new Date(0).toUTCString() + `;Path=/`;
% 跨域设置cookie:
    setCookie(cname, cValue, exDays = 1) {
      var d = new Date();
      d.setTime(d.getTime() + exDays * 24 * 60 * 60 * 1000);
      var expires = "expires=" + d.toUTCString();
      console.log(cname, cValue, expires);
      document.cookie =
        cname +
        "=" +
        escape(cValue) +
        "; " +
        expires +
        ";" +
        "path=/;domain=" +
        window.g.innerDomain +
        "/;";
    },
```

顺序：
async function async1() {
console.log('async1 start');
await async2();
console.log('async1 end');
}
async function async2() {
console.log('async2');
}
console.log('script start');
setTimeout(function () {
console.log('setTimeout');
}, 0)
async1();
new Promise(function (resolve) {
console.log('promise1');
resolve();
console.log('promise2')
}).then(function () {
console.log('promise3');
});
console.log('script end');
// script start
shunxu.js:2 async1 start
shunxu.js:7 async2
shunxu.js:15 promise1
shunxu.js:17 promise2
shunxu.js:21 script end
shunxu.js:4 async1 end
shunxu.js:19 promise3
shunxu.js:11 setTimeout
await 的语义不是代码就停在这里啥也不干了，而是 下面的代码接到上面的回调上。

// 查询某天是否为工作日
const isWeekday = (date) => date.getDay() % 6 !== 0;

// 获取选定的文本
const getSelectedText = () => window.getSelection().toString();

// activeElement 属性返回文档中当前获得焦点的元素。
const elementIsInFocus = (el) => (el === document.activeElement);

// 检查当前选项卡是否在后台
const isTabActive = () => !document.hidden;

const randomHexColor = () => `#${Math.floor(Math.random() * 0xffffff).toString(16).padEnd(6, "0")}`

const isEmpty = obj => Reflect.ownKeys(obj).length === 0 && obj.constructor === Object;

const getParameters = URL => JSON.parse(`{"${decodeURI(URL.split("?")[1]).replace(/"/g, '\\"').replace(/&/g, '","').replace(/=/g, '":"')}"}`)

function GetRequest() {  
 var url = location.search;
//获取 url 中"?"符后的字串  
 var theRequest = new Object();
if (url.indexOf("?") != -1) {
var str = url.substr(1);
strs = str.split("&");  
 for(var i = 0; i < strs.length; i ++) {
theRequest[strs[i].split("=")[0]]=unescape(strs[i].split("=")[1]);
}
}
return theRequest;  
}

# 当前页面禁用后退：

methods: {
myBack() {
history.pushState(null, null, document.URL);
}
},
mounted() {
history.pushState(null, null, document.URL);
window.addEventListener("popstate", this.myBack, false);
},
destroyed() {
window.removeEventListener("popstate", this.myBack, false);
},

# Object.is(p1, p2)

    var isEqual = Object.is || function(v1, v2) {
        if (v1 === 0 && v2 === 0) {
          // 针对Object.is的 +0 不等于 -0的情况。 === 反而相等
          return 1 / v1 === 1 / v2;
        } else if (v1 !== v1) {
          // 针对NaN的情况，因为 Object.is(NaN, NaN) = true
          return v2 !== v2;
        } else {
            return v1 === v2;
        }
    }

# 检测是否函数

function isFunction(v) {
return [
'[object Function]',
'[object GeneratorFunction]',
'[object AsyncFunction]',
'[object Promise]',
].includes(Object.prototype.toString.call(v));
}

# 是否空对象

function isEmpty(obj){
return Reflect.ownKeys(obj).length === 0 && obj.constructor === Object;
}

# 平滑过渡

function scrollTo(element) {
element.scrollIntoView({ behavior: "smooth", block: "start" }) // 顶部
element.scrollIntoView({ behavior: "smooth", block: "end" }) // 底部
element.scrollIntoView({ behavior: "smooth"}) // 可视区域
}

# 使用 for in 循环时，请对对象使用，不要对数组使用，示例代码如下：

var foo = [];
foo[100] = 100;
for (var i in foo) {
console.log(i);
}
for (var i = 0; i < foo.length; i++) {
console.log(i);
}
在上述代码中，第一个循环只打印一次，而第二个循环则打印 0~100，这并不满足预期值。

var util = require('util'); //导入模块
util.inherits(Sub, Base); //使 Sub 函数继承 Base 函数对象

FruitEnum = {
tomato: 1,
banana: 2,
apple:3
}
const FruitList = Object.entries(FruitEnum) // 二维数组， [[key, value]]

// 因为 add 传递的参数不能为数组，为了方便，可以用 apply 方法来实现用数组的参数来传递，这是很多时候运用的一个小技巧罢了。
// 而 apply 方法第一个参数，是要替代的对象。没有要替代的，用 null 或 0,也是很自然的。
function curry(fn) {
// 第二个参数开始才是数据，第一个参数是 add 函数
var args = Array.prototype.slice.call(arguments, 1);
return function() {
var innerArgs = Array.prototype.slice.call(arguments);
var finalArgs = args.concat(innerArgs);
return fn.apply(0, finalArgs);
}
;
}
function add(num1, num2) {
return num1 + num2;
}
var curriedAdd = curry(add, 5, 12);
alert(curriedAdd());

修改 v-html 后，具有 input 功能的 div 的光标去了开头，下面可以回到结尾：
this.$nextTick(() => {
setTimeout(() => {
div.focus();
let innerDivText = div.childNodes[div.childNodes.length - 1];
this.lastSelection.collapse(innerDivText, 1);
console.log(div.childNodes, innerDivText.length);
}, 10);
});

arr.splice(index, 0, el); index 后插入 el
arr.splice(index, 1, el); el 替换 index


```javascript
/**
 * Boolean 是 JavaScript 的内置构造函数，通过传递一个值给它，可以将该值转换为布尔值。在这种情况下，Boolean 构造函数作为回调函数传递给 filter() 方法，因此会将每个数组元素转换为布尔值。只有转换结果为真值的元素才会保留在新数组中。注意：这种方式会将 0 也过滤掉，如果不需要过滤 0，需要进行额外的判断。
 */
let arr = [12, null, 0, 'xyz', null, -25, NaN, '', undefined, 0.5, false];
let filterArray = arr.filter(Boolean); // [12, 'xyz', -25, 0.5]

// 位非（~）运算符对除了-1之外的任何值都返回一个"真"值，对-1返回数字0。
if(~arr.indexOf(item)) {
}

// 逻辑或赋值运算符（||=）用于为变量分配默认值。
let count;
count ||= 0;

1e5 === 100000;

// 双位非运算符有一个非常实用的用途，可以用它来替代Math.floor()函数将数字向下取整，它在执行相同的操作时速度更快。传统写法：
Math.floor(4.9) === 4  //true
// 简化写法：
~~4.9 === 4  //true
/*注意：双非位运算符只适用于 32 位整数，即范围为 -(2^31) 到 (2^31)-1，即 -2147483648 到 2147483647。对于大于 2147483647 或小于 0 的数字，双非位运算符（~~）会给出错误的结果，因此建议在这种情况下使用 Math.floor() 方法。
*/
```

```javascript
// 数组乱序
// 在使用需要某种程度的随机化的算法时，你会经常发现洗牌数组是一个相当必要的技能。下面的片段以O(n log n)的复杂度对一个数组进行就地洗牌。
const shuffleArray = (arr) => arr.sort(() => Math.random() - 0.5) 。
// 测试
const arr = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
console.log(shuffleArray(arr))。

// 复制到剪贴板
// 在Web应用程序中，复制到剪贴板因其对用户的便利性而迅速流行起来。
const copyToClipboard = (text) =>
  navigator.clipboard?.writeText && navigator.clipboard.writeText（text）。
// 测试
copyToClipboard("Hello World!")。
// 注意：根据caniuse，该方法对93.08%的全球用户有效。所以必须检查用户的浏览器是否支持该API。为了支持所有用户，你可以使用一个输入并复制其内容。

// 数组去重
// 每种语言都有自己的哈希列表的实现，在JavaScript中，它被称为Set。你可以使用Set数据结构轻松地从一个数组中获得唯一元素。
const getUnique = (arr) => [...new Set(arr)]
// 测试
const arr = [1, 1, 2, 3, 3, 4, 4, 5, 5];
console.log(getUnique(arr))。

// 检测黑暗模式
// 随着黑暗模式的普及，如果用户在他们的设备中启用了黑暗模式，那么将你的应用程序切换到黑暗模式是非常理想的。幸运的是，可以利用媒体查询来使这项任务变得简单。
const isDarkMode = () =>
  window.matchMedia &&
  window.matchMedia("(prefers-color-scheme: dark)").matches。
// 测试
console.log(isDarkMode())。
// 根据caniuse的数据，matchMedia的支持率为97.19%。

// 滚动到顶部
// 初学者经常发现自己在正确滚动元素的过程中遇到困难。最简单的滚动元素的方法是使用scrollIntoView方法。添加行为。"smooth "来实现平滑的滚动动画。
const scrollToTop = (element) =>
  element.scrollIntoView({ behavior: "smooth", block: "start" })。

// 滚动到底部
// 就像scrollToTop方法一样，scrollToBottom方法也可以用scrollIntoView方法轻松实现，只需将块值切换为结束即可
const scrollToBottom = (element) =>
  element.scrollIntoView({ behavior: "smooth", block: "end" })。

// 生成随机颜色
// 你的应用程序是否依赖随机颜色的生成？不用再看了，下面的代码段可以满足你的要求
const generateRandomHexColor = () =>
  \`#${Math.floor(Math.random() * 0xffffff) .toString(16)}`;
```


iframe内部调用父辈location会报跨域错误
    // this.domain =
    //   (window.parent &&
    //     window.parent.location &&
    //     window.parent.location.href) ||
    //   "*";

```javascript
// localStorage的生命周期是永久的，意思就是如果不主动清除，存储的数据将一直被保存。而sessionStorage顾名思义是针对一个session的数据存储，生命周期为当前窗口，一旦窗口关闭，那么存储的数据将被清空。最后还有一个很主要的区别同一浏览器的相同域名和端口的不同页面间可以共享相同的 localStorage，但是不同页面间无法共享sessionStorage的信息。
created() {
        // 跨标签页监听
        window.addEventListener('storage', this.storageChange)
    },
    methods: {
        storageChange(e) {
            if (e && e.key == 'targetKey' && e.newValue) {
                // 在这里更新数据
            }
        },
    }
// 多个组件依赖于同一条数据(状态)，需要即时响应更新的情况，vuex的价值就体现出来了。
```
```javascript
// js 对数字加逗号处理(每三位加逗号)-正则表达式
const toThousands = (num = 0) => {
  return num.toString().replace(/\d+/, function(n) { 
      console.log(n)
      // 多个三连结尾; 
//       (\d)：匹配一个数字，并将其捕获到第一个捕获组中。
// (?=(?:\d{3})+$)：这是一个前瞻断言，它确保匹配的文本后面是一个或多个三位数字。 ?:表示虽然匹配，但是不捕获这个括号。
// g：这是全局标志，表示匹配字符串中的所有实例，而不是仅匹配第一个。有了g可以多次reg.exec(str)找到所有处于括号中的匹配
// 这个正则表达式使用 replace() 方法来替换匹配的文本。在替换字符串中，$1 表示第一个捕获组中的内容（即一个数字），而 , 是要添加的逗号。
      return n.replace(/(\d)(?=(?:\d{3})+$)/g, '$1,'); 
   });
};
// (?=)只是条件并不占位，所以不会成为$2; 而 (\d{3})+ 表示至少有一个，但是对应的$2只是(\d{3})的最后一组。
console.log(toThousands(1234567890.111)); //1,234,567,890.111
```


blur()关不掉时可以找到他，然后自己remove()
```javascript
        let dropList = document.getElementsByClassName("el-select-dropdown") || [];
        for (let i = 0; i < dropList.length; i++) {
          let attr = dropList[i].getAttribute("x-placement");
          console.log(dropList, attr);
          if (attr) {
            dropList[i].remove();
          }
        }
```
generator一定是使用了闭包，否则无法在执行next()时保存上下文。
```javascript
function* gen() {
  const a = yield 1;
  console.log(a, 'this is a');
  const b = yield 2;
  console.log(b, 'this is b');
  const c = yield 3;
  console.log(c, 'this is c');
}

let g = gen();

g.next(); // { value: 1, done: false }
g.next('param-a'); // { value: 2, done: false }
g.next('param-b') // { value: 3, done: false }
g.next('param-c') // {value: undefined, done: true}
// param-a this is a
// param-b this is b
// param-c this is c
```

```javascript
const list = [
  { id: 2, pid: 1, name: '成都' },
  { id: 1, pid: 0, name: '四川' },
  { id: 3, pid: 1, name: '宜宾' },
  { id: 4, pid: 1, name: '绵阳' },
  { id: 5, pid: 1, name: '德阳' },
  { id: 6, pid: 2, name: '高新区' },
  { id: 7, pid: 2, name: '武侯区' },
  { id: 8, pid: 3, name: '翠屏区' }
];
const arrayToTree = (arr, pid) => {
  // reduce是累计，不会返回很多元素。
  return arr.reduce((res, current) => {
    if (current['pid'] === pid) {
      current.children = arrayToTree(arr, current['id']); // 每次递归都是list全体
      return res.concat(current); // 返回给其父元素
    }
    return res;
  }, []);
};
console.log(arrayToTree(list, 0))

const arrayToTree = (arr, rootId) => {
  const map = {};
  for (const iterator of arr) {
    map[iterator['id']] = iterator;
  }
  for (const iterator of arr) {
    const key = iterator['pid'];
    if (!(key in map)) continue;
    // 引用关系 在concat后不变
    map[key].children = (map[key].children || []).concat(iterator);
  }
  return map[rootId];
};
console.log(arrayToTree(list, 1));
```


```js
// JavaScript 语言本身不支持枚举
// 这个技巧有个缺点，就是枚举项不能超过 31 个。
const SKILLS = {
  CSS: 1,  
  JS: 1 << 1, // 左移运算符 (<<) 将第一个操作数左移指定位数。向左移动的多余位被丢弃。零位从右侧移入。
  HTML: 1 << 2,
  WEB_GL: 1 << 3
}

// Use this value to store a user's tech-stack
let skills = 0

// add a skill for the user
function addSkill(skill) {
  skills = skills | skill
}

addSkill(SKILLS.CSS)
addSkill(SKILLS.JS)

// If this value is not 0, it means that the user has mastered the tech
console.log('Does he know CSS', SKILLS.CSS & skills, SKILLS, skills)
console.log('Does he know JavaScript', SKILLS.JS & skills)
console.log('Does he know Web GL', SKILLS.WEB_GL & skills)
export const enum ShapeFlags {
  ELEMENT = 1, // 表示一个普通的HTML元素
  FUNCTIONAL_COMPONENT = 1 << 1, // 函数式组件
  STATEFUL_COMPONENT = 1 << 2,  // 有状态组件
  TEXT_CHILDREN = 1 << 3, // 子节点是文本
  ARRAY_CHILDREN = 1 << 4, // 子节点是数组
  SLOTS_CHILDREN = 1 << 5, // 子节点是插槽
  TELEPORT = 1 << 6, // 表示vnode描述的是个teleport组件
  SUSPENSE = 1 << 7, // 表示vnode描述的是个suspense组件
  COMPONENT_SHOULD_KEEP_ALIVE = 1 << 8, // 表示需要被keep-live的有状态组件
  COMPONENT_KEPT_ALIVE = 1 << 9, // 已经被keep-live的有状态组件
  COMPONENT = ShapeFlags.STATEFUL_COMPONENT | ShapeFlags.FUNCTIONAL_COMPONENT // 组件，有状态组件和函数式组件的统称
}
```

使用 Object.getOwnPropertyNames 可以得到对象自身的所有属性名组成的数组(包括不可枚举属性)。
缺点：不能获取 Symbol 值作为名称的属性，包括 JSON.stringify、for in 以及 Object.keys 方法也不能获取Symbol 值作为名称的属性。
Reflect.ownKeys(target) 方法返回一个由目标对象自身的属性组成的数组，它的返回值等同于 Object.getOwnPropertyNames(target).concat(Object.getOwnPropertySymbols(target))
判断一个对象是否为空时，使用 Reflect.ownKeys 方法最为完美。
Reflect.ownKeys(obj1).length === 0


保证页面的流畅性是前端的一个主要内容，页面卡顿会严重影响用户体验。这流畅性是需要一个指标来衡量的，那就是帧率（FPS），FPS 表示的是每秒钟画面更新次数，当今大多数设备的屏幕刷新率都是60次/秒。
想要保证页面流畅不卡顿，浏览器对每一帧画面的渲染工作需要在16ms（1000ms/60）之内完成！

# 想要保证页面流畅，需要做到每16ms渲染一次！

也就是说，前面在我们执行任务的时候，浏览器没有能够做到每16ms渲染一次，所以我们页面会卡顿不流畅。那么是什么导致了浏览器没有能够正常渲染呢？

# 对浏览器事件循环的深入了解，我们可以知道，浏览器没能每16ms渲染一次也能被解读为没能每16ms执行完一次事件循环。
结合我们页面的Performance可以看到，requestAnimationFrame.html中的load函数的执行花费了6s多，而事件循环中的渲染需要等待前面任务执行完毕，才会判断执行。
也就是说，浏览器花费了6s多的时间才完成了一次事件循环，完成了一次渲染任务，而我们保持页面60FPS的最低要求是每16ms完成一次渲染，这就难怪页面会卡顿不流畅，这显然是不合理的！
将load函数代码拆分成多个小任务，保证16ms内能执行完一次事件循环，这样才能保持页面流畅不卡顿，而这个时候，就需要应用到我们的任务切片了！
```js
function load() {
    let total = 1000000;
    let length = 20;
    let page = total/length
    let index = 0;
    function loop(curTotal,curIndex){
        if(curTotal <= 0){
            return false;
        }
        let pageCount = Math.min(curTotal , length);
        // requestAnimationFrame
        /**页面的Performance可以看到load函数代码分成了无数小任务（output）进行执行，每一次小任务执行完，都判断是否需要渲染（这里可以看到由于事件循环之间的间隔时间太短，浏览器选择三次事件循环才执行一次渲染任务）。 */
        setTimeout(()=>{
            for(let i = 0; i < pageCount; i++){
                console.log(i)
            }
            loop(curTotal - pageCount,curIndex + pageCount)
        },0)
    }
    loop(total,index);
  }
```
浏览器页面是否流畅取决于帧率FPS，帧率越高，页面越流畅，反之页面越卡顿。而页面帧率取决于浏览器执行渲染任务的频率（还有设备性能），同时我们知道，浏览器的渲染任务在事件循环中执行。因此我们想要页面流畅，就需要将事件循环花费的时间控制在16.7ms以内（一般设备）。
此时如果我们遇到长任务导致一次事件循环时间过长，我们可以使用任务切片的方式，将其分成多次小任务执行，保证每次事件循环的时间，便能够保证页面流畅！
