paths是文件映射配置；webpack中会用alias来重定向文件或者babel配置文件重定向，在tsconfig中要对alias中的文件映射定义一遍; paths是相对于baseUrl的。
如果你想使用相对项目根目录的路径，你需要将 baseUrl 设置为 . 。
files用来指定需要编译的文件列表（注意，只能是文件，不能是文件夹），include指定需要编译处理的文件列表，支持 glob 模式匹配，文件的解析路径相对于当前项目的tsconfig.json文件位置，这里要注意，如果指定了files选项值，则includes的默认值为[]，否则默认包含当前项目中所有文件["**/*"]
include和exclude都支持使用通配符：

*匹配零个或者多个字符（包括目录的分隔符）
?匹配任一字符（包括目录分隔符）
**/匹配任何层级的嵌套目录
在使用 glob 模式匹配时，如果没有明确指定文件扩展名。那么默认情况下仅会包含.ts、.tsx和.d.ts类型的文件。但是如果allowJs选项被设置成了true，那么.js和.jsx文件也会被包含其中

paths
路径重映射。

要使用 paths，首先要设置好 baseUrl，paths 的源路径和新路径会使用 baseUrl 作为相对路径计算。

"baseUrl": "./src",
"paths": {
  "@lib/*": ["./other/_lib/*", "./other/_lib2/*"]
},
上面的配置，是将 other/_lib 和 other/_lib2 路径重映射为 @lib。

这里的 @ 并不是必须的，这样写只是表明这个路径是一个重映射，或者叫别名，实际上文件系统上不存在对应的真实目录。

这样，原来比较冗长的路径：

import LibA from "other/_lib/lib_a";
就可以改为：
import LibA from "@lib/lib_a";


npm install vue-class-component vue-property-decorator --save
npm install ts-loader typescript tslint tslint-loader tslint-config-standard --save-dev --legacy-peer-deps

vue-class-component：扩展vue支持typescript，将原有的vue语法通过声明的方式来支持ts

vue-property-decorator：基于vue-class-component扩展更多装饰器

ts-loader：让webpack能够识别ts文件

tslint-loader：tslint用来约束文件编码

tslint-config-standard： tslint 配置 standard风格的约束

npm i -D typescript@~4.2.3
npm i -D ts-loader@~8.2.0

Cannot find module 'xlsx'. Did you mean to set the ‘moduleResolution’ option to ‘node’, or to add aliases to the ‘paths’ option?
ts配置文件中加入 "moduleResolution": "node"
————————————————
TS7006: Parameter 'obj' implicitly has an 'any' type.        "strict": true,改为false
TS2531: Object is possibly 'null'.       "strictNullChecks": true,改为false
TS2349: This expression is not callable.     (obj.value as any)(params)
TS2307: Cannot find module './detailTable' or its corresponding type declarations.  去掉appendTsSuffixTo: [/\.vue$/],

    "include": ["src/**/*.ts", "src/**/*.d.ts", "src/**/*.tsx", "src/**/*.vue"],
    "baseUrl": "./",  // 这里需要配置，配合解决@/找不到文件的问题
    "paths": {
      "@/*": ["./src/*"]  // 这里需要配置
    }
    // 如果baseUrl设置为'src',那paths就应该配置为{"@/*": "./*"},如下：
    // "baseUrl": "src",
    // "paths": {
    //  "@/*": ["./*"]
    // }
————————————————

tsconfig.json
{
  "compilerOptions": {
    "outDir": "./dist",
    "module": "commonjs",
    "target": "es5",
    "allowJs": true,
    "allowSyntheticDefaultImports": true,
    "moduleResolution": "node",
    "strict": false,
    "strictNullChecks": false,
    "esModuleInterop": true,
    "experimentalDecorators": true,
    "baseUrl": "./", // 这里需要配置
    "paths": {
      "@/*": ["./src/*"] // 这里需要配置
    }
  },
  "include": ["src/**/*.ts", "src/**/*.d.ts", "src/**/*.tsx", "src/**/*.vue"],
  "exclude": ["node_modules"]
}

 configureWebpack: {
    resolve: { extensions: ['.ts', '.tsx', '.js', '.json'] },
    module: {
      rules: [
        {
          test: /\.ts$/,
          exclude: /node_modules/,
          enforce: 'pre',
          loader: 'tslint-loader',
        },
        {
          test: /\.tsx?$/,
          loader: 'ts-loader',
          exclude: /node_modules/,
          options: {
            appendTsSuffixTo: [/\.vue$/],
          },
        },
      ],
    },
  },

在ts能找到的范围，比如src内添加ts文件来解决globalThis问题：
declare interface Window {
  g: any;
}



字面量的赋值:
let type:'primary'|'danger'|'warning'|'error' =  'primary'

let test = 'error'
type = test  // Type 'string' is not assignable to type '"primary" | "danger" | "warning" | "error"'.

let test = 'error' as const 
type =  test //正确



declare是用于声明存在的

declare var/let/const用来声明全局的变量。
declare function 用来声明全局方法(函数)
declare class 用来声明全局类
declare namespace 用来声明命名空间
declare module 用来声明模块
...
需要注意的是，declare与declare global它们功能是一样的。在d.ts中，使用declare即可，默认是全局的，它与declare global作用是相等的。而在模块文件中定义declare，如果想要用作全局就可以使用declare global。

