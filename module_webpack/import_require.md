*** CommonJS 模块输出的是一个值的拷贝，ES6 模块输出的是值的引用。 ***
*** CommonJS 模块是运行时加载，ES6 模块是编译时输出接口。 ***
第二个差异是因为 CommonJS 加载的是一个对象（即module.exports属性），该对象只有在脚本运行完才会生成。而 ES6 模块不是对象，它的对外接口只是一种静态定义，在代码静态解析阶段就会生成。

ES6 Module 的 import
通过 import 静态地导入另一个通过 export 导出的模块。

# 区分于 CJS 运行时才和导入模块建立关系，ESM 在转化成中间代码时(编译阶段) import 语句就和模块建立了静态引用关系，在运行时导入和导出是不可更改的。这就意味着我们只能在顶层进行导入和导出 (比如绝不能嵌套在条件语句中)，同时 import 和 export 语句不能有「具有逻辑或含有变量」的动态部分，即不能依赖于运行时计算的任何内容 (如import foo from './module' + 变量;)，不然编译时就会报错。而 require 可以在运行时通过 if 判断决定导入哪个模块。

在编译期，import 语句会被内部移动至当前作用域最开头 (类似 var 和 function 的变量提升)，先于其他代码执行。JS 解析器编译到 import 语句时，会生成一个接口标识符或默认导出接口对应的引用。如 import { a } from './module-a'，a 指向的是export const a = xxx 接口中的 a；而 import defaultB from './module-b'，defaultB 指向的是 export default b 中的 b (默认接口导入时的名称可以自定义)。
# 到了运行期，也不会去执行完整模块，只有在调用上面的 a 或 defaultB 的时候才会加载模块中相应的接口取值。

# 换句话说，ESM模块规则有点像Unix系统的“符号连接”、“软链接”，原始值变了，import 输入的值也会跟着变。导入的变量绑定其所在的模块，不会缓存值。不同脚本加载同一个模块得到的是同一个实例。因此ESM设定了不能修改导入值的只读规则。

CJS 导入的是导出值的浅拷贝副本有缓存，而ESM导入是导出值的实时只读引用。

静态型的 import 是初始化加载依赖项的最优选择， 静态模块结构 更容易从代码静态分析工具和 tree shaking 中受益。而且自动支持模块间的循环依赖。
在用 webpack、Rollup 这样的模块打包器时，证明ESM模块可以更高效地组合：

加载所有模块时，import 查找变量是静态检索，比 require() 的动态检索快很多。
压缩绑定的文件比压缩单独的文件效率更高。
在绑定过程中，通过删除未使用的出口代码，从而节省大量空间。
在浏览器中，import 语句只能在 <script type="module"></script> 标签中使用 (<script type="module"> 拥有自己的局部作用域)。或者写在.mjs扩展名的文件里。

语法：
ESM模块有两种导出方式：命名导出（每个模块可以几个）和默认导出（每个模块一个）。可以同时使用两者，但通常最好将它们分开。

# 命名导出：export
// 1. 关键字标记声明
// 导出单个声明常量/变量
export const name1 = … // 用 let, var 定义变量也可，不过通常还是常量
export let name2 = …
// 导出声明函数
export function functionName() {...}
// 导出声明类
export class className {...}

// 2. 用对象列出要导出的所有内容
// name1，name2... 是事先定义好的标识符。如果在一个模块要导出多个值，同时数量不算多时推荐这样做，代码结构会比较清晰
const name1 = …
const name2 = …
export { name1, name2, …, nameN }
// 重命名导出
export { variable1 as name1, variable2 as name2, …, nameN }
name1… nameN、functionName、className —— 要导出的“标识符”。在其他脚本 import 时需要用这些“标识符”进行针对性的导入
直接在 export 关键字后面声明的语句叫 内联导出

export const name1 = 11
export function foo() {}
// 等效于
const name1 = 11
function foo() {}
export { name1, foo };
# 同时不能直接 export 一个对象，如export { name1: 1, name2: 2 }，export { ... }只允许用,分隔的标识符。因为不能通过对象强制执行静态关联，从而失去所有静态模块结构相关的优势。

