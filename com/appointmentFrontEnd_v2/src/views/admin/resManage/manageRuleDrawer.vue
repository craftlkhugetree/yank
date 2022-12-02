<template>
  <el-drawer
    class="base-drawer"
    title="管理办法"
    :visible.sync="drawer"
    direction="rtl"
    :wrapperClosable="false"
    @close="closeDrawer"
    v-loading="drawerLoading"
    size="660px"
  >
    <div class="drawer-container">
      <wang-editor ref="editor"></wang-editor>
    </div>
    <div class="drawer-footer">
      <el-button type="primary" size="small" @click="saveResGroup">保存</el-button>
      <el-button size="small" @click="drawer = false">取消</el-button>
    </div>
  </el-drawer>
</template>

<script>
import { saveResGroup } from "@/api/admin/res";
import WangEditor from "@/components/WangEditor";
export default {
  components: {
    WangEditor
  },
  data() {
    return {
      drawer: false,
      drawerLoading: false,
      resGroup: {}, // 当前资源集
      ugroupids: [], // 开放对象
    };
  },
  methods: {
    // 关闭抽屉
    closeDrawer() {},

    // 保存资源集
    saveResGroup() {
      let data = {
        id: this.resGroup.id,
        name: this.resGroup.name,
        managerinfo: this.$refs.editor.editor.txt.html(),
        ugroupids: this.ugroupids.split(",")
      };
      this.drawerLoading = true;
      saveResGroup(data)
        .then(res => {
          this.drawerLoading = false;
          if (res.success) {
            this.$message({
              showClose: true,
              type: "success",
              message: "保存成功！"
            });
            this.drawer = false;
            this.$emit("doFunc");
          } else {
            this.$message({
              showClose: true,
              type: "error",
              message: "保存失败：" + res.data.message
            });
          }
        })
        .catch(err => {
          this.drawerLoading = false;
          this.$message({
            showClose: true,
            type: "error",
            message: "保存失败：" + err
          });
        });
    }
  }
};
</script>

<style lang="scss" scoped>
.drawer-container {
  padding: 0 20px 32px;
}
</style>