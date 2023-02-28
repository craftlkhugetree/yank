<template>
  <el-drawer
    class="base-drawer"
    title="测试用新增"
    :visible.sync="drawer"
    direction="rtl"
    :wrapperClosable="false"
    @open="getOutPortList"
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
        <el-form-item prop="shipname" label="车牌号：" style="margin-bottom:16px;" required>
          <el-input v-model="editForm.shipname" size="small" style="width:300px;"></el-input>
        </el-form-item>
        <el-form-item prop="location" label="罐号：" style="margin-bottom:16px;" required>
          <el-select
            v-model="editForm.location"
            size="small"
            style="width:300px;"
            filterable
            clearable
          >
            <el-option
              v-for="item in outPortList"
              :key="item.id"
              :label="item.location"
              :value="item.location"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>
    </div>
    <div class="drawer-footer">
      <el-button type="primary" size="small" @click="saveData">保存</el-button>
      <el-button size="small" @click="drawer = false">取消</el-button>
    </div>
  </el-drawer>
</template>

<script>
import { addOrder, fetchOutPortList } from "@/api/queuing.js";
export default {
  data() {
    return {
      drawer: false,
      drawerLoading: false,
      editForm: {
        goodsid: null,
        goodsname: null,
        shipname: null,
        location: null
      },
      outPortList: [],
      timer: null
    };
  },
  methods: {
    // 关闭抽屉
    closeDrawer() {
      this.$refs.editForm.resetFields();
      this.editForm = {
        goodsid: null,
        goodsname: null,
        shipname: null,
        location: null
      };
    },
    // 获取装车台
    getOutPortList() {
      let params = {
        goodsid: this.editForm.goodsid
      };
      fetchOutPortList(params).then(res => {
        if (res.success) {
          this.outPortList = res.data || [];
        }
      });
    },
    // 保存
    saveData() {
      this.$refs.editForm.validate(valid => {
        if (valid) {
          this.drawerLoading = true;
          let param = { ...this.editForm };
          addOrder(param)
            .then(res => {
              this.drawerLoading = false;
              if (res.success) {
                clearTimeout(this.timer);
                this.$message({
                  showClose: true,
                  type: "success",
                  message: "保存成功，10秒后更新数据！"
                });
                this.drawer = false;
                this.timer = setTimeout(() => {
                  this.$emit("doFunc");
                }, 10000);
              } else {
                let msg = res.data.message || res.data.errInf.shortBusInf;
                this.$message({
                  showClose: true,
                  type: "error",
                  message: "保存失败：" + msg
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
