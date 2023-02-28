const fs = require("fs");
const path = require("path");
const chalk = require("chalk");
// 复杂插件
class DistFilter {
  constructor(options) {
    this.options = options;
  }
  apply(compiler) {
    const _this = this;
    compiler.plugin("after-emit", async function(compiliation, callback) {
      for (let i = 0; i < _this.options.length; i++) {
        let r = _this.options[i];
        let filePath = path.resolve(__dirname, r.assetsPath);
        await fs.readdir(filePath, (err, files) => {
          if (err) {
            console.log(chalk.yellow("读取目录异常\n" + err.message + "\n"));
            return;
          }
          files.forEach(filename => {
            if (r.jsReg.test(filename)) {
              let filedir = path.resolve(filePath, filename);
              fs.readFile(filedir, "utf-8", (err, data) => {
                if (err) {
                  console.log(chalk.yellow("读取文件异常\n" + err.message));
                  return;
                }
                let result = data.replace(/ac5d/gi, "hotline333");
                fs.writeFile(filedir, result, err => {
                  if (err) {
                    console.log(chalk.yellow("文件写入异常\n" + err.message));
                    return;
                  }
                  console.log(chalk.cyan(filename + "文件已写入\n"));
                });
              });
            }
          });
        });
      }
      callback()
    });
  }
}
module.exports = DistFilter;
