尾调用消除(Tail Call Elimination)或尾调用优化(Tail Call Optimization, TCO)。尾调用优化让位于尾位置的函数调用跟 goto 语句性能一样高，也因此使得高效的结构编程成为现实。
然而，对于 C++等语言来说，在函数最后 return g(x); 并不一定是尾递归——在返回之前很可能涉及到对象的析构函数，使得 g(x) 不是最后执行的那个。这可以通过返回值优化来解决。

递归用于解决某些问题，比如深层遍历等问题很有效，但是用不好很容易导致栈溢出错误（stack overflow），就算不发生栈溢出，使用不善则会导致严重的性能问题。

我们知道，函数调用会在内存形成一个“调用记录”，又称为“调用帧”（call frame），保存调用位置和内部变量等信息。递归导致的一系列嵌套函数的调用，会产生一系列的调用帧，所有的调用帧就形成了一个“调用栈”（call stack）。调用帧是保存在内存中的，当调用帧足够多的时候，就会出现栈溢出错误。

首先，我们来看看阶乘的递归函数：
// 仅限非严格模式
function factorial(n) {
if (n <= 1) return 1
return n * arguments.callee(n-1)
}
# argument为函数内部对象，包含传入函数的所有参数，arguments.callee代表函数名，多用于递归调用，防止函数执行与函数名紧紧耦合的现象，对于没有函数名的匿名函数也非常起作用。

// 严格模式和非严格莫是都可用
var factorial = function f(n){
if (n <= 1) return 1
return n * f(n-1)
}
总结来说，递归有可能导致的问题主要有两个：比较差的性能问题和栈溢出错误。
什么是尾递归？如果函数尾调用自身就成为尾递归。

上述的例子，显然不属于尾递归，很明显可以看出，return 后面的语句并不只是函数的调用，还有乘法操作，故不属于尾递归。
如何将优化之前的的表达式变成只有函数的调用而不包含其它额外的操作呢？
我们就把函数返回的结果记为 total，那么不妨在函数 factorial 加上第二个参数 total，即把函数此次调用返回的结果当作第二个参数。

# 尾递归可以保证函数执行时内存中始终只保留一个调用帧，这将永远不会发生栈溢出错误，也不会造成差的性能问题。前提是尾部只有一个函数调用，那么递归时就可以都覆盖到这个函数帧上。

# 尾调用优化，尾调用是指某个函数的最后一步（不一定是出现在函数的尾部）是“纯粹地”调用另一个函数；而尾调用优化就是只保留内部函数的调用帧，节省内存。尾递归，尾调用自身，相当于普通的递归，由于只存在一个调用帧，不会发生“栈溢出”。
当编译器检测到一个函数调用是尾递归的时候，它就覆盖当前的活动记录而不是在栈中去创建一个新的。编译器可以做到这点，因为递归调用是当前活跃期内最后一条待执行的语句，于是当这个调用返回时栈帧中并没有其他事情可做，因此也就没有保存栈帧的必要了。通过覆盖当前的栈帧而不是在其之上重新添加一个，这样所使用的栈空间就大大缩减了，这使得实际的运行效率会变得更高。

// 阶乘尾递归之前
function factorial(n) {
if (n <= 1) return 1
return n * factorial(n-1)
}
因为每个活跃期的返回值都依赖于用n乘以下一个活跃期的返回值，因此每次调用产生的栈帧将不得不保存在栈上直到下一个子调用的返回值确定。
# 数学归纳法必须先确保 1，2 都正确，才能假定 n=m 时成立，证明 n=m+1 也成立。

// 尾递归之后
function factorial(n, total = 1) {
if (n <= 1) return total
return factorial(n-1, n * total)
}
total也就是a（初始化为1）维护递归层次的深度。这就让我们避免了每次还需要将返回值再乘以n。然而，在每次递归调用中，令a=n*a并且n=n－1。继续递归调用，直到n=1，这满足结束条件，此时直接返回a即可。
# 从原来的 n<=1时返回一个定值，变为返回一个经过计算的值，而计算放在了函数的参数里。 当然也可以用for循环来阶乘。

将著名的斐波那契数列进行尾递归优化：
优化之前：
function getFibo(n) {
if (n <= 2) return 1
return getFibo(n-1) + getFibo(n-2)
}
很明显，这不是尾递归。

首先结果依赖前两项计算的结果，所以函数需要再额外添加两个参数，这两个参数分别是前两项的计算结果，类比上面的阶乘例子，我们暂且把上一项的计算结果和本次的计算结果分别记为 a1 和 a2，由于本次计算的结果被我们记为了 a2，所以当 n<=2 时，return 后面应该是 a2 了，即第一行和第二行代码就变为了：

