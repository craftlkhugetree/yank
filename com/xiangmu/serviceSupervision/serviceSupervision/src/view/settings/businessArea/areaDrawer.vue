<template>
  <el-drawer
    class="base-drawer"
    :title="title"
    :visible.sync="drawer"
    direction="rtl"
    :wrapperClosable="false"
    @open="openDrawer"
    @close="closeDrawer"
    v-loading="drawerLoading"
    size="660"
  >
    <div class="drawer-container">
      <!-------------------- 保存业务领域 -------------------->
      <el-form ref="editForm" :model="editForm" :rules="rules" style="margin-bottom:20px;">
        <el-form-item prop="name" label="业务领域：" style="margin-bottom:16px;" :show-message="false">
          <el-input
            v-model="editForm.name"
            placeholder="请输入业务领域名称"
            size="small"
            style="width:360px;"
            @input="saveNameSuccess=false;"
          ></el-input>
        </el-form-item>
        <el-button
          v-if="!saveNameSuccess"
          :type="!editForm.name ? 'info' : 'primary'"
          size="small"
          :disabled="!editForm.name || editForm.name == areaName"
          @click="saveRole"
          style="margin-left:90px;"
          :loading="areaLoading"
        >保存业务领域</el-button>
        <el-button
          v-else
          type="info"
          size="small"
          style="margin-left:65px;"
          disabled
          icon="el-icon-success"
        >保存成功</el-button>
      </el-form>
      <!-------------------- 保存问题类型、区域 -------------------->
      <el-tabs v-model="activeTab">
        <!-------------------- 问题类型 -------------------->
        <el-tab-pane label="问题类型" name="questionType">
          <div class="no-role" v-if="!editForm.id">
            <i class="el-icon-warning"></i>
            请先保存业务领域
          </div>
          <div v-else>
            <quest-type-table ref="questTypeTable" :bussinessAreaId="editForm.id"></quest-type-table>
          </div>
        </el-tab-pane>
        <!-------------------- 区域 -------------------->
        <el-tab-pane label="区域" name="area">
          <div class="no-role" v-if="!editForm.id">
            <i class="el-icon-warning"></i>
            请先保存业务领域
          </div>
          <div v-else>
            <area-table ref="areaTable" :bussinessAreaId="editForm.id"></area-table>
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>
    <!-- <div class="drawer-footer">
      <el-button type="primary" size="small" :disabled="!editForm.id" @click="saveAll">保存</el-button>
      <el-button size="small" @click="drawer = false">取消</el-button>
    </div> -->
  </el-drawer>
</template>

<script>
import QuestTypeTable from "./questTypeTable";
import AreaTable from "./areaTable";
export default {
  components: {
    QuestTypeTable,
    AreaTable
  },
  data() {
    return {
      title: "新增业务领域",
      areaName: null,
      drawer: false,
      drawerLoading: false,
      areaLoading: false,
      saveNameSuccess: false,
      editForm: {
        id: null,
        name: null
      },
      rules: {
        name: [
          { required: true, message: "请输入业务领域名称！", trigger: "change" }
        ]
      },
      activeTab: "questionType",
      questLoading: false,
      questTableData: [],
      questTableloading: false,
      questKeyword: null,
      questTotal: 0,
      questPageSize: 10,
      questCurrentPage: 1
    };
  },
  methods: {
    // 打开抽屉
    openDrawer() {
      if (this.editForm.id) {
      }
    },
    // 关闭抽屉
    closeDrawer() {
      this.$refs.editForm.resetFields();
      (this.editForm = {
        id: null,
        name: null
      }),
        (this.areaName = null);
      this.$emit("doFunc");
    },
    // 保存业务领域
    saveRole() {
      this.$refs.editForm.validate(valid => {
        if (valid) {
          this.areaLoading = true;
          this.util
            .postAjax({
              code: this.global.authCode,
              url: "rest/UserGroup/saveGroup",
              data: {
                data: JSON.stringify({
                  ID: this.editForm.id,
                  NAME: this.editForm.name,
                  APPID: this.$store.state.GROUPID
                })
              }
            })
            .then(res => {
              this.areaLoading = false;
              if (res.success) {
                this.saveNameSuccess = true;
                this.editForm.id = res.item.ID;
                this.areaName = res.item.NAME;
                this.$store.dispatch("getDepartments");
              } else {
                this.$message({
                  showClose: true,
                  type: "error",
                  message: "保存失败：" + res.data.errInf.shortBusInf
                });
              }
            })
            .catch(err => {
              this.areaLoading = false;
              this.$message({
                showClose: true,
                type: "error",
                message: "保存失败：" + err
              });
            });
        }
      });
    },
    // 最终保存
    saveAll() {
      this.drawerLoading = true;
      Promise.all([this.saveAuth(), this.saveUser()])
        .then(res => {
          this.drawerLoading = false;
          this.$message({
            showClose: true,
            type: "success",
            message: "保存成功！"
          });
          this.drawer = false;
        })
        .catch(err => {
          this.drawerLoading = false;
          this.$message({
            showClose: true,
            type: "error",
            message: err
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
  .no-role {
    font-size: 14px;
    color: rgba(0, 0, 0, 0.65);
    line-height: 22px;
    background: #fffbe6;
    border-radius: 2px;
    border: 1px solid #ffe58f;
    padding: 9px 0 9px 15px;
    i {
      color: #faad14;
    }
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
<style lang="scss">
.drawer-container {
  .el-tabs__item.is-active {
    color: #3a78fc !important;
  }
  .el-tabs__active-bar {
    background-color: #3a78fc !important;
  }
}
</style>
