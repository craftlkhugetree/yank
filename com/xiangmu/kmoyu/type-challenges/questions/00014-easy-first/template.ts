// type First<T extends any[]> = T extends [infer first, ...infer rest] ? first : never
type First<T extends any[]> = T extends [infer first, ...any[]] ? first : never
