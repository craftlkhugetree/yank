function identity<T>(arg: T): T {
  return arg;
}
let otherIdentity: <T>(arg: T) => T = identity;
//               ____________________
//               |    这是类型      |
let otherIdentity1: <T>(arg: T) => T = identity;

let mySum: (x: number, y: number) => number = function (x: number, y: number): number {
  return x + y;
};

// 泛型：类型像传递给函数的参数一样传递
// T 代表 Type，在定义泛型时通常用作第一个类型变量名称。但实际上 T 可以用任何有效名称代替。除了 T 之外，以下是常见泛型变量代表的意思：
// K（Key）：表示对象中的键类型；
// V（Value）：表示对象中的值类型；
// E（Element）：表示元素类型。

function identity2<T, U>(value: T, message: U): T {
  console.log(message);
  return value;
}

console.log(identity2<Number, string>(68, 'Semlinker'));

// 返回值类型使用元组：
function identity3<T, U>(value: T, message: U): [T, U] {
  return [value, message];
}

interface Identities<V, M> {
  value: V;
  message: M;
}
// 在上述的 Identities 接口中，我们引入了类型变量 V 和 M，来进一步说明有效的字母都可以用于表示类型变量，之后我们就可以将 Identities 接口作为 identity 函数的返回类型：
function identity4<T, U>(value: T, message: U): Identities<T, U> {
  console.log(value + ': ' + typeof value);
  console.log(message + ': ' + typeof message);
  let identities: Identities<T, U> = {
    value,
    message,
  };
  return identities;
}

console.log(identity4(68, 'Semlinker'));

// 三、泛型类
// 在类中使用泛型也很简单，我们只需要在类名后面，使用 <T, ...> 的语法定义任意多个类型变量，具体示例如下：
interface GenericInterface<U> {
  value: U;
  getIdentity: () => U;
}

class IdentityClass<T> implements GenericInterface<T> {
  value: T;

  constructor(value: T) {
    this.value = value;
  }

  getIdentity(): T {
    return this.value;
  }
}

const myNumberClass = new IdentityClass<Number>(68);
console.log(myNumberClass.getIdentity()); // 68

const myStringClass = new IdentityClass<string>('Semlinker!');
console.log(myStringClass.getIdentity()); // Semlinker!

// 编译器将不会知道 T 确实含有 length 属性，尤其是在可以将任何类型赋给类型变量 T 的情况下。一种办法是显式地将变量设置为数组类型：
function identity5<T>(arg: T[]): T[] {
  console.log(arg.length);
  return arg;
}

// or
function identity6<T>(arg: Array<T>): Array<T> {
  console.log(arg.length);
  return arg;
}

// 通过 keyof 操作符，我们就可以获取指定类型的所有键，之后我们就可以结合前面介绍的 extends 约束，即限制输入的属性名包含在 keyof 返回的联合类型中。具体的使用方式如下：
function getProperty<T, K extends keyof T>(obj: T, key: K): T[K] {
  return obj[key];
}
// 通过使用泛型约束，在编译阶段我们就可以提前发现错误，大大提高了程序的健壮性和稳定性。

interface Dictionary<T = any> {
  [key: string]: T;
}
type StrDict = Dictionary<string>;
type DictMember<T> = T extends Dictionary<infer V> ? V : never;
type StrDictMember = DictMember<StrDict>; // string
// 在上面示例中，当类型 T 满足 T extends Dictionary 约束时，我们会使用 infer 关键字声明了一个类型变量 V，并返回该类型，否则返回 never 类型。
// 在 TypeScript 中，never 类型表示的是那些永不存在的值的类型。 例如， never 类型是那些总是会抛出异常或根本就不会有返回值的函数表达式或箭头函数表达式的返回值类型。
// 另外，需要注意的是，没有类型是 never 的子类型或可以赋值给 never 类型（除了 never 本身之外）。 即使 any 也不可以赋值给 never。

// 利用条件类型和 infer 关键字，我们还可以方便地实现获取 Promise 对象的返回值类型，比如：
async function stringPromise1() {
  return 'Hello, Semlinker!';
}

interface Person1 {
  name: string;
  age: number;
}

async function personPromise() {
  return { name: 'Semlinker', age: 30 } as Person1;
}

type PromiseType<T> = (args: any[]) => Promise<T>;
type UnPromisify<T> = T extends PromiseType<infer U> ? U : never;

