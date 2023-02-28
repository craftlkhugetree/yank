<template>
  <div class="choose-role">
    <role-bar noRight></role-bar>
    <div class="bg">
      <div class="role-title" v-if="userRoles.length">
        <h2 class="font-s">
          请选择您的角色
        </h2>
      </div>
      <ul>
        <li
          v-if="userRoles.length === 0"
          style="line-height:24px; padding-top: 50px"
        >
          您暂时没有权限访问该服务，
          <br />请联系基地管理员
        </li>
        <li v-for="item in userRoles" :key="item.ID" @click="setCurRole(item)">
          <img :src="require(`../../static/images/${item.rName}-role.svg`)" alt />
          <span>{{ item.NAME }}</span>
          <van-icon name="arrow" />
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {};
  },
  computed: {
    // 用户角色
    userRoles() {
      let roles = this.$store.state.userRoles || [];
      return roles;
    }
  },
  methods: {
    // 设置当前角色
    setCurRole(item) {
      sessionStorage.setItem("curRole", item.ID);
      let path = item.path;
      //   this.common.setStore(this.global.roleName, item.rName);
      this.$router.push(path);
    }
  }
};
</script>

<style lang="scss" scoped>
.choose-role {
  width: 100%;
  height: 100%;
  background-size: cover;
  .role-title {
    padding: 35px 0 70px 50px;
    h2 {
      font-size: 24px;
      line-height: 34px;
      height: 34px;
      margin-bottom: 10px;
    }
  }
  ul {
    padding: 0 50px 20px;
    // position: relative;
    // top: calc(50% - 200px);
    // transform: translateY(-50%);
    li {
      background: #ffffff;
      border-radius: 15px;
      box-shadow: 0px 5px 20px 0px rgba(1, 176, 155, 0.1);
      padding: 10px 25px;
      margin-bottom: 20px;
      font-size: 16px;
      font-weight: bold;
      cursor: pointer;
      img {
        width: 50px;
        height: 50px;
        vertical-align: middle;
        margin-right: 20px;
      }
      span {
        line-height: 50px;
      }
      .van-icon {
        float: right;
        line-height: 50px;
      }
      &:active {
        background: #e3f9f5;
        color: #00b09b;
        border: 2px solid rgba(0, 176, 155, 1);
      }
    }
  }
}
</style>
