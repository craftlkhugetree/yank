<template>
  <div class="base-search-table bg-white">
    <!-- <div v-if="!userArea.id" class="nodata" style="padding-top: 100px">
      <img src="@/assets/img/nodata.png" alt />
      <p>您暂时没有所属的业务领域，请联系系统管理员添加！</p>
    </div> -->
    <div>
      <div class="search-box clearfix" style="padding: 15px 20px 0">
        <h3 style="width: 80px">{{ userInfo.NAME }}</h3>
      </div>
      <!---------------------------- 表格 ---------------------------->
      <div class="table-content infotable">
        <p class="infolabel"><span>姓名：</span>{{ userInfo.NAME }}</p>
        <p class="infolabel"><span>登陆账号：</span>{{ userInfo.LOGINNAME }}</p>
        <p class="infolabel"><span>用户角色：</span>{{ userRole || "" }}</p>
        <el-button type="primary" icon="el-icon-edit" @click="openDrawer"
          >修改密码</el-button
        >
      </div>
      <!---------------------------- 添加 ---------------------------->
      <add-drawer ref="addDrawer"></add-drawer>
    </div>
  </div>
</template>

<script>
import { getUserInfo, getOneUserRole } from "@/api/roles";
import addDrawer from "./addDrawer.vue";
export default {
  components: { addDrawer },
  data() {
    return {
      userRole: "",
    };
  },
  computed: {
    // 当前用户的业务领域
    userInfo() {
      return this.$store.state.userInfo;
    },
  },
  methods: {
    openDrawer() {
      let drawer = this.$refs.addDrawer;
      drawer.openDrawer();
    },
  },
  created() {
    getUserInfo().then((res) => {
      if (res && res.success) {
        let curUser = res.item || {};
        this.$store.commit("setUserInfo", curUser);
        getOneUserRole({ ID: res.item.ID }).then((res) => {
          this.userRole = res.items.length ? res.items[0].NAME : "";
        });
      }
    });
  },
};
</script>

<style lang="scss">
.base-search-table {
  min-height: 800px;
  padding-bottom: 20px;
  .el-table .cell span:not(:last-child) {
    margin-right: 22px !important;
  }
}
.infotable {
  margin-top: 8px;
  border-top: 1px solid #dbdbdb;
  padding: 30px 20px;
  .infolabel {
    font-size: 14px;
    font-weight: 400;
    color: #5f6464;
    line-height: 20px;
    margin-bottom: 30px;
    span {
      display: inline-block;
      width: 86px;
    }
  }
}
</style>