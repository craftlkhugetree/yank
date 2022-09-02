深入理解javascript作用域系列的第一篇——内部原理

　　内部原理分成编译、执行、查询、嵌套和异常五个部分进行介绍，最后以一个实例过程对原理进行完整说明

# 编译
　　以var a = 2;为例，说明javascript的内部编译过程，主要包括以下三步：

【1】分词(tokenizing)

　　把由字符组成的字符串分解成有意义的代码块，这些代码块被称为词法单元(token)

　　var a = 2;被分解成为下面这些词法单元：var、a、=、2、;。这些词法单元组成了一个词法单元流数组

// 词法分析后的结果
[
  "var" : "keyword",
  "a" : "identifier",
  "="   : "assignment",
  "2"  : "integer",
  ";"   : "eos" (end of statement)
]
【2】解析(parsing)

　　把词法单元流数组转换成一个由元素逐级嵌套所组成的代表程序语法结构的树，这个树被称为“抽象语法树” (Abstract Syntax Tree, AST)

　　var a = 2;的抽象语法树中有一个叫VariableDeclaration的顶级节点，接下来是一个叫Identifier(它的值是a)的子节点，以及一个叫AssignmentExpression的子节点，且该节点有一个叫Numericliteral(它的值是2)的子节点

{
  operation: "=",
  left: {
    keyword: "var",
    right: "a"
  }
  right: "2"
}
【3】代码生成

　　将AST转换为可执行代码的过程被称为代码生成

　　var a=2;的抽象语法树转为一组机器指令，用来创建一个叫作a的变量(包括分配内存等)，并将值2储存在a中

　　实际上，javascript引擎的编译过程要复杂得多，包括大量优化操作，上面的三个步骤是编译过程的基本概述

　　任何代码片段在执行前都要进行编译，大部分情况下编译发生在代码执行前的几微秒。javascript编译器首先会对var a=2;这段程序进行编译，然后做好执行它的准备，并且通常马上就会执行它

 

# 执行
　　简而言之，编译过程就是编译器把程序分解成词法单元(token)，然后把词法单元解析成语法树(AST)，再把语法树变成机器指令等待执行的过程

　　实际上，代码进行编译，还要执行。下面仍然以var a = 2;为例，深入说明编译和执行过程

【1】编译
    对于  var a = 2;
　　1、编译器查找作用域是否已经有一个名称为a的变量存在于同一个作用域的集合中。如果是，编译器会忽略该声明，继续进行编译；否则它会要求作用域在当前作用域的集合中声明一个新的变量，并命名为a

　　2、编译器将var a = 2;这个代码片段编译成用于执行的机器指令

　　[注意]依据编译器的编译原理，javascript中的重复声明是合法的

//test在作用域中首次出现，所以声明新变量，并将20赋值给test
var test = 20;
//test在作用域中已经存在，直接使用，将20的赋值替换成30
var test = 30;
【2】执行

　　1、引擎运行时会首先查询作用域，在当前的作用域集合中是否存在一个叫作a的变量。如果是，引擎就会使用这个变量；如果否，引擎会继续查找该变量

　　2、如果引擎最终找到了变量a，就会将2赋值给它。否则引擎会抛出一个异常

 

# 查询(执行的第一步)
　　在引擎执行的第一步操作中，对变量a进行了查询，这种查询叫做LHS(Left-hand Side)查询。实际上，引擎查询共分为两种：LHS查询和RHS查询 

　　从字面意思去理解，当变量出现在赋值操作的左侧时进行LHS查询，出现在右侧时进行RHS查询

　　更准确地讲，RHS查询与简单地查找某个变量的值没什么区别，而LHS查询则是试图找到变量的容器本身，从而可以对其赋值

function foo(a){
    console.log(a);//2
}
foo( 2 );
　　这段代码中，总共包括4个查询，分别是：

　　1、foo(...)对foo进行了RHS引用

　　2、函数传参a = 2对a进行了LHS引用

　　3、console.log(...)对console对象进行了RHS引用，并检查其是否有一个log的方法

　　4、console.log(a)对a进行了RHS引用，并把得到的值传给了console.log(...)

 

嵌套
　　在当前作用域中无法找到某个变量时，引擎就会在外层嵌套的作用域中继续查找，直到找到该变量，或抵达最外层的作用域（也就是全局作用域）为止

function foo(a){
    console.log( a + b ) ;
}
var b = 2;
foo(2);// 4
　　在代码片段中，作用域foo()函数嵌套在全局作用域中。引擎首先在foo()函数的作用域中查找变量b，并尝试对其进行RHS引用，没有找到；接着，引擎在全局作用域中查找b，成功找到后，对其进行RHS引用，将2赋值给b

 

异常
　　为什么区分LHS和RHS是一件重要的事情？因为在变量还没有声明（在任何作用域中都无法找到变量）的情况下，这两种查询的行为不一样

RHS

【1】如果RHS查询失败，引擎会抛出ReferenceError(引用错误)异常

//对b进行RHS查询时，无法找到该变量。也就是说，这是一个“未声明”的变量
function foo(a){
    a = b;  
}
foo();//ReferenceError: b is not defined
【2】如果RHS查询找到了一个变量，但尝试对变量的值进行不合理操作，比如对一个非函数类型值进行函数调用，或者引用null或undefined中的属性，引擎会抛出另外一种类型异常：TypeError(类型错误)异常

function foo(){
    var b = 0;
    b();
}
foo();//TypeError: b is not a function
LHS

【1】当引擎执行LHS查询时，如果无法找到变量，全局作用域会创建一个具有该名称的变量，并将其返还给引擎

