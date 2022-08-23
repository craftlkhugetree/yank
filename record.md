# Git

git svn clone -r HEAD --username=liken svn://160.255.0.56/01module/seatreser/03code/seat_v2_pc

git show（查看上一次修改）
git svn rebase === git pull

git checkout master(切换分支)
git merge new_branch（将分支 new_branch 合并到 master 分支）
git svn dcommit（然后将所有已经合并到 master 分支的本地修改提交到 svn）

git update-index --assume-unchanged
git ls-files -v | grep '^h\ '

git config --list

git 修改注释的方法：1、利用“git commit --amend -m”命令，可以在还没有 push 之前修改注释内容；2、利用“git push -f”命令，可以在 push 之后修改注释内容。
git 修改以前提交的注释：
（1）git rebase -i HEAD~2 【数字指的是倒数第 n 次提交记录的注释】
（2）pick 改成 edit 【输入 i 编辑模式，只需要将你需要修改的注释前的 pick 改为 edit 即可】
（3）Esq 【退出编辑模式】
（4）:wq 【保存退出】
（5）git commit --amend 【同上有提示，第一行进行你真正需要的修改, 修改完后，保存退出】
（6）git rebase --continue 【退出后，输入最后一步】

git log --since=2022-04-27 --until=2022-06-21 --author="liken" --pretty=tformat: --numstat | awk '{ add += $1; subs += $2; loc += $1 - $2 } END {printf "added lines: %s, removed lines: %s, total lines: %s\n", add, subs, loc }'

ssh-keygen -t rsa -C "345823102@qq.com"
ssh -T git@github.com // 测试

# npm

npm list -g --depth 0 查看 node 安装位置和版本

npm config get cache // 查看本地缓存
npm config list
npm config ls -l 查看所有

npm 的缓存机制到底是怎么样的呢？现在我们就来总结下：
在安装资源的时候，npm 会根据 package-lock.json 中的 integrity、version、name 信息生成一个唯一的 key。
然后用这个 key 经过 SHA256 算法生成一个 hash，根据这个 hash 前四位 在 index-v5 目录中找到对应的缓存文件，该缓存文件中记录着该包的信息。
根据该文件中的信息\_shasum，我们在 content-v2 中去找对应的压缩包，这样就找到了对应的缓存资源的源码了。
最后再将该压缩包解压到 node_modules 中，节省了网络开销和安装时间。

lock 文件发生冲突了怎么办？
A: 首先，我们应该尽量避免冲突，在我们需要更新 package.json 文件的时候，不要手动去修改 package.json 中的依赖，使用 npm 命令更新/安装依赖；比如：npm update 升级小版本、npm install @version 升级大版本、npm uninstall 删除依赖。同时，任何时候都不要手动修改 package-lock.json 文件。
在遇到 lock 文件冲突的时候，那么应该先手动解决 package.json 的冲突，然后执行 npm install --package-lock-only，让 npm 自动帮你解冲突。

# vscode

没有配置前 如果代码过长，vetur 会把尖括号整理到第二行换行， "prettier.htmlWhitespaceSensitivity": "ignore", //包裹文字时候结束标签的结尾尖括号掉到了下一行
感叹号后回车，快捷生成 html

ctrl + shift + o 查找函数类名
ctrl + p 打开文件

# js node webpack

module 和 exports 是 Node.js 给每个 js 文件内置的两个对象。module.exports 是一个空对象，exports 是对这个对象的引用。
module.exports === exports，若直接赋值 exports = {ex: 1}则二者不再相等；若属性赋值 exports.ex = 1，则二者继续相等。
_require 引入的对象本质上是 module.exports_
import [任意名称] 引入的是 module.exports.default； import \* 引入的是 module.exports,其中包括 default

export default 在同一个文件中只可存在一个；引入的时候 export 导出的加{} 而 export default 导出的可定义为随便一个名称，
合并为 import all, {arr, obj} from './test.js' 还可以是 import {default as all} from "@/assets/options"

- 或者 const { default: all, arr, obj } = require('./test.js') ES 的默认导出对应 CommonJS 模块导出对象的 default 属性，但是如果 CJS 中没定义 default 就麻烦了。
  解决办法：
  webpack 在使用侧导入的‘默认导出’实际上是一个 Getter 函数，读取值的时候访问了其自身的 a 属性，如果 **esModule 为 true 那么 a 就是 module.exports.default，Getter 调用也返回 module.exports.default，否则 a 的值和 Getter 返回值就是 module.exports。所以在 Webpack 中这样用是没有问题的，Webpack 会根据 **esModule 标识来自动处理 CommonJS 的模块导出对象，兼容 ES 模块中的导入。

(1)require/exports 是运行时动态加载，import/export 是静态编译
CommonJS 加载的是一个对象（即 module.exports 属性），该对象只有在脚本运行完才会生成。而 ES6 模块不是对象，它的对外接口只是一种静态定义，在代码静态解析阶段就会生成。
(2)require/exports 输出的是值的拷贝。也就是说，一旦输出一个值，模块内部的变化就影响不到这个值。
import/export 模块输出的是值的引用。JS 引擎对脚本静态分析的时候，遇到模块加载命令 import，就会生成一个只读引用。等到脚本真正执行时，再根据这个只读引用，到被加载的那个模块里面去取值。
(3)import/export 只能在模块顶层使用，不能在函数、判断语句等代码块之中引用；require/exports 可以。
import fs from './webUtils.js';
function a(){
import {e1} from './webUtils.js';
console.log(e1)
}
a();
console.log(fs())
程序报错：Uncaught SyntaxError: Unexpected token '{'
前面提到过 import/export 在代码静态解析阶段就会生成，不会去分析代码块里面的 import/export，所以程序报语法错误，而不是运行时错误。
(4)严格模式是采用具有限制性 JavaScript 变体的一种方式
import/export 导出的模块默认调用严格模式。
var fun=()=>{
mistypedVaraible = 17; //报错，mistypedVaraible is not defined
};
export default fun;
require/exports 默认不使用严格模式，可以自定义是否使用严格模式。 例如

