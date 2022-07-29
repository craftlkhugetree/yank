(function(modules) {
  function require(id) {
    const [fn, mapping] = modules[id];

    function localRequire(name) {
      return require(mapping[name]); 
    }

    const module = { exports: {} };

    fn(localRequire, module, module.exports);

    return module.exports;
  }

  require(0);
})({
  0: [
    function(require, module, exports) {
      'use strict';

      var _message = require('./message.js');

      var _message2 = _interopRequireDefault(_message);

      function _interopRequireDefault(obj) {
// 根据__esModule来判断是否需要手动增加default属性。
        return obj && obj.__esModule ? obj : { default: obj };
      }

//       *require引入的对象本质上是module.exports*
// import [任意名称] 引入的是module.exports.default； import * 引入的是module.exports,其中包括default
      console.log(_message2.default);
    },
    { './message.js': 1 },
  ],
  1: [
    function(require, module, exports) {
      'use strict';

      Object.defineProperty(exports, '__esModule', {
        value: true,
      });

      var _name = require('./name.js');

      exports.default = 'hello ' + _name.name + '!';
    },
    { './name.js': 2 },
  ],
  2: [
    function(require, module, exports) {
      'use strict';

      Object.defineProperty(exports, '__esModule', {
        value: true,
      });
      var name = (exports.name = 'world');
    },
    {},
  ],
});