function foo(){
    a = 1;   // 若为var a = 1; 则结果是ReferenceError: a is not defined
}
foo();
console.log(a);//1
【2】如果在严格模式中LHS查询失败时，并不会创建并返回一个全局变量，引擎会抛出同RHS查询失败时类似的ReferenceError异常

function foo(){
    'use strict';
    a = 1;  
}
foo();
console.log(a);//ReferenceError: a is not defined
 

原理
function foo(a){
    console.log(a);
}
foo(2);
　　以上面这个代码片段来说明作用域的内部原理，分为以下几步：

【1】引擎需要为foo(...)函数进行RHS引用，在全局作用域中查找foo。成功找到并执行

【2】引擎需要进行foo函数的传参a=2，为a进行LHS引用，在foo函数作用域中查找a。成功找到，并把2赋值给a

【3】引擎需要执行console.log(...)，为console对象进行RHS引用，在foo函数作用域中查找console对象。由于console是个内置对象，被成功找到

【4】引擎在console对象中查找log(...)方法，成功找到

【5】引擎需要执行console.log(a)，对a进行RHS引用，在foo函数作用域中查找a，成功找到并执行

【6】于是，引擎把a的值，也就是2传到console.log(...)中

【7】最终，控制台输出2


# 动态作用域
　　javascript使用的是 *** 词法作用域 *** ，它最重要的特征是它的定义过程发生在代码的书写阶段。

　　那为什么要介绍动态作用域呢？实际上动态作用域是javascript另一个重要机制this的表亲。作用域混乱多数是因为词法作用域和this机制相混淆，傻傻分不清楚

　　动态作用域并不关心函数和作用域是如何声明以及在任何处声明的，只关心它们从何处调用。换句话说，作用域链是基于调用栈的，而不是代码中的作用域嵌套

var a = 2;
function foo() {
    console.log( a );
}
function bar() {
    var a = 3;
    foo();
}
bar(); // 2
　　【1】如果处于词法作用域，也就是现在的javascript环境。变量a首先在foo()函数中查找，没有找到。于是顺着作用域链到全局作用域中查找，找到并赋值为2。所以控制台输出2

#　【2】如果处于动态作用域，同样地，变量a首先在foo()中查找，没有找到。这里会顺着调用栈在调用foo()函数的地方，也就是bar()函数中查找，找到并赋值为3。所以控制台输出3

　　两种作用域的区别，简而言之，词法作用域是在定义时确定的，而动态作用域是在运行时确定的



* 声明从它们在代码中出现的位置被“移动”到了最上面，这个过程就叫作提升(hoisting)

引擎会在解释javascript代码之前首先对其进行编译。编译阶段中的一部分工作就是找到所有的声明，并用合适的作用域将它们关联起来

   # 包括变量和函数在内的所有声明都会在任何代码被执行前首先被处理

var a = 2 ;
　　这个代码片段实际上包括两个操作：var a 和 a = 2 
# 第一个定义声明是在编译阶段由编译器进行的。第二个赋值操作会被留在原地等待引擎在执行阶段执行————也就是a = 2时序靠后，相当于var a 时序提升了。

hoisting只是不报错，但是输出还是按照词法作用域，是undefined。
foo(); // 1
function foo(){
    console.log(1);
}
# 函数声明的提升有效，但函数表达式却不行。相当于在对undefined进行函数调。
foo(); // TypeError: foo is not a function
var foo = function(){
    console.log(1);
}
上述foo()不会导致ReferenceError。但是foo此时并没有赋值，foo()由于对undefined值进行函数调用而导致非法操作，因此会抛出TypeError异常
　　函数声明和变量声明都会被提升。但是，函数声明会覆盖变量声明

　　[注意]变量的重复声明是无用的，但函数的重复声明会覆盖前面的声明(无论是变量还是函数声明)

for (var i= 0; i<10; i++) {
    console.log(i);
}
　　上面这段是很熟悉的循环代码，通常是因为只想在for循环内部的上下文中使用变量i，但实际上i可以在全局作用域中访问，污染了整个作用域

for (var i= 0; i<10; i++) {
     console.log(i);
}
console.log(i);//10
let关键字可以将变量绑定到所在的任意作用域中(通常是{...}内部)， *** 实现块作用域. ***
　for循环头部的let不仅将i绑定到了for循环的块中，事实上它将其重新绑定到了循环的每一个迭代中，确保使用上一个循环迭代结束时的值重新进行赋值

# 下面代码中，犯错原因是在循环的过程中，并没有把函数的返回值赋值给数组元素，而仅仅是把函数赋值给了数组元素。这就使得在调用匿名函数a[0]时，通过作用域找到的执行环境中储存的变量的值已经不是循环时的瞬时索引值，而是循环执行完毕之后的索引值，所以控制台输出5，而不是0。
var a = [];
for(var i = 0; i < 5; i++){
    a[i] = function(){
        return i;
    }
}
console.log(a[0]()); // 5，因为这里i是全局i，用的是同一个作用域。
    
当然，可以通过函数传参的IIFE，来保存每次循环的值。
# 因为函数传参是按值传递的，不同参数的函数被调用时，会创建不同的执行环境！！！
var a = [];
for(var i = 0; i < 5; i++){
    a[i] = (function(j){
        return function(){
            return j;
        }
    })(i);
}
console.log(a[0]()); // 0

而使用let则更方便，由于let循环有一个重新赋值的过程，相当于保存了每一次循环时的值。 *** let产生了5个块级作用域{} ***
var a = [];
for(let i = 0; i < 5; i++){
    a[i] = function(){
        return i;
    }
}
console.log(a[0]()); // 0
# var 初始变量在for循环体内，是覆盖式的，用C的话来讲是共用体，即共用同一内存地址
# for内let初始变量在每一次循环中，都是一个独立的变量，拥有自己独立的内存地址。
{
    let j;
    for (j = 0; j < 5; j++) {
        let i = j; // 每个迭代重新绑定，重新声明
        a[i] = function(){
            return i;
        }
    }
}
函数用var还是用let来定义与是否形成闭包无关，仅仅影响外部是否能直接调用该函数。

