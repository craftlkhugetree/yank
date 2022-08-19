async function stringPromise() {
  let tmp = await new Promise(resolve => {
    resolve('st');
  });
  //   return 'string promise';
  return tmp;
}

console.log(stringPromise());
