// lodash 在当前 script 中使用 import 引入
// import _ from 'lodash';
// import {join} from 'lodash';
import './style.css';
import Icon from './icon.png';
// import printMe from './print.js';
import { _join } from './common.js';

function component() {
  const element = document.createElement('div');
  const btn = document.createElement('button');

  // lodash（目前通过一个 script 引入）对于执行这一行是必需的
  // element.innerHTML = _.join(['Hello', 'webpack'], ' ');
  // const join = require('lodash/join');
  element.innerHTML = _join(['Hello', 'webpack'], ' ');
  element.classList.add('hello');

  const myIcon = new Image();
  myIcon.src = Icon;
  element.appendChild(myIcon);

  btn.innerHTML = 'Click me and check the console!';
  element.appendChild(btn);
//   btn.onclick = printMe;
  btn.onclick = e =>
    import(/* webpackChunkName: 'print_no_entry' */ './print').then(module => {
      const print = module.default;
      print();
    });

  return element;
}

document.body.appendChild(component());