# 默认导出：export default
# 实质上是个语法糖。export default 命令就是将输出内容赋值给名为 default 的 变量，导出内容可以是任意表达式 (函数或Class也在内)，在导入时可以随意为这个 default 更名。因为已经声明变量 default 了，后面就不能跟变量声明语句了，这一点要和 export 区分开。

expression(表达式) 属于 satement(语句)，但 expression 是可以通过 evaluation 产生结果的。也就是说这个结果不是马上产生，而是需要时才会被evaluated。
简单判断：可以被当作参数传递的就是expression，一般是放在小括号里的(expression)，而 statement 一般是放在大括号里的{ statement }。expression 被放到函数体内就变成了 satement。

// 导出
// a.js 
export default «expression»;
// 等效于
const a = «expression»;
export { a as default };

// 导入时：
import b from './a.js'
// 等效于
import { default as b } from './a';
默认导出的本意是让 import 时不受限于接口名称任意命名模块，通常用于整个模块的导出，如 React 组件。Vue组件则是把组件的数据和逻辑以一个对象的形式导出。默认导出简单类型的常量意义不大，几乎不用。命名导出和默认导出混用也存在，比如一个库是单个函数，但通过该函数的属性提供了其他服务：import _, { each } from 'underscore';。
为了快速区分不同模块，以及导入时命名的统一，默认导出类和函数的时候还是建议命名 (尽管可以匿名)。
同时一个js只能有一个 export default，多个并存只有最后一个生效。以下为演示故没有将多个注释掉。

个人推荐的方式有以下几种：

// 导出函数
export default function fun() {} 
// 如果是箭头函数，我写 React 组件都这样用
const funArrow = () => {}
export default funArrow

// 导出类
export default class Dog {}

// 导出对象
const foo = 'foo1'
const bar = 'bar2'
export default { foo, bar } // 实际导出的是 { foo: foo, bar: bar }
// 这里的 foo 和 bar 不是 标识符，只是键值对同名的简写，有本质区别， 注意区分

// 也可以直接将值写在对象里，Vue组件的做法
export default {
  name: 'foo',
  data: {...}
}
导入 import 类型：
默认导入：对应默认导出，导入名可以自定义

import customName from 'src/my_lib';

// src/my_lib.js
export default anyThing // 任意类型，函数、类、对象 及表达式
命名空间导入：通过 * 导入完整的模块，把模块中的全部属性和方法放到一个对象中 (每个命名导出为一个属性) 进行导入。

import * as my_lib from 'src/my_lib';
console.log(my_lib) // { a, fun }
console.log(my_lib.a) // 'aaa'
my.lib.fun()

// src/my_lib.js
export const a = 'aaa'
export function fun() { ... }
命名导入，可以通过 as 重命名导出标识符：

import { name1, name2 as fun } from 'src/my_lib';
console.log(name1)
fun()

// src/my_lib.js
export const name1 = 'aaa'
export function name2() { ... }
# 空导入：仅加载模块，不导入任何内容。程序中的第一个此类导入将执行模块的主体。
# 使用import直接引用一个文件时，会执行一遍这个文件，而不获取任何文件对象。import将文件模块仅仅作为副作用进行导入，而不获取文件模块的接口。

import 'src/my_lib';
组合导入：导入顺序是固定的，默认导出必须始终在第一个。

// 将默认导入与名称空间导入相结合：
import theDefault, * as my_lib from 'src/my_lib';
// 将默认导入与命名导入结合
import theDefault, { name1, name2 } from 'src/my_lib';
as —— 重命名导出“标识符”。比如需要同时导入两个同名的 export 接口，用 as 重命名其中一个就可以解决冲突
from 后面的字符串是要导入的模块。通常是包含目标模块的.js文件的相对或绝对路径。
每次 import 都是到导出数据的实时连接。
//------ lib.js ------
export let counter = 3;
export function incCounter() {
    counter++;
}
//------ main1.js ------
import { counter, incCounter } from './lib';