exports.fun = ()=>{
mistypedVaraible = 17; //没有调用严格模式，不会报错
};
(5)动态导入 import()
import(modulePath) 表达式加载模块并返回一个 promise，该 promise resolve 为一个包含其所有导出的模块对象。
我们可以在代码中的任意位置动态地使用它。例如：
import('/modules/my-module.js') `//动态导入，这种Promise的异步导入，可以导入所有，而不仅仅是default`
.then((module) => {
// Do something with the module.
});
建议: 请不要滥用动态导入 import()（只有在必要情况下采用）。静态框架能更好的初始化依赖，而且更有利于静态分析工具和 tree shaking 发挥作用。

async created() {
// 同步
const tmp1 = require("@/assets/options")
// 异步
let tmp = await import("@/assets/options").then(res => {
console.log('promise:', res);
return (123)
})
console.log('print:', tmp1, tmp);
}
// promise: Module {…}
// print: Module {…} 123

`export * from './options' 这个opt.js文件不能被import opt from "@/assets/opt"只能import * as opt from "@/assets/opt"，而且导入的opt没有default`
ES6 模块的设计思想是尽量的静态化，使得编译时就能确定模块的依赖关系，以及输入和输出的变量。CommonJS 和 AMD 模块，都只能在运行时确定这些东西。
ES6 模块不是对象，而是通过 export 命令显式指定输出的代码，再通过 import 命令输入。这种加载称为“编译时加载”或者静态加载，即 ES6 可以在编译时就完成模块加载，效率要比 CommonJS 模块的加载方式高。当然，这也导致了没法引用 ES6 模块本身，因为它不是对象。

- 即便 const { arr, obj } = require('./test.js') 也是把 test.js 全导入了。而 import 在打包时根本见不到，且可以按需加载。
  const {arr, obj } = require('xxx/xxx')功效不明！

```
后端，同步CJS[CommonJS]: require(); webpack语法;
前端，异步AMD：比如测试模式npm run test中的导入
UMD,前后端通用
ESM,esModule, 常见的import，export语句：既有CJS的简洁；也有AMD的异步；静态分析（可以在编译时(静态)确定导入和导出-只需查看源代码，而不必执行它）因此可以摇树优化；
```

UI 库有一个 dist 文件夹，其中包含 ES 和 UMD / CJS 的捆绑版本和缩小版本，还有一个 lib 文件夹，具有库的转译版本。
Core Packages (react, react-dom)只有一个文件夹，其中包含 CJS 或 UMD 模块系统的捆绑版本和缩小版本。

- 为什么 UI 库和 Core Packages 的构建输出有所不同？
  想象一下，如果我们只是发布库的捆绑版本并将其托管在 CDN 上。 我们的消费者将直接在<script/>标签中使用它。 现在，如果我的使用者想使用<el-Button>组件，则他们必须加载整个 UI 库。 另外，在浏览器中，没有可以解决摇树问题的捆绑器，最终我们会将整个 UI 库代码发送给我们的使用者。 如果我们只是简单地将 src 转换为 lib 并将该 lib 托管在 CDN 上，那么我们的使用者可以得到他们想要的任何东西而没有任何额外开销。
- 核心软件包永远不会通过<script/>标记使用，因为它们必须是主应用程序的一部分。 因此，我们可以安全地发布这些软件包的捆绑版本(UMD，ES)，并将构建系统交给消费者。
  例如，他们可以使用 UMD 变体而不使用摇树，或者如果捆绑器能够识别并获得摇树的好处，则可以使用 ES 变体。
  // CJS require const Button = require("uilibrary/button");
  // ES import import {Button} from "uilibrary";
  将 package.json 的 module 字段设置为指向 module 的 ES 版本(PS：它有助于摇晃树)。 ？
  字段"main": "lib/xr-ui.umd.min.js", // 指向 UMD/CJS

用 babel 把代码文件转成 commonjs 或者 esm 就好了。不要使用 webpack 打包成一个 js 文件，否则无法按需加载。
babel 只编译而不链接（bundle）。

import moment from 'moment';
export default () => moment().format("YYYY Do MM");

- babel 情况下，module 引用并没有被替换为实际的“moment”的代码， 而是单纯的将 esm 格式的模块引用转化为 cjs 格式的模块引用，而具体“moment”这个模块应该从哪里解析， 里面有什么内容， 应该以什么方式返回给 moment 这个变量， babel 并不负责处理。这段代码在 node.js 环境中执行是没问题的(假设通过 npm 安装了 moment)， 但是在浏览器中是执行不起来的。
- webpack 的定位可以理解为传统编译器中的链接器(linker)的角色。webpack 的输入为一个个 es module(或者其他的资源文件， 如 css， image， `被对应的loader转化为可执行的es module`)，输出将各个 module 合并在一起的“bundle”。
  这里面/**\*\***/开头的行均为 webpack 用来实现 module 引用的样板代码（这段代码具体的分析可以参考https://github.com/ronami/minipack），可以认为是webpack对于es module 标准的“实现”（因为浏览器还没有实现 es module）。

`babel和webpack做的事情有一部分重叠， 例如都将js转化为ast并且做了一些transform， 然后再输出各自的目标代码。 但是两者的分工有所不同， babel主要做es语法的转换，确保最新的来的es特性能够以最快的速度deliver到开发者手中， 但是不负责模块的组合。 webpack更多的是将输入的各个模块用自己内部的一套逻辑将代码“链接”起来， 起胶水的作用， 并且目标是输出可以直接在浏览器中执行的代码。`

