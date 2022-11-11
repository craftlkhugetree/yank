// node tail_recur.js --harmony --harmony_tailcalls --use-strict
// recursion.js
function fact(n) {
  if (n == 0) {
    console.log('fact: ');
    console.dir(process.memoryUsage());
    return 1
  }
  // 这不是递归的尾部调用，因为当前堆栈在计算递归调用时仍需要记住n，这样它才能知道要相乘的数字。
  return n * fact(n - 1);
}
// tail_recursion.js
function tailFact(n, p) {
  p = p || 1;
  if (n == 0) {
    console.log('tail fact: ');
    console.dir(process.memoryUsage());
    return p;
  } else {
    // propagate next result through tail-recursive calls
    return tailFact(n - 1, p * n);
  }
}
// 特定代码中，可以通过使用while循环进行重写来完全避免递归
function fac(n) {
  var total = 1;
  while (n > 1) {
    total *= n--;
  }
  return total;
}

var start = Date.now();
fact(5000);
console.log((Date.now() - start) / 1000);
start = Date.now();
tailFact(5000);
console.log((Date.now() - start) / 1000);

/**
 * 函数最后一行虽然是一个函数调用，然后并未返回
 * funA函数会等funB执行完毕后才算执行完毕，才能被推出栈。
 * 所以不是尾调用
 */
function funA() {
  funB();
}

var curry = function (fn, sum) {
  return function (n) {
    return fn.call(fn, n, sum);
  };
};
var curryFactorial = curry(tailFact, 1);  // 默认值1被柯里化固定住，从而不必反复写
console.log('柯里化：', curryFactorial(5)); // 120复制代码

// 深度优先的非递归遍历
function deepTraversal(root, cb) {
  if (!root) return;
  cb && typeof cb === 'function' && cb(root);
  while (root.children && root.children.length) {
    var node = root.children.shift();
    cb && typeof cb === 'function' && cb(node);
    while (node && node.children && node.children.length) {
      root.children.unshift(node.children.pop());
    }
  }
}
// 调用，输出每一项的name值
deepTraversal(tree = {}, function (node) {
  console.log(node.name);
});

// 深度优先的递归遍历
function deepTraversal(root, cb) {
  if (!root) return;
  cb && typeof cb === 'function' && cb(root);
  if (root.children && root.children.length) {
    var i = 0,
      node;
    for (; (node = root.children[i++]); ) {
      deepTraversal(node, cb);
    }
  }
}