type extractStringPromise = UnPromisify<typeof stringPromise1>; // string 就是async stringPromise1的返回值类型，也就是Promise<string>
type extractPersonPromise = UnPromisify<typeof personPromise>; // Person
// 原文链接：https://blog.csdn.net/semlinker/article/details/106882403/

// 在ts中typeof的作用是将值转为类型，拿到一个值的类型。
// type A = typeof value 就是拿到变量 value 的类型。typeof fun;  let fun = function() {return {name: 'bob'} as Person} 对于函数，就是得到函数返回值的类型，这里是Person。
// infer 的作用是提取并定义类型变量，在 extends 字句中使用：

type A<T> = T extends { name: infer P } ? P : never;
// 这里 B 就是string类型
type B = A<{ name: string; age: number }>;

type PromiseType0<T> = (args: any[]) => Promise<T>;
// 那么对于符合上面类型的一个方法，如何得知其 Promise 返回的类型？

// 譬如对于这么一个返回 string 类型的 Promise:
async function stringPromise() {
  return 'string promise';
}

type stringPromiseReturnType = ReturnType<typeof stringPromise>; // Promise<string>
// 确实拿到了方法的返回类型，不过是 Promise<string>。但其实是想要返回里面的 string，所以和我们想要的还差点意思。

//  T extends U ? X : Y 的形式为条件类型（Conditional Types），即，如果类型 T 能够赋值给类型 U，那么该表达式返回类型 X，否则返回类型 Y。所以，考察 ReturnType的定义，
type RreturnType<T extends (...args: any) => any> = T extends (...args: any) => Promise<infer R>
  ? R
  : any;
type stringPromiseReturnType1 = RreturnType<typeof stringPromise>; // string
// 如果传入的类型 T 能够赋值给 (...args: any) => R 则返回类型 R。但是这里类型 R 从何而来？讲道理，泛型中的变量需要外部指定，即 RetrunType<T,R>，
// 但我们不是要得到 R 么，所以不能声明在这其中。这里 infer 便解决了这个问题。表达式右边的类型中，加上 infer 前缀我们便得到了反解出的类型变量 R，配合 extends 条件类型，可得到这个反解出的类型 R。这里 R 即为函数(...args: any) => R 的返回类型。
// 链接：https://juejin.cn/post/6844903574137225230

// 结构：
// new <T>(executor: (resolve: (value?: T | PromiseLike<T>) => void, reject: (reason?: any) => void) => void): Promise<T>;
// 可行方案：
// new Promise<classType>(resolve, reject);
// new Promise(resolve(classType)=>void, reject);
// 两种写法根据结构来讲实现都一样，不会对reject进行变动

// 映射类型：type能用in关键字生成映射类型，interface不行。
type Keys = 'name' | 'sex';
type DuKey = {
  [Key in Keys]: string; //类似 for ... in
};
let stu: DuKey = {
  name: 'wang',
  sex: 'man',
};
// 链接：https://www.jianshu.com/p/fdd867125af5

// # ts类型变量的方式有三种，分别为 type、interface、enum，他们都相当于 JS 中的 const，一旦定义就不可改变，三者的区别是：
// enum：仅用来定义枚举类型；
// interface：可以用来定义函数、对象、类；
// type：使用绝大多数类型，例如普通的值、对象、函数、数组、元组等。

// # TS 的基础类型包括了：
// 布尔：boolean
// 数字：number
// 字符串：string
// 数组：number[] / Array<number>
// 元组：[number, string] 个数有限、类型固定的数组类型!!!
// 枚举：enum Color{ RED, GREEN, BLUE }
// any
// void
// null、undefined
// never
// object

// 类型是有父子关系的，子类型的值可以赋值给父类型，也就是子类型可以extends父类型，但是父类型的值是不能够赋值给子类型的。例如：
type ParentType = 1 | 2 | string;
type SubType = 1;

let parentData: ParentType = 2;
let subData: SubType = 1;

// subData = parentData; // ❌ 父类型不能赋值给子类型的值
parentData = subData; // 🆗

// never 类型是所有类型的子类型
function foo(): never {
  throw new Error();
}
const a: 1 = foo(); // 可以赋值，类型不会报错就证明了 never 类型是 1 的子类型

// 对象判断子类型，需要逐个属性比较
type ButtonProps = {
  size: 'mini' | 'large';
  type: 'primary' | 'default';
};

