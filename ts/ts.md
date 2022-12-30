function identity<T>(arg: T): T {
  return arg;
}
let otherIdentity: <T> (arg: T) => T = identity;
//               ____________________
//               |    这是类型      |
let otherIdentity: (<T>(arg: T) => T) = identity;

let mySum: (x: number, y: number) => number = function (x: number, y: number): number {   
    return x + y;
};


泛型：类型像传递给函数的参数一样传递
T 代表 Type，在定义泛型时通常用作第一个类型变量名称。但实际上 T 可以用任何有效名称代替。除了 T 之外，以下是常见泛型变量代表的意思：
K（Key）：表示对象中的键类型；
V（Value）：表示对象中的值类型；
E（Element）：表示元素类型。

function identity <T, U>(value: T, message: U) : T {
  console.log(message);
  return value;
}

console.log(identity<Number, string>(68, "Semlinker"));

返回值类型使用元组：
function identity <T, U>(value: T, message: U) : [T, U] {
  return [value, message];
}

interface Identities<V, M> {
  value: V,
  message: M
}
在上述的 Identities 接口中，我们引入了类型变量 V 和 M，来进一步说明有效的字母都可以用于表示类型变量，之后我们就可以将 Identities 接口作为 identity 函数的返回类型：
function identity<T, U> (value: T, message: U): Identities<T, U> {
  console.log(value + ": " + typeof (value));
  console.log(message + ": " + typeof (message));
  let identities: Identities<T, U> = {
    value,
    message
  };
  return identities;
}

console.log(identity(68, "Semlinker"));

三、泛型类
在类中使用泛型也很简单，我们只需要在类名后面，使用 <T, ...> 的语法定义任意多个类型变量，具体示例如下：
interface GenericInterface<U> {
  value: U
  getIdentity: () => U
}

class IdentityClass<T> implements GenericInterface<T> {
  value: T

  constructor(value: T) {
    this.value = value
  }

  getIdentity(): T {
    return this.value
  }

}

const myNumberClass = new IdentityClass<Number>(68);
console.log(myNumberClass.getIdentity()); // 68

const myStringClass = new IdentityClass<string>("Semlinker!");
console.log(myStringClass.getIdentity()); // Semlinker!


编译器将不会知道 T 确实含有 length 属性，尤其是在可以将任何类型赋给类型变量 T 的情况下。一种办法是显式地将变量设置为数组类型：
function identity<T>(arg: T[]): T[] {
   console.log(arg.length);  
   return arg; 
}

// or
function identity<T>(arg: Array<T>): Array<T> {      
  console.log(arg.length);
  return arg; 
}

通过 keyof 操作符，我们就可以获取指定类型的所有键，之后我们就可以结合前面介绍的 extends 约束，即限制输入的属性名包含在 keyof 返回的联合类型中。具体的使用方式如下：
function getProperty<T, K extends keyof T>(obj: T, key: K): T[K] {
  return obj[key];
}
通过使用泛型约束，在编译阶段我们就可以提前发现错误，大大提高了程序的健壮性和稳定性。


interface Dictionary<T = any> {
  [key: string]: T;
}
type StrDict = Dictionary<string>
type DictMember<T> = T extends Dictionary<infer V> ? V : never
type StrDictMember = DictMember<StrDict> // string
在上面示例中，当类型 T 满足 T extends Dictionary 约束时，我们会使用 infer 关键字声明了一个类型变量 V，并返回该类型，否则返回 never 类型。
在 TypeScript 中，never 类型表示的是那些永不存在的值的类型。 例如， never 类型是那些总是会抛出异常或根本就不会有返回值的函数表达式或箭头函数表达式的返回值类型。
另外，需要注意的是，没有类型是 never 的子类型或可以赋值给 never 类型（除了 never 本身之外）。 即使 any 也不可以赋值给 never。

利用条件类型和 infer 关键字，我们还可以方便地实现获取 Promise 对象的返回值类型，比如：
async function stringPromise() {
  return "Hello, Semlinker!";
}

