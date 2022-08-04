# vim
正常模式下，键盘上按  "t4yy  这几个按键连续按完后就是复制了4行内容到 具名为t的寄存器里了。
在正常模式下，"tp 就可以黏贴

^ 到行首第一个字符，不像0和$
# 向上查找当前所在单词
* 向下查找当前所在单词
f/F+字母  当前行搜索
; 重复上一个f命令

zz 当前到中间
zb 当前到底
zt 当前到顶

vat 在html中选择标签对用t，o 在标签对跳转。
% 函数花括号跳转

g~iw单词转换大小写

Y 复制当前行
c change; i当前光标处插入, cw从当前光标处删除到单词尾, ciw删除当前单词。 c进寄存器。
C/D 当前光标删到行尾。
s substitute，也进寄存器，但是无法接其他操作。
S 删除整行


vat,dat,yat 在html中选择标签对用t，o 在标签对跳转。
# cs,ds针对符号对内部所有；ysiw/viwS针对单词； v选中内容S符号对。
"hello world!"
将光标移动到双引号内，按cs"'

'hello world!'
接着将光标放入其中，按cs'<q>

q>hello world!</q>
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
