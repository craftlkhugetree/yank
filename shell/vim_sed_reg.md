.$s///g 当前行到最后一行的替换，%s所有行
%s/data\((.*),(.*)\)/data(\2,\1)/g    // 真括号用转义，捕获则直接用括号
vim的全称是Visual Interface IMproved
# vim
正常模式下，键盘上按  "t4yy  这几个按键连续按完后就是复制了4行内容到 具名为t的寄存器里了。
在正常模式下，"tp 就可以黏贴

要改变括号内的文本，需要执行 ci( （读做 change inner parentheses）； *** 删除整个段落的内容，需要执行 dap （读做：delete around paragraph）。 ***

一个例子是在普通模式中按下 !!，命令行中会出现 :.!。如果这时你如果输入一个外部命令，那么当前行的内容就会被这个外部命令的输出替换。你也可以通过命令 :?^$?+1,/^$/-1!ls 把当前段落的内容替换成外部命令 ls 的输出，原理是向前和向后各搜索一个空白行，删除这两个空白行之间的内容，并将外部命令 ls 的输出放到这两个空白行之间。

'[ 与 `[	上一次修改或复制的第一行或第一个字符
'] 与 `]	上一次修改或复制的最后一行或最后一个字符

# 文本对象同样可以与数字搭配使用。比如，像 ((( ))) 这样的文本，假如光标位于最内层的括号上或最内层的括号内，那么 d2a( 将会删除从最内层开始的两对括号，以及他们之间的所有内容。其实，d2a( 这个操作等同于 2da(。在 Vim 的命令中，如果有两处都可以接收数字作为参数，那么最终结果就等同于两个数字相乘。在这里，d 与 a( 都是可以接收参数的，一个参数是 1，另一个是 2，我们可以把它们相乘然后放到最前面。
请参阅 :h text-objects 来获取更多关于文本对象的帮助。

"$"命令还可接受一个计数，如"1$"会将光标移动到当前行行尾，"2$"则会移动到下一行的行尾，如此类推。
^/== 到行首第一个字符，不像0和$
`或' 跳转到m标记的位置。大写的标记可以文件间跳转。
# 向上查找当前所在单词
* 向下查找当前所在单词
f/F+字母  当前行搜索
; 重复上一个f命令
/ ? 向后/向前搜索

1、翻整页命令为：
Ctrl + f 键 （f 的英文全拼为：forward）
Ctrl + b 键 （b 的英文全拼为：backward)

2、翻半页命令为：
Ctrl + d 键 （d 的英文全拼为：down）
Ctrl + u 键 （u 的英文全拼为：up）
 "vim.normalModeKeyBindings": [
   {
     "before": ["j", "l"],
     "after": ["<C-f>"]
   },
   {
     "before": ["k", "l"],
     "after": ["<C-b>"]
   }
  ] 
zz 当前到中间
zb 当前到底
zt 当前到顶
屏幕： H （屏幕首行）， M （屏幕中间）， L （屏幕底部）
词： w （下一个词）， b （词初）， e （词尾）
行： 0 （行初）， ^ （第一个非空格字符）， $ （行尾）
查找： f{字符}， t{字符}， F{字符}， T{字符}
    查找/到 向前/向后 在本行的{字符}
    , / ; 用于前后导航匹配

gv 刚才v的区域。
vat 在html中选择标签对用t，o 在标签对跳转。
% 函数花括号跳转

g~iw单词转换大小写

d2/foo 当前删除到第二个foo   d?foo 反过来找
y3fz 从当前复制到第三个z
yl 复制当前字符
Y 复制当前行   "aY复制当前行到寄存器a
c change; i当前光标处插入, cw从当前光标处删除到单词尾, ciw删除当前单词。 c进寄存器。
C/D 当前光标删到行尾。
s substitute，也进寄存器，但是无法接其他操作。
S 删除整行


ci( 改变当前括号内的内容
ci[ 改变当前方括号内的内容
da' 删除一个单引号字符串， 包括周围的单引号

vat,dat,yat 在html中选择标签对用t，o 在标签对跳转。
# cs符号对替换；ysiw/viwS针对单词； v选中内容S增加符号对。 w针对text，W针对objects。
# ds符号对删除：ds"
# ca/da删除符号对及内部所有：ca"
"hello world!"
将光标移动到双引号内，按cs"'

'hello world!'
接着将光标放入其中，按cs'<q>

<q>hello world!</q>
//////////////////////   移除标签对用t，cst"   必须是简单标签对，不能是组件。 *** 修改标签对用 cst<  然后在输入框输入剩下的标签对 ***

hello world!
# 光标移动到 hello上，按ysiw]                 yciw会先开始插入模式, s会进入substitute, iw is a text object
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

{ Hello } world!
# Now wrap the entire line in parentheses with yssb or yss).
({ Hello } world!)

首先，按下 q，然后按下你想要保存的寄存器，任何小写字母都可以。比如我们来把它保存到 q 这个寄存器中。按下 qq，你会发现命令行里已经显示了 "recording @q"。
如果你已经录制完成，那么只需要再按一次 q 就可以结束录制。
如果你想调用刚才录制的宏，只需要 [count]@q
如果你想调用上一次使用的宏，只需要 [count]@@
qq
iabc<cr><esc>
q
10@q
（对于上面这个功能，你同样可以通过如下的按键： oabc 然后 ESC 然后 10. 来实现）。

# shell
其中双引号对字符串中出现的$、''、`和\进行替换；单引号不进行替换，将字符串中所有字符作为普通字符输出，而反引号中字符串作为shell命令执行，并返回执行结果。具体含义如下：

双引号(" ")：在双引号中，除了$, '', `和\以外所有的字符都解释成字符本身。

单引号(' ')：在单引号中所有的字符包括特殊字符($,'',`和\)都将解释成字符本身而成为普通字符。

