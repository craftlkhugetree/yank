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
//////////////////////   移除标签对用t，cst"   必须是简单标签对，不能是组件。 *** 修改标签对用 cst<  然后在输入框输入剩下的标签对 ***

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

在Shell脚本中，有单等号“=”、双等号“==”和“-eq”共3种相等判断符。在shell脚本中，单等号和双等号属于算数运算符；“-eq”属于关系运算符。其使用场景限制：
(1)单等号和双等号能用于字符string类型和整型integer的相等判断。
(2)相等关系运算符“-eq”仅能用于整型integer的相等比较。
(3)相等关系运算符“-eq”不能在算数运算表达式“(( ))”中
(4)在条件表达式“[ ]”中，单等号和双等号等价，都是相等算数运算符。
(5)在算数运算表达式“(( ))”中，单等号是赋值算数运算符，双等号为相等算数运算符。

总结：在进行相等判断时，最通用的方法是使用双等号“==”相等判断符。
————————————————
判断字符串是否为空：
[[ -z $str ]] 如果str为空串，则返回真
[[ -n $str ]] 如果str不为空，则返回真

read -p  "请填写commit提交的信息:" msg
# msg="l = 0"
echo $msg
# 空值判断
# if [ -z $msg ]; then
# if [ ! -n "$msg" ]; then
# a = b中等号被当作条件判断符(等号两边有空格)，所以 ! (a = b) 为真
if [ ! $msg ]; then
  echo -e "\033[31m true \033[0m" 
else
  echo -e "\033[32m \n false \033[0m"
fi
# sed

在第一行前插入文本
sed -i '1 i\插入字符串' datafile
在最后一行后插入文本
sed -i '$ a\插入字符串' datafile
在匹配行前插入一行
sed -i '/pattern/ i "插入字符串"'' datafile
删除最后一行
sed -i '$ d' .git/config


cat test.log
>> vwef000
>> verbweg
>> 111
>> 222
>> verbweg
>> fgewrbva
>> gfqf111
 
sed -i "{:begin;  /111/! { $! { N; b begin }; }; s/000.*111/XXX/; };" test.log
cat test.log
>> vwefXXX
>> 222
>> verbweg
>> fgewrbva
>> gfqf111
命令解释如下

:begin，这是一个标号，man中叫做label，也就是跳转标记，供b和t命令用，本例中使用了b命令。

/111/!是要替换内容的结束标记，带上!就是说当一行处理完毕之后，如果没有发现结束标记就继续，'111'就是你要结束的搜索词

$!，$在正则中表示字符串结尾，在sed中代表文件的最后一行，本句和上一句结合起来的意思就是：如果在本行没有发现结束标记，并且当前扫描过的行并不是文件的最后一行。

N;，把下一行的内容追加（append）到缓冲区（pattern）之后，在我们的例子中，在处理vwef000这一行的内容时，就会执行到这里，然后把下一行的内容ddd，依次类推把
verbweg一起放入缓冲区，相当于“合并”成了一行（sed的缓冲区中默认都只会包含一行的内容）。

b begin，由于仍然没有找到结束标记'111'（注意上一条说的缓冲区还没有被处理），所以在这里跳回到标号begin，重新开始命令。如果开始和结束标记之间间隔了多行，那么就会有多次跳转发生。

s/000.*111/XXX/;，终于，/111/!不再匹配成功，也就是我们已经找到了结束标记，那么用s命令来进行替换。如果开始和结束标记在一行的话，就会越过上面那些复杂的处理，直接执行到这里了。
————————————————
原文链接：https://blog.csdn.net/cy413026/article/details/121257887

# grep
cat test.log
>> vwef000
>> verbweg
>> 111
>> 222
>> verbweg
>> fgewrbva
>> gfqf111
>> vwef000
>> verbweg
>> 111
>> sds

grep -Pz "000(\n|.)*222(\n|.)*111" test.log
其中(\n|.)*表示匹配\n(换行)或.(任意字符)任意次数。
结果为：红色部分为匹配内容，但是整个文件内容都会显示出来，而且是匹配到最后一个满足条件的111。

选项说明

-P :  --perl-regexp，使用Perl正则表达式；

-z，处理多行；

-l:只输出满足条件的文件名。

grep -Plz "000(\n|.)*222(\n|.)*111" test.log
>> test.log

-o，只输出匹配部分。因为如果进行多行匹配，就没有换行作为匹配结束边界，会返回剩下的全部文本
grep -Pzo "000(\n|.)*222(\n|.)*111" test.log

如果加上非贪婪匹配?  就可以只匹配到第一个满足条件的段落，结果如下：
grep -Pzo "000(\n|.)*222(\n|.)*?111" test.log
>> 000
>> verbweg
>> 111
>> 222
>> verbweg
>> fgewrbva
>> gfqf111



# regex

^(?!._(localhost|z.angke.com.cn))._$
^(?!.*(seat.dev.angke.cn|z.angke.com.cn|localhost)).*$

 var pwdRegex = new RegExp('(?=.*[0-9])(?=.*[A-Z])(?=.*[a-z])(?=.*[^a-zA-Z0-9]).{8,30}');
 if (!pwdRegex.test('A3b@C2dEF')) {
 　　alert("您的密码复杂度太低（密码中必须包含大小写字母、数字、特殊字符），请及时修改密码！");
 }


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
#    const xmlarray = str.split(/(<title>[\d\D]*?<\/title>){1}/);  针对大量的括号对，要用非贪心匹配。点号不表示\n，所有字符应该用[\d\D]或者[\s\S]
split的正则中加了括号,会把括号内匹配到的值也放在最后返回的数组里。
或者加上  s  可以匹配换行符   console.log( /b.r/s.test('b\nr') )
/foo/igs.flags;   // "gis"


