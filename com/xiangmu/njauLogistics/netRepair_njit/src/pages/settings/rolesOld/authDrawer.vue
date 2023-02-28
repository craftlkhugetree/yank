<template>
  <el-drawer
    class="base-drawer"
    title="菜单配置"
    :visible.sync="drawer"
    direction="rtl"
    :wrapperClosable="false"
    @close="closeDrawer"
    v-loading="drawerLoading"
    size="660"
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
      this.util
        .postAjax({
          code: "auth",
          url: "rest/Role/getRoleByMenupid",
          data: {
            ROLEID: this.roleId,
            MENUPID: this.$store.state.GROUPID
          }
        })
        .then(res => {
          this.authList = res.data;
          this.authList.forEach((i, index) => {
            // 四个角色默认权限不可取消
            // 接报修人员9100002-2：报修管理-维修管理9100002-2、报修录单9100002-3
            if (this.roleId === `${this.util.webUserID}-2` && i.ID === `${this.util.webUserID}-2`) {
              i.ISDEFAULT = true;
              i.items.forEach((j, index) => {
                if ([`${this.util.webUserID}-2`, `${this.util.webUserID}-3`].includes(j.RESID)) {
                  j.ISDEFAULT = true;
                }
              });
            }
            // 维修责任人9100002-3：报修管理-派单管理9100002-4
            if (this.roleId === `${this.util.webUserID}-3` && i.ID === `${this.util.webUserID}-2`) {
              i.ISDEFAULT = true;
              i.items.forEach((j, index) => {
                if (j.RESID === `${this.util.webUserID}-4`) {
                  j.ISDEFAULT = true;
                }
              });
            }
            // 维修共9100002-4：我的维修-9100002-8
            if (this.roleId === `${this.util.webUserID}-4` && i.ID === `${this.util.webUserID}-8`) {
              i.ISDEFAULT = true;
              i.items.forEach((j, index) => {
                if (j.RESID === `${this.util.webUserID}-k`) {
                  j.ISDEFAULT = true;
                }
              });
            }
            // 全校师生 默认菜单 首页
            if (this.roleId === `${this.util.webUserID}-1` && i.RESID === `${this.util.webUserID}-1`) {
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
      this.util
        .postAjax({
          code: "auth",
          url: "rest/Role/saveAuth",
          data: {
            data: JSON.stringify({
              ROLEID: this.roleId,
              RESID: checkList
            })
          }
        })
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
  padding: 30px;
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