反引号(` `)：在反引号中的字符串将解释成shell命令来执行。

新建~/.bashrc：
sh 会导致脚本里的cd命令执行成功后，又退回到执行目录，所以用source。
alias baima='source /d/yank/com/baima.sh'
alias 查看增加的命令

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

``包裹系统命令即可执行并获取返回值：
pidlist=`tasklist | grep nginx | awk '{print $2}'`
gitbash中执行cmd：
cmd "/C taskkill /PID $pid /F"
cmd "/C start '$dir/nginx.exe'"
# awk
1、打印文件的第一列(域)                 ： awk '{print $1}' filename
2、打印文件的前两列(域)                 ： awk '{print $1,$2}' filename
3、打印完第一列，然后打印第二列  ： awk '{print $1 $2}' filename
4、打印文本文件的总行数                ： awk 'END{print NR}' filename
5、打印文本第一行                          ：awk 'NR==1{print}' filename
6、打印文本第二行第一列                ：sed -n "2, 1p" filename | awk 'print $1'
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

1.基本概念
  零宽断言是一种零宽度的匹配，它匹配到的内容不会保存到匹配结果中去，最终匹配结果只是一个位置而已。
  正则表达式中常用的断言元字符为：^和$，而零宽断言就是其他用正则表达式来定义的功能类似的断言。

2.用法
  常用的零宽断言主要有以下四种：

语法	名称	作用
(?=exp)	正向零宽先行断言	目标字符出现的位置的右边必须匹配到exp这个表达式
(?!exp)	负向零宽先行断言	目标字符出现的位置的右边不能匹配到exp这个表达式
(?<=exp)	正向零宽后发断言	目标字符出现的位置的左边必须匹配到exp这个表达式
(?<!exp)	负向零宽后发断言	目标字符出现的位置的左边不能匹配到exp这个表达式
————————————————
原文链接：https://blog.csdn.net/yeshang_lady/article/details/121756563

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

exts.replace(/(mp3\|)/g, '$1\n\r')
// https://zhuanlan.zhihu.com/p/400170962
// 正则表达式括号内容是从左到右，从外到内来计算$1,$2,$3,$4的
  (function () {
    let str = '222aaaa333Bbb666ccc9ZZ'
    let reg = /((\d([a-z]+))(\d+[A-Z]))/g
    let arr = str.match(reg)

     console.log(str.replace(reg, '$1...')) 
    console.log(arr) // ['2aaaa333B', '6ccc9Z']
	    let str2 = str.replace(reg, function (match, p1, p2, p3, p4, p5, p6, p7) {
      console.log('match', match) // 2aaaa333B  // 6ccc9Z
      console.log('p1', p1) // 2aaaa333Bbb  // 6ccc9Z
      console.log('p2', p2) // 2aaaa  // 6ccc
      console.log('p3', p3) // aaaa // ccc
      console.log('p4', p4) // 333B // 9Z
      console.log('p5', p5) // 2  // 15
      console.log('p6', p6) // 222aaaa333Bbb666ccc9ZZ // 222aaaa333Bbb666ccc9ZZ
      console.log('p7', p7) // undefined  // undefined
      return '***' // 把匹配到的字符串替换为对应的字符串
    })
    console.log('str2', str2) // 22***bb66***Z
    /***
     * 结果解析：
     * 要点1：正则表达式括号内容是从左到右，从外到内来计算$1,$2,$3,$4的
     * 要点2：因为是全局匹配（-g），故此正则匹配到此字符串的结果有两个：2aaaa333B、6ccc9Z；故replace要替换这两个字符串
     * 要点3：replace传function时，各个参数的意义要明确:
     *      match(整个匹配成功的字符串)
     *      p1~p5（匹配成功字符串中的各个括号中匹配成功的字符串）
     *      p6（正则各个括号中匹配成功的参数占用完之后的第一个参数）（代表从字符串的第几个位置开始匹配成功的）
     *      p7（正则各个括号中匹配成功的参数占用完之后的第二个参数）（原字符串）
     *      p8...（原字符串之后的所有字符串都是undefined）
     *
     * **/
  })();



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

