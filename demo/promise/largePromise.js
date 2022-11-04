// Promise.race()方法的参数与 Promise.all（）方法一样，如果不是 Promise 实例，就会先调用Promise.resolve()方法，将参数转为 Promise 实例，再进一步处理。
// Promise.any() 方法是 由 ES2021 引入，该方法接受一组 Promise 实例作为参数，包装成一个新的 Promise 实例返回。只要参数实例有一个变成 fulfilled状态，包装实例就会变成 fulfilled状态。
// 如果所有参数实例都变成 rejected状态，包装实例就会变成rejected状态。
/**
 * 从array第1个元素开始，初始化promise对象，同时用一个executing数组保存正在执行的promise
 * 不断初始化promise，直到达到poolLimt
 * 使用Promise.race，获得executing中promise的执行情况，当有一个promise执行完毕，继续初始化promise并放入executing中
 * 所有promise都执行完了，调用Promise.all返回
 */
/**
 * 1. 同步打印 all: Promise { <pending> } [ Promise { <pending> } ] Promise { <pending> } [ Promise { <pending> } ]
 * 2. 微任务  p: Promise { <pending> }
 * 3. 第二轮同步打印  【第一轮r只是Promise.resolve()】 executing有两个元素了  race: Promise { <pending> } [ Promise { <pending> }, Promise { <pending> } ]
 * 4. 同步代码 all: Promise { <pending> } [ Promise { <pending> }, Promise { <pending> } ] Promise { <pending> } [ Promise { <pending> }, Promise { <pending> } ]
 * 5. 微任务 p: Promise { <pending> }
 * 6. 微任务 r.then()是等Promise.race()执行完了一个e并打印  e: Promise { <pending> } 0   此刻r是fulfilled，值为splice返回的数组。
 *    e是闭包，所以跟着r.then()一起变为数组，而在其闭包更新前，executing已经splice掉了还是pending的它，也就是竞速中完成的e。
 */
function asyncPool(poolLimit, array, iteratorFn) {
  let i = 0;
  const ret = [];
  const executing = [];
  const enqueue = function () {
    // 边界处理，array为空数组
    if (i === array.length) {
      return Promise.resolve();
    }
    // 每调一次enqueue，初始化一个promise
    const item = array[i++];
    // then是异步
    const p = Promise.resolve().then(() => {
      console.log('p:', p);
      return iteratorFn(item, array);
      // return item;
    });
    // 放入promises数组
    ret.push(p);
    // promise执行完毕，从executing数组中删除
    const e = p
      .then(() => {
        console.log('e:', e, executing.indexOf(e));
        // splice返回的是数组，是then的回调函数的返回值PromiseResult，所以不改变const e。但是每次push的e是undefined的pending，而非数组。
        // 目的不是改变e，而是删掉对应的executing数组元素！
        return executing.splice(executing.indexOf(e), 1);
      })
      .catch(err => {
        console.log('e:', r, executing);
        return executing.splice(executing.indexOf(e), 1);
      });
    // 插入executing数组，表示正在执行的promise。它的数组元素都是pending undefined，异步等待进入then的回调。
    // executing容量可能会超过poolLimit
    // [[Prototype]]: Promise
    // [[PromiseState]]: "pending"
    // [[PromiseResult]]: undefined
    executing.push(e);

    // 使用Promise.race，每当executing数组中promise数量低于poolLimit，就实例化新的promise并执行
    let r = Promise.resolve();
    if (executing.length >= poolLimit) {
      /**
       * Promise.race同样是将多个Promise实例包装成一个新的Promise实例，但新实例的执行结果与第一个先改变状态的Promise状态保持一致，即如果第一个Promise实例为rejected，那么新实例也为rejected，反之亦如此。
       * 此处race一旦报错，那么就是executing中的e报错，被上面的p.catch捕获并返回一个promise，所以r.then可以正常执行！！！
       * 所以race不用像all一样对reject预处理。
       */
      r = Promise.race(executing);
      console.log('race:', r, executing);
    }
    // 全是pending，因为异步还没结束。
    console.log('all:', p, ret, e, executing);

    // 完成一个后递归，直到遍历完array
    return r.then(() => enqueue());
  };
  // 把ret里剩下的一次执行完。
  return enqueue().then(() => Promise.all(ret.map(r => r.catch(err => err))));
  /**
   * Promise.all在处理多个Promise实例时，如果一个失败，就只能拿到第一个失败的结果，其余成功的结果都无法拿到，那有什么办法能在reject后依旧拿到所有执行结果呢？有，利用catch方法。
   * 首先Promise的状态具有可传递性，其次catch方法在执行后也会返回一个状态为resolved的新Promise实例，所以我们只要将可能reject的Promise实例先catch一遍就可以了，就像做一次状态预加工。
   */
}

