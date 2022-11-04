const MyPromise = require('./myPromise');
let promise = new MyPromise((resolve, reject) => {
  // 1.
  //   resolve('success');
  //   reject('err');
  // 2.
  setTimeout(() => {
    resolve('success');
  }, 2000);
});

promise.then(
  value => {
    console.log('resolve', value);
  },
  reason => {
    console.log('reject', reason);
  }
);

promise.then(value => {
  console.log(1);
  console.log('resolve', value);
});

promise.then(value => {
  console.log(2);
  console.log('resolve', value);
});

promise.then(value => {
  console.log(3);
  console.log('resolve', value);
});
