<template>
  <div class="home">
    <van-nav-bar title="绩效奖励分配系统" fixed :border="false" />
    <div style="width:100%;height:46px;"></div>
    <div class="home-content">
      <h2>Hello！</h2>
      <h2>欢迎来到绩效奖励分配系统</h2>
      <div class="home-box" v-if="userId">
        <!------------- 普通用户 ------------>
        <div class="box-item animation-1" @click="go('/award-detail')">
          <img class="bg" src="@/assets/img/home-img-1.png" alt />
          <span class="orange">绩效奖励查询</span>
          <img class="btn" src="@/assets/img/home-right-1.png" alt />
        </div>
        <!------------- 考核工作组 ------------>
        <div
          class="box-item animation-2"
          @click="go('/month-confirm')"
          v-if="userRoleIds.includes('20210604-2')"
        >
          <img class="bg" src="@/assets/img/home-img-2.png" alt />
          <span>月度绩效确认</span>
          <img class="btn" src="@/assets/img/home-right-2.png" alt />
        </div>
        <div
          class="box-item animation-3"
          @click="go('/year-confirm')"
          v-if="userRoleIds.includes('20210604-2')"
        >
          <img class="bg" src="@/assets/img/home-img-2.png" alt />
          <span>年终奖确认</span>
          <img class="btn" src="@/assets/img/home-right-2.png" alt />
        </div>
        <!------------ 分管领导 ----------->
        <div
          class="box-item animation-4"
          @click="go('/audit')"
          v-if="userRoleIds.includes('20210604-3')"
        >
          <img class="bg" src="@/assets/img/home-img-2.png" alt />
          <span>绩效审核</span>
          <img class="btn" src="@/assets/img/home-right-2.png" alt />
        </div>
      </div> 
      <!------------ 该用户不在系统中 ------------>
      <div class="home-box" v-else>
        <div class="box-item animation-1" style="padding-left:20px;">
          <span class="orange">无查看权限，请联系管理员</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "home",
  computed: {
    userId() {
      return this.$store.state.userDetail.id;
    },
    userRoleIds() {
      return this.$store.state.userRoles.map(i => i.ID);
    }
  },
  methods: {
    go(path) {
      this.$router.push(path);
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
          color: #638dec;
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