**_ 箭头函数 _**
没有 arguments，有...rest。无法通过 apply、call、bind 改变 this 指向。

1. 对象方法中，不适用箭头函数
   getName1()通过箭头函数定义，而箭头函数是没有自己的 this，会继承父作用域的 this。
   const obj = {
   name: '张三',
   getName() {
   return this.name
   },
   getName1: () => {
   return this.name
   }
   }
   因此 obj.getName1()执行时，此时的作用域指向 window，而 window 没有定义 age 属性，所有报空。
2. 原型方法中，不适用箭头函数。
3. 构造函数也不行！
   构造函数是通过 new 关键字来生成对象实例，生成对象实例的过程也是通过构造函数给实例绑定 this 的过程，而箭头函数没有自己的 this。因此不能使用箭头作为构造函数，也就不能通过 new 操作符来调用箭头函数。
4. 动态上下文中的回调函数，比如绑定 click 事件。
5. Vue 生命周期和 method 中也不能使用箭头函数
   Vue 本质上是一个对象，我们说过对象方法中，不适用箭头函数。他的本质上的和对象方法中，不适用箭头函数是一样的。
   那么我有一个问题：Vue 不行，作为大热框架之一的 react 行吗？
   回答是：react 行
   因为 Vue 组件本质上是一个 JS 对象；React 组件（非 Hooks）他本质上是一个 ES6 的 class
   class 中的方法如果是普通函数方法，该方法会绑定在构造函数的原型上；但是如果方式是箭头函数方法，该方法会绑定在构造函数上。通过上述方式调用 class 中的方法，无论是箭头函数方法还是普通函数方法，方法中的 this 都指向实例对象。

<!-- 在两个互斥的radio中，一定要有相同的name值，不然不能互斥选择。 -->

        <input type="radio" name="sex" v-model="sex" value="男" />男
        <input type="radio" name="sex" v-model="sex" value="女"/>女

data {sex: ''},
原文链接：https://blog.csdn.net/MelodyFreedom/article/details/117514664

scrollTop 一直为零可能是根本没有滚动，父元素高度大于子元素。若考虑兼容应当使用 document.documentElement.scrollTop || document.body.scrollTop || window.pageYOffset

childNodes 不是数组，而是类数组，所以没有 filter 函数，要转一下 arr。默认元素宽度 33%，如果是两个元素就 50%平分宽度。
setWidth() {
let dom = document.getElementById('prAuditTabs');
if (this.num == '2' && dom) {
let nodes = dom.childNodes;
var arr = Array.prototype.slice.call(nodes, 0);
let li = arr && arr.filter(n => n.nodeName === 'LI') || [];
li.forEach(l => {
l.style.width = "50%"
})
}
}

**_ 复制到剪切板的两种方法 _**
if (navigator && navigator.clipboard && navigator.clipboard.writeText) {
navigator.clipboard.writeText(text).then(
function () {
console.log('Async: Copying to clipboard was successful!');
},
function (err) {
console.error('Async: Could not copy text: ', err);
}
);
} else {
const input = document.createElement('input');
document.body.appendChild(input);
input.setAttribute('value', text);
input.select();
if (document.execCommand('copy')) {
document.execCommand('copy');
console.log('复制成功');
}
document.body.removeChild(input);
}

/\*_ Function: 导出二进制流文件 _/
const exportFile = function (url, isGet, params, fileName, fileType) {
Axios({
url: window.g.ApiUrl2 + url,
method: isGet ? "GET" : "POST",
responseType: "blob",
headers: {
IDSTGC: getCookie("IDSTGC") || "7449714c09c049b693c2c03b6ffb2086"
},
data: params
}).then(res => {
let url = window.URL.createObjectURL(res.data);
let link = document.createElement("a");
link.href = url;
link.style.display = "none";
link.setAttribute("download", fileName + "." + fileType);
document.body.appendChild(link);
link.click();
document.body.removeChild(link);
window.URL.revokeObjectURL(url);
});
}
// 原生 js 下载二进制流
function d(type) {
let xmlResquest = new XMLHttpRequest();
// let url = location.protocol + '//' + location.host + urls + `dataAnalysis/${type}DataExcel`;
let url = location.protocol + '//' + location.host + urls + `dataAnalysis/${type}DataExcel?data=`;
let param = JSON.stringify({ page: 1, start: 0 });
url += encodeURIComponent(param);
let fileName = type + '统计';
xmlResquest.open('get', url, true);
xmlResquest.responseType = 'blob';
xmlResquest.timeout = 0; // 设置超时时间
xmlResquest.onload = function (oEvent) {
const content = xmlResquest.response;
// 因为可能后端可能会传递 json 格式的报错信息，所以在接收信息的时候需要判断一下是否是 json 文件。如果是 json 文件，则为报错信息。不是 json 文件就是正常文本信息
let fileReader = new FileReader();
fileReader.onload = function () {
try {
let jsonData = JSON.parse(this.result); // 说明是普通对象数据，后台转换失败
if (jsonData.code) {
}
} catch (error) {
// 解析出错，可以下载，说明不是 json 对象
// const elink = document.createElement('a');
// elink.download = fileName;
// elink.style.display = 'none';
// const blob = new Blob([content]);
// elink.href = URL.createObjectURL(blob);
// document.body.appendChild(elink);
// elink.click();
// document.body.removeChild(elink);
let url = window.URL.createObjectURL(content);
let link = document.createElement('a');
link.href = url;
link.style.display = 'none';
link.setAttribute('download', fileName + '.xlsx');
document.body.appendChild(link);
link.click();
document.body.removeChild(link);
window.URL.revokeObjectURL(url);
}
};
fileReader.readAsText(content);
};
xmlResquest.send();
}

