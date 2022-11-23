// npm下载模块后，引入cheerio模块
let cheerio = require('cheerio');
// 引入fs文件模块，帮助爬取的页面写入文件里面
let fs = require('fs');
// 引入请求模块
let request = require('request');

// cheerio模块操作本地的现有的HTML页面的DOM节点，进而通过节点进行筛查获取信息
request('http://book.zongheng.com/showchapter/1215587.html', (err, res, body) => {
  if (err) return false; //如果请求报错就退出

  // 类似于jquery选择器返回$，
  // Cheerio的选择器实现与jQuery几乎相同，因此API非常相似。
  let $ = cheerio.load(body);
  // 通过$这个选择器，选择我们爬取内容所在的节点
  // return false相当于break ; return true相当于continue
  // 根据上图选择对应的节点获取每一章的链接
  $('.col-4 a').each(function (index) {
    if (index > 100) {
      return false; //break,当小说章节达到100章则退出循环
    }
    // 这里的this等于$获取的a节点,同prop方法捕获a节点中的href属性内容
    let strurl = $(this).prop('href');
    // 判断页面链接是否存在
    if (strurl) {
      // 调用获取小说内容的函数
      getNoveltext(strurl, index);
    }
  });
});

// 获取小说内容的函数
function getNoveltext(url, index) {
  // 通过传入每一章节小说内容的链接，获取小说的内容
  request(url, (err, res, body) => {
    if (err) return false; //如果请求报错就退出
    let $ = cheerio.load(body); //获取Cheerio的选择器
    // 获取每一章的标题
    let strtext = $('.title .title_txtbox').text() + '\n\r'; // 进行换行
    // 获取文字内容
    $('.content p').each((index, el) => {
      strtext += $(el).text() + '\r';
    });
    var dir = './fiction';
    checkFile(dir, 'dir')
    // 通过fs文件模块将小说内容异步写入text文档，这里必须新建fiction的文件夹
    fs.writeFileSync(`${dir}/page${index + 1}.txt`, strtext);
  });
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
