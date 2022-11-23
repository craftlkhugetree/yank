/**
 * Puppeteer 是 Node.js 工具引擎
Puppeteer 提供了一系列 API，通过 Chrome DevTools Protocol 协议控制 Chromium/Chrome 浏览器的行为
Puppeteer 默认情况下是以 headless 启动 Chrome 的，也可以通过参数控制启动有界面的 Chrome
 */
// const puppeteer = require('puppeteer');
const cheerio = require('cheerio');
const axios = require('axios');
const fs = require('fs');

/**
 * 公共请求链接方法
 * @param url 请求链接后缀（例：https://www.baidu.com/zhangsan/111 中 /张三/111 是后缀）
 */
const getPage = async url => {
  //请求链接
  const { data } = await axios.get(`https://www.9biquge.com${url}`, {
    headers: {
      'user-agent':
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/99.0.4844.51 Safari/537.36 Edg/99.0.1150.36',
    },
  });
  //返回请求结果
  return data;
  // console.log('抓取网页成功')
};

//主方法
const main = async () => {
  //请求小说章节列表（找那种所有章节都在一个目录下的页面，如果有翻页的话比较麻烦）
  const pageData = await getPage('/25/25538/');
  //转换页面数据变为节点
  const $ = cheerio.load(pageData);
  //获取到所有章节标题节点（可通过f12查看）
  const $list = $('#list dd a');
  //查看有多少章
  console.log('list:', $list.length);

  //开始循环标题节点
  for (let i = 0; i < $list.length; i++) {
    //拿到标题节点中的页面链接并请求数据（这里可以灵活获取，只要能拿到就行，拿到之后看一下数据是什么样的，完整的还是只有后缀，我这里是只有后缀的）
    const pageItemData = await getPage($list[i].attribs.href);
    //同样转化为节点
    const $$ = cheerio.load(pageItemData);
    //获取所有文本数据，我这里是一行行进行处理，因为前后中间都有空格，所以我处理一下，不然到时候排版我不喜欢
    let datailText = '';
    for (let j = 0; j < $$('.content_detail').length; j++) {
      datailText += $$('.content_detail')[j].children[0].data.replace(/\s/g, '') + '\n';
    }
    var filename = './我一个史莱姆.txt';
    checkFile(filename);
    //写入文件，文件需要新建好，就在项目根目录下下面新建，这里需要替换文件名
    fs.appendFileSync(filename, '\n\n' + $$('.bookname h1').text() + '\n\n' + datailText);
    console.log($$('.bookname h1').text());
    //睡眠一秒钟，防止请求频繁被封ip
    await sleep(1000);
  }
};

/*
休眠函数sleep
调用 await sleep(1500)
 */
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function checkFile(path, type = 'file') {
  var flag = fs.existsSync(path);
  if (!flag) {
    if (type === 'file') {
      fs.appendFileSync(path, '');
    } else {
      fs.mkdirSync(path, { recursive: true }, err => {
        if (err) throw err;
      }); //Create dir in case not found
    }
  }
}

main();
