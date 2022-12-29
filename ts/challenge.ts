// 遍历mapped 取值indexed  keyof=lookup
type MyPick<T, K extends keyof T = keyof T> = {
  [P in K]: T[P];
};
function myPick(todo, keys) {
  const obj = {};
  keys.forEach(k => {
    if (k in todo) obj[k] = todo[k];
  });
  return obj;
}

type MyReadonly<T> = {
  readonly [P in keyof T]: T[P];
};
function readOnly(obj) {
  const res = {};
  for (const k in obj) {
    res['readonly' + k] = obj[k];
  }
  return res;
}

// 字面量是固定的
const tupple = ['tes', 123, 'car'] as const;
// tupple[0] = 999 // 无法修改
// 数组和对象是不能作为对象属性的
type TupleToObject<T extends readonly (string | number | symbol)[]> = {
  // 数组的表示方法, T[number]是一个union
  [P in T[number]]: P;
};
// @ts-expect-error
// 尖括号里是类型，不是数值，而且是写死的类型。
type error = TupleToObject<[[1, 2], {}]>;

export type TupleToUnion<T extends any[]> = T[number];

// js代码是两个for循环，extends是第一个for循环
type MyExclude<T, U> = T extends U ? never : T
// type testMyExclude = MyExclude< '1' | 2 | 3, 3>

// 如果T是空数组就返回never
type First<T extends any[]> = T extends [] ? never : T[0];
type First1<T extends any[]> = T['length'] extends 0 ? never : T[0];
type First2<T extends any[]> = T[0] extends T[number] ? T[0] : never;
// 看看能否解构出一个first，如果可以就返回first
type First3<T extends any[]> = T extends [infer first, ...infer rest] ? first : never;
type First4<T extends any[]> = T extends [infer first, ...any[]] ? first : never;

// 数组最后一个元素:
export type Last<T extends any[]> = T extends [...any, infer L] ? L : never;

// Pop：
// type arr1 = ['a', 'b', 'c', 'd']
// type re1 = Pop<arr1> // expected to be ['a', 'b', 'c']
export type Pop<T extends any> = T extends [...infer P, infer R] ? P : never;

// Push:
// type Result = Push<[1, 2], '3'> // [1, 2, '3']
export type Push<T extends any[], U> = [...T, U];

// UnShift:
// type Result = UnShift<[1, 2], 0> // [0, 1, 2,]
export type UnShift<T extends any[], U> = [U, ...T];

// Shift:
// type Result = Shift<[3, 2, 1]> // [2, 1]
export type Shift<T> = T extends [infer F, ...infer R] ? R : undefined;

// Concat：
// type Result = Concat <[1], [2]> // expected to be [1, 2]
export type Concat<T extends any[], V extends any[]> = [...T, ...V];

// Reverse:
// type b = Reverse<['a', 'b', 'c']> // ['c', 'b', 'a']
export type Reverse<T> = T extends [infer Head, ...infer Rest] ? [...Reverse<Rest>, Head] : T;

// FilterOut：
// type Filtered = FilterOut<[1, 2, null, 3], null> // [1, 2, 3]
type Filtered = FilterOut<[1, 2, null, 3], null>; // [1, 2, 3]
export type FilterOut<T extends any[], F> = T extends [infer First, ...infer Rest]
  ? First extends F
    ? FilterOut<Rest, F>
    : [First, ...FilterOut<Rest, F>]
  : [];

type Length<T extends any[]> = T['length'];

// 通过 keyof T[P] extends never 这种方式判断是否有子属性，可以完成深度遍历
export type DeepReadonly<T> = {
  readonly [P in keyof T]: keyof T[P] extends never ? T[P] : DeepReadonly<T[P]>;
};

// 除了 Excluded 第二个参数中的那些。
// &交叉类型是去重后合并，|联合类型是取其中之一即可
type Merge<T, U> = {
  [P in Exclude<keyof T, keyof U>]: T[P];
} & { [G in keyof U]: U[G] };

// 类似 Merge，我们在再给出一些其他的简单的类似 type 相关的操作
// Diff：选出两个类型中不同属性：
export type Diff<T, U> = Omit<T & U, keyof T & keyof U>;

// PickByType：按照类型选择
// type OnlyBoolean = PickByType<{
//   name: string
//   count: number
//   isReadonly: boolean
//   isEnable: boolean
// }, boolean> // { isReadonly: boolean; isEnable: boolean; }
export type PickByType<T, U> = {
  [K in keyof T as T[K] extends U ? K : never]: T[K];
};

