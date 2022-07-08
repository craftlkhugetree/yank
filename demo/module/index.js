// ESM index.js
import defaultExport, { bar } from './mod.js';

import { bar } from './mod.js';
import foo from './mod.js';

console.log(bar);
console.log(foo);
console.log(foo());