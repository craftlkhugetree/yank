<template>
  <div class="scan"></div>
</template>

<script>
import { scanQRCode, orderSign } from "@/api/check/check";

export default {
  name: "scan",
  computed: {
    userId() {
      return this.$store.state.userInfo.ID;
    },
    userRoleIds() {
      return this.$store.state.userRoles.map(i => i.ID);
    }
  },
  created() {
    console.log("扫码11");
    this.doScan();
  },
  methods: {
    // 扫一扫
    doScan() {
      console.log("扫码");
      scanQRCode(url => {
        console.log("url", url);
        window.open(url);
        // let data = {
        //   ids: JSON.stringify([id])
        // };
        // orderSign(data)
        //   .then(res => {
        //     if (res.success) {
        //       this.$toast.success("取餐成功！");
        //     } else {
        //       this.$toast.fail("取餐失败：请扫描正确的二维码！");
        //     }
        //   })
        //   .catch(err => {
        //     this.$toast.fail("取餐失败：" + err);
        //   });
      });
    }
  }
};
</script>
<style lang="scss" scoped>
</style>
