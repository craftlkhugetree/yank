不配置任何选项的html-webpack-plugin插件，他会默认将webpack中的entry配置所有入口thunk和extract-text-webpack-plugin抽取的css样式都插入到文件指定的位置。
inject向template或者templateContent中注入所有静态资源，不同的配置值注入的位置不同
1、true或者body：所有JavaScript资源插入到body元素的底部
2、head: 所有JavaScript资源插入到head元素中
3、false： 所有静态资源css和JavaScript都不会注入到模板文件中
https://www.cnblogs.com/tinaluo/p/15690857.html

0. npx webpack --config webpack.config.js
可以去掉后面的默认参数

const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
  plugins: [
    new BundleAnalyzerPlugin(), // 使用默认配置
  ],
import {join} from 'lodash/join'; 用哪个导入哪个
// 一些方法无法使用上述引入时，可尝试下面这种方式引入
// import { debounce} from 'lodash/function'

1. 
                       Asset       Size  Chunks                    Chunk Names
main.7e2c49a622975ebd9b7e.js     544 kB       0  [emitted]  [big]  main
                  index.html  197 bytes          [emitted]

 main.js的bundle 的名称是它内容（通过 hash）的映射。如果我们不做修改，然后再次运行构建，我们以为文件名会保持不变。然而情况并非如此：
 这是因为 webpack 在入口 chunk 中，包含了某些 **boilerplate**(引导模板)，特别是 runtime 和 manifest。（译注：boilerplate 指 webpack 运行时的引导代码）。

2. (1)webpack 还提供了一个优化功能，可使用 optimization.runtimeChunk 选项将 runtime 代码拆分为一个单独的 chunk。将其设置为 single 来为所有 chunk 创建一个 runtime bundle。
                          Asset       Size  Chunks             Chunk Names
runtime.cc17ae2a94ec771e9221.js   1.42 KiB       0  [emitted]  runtime
   main.e81de2cf758ada72f306.js   69.5 KiB       1  [emitted]  main
                     index.html  275 bytes          [emitted]
   (2)将第三方库(library)（例如 lodash 或 react）提取到单独的 vendor chunk 文件中，是比较推荐的做法，因为它们很少像本地的源代码那样频繁修改。因此通过实现以上步骤，利用 client 的长效缓存机制，命中缓存来消除请求，并减少向 server 获取资源，同时还能保证 client 代码和 server 代码版本一致。 这可以通过使用SplitChunksPlugin 插件的 cacheGroups 选项来实现。
<!-- optimization: {
      runtimeChunk: 'single',
      splitChunks: {
       cacheGroups: {
         vendor: {
           test: /[\\/]node_modules[\\/]/,
           name: 'vendors',
           chunks: 'all',
         },
       },
     },
    }, -->
现在，我们可以看到 main 不再含有来自 node_modules 目录的 vendor 代码，并且体积从69.5KiB 减少到 240 bytes！
                          Asset       Size  Chunks             Chunk Names
runtime.cc17ae2a94ec771e9221.js   1.42 KiB       0  [emitted]  runtime
vendors.a42c3ca0d742766d7a28.js   69.4 KiB       1  [emitted]  vendors
   main.abf44fedb7d11d4312d7.js  240 bytes       2  [emitted]  main
                     index.html  353 bytes          [emitted]

或者：
    <!-- new webpack.optimize.CommonsChunkPlugin({
      name: 'manifest',
      minChunks: Infinity
    }), -->
这个插件的作用就是把代码中用到的零散的js文件合并成一个一个的大块供系统调用，这样可以 *有效地减少http请求次数* 。

把哪些js合并在一个大块里，依据什么原则呢？就由这个minChunks来决定，意思就是最少大块数，它是比1大的整数，同时还要求小于等于大块总数，这里如果设置为2，那就是说如果有2个以上的大块都用到了某一个js文件，那么我们就把它抽取出来放到这个公共大块里，这样就不会造成重复浪费。

而infinity是无限的意思，这就是说必须有无限多个大块都用到了这个js文件，我们才把它抽取出来放到这个公共大块里，很显然，不可能有一个js文件满足这个条件被无限多个大块使用，所以这里生成的其实就是一个空的大块，它只有一个文件名，而文件长度是0，这就是minChunks: Infinity的作用。
如果多个入口文件（非vendor）都引用了a文件，但是我希望产出的 vendor chunk 只包含第三方类库（比如react），而不想将a文件也提取到vendor chunk中，那么就设置上述Infinity值。

3. 新增一个模块print.js，希望构建后只有main bundle的hash变化：
                           Asset       Size  Chunks                    Chunk Names
  runtime.1400d5af64fc1b7b3a45.js    5.85 kB      0  [emitted]         runtime
  vendor.a7561fb0e9a071baadb9.js     541 kB       1  [emitted]  [big]  vendor
    main.b746e3eb72875af2caa9.js    1.22 kB       2  [emitted]         main
                      index.html  352 bytes          [emitted]
