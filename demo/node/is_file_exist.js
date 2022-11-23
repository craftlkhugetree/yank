/**
 * __dirname 表示当前文件所在文件夹的的路径，不包含自身的文件名
比如/src/test.js 在test.js里面log出的__dirname是/src

__filename 表示当前文件所在的路径，包含自身的文件名

process.cwd()启动命令的路径，一般是项目根目录，表示你这个node xxxxxx.js是在哪个目录下执行的

process.execPath 表示nodejs的安装路径，windows一般是c盘
 */
var fs = require('fs');
const dirCache = {};
writeFileByUser('./data/17/1017.md');

function writeFileByUser(filePath) {
  if (fs.existsSync(filePath)) {
    console.log('该路径已存在');
  } else {
    console.log('该路径不存在');
    mkdir(filePath);
  }

  var data = '\n hello world';
  fs.statSync('./com', function (err, stat) {
    if (err) console.log(err);
    else {
      console.log(stat);
    }
  });
  //   该方法以异步的方式将 data 插入到文件里，如果文件不存在会自动创建。data可以是任意字符串或者缓存。
  fs.appendFile(filePath, data, 'utf8', function (err) {
    if (err) {
      console.log(err);
    } else {
      console.log('appendFile 成功了');
    }
  });
}

function mkdir(filePath) {
  const arr = filePath.split('/');
  let dir = arr[0];
  for (let i = 1; i < arr.length; i++) {
    if (!dirCache[dir] && !fs.existsSync(dir)) {
      dirCache[dir] = true;
      fs.mkdirSync(dir);
    }
    dir = dir + '/' + arr[i];
  }
  console.log(filePath + '新建成功');
}

// 传入文件夹的路径看是否存在，存在不用管，不存在则直接创建文件夹
/**
 * 判断文件夹是否存在，不存在可以直接创建
 * @param reaPath {String} 文件路径
 * @returns {Promise<boolean>}
 */
exports.exitsFolder = async function (reaPath) {
  const absPath = path.resolve(__dirname, reaPath);
  try {
    await fs.promises.stat(absPath);
  } catch (e) {
    // 不存在文件夹，直接创建 {recursive: true} 这个配置项是配置自动创建多个文件夹
    await fs.promises.mkdir(absPath, { recursive: true });
  }
};

exports.exitsFolder = async function (reaPath) {
  const absPath = path.resolve(__dirname, reaPath);

  fs.stat(absPath, function (err, stats) {
    if (!stats) {
      fs.mkdir(absPath, { recursive: true }, err => {
        if (err) throw err;
      }); //Create dir in case not found
    }
  });
};
