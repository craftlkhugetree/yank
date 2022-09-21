// recursion.js
function fact(n) {
  if (n == 0) {
    console.log('fact: ');
    console.dir(process.memoryUsage());
  }
  return n == 0 ? 1 : n * fact(n - 1);
}
// tail_recursion.js
function tailFact(n, p) {
  p = p || 1;
  if (n == 0) {
    console.log('tail fact: ');
    console.dir(process.memoryUsage());
    return p;
  } else {
    return tailFact(n - 1, p * n);
  }
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
