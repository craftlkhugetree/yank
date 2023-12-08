craftlkhugetree
# Git
git merge 会让2个分支的提交按照提交时间进行排序，并且会把最新的2个commit合并成一个commit。最后的分支树呈现非线性的结构
git reabse 将dev的当前提交复制到master的最新提交之后，会形成一个线性的分支树

git svn clone -r HEAD --username=liken svn://160.255.0.56/01module/seatreser/03code/seat_v2_pc

git show（查看上一次修改）
git svn rebase === git pull

git clean -fd
git checkout -- 要清除的文件 // 对新增文件无效
git checkout . // 对新增文件无效

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

git log --since=2022-04-27 --until=2023-02-01 --author="liken" --pretty=tformat: --numstat | awk '{ add += $1; subs += $2; loc += $1 - $2 } END {printf "added lines: %s, removed lines: %s, total lines: %s\n", add, subs, loc }'

git stash save ''
git stash list
git stash apply stash@{0} 不像 pop 一样删除
git stash show stash@{0} 加上-p 可以看详细差异

ssh-keygen -t rsa -C "345823102@qq.com"
ssh -T git@github.com // 测试

Git指定文件不更新
对于git指定文件不更新，一般通过添加.gitignore文件忽略指定文件或文件夹，但是这种方式要求文件未被跟踪，若果文件已被跟踪，先要取消跟踪：

git rm --cached 文件名  # 文件
git rm --cached -r 文件夹  # 文件夹
取消跟踪后添加到.gitignore文件中即可。

如果文件已经被跟踪，只是不想提交后续的变更，可以使用以下方式：
git update-index --assume-unchanged 文件名

如果想取消，则执行：
git update-index --no-assume-unchanged 文件名
————————————————
git ls-files -v | grep '^h\ '
git ls-files -v | grep '^h\ ' | awk '{print $2}'
git ls-files -v | grep '^h\ ' | awk '{print $2}' | xargs git update-index --no-assume-unchanged  
# npm

npm uninstall element-ui
npm install element-ui@2.15.8 -s

npm list -g --depth 0 查看 node 安装位置和版本

npm config get cache // 查看本地缓存
npm config list
npm config ls -l 查看所有
npm config set registry https://registry.npm.taobao.org

npm ls; npm list 查看安装哪些包 npm ls package 或者 npm info package

npm root 当前项目安装位置
npm root -g
npm outdated package 查看是否过时

npm view react versions 查看版本信息
如果改了 package.json，且 package.json 和 lock 文件不同，那么执行 npm i 时 npm 会根据 package 中的版本号以及语义含义去下载最新的包，并更新至 lock。如果两者是同一状态，那么执行 npm i 都会根据 lock 下载，不会理会 package 实际包的版本是否有新。

npm uninstall element-ui -S  
npm install element-ui@2.15.8 -S // 2.15.9 的 el-date-pick 有 placement 问题
————————————————
npm 的缓存机制到底是怎么样的呢？现在我们就来总结下：
在安装资源的时候，npm 会根据 package-lock.json 中的 integrity、version、name 信息生成一个唯一的 key。
然后用这个 key 经过 SHA256 算法生成一个 hash，根据这个 hash 前四位 在 index-v5 目录中找到对应的缓存文件，该缓存文件中记录着该包的信息。
根据该文件中的信息\_shasum，我们在 content-v2 中去找对应的压缩包，这样就找到了对应的缓存资源的源码了。
最后再将该压缩包解压到 node_modules 中，节省了网络开销和安装时间。

lock 文件发生冲突了怎么办？
A: 首先，我们应该尽量避免冲突，在我们需要更新 package.json 文件的时候，不要手动去修改 package.json 中的依赖，使用 npm 命令更新/安装依赖；比如：npm update 升级小版本、npm install @version 升级大版本、npm uninstall 删除依赖。同时，任何时候都不要手动修改 package-lock.json 文件。
在遇到 lock 文件冲突的时候，那么应该先手动解决 package.json 的冲突，然后执行 npm install --package-lock-only，让 npm 自动帮你解冲突。

