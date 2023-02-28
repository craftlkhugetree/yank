// your answers
type SimpleVue<D, C, M> = {
  data(): D
  computed: C & ThisType<C & D>
  methods: M &
    ThisType<
      D &
        M & {
          [key in keyof C]: C[key] extends (...args: any) => infer R ? R : never
        }
    >
} & ThisType<{}>
