let arr = [
  { id: 1, name: '部门1', pid: 0 },
  { id: 2, name: '部门2', pid: 1 },
  { id: 3, name: '部门3', pid: 1 },
  { id: 4, name: '部门4', pid: 3 },
  { id: 5, name: '部门5', pid: 4 },
];

function arrayToTree(items) {
  const result = []; // 存放结果集
  const itemMap = {}; //
  for (const item of items) {
    const id = item.id;
    const pid = item.pid;

    if (!itemMap[id]) {
      itemMap[id] = {
        children: [],
      };
    }

    itemMap[id] = {
      ...item,
      children: itemMap[id]['children'],
    };

    const treeItem = itemMap[id];

    if (pid === 0) {
      result.push(treeItem);
    } else {
      if (!itemMap[pid]) {
        itemMap[pid] = {
          children: [],
        };
      }
      itemMap[pid].children.push(treeItem);
    }
  }
  return result;
}

console.log(arrayToTree(arr))


/**
 * 递归查找，获取children。该实现的时间复杂度为O(2^n),最高！
 */
const getChildren = (data, result, pid) => {
  for (const item of data) {
    if (item.pid === pid) {
      const newItem = {...item, children: []};
      result.push(newItem);
      getChildren(data, newItem.children, item.id);
    }
  }
}

/**
* 转换方法
*/
const arrayToTree_cur = (data, pid) => {
  const result = [];
  getChildren(data, result, pid)
  return result;
}

// 给定一个只包括 '('，')'，'{'，'}'，'['，']' 的字符串 s ，判断字符串是否有效。
const isValid = (s) => {
  // 空字符串符合条件
  if (!s) {
    return true
  }

  const leftToRight = {
    '(': ')',
    '[': ']',
    '{': '}'
  }
  const stack = []

  for (let i = 0, len = s.length; i < len; i++) {
    const ch = s[i]
    // 左括号
    if (leftToRight[ch]) {
      stack.push(ch)
    } else {
      // 右括号开始匹配
      // 1. 如果栈内没有左括号，直接false
      // 2. 有数据但是栈顶元素不是当前的右括号
      if (!stack.length || leftToRight[ stack.pop() ] !== ch) {
        return false
      }
    }
  }

  // 最后检查栈内还有没有元素，有说明还有未匹配则不符合
  return !stack.length
}

const isValid_centerErase = (s) => {
  while (true) {
    // 每次都重新赋值len
    let len = s.length
    // 将字符串按照匹配对，挨个替换为''
    s = s.replace('{}', '').replace('[]', '').replace('()', '')
    // 有两种情况s.length会等于len
    // 1. s匹配完了，变成了空字符串
    // 2. s无法继续匹配，导致其长度和一开始的len一样，比如({],一开始len是3，匹配完还是3，说明不用继续匹配了，结果就是false
    if (s.length === len) {
      return len === 0
    }
  }
}
