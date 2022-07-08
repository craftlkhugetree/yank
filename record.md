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
npm list -g --depth 0 查看node安装位置和版本

npm config get cache // 查看本地缓存
npm config list
npm config ls -l 查看所有

npm 的缓存机制到底是怎么样的呢？现在我们就来总结下：
在安装资源的时候，npm 会根据 package-lock.json 中的 integrity、version、name 信息生成一个唯一的 key。
然后用这个 key 经过 SHA256 算法生成一个 hash，根据这个 hash前四位 在 index-v5 目录中找到对应的缓存文件，该缓存文件中记录着该包的信息。
根据该文件中的信息_shasum，我们在 content-v2 中去找对应的压缩包，这样就找到了对应的缓存资源的源码了。
最后再将该压缩包解压到 node_modules 中，节省了网络开销和安装时间。

lock文件发生冲突了怎么办？
A: 首先，我们应该尽量避免冲突，在我们需要更新 package.json 文件的时候，不要手动去修改 package.json 中的依赖，使用 npm 命令更新/安装依赖；比如：npm update升级小版本、npm install @version 升级大版本、npm uninstall 删除依赖。同时，任何时候都不要手动修改 package-lock.json 文件。
在遇到 lock 文件冲突的时候，那么应该先手动解决 package.json 的冲突，然后执行 npm install --package-lock-only，让 npm 自动帮你解冲突。

# vscode

没有配置前 如果代码过长，vetur 会把尖括号整理到第二行换行， "prettier.htmlWhitespaceSensitivity": "ignore", //包裹文字时候结束标签的结尾尖括号掉到了下一行
感叹号后回车，快捷生成 html

ctrl + shift + o 查找函数类名
ctrl + p 打开文件

# js  node
module和exports是Node.js给每个js文件内置的两个对象。module.exports是一个空对象，exports是对这个对象的引用。
module.exports === exports，若直接赋值exports = {ex: 1}则二者不再相等；若属性赋值exports.ex = 1，则二者继续相等。
*require引入的对象本质上是module.exports*
import [任意名称] 引入的是module.exports.default； import * 引入的是module.exports,其中包括default

export default在同一个文件中只可存在一个；引入的时候 export导出的加{} 而export default导出的可定义为随便一个名称，
合并为 import all, {arr, obj} from './test.js' 还可以是 import {default as all} from "@/assets/options"
* 或者const { default: all, arr, obj } = require('./test.js')  ES的默认导出对应 CommonJS 模块导出对象的 default 属性，但是如果CJS中没定义default就麻烦了。
解决办法：
webpack在使用侧导入的‘默认导出’实际上是一个 Getter 函数，读取值的时候访问了其自身的 a 属性，如果 __esModule 为 true 那么 a 就是 module.exports.default，Getter 调用也返回 module.exports.default，否则 a 的值和 Getter 返回值就是 module.exports。所以在 Webpack 中这样用是没有问题的，Webpack 会根据 __esModule 标识来自动处理 CommonJS 的模块导出对象，兼容 ES 模块中的导入。

(1)require/exports 是运行时动态加载，import/export 是静态编译
CommonJS 加载的是一个对象（即 module.exports 属性），该对象只有在脚本运行完才会生成。而 ES6 模块不是对象，它的对外接口只是一种静态定义，在代码静态解析阶段就会生成。
(2)require/exports 输出的是值的拷贝。也就是说，一旦输出一个值，模块内部的变化就影响不到这个值。
import/export 模块输出的是值的引用。JS 引擎对脚本静态分析的时候，遇到模块加载命令import，就会生成一个只读引用。等到脚本真正执行时，再根据这个只读引用，到被加载的那个模块里面去取值。
(3)import/export 只能在模块顶层使用，不能在函数、判断语句等代码块之中引用；require/exports 可以。
   import fs from  './webUtils.js';
   function a(){
    import {e1} from './webUtils.js';
    console.log(e1)
   }
   a();
   console.log(fs())
程序报错：Uncaught SyntaxError: Unexpected token '{'
前面提到过 import/export 在代码静态解析阶段就会生成，不会去分析代码块里面的 import/export，所以程序报语法错误，而不是运行时错误。
(4)严格模式是采用具有限制性JavaScript变体的一种方式
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
import('/modules/my-module.js') ```//动态导入，这种Promise的异步导入，可以导入所有，而不仅仅是default```
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