# 但如果函数内引用的变量是let定义的局部变量，那就会形成副本内i的闭包；

如果函数内引用的是for内var定义的全局变量，那闭包在全局变量。

  function user (){
         let i=1;
         function show(){
             console.log(++i)
         }
         show();
     }
     user();//输出2
     user();//输出2
     每次user();使用的时候，会开辟一个新的内存空间，然后使用函数user，所以i始终都被let声明i=1；
     所以我们无论调用几次 user(); 这里输出都是2，并不会调用一直累加输出例如2,3,4,5这样；
     因为每次使用都会声明一个新的内存空间

     function user (){
        let i=1;
       return   function (){
            console.log(++i)
        }
    }
  let a=  user();
  a();//输出2
  a();//输出3
  a();//输出4
  那为什么会出现这种情况呢，其实是这样的，在user里面我们return返回了一个函数
  由于我们把user();指向了a，这里我们会开辟一个内存空间，会把 i 和 return 函数都指向了这个内存空间【硬绑定】
  由于我们指向了a，所以内存并不会被销毁，所以我们每次调用a()的时候都会指向原来开辟的那个空间，
  所以会出现输出2,3,4这种情况

解释为什么for (var i = 0; i<=5; i++){setTimeout(()=>{console.log(i)})}输出是6个6。如下在每次执行循环体之前，var声明的i并不会在循环体上下文中重新声明和初始化一次，这个步骤在i实际所在外部就近函数或者全局函数中完成。因此，当A作用域中如果是一个函数setTimeout(()=>{console.log(i)})，产生了闭包。依照闭包中i仍保持着对外部A作用域中活动对象i的引用的逻辑，但是作用域A中并没用i。所以顺着作用域链往上找，直到找到实际i所在外部就近函数或者全局函数，找到了还需要等循环走完，返回实际i为6的值。
for (var i = 0; i <= 5; i++)
{
    // 作用域A
}
/*
    作用域如下：
    i 在外部就近函数或者全局函数中
    A: {
        // 6个副本
     }
 */
而for let { 循环体 } 在每次执行循环体之前，JS 引擎会把 i 在循环体的上下文中重新声明及初始化一次。6个副本B作用域中都会重新声明及初始化一次i，那么如果B作用域中是一个函数setTimeout(()=>{console.log(i)})，产生了闭包。那么闭包中的i自然而然仍保持着对外部B作用域中活动对象i的引用。
/*
    作用域如下：
    A: {
        B: {
            i 变量在B作用域中
            // 6个副本
        }
    }
 */

块级作用域：
try{
    throw 2;
}catch(a){
    console.log( a ); // 2
}
console.log( a ); //ReferenceError: a is not defined

# 作用域是一套规则，用于确定在何处以及如何查找标识符。

　　作用域分为词法作用域和动态作用域(执行上下文)。javascript使用词法作用域，简单地说，词法作用域就是定义在词法阶段的作用域，是由写代码时将变量和函数写在哪里来决定的。于是词法作用域也可以描述为程序源代码中定义变量和函数的区域。各个作用域的嵌套关系组成了一条作用域链。
使用作用域链主要是进行标识符的查询，标识符解析就是沿着作用域链一级一级地搜索标识符的过程，而作用域链就是要保证对变量和函数的有序访问

　　【1】如果自身作用域中声明了该变量，则无需使用作用域链
　【2】如果自身作用域中未声明该变量，则需要使用作用域链进行查找

　　这时，就引出了另一个概念——自由变量。在当前作用域中存在但未在当前作用域中声明的变量叫自由变量
在下面的例子中，如果要在bar函数中查询变量b，由于b并没有在当前作用域中声明，所以b是自由变量。bar函数的作用域链是bar -> fn -> 全局。到上一级fn作用域中查找b没有找到，继续到再上一级全局作用域中查找b，找到了b：

var a = 1;
var b = 2;

function fn(x){
    var a = 10;

    function bar(x){
        var a = 100;
        b = x + a;
        return b;
    }
    bar(20); // bar内this是undefined然后被赋值为window
    bar(200);
}
fn(0);
# 如果标识符没有找到，则需要分为RHS和LHS查询进行分析，若进行的是LHS查询，则在全局环境中声明该变量，若是严格模式下的LHS查询，则抛出ReferenceError(引用错误)异常；若进行的是RHS查询，则抛出ReferenceError(引用错误)异常。
执行环境(execution context)，有时也称为执行上下文、执行上下文环境或环境，定义了变量或函数有权访问的其他数据。每个执行环境都有一个与之关联的变量对象(variable object *** this ***)，环境中定义的所有变量和函数都保存在这个对象中。
# 一定要区分执行环境和变量对象。执行环境会随着函数的调用和返回，不断的重建和销毁。但变量对象在有变量引用(如闭包)的情况下，将留在内存中不被销毁。
这是上面代码执行到第15行时fn(0)函数的执行环境，执行环境里的变量对象保存了fn()函数作用域内所有的变量和函数的值：
x:0
a:undefined
bar:function
arguments:[0]
this:window
执行流是第1行 -> 第2行 -> 第4行 -> 第15行 -> 第5行 -> 第7行 -> 第12行 -> 第8行 -> 第9行 -> 第10行 -> 第11行 -> 第13行 -> 第8行 -> 第9行 -> 第10行 -> 第11行 -> 第14行
执行环境栈类似于作用域链，有序地保存着当前程序中存在的执行环境。当执行流进入一个函数时，函数的环境就会被推入一个环境栈中。而在函数执行之后，栈将其环境弹出，把控制权返回给之前的执行环境。javascript程序中的执行流正是由这个机制控制着。

