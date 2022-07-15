# vim
"hello world!"

将光标移动到双引号内，按cs"'

'hello world!'

接着将光标放入其中，按cs'<q>

<q>hello world!</q>

移除它，cst"

hello world!

# 光标移动到 hello上，按ysiw]                 yciw会先开始插入模式

[hello] world!

将整行外加括号同时括号内再加一个空格 yss(

( [hello] world! )

删除括号 ds[ds)

hello world!

强调hello

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