```export * from './options'  这个opt.js文件不能被import opt from "@/assets/opt"只能import * as opt from "@/assets/opt"，而且导入的opt没有default```
ES6 模块的设计思想是尽量的静态化，使得编译时就能确定模块的依赖关系，以及输入和输出的变量。CommonJS 和 AMD 模块，都只能在运行时确定这些东西。
ES6 模块不是对象，而是通过export命令显式指定输出的代码，再通过import命令输入。这种加载称为“编译时加载”或者静态加载，即 ES6 可以在编译时就完成模块加载，效率要比 CommonJS 模块的加载方式高。当然，这也导致了没法引用 ES6 模块本身，因为它不是对象。
- 即便const { arr, obj } = require('./test.js')  也是把test.js全导入了。而import在打包时根本见不到，且可以按需加载。
const {arr, obj } = require('xxx/xxx')功效不明！

``` 
后端，同步CJS[CommonJS]: require(); webpack语法;
前端，异步AMD：比如测试模式npm run test中的导入
UMD,前后端通用
ESM,esModule, 常见的import，export语句：既有CJS的简洁；也有AMD的异步；静态分析（可以在编译时(静态)确定导入和导出-只需查看源代码，而不必执行它）因此可以摇树优化；
```
UI库有一个dist文件夹，其中包含ES和UMD / CJS的捆绑版本和缩小版本，还有一个lib文件夹，具有库的转译版本。
Core Packages (react, react-dom)只有一个文件夹，其中包含CJS或UMD模块系统的捆绑版本和缩小版本。
* 为什么UI库和Core Packages的构建输出有所不同？
想象一下，如果我们只是发布库的捆绑版本并将其托管在CDN上。 我们的消费者将直接在<script/>标签中使用它。 现在，如果我的使用者想使用<el-Button>组件，则他们必须加载整个UI库。 另外，在浏览器中，没有可以解决摇树问题的捆绑器，最终我们会将整个UI库代码发送给我们的使用者。 如果我们只是简单地将src转换为lib并将该lib托管在CDN上，那么我们的使用者可以得到他们想要的任何东西而没有任何额外开销。
* 核心软件包永远不会通过<script/>标记使用，因为它们必须是主应用程序的一部分。 因此，我们可以安全地发布这些软件包的捆绑版本(UMD，ES)，并将构建系统交给消费者。
例如，他们可以使用UMD变体而不使用摇树，或者如果捆绑器能够识别并获得摇树的好处，则可以使用ES变体。
// CJS require      const Button = require("uilibrary/button");
// ES import        import {Button} from "uilibrary";
将package.json的module字段设置为指向module的ES版本(PS：它有助于摇晃树)。 ？
字段"main": "lib/xr-ui.umd.min.js",  // 指向UMD/CJS

用babel把代码文件转成commonjs或者esm就好了。不要使用webpack打包成一个js文件，否则无法按需加载。
babel只编译而不链接（bundle）。

import moment from 'moment';
export default () => moment().format("YYYY Do MM");

* babel情况下，module引用并没有被替换为实际的“moment”的代码， 而是单纯的将esm格式的模块引用转化为cjs格式的模块引用，而具体“moment”这个模块应该从哪里解析， 里面有什么内容， 应该以什么方式返回给moment这个变量， babel并不负责处理。这段代码在node.js环境中执行是没问题的(假设通过npm安装了moment)， 但是在浏览器中是执行不起来的。
* webpack的定位可以理解为传统编译器中的链接器(linker)的角色。webpack的输入为一个个es module(或者其他的资源文件， 如css， image， ```被对应的loader转化为可执行的es module```)，输出将各个module合并在一起的“bundle”。 
这里面/******/开头的行均为webpack用来实现module引用的样板代码（这段代码具体的分析可以参考https://github.com/ronami/minipack），可以认为是webpack对于es module标准的“实现”（因为浏览器还没有实现es module）。

```babel和webpack做的事情有一部分重叠， 例如都将js转化为ast并且做了一些transform， 然后再输出各自的目标代码。 但是两者的分工有所不同， babel主要做es语法的转换，确保最新的来的es特性能够以最快的速度deliver到开发者手中， 但是不负责模块的组合。 webpack更多的是将输入的各个模块用自己内部的一套逻辑将代码“链接”起来， 起胶水的作用， 并且目标是输出可以直接在浏览器中执行的代码。```


