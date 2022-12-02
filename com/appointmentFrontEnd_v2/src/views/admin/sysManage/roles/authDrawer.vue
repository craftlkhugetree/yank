<template>
  <el-drawer
    class="base-drawer"
    title="菜单配置"
    :visible.sync="drawer"
    direction="rtl"
    :wrapperClosable="false"
    @close="closeDrawer"
    v-loading="drawerLoading"
    size="660px"
  >
    <div class="drawer-container">
      <h4>{{roleName}}</h4>
      <div class="auth-box" v-for="item in authList" :key="item.RESID">
        <el-checkbox
          class="auth-box-title"
          v-model="item.checked"
          :indeterminate="item.ISPART"
          @change="val => checkAll(val,item)"
          :disabled="item.ISDEFAULT"
        >{{item.NAME}}</el-checkbox>
        <div class="auth-box-content">
          <el-checkbox
            v-for="auth in item.items"
            v-model="auth.checked"
            :label="auth.RESID"
            :key="auth.RESID"
            @change="val => checkChange(val,item)"
            :disabled="auth.ISDEFAULT"
          >{{auth.NAME}}</el-checkbox>
        </div>
      </div>
    </div>
    <div class="drawer-footer">
      <el-button type="primary" size="small" @click="saveAuth">保存</el-button>
      <el-button size="small" @click="drawer = false">取消</el-button>
    </div>
  </el-drawer>
</template>

<script>
import { fetchRoleAuth, saveRoleAuth } from "@/api/admin/roles";
export default {
  data() {
    return {
      roleId: null,
      roleName: null,
      drawer: false,
      drawerLoading: false,
      authList: []
    };
  },
  methods: {
    // 关闭抽屉
    closeDrawer() {
      this.authList = [];
    },
    // 当前权限组全选
    checkAll(val, item) {
      item.ISPART = false;
      item.items.forEach(i => (i.checked = val));
    },
    // 当前权限组改变选择
    checkChange(val, item) {
      let selectLength = item.items.filter(i => i.checked).length;
      item.checked = selectLength === item.items.length;
      item.ISPART = selectLength > 0 && selectLength < item.items.length;
    },
    // 获取当前角色的权限,MENUPID为当前应用id
    getAuthList() {
      let data = {
        ROLEID: this.roleId,
        MENUPID: this.$store.state.GROUPID
      };
      fetchRoleAuth(data).then(res => {
        this.authList = res.data;
        this.authList.forEach((i, index) => {
          // 三个角色默认权限不可取消
          // 系统管理员9200001-1：角色权限9200001-6-1、参数设置9200001-6-2、消息配置9200001-6-4
          if (this.roleId === "9200001-1" && i.ID === "9200001-6") {
            i.ISDEFAULT = true;
            i.items.forEach((j, index) => {
              if (["9200001-6-1", "9200001-6-2", "9200001-6-4"].includes(j.ID)) {
                j.ISDEFAULT = true;
              }
            });
          }
          // 资源管理员9200001-2：模板管理9200001-1、资源管理9200001-2、预约管理9200001-3
          if (this.roleId === "9200001-2" && ["9200001-1","9200001-2","9200001-3"].includes(i.ID)) {
            i.ISDEFAULT = true;
          }
          // 审核领导9200001-3：审核管理9200001-4
          if (this.roleId === "9200001-3" && ["9200001-4"].includes(i.ID)) {
            i.ISDEFAULT = true;
          }

          // 如果只有一级菜单，则其items添加该一级菜单
          if (i.items.length === 0) {
            i.items.push({
              NAME: i.NAME,
              RESID: i.RESID,
              checked: i.checked,
              ISDEFAULT: i.ISDEFAULT
            });
          }
          // 设置一级菜单是否全部选中 或者 部分选中
          let selectLength = i.items.filter(j => j.checked).length;
          i.checked = selectLength === i.items.length;
          i.ISPART = selectLength > 0 && selectLength < i.items.length;
        });
      });
    },
    // 保存
    saveAuth() {
      // 转换数据
      let checkList = [];
      this.authList.forEach(i => {
        let arr = i.items.filter(j => j.checked);
        checkList = checkList.concat(arr.map(k => k.RESID));
      });
      this.drawerLoading = true;
      let data = {
        data: JSON.stringify({
          ROLEID: this.roleId,
          RESID: checkList
        })
      };
      saveRoleAuth(data)
        .then(res => {
          this.drawerLoading = false;
          if (res.success) {
            this.$message({
              showClose: true,
              type: "success",
              message: "保存成功！"
            });
            this.drawer = false;
          } else {
            this.$message({
              showClose: true,
              type: "error",
              message: "保存失败！" + res.data.errInf.shortBusInf
            });
          }
        })
        .catch(err => {
          this.drawerLoading = false;
          this.$message({
            showClose: true,
            type: "error",
            message: "保存失败！" + err
          });
        });
    }
  }
};
</script>

<style lang="scss" scoped>
.drawer-container {
  padding: 0 30px 30px;
  h4 {
    font-size: 14px;
    color: rgba(0, 0, 0, 0.65);
    border-left: 3px solid #38adff;
    padding-left: 10px;
    line-height: 20px;
    height: 20px;
    margin-bottom: 20px;
  }
  .auth-box {
    margin-bottom: 10px;
    .auth-box-title {
      display: block;
      background: rgba(0, 0, 0, 0.04);
      padding: 8px 10px;
      width: 100%;
      border-radius: 2px;
    }
    .el-checkbox {
      color: rgba(0, 0, 0, 0.65);
      margin-bottom: 10px;
      margin-right: 60px;
    }
    .auth-box-content {
      padding: 0 10px;
    }
  }
}
</style>