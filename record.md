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

ssh-keygen -t rsa -C "345823102@qq.com"
ssh -T git@github.com // 测试

# npm

npm config list

# vscode

没有配置前 如果代码过长，vetur 会把尖括号整理到第二行换行， "prettier.htmlWhitespaceSensitivity": "ignore", //包裹文字时候结束标签的结尾尖括号掉到了下一行
感叹号后回车，快捷生成 html

ctrl + shift + o 查找函数类名
ctrl + p 打开文件

# js
childNodes不是数组，而是类数组，所以没有filter函数，要转一下arr。默认元素宽度33%，如果是两个元素就50%平分宽度。
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

# vant

<van-overlay :show="true">
    <div class="loading" @click.stop>
      <van-loading size="36px" vertical>加载中...</van-loading>
    </div>
</van-overlay

# Vue
el-checkbox的勾选框颜色，不能用逗号来统一设置一组值，只能一个个值的设置：
/deep/ .el-checkbox__input.is-checked .el-checkbox__inner {
      background-color:#00B09B;
      border-color:#00B09B;
     }
/deep/ .el-checkbox__input.is-indeterminate  .el-checkbox__inner {
      background-color:#00B09B;
      border-color:#00B09B; 
}
/deep/  .el-checkbox__input.is-checked + .el-checkbox__label {
      color: #00B09B;
     }
/deep/  .el-checkbox.is-bordered.is-checked{
      border-color: #00B09B;
     }
/deep/  .el-checkbox__input.is-focus .el-checkbox__inner{
      border-color:  #00B09B;
     }


移动端el-table在数据请求后，固定列错位，解决办法就是让table重新布局。官方提供了doLayout方法。
按照这个方法在请求得到数据的时候，用nextTick对table的DOM重新渲染。
 this.$nextTick(() => {
        // el-table加ref="multipleTable"
        this.$refs.multipleTable.doLayout();
      });
试了下不生效，说明是别的问题。查看了表格中的最后一列，发现该列的宽度设置的较低，内存已经越出，导致每行错位。将该列的宽度调宽。恢复正常。 

$nextTick转化pdf：
    transToPdf(title, dom) {
      const loading = this.$loading({
        lock: true,
        text: '下载中',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      });

      let _this = this;
      let element = document.getElementById(dom); // 这个dom元素是要导出pdf的div容器
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
        _this.tmpTable = false;
      });
    },

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

computed 的值不能给 data 赋值，computed 时还没有 this 呢。因为 data 里的数据是在 mouted 中执行函数才获取到数据，是在 computed 之后，所以在第一次 computed 计算时，data 中数据还是空的，所以 computed 找不到 data 里的数据。

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
