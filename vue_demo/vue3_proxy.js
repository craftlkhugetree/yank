const obj = {
  count: 1,
  b: {
    c: 2,
  },
};
const proxy = new Proxy(obj, {
  get(target, key, receiver) {
    console.log('这里是get', target, key, receiver);
    return Reflect.get(target, key, receiver);
  },
  set(target, key, value, receiver) {
    console.log('这里是set');
    return Reflect.set(target, key, value, receiver);
  },
});

console.log(proxy);
console.log(proxy.count);
console.log(proxy.b.c); // 深一层就无法响应式了
proxy.count = 2;

var deepProxy = function () {
  const obj = {
    a: {
      count: 1,
    },
  };

  function reactive(obj) {
    return new Proxy(obj, {
      get(target, key, receiver) {
        console.log('这里是dp_get');
        // 判断如果是个对象就再包装一次，实现深层嵌套的响应式
        if (typeof target[key] === 'object') {
          return reactive(target[key]);
        }
        return Reflect.get(target, key, receiver);
      },
      set(target, key, value, receiver) {
        console.log('这里是set');
        return Reflect.set(target, key, value, receiver);
      },
    });
  }
  const proxy = reactive(obj);
  return proxy;
};

var dp = deepProxy();
console.log(dp.a.count);

const buf = new Buffer(5);
console.log(module, buf.parent);