const timeout = i => new Promise(resolve => setTimeout(() => resolve(i), i));
asyncPool(2, [4000, 500, 600, 700, 2000, 2000, 2000], timeout).then(res => {
  console.log('res:', res);
});

// try catch 不能捕获异步错误
// 可以把Generator函数称作生成器，调用生成器函数会返回一个迭代器来控制这个生成器执行其代码，在生成器中你可以使用yield关键字，理论上yield可以出现在任何能求值的地方，我们通过迭代器的next方法来确保生成器始终是可控的
/**
 * 每当我们调用 (function * g(){yield 1})().next() 方法时，生成器函数紧跟着上一次进行执行，直到函数碰到 yield 关键字。
yield 关键字会停止函数执行并将 yield 后的值返回作为本次调用 next 函数的 value 进行返回。
同时，如果本次调用 next() 导致生成器函数执行完毕，那么此时 done 会变成 true 表示该函数执行完毕，反之则为 false 。
 */
const f = function* () {
  console.log(1);
  // 注意yield只能出现在Gerenator函数中
  // 如果你将yield写在了回调里，请一定要确认这个回调是一个生成器函数
  yield;
  console.log(2);
};
f().next(); // 1

// async函数在执行时，遇到await会交出“线程”，转而去执行其它任务，且await总是会异步求值。async内部是同步，但是不影响外部。
const ff = async () => {
  console.log(1);
  await '鲨鱼辣椒';
  console.log(3);
};
ff();
console.log(2);
// 1 2 3

// noErrorAwait负责拿到成功或失败的值，并保证永远不会抛出错误！
const noErrorAwait = async f => {
  try {
    const r = await f(); // (A)
    return { flag: true, data: r };
  } catch (e) {
    return { flag: false, data: e };
  }
};