// RequiredByKeys：按照 key 来设置成 Require
// interface User {
//   name?: string;
//   age?: number;
//   address?: string;
// }
// type UserRequiredName = RequiredByKeys<User, 'name'>; // { name: string; age?: number; address?: string }
export type RequiredByKeys<T, K = keyof T> =
  Partial<Pick<T, Exclude<keyof T, K>>> & Required<Pick<T, Extract<keyof T, K>>>;
// **可以看一下 Required 的写法，能学到一点新的东西

// Mutable
// interface Todo {
//   readonly title: string
//   readonly description: string
//   readonly completed: boolean
// }
// type MutableTodo = Mutable<Todo> // { title: string; description: string; completed: boolean; }
// your answers
export type Mutable<T> = {
  -readonly [K in keyof T]: T[K];
};

// Get Required
type I = GetRequired<{ foo: number; bar?: string }>; // expected to be { foo: number }
export type GetRequired<T> = {
  [P in keyof T as T[P] extends Required<T>[P] ? P : never]: T[P];
};
// 去除可选修饰符 [P in keyof T]-?: T[P]
export type RequiredKeys<T> = keyof GetRequired<T>;

// Get Optional
type II = GetOptional<{ foo: number; bar?: string }>; // expected to be { bar?: string }
// https://github.com/type-challenges/type-challenges/blob/main/questions/00059-hard-get-optional/README.md
export type GetOptional<T> = {
  [P in keyof T as T[P] extends Required<T>[P] ? never : P]: T[P];
};
export type OptionalKeys<T> = keyof GetOptional<T>;

/**
 * 一些技巧提示：
通过组合 Typescript 内置的功能函数，我们可以完成很多复杂的业务需求。
通过 -readonly 来减去修饰符。
通过 [P in keyof T]-?: T[P]; 这种方式来减去可选修饰符（Typescript 内置的 Required 就是这么实现的）。
通过 K in keyof T as T[K] 获取一个属性的类型，结合 extends 做条件判断。
 */

type Space = ' ' | '\n' | '\t';
export type TrimLeft<S extends string> = S extends `${Space}${infer Rest}` ? TrimLeft<Rest> : S;

// Replace
// type replaced = Replace<'types are fun!', 'fun', 'awesome'> // expected to be 'types are awesome!'
// https://github.com/type-challenges/type-challenges/blob/main/questions/00116-medium-replace/README.md
export type Replace<S extends string, From extends string, To extends string> = From extends ''
  ? S
  : S extends `${infer Left}${From}${infer Right}`
  ? `${Left}${To}${Right}`
  : S;

// 近似 Replace，替换全部
// type replaced = ReplaceAll<'t y p e s', ' ', ''> // expected to be 'types'
// https://github.com/type-challenges/type-challenges/blob/main/questions/00119-medium-replaceall/README.md
export type ReplaceAll<S extends string, From extends string, To extends string> = From extends ''
  ? S
  : S extends `${infer Left}${From}${infer Right}`
  ? `${Left}${To}${ReplaceAll<`${Right}`, From, To>}`
  : S;

// Drop Char
// 和上面的比较类似
// type Butterfly = DropChar<' b u t t e r f l y ! ', ' '> // 'butterfly!'
// https://github.com/type-challenges/type-challenges/blob/main/questions/02070-medium-drop-char/README.md
export type DropChar<S, C> = S extends `${infer H}${infer R}`
  ? H extends C
    ? `${DropChar<R, C>}`
    : `${H}${DropChar<R, C>}`
  : '';

// ParseInt：字符串转数字：
// export type ParseInt<T extends string> = T extends `${infer Digit extends number}` ? Digit : never;


type Fn = (a: number, b: string) => number

type Result = AppendArgument<Fn, boolean> 
// expected be (a: number, b: string, x: boolean) => number
// 这个例子可能会在我们日常开发中用到，而且可以让我们回顾如何操作函数类型：

export type AppendArgument<Fn extends (...args: any) => any, A> = Fn extends (
  ...args: infer Args
) => infer Res
  ? (...arg: [...Args, A]) => Res
  : never;

type MyAwaited<T extends Promise<unknown>> = T extends Promise<infer P>
  ? P extends Promise<unknown>
    ? MyAwaited<P>
    : P
  : never;