# vscode
alt+f5 可以在未提交的修改间跳转，类似vim的`[]

要打开正则按钮才能使用： ('|")9100002(.\*?)('|") `${this.util.webUserID}$2`

没有配置前 如果代码过长，vetur 会把尖括号整理到第二行换行， "prettier.htmlWhitespaceSensitivity": "ignore", //包裹文字时候结束标签的结尾尖括号掉到了下一行
感叹号后回车，快捷生成 html

ctrl + shift + o 查找函数、css 类名、变量等
ctrl + p 打开文件
ctrl + i 触发关联文字

div.类名 + 回车

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

// 回到顶部
document.getElementsByTagName('html')[0].scrollTop = 0
1.document.body.scrollTop=document.documentElement.scrollTop=0 //页面滚动到顶部
2.document.body.scrollIntoView(true/ false)
3.document.getElementById('site-nav').scrollIntoView()
下面是一个小的例子：
// 每次切换标题栏都从第一个开始展示
document.querySelector('.infinite-scroll-component').scrollTo(0,0)
//选中当前想要回到 dom 元素，使用 scrollTo(0,0),实现能够在切换中始终保持第一栏在顶部显示。

# jquery

1、原生 js 获取的 dom，通过 id 获取到的就是当前对应的节点，而 通过 class 获取返回的是 HTMLCollection 对象。HTMLCollection 对象类似包含所有 HTML 元素的一个数组。通过索引获取到自己想要的节点。
2、jQuery 哪种方式获取 dom 返回的都是一个数组。可以通过 length 检查是否存在当前节点。可以直接 jqdom.click();而原生需要循环每一个来点击。
3、原生 js 获取的 dom 与 jQuery 获取的 dom 转换。
var jqdom = $('.demo');// jquery 获取的 dom
var dom1 = jqdom.eq(0)[0]; // 转换成原生节点
var dom2 = jqdom.get(0);// 转换成原生节点

        var jsdom = document.getElementsByClassName('demo'); //原生获取的节点
        var jsdom1 = $(jsdom[0]);//转换成jquery的dom对象

————————————————

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

# 原型链 constructor

var obj = {};
obj.constructor //ƒ Object() { [native code] }
obj.constructor === Object //true

var arr = [];
arr.constructor //ƒ Array() { [native code] }
arr.constructor === Array //true

function Fun(){
console.log('function');
}
**\_ fun 本身是没有 construtor 的，它的**proto**指向 Fun.prototype， 而 Fun.prototype.constructor 指向 Fun，所以顺着原型链 fun.constructor === Fun \_**
var fun = new Fun(); //实例化
fun.constructor //ƒ Fun(){console.log('function')} 【打印出来的引用是 Fun 函数，说明 fun 的引用是 Fun 函数】
Fun.constructor //ƒ Function() { [native code] } 【打印出来的引用是 Funcion 函数，说明 Fun 的引用是 Function 函数】
fun.constructor === Fun //true 【再次证明 fun 的 constructor 属性引用了 fun 对象的构造函数】
fun.constructor === Fun.constructor //false

constructor 常用于判断未知对象的类型,如下:
function isArray (val){
var isTrue = typeof val === 'object' && val.constructor === Array;
return isTrue?true:false;
}
或者用 new obj.constructor()构造函数新建一个空的对象，而不是使用{}或者[],这样可以保持原形链的继承。

# 小程序

openid 不能用 ajax 获取，得是 url 的方式，后面加上登录页：
const redirectUri = encodeURIComponent(window.location.href);
let url = `https://open.weixin.qq.com/connect/oauth2/authorize?response_type=code&scope=snsapi_userinfo&state=123&redirect_uri=${redirectUri}`
window.location.href = url;

