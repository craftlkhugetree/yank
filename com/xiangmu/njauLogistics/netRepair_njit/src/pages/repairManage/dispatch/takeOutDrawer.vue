<template>
  <el-drawer
    class="base-drawer"
    title="批量办理"
    :visible.sync="drawer"
    direction="rtl"
    :wrapperClosable="false"
    @close="closeDrawer"
    v-loading="drawerLoading"
    size="660"
  >
    <div style="padding: 30px;">
      <edit-form ref="editForm"></edit-form>
    </div>
    <div class="drawer-footer">
      <el-button type="primary" size="small" @click="doSubmit">提交</el-button>
      <el-button size="small" @click="drawer = false">取消</el-button>
    </div>
  </el-drawer>
</template>

<script>
import EditForm from "./editForm";
export default {
  components: {
    EditForm
  },
  props: {
    repairLeaderList: Array
  },
  data() {
    return {
      drawer: false,
      drawerLoading: false,
      editForm: {
        repairleader: ""
      },
      selectArr: []
    };
  },
  methods: {
    closeDrawer() {
      this.$refs.editForm.$refs.editForm.resetFields();
    },
    // 办理
    doSubmit() {
      this.$refs.editForm.$refs.editForm.validate(valid => {
        if (valid) {
          this.drawerLoading = true;
          let data = _.cloneDeep(this.$refs.editForm.editForm);
          let handletype = data.handletype;
          delete data.handletype;
          let params = {};
          switch (handletype) {
            case "1":
              params.repair = data;
              break;
            case "4":
              params.repairid = data.repairid;
              break;
            case "3":
            case "2":
            case "5":
              params.note = data.sendnote;
              break;
          }
          let arr = this.selectArr.map(i => {
            return {
              type: "4",
              applyid: i.id,
              version: i.version,
              handletype: handletype,
              ...params
            }
          })
          this.util
            .postAjax({
              code: this.global.code,
              url: "apply/handleBatch",
              isRep: true,
              data: arr
            })
            .then(res => {
              this.drawerLoading = false;
              if (res.success) {
                this.$message({
                  showClose: true,
                  type: "success",
                  message: `办理成功`
                });
                this.drawer = false;
                this.$emit("doFunc");
              } else {
                this.$message({
                  showClose: true,
                  type: "error",
                  message: `办理失败：${res.data.message}`
                });
              }
            })
            .catch(err => {
              this.drawerLoading = false;
              this.$message({
                showClose: true,
                type: "error",
                message: `办理失败：${err}`
              });
            });
        }
      });
    },
  }
};
</script>

<style>
</style>