<!-- 在两个互斥的radio中，一定要有相同的name值，不然不能互斥选择。 -->
        <input type="radio" name="sex" v-model="sex" value="男" />男
        <input type="radio" name="sex" v-model="sex" value="女"/>女

data {sex: ''},
原文链接：https://blog.csdn.net/MelodyFreedom/article/details/117514664


scrollTop一直为零可能是根本没有滚动，父元素高度大于子元素。若考虑兼容应当使用 document.documentElement.scrollTop || document.body.scrollTop || window.pageYOffset


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

# regex

^(?!._(localhost|z.angke.com.cn))._$

# jquery
$('#obj1').appendTo($('#obj2')) 这个是将 $('#obj1')) 插入到 $('#obj2') 中作为最后一个元素
 
$('#obj1').prependTo($('#obj2')) 这个是将 $('#obj1')) 插入到 $('#obj2') 中作为第一个子元素。
 
$('#obj1').append($('#obj2')) 这个要注意方向了， 是将$('#obj2') 插入到 $('#obj1')作为最后一个元素，或者说是在$('#obj1')最后面添加子元素$('#obj2')
————————————————
 this是html元素，$(this)是变量名。$(this)=jquery(this)顾返回的是一个jQ对象。
 this是dom对象不可以直接使用jQ中的方法，通过$(this)转换为jQ对象就可以使用jQ中的方法了。
 如下：this使用siblings()时会报错,而转为$(this)就可以使用该方法了。
// bind events  
$('.param-list .remove-param').live('click', function(){ 
  $(this).parent().remove(); 
  return false; 
}); 
————————————————
 
var $test_a = $(".test :hidden");//带空格的jQuery选择器 
上面这段代码是选取class为“test”的元素里面的隐藏元素。（后代选择器）
 
var $test_b = $(".test:hidden");//不带空格的jQuery选择器 
这上面的代码则是选取隐藏的class为“test”的元素
 
$("select :selected");//这样才是正确的 
$("select:selected").length;//不管任何时候，这个选择器都取不到元素，这个length必然是0 
 
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
vue -V  全局vue-cli的版本
npm list vue  当前项目与vue相关的依赖

import Loading from '../components/loading'
// 方法一：name 是组件的名字
Vue.component(Loading.name, Loading)
` // 方法二：前提是 Loading 有提供 install 这个方法  `
Vue.use(Loading);


<counter v-model:count="count"></counter>
子组件： name: 'Counter',
  props: ['count'],
  emits: ['update:count']
<!-- 多个`v-model`绑定、 -->
<vModelText v-model:text="data1" v-model:num.numReg="numData">  </vModelText>
  props:['text','num','numModifiers'],
  emits:['update:text','update:num'],
   this.$emit('update:num',val)
.sync可以绑定多个父组件的变量


'@': resolve('src'),
img: "@/../static/images/quanbu",
或者   'st@tic': resolve('static'),
img: "st@tic/images/quanbu",

webpack的process.env需要自己配置：      
    new webpack.DefinePlugin({
      'process.env': require('../config/dev.env')
    }),
vue.config.js有模式的概念，所以不用专门设置env，vue-cli-service serve 默认是development。也可以直接用--mode指定：   "serve": "vue-cli-service serve --mode production",
有了模式就不用每次打包时都去更改 vue.config.js 文件了。比如在测试环境和生产环境， publicPath参数 （部署应用包时的基本 URL） 可能不同。遇到这种情况就可以在 vue.config.js 文件中，将 publicPath 参数设置为：
publicPath: process.env.BASE_URL
设置之后，再在各个 .env.[mode] 文件下对 BASE_URL变量 进行配置就行了，这样就避免了每次修改配置文件的尴尬。

prop是单向绑定，不能直接更改数据，只能由父组件传输过来。可以用父组件sync，子组件emit的方式修改。
解决办法：
1、可以在子组件中 声明一个中间变量（value），把父组件传过来的值(item)赋值给中间变量(value),当单选切换时修改的数据为value,就不会报错
2、使用.sync修饰符与$emit(update:xxx)
父组件
<comp :item.sync="item"></comp>
子组件
this.$emit('update:item',data)
————————————————
props写在路由里，可以让组件不必通过$route传参，实现解耦，使其不必捆绑在某些url或父组件里。

provide---inject跨级传参