function getUrlCode(name) {
return (
(new RegExp("[?|&]" + name + "=" + "([^&;]+?)(&|#|;|$)").exec( // exec 得到的数组零元素为匹配串，同时括号里的内容也会被 exec 保存下来
location.href
) || [, ""])[1].replace(/\+/g, "%20") || null  
 // 调用 decodeURIComponent 函数之前要先把+替换为%20，在对 URL 进行编码时，若 URL 中存在空格，则空格会被转换成了＋，导致对方识别不成空格。
);
}
+-------------------+---------------------+
| Part | Data |
+-------------------+---------------------+
| Scheme | https |
| User | bob |
| Password | bobby |
| Host | www.lunatech.com |
| Port | 8080 |
| Path | /file;p=1 |
| Path parameter | p=1 |
| Query | q=2 |
| Fragment | third |
+-------------------+---------------------+

https://bob:bobby@www.lunatech.com:8080/file;p=1?q=2#third
\_**/ \_/ \_**/ \_**\*\***\_**\*\***/ \_\_/\_**\_\_**/ \_/ \_**/
| | | | | | \_/ | |
Scheme User Password Host Port Path | | Fragment
\_\*\***\*\***\*\***\_\_**\*\***\*\***\*\***/ | Query
| Path parameter
Authority

# 路径

HTML 代码中的相对路径就是以本 HTML 文件所在目录开始计算。

- JS 文件内的相对路径是以引用该 js 文件的页面为基准，也是从 HTML 文件所在位置开始计算的。
  CSS 文件内如果写相对路径，是基于 CSS 文件本身的，跟谁引入了这个 CSS 无关。

总结一下
http 缓存可以减少宽带流量，加快响应速度。
关于强缓存，cache-control 是 Expires 的完全替代方案，在可以使用 cache-control 的情况下不要使用 expires
关于协商缓存,etag 并不是 last-modified 的完全替代方案，而是补充方案，具体用哪一个，取决于业务场景。
有些缓存是从磁盘读取，有些缓存是从内存读取，有什么区别？答：从内存读取的缓存更快。
所有带 304 的资源都是协商缓存，所有标注（从内存中读取/从磁盘中读取）的资源都是强缓存。

# figma

Ctrl+Shift+?

Ctrl+/ quick action
I pick color

双击 menu 前#，定位到设计图
/ menu parent
Enter menu children
Tab menu next sibling
Shift+Tab menu previous sibling
Alt+L 收起所有 menu

n/Shift+n Home/End next
Shift+1/2 Ctrl+0/+/- zoom
ctrl + alt + \ 隐藏其余鼠标
ctrl + shift + \ 隐藏左侧栏

开发模式
shift + D 切换开发
ctrl + click 选中元素
h hand-tool图标拖动
# moment

moment.utc(毫秒).format('HH:mm:ss')

编程语言的发展历史和适用范围，C 语言/C++一直是系统级编程的不二之选，在操作系统，编译器，网络，数据库，高性能服务器端软件等领域无人可以争锋，也许在将来，Rust 能对他们产生威胁吧。在 Web 编程领域则是百花齐放，PHP, Python, Ruby 各自争鸣，Java 在企业应用开发方面表现抢眼，以 Spring 为首的生态吸引了无数程序员。由于网络编程的瓶颈不再是 CPU，而是 I/O，所以 Java 也在一些服务器端的软件上突破了 C/C++的重围。在大数据领域，Java 一马当先，完成了数据的收集，存储，计算，Python 等语言在此基础上发挥了自己擅长的本事：数据分析。Go 语言则令人吃惊地渗入到了云计算和后端编程领域，前途不可限量。 总的来说，我觉得有这两个需要注意的点：1. 每门语言都有自己的特点和适用的范围，并没有什么高下之分。2. 应用层编程变化剧烈（JS 尤其为甚），底层编程变化比较小。