但是三个文件的 hash 都变化了。这是因为每个 Chunks的module.id 会默认地基于解析顺序(resolve order)进行增量。也就是说，当解析顺序发生变化，ID 也会随之改变。简要概括：
main bundle 会随着自身的新增内容的修改，而发生变化。
vendor bundle 会随着自身的 module.id 的变化，而发生变化。
manifest runtime 会因为现在包含一个新模块的引用，而发生变化。
第一个和最后一个都是符合预期的行为，vendor hash 发生变化是我们要修复的。我们将 optimization.moduleIds 设置为 'deterministic'：
<!-- moduleIds: 'deterministic', -->

3. filename 指列在 entry 中，打包后输出的文件的名称。
chunkFilename 指未列在 entry 中，却又需要被打包出来的文件的名称。
output.filename 的输出文件名是 [name].min.js，[name] 根据 entry 的配置推断为 index，所以输出为 index.min.js；
由于 output.chunkFilename 没有显式指定，就会把 [name] 替换为 chunk 文件的 id 号，这里文件的 id 号是 Chunks列的值，也就是1，所以文件名就是 1.min.js。一般来说，这个 chunk 文件指的就是要懒加载的代码。

4. var cssDev = ['style-loader', 'css-loader?sourceMap', 'sass-loader?sourceMap'];
5. "watch": "webpack --watch"  // 不自动刷新浏览器
6. webpack-dev-server 在编译之后不会写入到任何输出文件。而是将 bundle 文件保留在内存中，然后将它们 serve 到 server 中，就好像它们是挂载在 server 根路径上的真实文件一样。如果你的页面希望在其他不同路径中找到 bundle 文件，则可以通过 dev server 配置中的 devMiddleware.publicPath 选项进行修改。
webpack-dev-server 会从 output.path 中定义的目录中的 bundle 文件提供服务，即文件将可以通过 http://[devServer.host]:[devServer.port]/[output.publicPath]/[output.filename] 进行访问。

7. webpack-dev-middleware 是一个封装器(wrapper)，它可以把 webpack 处理过的文件发送到一个 server。webpack-dev-server 在内部使用了它，然而它也可以作为一个单独的 package 来使用，以便根据需求进行更多自定义设置。下面是一个 webpack-dev-middleware 配合 express server 的示例。
npm install --save-dev express webpack-dev-middleware

8. 代码分离可以用于获取更小的 bundle，以及控制资源加载优先级，如果使用合理，会极大影响加载时间。

常用的代码分离方法有三种：

入口起点：使用 entry 配置手动地分离代码。
防止重复：使用 Entry dependencies 或者 SplitChunksPlugin 去重和分离 chunk。
动态导入：通过模块的内联函数调用来分离代码。

(1)如果入口 chunk 之间包含一些重复的模块，filename: '[name].bundle.js', 那些重复模块都会被引入到各个 bundle 中。它也不够灵活，并且不能动态地将核心应用程序逻辑中的代码拆分出来。
入口依赖，配置 dependOn option 选项，这样可以在多个 chunk 之间共享模块：
entry: {
    <!-- index: './src/index.js',
    another: './src/another-module.js', -->
    index: {
      import: './src/index.js',
      dependOn: 'shared',
    },
    another: {
      import: './src/another-module.js',
      dependOn: 'shared',
    },
    shared: 'lodash',
},

(2)使用 optimization.splitChunks 配置选项之后，现在应该可以看出，index.bundle.js 和 another.bundle.js 中已经移除了重复的依赖模块。需要注意的是，插件将 lodash 分离到单独的 chunk，并且将其从 main bundle 中移除，减轻了大小。
<!-- optimization: {
     splitChunks: {
       chunks: 'all',
     },
   }, -->
(3)动态导入：
return import('lodash')
    .then(({ default: _ }) => {
      const element = document.createElement('div');

      element.innerHTML = _.join(['Hello', 'webpack'], ' ');
        return element;
    })
    .catch((error) => 'An error occurred while loading the component');
由于 import() 会返回一个 promise，因此它可以和 async 函数一起使用:
async function getComponent() {
   const element = document.createElement('div');
   const { default: _ } = await import('lodash');
   element.innerHTML = _.join(['Hello', 'webpack'], ' ');
   return element;
 }
9. 父组件中按需加载子组件
import(/* webpackPrefetch: true */ './path/to/LoginModal.js');会生成 <link rel="prefetch" href="login-modal-chunk.js"> 并追加到页面头部，指示着浏览器在闲置时间预取 login-modal-chunk.js 文件。
与 prefetch 指令相比，preload 指令有许多不同之处：

preload chunk 会在父 chunk 加载时，以并行方式开始加载。prefetch chunk 会在父 chunk 加载结束后开始加载。
preload chunk 具有中等优先级，并立即下载。prefetch chunk 在浏览器闲置时下载。
preload chunk 会在父 chunk 中立即请求，用于当下时刻。prefetch chunk 会用于未来的某个时刻。
浏览器支持程度不同。

