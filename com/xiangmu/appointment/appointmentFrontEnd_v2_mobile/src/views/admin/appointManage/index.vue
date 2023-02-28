<template>
  <div class="main">
    <van-nav-bar title="智慧校园预约平台" fixed :border="false" left-arrow @click-left="$router.go(-1)">
      <template #right>
        <van-icon name="search" size="18" @click="toSearch" />
      </template>
    </van-nav-bar>
    <!-------------------------- 列表 -------------------------->
    <div class="main-content">
      <list ref="listComp" :isAppointManage="true"></list>
    </div>
    <!-------------------------- 扫一扫 -------------------------->
    <div class="scan" @click="doScan">
      <img src="@/assets/img/scan.png" alt />
      扫一扫
    </div>
  </div>
</template>

<script>
import list from "./list";
import { scanQRCode, checkIn } from "@/api/check/check";
export default {
  components: {
    list
  },
  methods: {
    // 查询页面
    toSearch() {
      this.$router.push(`/appoint-manage/search`);
    },

    // 扫一扫
    doScan() {
      scanQRCode(id => {
        let data = {
          id: id
        };
        checkIn(data)
          .then(res => {
            if (res.success) {
              this.$toast.success("签到成功！");
            } else {
              this.$toast.fail("签到失败：请扫描正确的二维码！");
            }
          })
          .catch(err => {
            this.$toast.fail("签到失败：" + err);
          });
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.main {
  height: 100%;
  background: #f6f6f6;
}
.main-content {
  padding: 112px 24px 24px;
  background: #f6f6f6;
}
.scan {
  position: fixed;
  bottom: 60px;
  right: 60px;
  width: 180px;
  height: 74px;
  line-height: 74px;
  background: #ffffff;
  box-shadow: 2px 8px 12px 2px rgba(0, 0, 0, 0.12);
  border-radius: 74px;
  font-size: 26px;
  color: #2a2e2e;
  padding-left: 70px;
  img {
    width: 70px;
    height: 72px;
    position: absolute;
    left: 10px;
  }
}
</style>