const getInfo = () => {
  const js = noErrorAwait(requestJS); // (B)
  console.log(`吉林-山东的车票未售空，价格是 ${js.data.price} RMB`);
  const sy = noErrorAwait(requestSY); // (C)
  console.log(`山东-云南的车票未售空，价格是 ${sy.data.price} RMB`);
  const yh = noErrorAwait(requestYH); // (D)
  console.log(`云南-海南的车票未售空，价格是 ${yh.data.price} RMB`);
  console.log(`本次旅途共计车费 ${js.price + sy.price + yh.price}`);
};
/**
 * 我们分别为(B)、(C)、(D)所对应的请求函数都套上了一层noErrorAwait，正是由于这种缘故，我们可以在getInfo中始终确保(B)、(C)、(D)下的请求函数不会报错，但致命的问题也随之到来，getInfo会确保请求函数是顺序执行的吗？

仔细看一遍就会发现getInfo是不负责顺序执行的，甚至可能会报错。这是因为noErrorAwait中await关键字的缘故，现在手动执行一下分析原因

调用getInfo
调用noErrorAwait并传递参数requestJS
来到noErrorAwait中，由于noErrorAwait是async函数，所以会返回一个promise对象
执行await f()，这个f就是requestJS，由于requestJS是一个异步任务，所以交出本次“线程”，也就是从(A)跳到(B)的下方，打印js.data.price，结果发现抛出了TypeError
抛出TypeError的原因是因为(B)的变量js是一个初始化状态的promise对象，所以说访问初始化中的数据怎么可能不报错！
那问题来了，noErrorAwait只负责让所有的请求函数都不抛出错误，但它并不能确保所有请求函数是按顺序执行的，如何才能让它们按照顺序执行呢？

难不成又要把getInfo变回async函数，然后再通过await noErrorAwait(...)的形式来确保所有请求函数是按照顺序执行的，果然鱼与熊掌不可得兼，如果真的使用这种方式，那await noErrorAwait(...)如果抛出了错误，谁来捕获呢？总不能在它外面再套一层noErrorAwait吧。
Generator，由于生成器是可控的，我只需要在上一次请求完成时，调用next发起下一次请求，这不就可以解决了吗，确实是不错的想法，现在来试试
 */
{
  const noErrorAwait = async f => {
    try {
      const r = await f();
      generator.next({
        flag: true,
        data: r,
      });
    } catch (e) {
      return {
        flag: false,
        data: e,
      };
    }
  };

  const getInfo = function* () {
    const js = yield noErrorAwait(requestJS);
    console.log(`吉林-山东的车票未售空，价格是 ${js.data.price} RMB`);
    const sy = yield noErrorAwait(requestSY);
    console.log(`山东-云南的车票未售空，价格是 ${sy.data.price} RMB`);
    const yh = yield noErrorAwait(requestYH);
    console.log(`云南-海南的车票未售空，价格是 ${yh.data.price} RMB`);
    console.log(`本次旅途共计车费 ${js.data.price + sy.data.price + yh.data.price}`);
  };

  const generator = getInfo();
  generator.next();
}
/**
 * 当noErrorAwait感知到请求函数成功时，会调用next，从而推动嵌套请求的发起，而且也不用担心生成器在什么时候执行完，因为一个noErrorAwait总会对应着一次next，这样一来getInfo就差不多已经在掌控之中了，但有个致命的问题就是：noErrorAwait感知到错误时，应该如何处理？

如果继续调用next，那就与不用生成器没有区别了，因为始终都会顺序执行，解决办法就是传递一个函数，在noErrorAwait感知到错误时调用该函数，并且把出错的请求函数之前的所有请求结果全部传递进去，这样当这个回调执行时，便代表某一个请求函数抛出了错误
 */
{
  // 存储每次的请求结果
  const result = [];
  // 失败的回调(不要关心callback定义在哪里，以及如何传递)
  const callback = (...args) => console.log('某个请求出错了，前面收到的结果是', ...args); // (A)
  const noErrorAwait = async f => {
    try {
      const r = await f();
      const args = { flag: true, data: r };
      result.push(args);
      generator.next(args);
    } catch (e) {
      const args = { flag: false, data: e };
      result.push(args);
      callback(result);
      return args;
    }
  };
}