10. 懒加载中修改bundle名的注释 import(/* webpackChunkName: 'print' */ './print').then(module => {})  如果entry里也有这个文件，那么二者名字不能相同!!!
否则Error: ChunkGroup.addOptions: No option merge strategy for name
    at Entrypoint.addOptions (D:\yank\com\webpack-demo\node_modules\webpack\lib\ChunkGroup.js:117:12)
最好是把entry里的该文件去掉，这要懒加载时才下载该文件。

11. 虽然每次构建后index entry的hash没有改变，但是runtime~xxx.js会变啊。每次重新构建上线后，浏览器每次都需要重新请求它，它的 http 耗时远大于它的执行时间了，所以建议不要将它单独拆包，而是将它的代码内联到我们的 index.html 之中。这边我们使用script-ext-html-webpack-plugin来实现。（也可使用html-webpack-inline-source-plugin，其不会删除runtime文件。）

// vue.config.js
const ScriptExtHtmlWebpackPlugin = require('script-ext-html-webpack-plugin')
module.exports = {
  productionSourceMap: false,
  configureWebpack: {
    optimization: {
      runtimeChunk: true
    },
    plugins: [
      new ScriptExtHtmlWebpackPlugin({
        inline: /runtime~.+\.js$/  //正则匹配runtime文件名
      })
    ]
  },
  chainWebpack: config => {
    config.plugin('preload')
      .tap(args => {
        args[0].fileBlacklist.push(/runtime~.+\.js$/) //正则匹配runtime文件名，去除该文件的preload
        return args
      })
  }
}
index.html中已经没有对runtime~xxx.js的引用了，而是直接将其代码写入到了index.html中，故不会再请求文件，减少http请求。

12. moment的locale语言包特别大，但是我们一般的项目只在国内用，也用不到那么多语言，是不是可以去掉呢？这时候你需要使用到webpack.IgnorePlugin。
在vue.config.js文件，你需要添加以下代码
const webpack = require('webpack')
module.exports = {
  chainWebpack: config => {
    // 优化moment 去掉国际化内容
    config
    .plugin('ignore')
    // 忽略/moment/locale下的所有文件
    .use(new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/)) 
  }
}

我们虽然按照上面的方法忽略了包含’./locale/'该字段路径的文件目录,但是也使得我们使用的时候不能显示中文语言了，这时候如果想用某一种语言应该怎么办呢?
import moment from 'moment'
//手动引入所需要的语言包
import 'moment/locale/zh-cn';
// 指定使用的语言
moment.locale('zh-cn');
更建议在项目中使用更轻量级的day.js代替moment

链接：https://juejin.cn/post/6850037262441250829

13. 用babel把代码文件转成commonjs或者esm就好了。不要使用webpack打包成一个js文件。否则无法按需加载。
​webpack_require​.r：方法主要是标识该模块为es模块。
​webpack_require​.d：方法是提供Getter给导出的方法、变量。



14. 加上 toStringTag 属性，你的类也会有自定义的类型标签了：

class ValidatorClass {
  get [Symbol.toStringTag]() {
    return "Validator";
  }
}

Object.prototype.toString.call(new ValidatorClass()); // "[object Validator]"


15. 编写webpack插件过滤ac5d
const DistFilter = require("./distFilter");
    // filter string in dist ————  webpack.prod.conf.js
  plugins: [
    new DistFilter([
      {
        jsReg: /^app\..*\.js$/,
        assetsPath: "../dist/static/js"
      },
      {
        jsReg: /^app\..*\.css$/,
        assetsPath: "../dist/static/css"
      }
    ])
  ]

const fs = require("fs");
const path = require("path");
const chalk = require("chalk");
// 复杂插件
class DistFilter {
  constructor(options) {
    this.options = options;
  }
  apply(compiler) {
    const _this = this;
    compiler.plugin("after-emit", function(compiliation, callback) {
      for (let i = 0; i < _this.options.length; i++) {
        let r = _this.options[i];
        let filePath = path.resolve(__dirname, r.assetsPath);
        fs.readdir(filePath, (err, files) => {
          if (err) {
            console.log(chalk.yellow("读取目录异常\n" + err.message + "\n"));
            returnd;
          }
          files.forEach(filename => {
            if (r.jsReg.test(filename)) {
              let filedir = path.resolve(filePath, filename);
              fs.readFile(filedir, "utf-8", (err, data) => {
                if (err) {
                  console.log(chalk.yellow("读取文件异常\n" + err.message));
                  return;
                }
                let result = data.replace(/ac5d/gi, "hotline333");
                fs.writeFile(filedir, result, err => {
                  if (err) {
                    console.log(chalk.yellow("文件写入异常\n" + err.message));
                    return;
                  }
                  console.log(chalk.cyan(filename + "文件已写入\n"));
                });
              });
            }
          });
        });
      }
      callback()
    });
  }
}
module.exports = DistFilter;
