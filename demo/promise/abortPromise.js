/**https://mp.weixin.qq.com/s/1GwujtRCnlYKIHBC7vdOtA
 * 自定义的可以主动取消的 Promise
  首先我们自定义了 myCoolPromise 这个函数，然后函数接收一个非必传的 signal 对象；然后立即返回一个新构建的 Promise，这个 Promise 的内部我们添加了一些额外的处理。首先我们判断了 signal 是否存在，如果存在就调用它的 throwIfAborted 方法。因为有可能这个时候 signal 的状态已经是终止的状态了，需要立即将 Promise 的状态变更为 rejected 状态。
 */

function myCoolPromise({ signal }) {
  return new Promise((resolve, reject) => {
    // 如果刚开始 signal 存在并且是终止的状态可以直接抛出异常
    signal?.throwIfAborted();

    // 异步的操作，这里使用 setTimeout 模拟
    setTimeout(() => {
      Math.random() > 0.5 ? resolve('ok') : reject(new Error('not good'));
    }, 1000);

    // 添加 abort 事件监听，一旦 signal 状态改变就将 Promise 的状态改变为 rejected
    signal?.addEventListener('abort', () => reject(signal?.reason));
  });
}

/**
 * 使用自定义可取消的 Promise
 */

const ac = new AbortController();
const { signal } = ac;

myCoolPromise({ signal }).then(
  res => console.log(res),
  err => console.warn(err)
);
setTimeout(() => {
  ac.abort();
}, 100); // 可以更改时间看不同的结果

// 使用 AbortSignal 来同时取消很多事件的事件监听函数。
{
  const evtBtn = document.querySelector('.event');
  const cancelBtn = document.querySelector('.cancel');

  const evtHandler = e => console.log(e);
  const mdHandler = e => console.log(e);
  const muHandler = e => console.log(e);

  const ac = new AbortController();
  const { signal } = ac;

  evtBtn.addEventListener('click', evtHandler, { signal });
  evtBtn.addEventListener('mousedown', mdHandler, { signal });
  evtBtn.addEventListener('mouseup', muHandler, { signal });

  // 点击 cancelBtn 移除 evtBtn 按钮的 click 事件监听
  cancelBtn.addEventListener('click', function () {
    ac.abort();
  });
}