// 封装
{
  // 查询 吉林-山东 的车票是否已售空的接口
  const requestJS = () =>
    new Promise((res, rej) => {
      setTimeout(() => {
        // 请求成功(resolve)则代表车票未售空
        if (interface[0])
          return res({
            ticket: true,
            price: 530,
            destination: '吉林-山东',
          });
        // 请求成功(rejected)则代表车票已售空
        rej({
          ticket: false,
          destination: '吉林-山东',
        });
      }, 1000);
    });
  // 查询 山东-云南 的车票是否已售空的接口
  const requestSY = () =>
    new Promise((res, rej) => {
      setTimeout(() => {
        if (interface[1])
          return res({
            ticket: true,
            price: 820,
            destination: '山东-云南',
          });
        rej({
          ticket: false,
          destination: '山东-云南',
        });
      }, 1500);
    });
  // 查询 云南-海南 的车票是否已售空的接口
  const requestYH = () =>
    new Promise((res, rej) => {
      setTimeout(() => {
        if (interface[2])
          return res({
            ticket: true,
            price: 1500,
            destination: '云南-海南',
          });
        rej({
          ticket: false,
          destination: '云南-海南',
        });
      }, 2000);
    });

  const getInfo = [requestJS, requestSY, requestYH];

  const combineAsyncError = tasks => {
    const doGlide = {
      // 生成器节点
      node: null,
      // 结束请求函数的执行
      out: null,
      // 表示执行的次数
      times: 0,
      // data为返回的最终数据
      data: {
        result: [],
        error: null,
      },
    };
    const noErrorAwait = async f => {
      try {
        // 执行请求函数
        const r = await f();
        // 追加数据
        doGlide.data.result.push({
          flag: true,
          data: r,
        });
        // 请求成功时继续执行生成器
        doGlide.node.next();
      } catch (e) {
        doGlide.data.error = e;
        // 当某个请求函数失败时，立即终止函数执行并返回数据
        doGlide.out(doGlide.data);
      }
    };
    const handler = res => {
      doGlide.out = res;
      // 预先定义好生成器，自执行
      doGlide.node = (function* () {
        const { out, data } = doGlide;
        const len = tasks.length;
        // yield把循环带回了JavaScript编程的世界
        while (doGlide.times < len) yield noErrorAwait(tasks[doGlide.times++]);
        // 全部请求成功(生成器执行完毕)时，返回数据
        out(data);
      })();
      doGlide.node.next();
    };
    // 当调用res方法时，会通知当前的Promise实例去执行它的then方法，而res也正是杀手锏，只需在请求失败或全部请求成功时调用res，这样then就会知道嵌套请求的逻辑执行完毕
    return new Promise(res => handler(res));
  };
  combineAsyncError(getInfo).then(data => {
    console.log('请求结果为：', data);
  });
}

/**
 * 生成器函数具有可暂停的特点，当调用生成器函数后会返回一个生成器对象。每次调用生成器对象的 next 方法，生成器函数才会继续往下执行直到碰到下一个 yield 语句，同时每次调用生成器对象的 next(param) 方法时，我们可以传入一个参数作为上一次 yield 语句的返回值。
 */
{
  function promise1() {
    return new Promise(resolve => {
      setTimeout(() => {
        resolve('1');
      }, 1000);
    });
  }

  function promise2(value) {
    return new Promise(resolve => {
      setTimeout(() => {
        resolve('value:' + value);
      }, 1000);
    });
  }

  function* readFile() {
    const value = yield promise1();
    const result = yield promise2(value);
    return result;
  }

  function asyncGen(fn) {
    const g = fn(); // 调用传入的生成器函数 返回生成器对象
    // 期望返回一个Promise
    return new Promise(resolve => {
      // 首次调用 g.next() 方法，会执行生成器函数直到碰到第一个yield关键字
      // 这里会执行到 yield promise1() 同时将 promise1() 返回为迭代器对象的 value 值
      const { value, done } = g.next();
      // 因为value为Promise 所以可以等待promise完成后，在then函数中继续调用 g.next(res) 恢复生成器函数继续执行
      value.then(res => {
        // 同时第二次调用g.next() 时是在上一次返回的promise.then中
        // 我们可以拿到上一次Promise的value值也就是 '1'
        // 传入g.next('1') 作为上一次yield的值 这里相当于 const value = '1'
        const { value, done } = g.next(res);
        // 同理，继续上述过程
        value.then(resolve);
      });
    });
  }

  asyncGen(readFile).then(res => console.log(res)); // value: 1
}

// 封装
{
  function co(gen) {
    return new Promise((resolve, reject) => {
      const g = gen();
      function next(param) {
        const { done, value } = g.next(param);
        if (!done) {
          // 未完成 继续递归
          Promise.resolve(value).then(res => next(res));
        } else {
          // 完成直接重置 Promise 状态
          resolve(value);
        }
      }
      next();
    });
  }
  co(readFile).then(res => console.log(res));
}
// 所谓 Async 其实就是将 Generator 包裹了一层 co 函数，所以它被称为 Generator 和 Promise 的语法糖。
