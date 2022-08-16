function myStack() {
  this.data = {};
  this.top = 0;
}

myStack.prototype = {
  push: function (ele) {
    this.data[this.top++] = ele;
  },
  pop: function () {
    var delData = this.data[--this.top];
    delete this.data[this.top];
    return delData;
  },
  length: function () {
    return this.top;
  },
  //   length: this.top,
};

function reverseStr(str) {
  if (!str) return;
  var st = new myStack();
  var arr = str.split('');
  arr.forEach(a => {
    // 量筒，栈，先入后出
    st.push(a);
  });
  var res = '';
  var len = st.length();
  // for循环的i < st.length()一直在变化，必须在前面先固定住len值。
  //   for (var i = 0; i < st.length(); i++) {
  for (var i = 0; i < len; i++) {
      res += st.pop();
      console.log(st.data, st.length(), st.top);
  }
  return res;
}

var str = 'asdfghjkl';
console.log(reverseStr(str));