type MyButtonProps = {
  size: 'mini'; // 少了个large
  type: 'primary' | 'default';
  color: 'red' | 'blue';
};
type IsSubButton = ButtonProps extends MyButtonProps ? true : false; // false
type IsSubButton1 = MyButtonProps extends ButtonProps ? true : false; // true
// 在进行比较时，首先 MyButtonProps 的 size 和 type 都是 ButtonProps 中对应属性的子类型，虽然  MyButtonProps 比 ButtonProps 多了个 size ，但其不参与比较。

// 当子类型与父类型组成联合类型时，实际效果等于父类型。例如：
type AA = number | 1; // number
type BB = never | string; // string （never 前面说了是所有类型的子类型）

// 普通对象
interface Person0 {
  name: string;
  age: number;
}
type Name = Person0['name']; // string

// enum 枚举
enum Color {
  Red,
  Green,
  Blue,
}
type Red = Color.Red; // 0

// 数组（数组是没法获取 length 属性的，因为有多少项是不固定的）
type Names = string[];
type FirstName = Names[0]; // string
type LenN = Names['length']; // ❌

// 元组（元组是可以获取 length 属性的，因为其长度是固定的）
type Language = ['js', 'java', 'python', 'rust'];
type Rust = Language[3]; // rust
type Len = Language['length']; // 🆗

// 字符串
type Str = 'hello';
type S = Str[0]; // ⚠️ 注意是 string，不是 h
type StrLen = Str['length']; // number 而非具体的数字

// ⚠️ 注意，基础类型是可以取到原型的定义的，所以并非无属性。
// 字符串原型方法
type Concat = 'h'['concat']; // String.prototype.concat 的类型定义

// 数字原型方法
type N = 1;
type ToFixed = 1['toFixed']; // Number.prototype.toFixed 的类型定义

// ⚠️箭头函数类型和空对象没有 key。例如:
type F = () => void;
type K = keyof F; // never;
type Foo = keyof {}; // never;

// 内置泛型工具,Typescript 给我们内置了一些极其有用的泛型工具，我们本小节挑一些简单说明：

type Person = {
  name: string;
  age: number;
  id: number;
};

// Pick 挑选出指定属性，生成新对象类型
type UserInfo = Pick<Person, 'name' | 'age'>; // 挑选出 { name: string; age: number }

// Omit 排除指定的属性，生成新的对象类型
type UserInfo2 = Omit<Person, 'id'>; // 排除 id，生成  { name: string; age: number }

// Partial 将对象所有属性变为可选
type PartialPerson = Partial<Person>; // { name?: string; age?: number; id?: number }
// Required 构造一个类型，该类型不含问号。

// Readonly 将对象所有属性变为只读
type ReadonlyPerson = Readonly<Person>; // { readonly name: string; readonly age: number; readonly id: number }

// Record 生成对象类型，例如
type PersonMap = Record<number, Person>; // { [index: number]: Person }
// 构造一个具有一组类型 T 的属性 K 的类型，每个属性 K 都映射到类型 T。
interface Address {
  street: string;
  pin: number;
}
interface Addresses {
  home: Address;
  office: Address;
}
type AddressesRecord = Record<'home' | 'office', Address>; // Alternative ✅

// Exclude 排除一些联合类型
type UserInfoKeys = Exclude<keyof Person, 'id'>; // 'name' | 'age'

// Extract构造一个联合类型
// type Roler = ["ADMIN","USER", "GUEST"]
type Roler = 'ADMIN' | 'USER' | 'GUEST';
// Bad practice
type AdminRole = 'ADMIN';
// Good practice
type Admin = Extract<Roler, 'ADMIN'>; // "ADMIN"

// NonNullable构造一个类型，其中 Type 的所有属性都设置为不可为空null,never,undefined。
type Role1 = 'ADMIN' | 'USER' | null | never | undefined | '' | 0 | false;
// Bad practice
type NonNullableRole0 = 'ADMIN' | 'USER';
// Good practice
type NonNullableRole = NonNullable<Role1>; // "ADMIN" | "USER"

// 01、Uppercase
// 构造一个 Type 的所有属性都设置为大写的类型。

// type Role = "admin" | "user" | "guest";
// // Bad practice
// type UppercaseRole = "ADMIN" | "USER" | "GUEST";
// // Good practice
// type UppercaseRole = Uppercase<Role>; // "ADMIN" | "USER" | "GUEST"

