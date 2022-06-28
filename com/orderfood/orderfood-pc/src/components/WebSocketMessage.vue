<!-- 组件使用说明
 * @name   webSocketMessage
 * @desc   建立webSocket连接，获取后台发送的消息
 * @param  {String} [url] -- 建立webSocket连接的URL （必须）
 * @doFunc 接收到消息后的处理函数
 * @example 调用示例
 * <web-socket-message :url="url" @doFunc="showMsg"></web-socket-message>
-->


<template>
  <div class="web-socket"></div>
</template>

<script>
export default {
  name: "test",
  data() {
    return {
      websock: null
    };
  },
  props: {
    // 指定连接的URL
    url: {
      type: String,
      required: true
    },
    // 用户定义的消息类型和对应的处理函数
    messageType: Array
  },
  methods: {
    // 初始化websocket
    init() {
      this.websock = new WebSocket(this.url);
      this.websock.onopen = this.websocketonopen;
      this.websock.onmessage = this.websocketonmessage;
      this.websock.onerror = this.websocketonerror;
      this.websock.onclose = this.websocketclose;
    },
    // 建立连接
    websocketonopen() {
      console.log("建立连接", this.url);
    },
    // 连接建立失败重连
    websocketonerror() {
      this.init();
      console.log("连接失败");
    },
    // 接收服务端数据
    websocketonmessage(e) {
      let data = e.data;
      this.$emit("doFunc", data);
    },
    // 向服务端发送数据
    websocketsend(Data) {
      this.websock.send(Data);
    },
    // 关闭连接
    websocketclose(e) {
      console.log("断开连接", e);
    }
  },
  // 断开websocket连接
  destroyed() {
    this.websock.close();
  },
  created() {
    if (WebSocket) {
      this.init();
    } else {
      alert("您的浏览器不支持 WebSocket!");
    }
  }
};
</script>
<style>
</style>