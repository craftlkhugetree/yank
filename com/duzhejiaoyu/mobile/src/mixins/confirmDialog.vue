<template></template>

<script>
import { Notify } from "vant";

export default {
  name: "confirmDialog",
  data() {
    return {
      confirmText: "",
      localip: null,
    };
  },
  created() {
    //获取本地ip
    function getUserIP(onNewIP) {
      // onNewIp - your listener function for new IPs
      // compatibility for firefox and chrome
      var myPeerConnection =
        window.RTCPeerConnection ||
        window.mozRTCPeerConnection ||
        window.webkitRTCPeerConnection;
      var pc = new myPeerConnection({
          iceServers: [],
        }),
        noop = function () {},
        localIPs = {},
        ipRegex =
          /([0-9]{1,3}(\.[0-9]{1,3}){3}|[a-f0-9]{1,4}(:[a-f0-9]{1,4}){7})/g,
        key;

      function iterateIP(ip) {
        if (!localIPs[ip]) onNewIP(ip);
        localIPs[ip] = true;
      }

      //create a bogus data channel
      pc.createDataChannel("");

      // create offer and set local description
      pc.createOffer()
        .then(function (sdp) {
          sdp.sdp.split("\n").forEach(function (line) {
            if (line.indexOf("candidate") < 0) return;
            line.match(ipRegex).forEach(iterateIP);
          });

          pc.setLocalDescription(sdp, noop, noop);
        })
        .catch(function (reason) {
          // An error occurred, so handle the failure to connect
        });
      //sten for candidate events
      pc.onicecandidate = function (ice) {
        if (
          !ice ||
          !ice.candidate ||
          !ice.candidate.candidate ||
          !ice.candidate.candidate.match(ipRegex)
        )
          return;
        ice.candidate.candidate.match(ipRegex).forEach(iterateIP);
      };
    }
    (ip) => {
      this.localip = ip;
    };
  },
  methods: {
    // 弹窗
    showConfirm(modelId) {
      // 判断开启ip限制
      if (this.exam.isOpenip == "1") {
        let { ipStart, ipEnd } = this.exam;
        if (this.localip < ipStart || this.localip > ipEnd || !this.localip) {
          Notify({ type: 'warning', message: "当前IP地址不在考试IP范围内！" });
          return;
        }
      }
      // 设置考试提示内容
      if (modelId) {
        this.curModelId = modelId;
      }
      let text1 = "",
        text2 = "";
      let content = {};
      if (this.exam.type == "1") {
        content = this.exam.contents[0] || {};
        text1 = `本次考试时间为${this.exam.duration}分钟，`;
        text2 =
          this.exam.beforeSubmitTime > 0
            ? `考试开始${this.exam.beforeSubmitTime}分钟后方可交卷。`
            : "";
      }
      if (this.exam.type == "2") {
        content = this.exam.contents.find((i) => i.modelId == modelId) || {};
      }
      let text3 = `满分${content.totalScore}分，${content.qualifiedScore}分为合格分，`;
      this.confirmText = text1 + text2 + text3 + "准备好去考试了吗？";
      this.$refs.confirm.visible = true;
    },
  },
};
</script>