/** types/foo/index.d.ts */
declare global {
    interface String {
        prependHello(): string;
    }
}
/** 注意即使此声明文件不需要导出任何东西，仍然需要导出一个空对象，用来告诉编译器这是一个模块的声明文件，而不是一个全局变量的声明文件。 */
export {};
 
/** src/index.ts 使用 */
'bar'.prependHello();

对于 node_modules 中的第三方库，或是别人写的模块不方便直接修改代码的，可以通过扩展模块的方式声明额外变量或成员。
通过关键词 declare module 来扩展模块。需要注意的是，扩展模块只能在模块中声明。也就是说，如果在全局声明中使用 declare module，会被识别为对这个模块的整体声明，直接覆盖原本的声明。
https://my.oschina.net/skywingjiang/blog/5512768
# declare module "@vue/runtime-core"在vuex和vue-router都有使用
/** types/moment-plugin/index.d.ts */
import * as moment from 'moment';
 
# 声明的函数即便赋值了，也是undefined，这里只是声明moment有一个foo函数及其返回值类型，使用时再赋值，若不在此声明，直接在vue文件里moment.foo = () => {}，会报错moment没有foo属性！
declare module 'moment' {
    export function foo(): moment.CalendarKey;
}
 
/** src/index.ts */
import * as moment from 'moment';
import 'moment-plugin';
 
moment.foo();

————————————————
原文链接：https://blog.csdn.net/qq_42415326/article/details/124923310



如果这么写，就能正确扩展模块：
// src/shims-vant.d.ts
import { VanComponent } from 'vant/types/component'

declare module 'vant' {
  export class Calendar extends VanComponent {}
}

但是如果这样，就变成了覆盖Calendar模块：
// src/shims-vant.d.ts
declare module 'vant' {
  import { VanComponent } from 'vant/types/component'
  export class Calendar extends VanComponent {}
}

看一看根目录下的tsconfig.json，里面有这样的配置：
{
  "compilerOptions": {
    "moduleResolution": "node",
    "baseUrl": "."
  },
  "include": [
    "src/**/*.ts",
    "src/**/*.tsx",
    "src/**/*.vue",
    "tests/**/*.ts",
    "tests/**/*.tsx"
  ],  
}
其实这三行就能解释问题了。"moduleResolution": "node"说明TS采用类似于Node的方式来导入模块，"baseUrl": "."说明是以当前目录为根目录（本来就是根目录hhh），include说明还有这些文件需要包括进去。因为这个声明文件的路径是src/shims-vant.d.ts，所以会被包括进去。

为什么会出现这个问题？还是之前提到的，如果最顶上不是import或者export，这个文件就不会被当成一个模块，也就无法进行模块扩展，而是变成了重新声明一个模块。
所以，如果要对一个模块进行扩展，一定要记得在最前面加上import或者export。
————————————————
原文链接：https://blog.csdn.net/HermitSun/article/details/104105195

# In TypeScript, just as in ECMAScript 2015, any file containing a top-level import or export is considered a module. Conversely, a file without any top-level import or export declarations is treated as a script whose contents are available in the global scope (and therefore to modules as well).
# in ts, a type is introduced with type, interface, class, enum

Values:
As with types, you probably already understand what a value is. Values are runtime names that we can reference in expressions. For example let x = 5; creates a value called x.

# Again, being explicit, the following things create values:
let, const, and var declarations
A namespace or module declaration which contains a value
An enum declaration
A class declaration
An import declaration which refers to a value
A function declaration

Namespaces
Types can exist in namespaces. For example, if we have the declaration let x: A.B.C, we say that the type C comes from the A.B namespace.
This distinction is subtle and important — here, A.B is not necessarily a type or a value.


interface Foo {
  x: number;
}
// ... elsewhere ...
interface Foo {
  y: number;
}
let a: Foo = ...;
console.log(a.x + a.y); // OK

// This also works with classes:
class Foo {
  x: number;
}
// ... elsewhere ...
interface Foo {
  y: number;
}
let a: Foo = ...;
console.log(a.x + a.y); // OK

A namespace declaration can be used to add new types, values, and namespaces in any way which does not create a conflict.
For example, we can add a static member to a class:

class C {}
// ... elsewhere ...
namespace C {
  export let x: number;
}
let y = C.x; // OK



# Finally, we could perform many different merges using namespace declarations. This isn’t a particularly realistic example, but shows all sorts of interesting behavior:
namespace X {
  export interface Y {}
  export class Z {}
}
// ... elsewhere ...
namespace X {
  export var Y: number;
  export namespace Z {
    export class C {}
  }
}
type X = string;
In this example, the first block creates the following name meanings:

A value X (because the namespace declaration contains a value, Z)
A namespace X (because the namespace declaration contains a type, Y)
A type Y in the X namespace
A type Z in the X namespace (the instance shape of the class)
A value Z that is a property of the X value (the constructor function of the class)
The second block creates the following name meanings:

A value Y (of type number) that is a property of the X value
A namespace Z
A value Z that is a property of the X value
A type C in the X.Z namespace
A value C that is a property of the X.Z value
A type X