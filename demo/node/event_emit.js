var events = require('events');
var emitter = new events.EventEmitter();

function listener(...rest) {
  console.log(rest);
}
emitter.once('abc', listener);
emitter.once('abc', listener);
emitter.once('abc', listener);
emitter.once('abc', listener);
emitter.once('abc', listener);

console.log('begin:', emitter.listeners('abc'));

setTimeout(() => {
  emitter.emit('abc', [1, 2, 3]);
}, 300);
setTimeout(() => {
  emitter.emit('abc', [1, 2, 3, 4]);
}, 500);
setTimeout(() => {
  emitter.emit('abc', [1, 2, 3, 5]);
}, 1300);
setTimeout(() => {
  emitter.emit('abc', [1, 2, 3, 6]);
}, 2300);
setTimeout(() => {
  emitter.emit('abc', [1, 2]);
}, 3300);

console.log('end:', emitter.listeners('abc'));


// 闭包与偏函数
var after = function (times, callback) {
  var count = 0,
    results = {};
  return function (key, value) {
    results[key] = value;
    count++;
    console.log(results, count);
    if (count === times) {
      callback(results);
    }
  };
};
var times = 3;
function render() {}
var done = after(times, render);
done('temp', 123)
done('temp1', 1)
done('temp2', 2)
