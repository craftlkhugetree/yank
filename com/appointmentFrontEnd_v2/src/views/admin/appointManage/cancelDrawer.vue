<template>
  <el-drawer
    class="base-drawer"
    title="取消预约"
    :visible.sync="drawer"
    direction="rtl"
    :wrapperClosable="false"
    v-loading="drawerLoading"
    size="660px"
    @open="note=null"
  >
    <div class="drawer-container">
      <label>
        <i>*</i>取消说明
      </label>
      <el-input type="textarea" v-model="note" :rows="5" resize="none" placeholder="请输入取消预约说明"></el-input>
    </div>
    <div class="drawer-footer">
      <el-button type="primary" size="small" @click="doCancel">确定</el-button>
      <el-button size="small" @click="drawer = false">取消</el-button>
    </div>
  </el-drawer>
</template>

<script>
import { getApplyDetail, doCancel } from "@/api/admin/appoint";
import { getFileInfo } from "@/api/admin/file";
export default {
  data() {
    return {
      ids: null,
      names: null,
      drawer: false,
      drawerLoading: false,
      note: null
    };
  },
  methods: {
    // 取消预约
    doCancel() {
      if(!this.note) {
        this.$message({
          showClose: true,
          type: "error",
          message: "请输入取消预约说明!"
        });
        return;
      }
      this.$confirm(`是否确认取消资源(${this.names})的预约单吗?`, "确认取消预约", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.drawerLoading = true;
          let data = {
            ids: this.ids.join(","),
            note: this.note
          };
          doCancel(data)
            .then(res => {
              this.drawerLoading = false;
              if (res.success) {
                this.$message({
                  showClose: true,
                  type: "success",
                  message: "取消预约成功！"
                });
                this.$emit("doFunc");
              } else {
                this.$message({
                  showClose: true,
                  type: "error",
                  message: "取消预约失败：" + res.data.message
                });
              }
            })
            .catch(err => {
              this.drawerLoading = false;
              this.$message({
                showClose: true,
                type: "error",
                message: "取消预约失败：" + err
              });
            });
        })
        .catch(() => {
          return;
        });
    }
  }
};
</script>

<style lang="scss" scoped>
.drawer-container {
  padding: 30px 20px 32px;
  label {
    color: #595959;
    line-height: 30px;
    i {
      color: #ff0000;
      margin-right: 10px;
    }
  }
}
</style>