用退格键删掉的 span 标签，因为 span 后面的&nbsp; 结果继续输入时，在谷歌浏览器上变成了 font 标签， 而 span 和 font 的 nodeType 都是 1， 光标在 span 内部时或用 Delete 删掉时，不会变 font。
搜索了一下竟然是因为谷歌浏览器的翻译功能？？？？？？？？？？？
所以谨记纵使不用这翻译功能也要记得勾选“一律不翻译此网站”。。。。免得被坑。
在网上还搜到有个方法会避免此错误的发生，就是在 html 页面的开头
写这样<html lang="zh-CN">而不是<html lang="en">



# git实战，合并项目
1. 想和远程仓库同步下当前的分支，但当前分支上有很多还没有commit的修改。
一是用git stash apply恢复，但是恢复后，stash内容并不删除，你需要用git stash drop来删除；另一种方式是用git stash pop，恢复的同时把stash内容也删了。
注意:git stash不能将未被追踪的文件(untracked file)压栈,也就是从未被git add过的文件,也就是你在使用git status命令看到的提示Untracked files所列出的文件,所以在git stash之前一定要用git status确认没有Untracked files。
————————————————
2. 现在在dev分支上改代码，改了一周，还没有改完，要紧急处理下feature分支上的一个bug。
3. 在把自己当前分支的commit rebase到另一个分支上的时候发生了冲突，而冲突的是个二进制文件，只想保留另一个分支的版本。
日常摘下其他分支的commit放到另外个分支上的技巧（cherry-pick）
# 主要讲cherry-pick的使用，先切到要摘commit的分支上，输出所有commit日志
git log
# 之后你找到你要pick的commit的hash值，直接复制下来,然后切换到目标分支
git checkout [other-branch-name]
# 这时候你处于other-branch之下，使用cherry-pick命令
git cherry-pick [commit-hash]
# 这时候你会发现已经把另外个分支的commit摘到你当前的分支上了。这种场景可以应对一些突发情况，

# git提供了git reset 以及 git revert两种命令
# 在使用git reset命令前，先了解一个概念：HEAD，HEAD 是当前分支引用的指针，它总是指向该分支上的最后一次提交（你代码没commit那就只是在暂存区）。
# 回到具体的某一次提交
git reset --hard <commit_id>
# 回到具体的上一次提交
git reset --hard HEAD^
# 如果要强行同步到远程分支，那么上述命令可以配合以下命令使用（看清楚场景，不要直接强行push到主干分支上去）
git push -f 
git push --force
# push目的主要是把远程分支reset历史提交，放弃之后所有的提交。
# git revert 命令更像是redo，就是把历史改变的代码，重新redo回去，最终生成个新的commit节点，这种一般用于回滚代码但不想删除git历史提交记录的情况
git revert -n <commit_id>
# 使用上述命令，相当于redo代码，所以会有冲突问题，如果出现冲突需要解决完重新commit。


4. 已经知道两个commit A和B，怎么判断B是否在A的历史版本里。
git log --since='n weeks'
git log -n2 --oneline
git log --all  查看所有分支的演进历史
git log --all --graph

5. 已经明确了B在A的历史版本里，但是查看A对应的内容时却没有找到B的修改，可能有哪些原因。
6. 在windows上克隆了一个仓库，刚克隆完立刻用git status和git diff检视，就发现有个文件被改动了，尝试了几次都是一样的表现，可能是什么原因造成的。
可能的原因
1) 文件属性问题
首先，我们需要排查一下文件属性是否发生了变化。某些系统中，文件的权限、时间戳或者换行符等属性会影响Git的文件检查机制。如果源仓库和克隆仓库的环境不同，可能会导致文件属性差异，进而导致文件显示为已修改的状态。

解决方案：通过以下命令将文件属性还原为源仓库的属性。
$ git ls-files -z | xargs -0 git restore --staged
$ git restore

2) 换行符问题
Git在处理文本文件时，会根据不同平台的换行符进行处理。如果源仓库使用了不同于克隆环境的换行符，那么Git会将这些差异作为文件修改的一部分。
解决方案：使用Git的autocrlf配置将文件换行符转换为克隆环境的格式。
$ git config --global core.autocrlf true