str.replace(/<[^>]*>/g, '');去掉所有尖括号对,非“>”的字符可以有一个或多个，也可以没有。


const reg = /(\d{3})(\d{2})(\d*)(\d{4})/
let phoneNum = "15612345678"
const res = phoneNum.replace(reg, '$1****$2****$3****$4')
console.log(res) // "156****12****34****5678"


# 非捕获分组 (?:表达式)，分组匹配之后，不需要的用 “?: ”语法过滤子表达式内容。也就是代码匹配，但是不保存为$1 \1。
var str = '2022-04-21'
var reg = /(\d{4})-(?:\d{2})-(\d{2})/
var result = reg.exec(str)  // 得到的数组就不包括04了

# $1只匹配小括号内的内容，\1也是。
只保留 点和两位小数，没有四舍五入:
const changePiece = (e) =>{
    // ?:将不要的匹配子项忽略，所以只匹配到第二个小括号内容
    e.target.value = e.target.value.replace(/^\D*(?:\d*(\.\d{0,2})?).*$/g, '$1');
  }
  return (
    <div>
       <input type="text" onKeyUp={ (e) => {changePiece(e)}} /> 
    </div>
  );


当我们想匹配一个正确的 HTML 标签时，使用 "<([\w]+)>.*<\/[\w]+>"。
可以看到虽然可以匹配 HTML 开始和结束标签，但是却不能校验前后的一致性。如 “</span>” 并不是 “<div>” 的结束标签。
我们可以把后面的部分改成 “<\/\1>” 其中 “\1” 就是引用 *** 第一个匹配的小括号内容 ***。这样一来我们就可以匹配成对的 HTML 标签了。

// 手机号码的校验
const phoneReg = /^[1][3,4,5,6,7,8,9][0-9]{9}$/
// 身份证的校验
const idCardReg = /^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/
// URL的校验
const urlReg = /^((https?|ftp|file):\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/
// 邮箱的校验
const emailReg = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/
// 日期 YYYY-MM-DD 校验
const dateReg = /^\d{4}(\-)\d{1,2}\1\d{1,2}$/

断言 (Assertion)
断言有些地方也叫环视(Lookaround)，它只进行子表达式的匹配，不占有字符，匹配到的内容不保存到最终的匹配结果。
1)正向先行断言
正向先行断言：(?=表达式)，指在某个位置往右看，所在的位置右侧必须匹配表达式。
2)反向先行断言
反向先行断言：(?!表达式)，指在某个位置往右看，不能存在表达式中的内容。
3)正向后行断言
正向后行断言：(?<=表达式)，指在某个位置往左看，存在表达式中的内容。
(?<=我)喜欢
如上就匹配了“喜欢”前面有“我”的字符串。
4)反向后行断言
反向后行断言：(?<!表达式)，指在某个位置往左看，不能存在表达式中的内容。
(?<!我)喜欢
如上就排除了“喜欢”前面有“我”的字符串。


var re = /-/g;
var str = '2022-01-02';
var result = re[Symbol.split](str);  // *** 类似call/apply/bind ***
console.log(result);  // ["2022", "01", "02"]

对象的Symbol.isConcatSpreadable属性等于一个布尔值，表示该对象用于Array.prototype.concat()时，是否可以展开。
let arr1 = ['c', 'd'];
['a', 'b'].concat(arr1, 'e') // ['a', 'b', 'c', 'd', 'e']
arr1[Symbol.isConcatSpreadable] // undefined

let arr2 = ['c', 'd'];
arr2[Symbol.isConcatSpreadable] = false;
['a', 'b'].concat(arr2, 'e') // ['a', 'b', ['c','d'], 'e']

let arr3 = ['c', 'd'];
arr2[Symbol.isConcatSpreadable] = true;
['a', 'b'].concat(arr2, 'e') // ['a', 'b', ['c','d'], 'e']



# whistle
# 操作统计-民国库后台管理
/^http://172.20.1.251:8080/bemweb/view/resourceClassfiyManager/(.*).js/		file://D:\kxiangmu\mgsjk\03code\bemweb\src\main\webapp\view\classificationStats\\$1.js

# 民国库书页搜索弹窗
/^http://172.20.1.251:8080/book/h5/readPage/(.*)/		file://D:\kxiangmu\mgsjk\03code\book\src\main\webapp\h5\readPage\\$1





# shell
其中双引号对字符串中出现的$、''、`和\进行替换；单引号不进行替换，将字符串中所有字符作为普通字符输出，而反引号中字符串作为shell命令执行，并返回执行结果。具体含义如下：

双引号(" ")：在双引号中，除了$, '', `和\以外所有的字符都解释成字符本身。

单引号(' ')：在单引号中所有的字符包括特殊字符($,'',`和\)都将解释成字符本身而成为普通字符。

反引号(` `)：在反引号中的字符串将解释成shell命令来执行。