# 正则表达式中常用的模式修正符有i、g、m、s、U、x、a、D、e 等。
它们之间可以组合搭配使用。

i 不区分(ignore)大小写；
例如: /abc/i 可以匹配 abc、aBC、Abc 
g 全局(global)匹配 
如果不带g，正则过程中字符串从左到右匹配，找到第一个符合条件的即匹配成功，返回
如果带g，则字符串从左到右，找到每个符合条件的都记录下来，知道字符串结尾位置
例如: 
var str = 'aaaaaaaa'
var reg1 = /a/;  str.match(reg1)  // 结果为：["a", index: 0, input: "aaaaaaaa"]
var reg2 = /a/g; str.match(reg2)  // 结果为：["a", "a", "a", "a", "a", "a", "a", "a"]

m 多(more)行匹配
若存在换行\n并且有开始^或结束$符的情况下，和g一起使用实现全局匹配,
因为存在换行时默认会把换行符作为一个字符任务匹配字符串是个单行，
g只匹配第一行，添加m之后实现多行，每个换行符之后就是开始
var str = "abcggab\nabcoab";
var preg1 = /^abc/gm;  str.match(preg1)  // 结果为：["abc", "abc"]
var preg2 = /ab$/gm;   str.match(preg2)  // 结果为：["ab", "ab"]


s 特殊字符圆点 . 中包含换行符
默认的圆点 . 是 匹配除换行符 \n 之外的任何单字符，加上s之后, . 中包含换行符
$str = "abggab\nacbs";
$preg = "/b./s";
preg_match_all($preg, $str,$matchs);
print_r($matchs);//Array ( [0] => Array ( [0] => bg [1] => b [2] => bs ) ) 

U 只匹配最近的一个字符串;不重复匹配; 非贪婪
$mode="/a(.*?)c/";
$preg="/a.*c/U";//这两个正则返回相同的值
$str="abcabbbcabbbbbc" ;
preg_match($mode,$str,$content);   echo $content[0];//abc
preg_match($preg,$str,$content);   echo $content[0];//abc
//修正符:x 将模式中的空白忽略; 
//修正符:A 强制从目标字符串开头匹配;
//修正符:D 如果使用$限制结尾字符,则不允许结尾有换行; 
//修正符:e 配合函数preg_replace()使用, 可以把匹配来的字符串当作正则表达式执行;  

# “\b”匹配单词边界，不匹配任何字符。
原文链接：https://blog.csdn.net/lxcnn/article/details/4355364

“\b”匹配的只是一个位置，这个位置的一侧是构成单词的字符，另一侧为非单词字符、字符串的开始或结束位置。“\b”是零宽度的。

基本上所有的资料里都会说“\b”是单词边界，但是关于“单词”的范围却是少有提及。通常情况下，正则表达式中所谓的“单词”，就是由“\w”所定义的字符所组成的子串。

“\b”表示所在位置的一侧为单词字符，另一侧为非单词字符、字符串的开始或结束位置，也就相当于

(?<!\w)(?=\w)|(?<=\w)(?!\w)

思考：以下写法为什么不等价于“\b”
(?<=\W)(?=\w)|(?<=\w)(?=\W)

在支持ASCII码的语言中，如JavaScript，“\w”等价于[a-zA-Z0-9_] ；

在支持Unicode的语言中，如.NET，默认情况下，“\w”除可以匹配[a-zA-Z0-9_]外，还可以匹配一些Unicode字符集，如汉字，全角数字等等。

几乎所有常见的语言都遵循这样一个规律，只有Java是个例外。在Java中，“\w”的表现是比较奇怪的，Java是支持Unicode的，但Java的正则中的“\w”却是等价于[a-zA-Z0-9_]的。

“\b”用在正则中，通常情况下都是表示单词边界的，只有在字符组中，它表示的是退格键，即
[a-z\b]
此处的“\b”表示的是退格键，而不是单词边界。
非单词与符号的边界是\B，可以匹配单个字符。
————————————————
var str = "abc_123中文_d3=efg汉字%";
var reg = /.\b./g;
var arr = str.match(reg);
/*-------- JavaScript中输出--------
3中
文_
3=
g汉
*/