3) 文件系统问题
某些文件系统在存储文件时，可能会修改文件的时间戳或元数据，这也会导致Git识别为文件已修改。
解决方案：将文件系统的更改限制为只读(mount filesystem as read-only)。

总结
在Git克隆后，文件直接显示为已修改的状态是一个常见的问题。可能的原因包括文件属性问题、换行符问题以及文件系统问题。为了避免这种情况的发生，我们可以通过还原文件属性、调整换行符配置以及限制文件系统更改等方法进行解决## 进一步解决方法

除了上述提到的解决方案，还有一些其他方法可以进一步解决克隆后文件直接显示为已修改状态的问题。

1) 使用git checkout命令
可以尝试使用git checkout命令将文件恢复到与源仓库一致的状态。

$ git checkout -- .
这个命令会将所有文件还原为克隆前的状态，即丢弃所有未提交的更改。

2) 检查文件编码问题
有时文件的编码问题也可能导致文件显示为已修改的状态。可以尝试通过检查文件编码以及转换编码来解决问题。

$ file -i file1.txt
file1.txt: text/plain; charset=utf-8

$ iconv -f utf-8 -t utf-8 file1.txt > file1.txt.tmp && mv file1.txt.tmp file1.txt
上述命令中，file -i用于检查文件编码，iconv用于进行编码转换。

3) 使用.gitattributes文件
可以在仓库中添加一个.gitattributes文件来显式指定文件的特定属性。这样可以避免由于环境差异导致的文件显示为已修改的状态。

在.gitattributes文件中，使用特定的属性指示符来定义文件属性，比如换行符类型、文件编码等。

*.txt   -text eol=lf
*.csv   -text
*.md    text diff=markdown
上述示例中，*.txt文件被定义为文本类型，换行符类型为lf；*.csv文件被定义为二进制类型；*.md文件被定义为文本类型，并使用Markdown格式进行差异对比。

7. 有两个分支A和B，差异非常大，现在想把B分支的文件内容变得和A完全一样，可以不保留B原本的历史记录。如果要保留B原本的历史记录又该怎么做。
大概流程
1 进入 dayjs 文件夹，将 moment 作为远程仓库添加到 dayjs 来；
2 合并添加的库 moment 到原本的 dayjs 项目；
3 创建 mtool 文件夹，把 moment 的 develop 分支合并到 mtool 文件夹；
4 完成 moment 转移提交；
5 完成 dayjs 文件的迁移；
6 完成项目合并并查看历史记录。

测试步骤
进入 dayjs 文件夹，将 moment 作为远程仓库添加到 dayjs 来
使用命令：
git remote add -f moment D:/davidsu/Desktop/GitlabTest/full/moment
// -f 的作用是在添加后立刻 fetch。
// D:/davidsu/Desktop/GitlabTest/full/为需要被合并 moment 项目的绝对路径 。

合并添加的库 moment 到原本的 dayjs 项目
使用命令（注意分支名）：
git merge --strategy ours --no-commit --allow-unrelated-histories moment/develop

命令说明：
git merge 为合并分支:
–strategy ours 解析合并，在合并时，如果遇到冲突，以我的为准。（本例是在 dayjs 中合并 moment，遇到冲突以 dayjs 的为准）。结果就是：
moment 的历史记录被合并到 dayjs 的历史记录中。
moment 的文件树被读取并和 dayjs 的文件树比对进行冲突解析。
–no-commit 合并解析完成后中断，停留在最后的提交步骤之前。
只要你还没 commit，那么 merge 的结果就暂时保存在缓存区中，只有完成提交步骤合并才算彻底完成（文件树被正式改变）。
–allow-unrelated-histories 允许合并无关的历史记录。
如果不添加此选项，可能会出现fatal: refusing to merge unrelated histories错误。

