import KindEditor from '../components/kindeditor.vue'
const install = function (Vue) {
  if (install.installed) return
  install.installed = true
  Vue.component('editor', KindEditor)
}

export default install