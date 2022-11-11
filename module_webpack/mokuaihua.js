/**
 * 
Node.js模块化的基本原理的五个步骤：

Resolving：找到待引用的目标模块，并生成绝对路径。
Loading：判断待引用的模块内容是什么类型，它可能是.json文件、.js文件或者.node文件。  同步导入，完成标志loaded。
Wrapping：顾名思义，包装被引用的模块。通过包装，让模块具有私有作用域。
Evaluating：被加载的模块被真正的解析和处理执行。
Caching：缓存模块，这让我们在引入相同模块时，不用再重复上述步骤。

模块也就是一个普通对象，只不过结构中有几个特殊的属性，如id、parent、filename、children等：

每个module都有id属性，通常这个属性值是模块的完整路径，通过这个值Node.js可以标识和定位模块的所在位置。但是在这儿并没有具体的模块，我们只是在命令行中输出了module的结构，所以为默认的<repl>值（repl表示交互式解释器）。

paths就是一堆系统绝对路径，这些路径表示了所有目标模块可能出现的位置，并且它们是有序的，这意味着Node.js会按序查找paths中列出的所有路径，如果找到这个模块，就输出该模块的绝对路径供后续使用。
NodeJS定义了一个特殊的node_modules目录用于存放模块。例如某个模块的绝对路径是/home/user/hello.js，在该模块中使用require('foo/bar')方式加载模块时，则NodeJS依次尝试使用以下路径：
 /home/user/node_modules/foo/bar
 /home/node_modules/foo/bar
 /node_modules/foo/bar

与PATH环境变量类似，NodeJS允许通过NODE_PATH环境变量来指定额外的模块搜索路径。NODE_PATH环境变量中包含一到多个目录路径，路径之间在Linux下使用:分隔，在Windows下使用;分隔。例如定义了以下NODE_PATH环境变量：
 NODE_PATH=/home/user/lib:/home/lib
当使用require('foo/bar')的方式加载模块时，则NodeJS依次尝试以下路径：
 /home/user/lib/foo/bar
 /home/lib/foo/bar

当模块的文件名是index.js，加载模块时可以使用模块所在目录的路径代替模块文件路径，因此接着上例，以下两条语句等价。
var cat = require('/home/user/lib/cat');
var cat = require('/home/user/lib/cat/index');
这样处理后，就只需要把包目录路径传递给require函数，感觉上整个目录被当作单个模块使用，更有整体感。

Node.js之所以能够找到cat目录下的index.js文件，是因为默认的模块引入规则是当具体的文件名缺失时寻找index.js文件。我们也可以更改引入规则(通过修改package.json），比如把index -> main:
package.json内容如下：
{
    "name": "cat",
    "main": "main.js"
}
如此一来，就同样可以使用require('/home/user/lib/cat')的方式加载模块。NodeJS会根据cat包目录下的package.json找到入口main.js所在位置。


如果只想要在项目中引入某个模块，而不想立即执行它，可以使用require.resolve方法，它和require方法功能相似，只是并不会执行被引入的模块方法：

当我们用require引用一个模块，首先Node.js会去匹配是否有.js文件，如果没有找到，再去匹配.json文件，如果还没找到，最后再尝试匹配.node(C++插件)文件。但是通常情况下，为了避免混淆和引用意图不明，可以遵循在引用.json或.node文件时显式地指定后缀，引用.js时省略后缀

通过require('module').wrapper可以打印出wrapper属性：
[ '(function (exports, require, module, __filename, __dirname) { ','\n});' ]
Node.js不会直接执行文件中的任何代码，但它会通过这个包装后的function来执行代码，这让我们的每个模块都有了私有作用域，不会互相影响。

ES Module导出的是一份值的引用，CommonJS则是一份值的拷贝。也就是说，CommonJS是把暴露的对象拷贝一份，放在新的一块内存中，
每次直接在新的内存中取值，所以对变量修改没有办法同步；而ES Module则是指向同一块内存，模块实际导出的是这块内存的地址，每当用到时根据地址找到对应的内存空间，这样就实现了所谓的“动态绑定”。

 */


/**
 * import和export语句都是只能放在代码的顶层，也就是说不能写在函数或者if代码块中。值得一提的是，import语句有提升的效果。

【入口模块】首先进入入口模块，在模块地图中把入口模块的模块记录标记为“获取中”（Fetching），表示已经进入，但没执行完毕，
import * as a from './a.mjs' 执行，进入a模块，此时模块地图中a的模块记录标记为“获取中”
【a模块】import * as b from './b.mjs' 执行，进入b模块，此时模块地图中b的模块记录标记为“获取中”，
【b模块】import * as a from './a.mjs' 执行，检查模块地图，模块a已经是Fetching态，不再进去，
let b = '原始值-b模块内变量' 模块记录中，存储b的内存块初始化，
console.log('b模块引用a模块：', a) 根据模块记录到指向的内存中取值，是{ a:}
b = '修改值-b模块内变量' 模块记录中，存储b的内存块值修改
【a模块】let a = '原始值-a模块内变量' 模块记录中，存储a的内存块初始化，
console.log('a模块引用b模块：', b) 根据模块记录到指向的内存中取值，是{ b: '修改值-b模块内变量' }
a = '修改值-a模块内变量' 模块记录中，存储a的内存块值修改
【入口模块】console.log('入口模块引用a模块：',a) 根据模块记录，到指向的内存中取值，是{ a: '修改值-a模块内变量' }

总结一下：和commonJS一样，循环引用要解决的无非是两个问题，保证不进入死循环以及输出什么值。
ES Module来处理循环使用一张模块间的依赖地图(minipack-explain Git)来解决死循环问题，
标记进入过的模块为“获取中”，所以循环引用时不会再次进入；使用模块记录，标注要去哪块内存中取值，将导入导出做连接，解决了要输出什么值。
 */