interface Person {
  name: string;
  age: number;
}

async function personPromise() {
  return { name: "Semlinker", age: 30 } as Person;
}

type PromiseType<T> = (args: any[]) => Promise<T>;
type UnPromisify<T> = T extends PromiseType<infer U> ? U : never;

type extractStringPromise = UnPromisify<typeof stringPromise>; // string
type extractPersonPromise = UnPromisify<typeof personPromise>; // Person

————————————————
原文链接：https://blog.csdn.net/semlinker/article/details/106882403/



在ts中typeof的作用是将值转为类型，拿到一个值的类型。
type A = typeof value 就是拿到变量 value 的类型。typeof fun;  let fun = function() {return {name: 'bob'} as Person} 对于函数，就是得到函数返回值的类型，这里是Person。
infer 的作用是提取类型，在 extends 字句中使用：

type A<T> = T extends {name: infer P} ? P : never
type B = A<{name: string, age: string}>
这里 B 就是string类型


type PromiseType<T> = (args: any[]) => Promise<T>;
那么对于符合上面类型的一个方法，如何得知其 Promise 返回的类型？

譬如对于这么一个返回 string 类型的 Promise:
async function stringPromise() {
  return "string promise";
}

type stringPromiseReturnType = ReturnType<typeof stringPromise>; // Promise<string>
确实拿到了方法的返回类型，不过是 Promise<string>。但其实是想要返回里面的 string，所以和我们想要的还差点意思。

 T extends U ? X : Y 的形式为条件类型（Conditional Types），即，如果类型 T 能够赋值给类型 U，那么该表达式返回类型 X，否则返回类型 Y。所以，考察 ReturnType的定义，
 type ReturnType<T extends (...args: any) => any> = T extends (...args: any) => infer R ? R : any;
 如果传入的类型 T 能够赋值给 (...args: any) => R 则返回类型 R。但是这里类型 R 从何而来？讲道理，泛型中的变量需要外部指定，即 RetrunType<T,R>，但我们不是要得到 R 么，所以不能声明在这其中。这里 infer 便解决了这个问题。表达式右边的类型中，加上 infer 前缀我们便得到了反解出的类型变量 R，配合 extends 条件类型，可得到这个反解出的类型 R。这里 R 即为函数 (...args: any) => R 的返回类型。

链接：https://juejin.cn/post/6844903574137225230


结构：
new <T>(executor: (resolve: (value?: T | PromiseLike<T>) => void, reject: (reason?: any) => void) => void): Promise<T>;
可行方案：
new Promise<classType>(resolve, reject);
new Promise(resolve(classType)=>void, reject);
两种写法根据结构来讲实现都一样，不会对reject进行变动


映射类型：type能用in关键字生成映射类型，interface不行。
type Keys = "name" | "sex"
type DuKey = {
  [Key in Keys]: string //类似 for ... in
}
let stu: Dukey = {
  name: 'wang'，
  sex: 'man'
}
链接：https://www.jianshu.com/p/fdd867125af5


# ts类型变量的方式有三种，分别为 type、interface、enum，他们都相当于 JS 中的 const，一旦定义就不可改变，三者的区别是：
enum：仅用来定义枚举类型；
interface：可以用来定义函数、对象、类；
type：使用绝大多数类型，例如普通的值、对象、函数、数组、元组等。

# TS 的基础类型包括了：
布尔：boolean
数字：number
字符串：string
数组：number[] / Array<number>
元组：[number, string]
枚举：enum Color{ RED, GREEN, BLUE }
any
void
null、undefined
never
object

类型是有父子关系的，子类型的值可以赋值给父类型，但是父类型的值是不能够赋值给子类型的。例如：
type ParentType = 1 | 2 | string
type SubType = 1

let parentData: ParentType = 2;
let subData: SubType = 1;

subData = parentData; // ❌ 父类型不能赋值给子类型的值
parentData = subData; // 🆗