// The imported value `counter` is live
console.log(counter); // 3
incCounter();
console.log(counter); // 4

// The imported value can’t be changed
counter++; // TypeError
如果通过*导入模块对象，会得到相同的结果：

//------ main2.js ------
import * as lib from './lib';

// The imported value `counter` is live
console.log(lib.counter); // 3
lib.incCounter();
console.log(lib.counter); // 4

// The imported value can’t be changed
lib.counter++; // TypeError
请注意，虽然不允许直接更改导入的值 (即重新赋值)，但是可以修改它们引用的对象。例如：

//------ lib.js ------
export let obj = {};

//------ main.js ------
import { obj } from './lib';

obj.prop = 123; // OK
obj = {}; // TypeError
ES6 Module 的 import()
# 静态 import 命令会被JS引擎静态分析，先于其他代码执行，做不到运行时加载。而且 import 和 export 语句都必须始终位于模块的顶层，无法按需执行。为了实现类似于require的动态加载，从而提高首屏加载速度，就出现了一个import()函数方法。import()括号内接收的参数和import语句from后面的一致。
按照一定的条件或者按需加载模块的时候，动态import() 是非常有用的。

import()函数是动态按需加载，它返回一个 Promise 对象。import()是运行时执行，什么时候运行到这一句，才会加载指定的模块。因此通过 if 判断可以实现按条件import()模块 。除了模块，还可以用来加载非模块的脚本。

import()与所加载的模块没有静态连接关系，这点也与 import 语句不同 (import语句会建立静态引用)。import()类似于 Node 的require()，但区别是import()为异步加载，而require()是同步加载。

当出现以下的情况，一般就可以用动态import()代替静态 import 了：

静态导入的模块很明显地降低了代码的加载速度/占用了大量系统内存并且被使用的可能性很低，或者并不需要马上使用它。
被导入的模块在加载时还不存在，需要异步获取
导入模块的标识符需要动态构建。（静态导入只能使用静态标识符）
被导入的模块有副作用（这个副作用，可以理解为模块中会直接运行的代码），这些副作用只有在触发了某些条件才被需要时。
另外请只在必要情况下采用动态导入。静态框架能更好地初始化依赖，而且更有利于静态分析工具和tree shaking发挥作用。

import('./modules/my-module.js')
  .then(module => {
    // Do something with the module.
  });
因为是一个 promise，import() 也支持 await 关键字。

let module = await import('./modules/my-module.js');
获取模块接口
import()加载模块成功以后，这个模块会作为一个对象，当作then方法的参数。因此，可以使用对象解构赋值的语法，获取输出的命名接口。

import('./modules/my-module.js')
.then(({export1, export2}) => {
  // ...
});
如上，export1和export2都是my-module.js用export导出的输出具名接口，可以直接解构获得。

如果要获取 default 默认导出，需要用default属性获取：

import('./modules/my-module.js')
.then(module => {
  console.log(module.default)
});
// 或者这样
import('./modules/my-module.js')
.then(({default: theDefault}) => {
  console.log(theDefault);
});

# 总结
CJS 的 require() 和 exports
require() 为同步导入。
动态结构：导入和导出的对象可以在运行时通过变量动态生成，也可以把 require()/exports 放在 if 语句之类的代码块内实现按需加载/导出。
代码执行到 require() 会先把()内的模块代码执行一遍，返回值是模块导出对象的浅拷贝副本。
require()进来的属性副本，可以修改和删除，简单类型不会影响被导入模块，引用类型会改变导入模块数据。但 require() 的目的主要是导入一些供使用的函数或常量，这样显然是不合理的，因此尽量不要试图修改模块源数据，并在导入时表明引入的是常量，如：const path = require('path')
* 需要用 exports.属性 导出并仔细地规划, 才能使模块循环依赖正常工作

