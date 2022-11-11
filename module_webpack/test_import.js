module.exports.add = 99;
exports.default = 100;
//test.js文件
let test = require("./test");
let importTest = import("./test").then(res => {
    console.log("promise:", res);
    resolve(res)
})
// let p = test.add;
// let b = test;
// console.log("p的值是：" + p, exports.default);
// console.log("b的值是：" + b);
console.log(test, importTest);