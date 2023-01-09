# 划线改驼峰
function turnName(str){
    return str.replace(/-[a-zA-Z]/g,match=>match.replace('-','').toUpperCase())
}
# 深度拷贝
1、用new obj.constructor()构造函数新建一个空的对象，而不是使用{}或者[],这样可以保持原形链的继承；
2、用obj.hasOwnProperty(key)来判断属性是否来自原型链上，因为for..in..也会遍历其原型链上的可枚举属性。
*** 可枚举属性是指那些内部 “可枚举enumerable” 标志设置为 true 的属性，对于通过直接的赋值和属性初始化的属性，该标识值默认为即为 true，对于通过 Object.defineProperty 等定义的属性，该标识值默认为 false。 ***
  Object.keys()    JSON.stringify    Object.assign()  三者只是对象自身的所有可枚举的属性
  Object.getOwnPropertyNames()则是遍历自身所有属性（不论是否是可枚举的）,也是不包括原型链上面的。
3、用到递归算法，在函数名字不会变的情况下，这样定义没有问题。但问题是与函数名紧紧耦合在了一起。为了消除这种紧密耦合的现象，需要使用 arguments.callee。
————————————————
原文链接：https://blog.csdn.net/u013362969/article/details/86489246
``` javascript
var deepClone = function (obj) { 
    if(obj === null) return null 
    if(typeof obj !== 'object') return obj;
    if(obj.constructor===Date) return new Date(obj); 
    if(obj.constructor === RegExp) return new RegExp(obj);
    var newObj = new obj.constructor();  //保持继承链
    for (var key in obj) {
        //如果obj有不可枚举的属性则复制不到，bug
        if (Object.hasOwnProperty.call(obj, key)) {   //不遍历其原型链上的属性
            var val = obj[key];
            //arguments.callee 弃用的话就用函数名
            newObj[key] = typeof val === 'object' ? arguments.callee(val) : val; // 使用arguments.callee解除与函数名的耦合
        }
    }  
    return newObj;  
};
```
# 兼容IOS的日期
  transIOS(str) {
    var arr = str.split(/[-:./]|\s+/)
    return new Date(arr[0], arr[1] - 1, arr[2], arr[3], arr[4]);
  },
# // 数组去重的三种办法
let arr4 = [1, 3, 2, 5, 3, 1, 2, 7, 8];
let newArr = arr4.reduce((pre,cur)=>{
    if (!pre.includes(cur)) {
        return pre.concat(cur) // concat生成一个新数组，push返回的是数组length。
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
      // 如果参数是 Promise 实例，那么Promise.resolve将不做任何修改、原封不动地返回这个实例。
      // 这是一个特殊的情况会和另一种new Promise(r => r(v))产生不一样的效果，最后说明

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


# eval
1.在ecma规范中，eval存在直接调用和间接调用两种方式，而直接调用时上下文为当前执行环境，间接调用时上下文为全局环境
2.直接调用eval时，为直接调用，而使用表达式计算得到的eval是间接调用
这样就很明了了，eval('this')和(0,eval)('this')的区别是，一个是在当前执行环境下，一个是在全局执行环境下，后面的调用方式才可百分百确定指向的是全局宿主对象

(global => {
  // localStorage.getItem 有5%几率返回空字符串。
  const _getItem = global.localStorage.getItem;
  global.localStorage.getItem = function (...args) {
    let result = _getItem.call(global.localStorage, ...args);
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
我们第一次调用sayHi()函数时，控制台会打印出Hi，全局变量sayHi被重新定义，被赋予了新的函数，从第二次开始之后的调用都会打印出Hello。惰性载入函数的本质就是函数重写，惰性载入的意思就是函数执行的分支只会发生一次。
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



ajax请求是一种官方推出的请求方式，通过xhr对象去实现，jsonp是民间发明，script标签实现的请求。
ajax是一个异步请求，jsonp是一个同步请求
ajax存在同源检查，jsonp不存在同源检查，后端无需做解决跨域的响应头。
ajax支持各种请求的方式，而jsonp只支持get请求
ajax的使用更加简便，而jsonp的使用较为麻烦。


# 用return直接退出方法会带来一个问题，如果在循环之后还有一些将被执行的代码呢？如果提前退出了整个方法，这些代码就得不到被执行的机会：
var func = function(){
    for ( var i = 0; i < 10; i++ ){
        for ( var j = 0; j < 10; j++ ){
            if ( i * j > 30 ){
                return;
            }
        }
    }
    console.log( i ); // 这句代码没有机会被执行
};

为了解决这个问题，可以把循环后面的代码放到return后面，如果代码比较多，就应该把它们提炼成一个单独的函数：

var print = function( i ){
    console.log( i );
};
var func = function(){
    for ( var i = 0; i < 10; i++ ){
        for ( var j = 0; j < 10; j++ ){
            if ( i * j > 30 ){
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
给对象 x设置一个属性 val并赋值为 0，并修改其 valueOf、toString 方法，在 “x == 1 && x == 2 && x == 3”判断执行时，每次等式比较都会触发 valueOf、toString 方法，都会执行 val++ ，同时把最新的 val 值用于等式比较，三次等式判断时 val 值分别为 1、2、3 与等式右侧的 1、2、3 相同，从而使等式成立。

删除cookie：
      var expires = new Date();
      expires.setTime(expires.getTime() - 10000);
      document.cookie =
        "IDSTGC=" + escape("echo") + ";expires=" + new Date(0).toUTCString() + `;Path=/`;

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
        //  script start
shunxu.js:2 async1 start
shunxu.js:7 async2
shunxu.js:15 promise1
shunxu.js:17 promise2
shunxu.js:21 script end
shunxu.js:4 async1 end
shunxu.js:19 promise3
shunxu.js:11 setTimeout
await的语义不是代码就停在这里啥也不干了，而是 下面的代码接到上面的回调上。

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
   //获取url中"?"符后的字串  
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
    return  Reflect.ownKeys(obj).length === 0 && obj.constructor === Object;
}
# 平滑过渡
function scrollTo(element) {
    element.scrollIntoView({ behavior: "smooth", block: "start" }) // 顶部
    element.scrollIntoView({ behavior: "smooth", block: "end" }) // 底部
    element.scrollIntoView({ behavior: "smooth"}) // 可视区域
}

# 使用for in循环时，请对对象使用，不要对数组使用，示例代码如下：
var foo = [];
foo[100] = 100;
for (var i in foo) {
  console.log(i);
}
for (var i = 0; i < foo.length; i++) {
  console.log(i);
}
在上述代码中，第一个循环只打印一次，而第二个循环则打印0~100，这并不满足预期值。

var util = require('util'); //导入模块
util.inherits(Sub, Base); //使Sub函数继承Base函数对象


FruitEnum = {
    tomato: 1,
    banana:  2,
    apple:3
}
const FruitList = Object.entries(FruitEnum) // 二维数组， [[key, value]]