ESM 的 import 和 export
import 语句为同步导入。
静态模块结构（可以利用于消除无效代码，优化，静态检查等）：导入和导出的关联关系在运行时不可更改。
在代码编译阶段(而非执行阶段) import 语句就和模块建立了只读静态引用关系，且代码运行到import不会执行模块的内容，而是当导出值被调用时才会真正执行对应模块。
不能修改 import 进来的对象，因为import/export输出的模块是动态绑定的常量，是只读的。但修改对象引用地址的属性还是可以的。如无特殊需要请不要这么做。
import/export 不能嵌套在任何块级作用域或函数作用域内，必须写在模块顶层(因为 import 会先于其他任何代码执行)
import/export 语句不能有动态计算部分
不能直接在浏览器执行，需要写在<script type="module"></script>内
自动支持模块之间的循环依赖关系
尽管ESM模块规范大有优势，但鉴于很多库还在广泛使用CJS，我们仍需要理解require和module.exports/exports。自己在日常开发中使用import和export default/export即可，webpack 会帮你做兼容处理 (可以看到webpack自身是遵循CJS的，因此会在打包过程中先把esm转成cjs) 。期待全面支持ESM的一天～

链接：https://www.jianshu.com/p/f6c3ad35fcc5

# require和exports：需要用 exports.属性 导出并仔细地规划, 才能使模块循环依赖正常工作
循环依赖
模块在第一次加载后会运行一次，然后将运行结果缓存到内存里。 这意味多次调用require(‘foo’)只会执行一次 foo 模块的代码，后面都是直接读取缓存的值。 这是一个重要的特性，借助它可以返回“部分完成”的对象，从而允许加载依赖的依赖。

module.require 的源码涉及的知识点较多，webpack 打包模块时对 require 的处理能简单地体现缓存原理，我们来参考一下：


// The require function
function __webpack_require__(moduleId) {
  // 根据 moduleId 查找该模块是否存在于installedModules 中，
  if(installedModules[moduleId]) {
    // 如果存在直接读取模块的导出值，不会再初始化
    return installedModules[moduleId].exports;
  }
  // 初始化一个 module 对象并放入 installedModules中，并进行缓存 (cache)
  var module = installedModules[moduleId] = {
    i: moduleId,
    l: false,
    exports: {}
  };
  // 执行模块
  modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
  // 做个标记表示该 module 已经加载过了
  module.l = true;
  // 返回模块对象的 exports
  return module.exports;
}

require 工作原理最核心的部分类似于这个webpack_require函数，执行 require() 的大致过程如下 (注意⚠️：补充结合了 module.require 的部分)：

先检测传入的 moduleId 是否有效，必须是非空字符串。
如果无误，则调用主要负责加载新模块和管理模块缓存的 Module._load 方法，而 require 本身就是对该方法的一个封装。
_load 方法内部，先调用 Module._resolveFilename 去获取文件地址。
判断是否存在该模块的缓存，如果有返回缓存模块的 exports 。
如果没有缓存，且不是核心模块，就创建一个新的 module/模块，并在 Module._cache 中缓存该模块对象。
尝试执行该模块的代码，如果报错，会清除该模块的缓存。
最后返回模块的输出对象 exports。
根据这个机制，我们看下面两个互相依赖的模块 a 和 b：

// 1. 加载 a 模块，会生成一个新 module 并放入缓存。
// a.js
let b = require('./b'); // 2. 运行 a.js：第一步加载 b 模块，新建一个 b module 放入缓存，并执行 b 的代码。
// 6. b 得到值 { b: 'bbb' }
module.exports = { // 8. 导出一个 module.exports  对象，指向全新的地址
  a: 'aaa'
};
// 7. 把 a 模块定时器代码放到任务队列
setTimeout(() => {
  console.log(`a.js-${b.b}`); // 10. 输出 a.js-bbb
});
// b.js
let a = require('./a'); // 3. 执行 b 马上要去加载 a，形成循环依赖。读取 a 模块缓存，返回值是初始空对象。
module.exports = { // 5. 导出一个 module.exports  对象，指向全新的地址
  b: 'bbb'
}
setTimeout(() => { // 4. 把 b 模块定时器代码放到任务队列
  console.log(`b.js-${a.a}`); // 9. a为空对象，a.a 输出 b.js-undefined
});

