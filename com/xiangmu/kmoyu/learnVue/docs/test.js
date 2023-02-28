function Vue() {
    let a = b = 1;
    console.log(this, this instanceof Vue, a, b)
}
new Vue()

let arr4 = [1, 3, 2, 5, 3, 1, 2, 7, 8];
let newArr = arr4.reduce((pre, cur) => {
  if (!pre.includes(cur)) {
    return pre.concat(cur);
  } else {
    return pre;
  }
}, []);
const a = []
console.log(newArr, '数组去重', a.push(5), a.push(6));