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
    <el-form :model="editForm" ref="editForm" style="padding:30px;">
      <el-form-item
        label="维修责任人："
        prop="repairleader"
        :rules="[{required: true,message:'请选择维修责任人'}]"
      >
        <el-select
          v-model="editForm.repairleader"
          size="small"
          clearable
          value-key="ID"
          style="width:300px;"
        >
          <el-option
            v-for="item in repairLeaderList"
            :key="item.ID"
            :label="item.NAME"
            :value="item"
          ></el-option>
        </el-select>
      </el-form-item>
    </el-form>
    <div class="drawer-footer">
      <el-button type="primary" size="small" @click="doSubmit">提交</el-button>
      <el-button size="small" @click="drawer = false">取消</el-button>
    </div>
  </el-drawer>
</template>

<script>
export default {
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
      this.$refs.editForm.resetFields();
    },
    // 办理
    doSubmit() {
      this.$refs.editForm.validate(valid => {
        if (valid) {
          this.drawerLoading = true;
          let arr = this.selectArr.map(i => {
              return {
                  applyid: i.id,
                  version:i.version,
                  repairleaderid: this.editForm.repairleader.ID,
                  repairleadername: this.editForm.repairleader.NAME
              }
          })
          this.util
            .postAjax({
              code: this.global.code,
              url: "apply/takeoutBatch",
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
    }
  }
};
</script>

<style>
</style>