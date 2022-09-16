async function stringPromise() {
  let tmp = await new Promise(resolve => {
    resolve('st');
  });
  //   return 'string promise';
  return tmp;
}

console.log(stringPromise());

const fs = require('fs');
fs.readFile('./flex.html', 'utf-8', (err, data) => {
  console.log(data, err);
});
var res = fs.readFileSync('jsonp.html', 'utf-8')
console.log(res);
console.log('end');