computed: {
    tempCountPlusTempCount2() { 
          return this.tempcount+this.tempcount2
    }, 
    ...mapState(['count','name']), // 映射 this.count 为 store.state.count
    ...mapState({
        nameAlias: 'name', // string   映射 this.nameAlias 为 store.state.name的值
* // 用普通函数this指向vue实例,但是在箭头函数中this就不是指向vue实例了，所以这里必须用普通哈数
        countplustempcount: function (state) { 
          return this.tempcount + state.count
        },
        countplustempcount2 (state) {
          return this.tempcount2 + state.count
        } 
    })
}



1、在组件标签上绑定的事件是自定义事件，在组件模板里绑定的事件才是原生的事件。（自定义事件可以通过在子组件中通过this.$emit去触发，但是这样太麻烦）
2、给组件标签上的事件添加‘.native’修饰符，就可以使事件变为原生点击事件而不再是自定义事件。


el-form的validator必须每一个if-else都有callback，否则流程中断。
  validator: (r, v, cb) => { // rule, value, callback
              if (!this.form.eatstarttime || !this.form.eatendtime) {
                return cb(new Error("请选择用餐日期"));
              } else if (!this.form.eatstarttype || !this.form.eatendtype) {
                return cb(new Error("请选择用餐类型"));
              } else {
                cb();
              }
            }
复杂属性的设置  <el-form-item  :prop="`attrList[${index}].attrv`">
单个属性的校验  this.$refs['form'].validateField('baseList', valid => {})

el-input 嵌套层级太多导致无法输入时（比如在el-form-item中），可以使用   @input=$forceUpdate //强制刷新

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

el-table多个属性在一个prop里，用逗号隔开。

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
        return function(value) {  // computed带参数
          return this.methodGetByteLen(value, 20)
        }
      }
}

computed 的值不能给 data 赋值，computed 时还没有 this 呢。因为 data 里的数据是在 mouted 中执行函数才获取到数据，是在 computed 之后，所以在第一次 computed 计算时，data 中数据还是空的，所以 computed 找不到 data 里的数据。
computed里的匿名函数是找不到this的，function可以。

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
一般是用户通过用户名和密码登录成功之后，服务器将登陆凭证做数字签名，加密之后得到的字符作为token。

它在用户登录成功之后会返回给客户端，客户端主要有这么几种存储方式：

1．存储在localStorage 中，每次调用接口的时候都把它当成一个字段传给后台

2．存储在cookie 中，让它自动发送，不过缺点就是不能跨域

3．拿到之后存储在 localStorage 中，每次调用接口的时候放在 HTTP 请求头的 Authorization 字段里

所以token 在客户端一般存放于 localStorage、cookie 或  sessionStorage 中。

将token存放在webstroage中，可以通过同域的js来访问。这样会导致很容易受到 XSS攻击，特别是项目中引入很多 第三方js类库的情况下。如果js脚本被盗用，攻击者就 可以轻易访问你的网站，webStroage作为一种储存机制，在传输过程中不会执行任何安全标准。

XSS攻击：cross-site Scripting (跨站脚本攻击） 是一种注入代码攻击。恶意攻击者在目标网站生注入script代码，当访问者浏览网站的时候通过执行注入的script代码达到窃取用户信息，盗用用户身份等。
网站中包含大量的动态内容以提高用户体验，比过去要复杂得多。所谓动态内容，就是根据用户环境和需要，Web应用程序能够输出相应的内容。动态站点会受到一种名为“跨站脚本攻击”（Cross Site Scripting, 安全专家们通常将其缩写成XSS,原本应当是css，但为了和层叠样式表（Cascading Style Sheet,CSS ）有所区分，故称XSS）的威胁，而静态站点则完全不受其影响。

将token存放在cookie中可以指定httponly，来防止被javascript读取，也可以指定secure ，来保证token只在HTTPS下传输。缺点是不符合Restful 最佳实践，容易受到CSRF攻击。
CSRF跨站点请求伪造(Cross-Site Request Forgery)，跟XSS攻击一样，存在巨大的危害性。简单来说就是恶意攻击者盗用已经认证过的用户信息，以用户信息名义进行一些操作（如发邮件、转账、购买商品等等）。由于身份已经认证过，所以目标网站会认为操作都是真正的用户操作的。CSRF并不能拿到用户信息，它只是盗用的用户凭证去进行操作。
————————————————