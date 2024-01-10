// const { exec, execFile, spawn } = require('child_process');

// const args = process.argv;
// const arg1 = args[2];
// console.log('arg1:', arg1);
// let pwd = `/d/yank/com/jszx.sh`;
// // let pwd = `/d/yank/z-testbuild.sh`;
// let pwd2 = '/d/kxiangmu/njauLogistics/fuwujiandu/xnzz-jszx/';
// // pwd = pwd.replace('/d', 'd:');
// // pwd = pwd.replace(/\//g, '\\');

// // process.chdir(pwd);

// // let currentDir = process.cwd();
// // console.log(`切换后的工作目录：${currentDir}`, process.argv);
// let ids = '1111';

// exec(`sh ${pwd}`, (error, stdout, stderr) => {
//   // exec(`sh pwd ${ids}`, (error, stdout, stderr) => {
//   if (error) {
//     console.error(`exec error: ${error}`);
//     return;
//   }
//   let echo = (stdout && stdout.split(/\n/)) || [];
//   let len = echo.length;
//   console.log(`stdout:\n ${stdout}`, echo, len);
//   console.log(`stderr:\n ${stderr}`);
// });
// // process.exit(pwd2)
// return pwd2


const fs = require('fs');
const cacheFilePath = 'D:\\yank\\puppeteer\\tmp.txt';
// fs.writeFile(cacheFilePath, '123123kljldskjafklasdjfkl', () => {});
// fs.writeFile(cacheFilePath, 'yyyyy', () => {});
fs.writeFile(cacheFilePath, 'z', () => {});