创建 mtool 文件夹，把 moment 的 develop 分支合并到 mtool 文件夹
使用命令：
mkdir mtool    # 创建文件夹
git read-tree --prefix=mtool/ -u moment/develop
命令说明：
git read-tree 给定的树信息读入索引

–prefix 用于指定文件树读取后保存的路径，相对于当前路径并且一定要追加 /。
-u 是说在读取后更新 index，使得 working tree 与 index 保持同步。
这个命令的意义在于，之前的git merge命令可能会在解决冲突的时候，把 moment 的文件树弄得比较混乱，再使用read-tree去修复一下。

总结
以上，完成了两个项目合并到一个项目的示例接操作演示，后续有更多的项目想要合并，可以类似。

本示例使用步驟

进入 dayjs
git remote add -f moment D:/davidsu/Desktop/GitlabTest/full/moment
git merge –strategy ours –no-commit –allow-unrelated-histories moment/develop
mkdir mtool
git read-tree –prefix=mtool/ -u moment/develop
git commit –message ‘完成 moment 的迁移，新目录为 mtool’
mkdir dtool （还在 dayjs 下面）
拷贝 dayjs 的原始项目文件（除了 .git/ 和 .gitignore 以外）至 dtool/；
拷贝完之后，可以把原本文件夹名 dayjs 改为 timetools；
把此时 mtool 下的.gitignore 文件内容，整理合并到 timetools 下的.gitignore 文件中去。
合并完之后，再全部添加提交一次，做为整合操作的记录：git add –all; git commit –message ‘迁移整合完成！’

链接：https://www.jianshu.com/p/f592691062c4


8. 有个本地仓库，希望git fetch的时候从github上的远程仓库里拉取数据，git push的时候往gitlab的远程仓库里推送数据。

方法一：多个 origin
git remote add origin_main git@github.com:yeszao/dnmp.git
第一种方法是，在原 origin 远程仓库地址的基础上，再加一个地址，也就是主仓库地址，例如加一个origin_mian，如下：
git remote -v
这样我们总共就配置了 4 个地址，2 个 push 和 2 个 pull：
在推拉代码的时候就可以这样：
git push origin master
git pull origin_main master

方法二：一个 origin（推荐）

另外一种办法就是，我们只用一个 origin，设置主仓库为 fetch 地址，个人仓库为 push 地址：
git remote set-url origin git@github.com:yeszao/dnmp.git
git remote set-url --add --push origin git@github.com:MY_REPOSITY/dnmp.git

再用 git remote 命令看看配置的地址：
origin git@github.com:MY_REPOSITY/dnmp.git (push)
origin git@github.com:yeszao/dnmp.git (fetch)
这样推拉代码就 很简单了：
git push origin master
git pull origin master

9. 怎么把A仓库的某个commit修改应用到B仓库分支上。
cherry-pick
10. 改了一周的代码，没有commit，在处理其他事情的时候使用git stash保存了下。后面git stash pop的时候却一直报错，提示有个object已经corrupt，要怎么把这一周的工作给恢复出来。
第1步：备份.git(实际上，我在更改某些步骤的每一步之间进行此操作，但是使用新的复制到名称，例如.git-old-1，.git-old-2等) ：

cp -a .git .git-old
步骤2：执行
git fsck --full
您将收到此错误消息

例如：
错误：目标文件.git / objects / 0A / dsdadadadaaeer4r3434343434334f为空

步骤3：删除上述空文件，该文件位于您的.git/objects/文件夹中。继续删除空文件。

步骤4：删除所有空文件后，现在运行
git fsck --full
步骤5：尝试git reflog。由于HEAD损坏而失败。

步骤6：手动获取reflog：
git log origin/master..HEAD
步骤7：请注意，从步骤6中我们了解到HEAD当前指向最后的提交。因此，让我们尝试仅查看父提交：
git show commit-id
步骤8：所以现在我们需要将HEAD指向commit-id
git update-ref HEAD commit-id