总结
　　【1】javascript使用的是词法作用域。对于函数来说，词法作用域是在函数定义时就已经确定了，与函数是否被调用无关。通过作用域，可以知道作用域范围内的变量和函数有哪些，却不知道变量的值是什么。所以作用域是静态的

　　[注意]通过eval()函数和with语句可以对作用域进行动态修改

　　【2】对于函数来说，执行环境是在函数调用时确定的，执行环境包含作用域内所有变量和函数的值。在同一作用域下，不同的调用(如传递不同的参数)会产生不同的执行环境，从而产生不同的变量的值。所以执行环境是动态的

https://www.jb51.net/article/161608.htm
https://xiaohuochai.site/JS/ECMA/this/binding.html

# this 对象就是指向函数当前的执行环境，执行环境是会在 Event Loop（事件循环）过程中变化的，因此 this 在函数环境下是属于运行时的，不是变量对象VO。
var name = 'Tom';
 
var obj = {
  name: 'Iceberg',
  say: function() {
    console.log('my name is ' + this.name);
  },
  sub: {
    say: function() {
      console.log('my name is ' + this.name);
    }
  }
};
 
obj.say(); // my name is Iceberg
obj.sub.say() // my name is undefined;
 
var say = obj.say;
say(); // my name is Tom;
上面的例子说明 obj.say() 执行环境为 obj 对象，而 obj.sub.say() 的执行环境却是 obj.sub 对象，而对于 obj.sub 来说并没有 name 属性，因此为 undefined；
# 而 var say = obj.say; 则表示将 say 方法的内存地址赋值给全局变量，因此从全局变量 name 中取值。

var handler = {
	nickname: 'anonymous',
	register: function() {
	  console.log(this.nickname);
	}	
}
$('#registerBtn').on('click', handler.register); // undefined

以上逻辑点击触发后输出的是 undefined，因为函数被当做事件触发的回调函数执行时，相当于把handler.register函数赋值给对应的click事件，this也指向该触发事件对应的元素，如要 this 仍然以 handler 对象为执行环境，则可使用函数的 bind 方法进行执行环境对象的绑定操作。
$('#registerBtn').on('click', handler.register.bind(handler)); // anonymous

在 react 中经常需要在回调函数中调用 this.state、this.props，按照上面的分析，将当前环境对象 bind 到回调函数中即可。

# 如果是使用的箭头函数定义回调函数即可无需 bind，因为箭头函数中 this 就是对应定义时所在的对象。


函数内的this：分为以下六种情况：
1.普通函数：通过 函数名（） 调用，普通函数内部的this指向window；
2.回调函数：回调函数指的是将一个函数作为参数进行传递，回调函数内部的this指向window；
3.对象方法：指的是通过 对象名.方法名（） 调用
4.事件方法：指的是绑定事件的处理函数，事件方法内部的this指向绑定事件的元素节点；
5.构造函数（class）：构造函数指的是通过 new 函数名（） 调用，构造函数（class）内部的this指向new出来的实例对象;
6.箭头函数：箭头函数中没有this，如果需要在箭头函数中访问this，实际访问的是箭头函数所在父级上下文中的this
————————————————

# 在函数被调用执行后，产生一个变量对象，从而this的指向也确定了，我总结了一个重要的结论:当前函数的this是在函数被调用执行的时候才确定。如果当前的执行上下文处于函数调用栈的栈顶，那么变量会变成活动对象，同时this的指向也确定了：

This指向
全局上下文
无论是在严格模式还是在非严格模式，在全局执行环境中this都是指向全局对象的，在浏览器中，通常是window；在Node环境中，则是globalThis.

函数上下文
在函数里，this的值取决于函数的调用方式。如果被对象调用，则指向这个对象，如果在函数中没有被调用，则this指向全局对象window或者undefined（严格模式）
————————————————
原文链接：https://blog.csdn.net/qq_40962935/article/details/116854317
this的几种绑定
1.默认绑定:函数调用无任何调用前缀的情景，它没有被上一级的对象所调用，且在非严格模式下，那么this指向全局对象window，在严格模式下this指向undefined
function a(){
	"use strict"	   	// 全局模式下，默认绑定的this指向undefined
	var user = 'zhangsan';
	console.log(this)	
}
a();  // undefined

2、隐式绑定 如果一个函数中有this,这个函数被上一级的对象所调用，那么this就会隐式绑定到这个对象上。

var o = {
	user:"zhangsan"；
	fn:function(){
		console.log(this.user)
 }
}
o.fn(); 	// zhangsan
如果一个函数中有this，这个函数包含多级对象，尽管这个函数是被最外层的对象所调用，this指向的也只是它上一级的对象。

3、隐式丢失 在特定情况下会存在隐式绑定丢失的问题，最常见的就是作为参数传递及变量赋值，如下：

	var o = {
				a: 10,
				b: {
					fn: function() {
						console.log(this.a) 
					}
				}
			}
			var j = o.b.fn;
			j(); // window
fn()函数作为参数传给变量j，只是单独的传递了一个函数，this并没有跟函数绑在一起，所以this丢失，这里指向了window。
这里this指向的是window,this永远指向的是最后调用它的对象，也就是看它执行的时候是谁调用的。虽然函数fn是被对象b所引用，但是在将fn赋值给变量j的时候并没有执行，所以最终指向的是window。