// 回到顶部
document.getElementsByTagName('html')[0].scrollTop = 0
1.document.body.scrollTop=document.documentElement.scrollTop=0 //页面滚动到顶部
2.document.body.scrollIntoView(true/ false)
3.document.getElementById('site-nav').scrollIntoView()
下面是一个小的例子：
// 每次切换标题栏都从第一个开始展示
document.querySelector('.infinite-scroll-component').scrollTo(0,0)
//选中当前想要回到 dom 元素，使用 scrollTo(0,0),实现能够在切换中始终保持第一栏在顶部显示。

// 下载
this.util.exportFile('learn/download', true, this.id, name, ext) // false 就是 params 对象。
let exportFile = function (url, isGet, params, fileName, fileType) {
Axios({
url: window.g.url + url,
method: isGet ? "GET" : "POST",
responseType: "blob",
headers: {
IDSTGC: getCookie("IDSTGC") || "4c94867cb4854ede8ce3121f4a2a037e",
},
data: params,
}).then((res) => {
let url = window.URL.createObjectURL(res.data);
let link = document.createElement("a");
link.href = url;
link.style.display = "none";
link.setAttribute("download", fileName + "." + fileType);
document.body.appendChild(link);
link.click();
document.body.removeChild(link);
window.URL.revokeObjectURL(url);
});
}

# jquery

$('selector1, selector2... , selectorN')    // 每一个选择器匹配到的元素合并后一起返回 (返回集合元素)
// 层次选择器
$('ancestor descentant') // 选取 ancestor 元素里所有 des(后代)元素 例: $('div span')
$('parent > child') // 选取 parent 下的 child(子)元素 例: $('div > span')  选取div元素下元素名是span的子元素
$('prev + next') // 选择紧接在 prev 后面的 next 元素 例: $('.one + div') 选取 class 为 one 的下一个 div 同辈元素
==> 使用 next() 代替 例: $('.one').next('div')

$('prev ~ sblings') // 选取 prev 元素之后的所有 sblings 元素 例: $('#two ~ div') 选取 id 为 two 的元素后面所有的 div 同辈元素
==> 使用 nextAll()代替 例: $('#two').nextAll('div')
// 过滤选择器
1.1 基本过滤选择器

:first $('div:first') // 获取第一个元素 选取所有 div 元素中第一个 div 元素
:last $('div:last') // 和上面相反
:not(selector) $('input:not(.myClass)') // 选取 class 不是 myClass 的 input 元素
:even $('input:even') // 选取索引是偶数的元素
:odd $('input:odd') // 选取索引是奇数的元素
:eq(index) $('input:eq(1)') // 选取索引等于 index 的元素
:gt(index) // 选取索引大于 index 的元素
:lt(index) // 选取索引小于 index 的元素
:header $(':header') // 选取所有的标题元素,例 h1 h2
:animated $('div:animated') // 选取当前正在执行动画的所有元素
:focus $(':focus') // 选取当前获取焦点的元素

1.2 内容过滤选择器

:contains(text) $('div:contains('我')') // 选取含有内容文本为 'text' 的元素
:empty $('div:empty') // 选取不包含子元素或者文本的空元素
:has(selector) $('div:has(p)') // 选取含有选择器所匹配元素的元素
:parent $('div:parent') // 选取含有子元素或者文本的元素 集合元素

1.3 可见性过滤选择器

:hidden // 选取所有不可见的元素 display:none input type=hidden visivility:hidden 等
$('input:hidden') // 只选取 input 元素

:visible // 选取所有可见的元素
$('div:visible') // 选取所有可见的 div 元素

// 从 DOM 中删除所有匹配的元素
$('ul li:eq(1)').remove()

- $('ul li').remove('li[title != 苹果]') // title 不等于 苹果的 li 元素删除
  // 和 remove()一样, 也是从 DOM 中删除元素. 但需要注意: 这个方法不会把匹配的元素从 jquery 对象中删除
  // 因而可以将来在使用这些匹配的元素, 与 remove() 不同的是, 所有绑定的事件, 附加数据会保留下来
  // 当需要移走一个元素，不久又将该元素插入 DOM 时，这种方法很有用。
- $('ul li:eq(1)').detach()

// 严格来说: empty()并不是删除节点, 而是清空节点, 它能清空元素中的所有后代节点
$('ul li:eq(1)').empty()    // 清除的是li元素里的文本
// 如果单击<li>元素后需要在复制一个<li>元素, 可以使用clone() 方法来完成
$('ul li').click(function(){
$(this).clone().append('ul')
})
$(this).clone(true).appendTo('body') // 在 clone 中加个 true, 含义是复制元素的同时复制元素中所绑定的事件,因此该元素的副本也同样具有复制功能

- tmpl:
  $('#obj1').appendTo($('#obj2')) 这个是将 $('#obj1')) 插入到 $('#obj2') 中作为最后一个元素 
$('#obj1').prependTo($('#obj2')) 这个是将 $('#obj1')) 插入到 $('#obj2') 中作为第一个子元素。
$('#obj1').append($('#obj2')) 这个要注意方向了， 是将$('#obj2') 插入到 $('#obj1')作为最后一个元素，或者说是在$('#obj1')最后面添加子元素$('#obj2')
————————————————
 this是html元素，$(this)是变量名。$(this)=jquery(this)返回的是一个jQ对象。
 this是dom对象不可以直接使用jQ中的方法，通过$(this)转换为 jQ 对象就可以使用 jQ 中的方法了。
  如下：this 使用 siblings()时会报错,而转为$(this)就可以使用该方法了。