// 02、Lowercase
// 构造一个 Type 的所有属性都设置为小写的类型，与大写相反。

// type Role = "ADMIN" | "USER" | "GUEST";
// // Bad practice
// type LowercaseRole = "admin" | "user" | "guest";
// // Good practice
// type LowercaseRole = Lowercase<Role>; // "admin" | "user" | "guest"

// 03、Capitalize
// 构造一个将 Type 的所有属性设置为大写的类型。

// type Role = "admin" | "user" | "guest";
// // Bad practice
// type CapitalizeRole = "Admin" | "User" | "Guest";
// // Good practice
// type CapitalizeRole = Capitalize<Role>; // "Admin" | "User" | "Guest"

// 04、Uncapitalize
// 构造一个将 Type 的所有属性设置为 uncapitalize 的类型，与首字母大写相反。

// type Role = "Admin" | "User" | "Guest";
// // Bad practice
// type UncapitalizeRole = "admin" | "user" | "guest";
// // Good practice
// type UncapitalizeRole = Uncapitalize<Role>; // "admin" | "user" | "guest"

// 对象的属性是可以有修饰符的，目前有两种修饰符，分别是 readonly 关键字对应的可选属性 和 ?: 对应的可选属性。
// 属性修饰与父子关系，父子类型主要讨论属性的存在与否，所以：
// 可选类型会导致父子关系的出现，因为可选类型相当于 自身 | undefined，是必填类型 自身 的父类型，readonly 则不会导致对象之间存在父子关系

// 在元组中也可以像对象那样在元组前面加上 readonly 代表元组的每一项都是只读的。例如：
type Arr = readonly [1, number];
const aa: Arr = [1, 2];
// aa[0] = 3; // Error: readonly

// readonly 的元组转为非 readonly，我们可以使用解构完成。例如：
type A1 = readonly [number, string];
type B1 = [...A1]; // 变成了非 readonly 了
// 因为 readonly 是针对整个元组而言的，所以通过解构，我们就将每个元素取出来了，重新赋值给另一个类型变量就解决这个问题了。

// JS 中用递归思想解决数组拍平问题
function flatten(arr) {
  if (arr.length === 0) return [];
  const [first, ...rest] = arr;
  if (Array.isArray(first)) {
    return [...flatten(first), ...flatten(rest)];
  }
  return [first, ...flatten(rest)];
}
const aaa = flatten([1, [[2]]]); // [1, 2]

// TS 中用递归思想解决元组拍平问题
type Flatten<T extends any[]> = T extends [infer First, ...infer Rest]
  ? First extends any[]
    ? [...Flatten<First>, ...Flatten<Rest>]
    : [First, ...Flatten<Rest>]
  : [];
type aaa = Flatten<[1, [[2]]]>; // [1,2]

// 元组其实就是个数有限、类型固定的数组类型。所以前面也讲过，其可以使用数字作为下标来访问的，例如：
type tupleStr = ['a', 'b', 'c'];
type A0 = tupleStr[0]; // 'a'
type B0 = tupleStr[1]; // 'b'

// 如果这个索引是 number 会发生什么呢？
type tupleStr1 = ['a', 'b', 'c'];
type UnionStr = tupleStr1[number]; // 'a' | 'b' | 'c' 变成了联合类型
// 因为 number 代表了可能是 0 也可能是 1 或者 2，所以这些可能性组成的集合就是联合类型。

type DelUnderline<T extends string> = T extends `${infer LeftWords}_${infer RightWords}`
  ? `${LeftWords}${RightWords}`
  : T;
// 当推断类型中有字符串字面量作为边界时，如上例的 _，其解构的左边 LeftWords 是左侧所有字符串的代表，右边 RightWords 是右侧所有字符串的代表，并且可以代表空字符串。
type HelloWorld = DelUnderline<'hello_world'>; // helloworld（LeftWords 为 hello，RightWords 为 world）
type World = DelUnderline<'_world'>; // world（LeftWords 为空字符串，RightWords 为 world）
type Hello = DelUnderline<'hello_'>; // hello（LeftWords 为 hello，RightWords 为空字符串）
// 当推断类型中没有字符串字面量作为边界时，第一个变量作为第一个字符，第二个变量代表剩下的字符，可以为空字符串。当然如果有三个变量，${A}${B}${C}，则第一个变量 A 代表第一个字符，B 代表第二个字符串，C 代表剩下的字符。
type DelAllUnderline<T extends string> = T extends `${infer F}${infer Rest}`
  ? F extends '_'
    ? DelUnderline<Rest>
    : `${F}${DelUnderline<Rest>}`
  : T;