4、this的显式绑定
显示绑定是指我们通过call/apply/bind 显示改变this指向，相比隐式绑定，我们能清楚感知this指向的变化。
5、 new的绑定
new一个对象有几个过程，本质上是对应函数的this指向new出来的新对象，对象的隐式原型指向函数的显式原型，形成一条原型链，对象继承函数的属性和方法。
6、 this绑定优先级
显式绑定 > 隐式绑定 > 默认绑定
new绑定 > 隐式绑定 > 默认绑定



https://www.cnblogs.com/forcheng/p/12960972.html
在全局环境（全局执行上下文）中（在任何函数体外部的代码），this 始终指向全局对象
在函数环境（函数执行上下文）中，绝大多数情况，函数的调用方式决定了 this 的值，这与调用函数的()左侧的部分 MemberExpression 的解释执行的结果的类型是不是 Reference 类型直接关联。


执行环境是一个抽象的对象（this就是执行上下文的一个属性）：
Variable object：变量对象，用于存储被定义在执行上下文中的变量 (variables) 和函数声明 (function declarations) 。
Scope chain：作用域链，是一个对象列表 (list of objects) ，用以检索上下文代码中出现的标识符 (identifiers) 。
thisValue：this 指针，是一个与执行上下文相关的特殊对象，也被称之为上下文对象。
在非严格模式下， 当 this 的值为 undefined 时，会被隐式转换为全局对象。

我们来看看 EcmaScript 5.1标准的规定，了解一下 函数调用 的规范：

11.2.3 函数调用

产生式 CallExpression : MemberExpression Arguments 按照下面的过程执行 :

令 ref 为解释执行 MemberExpression 的结果 .
令 func 为 GetValue(ref).
令 argList 为解释执行 Arguments 的结果 , 产生参数值们的内部列表 (see 11.2.4).
如果 Type(func) is not Object ，抛出一个 TypeError 异常 .
如果 IsCallable(func) is false ，抛出一个 TypeError 异常 .
如果 Type(ref) 为 Reference，那么 如果 IsPropertyReference(ref) 为 true，那么 令 thisValue 为 GetBase(ref). 否则 , ref 的基值是一个环境记录项 , 令 thisValue 为 GetBase(ref).ImplicitThisValue().
否则 , 假如 Type(ref) 不是 Reference. 令 thisValue 为 undefined.
返回调用 func 的 [[Call]] 内置方法的结果 , 传入 thisValue 作为 this 值和列表 argList 作为参数列表
产生式 CallExpression : CallExpression Arguments以完全相同的方式执行，除了第1步执行的是其中的CallExpression。

简单解析：

第1步，令 ref 为 MemberExpression 解释执行的结果。

在 11.2 左值表达式 中有提到，MemberExpression 可以是以下五种表达式中的任意一种:

PrimaryExpression // 原始表达式
FunctionExpression // 函数定义表达式
MemberExpression [ Expression ] // 属性访问表达式
MemberExpression . IdentifierName // 属性访问表达式
new MemberExpression Arguments // 对象创建表达式
简单理解 MemberExpression 就是调用一个函数的()左侧的部分。

第2~5步，获取调用函数的参数列表以及检测所调用的函数是否合法，否则抛出相应异常（GetValue的作用是获取 Reference 类型具体的值）。

第6、7步，就是决定函数调用的 this 的值的关键步骤，翻译一下，如同下面的伪代码：

var thisValue = getThisValue(ref)

function getThisValue(ref) {
  // 判断 ref 的类型是否是 Reference，如果不是，直接返回 undefined
  if(Type(ref) !== Reference) return undefined
  
  // 是否是 Object, Boolean, String, Number
  if(IsPropertyReference(ref)) {
    return GetBase(ref)
  } else {
    // 是一个环境记录项（Environment record），调用其 ImplicitThisValue 方法
    return GetBase(ref).ImplicitThisValue()
  }
}
关于 GetBase 和 IsPropertyReference 方法：

GetBase(V)， 返回引用值 V 的基值 （Reference 的基值 base，详见下面提到的 Reference 的组成）。
HasPrimitiveBase(V)， 如果基值是 Boolean, String, Number，那么返回 true。
IsPropertyReference(V)， 如果基值是个对象或 HasPrimitiveBase(V) 是 true，那么返回 true；否则返回 false。
而对于 ImplicitThisValue 方法，其属于环境记录项（Environment record）的方法。而环境记录项分为两种：

声明式环境记录项：每个声明式环境记录项都与一个包含变量和（或）函数声明的 ECMA 脚本的程序作用域相关联。声明式环境记录项用于绑定作用域内定义的一系列标识符。其 ImplicitThisValue 永远返回 undefined。

对象式环境记录项：每一个对象式环境记录项都有一个关联的对象，这个对象被称作 绑定对象 。对象式环境记录项直接将一系列标识符与其绑定对象的属性名称建立一一对应关系。其 ImplicitThisValue 通常返回 undefined，除非其 provideThis 标识的值为 true。具体如下：

令 envRec 为函数调用时对应的声明式环境记录项。
如果 envRec 的 provideThis 标识的值为 true，返回 envRec 的绑定对象。
否则返回 undefined。
对象式环境记录项可以通过配置的方式，将其绑定对象合为函数调用时的隐式 this 对象的值。这一功能用于规范 With 表达式（12.10 章 ）引入的绑定行为。该行为通过对象式环境记录项中布尔类型的 provideThis 值控制，默认情况下，provideThis 的值为 false。（只有使用了 with 表达式，才会将 provideThis 标识的值为 true）


而上面提到了两种新的类型： 引用规范类型 （Reference）与 环境记录项（Environment record）都是属于ECMAScript 的规范类型，相当于 meta-values，是用来用算法描述 ECMAScript 语言结构和 ECMAScript 语言类型的。

