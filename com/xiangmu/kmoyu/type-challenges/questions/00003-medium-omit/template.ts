// 属性类型为never而不是去掉该属性
// type MyOmit<T, K extends keyof T> = {
//   [P in keyof T]: P extends K ? never : T[P]
// }

// type MyOmit<T, K extends keyof T> = {
//   [P in (keyof T extends K ? never : keyof T): T[P]
// }
type MyOmit<T extends object, K extends keyof T> = {
  [key in TExclude<keyof T, K>]: T[key]
}
// 逐个比对keyof T
type TExclude<K, U> = K extends U ? never : K

// type MyOmit<T, K extends keyof T> = { [key in Exclude<keyof T, K>]: T[key] }

// type MyOmit<T, K extends keyof T> = { [p in keyof T as p extends K ? never : p] }

// type MyOmit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>
interface Todo {
  title: string
  description: string
  completed: boolean
}

type a = MyOmit<Todo, 'description'>
