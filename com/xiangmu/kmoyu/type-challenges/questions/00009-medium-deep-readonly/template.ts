// 函数也extends {}，但函数之间必须参数一致返回值一致才extends
type DeepReadonly<T> = {
  readonly [P in keyof T]: T[P] extends {}
    ? T[P] extends (...args: any) => {}
      ? T[P]
      : DeepReadonly<T[P]>
    : T[P]
}

type X1 = {
  a: () => 22
  b: string
  c: {
    d: boolean
    e: {
      g: {
        h: {
          i: true
          j: 'string'
        }
        k: 'hello'
      }
      l: [
        'hi',
        {
          m: ['hey']
        },
      ]
    }
  }
}

type ax = DeepReadonly<X1>
type bx = DeepReadonly<X2>

type X2 = { a: string } | { b: number }
type ax2 = {
  [P in keyof X2]: X2[P]
}
