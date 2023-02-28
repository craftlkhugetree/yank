<template>
  <div class="main">
    <van-nav-bar title="智慧校园预约平台" fixed :border="false" @click-right="jumpSearch">
      <template #right>
        <van-icon name="search" size="18" />
      </template>
    </van-nav-bar>
    <div class="main-content">
      <div class="header-icon clearfix">
        <img src="@/assets/img/avatar.png" width="100%" alt />
        <div class="user-info clearfix">
          <div class="div_flex">
            <h2>{{ userInfo.NAME }}</h2>
            <span class="btn" @click="changePwd">修改密码</span>
          </div>
          <p>账号正常</p>
        </div>
      </div>
      <div class="menu-nav">
        <van-cell is-link to="calendar">
          <template #title>
            <van-icon class="date-icon" />
            <span class="custom-title">预约日历</span>
          </template>
        </van-cell>
      </div>
      <div class="menu-nav">
        <van-cell is-link to="message">
          <template #title>
            <van-icon class="msg-icon" />
            <span class="custom-title">通知消息</span>
          </template>
        </van-cell>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {};
  },
  components: {},
  created() {},
  mounted() {},
  computed: {
    userInfo() {
      return this.$store.state.userInfo;
    },
  },
  methods: {
    changePwd() {
        this.$router.push('/changePwd')
      },
    //跳转到搜索
    jumpSearch() {
      this.$router.push({
        name: 'res-search',
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.main-content {
  padding: 90px 32px 32px 32px;
}
.header-icon {
  margin-top: 64px;
  font-size: 24px;
  color: #7d7d80;
  line-height: 60px;
  margin-bottom: 64px;
  img {
    width: 128px;
    height: 128px;
    float: left;
    margin-right: 24px;
  }
  .user-info {
    float: left;
    margin-left: 48px;
    width: 70%;
    .btn {
      width: 96px;
      margin-left: auto;
      height: 28px;
      font-size: 24px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #3f86f7;
      line-height: 24px;
      cursor: pointer;
      margin-bottom: 20px;
    }
    h2 {
      font-weight: blod;
      color: #474d51;
      font-size: 32px;
      line-height: 32px;
      margin-bottom: 20px;
    }
    p {
      font-size: 24px;
      margin-top: 15px;
      color: #7d7d80;
    }
  }
}

.menu-nav {
  height: 108px;
  background: #ffffff;
  box-shadow: 0px 5px 20px 0px #f6f6f6;
  border-radius: 10px;
  margin-bottom: 32px;

  .title {
    font-size: 28px;
    color: #474d51;
    margin-left: 16px;
  }
}
.van-cell {
  line-height: 32px;
}
.date-icon {
  background: url('~@/assets/img/date.png') no-repeat right;
  float: left;
  width: 60px;
  height: 60px;
  background-size: cover;
  margin-right: 16px;
}
.msg-icon {
  background: url('~@/assets/img/msg-icon.png') no-repeat right;
  float: left;
  width: 60px;
  height: 60px;
  background-size: cover;
  margin-right: 16px;
}
.div_flex {
  display: flex;
  align-items: center;
}
</style>