// bind events  
$('.param-list .remove-param').live('click', function(){
  $(this).parent().remove();
  return false;
  });
  ————————————————

var $test_a = $(".test :hidden");//带空格的 jQuery 选择器
上面这段代码是选取 class 为“test”的元素里面的隐藏元素。（后代选择器）

var $test_b = $(".test:hidden");//不带空格的 jQuery 选择器
这上面的代码则是选取隐藏的 class 为“test”的元素

$("select :selected");//这样才是正确的 
$("select:selected").length;//不管任何时候，这个选择器都取不到元素，这个 length 必然是 0

$("input :checked").length;//不正确的用法。不管任何时候，这个选择器都取不到元素，这个length必然是0 
$("input:checked");//这样才是正确的

# vant

预览图片：
import { ImagePreview } from 'vant';
ImagePreview({images: [url], showIndex: false});

<van-overlay :show="true">
    <div class="loading" @click.stop>
      <van-loading size="36px" vertical>加载中...</van-loading>
    </div>
</van-overlay>

# Vue

vue info
vue create 项目名
vue -V 全局 vue-cli 的版本
npm list vue 当前项目与 vue 相关的依赖

beforeCreate 在这个生命周期函数中无法通过 vm 访问到 data 中的数据、methods 中配置的方法，所以这里的 this 不是 vm。
created：在这个生命周期函数中可以通过 vm 访问到 data 中的数据、methods 中配置的方法（在内存中），所以这里的 this 是 vm。
与 2.x 版本生命周期相对应的组合式 API：
beforeCreate -> 使用 setup()
created -> 使用 setup()
beforeMount -> onBeforeMount
mounted -> onMounted
beforeUpdate -> onBeforeUpdate
updated -> onUpdated
beforeDestroy -> onBeforeUnmount
destroyed -> onUnmounted
errorCaptured -> onErrorCaptured
————————————————

v-show 的直接子组件 created 不执行，要用 watch 监视传给子组件的参数来执行，$refs['child'].fun 的执行也可能不及时。

import Loading from '../components/loading'
// 方法一：name 是组件的名字
Vue.component(Loading.name, Loading)
`// 方法二：前提是 Loading 有提供 install 这个方法 `
Vue.use(Loading);

<counter v-model:count="count"></counter>
子组件： name: 'Counter',
props: ['count'],
emits: ['update:count']

<!-- 多个`v-model`绑定、 -->

<vModelText v-model:text="data1" v-model:num.numReg="numData"> </vModelText>
props:['text','num','numModifiers'],
emits:['update:text','update:num'],
this.$emit('update:num',val)
.sync 可以绑定多个父组件的变量

'@': resolve('src'),
img: "@/../static/images/quanbu",
或者 'st@tic': resolve('static'),
img: "st@tic/images/quanbu",

webpack 的 process.env 需要自己配置：  
 new webpack.DefinePlugin({
'process.env': require('../config/dev.env')
}),
vue.config.js 有模式的概念，所以不用专门设置 env，vue-cli-service serve 默认是 development。也可以直接用--mode 指定： "serve": "vue-cli-service serve --mode production",
有了模式就不用每次打包时都去更改 vue.config.js 文件了。比如在测试环境和生产环境， publicPath 参数 （部署应用包时的基本 URL） 可能不同。遇到这种情况就可以在 vue.config.js 文件中，将 publicPath 参数设置为：
publicPath: process.env.BASE_URL
设置之后，再在各个 .env.[mode] 文件下对 BASE_URL 变量 进行配置就行了，这样就避免了每次修改配置文件的尴尬。

prop 是单向绑定，不能直接更改数据，只能由父组件传输过来。可以用父组件 sync，子组件 emit 的方式修改。
解决办法：
1、可以在子组件中 声明一个中间变量（value），把父组件传过来的值(item)赋值给中间变量(value),当单选切换时修改的数据为 value,就不会报错
2、使用.sync 修饰符与$emit(update:xxx)
父组件
<comp :item.sync="item"></comp>
子组件
this.$emit('update:item',data)
————————————————
props 写在路由里，可以让组件不必通过$route 传参，实现解耦，使其不必捆绑在某些 url 或父组件里。

provide---inject 跨级传参

computed: {
tempCountPlusTempCount2() {
return this.tempcount+this.tempcount2
},
...mapState(['count','name']), // 映射 this.count 为 store.state.count
...mapState({
nameAlias: 'name', // string 映射 this.nameAlias 为 store.state.name 的值

- // 用普通函数 this 指向 vue 实例,但是在箭头函数中 this 就不是指向 vue 实例了，所以这里必须用普通哈数
  countplustempcount: function (state) {
  return this.tempcount + state.count
  },
  countplustempcount2 (state) {
  return this.tempcount2 + state.count
  }
  })
  }

1、在组件标签上绑定的事件是自定义事件，在组件模板里绑定的事件才是原生的事件。（自定义事件可以通过在子组件中通过 this.$emit 去触发，但是这样太麻烦）
2、给组件标签上的事件添加‘.native’修饰符，就可以使事件变为原生点击事件而不再是自定义事件。

el-form 的 validator 必须每一个 if-else 都有 callback，否则流程中断。
validator: (r, v, cb) => { // rule, value, callback
if (!this.form.eatstarttime || !this.form.eatendtime) {
return cb(new Error("请选择用餐日期"));
} else if (!this.form.eatstarttype || !this.form.eatendtype) {
return cb(new Error("请选择用餐类型"));
} else {
cb();
}
}
复杂属性的设置 <el-form-item  :prop="`attrList[${index}].attrv`">
单个属性的校验 this.$refs['form'].validateField('baseList', valid => {})
表单中的输入框无法输入，则要 @input=$forceUpdate() ！关键是 form 里没有预先定义这个属性！