而与规范类型相对于的就是语言类型：就是开发者直接使用的类型，即Undefined, Null, Boolean, String, Number, 和 Object。（ECMAScript的类型分为语言类型和规范类型）


从上面的伪代码中可以看到 thisValue 的值与 ref 是否是引用规范类型（Reference）有直接关联，即调用一个函数时，其()左侧的部分的解释执行的结果的类型是不是 Reference 类型，将直接影响 thisValue 的值。

EcmaScript 5.1标准中的 Reference 的规范：

8.7 引用规范类型 （Reference）

Reference 类型是用来说明 delete，typeof，赋值运算符这些运算符的行为。

一个 Reference 是个已解决的命名绑定。其由三部分组成， 基值 (base) ， 引用名称（referenced name） 和布尔值 严格引用 (strict reference) 标志。

基值是 undefined, Object, Boolean, String, Number, Environment record 中的任意一个。基值是 undefined 表示此引用可以不解决一个绑定。引用名称是一个字符串。严格引用标志表示是否在严格模式下解释执行的代码。

而引用规范类型（Reference）会被用在标识符解析中，标识符执行的结果总是一个 Reference 类型的值。

EcmaScript 5.1标准中的 标识符解析 的规范：

10.3.1 标识符解析

标识符解析是指使用正在运行的执行环境中的词法环境，通过一个 标识符 获得其对应的绑定的过程。在 ECMA 脚本代码执行过程中，PrimaryExpression : Identifier 这一语法产生式将按以下算法进行解释执行：

令 env 为正在运行的执行环境的 词法环境 。
如果正在解释执行的语法产生式处在 严格模式下的代码 中，则仅 strict 的值为 true，否则令 strict 的值为 false。
以 env，Identifier 和 strict 为参数，调用 GetIdentifierReference 函数，并返回调用的结果。
解释执行一个标识符得到的结果必定是 Reference 类型的对象，且其引用名属性的值与 Identifier 字符串相等。

而 GetIdentifierReference 函数就是返回一个 Reference 类型的对象，类似如下对象：

var valueOfReferenceType = {
    base: <base object>, // Identifier 所处的环境（Environment Record）或者 Identifier 属性所属的对象
    propertyName: <property name>, // 与 Identifier 字符串相等
    strict: <boolean>
};

因此，我们可以来看一些相关的示例代码。

第一组：非严格模式和严格模式的全局函数

function foo() {
  console.log(this)
}

function bar() {
  'use strict'
  console.log(this)
}

foo() // global
bar() // undefined

// foo 标识符对应的 Reference
var fooReference = {
  base: EnvironmentRecord,
  propertyName: 'foo',
  strict: false
}

// bar 标识符对应的 Reference
var barReference = {
  base: EnvironmentRecord,
  propertyName: 'bar',
  strict: true
}
上述代码中，对于 fooReference，根据函数调用规范可知其 this = getThisValue(fooReference) = GetBase(fooReference).ImplicitThisValue() = undefined，而 barReference 也是一样。

但为什么 foo() 输出的是 global 全局对象而不是 undefined 呢？这是因为在非严格模式下， 当 this 的值为 undefined 时，会被隐式转换为全局对象。而在严格模式下，指定的 this 不再被封装为对象。


第二组：对象的属性访问

var foo = {
  bar: function () {
      console.log(this)
  }
}

foo.bar() // foo

// foo 的 bar 属性对应的 Reference
var barReference = {
  base: foo,
  propertyName: 'bar',
  strict: false
}
上述代码中，对于 barReference，根据函数调用规范可知 this = getThisValue(barReference) = GetBase(barReference) = foo

在 foo.bar()中，MemberExpression 计算的结果是 foo.bar，为什么它是一个 Reference 类型呢？

EcmaScript 5.1标准中的 属性访问 的规范：

11.2.1 属性访问

返回一个 Reference 类型的值，其基值为 baseValue 且其引用名为 propertyNameString, 严格模式标记为 strict.
这里只引用了最后一步，属性访问最终返回的值是一个 Reference 类型。


第三组：非 Reference 类型的函数调用

首先，需要简单了解一下 GetValue 方法，其作用是获取 Reference 类型具体的值，返回结果不再是一个 Reference。例如：

var foo = 1

// foo 标识符对应的 Reference
var fooReference = {
  base: EnvironmentRecord,
  propertyName: 'foo',
  strict: false
}

GetValue(fooReference) // 1
示例代码：

value = 1

var foo = {
  value: 2,
  bar: function () {
    console.log(this.value)
  }
};

foo.bar();   // 2
(foo.bar)(); // 2

(false || foo.bar)();   // 1
(foo.bar = foo.bar)();  // 1
(foo.bar, foo.bar)();   // 1
在上述示例代码中：

对于 (foo.bar)，foo.bar 被 () 包住，使用了分组运算符，查看规范 11.1.6 分组操作符，可知分组表达式不会调用 GetValue 方法， 所以 (foo.bar)仍旧是一个 Reference 类型，因此 this 为 Reference 类型的 base 对象，即 foo。
对于 (false || foo.bar)，有逻辑与算法，查看规范 11.11 二元逻辑运算符，可知二元逻辑运算符调用了 GetValue 方法，所以false || foo.bar不再是一个 Reference 类型，因此 this 为 undefined，非严格模式下，被隐式转化为 global 对象。
对于 (foo.bar = foo.bar)，有赋值运算符，查看规范 11.13.1 简单赋值，可知简单赋值调用了 GetValue 方法，所以foo.bar = foo.bar不再是一个 Reference 类型，因此 this 为 undefined，非严格模式下，被隐式转化为 global 对象。
对于 (foo.bar, foo.bar)，有逗号运算符，查看规范 11.14 逗号运算符，可知逗号运算符调用了 GetValue 方法，所以foo.bar, foo.bar不再是一个 Reference 类型，因此 this 为 undefined，非严格模式下，被隐式转化为 global 对象。

