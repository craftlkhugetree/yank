// The require function
function __webpack_require__(moduleId) {
  // 检测是否存在缓存
  if (installedModules[moduleId]) {
    return installedModules[moduleId].exports;
  }
  // 不存在则生成新的模块
  var module = (installedModules[moduleId] = {
    i: moduleId,
    l: false, // 是否加载
    exports: {},
  });

  // call的方式加载模块 this转交，参数转交，对应其打包构建好的每个模块的参数结构。
  modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

  // 表示已加载
  module.l = true;

  // 返回模块的exports
  return module.exports;
}

以下是__webpack_require__各属性以及对应能力，会经常出现在加载模块的语法中，可以帮助我们加深对__webpack_require__的理解。


// 入口模块的ID
__webpack_require__.s = the module id of the entry point
 
// 模块缓存对象 {} id:{ exports /id/loaded}
__webpack_require__.c = the module cache
 
// 所有构建生成的模块 []
__webpack_require__.m = the module functions
 
// 公共路径，为所有资源指定一个基础路径
__webpack_require__.p = the bundle public path
// 
__webpack_require__.i = the identity function used for harmony imports
 
// 异步模块加载函数，如果没有再缓存模块中 则用jsonscriptsrc 加载  
__webpack_require__.e = the chunk ensure function
 
// 设定getter 辅助函数而已
__webpack_require__.d = the exported property define getter function
 
// 辅助函数而已 Object.prototype.hasOwnProperty.call
__webpack_require__.o = Object.prototype.hasOwnProperty.call
 
// 给exports设定attr __esModule
__webpack_require__.r = define compatibility on export
 
// 用于取值，伪造namespace
__webpack_require__.t = create a fake namespace object
 
// 用于兼容性取值（esmodule 取default， 非esmodule 直接返回module)
__webpack_require__.n = compatibility get default export
 
// hash
__webpack_require__.h = the webpack hash
 
// 
__webpack_require__.w = an object containing all installed WebAssembly.Instance export objects keyed by module id
 
// 异步加载失败处理函数 辅助函数而已
__webpack_require__.oe = the uncaught error handler for the webpack runtime
 
// 表明脚本需要安全加载 CSP策略
__webpack_require__.nc = the script nonce
 