// 字符串类型转元组类型小试牛刀：
type StringToTuple<T extends string> = T extends `${infer First}${infer Rest}`
  ? [First, ...StringToTuple<Rest>]
  : [T];
type Foooo = StringToTuple<'abc'>; // ["a", "b", "c"]
type boo = StringToTuple<''>;

// 并不是一次性判断，而是将每一项单独判读并返回，然后再将这些返回进行联合。
type Foof<T> = T extends 'a' | 'b' ? `${T}1` : T;
type Bar = Foof<'a' | 'b' | 'c'>; // "a1" | "b1" | "c"
// 上面例子中并不是将 'a' | 'b' | 'c' 一次性判断的，而是：
// 先判断 a ，走到 true 分支，返回 "a1"
// 然后判断 b ，走到 true 分支，返回 "b1"
// 最后判断 c ，走到 false 分支，返回 "c"
// 再将 "a1"、"b1" "c" 联合成 "a1" | "b1" | "c" 并返回。

// 定义 JS 变量
const jack = {
  name: 'jack',
  age: 18,
};
// 从 JS 中获取 TS 并赋值
type Persona = typeof jack; // 此时 Person 为 { name: string; age: number };
// 默认情况下 TS 对对象或者数组的推导是尽可能宽泛的，想要让其具体，需要使用到 as const 语法，让其尽可能精准的推测。
const Bob = {
  name: 'Bob',
  age: 18,
} as const;
type Personb = typeof Bob; // 此时 Person 为 {readonly name: "Bob"; readonly age: 18;}

type Equal<X, Y> = (<T>() => T extends X ? 1 : 2) extends <T>() => T extends Y ? 1 : 2
  ? true
  : false;
type GetReadonlyKeys<T extends object> = keyof {
  [J in keyof T as Equal<Readonly<{ [K in J]: T[K] }>, { [K in J]: T[K] }> extends true
    ? J
    : never]: T[J];
};

// 基础类型甚至函数都extends {}，但函数之间必须参数一致返回值一致才extends。
type DeepReadonly<T> = {
  readonly [P in keyof T]: T[P] extends {}
    ? T[P] extends (...args: any) => {}
      ? T[P]
      : DeepReadonly<T[P]>
    : T[P];
};

// in ts, a type is introduced with type, interface, class, enum
// 在 type、interface 中可以使用逗号、分号，class 中不能用逗号。不过三者都支持行结尾不要符号。An enum member name must be followed by a ',' '=' or '}'

type T = {
  fld1: 1; // 1 类型（够奇特吧）
  // fld2 = 2; // 不能这样用
};
interface I {
  fld1: 1; // 1 类型（够奇特吧）
  // fld2 = 2; // 不能这样用
}

/**
 * 1. 属性或参数中使用 ？：表示该属性或参数为可选项

2. 属性或参数中使用 ！：表示强制解析（告诉typescript编译器，这里一定有值），常用于vue-decorator中的@Prop

3. 变量后使用 ！：表示类型推断排除null、undefined
 */
class C {
  fld1!: 1; // 1 类型（够奇特吧），无初始值，即为 undefined。
  fld2 = 2; // number 类型（虽然未指定，但会自动推断），初始值是 2。
}

let c = new C();
alert(c.fld1); // undefined
alert(c.fld2); // 2
c.fld1 = 1;
// c.fld1 = 2; // 不能这么干，因为其类型为 1
c.fld2 = 3;
alert(c.fld1); // 1
alert(c.fld2); // 3

//默认从0开始
enum Direction {
  Up,
  Down,
  Left,
  Right,
}
console.log(Direction.Up); //0
console.log(Direction[0]); //up
//赋值后往后以此类推
enum Direction2 {
  Up = 1,
  Down,
  Left,
  Right,
}
console.log(Direction2.Down); //2
console.log(Direction2[2]); //Down
//赋值字符串
enum Direction3 {
  Up = 'UP',
  Down = 'DOWN',
  Left = 'LEFT',
  Right = 'RIGHT',
}
const value = 'UP';
if (value == Direction3.Up) {
  console.log('go up');
}
