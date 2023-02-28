<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>
export default {
  name: "App",
  methods: {},
  mounted() {
    if (window.base.isSeatYyzc) {
      document.addEventListener("UniAppJSBridgeReady", function() {
        console.clear();
        console.log("sdk loaded");
        window.sendMsgToApp = (action, payload = {}) => {
          if (action === "") {
            console.log("不能发送空消息：");
            return;
          }
          console.log("发送消息：", action, payload);
          uni.postMessage({
            data: {
              action,
              payload
            }
          });
        };
      });
    }
  }
};
</script>

<style>
html {
  font-size: 28px;
}
body {
  font-size: 28px;
  background: #fafaf9;
}
</style>