el-input 嵌套层级太多导致无法输入时（比如在 el-form-item 中），可以使用 @input=$forceUpdate //强制刷新

el-checkbox 的勾选框颜色，不能用逗号来统一设置一组值，只能一个个值的设置：
/deep/ .el-checkbox**input.is-checked .el-checkbox**inner {
background-color:#00B09B;
border-color:#00B09B;
}
/deep/ .el-checkbox**input.is-indeterminate .el-checkbox**inner {
background-color:#00B09B;
border-color:#00B09B;
}
/deep/ .el-checkbox**input.is-checked + .el-checkbox**label {
color: #00B09B;
}
/deep/ .el-checkbox.is-bordered.is-checked{
border-color: #00B09B;
}
/deep/ .el-checkbox**input.is-focus .el-checkbox**inner{
border-color: #00B09B;
}

移动端 el-table 在数据请求后，固定列错位，解决办法就是让 table 重新布局。官方提供了 doLayout 方法。
按照这个方法在请求得到数据的时候，用 nextTick 对 table 的 DOM 重新渲染。
this.$nextTick(() => {
        // el-table加ref="multipleTable"
        this.$refs.multipleTable.doLayout();
});
试了下不生效，说明是别的问题。查看了表格中的最后一列，发现该列的宽度设置的较低，内存已经越出，导致每行错位。将该列的宽度调宽。恢复正常。

el-table 多个属性在一个 prop 里，用逗号隔开。

合并某些行或列，灵活设置合计。
objectSpanMethod({ row, column, rowIndex, columnIndex }) {
if (this.applyInfoForm.resArr && this.applyInfoForm.resArr.length) {
if (rowIndex === this.applyInfoForm.resArr.length - 1) {
if (columnIndex === 0) {
//定位到 6 行 0 列的 ID，告诉该单元格合并 1 行 4 列
return [1, 4];
} else if (columnIndex === 4) {
return [1, 1];
} else {
//定位到 6 行其他列，告诉该单元格不显示
return [0, 0];
}
}
}
}
el-table 表头样式设置 :header-cell-style="{ background: '#F3F5F9' }"
el-table 某一行样式设置 :row-class-name="tableRowClassName"
tableRowClassName({ row, column, rowIndex, columnIndex }) {
if (rowIndex == this.resList.length - 1) {
console.log(row, rowIndex);
return "last-line";
}
return ''
},
/deep/ .last-line {
font-weight: bolder !important;
}

$nextTick转化pdf：
  transToPdf(title, domID, _this) {
    const loading = _this.$loading({
lock: true,
text: '下载中',
spinner: 'el-icon-loading',
background: 'rgba(0, 0, 0, 0.7)'
});

    let element = document.getElementById(domID); // 这个dom元素是要导出pdf的div容器
    html2Canvas(element).then(function(canvas) {
      var contentWidth = canvas.width;
      var contentHeight = canvas.height;

      //一页pdf显示html页面生成的canvas高度;
      var pageHeight = contentWidth / 592.28 * 841.89;
      //未生成pdf的html页面高度
      var leftHeight = contentHeight;
      //页面偏移
      let position = 0;
      //a4纸的尺寸[595.28,841.89]，html页面生成的canvas在pdf中图片的宽高
      var imgWidth = 555.28;
      var imgHeight = 592.28 / contentWidth * contentHeight;

      var pageData = canvas.toDataURL('image/jpeg', 1.0);

      // 分页
      var pdf = new JsPDF('', 'pt', 'a4');
      // var pdf = new JsPDF('', 'pt', [contentWidth, contentHeight]); //不分页
      // pdf.addImage(pageData, 'JPEG', 0, 0, contentWidth, contentHeight);

      //有两个高度需要区分，一个是html页面的实际高度，和生成pdf的页面高度(841.89)
      //当内容未超过pdf一页显示的范围，无需分页
      if (leftHeight < pageHeight) {
        pdf.addImage(pageData, 'JPEG', 20, 0, imgWidth, imgHeight);
      } else {
        while (leftHeight > 0) {
          pdf.addImage(pageData, 'JPEG', 0, position, imgWidth, imgHeight)
          leftHeight -= pageHeight;
          position -= 841.89;
          //避免添加空白页
          if (leftHeight > 0) {
            pdf.addPage();
          }
        }
      }
      pdf.save(title + '.pdf');
      loading.close();
      _this.isDomShow = false;
    });

}

路由传递数组参数：
this.$router.push({
          path: '/irrgate-manage/audit/audit/batch',
          query: { data: JSON.stringify(this.checkedList)},
        });
this.checkedList = JSON.parse(this.$route.query.data);

// iframe 内部输入框校验（富文本）,如果跨了子域，要在父页面跟子页面都设置 document.domain,值都是域名，不要前面的 www 什么的
mounted() {
let \_this = this;
let frame = document.getElementsByClassName("ke-edit-iframe");
if (frame && frame.length) {
let w = frame[0].contentWindow; // 获取 iframe 内部 body
let b = w.document.body;
let MutationObserver =
window.MutationObserver ||
window.webkitMutationObserver ||
window.MozMutationObserver;
\_this.mutationObserver = new MutationObserver(function (mutations) {
let tmp = \_this.transHtml(); // 给 editForm.dhtml 赋值
\_this.$refs.editForm.validate((valid) => {})
});
// 开始监听 iframe 内部元素变动
\_this.mutationObserver.observe(b, {
childList: true, // 子节点的变动（新增、删除或者更改）
attributes: true, // 属性的变动
characterData: true, // 节点内容或节点文本的变动
subtree: true, // 是否将观察器应用于该节点的所有后代节点
attributeFilter: ["class", "style"], // 观察特定属性
attributeOldValue: true, // 观察 attributes 变动时，是否需要记录变动前的属性值
characterDataOldValue: true, // 观察 characterData 变动，是否需要记录变动前的值
});
}
},
beforeDestroy() {
this.mutationObserver.disconnect(); // 此处以后的不再监听
},

