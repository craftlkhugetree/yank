// 第一版 修改this指向，合并参数
Function.prototype.bindFn = function bind(thisArg) {
  if (typeof this !== 'function') {
    throw new TypeError(this + 'must be a function');
  }
  // 存储函数本身
  var self = this;
  // 去除thisArg的其他参数 转成数组
  var args = [].slice.call(arguments, 1);
  console.log('args:', args, arguments, thisArg);
  var bound = function () {
    // bind返回的函数 的参数转成数组
    var boundArgs = [].slice.call(arguments);
    console.log('boundArgs:', boundArgs, arguments);
    var finalArgs = args.concat(boundArgs);
    // new 调用时，其实this instanceof bound判断也不是很准确。es6 new.target就是解决这一问题的。
    if (this instanceof bound) {
      // 这里是实现上文描述的 new 的第 1, 2, 4 步
      // 1.创建一个全新的对象
      // 2.并且执行[[Prototype]]链接
      // 4.通过`new`创建的每个对象将最终被`[[Prototype]]`链接到这个函数的`prototype`对象上。
      // self可能是ES6的箭头函数，没有prototype，所以就没必要再指向做prototype操作。
      if (self.prototype) {
        // ES5 提供的方案 Object.create()
        // bound.prototype = Object.create(self.prototype);
        // 但 既然是模拟ES5的bind，那浏览器也基本没有实现Object.create()
        // 所以采用 MDN ployfill方案 https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/create
        function Empty() {}
        Empty.prototype = self.prototype;
        bound.prototype = new Empty();
      }
      // 这里是实现上文描述的 new 的第 3 步
      // 3.生成的新对象会绑定到函数调用的`this`。
      var result = self.apply(this, finalArgs);
      // 这里是实现上文描述的 new 的第 5 步
      // 5.如果函数没有返回对象类型`Object`(包含`Functoin`, `Array`, `Date`, `RegExg`, `Error`)，
      // 那么`new`表达式中的函数调用会自动返回这个新的对象。
      var isObject = typeof result === 'object' && result !== null;
      var isFunction = typeof result === 'function';
      if (isObject || isFunction) {
        return result;
      }
      return this;
    } else {
      // apply修改this指向，把两个函数的参数合并传给self函数，并执行self函数，返回执行结果
      return self.apply(thisArg, finalArgs);
    }
  };
  return bound;
};
// 测试
var obj = {
  name: '若川',
};
function original(a, b) {
  console.log(this.name);
  console.log([a, b]);
}
var bound = original.bindFn(obj, 1); // thisArg 只是obj，所以this.name指向obj，而apply的参数是数组但在函数参数中被逗号单个隔开
bound(2); // '若川', [1, 2]

// bind的返回值函数bound内部要模拟实现new实现的操作。
