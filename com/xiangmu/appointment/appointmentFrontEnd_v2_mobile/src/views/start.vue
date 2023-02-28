<template>
  <div class="main">
    <van-nav-bar title="智慧校园预约平台" fixed :border="false" />
    <img class="logo" src="@/assets/img/logo-big.png" alt />
    <div class="menu">
      <div class="menu-item orange" @click="$router.push('/index')">
        <img src="@/assets/img/start-user.png" alt />
        我要预约
        <i>→</i>
      </div>
      <div
        v-if="isAppointAdmin=='true'"
        class="menu-item blue"
        @click="$router.push('/appoint-manage')"
      >
        <img src="@/assets/img/start-admin.png" alt />
        预约管理
        <i>→</i>
      </div>
      <div
        v-if="isAuditAdmin=='true'"
        class="menu-item blue"
        @click="$router.push('/audit-manage')"
      >
        <img src="@/assets/img/start-admin.png" alt />
        预约审核
        <i>→</i>
      </div>
      <div
        v-if="isAuditAdmin=='true'"
        class="menu-item blue"
        @click="$router.push('/sys-manage/blacklist')"
      >
        <img src="@/assets/img/start-admin.png" alt />
        黑名单管理
        <i>→</i>
      </div>
    </div>
  </div>
</template>

<script>
// import { getUserRole } from "@/api/admin/user";
export default {
  data() {
    return {
      isAppointAdmin: sessionStorage.getItem("isAppointAdmin") || false,
      isAuditAdmin: sessionStorage.getItem("isAuditAdmin") || false
    };
  }

  // beforeRouteEnter(to, from, next) {
  //   // 获取用户角色
  //   getUserRole().then(res => {
  //     if (res.success) {
  //       let data = res.data || [];
  //       let roleIds = data.map(i => i.ID);
  //       // 资源管理员9200001-2拥有预约管理菜单 ， 审核领导9200001-3拥有预约管理菜单
  //       if (roleIds.includes("9200001-2") || roleIds.includes("9200001-3")) {
  //         next(vm => {
  //           vm.isAppointAdmin = roleIds.includes("9200001-2");
  //           vm.isAuditAdmin = roleIds.includes("9200001-3");
  //         });
  //       } else {
  //         next("/index");
  //       }
  //     }
  //   });
  // }
};
</script>

<style lang="scss" scoped>
.main {
  width: 100%;
  height: 100%;
  background: #ffffff;
  text-align: center;
  padding: 60px 0;
  .logo {
    margin: 88px 0 80px;
    width: 328px;
    height: 146px;
  }
  .menu {
    .menu-item {
      position: relative;
      width: 480px;
      height: 120px;
      margin: 0 auto 60px;
      background: #ffffff;
      box-shadow: 0px 6px 12px 0px rgba(0, 0, 0, 0.06);
      border-radius: 16px;
      font-size: 32px;
      line-height: 120px;
      font-weight: bold;
      img {
        position: absolute;
        width: 100px;
        height: 100px;
        left: 30px;
        bottom: 0;
      }
      i {
        position: absolute;
        right: 80px;
        bottom: 4px;
        font-weight: bold;
      }
    }
  }
}
.orange {
  color: #fd7d18;
}
.blue {
  color: #638dec;
}
</style>