// 对于 editForm.content.totalScore，如何设置校验规则。
<el-col :span="12">
<el-form-item label="总分" prop="totalScore"></el-form-item>
<el-form-item prop="content.totalScore" style="margin-left: -100px" :rules="rules.totalScore">
<el-input
                v-model="editForm.content.totalScore"
                disabled
              ></el-input>
</el-form-item>
</el-col>
let validateZero = (rule, val, callback) => {
if (val == "0") {
return callback(new Error("总分不能为零!"));
} else {
return callback();
}
};
totalScore: [
{ required: true, validator: validateZero, trigger: "change" },
],

computed: {
// 控制显示的内容
computedTxt() {
return function(value) { // computed 带参数
return this.methodGetByteLen(value, 20)
}
}
}

computed 的值不能给 data 赋值，computed 时还没有 this 呢。因为 data 里的数据是在 mouted 中执行函数才获取到数据，是在 computed 之后，所以在第一次 computed 计算时，data 中数据还是空的，所以 computed 找不到 data 里的数据。
computed 里的匿名函数是找不到 this 的，function 可以。

watch 数组 list，可以 computed: {
newList(){
return JSON.parse(JSON.stringify(this.list)) // 深拷贝依赖
}
},
watch: {
newList(newVal, oldVal) {
console.log(newVal， this.list)
console.log(oldVal)
},
},

change 事件中，editForm 的属性已改变，若要拿到旧值，就得用 watch:
watch: {
'editForm.type': {
handler(oldVal, newVal) {
console.log(oldVal, newVal);
},
deep: true // 引用类型数据，需要进行深度监听模式，不然无法进行触发回调
}
},

# Token

Token 其实就是访问资源的凭证。
一般是用户通过用户名和密码登录成功之后，服务器将登陆凭证做数字签名，加密之后得到的字符作为 token。

它在用户登录成功之后会返回给客户端，客户端主要有这么几种存储方式：

1．存储在 localStorage 中，每次调用接口的时候都把它当成一个字段传给后台

2．存储在 cookie 中，让它自动发送，不过缺点就是不能跨域

3．拿到之后存储在 localStorage 中，每次调用接口的时候放在 HTTP 请求头的 Authorization 字段里

所以 token 在客户端一般存放于 localStorage、cookie 或 sessionStorage 中。

将 token 存放在 webstroage 中，可以通过同域的 js 来访问。这样会导致很容易受到 XSS 攻击，特别是项目中引入很多 第三方 js 类库的情况下。如果 js 脚本被盗用，攻击者就 可以轻易访问你的网站，webStroage 作为一种储存机制，在传输过程中不会执行任何安全标准。