# 执行node a.js，a 模块相当于第一次加载，会生成一个新 module 并放入缓存。
# 首先去加载模块 b，新建一个 b module 放入缓存，并执行 b 的代码。
# 在执行 b.js 第一行时发现又要去导入 a，这里形成了循环依赖。然而 a 模块已经存在一个缓存了，就直接去取缓存的 a 模块的 module.exports 值。但 a 模块的代码并没有执行完全，所以 module.exports 还是个空对象 (初始值)。a 变量得到的就是一个空对象地址。
b 模块继续执行。把 setTimeout 里的代码放到任务队列，等所有同步代码执行完毕后再执行。然后正常导出一个 { b: 'bbb' }。
执行权回到 a，a 拿到了 b 导出的这个对象并赋值给 b 变量。跟着继续执行 a.js 的第二句，就是给 module.exports 赋值一个新对象 { a: 'aaa' }。
最后按顺序执行定时器任务队列里的两个 console。b 模块拿到的 a 变量是空对象，这一点后面不会改变，于是 a.a 就是 undefined。而 a = { b: 'bbb' } 就没什么疑问了。
但是这一输出的值没有达到我们的预期，因为用 module.exports 导出会让它指向一个全新的地址，也就是循环依赖拥有属性 a 的对象，跟 b.js 中拿到的对象并不是同一个。其实只要用 exports 挂载导出属性，而不是直接 module.exports = { ... }，就能改变这一结果。接着看：
步骤就直接写在注释里了，和上面相同的会简略些或跳过。

// 1. 加载 a，缓存 a 
// a.js
let b = require('./b')      // 2. 加载 b，缓存 b
                            // 6. b 变量拿到 b 模块 exports 值 { b: 'bbb' }，并且指向 b 模块 module.exports 同一引用地址
console.log(`a1.js-${b.b}`) // 7. 输出 a1.js-bbb
exports.a = 'aaa'           // 8. 给 a 模块的导出对象添加一个 a 属性，值为 'aaa'，此时 a 模块 module.exports 内容为 { a: 'aaa' }
setTimeout(() => {
  console.log(`a2.js-${b.b}`) // 10. 读取 b 模块 module.exports 引用地址，输出 a2.js-bbb
})
// b.js
let a = require('./a')      // 3. 读取缓存 a 的 exports，a = {}，指向 a 模块 module.exports 同一引用地址
console.log(`b1.js-${a.a}`) // 4. 输出 b1.js-undefined
exports.b = 'bbb'           // 5. 给 b 模块的导出对象添加一个 b 属性，值为 'bbb'
setTimeout(() => {
  console.log(`b2.js-${a.a}`) // 9. 此时读取 a 模块 module.exports 引用地址，已经有了a属性，输出 b2.js-aaa
})

# 由此可见，要正确地处理模块循环依赖关系，保证模块导出对象地址始终如一，只能用 exports.name1 = anything 这种形式。
CJS如果在浏览器中运行，会有一个重大的局限：
const math = require('math');
math.add(2, 3);
因为 require 是同步加载，第二行代码必须等第一行运行完才能执行。而加载math模块又得先把它里面的内容执行一遍。这对服务端不是一个问题，因为所有的模块都存放在本地硬盘。但浏览器端加载模块要向服务器去请求，等待时长取决于网速的快慢，那么这会是个很大的问题。


大公司的静态资源优化方案，基本上要实现这么几个东西：
配置超长时间的本地缓存 —— 节省带宽，提高性能
采用内容摘要作为缓存更新依据 —— 精确的缓存控制
静态资源CDN部署 —— 优化网络请求
资源发布路径实现非覆盖式发布  —— 平滑升级
链接：https://www.zhihu.com/question/20790576/answer/32602154




