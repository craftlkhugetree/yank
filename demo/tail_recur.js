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
fact(5000)
console.log((Date.now() - start) / 1000);
start = Date.now();
tailFact(5000)
console.log((Date.now() - start) / 1000);