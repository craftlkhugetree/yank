// type MyReadonly2<T, K extends keyof T = keyof T> = Omit<T, K> & {
//   readonly [P in keyof T as P extends K ? P : never]: T[P]
// }

// 默认是keyof T，保证不传K时也可以
type MyReadonly2<T, K extends keyof T = keyof T> = { readonly [key in K]: T[key] } & {
  [P in keyof T as P extends K ? never : P]: T[P]
}

interface Todo1 {
  title: string
  description?: string
  completed: boolean
}

interface Todo2 {
  readonly title: string
  description?: string
  completed: boolean
}

type aaa = MyReadonly2<Todo1, 'title' | 'description'>
