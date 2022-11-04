/**
 * 1. promise就是一个类
2. 在执行类的时候需要传递一个执行器进去，执行器会立即执行
3. Promise中有三种状态，分别为成功-fulfilled 失败-rejected 等待-pending
pending -> fulfilled
pending -> rejected
一旦状态确定就不可更改
4. resolve 和 reject函数是用来更改状态的
resolve：fulfilled
reject：rejected
5. then方法内部做的事情就是判断状态 如果状态是成功，调用成功回调函数
如果状态是失败，就调用失败回调函数
then方法是被定义在原型对象中的
then(成功回调有一个参数，表示成功之后的值；then失败回调有一个参数，表示失败后的原因)
 */
// myPromise.js
// 定义成常量是为了复用且代码有提示

// myPromise.js
const PENDING = 'pending';
const FULFILLED = 'fulfilled';
const REJECTED = 'rejected';
class MyPromise {
  constructor(exector) {
    //try catch 用来捕获执行器执行时候报错
    try {
      exector(this.resolve, this.reject);
    } catch (e) {
      this.reject(e);
    }
  }

  status = PENDING; //初始状态
  value = undefined; //接收成功函数值
  reason = undefined; //失败函数值
  successCallback = []; //成功函数列表
  failCallback = []; //失败函数列表

  resolve = value => {
    //先判断状态是否为 PENDING  如果不是  说明状态以及改变 直接返回
    //如果 不是  就将当前状态 改为FULFILLED
    //将值传进来的值  赋值给this.value
    //通过while循环 将成功回调函数依次执行 去除第一个函数执行完毕之后 就从数组里删除 依次执行
    if (this.status !== PENDING) return;
    this.status = FULFILLED;
    this.value = value;
    while (this.successCallback.length) this.successCallback.shift()();
  };

  reject = reason => {
    //先判断状态是否为 PENDING  如果不是  说明状态以及改变 直接返回
    //如果 不是  就将当前状态 改为REJECTED
    //将值传进来的值  赋值给this.reason
    //通过while循环 将失败回调函数依次执行 去除第一个函数执行完毕之后 就从数组里删除 依次执行
    if (this.status !== PENDING) return;
    this.status = REJECTED;
    this.reason = reason;
    while (this.failCallback.length) this.failCallback.shift()();
  };

  then(
    successCallback = value => value,
    failCallback = reason => {
      throw reason;
    }
  ) {
    //then方法 接收两个参数  一个成功 一个失败
    let promise2 = new Promise((resolve, reject) => {
      if (this.status === FULFILLED) {
        //当状态为FULFILLED 时 就直接执行
        //加上定时器是为了能够获取到promise2
        //将成功函数处理完的值  以及promise2 resolve reject  传给resolvePromise 同一处理
        setTimeout(() => {
          try {
            let x = successCallback(this.value);
            resolvePromise(promise2, x, resolve, reject);
          } catch (e) {
            reject(e);
          }
        }, 0);
      } else if (this.status === REJECTED) {
        //当状态为REJECTED 时 就直接执行
        //加上定时器是为了能够获取到promise2
        //将失败函数处理完的值  以及promise2 resolve reject  传给resolvePromise 同一处理
        setTimeout(() => {
          try {
            let x = failCallback(this.reason);
            resolvePromise(promise2, x, resolve, reject);
          } catch (e) {
            reject(e);
          }
        }, 0);
      } else {
        // 等待
        // 因为并不知道状态，所以将成功回调和失败回调存储起来，等到执行成功失败函数的时候再传递。如果在异步里，那么下面的代码就会将成功回调和失败回调都保存在数组中，等待异步执行resolve或reject。
        //当状态为PENDING的时候 说明函数是异步的
        //所以我们将成功函数 加入成功函数列表
        this.successCallback.push(() => {
          setTimeout(() => {
            try {
              let x = successCallback(this.value);
              resolvePromise(promise2, x, resolve, reject);
            } catch (e) {
              reject(e);
            }
          }, 0);
        });
        //当状态为PENDING的时候 说明函数是异步的
        //所以我们将失败函数 加入失败函数列表
        this.failCallback.push(() => {
          setTimeout(() => {
            try {
              let x = failCallback(this.reason);
              resolvePromise(promise2, x, resolve, reject);
            } catch (e) {
              reject(e);
            }
          }, 0);
        });
      }
    });
    //返回一个promise2
    return promise2;
  }

  finally(callback) {
    // 如何拿到当前的promise的状态，使用then方法，而且不管怎样都返回callback
    // 而且then方法就是返回一个promise对象，那么我们直接返回then方法调用之后的结果即可
    // 我们需要在回调之后拿到成功的回调，所以需要把value也return
    // 失败的回调也抛出原因
    // 如果callback是一个异步的promise对象，我们还需要等待其执行完毕，所以需要用到静态方法resolve
    return this.then(
      value => {
        // 把callback调用之后返回的promise传递过去，并且执行promise，且在成功之后返回value
        return MyPromise.resolve(callback()).then(() => value);
      },
      reason => {
        // 失败之后调用的then方法，然后把失败的原因返回出去。
        return MyPromise.resolve(callback()).then(() => {
          throw reason;
        });
      }
    );
  }

  catch(failCallback) {
    //catch方法 用来捕获promise执行中的错误 可以直接调用then方法来执行  因为then方法接收两个参数 而我们是为了捕获错误，所以第一个参数传递一个undefined
    return this.then(undefined, failCallback);
  }

  static all(array) {
    //all方法是所有的执行完毕之后 执行 定义一个数组来接收处理过的结果  index用来判断是否全部执行完毕
    let result = [];
    let index = 0;
    return new MyPromise((resolve, reject) => {
      //定义一个add函数  用来添加处理之后的结果  保证结果数组的顺序 跟调用顺序一致
      let addData = (key, value) => {
        result[key] = value;
        index++;
        //当result数组长度  跟传进来的数组长度一致时候  说明执行完毕  就直接调用resolve方法 将处理完的结果数组返回
        if (index === array.length) {
          resolve(result);
        }
      };
      for (let i = 0; i < array.lengt; i++) {
        let current = array[i];
        //遍历传进来的数组  如果是promise对象  就直接调用then方法 将函数处理过后的结果返回
        //如果是普通值就直接添加到结果数组里面
        if (current instanceof MyPromise) {
          current.then(
            value => addData(i, value),
            reason => reject(reason)
          );
        } else {
          addData(i, array[i]);
        }
      }
    });
  }

  static resolve(value) {
    //静态resolve方法  如果是promise就直接返回
    if (value instanceof MyPromise) return value;
    //普通的就直接返回一个promise对象 并传递一个resolve函数 将参数放到resolve里面
    return new MyPromise(resolve => resolve(value));
  }
}

function resolvePromise(promise2, x, resolve, reject) {
  if (promise2 === x) {
    //如果是返回了本身 就会死循环 这时候就抛出一个类型错误
    return reject(new TypeError('Chaining cycle detected for promise #<Promise>'));
  }
  if (x instanceof MyPromise) {
    //如果返回的是一个promise ，那我们就可以直接调用本身的then方法 把参数resolve，和reject穿进去执行
    x.then(resolve, reject);
  } else {
    //如果是普通值  我们就调用resolve方法  将值传进去
    resolve(x);
  }
}
//最后将我们自己创建的MyPromise对象导出
module.exports = MyPromise;
