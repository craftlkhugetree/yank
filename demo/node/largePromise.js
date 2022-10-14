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
    });
    // 放入promises数组
    ret.push(p);
    // promise执行完毕，从executing数组中删除
    const e = p.then(() => {
      console.log('e:', e, executing.indexOf(e));
      // splice返回的是数组，是then的回调函数的返回值PromiseResult，所以不改变const e。但是每次push的e是undefined的pending，而非数组。
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
      r = Promise.race(executing);
      console.log('race:', r, executing);
    }
    // 全是pending，因为异步还没结束。
    console.log('all:', p, ret, e, executing);

    // 完成一个后递归，直到遍历完array
    return r.then(() => enqueue());
  };
  // 把ret里剩下的一次执行完。
  return enqueue().then(() => Promise.all(ret));
}

const timeout = i => new Promise(resolve => setTimeout(() => resolve(i), i));
asyncPool(2, [4000, 500, 600, 700, 2000, 2000, 2000], timeout).then(res => {
// asyncPool(2, [1000, 2000, 3000, 4000, 500, 600, 700, 2000, 2000, 2000], timeout).then(res => {
  console.log('res:', res);
});

// function promiseLimit(pArr, limit) {
//   let pool = [];

//   function add() {
//     let item = pArr.shift();
//     pool.push(item);
//   }

//   function run() {
//     if (pArr.length === 0) return;
//     let done = Promise.race(pool);
//     done.then(res => {
//       pool.splice(pool.indexOf(done), 1);
//       add();
//     });
//     run();
//   }

//   while (pool.length < limit) {
//     add();
//   }
//   run();
// }
