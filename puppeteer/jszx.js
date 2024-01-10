const puppeteer = require('puppeteer');
// const { exec } = require('child_process');
// const clipboardy = require('clipboardy');
const fs = require('fs');

const args = process.argv;
const arg1 = args[2];
// console.log('arg1:', arg1);
const configs = [
  {
    userName: 'hq1',
    pwd: '123',
    // sh: `../com/jszx.sh`,
    sh: `/d/yank/com/jszx.sh`,
    url: 'http://app.dev.angke.com.cn/idsweb/rest/Auth2/authorize?response_type=code&client_id=20230703&state=53753f874a8040149a51283a2da7440f&redirect_uri=http://app.dev.angke.com.cn/hq-jszx/rest/Idsclient/reqLogin?reqUrl=http://app.dev.angke.com.cn/jszxweb/',
  },
];
let form = (arg1 && configs.find(c => c.sh.indexOf(arg1) > -1)) || configs[0];

const sleep = (time = 1000) =>
  new Promise(resolve => {
    setTimeout(resolve, time);
  });

const cacheFilePath = 'D:\\yank\\puppeteer\\tmp';
const exeBash = ids => {
  // can't use source in child_process
  //   exec(`sh ${form.sh} ${ids}`, (error, stdout, stderr) => {
  //     if (error) {
  //       console.error(`exec error: ${error}`);
  //       return;
  //     }
  //     let echo = (stdout && stdout.split(/\n/)) || [];
  //     let len = echo.length;
  //     console.log(`stdout:\n ${stdout}`, echo, len);
  //     console.log(`stderr:\n ${stderr}`);
  //     let pwd = '';
  //     for (let i = len - 1; i >= 0; i--) {
  //       if (echo[i]) {
  //         pwd = echo[i];
  //         break;
  //       }
  //     }
  //     // 将文本复制到剪贴板
  //     clipboardy.write(pwd, err => {
  //       if (err) {
  //         console.error('复制失败:', err);
  //       } else {
  //         console.log('复制成功');
  //       }
  //     });
  //   });
  fs.writeFile(cacheFilePath, ids, () => {});
};

const launch = async url => {
  const browser = await puppeteer.launch({
    headless: false, //无头模式，默认是隐藏界面的,true.改成false,显示界面。
    slowMo: 100, //设置浏览器每一步之间的时间间隔，单位毫秒
    // defaultViewport: { width: 1790, height: 768 }, //默认的网页大小是800*800，可以自行设置
    // args: [`--window-size=1790,768`]
    defaultViewport: null,
    //   args: [
    //     '--disable-web-security',
    //     '--disable-features=IsolateOrigins,site-per-process',
    // ]
    // args: ['--start-fullscreen'] // 铺满整个屏幕
    args: ['--start-maximized'], // 最大化
  });

  const page = await browser.newPage();

  await page.goto(url);
  await sleep(2000);
  //   await page.evaluate(_ => {
  //     let b = $('body');
  //     // let b = document.querySelector('body')
  //     // var x = b.scrollWidth; //获取页面最大宽度
  //     b.scrollLeft = 800; //设置滚动条最左方位置
  //   });
  //   return;

  //   const LOGINNAME = await page.$('[name="LOGINNAME"]');
  //   const r = await page.$eval('input[name="LOGINNAME"]', ({ value }) => {
  //     value = 'hq1';
  //   });
  //   console.log(LOGINNAME, r);

  const username_input = await page.$('input[name="LOGINNAME"]');
  await username_input.type(form.userName);

  const password_input = await page.$('input[name="PASSWORD"]');
  await password_input.type(form.pwd);

  const readline = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  let yzm = await new Promise(r => {
    readline.question(`What's your YZM?`, y => {
      console.log(new Date().toLocaleString('cn', { hour12: false }), `【${y}】`);
      r(y);
      readline.close();
    });
  });
  const yzmDom = await page.$('input[name="YZM"]');
  await yzmDom.type(yzm);

  const submit_button = await page.$('div.loginarea>div.submit');
  await submit_button.click();
  await sleep(1000);

  const cookies = (await page.cookies()) || [];
  const idsObj = cookies.find(k => k.name === 'IDSTGC') || {};
  console.log(idsObj.value);

  if (idsObj.value) {
    exeBash(idsObj.value);
  }
  //   await page.screenshot({ path: 'shanzhi_login_index.png' });

  await browser.close();
};

launch(form.url);

const getHtml = async ({ userAgent, onRequest, url }) => {
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  }); // 启动无头浏览器

  const page = await browser.newPage();
  await page.setViewport({ width: 1375, height: 812 });
  if (userAgent) await page.setUserAgent(userAgent);
  // 页面实例上下文中执行的方法
  await page.evaluateOnNewDocument(() => (window['_prerender_'] = 'prerender'));
  // 启用请求拦截器
  await page.setRequestInterception(true);
  // 监听请求
  page.on('request', request => onRequest?.({ request, pageUrl: url, page }));

  await page.goto(url);
  // 页面实例上下文中执行的方法
  await page.evaluate(observeRender); // 默认5000ms页面加载完成
  const content = await page.content();
  await page.close();
  return content;
};
