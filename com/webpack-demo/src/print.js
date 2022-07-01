import {_join} from "./common.js"

console.log('The print.js module has loaded! See the network tab in dev tools...');

export default function printMe() {
  //   consle.log('I get called from print.js!');
//   const join = require("lodash/join")
  console.log('I get called from print.js!', _join(['test', ' join']));
}