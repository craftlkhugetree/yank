<template>
  <div class="home">
    <van-nav-bar title fixed :border="false" />
    <div style="width:100%;height:46px;"></div>
    <div class="home-content">
      <h2>Hello！欢迎来到</h2>
      <h2>后勤保障部订餐系统</h2>
      <div class="home-box">
        <!------------- 普通用户 ------------>
        <div class="box-item animation-1" @click="go('/menuList')">
          <img class="bg" src="@/assets/img/home-img-1.png" alt />
          <span>我要订餐</span>
          <img class="btn" src="@/assets/img/home-right-2.png" alt />
        </div>
        <!------------- 订餐记录 ------------>
        <div class="box-item animation-2" @click="go('/record')">
          <img class="bg" src="@/assets/img/home-img-1.png" alt />
          <span>订餐记录</span>
          <img class="btn" src="@/assets/img/home-right-2.png" alt />
        </div>
        <!------------- 扫码取餐 ------------>
        <div class="box-item animation-3" @click="doScan">
          <img class="bg" src="@/assets/img/home-img-1.png" alt />
          <span class="orange">扫码取餐</span>
          <img class="btn" src="@/assets/img/home-right-1.png" alt />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { scanQRCode, orderSign } from "@/api/check/check";

export default {
  name: "home",
  computed: {
    userId() {
      return this.$store.state.userInfo.ID;
    },
    userRoleIds() {
      return this.$store.state.userRoles.map(i => i.ID);
    }
  },
  methods: {
    go(path) {
      this.$router.push(path);
    },
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
.home {
  width: 100%;
  height: 100%;
  background: #ffffff;
  .home-content {
    background: #ffffff;
    padding: 60px 87px;
    h2 {
      font-size: 48px;
      font-weight: 400;
      color: #464032;
      line-height: 67px;
      margin-bottom: 16px;
    }
    .home-box {
      width: 544px;
      margin: 60px auto;
      .box-item {
        position: relative;
        width: 544px;
        height: 120px;
        line-height: 120px;
        background: #ffffff;
        box-shadow: 0px 6px 12px 0px rgba(0, 0, 0, 0.06);
        border-radius: 16px;
        padding-left: 180px;
        margin-bottom: 60px;
        .bg {
          width: 100px;
          height: 100px;
          position: absolute;
          left: 30px;
          bottom: 0;
        }
        span {
          font-size: 32px;
          font-weight: 600;
          color: #3a78fc;
          &.orange {
            color: #fd7d18;
          }
        }
        .btn {
          position: absolute;
          width: 32px;
          height: 32px;
          right: 80px;
          top: 42px;
        }
      }
    }
  }
}
</style>