链接：https://www.zhihu.com/question/62791509/answer/2345796861
# ES6 模块与 CommonJS 模块有一些重大的差异：
CommonJS 模块输出的是一个值的拷贝，ES6 模块输出的是值的引用。
CommonJS 模块是运行时加载，ES6 模块是编译时输出接口。
由于 CommonJS 并不是 ECMAScript 标准的一部分，所以 类似 module 和 require 并不是 JS 的关键字，仅仅是对象或者函数而已，所以可以用这2个单词定义变量，比如： let require = 1; 但是js关键字是不可以作为变量名的。

JavaScript 执行过程分为两个阶段:编译阶段、执行阶段
在编译阶段 JS 引擎主要做了三件事：词法分析、语法分析、字节码生成，这里不详情讲这三件事的具体细节，感兴趣的读者可以阅读 the-super-tiny-compiler 这个仓库，它通过几百行的代码实现了一个微形编译器，并详细讲了这三个过程的具体细节。
在执行阶段，会分情况创建各种类型的执行上下文，例如：全局执行上下文 (只有一个)、函数执行上下文。
而执行上下文的创建分为两个阶段：创建阶段、执行阶段，在创建阶段会做如下事情：绑定 this、为函数和变量分配内存空间、初始化相关变量为 undefined，我们日常提到的 变量提升 和 函数提升 就是在 创建阶段 做的

# JavaScript 的常见报错类型
为了更容易理解 ESM 的模块导入，这里再补充一个知识点 —— JavaScript 的常见报错类型。1、RangeError这类错误很常见，例如栈溢出就是 RangeError；
function a () {
  b()
}
function b () {
  a()
}
a()

// out: 
// RangeError: Maximum call stack size exceeded
2、ReferenceErrorReferenceError 也很常见，打印一个不存在的值就是 ReferenceError：hello

// out: 
// ReferenceError: hello is not defined
3、SyntaxErrorSyntaxError 也很常见，当语法不符合 JS 规范时，就会报这种错误：console.log(1));

// out:
// console.log(1));
//               ^
// SyntaxError: Unexpected token ')'
4、TypeErrorTypeError 也很常见，当一个基础类型当作函数来用时，就会报这个错误：var a = 1;
a()

// out:
// TypeError: a is not a function
上面的各种 Error 类型中，SyntaxError 最为特殊，因为它是 编译阶段 抛出来的错误，如果发生语法错误，JS 代码一行都不会执行。而其他类型的异常都是 执行阶段 的错误，就算报错，也会执行异常之前的脚本。什么叫 编译时输出接口? 什么叫 运行时加载?
# ESM 之所以被称为 编译时输出接口，是因为它的模块解析是发生在 编译阶段。也就是说，import 和 export 这些关键字是在编译阶段就做了模块解析，这些关键字的使用如果不符合语法规范，在编译阶段就会抛出语法错误。例如，根据 ES6 规范，import 只能在模块顶层声明，所以下面的写法会直接报语法错误，不会有 log 打印，因为它压根就没有进入 执行阶段：
console.log('hello world');
if (true) {
  import { resolve } from 'path';
}

// out:
//   import { resolve } from 'path';
//          ^
// SyntaxError: Unexpected token '{'
# 与此对应的 CommonJS，它的模块解析发生在 执行阶段，因为 require 和 module 本质上就是个函数或者对象，只有在 执行阶段 运行时，这些函数或者对象才会被实例化。因此被称为 运行时加载。这里要特别强调，与CommonJS 不同，ESM 中 import 的不是对象， export 的也不是对象。例如，下面的写法会提示语法错误：// 语法错误！这不是解构！！！
import { a: myA } from './a.mjs'

// 语法错误！
export {
  a: "a"
}
import 和 export 的用法很像导入一个对象或者导出一个对象，但这和对象完全没有关系。他们的用法是 ECMAScript 语言层面的设计的，并且“恰巧”的对象的使用类似。
所以在编译阶段，import 模块中引入的值就指向了 export 中导出的值。如果读者了解 linux，这就有点像 linux 中的硬链接，指向同一个 inode。或者拿栈和堆来比喻，这就像两个指针指向了同一个栈。