function getFibo(n, a1, a2){
if (n <= 2) return a2
类比上面的例子，也很容易得到第三行的代码：首先第一个参数 n - 1 不变，因为改变后的函数的第一个参数是 n。接下来第二个和第三个参数是我们添加上去的，最简单直接的方法还是令 n = 3，当 n = 3 时，上一次结算的结果由第二行代码可知为 a2，所以 return 后面的函数的第二个参数确定下来了，即为 a2，那么当 n = 3 时，本次计算的结果是多少呢，由第一行和第二行代码结合来看，可知当 n = 1 时的上一次计算结果为 a1，那么我们可得当 n = 2 时的计算结果为 a2，故 return 后面的表达式的第三个参数就为 a1 + a2，所以第三行代码就变成了：
return getFibo2(n-1, a2, a1 + a2); **_ // 要保证尾调用里含有计算表达式，同时用 if 语句保证开头常量正确，再归纳总结。 _**

function getFibo(n, a1 = 1, a2 = 1){
if (n <= 2) return a2
return getFibo2(n-1, a2, a1 + a2)
}
————————————————
原文链接：https://blog.csdn.net/weixin_40920953/article/details/87392754

// 有缓存的斐波那契数列函数
var fibona = (function() {
    var cache = {};
    return function (n) {
      if (cache[n]) return cache[n];
      if (n === 1 || n === 2) return 1;
      return cache[n] = fibona(n - 1) + fibona(n - 2);
    }
})();
console.log(fibona(4)) // 3

// for循环实现斐波那契数列：
#include<stdio.h>
int main()
{
	int i , f1=1, f2=1;
	for(i=1;i<=9; i++){
		int t = f1;
		f1=f2;
		f2=t+f2;
		printf("%d ",f2);
	}
	return 0; 
}

/**
 * 利用二分法快速排序
 */
var quickSort = function (arr) {
  if (arr.length <= 1) return arr;
  var left = [],
    right = [],
    middle = arr.splice(Math.floor(arr.length / 2), 1)[0],
    i = 0,
    item;
  for (; (item = arr[i++]); ) {
    item < middle ? (left[left.length] = item) : (right[right.length] = item);
  }
  return quickSort(left).concat([middle], quickSort(right));
};

// 经典快排:
function quicksort(arr) {
    if (!arr.length) {
        return [];
    }
    const [pivot, ...rest] = arr;
    return [
       ...quicksort(rest.filter(x=> x < pivot)),
       pivot,
       ...quicksort(rest.filter(x=> x >= pivot)),
    ];
}


数学基础
一般来说，估算算法资源消耗所需的分析是一个理论问题，因此需要一套数学分析法，我们先从数学定义开始。

定理1：如果存在正常数c和n0，使得当N>= n0时，T(N) <= cf(N)，则记为T(N) = O(f(N))。
定理2：如果存在正常数c和n0，使得当N>=n0时，T(N) <= cg(N)，则记为T(N) = Ω(g(N))。
定理3：T(N) = θ(h(N))当且仅当T(N) = O(h(N)) 和 T(N) = Ω(h(N))。
定理4：如果对每一个正常数c都存在常数n0使得当N>n0时，T(N) < cp(N)，则T(N) = o(p(N))。
这些定义的目的是要在函数间建立一种相对的级别。给定两个函数，通常存在一些点，在这些点上一个函数的值小于另一个函数的值，因此，一般宣称f(N)<g(N)，是没有什么意义的。于是，我们比较他们的相对增长率。当将相对增长率应用到算法分析时，会明白它是重要的度量。

如果用传统的不等式来计算增长率，那么第一个定义T(N) = O(f(N))是说T(N)的增长率小于或者等于f(N)的增长率。第二个定义T(N) = Ω(g(N))是说T(N)增长率大于或者等于g(N)的增长率。第三个定义T(N) = θ(h(N))是说T(N)的增长率等于h(N)的增长率。最后一个定义T(N) = o(p(N))说的则是T(N)的增长率小于p(N)的增长率。他不同于大O，因为大O包含增长率相同的可能性。

要证明某个函数T(N) = O(f(N)) ，通常不是形式的使用这些定义，而是使用一些已知的结果（比如说T(N) = O(log(N))）。一般来说，这就意味着证明是非常简单的计算而不应涉及微积分，除非遇到特殊情况。如下是常见的已知函数结果

c（常数函数）
logN（对数函数）
logN^2（对数平方函数）
N（线性函数）
NlogN
N^2（二次函数）
N^3（三次函数）
2^N（指数函数）
在使用已知函数结果时，有几点需要注意：

首先，将常数或低阶项放进大O是非常坏的习惯。不要写成T(N) = O(2*N^2)或T(N) = O(N^2 + N)。这两种情形下，正确的形式是T(N) = O(N^2)。也就是说低阶项一般可以被忽略，而常数也可以弃掉。
其次，我们总能够通过计算极限limN→∞f(N)/g(N)（极限公式）来确定两个函数f(N)和g(N)的相对增长率。该极限可以有四种可能的值：
极限是0：这意味着f(N) = o(g(N))。
极限是c != 0： 这意味着f(N) = θ(g(N))。
极限是∞ ：这意味着g(N) = o(f(N))。
极限摆动：二者无关。


以数组的形式返回字符串参数的所有排列组合：第一位和每一位进行换位轮流依次当老大，然后在把第一位去掉，又循环的把第一位和每一位进行换位轮流依次当老大，直到只剩一个元素的时候我们终止递归!
function getPlzh(string) {
    if(string.length == 1) {
        return [string]
    } else {
        let result = []
        for(let i = 0; i<string.length; i++) {
            let str = string[i];
            let params = string.slice(0,i) + string.slice(i+1);
            let res  = getPlzh(params);
            res.map(item => {
               result.push(str + item);
            })
        }
        return result;
    }
}
let array = getPlzh('abcd');
console.log(array)

// JS 中用递归思想解决数组拍平问题
function flatten(arr) {
    if (arr.length === 0) return [];
    const [first, ...rest] = arr;
    if (Array.isArray(first)) {
        return [...flatten(first), ...flatten(rest)]
    }
    return [first, ...flatten(rest)];
}
const aaa = flatten([1, [[2]]]); // [1, 2]
