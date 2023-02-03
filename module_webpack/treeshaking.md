在编程语言中有分为 动态语言(Dynamic Language) 以及 **静态语言(Static Language)**，被归类在 Dynamic Language 中比较常见的有 JavaScript、PHP、Python 等语言，至于被归类在 Static Language 比较常见的有 C++、Java 等语言。

# 在 Dynamic Language 中由于我们可以动态的载入非常多东西，例如 function、object 等，对于 Tree Shaking 来说这种会动态载入的东西实在是太难捉摸了，这也让 Dynamic Language 的 Tree Shaking 很难达到最完美。


在开始讲 Tree Shaking 原理之前必须要了解一个技术：死码删除(Dead Code Elimination)。

在 ​​compiler​​ 的领域中，为了达到执行时间的优化，在代码编译的过程中 compiler 会将对于最终结果没有影响到的代码删除，进而达到执行时间的优化，这段过程称之为 Dead Code Elimination。

乍看之下 Dead Code Elimination 在做的事情好像就是 Tree Shaking 要做到的事情，就是要删除无用的代码，但两者其实还是有著些微的差距，接下来就要讲讲 Tree Shaking 的原理。
Tree Shaking 其实是 Dead Code Elimination 的一种新的实现原理，在上面的 Dynamic Language 的观念中提到 Dynamic Language 的特性就是可以动态载入任何东西，因为这个特性让 Dead Code Elimination 相当难实现，因为 complier 永远不知道到底哪些程代码是对最终结果不会有影响的。
所以 Tree Shaking 其实要做到的不会像 Dead Code Elimination 那样死板板的要删除对结果不会有影响的程式码，而是要保留会需要用到的代码，这样也可以达到类似 Dead Code Elimination 的效果。

# ES6 module v.s commonJS
上面提到 Tree Shaking 的原理最主要的目的就是要保留会需要用到的代码，而这点在早期的 JavaScript 其实是无法实现的，但是在 ES6 诞生后有一个非常重要的概念叫：ES6 modules。

由于 ES6 modules 的诞生，我们可以在每个文件的最上方先引用即将会需要用到的东西，所以这些 bundler 就可以藉由这些​​ import file​​ 很快速的知道可以保留哪些文件，进而达到 Tree Shaking 的效果。

这时候读者可能会有另一个问题了，在 ES6 module 还没诞生以前我们也可以利用 commonJS 来进行 module 的导入，为什麽 ES6 module 可以做到 Tree Shaking 可是 commonJS 无法呢？

其实是因为 ES6 module 有著非常多的特性，让 bundler 可以针对这些特性来进行静态的分析：

module 必须要在顶层被 import。
module 内部会自动被定义为 strict mode。
module name 不能动态改变。
module 内容为 immutable 无法在其他文件中被动态新增或删除内容。
因为这些强限制在，所以 ES6 module 就可以让 bundler 做到 Tree Shaking 的效果，而 commonJS 则无法达到此点。

乍看之下 ​​default export​​​ 跟​​ named export​​ 在写法上好像没什麽太大的差别(除了直接在项目前面加上 export 的写法比较不一样外)，最终都是需要用一个物件来包装输出，但两者在 Tree Shaking 后的结果可是有著蛮大的差别：

可以看到上面两张图，虽然 Tree Shaking 都有把 multiply 这个 function 移除了，可是 ​​default export​​​ 相较于 ​​named export​​​ 还是新增了不少变量来处理 ​​function parameter​​，这样就不是一个完美的性能优化。

所以假如读者在开发时确定一个文件会需要同时输出很多项目，不管是对象也好函数也罢，这时候都建议用 ​​named export​​ 的方式进行输出这样才能达到最好的性能优化。