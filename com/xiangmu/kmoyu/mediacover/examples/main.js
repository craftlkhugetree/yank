import Vue from "vue";
import App from "./App.vue";

Vue.config.productionTip = false;
import testUI from "~/"
Vue.use(testUI)

new Vue({
  render: h => h(App)
}).$mount("#app");
