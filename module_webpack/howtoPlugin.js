(function (global) {
  'use strict';

  var MyPlugin = function (name) {
    this.name = name;
  };

  MyPlugin.prototype = {
    say: function () {
      console.log('欢迎你：', this.name);
    },
    random: function (min = 0, max = 1) {
      if (min <= Number.MAX_SAFE_INTEGER && max <= Number.MAX_SAFE_INTEGER) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
      }
    },
  };

  // 函数自执行将 this（全局下为window）传入，并在其下面挂载方法
  global.MyPlugin = MyPlugin;
  // 兼容CommonJs规范导出
  if (typeof module !== 'undefined' && module.exports) module.exports = MyPlugin;
})(this);
var aFn = new MyPlugin();
var num = aFn.random(10, 20);
// 但由于属性能被直接访问，插件中的变量就可以随意修改，这可能是我们不想看到的：
var aFn = new MyPlugin('呀哈哈');
aFn.name = null;
aFn.say(); // 欢迎你: null

// 下面的写法是仿造JQ实现的一种编写模式，可以省去调用时new实例化的步骤，
// 可以看出核心是对JS原型链的极致利用，首先主动对其原型上的init方法进行实例化并返回，init相当于构造函数的效果，而此时返回的实例里并没有包含Fn的方法，我们调用时JS自然就会从init的原型对象上去查找，于是最终init下的原型才又指向了Fn的原型，通过这种"套娃"的手法，使得我们能够不通过实例化Fn又能正确地访问到Fn下的原型对象。
(function (global) {
  ('use strict');

  var MyPlugin = function (el) {
    return new MyPlugin.prototype.init(el);
  };

  // 如果要创建私有变量，可以利用JS闭包原理来编写插件，我们使用工厂模式来创建函数，
  MyPlugin.prototype = {
    init: function (el) {
      this.el = typeof el === 'string' ? document.querySelector(el) : el;
    },
    setBg: function (bg) {
      this.el.style.background = bg;
      // 返回了 this，这是为了实现链式调用：
      return this;
    },
    setWidth: function (w) {
      this.el.style.width = w;
      return this;
    },
    setHeight: function (h) {
      this.el.style.height = h;
      return this;
    },
  };

  MyPlugin.prototype.init.prototype = MyPlugin.prototype;
  // script标签引入插件后全局下挂载一个_$ 的方法
  global._$ = MyPlugin;
})(this || window);

_$('#app').setBg('#ff0').setHeight('100px').setWidth('200px');

// jsdoc展示帮助文档，rollup打包
// https://mp.weixin.qq.com/s/pVj4BeZ0raapK7YigNymXA
