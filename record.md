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
npm config get cache // 查看本地缓存
npm config list

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

# js
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
}
}
},
