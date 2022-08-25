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

# regex

^(?!._(localhost|z.angke.com.cn))._$
^(?!.*(seat.dev.angke.cn|z.angke.com.cn|localhost)).*$

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
    const xmlarray = str.split(/(<title>[\d\D]*?<\/title>){1}/);  针对大量的括号对，要用非贪心匹配。点号不表示\n，所有字符应该用[\d\D]或者[\s\S]
或者加上  s  可以匹配换行符   console.log( /b.r/s.test('b\nr') )
/foo/igs.flags;   // "gis"


str.replace(/<[^>]*>/g, '');去掉所有尖括号对,非“>”的字符可以有一个或多个，也可以没有。


const reg = /(\d{3})(\d{2})(\d*)(\d{4})/
let phoneNum = "15612345678"
const res = phoneNum.replace(reg, '$1****$2****$3****$4')
console.log(res) // "156****12****34****5678"


非捕获分组：(?:表达式)，分组匹配之后，不需要的用 “?: ”语法过滤子表达式内容。也就是代码匹配，但是不保存。
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




