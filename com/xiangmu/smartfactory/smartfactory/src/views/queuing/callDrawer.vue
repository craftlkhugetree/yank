<template>
  <el-drawer
    class="base-drawer"
    title="选叫"
    :visible.sync="drawer"
    direction="rtl"
    :wrapperClosable="false"
    @close="closeDrawer"
    v-loading="drawerLoading"
    size="660px"
  >
    <div class="drawer-container">
      <!-------------------- 保存 -------------------->
      <el-form
        ref="editForm"
        :model="editForm"
        label-width="100px"
        :show-message="false"
        label-position="right"
      >
        <el-form-item prop="id" label="车牌号：" style="margin-bottom:16px;" required>
          <el-select
            v-model="editForm.id"
            placeholder="请输入车牌号查询"
            size="small"
            style="width:360px;"
            filterable
            clearable
          >
            <el-option
              v-for="item in licenseList"
              :key="item.id"
              :label="item.shipname"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>
    </div>
    <div class="drawer-footer">
      <el-button type="primary" size="small" @click="saveCall">保存</el-button>
      <el-button size="small" @click="drawer = false">取消</el-button>
    </div>
  </el-drawer>
</template>

<script>
import { chooseOne } from "@/api/queuing.js";
export default {
  data() {
    return {
      goodsid: null,
      drawer: false,
      drawerLoading: false,
      editForm: {
        id: null,
      },
      licenseList: [],
    };
  },
  methods: {
    // 关闭抽屉
    closeDrawer() {
      this.$refs.editForm.resetFields();
      this.editForm = {
        id: null
      };
    },
    // 保存
    saveCall() {
      this.$refs.editForm.validate(valid => {
        if (valid) {
          this.drawerLoading = true;
          chooseOne(this.editForm.id)
            .then(res => {
              this.drawerLoading = false;
              if (res.code == "000000") {
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
                  message: "保存失败：" + res.msg
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
      });
    }
  }
};
</script>