3.总结

在全局环境（全局执行上下文）中（在任何函数体外部的代码），this 始终指向全局对象
在函数环境（函数执行上下文）中，绝大多数情况，函数的调用方式决定了 this 的值，这与调用函数的()左侧的部分 MemberExpression 的解释执行的结果的类型是不是 Reference 类型直接关联。



# 构造函数就是一个使用New操作符调用的函数，只有使用New调用时，构造函数里面的this对象才会指向实例，如果像如下调用：
function Student(name,age){
    this.name = name;
    this.age = age;
}
var Tom = Student('Tom',12);
访问Tom.name是未定义的，这是因为此时的this指向了window,访问window.name就会得到'Tom'。其实很多时候我们会忘掉使用New操作符去实例化一个对象，造成this晚绑定。如果想避免这种问题就需要使用如下构造方式：
function Student(name,age){
    if( this instanceof Student){
        this.name = name;
        this.age = age;
    } else {
        return new Student(name,age);
    }
}


【间接引用】

 函数的"间接引用"一般都在无意间创建，最容易在赋值时发生，会造成隐式丢失

function foo() {
    console.log( this.a );
}
var a = 2;
var o = { a: 3, foo: foo };
var p = { a: 4 };
o.foo(); // 3
# //将o.foo函数赋值给p.foo函数，然后立即执行。相当于仅仅是foo()函数的立即执行
(p.foo = o.foo)(); // 2, this: window

在javascript引擎内部，obj和obj.foo储存在两个内存地址，简称为M1和M2。只有obj.foo()这样调用时，是从M1调用M2，因此this指向obj。但是，下面三种情况，都是直接取出M2进行运算，然后就在全局环境执行运算结果（还是M2），因此this指向全局环境：
var a = 0;
var obj = {
    a : 2,
    foo:foo
};
function foo() {
    console.log( this.a );
};

(obj.foo = obj.foo)();//0

(false || obj.foo)();//0

(1, obj.foo)();//0


显式绑定：
var a = 0;
function foo(){
    console.log(this.a);
}
var obj = {
    a:2
};
foo();//0
foo.call(obj);// 2

【硬绑定】

　　硬绑定是显式绑定的一个变种，使this不能再被修改

var a = 0;
function foo(){
    console.log(this.a);
}
var obj = {
    a:2
};
var bar= function(){
    foo.call(obj);
}
//在bar函数内部手动调用foo.call(obj)。因此，无论之后如何调用函数bar，它总会手动在obj上调用foo
bar();//2
setTimeout(bar,100);//2
bar.call(window);//2


【API】

# javascript中新增了许多内置函数，具有显式绑定的功能，如数组的5个迭代方法：map()、forEach()、filter()、some()、every()

var id = 'window';
function foo(el){
    console.log(el,this.id);
}
var obj = {
    id: 'fn'
};
[1,2,3].forEach(foo);//1 "window" 2 "window" 3 "window"
[1,2,3].forEach(foo,obj);//1 "fn" 2 "fn" 3 "fn"

最后
# this的四种绑定规则：默认绑定、隐式绑定、显式绑定和new绑定，分别对应函数的四种调用方式：独立调用、方法调用、间接调用和构造函数调用。

　　分清这四种绑定规则不算难，比较麻烦的是需要练就火眼金睛，识别出隐式丢失的情况

　　说到底，javascript如此复杂的原因是因为函数过于强大。因为，函数是对象，所以原型链比较复杂；因为函数可以作为值被传递，所以执行环境栈比较复杂；同样地，因为函数具有多种调用方式，所以this的绑定规则也比较复杂

　　只有理解了函数，才算理解了javascript


显式绑定 pk 隐式绑定
　　显式绑定胜出

function foo() {
    console.log( this.a );
}
var obj1 = {
    a: 2,
    foo: foo
};
var obj2 = {
    a: 3,
    foo: foo
};
obj1.foo(); // 2
obj2.foo(); // 3
//在该语句中，显式绑定call(obj2)和隐式绑定obj1.foo同时出现，最终结果为3，说明被绑定到了obj2中
obj1.foo.call( obj2 ); // 3
obj2.foo.call( obj1 ); // 2


new绑定 pk 隐式绑定
　　new绑定胜出

function foo(something) {
    this.a = something;
}
var obj1 = {foo: foo};
var obj2 = {};
obj1.foo( 2 );
console.log( obj1.a ); // 2
obj1.foo.call(obj2,3);
console.log( obj2.a ); // 3
//在下列代码中，隐式绑定obj1.foo和new绑定同时出现。最终obj1.a结果是2，而bar.a结果是4，说明this被绑定在bar上
var bar = new obj1.foo( 4 );
console.log( obj1.a ); // 2
console.log( bar.a ); // 4


new绑定 pk 显式绑定
　　new绑定胜出

function foo(something) {
    this.a = something;
}
var obj1 = {};
//先将obj1绑定到foo函数中，此时this值为obj1
var bar = foo.bind( obj1 );
bar( 2 );
console.log(obj1.a); // 2
//通过new绑定，此时this值为baz
var baz = new bar( 3 );
console.log( obj1.a ); // 2
//说明使用new绑定时，在bar函数内，无论this指向obj1有没有生效，最终this都指向新创建的对象baz
console.log( baz.a ); // 3



对于闭包的痛点在于，闭包的this默认绑定到window对象，但又常常需要访问嵌套函数的this，所以常常在嵌套函数中使用var that = this，然后在闭包中使用that替代this，使用作用域查找的方法来找到嵌套函数的this值 

