# vim
正常模式下，键盘上按  "t4yy  这几个按键连续按完后就是复制了4行内容到 具名为t的寄存器里了。
在正常模式下，"tp 就可以黏贴

^/== 到行首第一个字符，不像0和$
# 向上查找当前所在单词
* 向下查找当前所在单词
f/F+字母  当前行搜索
; 重复上一个f命令

zz 当前到中间
zb 当前到底
zt 当前到顶

gv 刚才v的区域。
vat 在html中选择标签对用t，o 在标签对跳转。
% 函数花括号跳转

g~iw单词转换大小写

d2/foo 当前删除到第二个foo   d?foo 反过来找
y3fz 从当前复制到第三个z
Y 复制当前行
c change; i当前光标处插入, cw从当前光标处删除到单词尾, ciw删除当前单词。 c进寄存器。
C/D 当前光标删到行尾。
s substitute，也进寄存器，但是无法接其他操作。
S 删除整行


vat,dat,yat 在html中选择标签对用t，o 在标签对跳转。
# cs,ds针对符号对内部所有；ysiw/viwS针对单词； v选中内容S符号对。 w针对text，W针对objects。
"hello world!"
将光标移动到双引号内，按cs"'

'hello world!'
接着将光标放入其中，按cs'<q>

<q>hello world!</q>
移除标签对用t，cst"   必须是简单标签对，不能是组件。

hello world!
# 光标移动到 hello上，按ysiw]                 yciw会先开始插入模式, s会进入substitute
[hello] world!

将整行外加括号同时括号内再加一个空格 yss(
( [hello] world! )

删除括号 ds[ds)
hello world!

强调hello  viwS<em>
<em>hello</em> world!

采用visual模式，按下V选定整行后 输入S<p class="important">

<p class="important">
<em>hello</em> world!
</p>


# shell

如果 dir2 目录不存在，则可以直接使用
cp -r dir1 dir2
如果 dir2 目录已存在，则需要使用
cp -r dir1/. dir2
如果这时使用 cp -r dir1 dir2,则也会将 dir1 目录复制到 dir2 中

# sed

在第一行前插入文本
sed -i '1 i\插入字符串' datafile
在最后一行后插入文本
sed -i '$ a\插入字符串' datafile
在匹配行前插入一行
sed -i '/pattern/ i "插入字符串"'' datafile
删除最后一行
sed -i '$ d' .git/config

# regex

^(?!._(localhost|z.angke.com.cn))._$

?<=pattern
匹配这个位置之前为pattern的内容
var str = '111$222'
var reg = /(?<=\$)\d+/g
str.match(reg) 
// ["222", index: 4, input: "111$222", groups: undefined]
多个匹配的且要匹配所在位置的，需要循环，且正则必须g结尾。
while( res = reg.exec(str))
{
 console.log(res);
}

const xmlarray = str.split(/(<pagenumber pagenum=[^>]*\/>){1}/);会把正则字段在数组中保存一份

str.replace(/<[^>]*>/g, '');去掉所有尖括号对,非“>”的字符可以有一个或多个，也可以没有。


^(?!.*(seat.dev.angke.cn|z.angke.com.cn|localhost)).*$


const reg = /(\d{3})(\d{2})(\d*)(\d{4})/
let phoneNum = "15612345678"
const res = phoneNum.replace(reg, '$1****$2****$3****$4')
console.log(res) // "156****12****34****5678"

# whistle
# 操作统计-民国库后台管理
/^http://172.20.1.251:8080/bemweb/view/resourceClassfiyManager/(.*).js/		file://D:\kxiangmu\mgsjk\03code\bemweb\src\main\webapp\view\classificationStats\\$1.js

# 民国库书页搜索弹窗
/^http://172.20.1.251:8080/book/h5/readPage/(.*)/		file://D:\kxiangmu\mgsjk\03code\book\src\main\webapp\h5\readPage\\$1