# [^ ]+ 会匹配任意非空且不包含空格的序列，sed -E用正则
 sed -E 's/.*Disconnected from (invalid |authenticating )?user (.*) [^ ]+ port [0-9]+( \[preauth\])?$/\2/'
https://regex101.com/r/qqbZqh/2

ssh myserver journalctl
 | grep sshd
 | grep "Disconnected from"
 | sed -E 's/.*Disconnected from (invalid |authenticating )?user (.*) [^ ]+ port [0-9]+( \[preauth\])?$/\2/'
 | sort | uniq -c
 | sort -nk1,1 | tail -n10
 | awk '{print $2}' | paste -sd,

uniq -c 会把连续出现的行折叠为一行并使用出现次数作为前缀。
sort -n 会按照数字顺序对输入进行排序（默认情况下是按照字典序排序 -k1,1 则表示“仅基于以空格分割的第一列进行排序”。,n 部分表示“仅排序到第n个部分”，默认情况是到行尾。就本例来说，针对整个行进行排序也没有任何问题，如果我们希望得到登录次数最少的用户，我们可以使用 head 来代替tail。或者使用sort -r来进行倒序排序。
利用 paste命令来合并行(-s)，并指定一个分隔符进行分割 (-d)。

让我们统计一下所有以c 开头，以 e 结尾，并且仅尝试过一次登录的用户。
 awk '$1 == 1 && $2 ~ /^c[^ ]*e$/ { print $2 }' | wc -l
然后我们使用 wc -l 统计输出结果的行数。

不过，既然 awk 是一种编程语言，那么则可以这样：
BEGIN { rows = 0 }
  $1 == 1 && $2 ~ /^c[^ ]*e$/ { rows += $1 }
END { print rows }
BEGIN 也是一种模式，它会匹配输入的开头（ END 则匹配结尾）。然后，对每一行第一个部分进行累加，最后将结果输出。

# 需求：密码必须是包含大写字母、小写字母、数字、特殊符号（不是字母，数字，下划线，汉字的字符）的8位以上组合

二、方案：利用正则表达式来校验

三、思路：排除法

　　1、排除大写字母、小写字母、数字、特殊符号中1种组合、2种组合、3种组合，那么就只剩下4种都包含的组合了

　　2、表达式为：^(?![A-Za-z0-9]+$)(?![a-z0-9\\W]+$)(?![A-Za-z\\W]+$)(?![A-Z0-9\\W]+$)[a-zA-Z0-9\\W]{8,}$
        /^(?![A-Z0-9]+$)\w+$/ 表示：不能完全为大写字母和数字组成的，不含空值的串。第一个$就表示串的结尾，与^配套。

　　3、拆分解释：其中（2）-（6）运用了零宽断言、环视等正则功能

　　　　（1）^匹配开头

　　　　（2）(?![A-Za-z0-9]+$)匹配后面不全是（大写字母或小写字母或数字）的位置，排除了（大写字母、小写字母、数字）的1种2种3种组合

　　　　（3）(?![a-z0-9\\W]+$)同理，排除了（小写字母、数字、特殊符号）的1种2种3种组合

　　　　（4）(?![A-Za-z\\W]+$)同理，排除了（大写字母、小写字母、特殊符号）的1种2种3种组合

　　　　（5）(?![A-Z0-9\\W]+$)同理，排除了（大写字母、数组、特殊符号）的1种2种3种组合

　　　　（6）[a-zA-Z0-9\\W]匹配（小写字母或大写字母或数字或特殊符号）因为排除了上面的组合，所以就只剩下了4种都包含的组合了

　　　　（7）{8,}8位以上

　　　　（8）$匹配字符串结尾
# whistle
https需要勾选 capture tunnel connects 并且下载安装crt证书
# 操作统计-民国库后台管理
/^http://172.20.1.251:8080/bemweb/view/resourceClassfiyManager/(.*).js/		file://D:\kxiangmu\mgsjk\03code\bemweb\src\main\webapp\view\classificationStats\\$1.js

/^https://wendian.nju.edu.cn/bemweb/view/classificationStats/(.*).js/		file://D:\kxiangmu\mgsjk\03code\bemweb\src\main\webapp\view\classificationStats\\$1.js
# 民国库书页搜索弹窗
/^http://172.20.1.251:8080/book/h5/readPage/(.*)/		file://D:\kxiangmu\mgsjk\03code\book\src\main\webapp\h5\readPage\\$1



