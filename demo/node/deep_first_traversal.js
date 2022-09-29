// function mul(n) {
//     if(n <= 1) return 1

//     return n * arguments.callee(n - 1)}

// mul(9)

// function mul(...rest) {
//     if(rest <= 1) return 1

//     return rest * rest.callee(rest - 1)}

// mul(9)

var tree = {
  name: '电脑',
  children: [
    {
      name: 'F盘',
      children: [
        {
          name: '照片',
          children: [],
        },
        {
          name: '文件',
          children: [
            {
              name: '工作文件',
              children: [
                {
                  name: '报告',
                  children: [],
                },
              ],
            },
          ],
        },
        {
          name: 123,
        },
      ],
    },
    {
      name: 'E盘',
      children: [
        {
          name: '视频',
          children: [
            {
              name: 'js教程',
              children: [],
            },
          ],
        },
      ],
    },
  ],
};
// 深度优先的非递归遍历
function deepTraversal(root = {}, cb) {
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
deepTraversal(tree, function (node) {
  console.log(node.name);
});

console.log(tree, require('os').cpus().length);
