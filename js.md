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