var a = 0;
function foo(){
    function test(){
        console.log(this.a);
    }
    return test;
};
var obj = {
    a : 2,
    foo:foo
}
obj.foo()();//0

var a = 0;
function foo(){
    var that = this;
    function test(){
        console.log(that.a);
    }
    return test;
};
var obj = {
    a : 2,
    foo:foo
}
obj.foo()();//2


解决：
　　而箭头函数的出现就可以很好的解决该问题。箭头函数根据当前的词法作用域而不是根据this机制顺序来决定this，所以，箭头函数会继承外层函数调用的this绑定，而无论this绑定到什么

var test = () => {
    console.log(this.a);
}
//形式上等价于
var test = function(){
    console.log(this.a);
}
//实质上等价于
function fn(){
    var that = this;
    var test = function(){
        console.log(that.a);
    }
}
var a = 0;
function foo(){
    var test = () => {
        console.log(this.a);
    }
    return test;
};
var obj = {
    a : 2,
    foo:foo
}
obj.foo()();//2

this机制与函数调用有关，而作用域则与函数定义有关。有没有什么是可以将this机制和作用域联系起来的呢？
　虽然箭头函数可以把作用域和this机制联系起来，但是却容易混淆，使代码难以维护。应该在作用域和this机制中二选一，否则它们就真的汇成一锅粥了。或者只使用词法作用域，或者只使用this机制，必要时使用bind()。尽量避免使用that=this和箭头函数。
* https://xiaohuochai.site/JS/ECMA/this/ArrowFunction.html


原文链接：https://blog.csdn.net/hexinyu_1022/article/details/82795517

bind：语法和call一模一样，区别在于立即执行还是等待执行，bind不兼容IE6~8
fn.call(obj, 1, 2); // 改变fn中的this，并且把fn立即执行
fn.bind(obj, 1, 2); // 改变fn中的this，fn并不执行

this改变为obj了，但是绑定的时候立即执行，当触发点击事件的时候执行的是fn的返回值undefined

document.onclick = fn.call(obj);

bind会把fn中的this预处理为obj，此时fn没有执行，当点击的时候才会把fn执行

document.onclick = fn.bind(obj);
————————————————
fn.call
当前实例(函数fn)通过原型链的查找机制，找到function.prototype上的call方法，function call(){[native code]}

fn.call()
把找到的call方法执行
当call方法执行的时候，内部处理了一些事情
1.首先把要操作的函数中的this关键字变为call方法第一个传递的实参
2.把call方法第二个及之后的实参获取到
3.把要操作的函数执行，并且把第二个以后传递进来的实参传递给函数
————————————————


g(s)etter
　　我们通过提供getter()和setter()函数来将要操作的变量保存在函数内部，防止其暴露在外部

var getValue,setValue;
(function(){
    var secret = 0;
    getValue = function(){
        return secret;
    }
    setValue = function(v){
        if(typeof v === 'number'){
            secret = v;
        }
    }
})();
console.log(getValue());//0
setValue(1);
console.log(getValue());//1


　类似地，使用闭包可以很方便的实现一个迭代器

function setup(x){
    var i = 0;
    return function(){
        return x[i++];
    }
}
var next = setup(['a','b','c']);
console.log(next());//'a'
console.log(next());//'b'
console.log(next());//'c'


判断是否重复
var firstLoad = (function(){
  var _list = [];
  return function(item){
    if(_list.indexOf(item) >= 0){
      return false;
    }else{
      _list.push(item);
      return true;
    }
  }
})();

firstLoad(10);//true
firstLoad(10);//false
firstLoad(20);//true
firstLoad(20);//false


# img对象经常用于数据上报
var report = function(src){
  var img = new Image();
  img.src = src;
}
report('http://xx.com/getUserInfo');
　　但是，在一些低版本浏览器中，使用report函数进行数据上报会丢失30%左右的数据，也就是说，report函数并不是每一次都成功地发起了HTTP请求

　　原因是img是report函数中的局部变量，当report函数的调用结束后，img局部变量随即被销毁，而此时或许还没来得及发出HTTP请求，所以此次请求就会丢失掉

　　现在把img变量用闭包封闭起来，就能解决请求丢失的问题

var report = (function(){
  var imgs = [];
  return function(src){
    var img = new Image();
    imgs.push(img);
    img.src = src;
  }
})()
report('http://xx.com/getUserInfo');



# 下面的函数可以用来判断，当前视图是小端字节序，还是大端字节序
一个占据四个字节的16进制数0x12345678，决定其大小的最重要的字节是“12”，最不重要的是“78”。小端字节序将最不重要的字节排在前面，储存顺序就是78563412；大端字节序则完全相反，将最重要的字节排在前面，储存顺序就是12345678。目前，所有个人电脑几乎都是小端字节序，所以TypedArray数组内部也采用小端字节序读写数据，或者更准确的说，按照本机操作系统设定的字节序读写数据

　　这并不意味大端字节序不重要，事实上，很多网络设备和特定的操作系统采用的是大端字节序。

const BIG_ENDIAN = Symbol('BIG_ENDIAN');
const LITTLE_ENDIAN = Symbol('LITTLE_ENDIAN');
function getPlatformEndianness() {
    let arr32 = Uint32Array.of(0x12345678);
    let arr8 = new Uint8Array(arr32.buffer);
    switch ((arr8[0]*0x1000000) + (arr8[1]*0x10000) + (arr8[2]*0x100) + (arr8[3])) {
    case 0x12345678:
    return BIG_ENDIAN;
    case 0x78563412:
    return LITTLE_ENDIAN;
    default:
        throw new Error('Unknown endianness');
    }
}
https://xiaohuochai.site/JS/HTML5/file.html