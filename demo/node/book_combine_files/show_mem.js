var os = require('os');
var showMem = function () {
  var mem = process.memoryUsage();
  var format = function (bytes) {
    return (bytes / 1024 / 1024).toFixed(2) + ' MB';
  };
  console.log(
    'Process: heapTotal ' +
      format(mem.heapTotal) +
      ' heapUsed ' +
      format(mem.heapUsed) +
      ' rss ' +
      format(mem.rss)
    //   ' os.totalmen ' +
    //   format(os.totalmen()) +
    //   ' os.freemen ' +
    //   format(os.freemen())
  );
  console.log('-----------------------------------------------------------');
};
var useMem = function () {
  var size = 20 * 1024 * 1024;
  var arr = new Array(size);
  for (var i = 0; i < size; i++) {
    arr[i] = 0;
  }
  return arr;
};
var total = [];
for (var j = 0; j < 15; j++) {
  showMem();
  total.push(useMem());
}
showMem();
