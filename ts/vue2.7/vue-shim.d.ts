// declare module '*.vue' {
//     import type { DefineComponent } from 'vue'

//     const component: DefineComponent<Record<string, unknown>, Record<string, unknown>, unknown>
//     export default component
// }

// 添加所有 .vue 文件的声明
declare module '*.vue' {
  import Vue from 'vue';
  export default Vue;
}
