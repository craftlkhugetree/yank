// your answers
type Equal<X, Y> = (<T>() => T extends X ? 1 : 2) extends <T>() => T extends Y ? 1 : 2
  ? true
  : false

type GetReadonlyKeys<T extends object> = keyof {
  [J in keyof T as Equal<Readonly<{ [K in J]: T[K] }>, { [K in J]: T[K] }> extends true
    ? J
    : never]: T[J]
}