XSS 攻击：cross-site Scripting (跨站脚本攻击） 是一种注入代码攻击。恶意攻击者在目标网站生注入 script 代码，当访问者浏览网站的时候通过执行注入的 script 代码达到窃取用户信息，盗用用户身份等。
网站中包含大量的动态内容以提高用户体验，比过去要复杂得多。所谓动态内容，就是根据用户环境和需要，Web 应用程序能够输出相应的内容。动态站点会受到一种名为“跨站脚本攻击”（Cross Site Scripting, 安全专家们通常将其缩写成 XSS,原本应当是 css，但为了和层叠样式表（Cascading Style Sheet,CSS ）有所区分，故称 XSS）的威胁，而静态站点则完全不受其影响。

将 token 存放在 cookie 中可以指定 httponly，来防止被 javascript 读取，也可以指定 secure ，来保证 token 只在 HTTPS 下传输。缺点是不符合 Restful 最佳实践，容易受到 CSRF 攻击。
CSRF 跨站点请求伪造(Cross-Site Request Forgery)，跟 XSS 攻击一样，存在巨大的危害性。简单来说就是恶意攻击者盗用已经认证过的用户信息，以用户信息名义进行一些操作（如发邮件、转账、购买商品等等）。由于身份已经认证过，所以目标网站会认为操作都是真正的用户操作的。CSRF 并不能拿到用户信息，它只是盗用的用户凭证去进行操作。
————————————————

# 算法

尾调用消除(Tail Call Elimination)或尾调用优化(Tail Call Optimization, TCO)。尾调用优化让位于尾位置的函数调用跟 goto 语句性能一样高，也因此使得高效的结构编程成为现实。
然而，对于 C++等语言来说，在函数最后 return g(x); 并不一定是尾递归——在返回之前很可能涉及到对象的析构函数，使得 g(x) 不是最后执行的那个。这可以通过返回值优化来解决。

递归用于解决某些问题，比如深层遍历等问题很有效，但是用不好很容易导致栈溢出错误（stack overflow），就算不发生栈溢出，使用不善则会导致严重的性能问题。

我们知道，函数调用会在内存形成一个“调用记录”，又称为“调用帧”（call frame），保存调用位置和内部变量等信息。递归导致的一系列嵌套函数的调用，会产生一系列的调用帧，所有的调用帧就形成了一个“调用栈”（call stack）。调用帧是保存在内存中的，当调用帧足够多的时候，就会出现栈溢出错误。

首先，我们来看看阶乘的递归函数：
// 仅限非严格模式
function factorial(n) {
if (n <= 1) return 1
return n \* arguments.callee(n-1)
}

// 严格模式和非严格莫是都可用
var factorial = function f(n){
if (n <= 1) return 1
return n \* f(n-1)
}
总结来说，递归有可能导致的问题主要有两个：比较差的性能问题和栈溢出错误。
什么是尾递归？如果函数尾调用自身就成为尾递归。

上述的例子，显然不属于尾递归，很明显可以看出，return 后面的语句并不只是函数的调用，还有乘法操作，故不属于尾递归。
如何将优化之前的的表达式变成只有函数的调用而不包含其它额外的操作呢？
我们就把函数返回的结果记为 total，那么不妨在函数 factorial 加上第二个参数 total，即把函数此次调用返回的结果当作第二个参数。

# 尾递归可以保证函数执行时内存中始终只保留一个调用帧，这将永远不会发生栈溢出错误，也不会造成差的性能问题。前提是尾部只有一个函数调用，那么递归时就可以都覆盖到这个函数帧上。

# 尾调用优化，尾调用是指某个函数的最后一步（不一定是出现在函数的尾部）是“纯粹地”调用另一个函数；而尾调用优化就是只保留内部函数的调用帧，节省内存。尾递归，尾调用自身，相当于普通的递归，由于只存在一个调用帧，不会发生“栈溢出”。

// 阶乘尾递归之前
function factorial(n) {
if (n <= 1) return 1
return n \* factorial(n-1)
}

# 数学归纳法必须先确保 1，2 都正确，才能假定 n=m 时成立，证明 n=m+1 也成立。

// 尾递归之后
function factorial(n, total = 1) {
if (n <= 1) return total
return factorial(n-1, n \* total)
}

将著名的斐波那契数列进行尾递归优化：
优化之前：
function getFibo(n) {
if (n <= 2) return 1
return getFibo(n-1) + getFibo(n-2)
}
很明显，这不是尾递归。

首先结果依赖前两项计算的结果，所以函数需要再额外添加两个参数，这两个参数分别是前两项的计算结果，类比上面的阶乘例子，我们暂且把上一项的计算结果和本次的计算结果分别记为 a1 和 a2，由于本次计算的结果被我们记为了 a2，所以当 n<=2 时，return 后面应该是 a2 了，即第一行和第二行代码就变为了：

function getFibo(n, a1, a2){
if (n <= 2) return a2
类比上面的例子，也很容易得到第三行的代码：首先第一个参数 n - 1 不变，因为改变后的函数的第一个参数是 n。接下来第二个和第三个参数是我们添加上去的，最简单直接的方法还是令 n = 3，当 n = 3 时，上一次结算的结果由第二行代码可知为 a2，所以 return 后面的函数的第二个参数确定下来了，即为 a2，那么当 n = 3 时，本次计算的结果是多少呢，由第一行和第二行代码结合来看，可知当 n = 1 时的上一次计算结果为 a1，那么我们可得当 n = 2 时的计算结果为 a2，故 return 后面的表达式的第三个参数就为 a1 + a2，所以第三行代码就变成了：
return getFibo2(n-1, a2, a1 + a2); **_ // 要保证尾调用里含有计算表达式，同时用 if 语句保证开头常量正确，再归纳总结。 _**

function getFibo(n, a1 = 1, a2 = 1){
if (n <= 2) return a2
return getFibo2(n-1, a2, a1 + a2)
}
————————————————
原文链接：https://blog.csdn.net/weixin_40920953/article/details/87392754

# POST/GET

1.前端向后端传输数据时，有 get 和 post 两种：
如果是 get 传输，直接传在 url 后；如果是 post 传输，则在请求体 body 中传输。HTTP 请求中的 get 请求和 post 请求参数的存放位置是不一样的。

2.在 body 中的数据格式（post 请求）：
一种是 json 数据格式，另一种是 字符串。具体要用哪种格式取决于后端入参的格式

如果后端接收 json 数据类型，post 的 headers 需要设置 { ‘content-type’: ’application/json’ }，传给后端的数据就形如 { ‘name’:’edward’, ‘age’:’25’ }
如果后端接收的是（表单）字符串类型，post 的 headers 需设置 { ‘content-type’: ’application/x-www-form-urlencoded’ }，传输给后端的数据就形如 ‘name=edward&age=25’
multipart/form-data(一般用来上传文件)
为什么一般是给 post 请求设置 content-type,get 请求不需要设置吗？
get 请求一般没有消息体 body，而 content-type 是用来指定消息体的格式的

3.接口数据传输方式 form data、payload 和 Query String Parameters
POST 提交数据有两种数据传输方式，这两种方式浏览器是通过 Content-Type 来进行区分：
如果是 application/json 或 multipart/form-data 的话，则为 request payload；json 格式
如果是 application/x-www-form-urlencoded 的话，则为 formdata 方式；字符串
如果是 GET 请求，则为 Query String Parameters

qs.stringfy()是将对象序列化成 URL 的形式，以&进行拼接。安装 axios 即可使用 qs。
axios 默认数据格式为 json,所以： 1.当后端需要接收 json 格式的数据时,post 请求头不需要设置请求头，数据格式也不需要我们去转换(若数据已经是 json)； 2.当后端需要接收字符串格式的数据时，我们需要给 post 请求头设置{ ‘content-type’: ’application/x-www-form-urlencoded’ }，
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';
这个时候如果我们传的入参是一个 js 对象，这时候我们就需要用 qs 转换数据格式

let data = { name: 'edward', age: '25' }
前者：JSON.stringfy(data) // ”{ 'name' : 'edward' , 'age' : '25' }”
后者：qs.stringfy(data) // 'name=edward&age=25'
