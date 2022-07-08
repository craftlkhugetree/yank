// CJS mod.js
function foo() {}
function bar() {}
module.exports = foo;
module.exports.bar = bar; // foo.bar === bar
