<template>
  <el-drawer
    class="base-drawer"
    title="批量编辑"
    :visible.sync="drawer"
    direction="rtl"
    :wrapperClosable="false"
    @open="openDrawer"
    @close="closeDrawer"
    v-loading="drawerLoading"
    size="660px"
  >
    <div class="drawer-container">
      <el-table :data="tableData" style="width:100%" header-row-class-name="table-header">
        <el-table-column prop="name" label="姓名" show-overflow-tooltip>
          <template slot-scope="scope">{{scope.row.username}}（{{scope.row.userid}}）</template>
        </el-table-column>
        <el-table-column prop="rylxm" label="人员类型" show-overflow-tooltip></el-table-column>
        <el-table-column prop="salary" label="外挂工资（元）" show-overflow-tooltip>
          <template slot-scope="scope">
            <el-input
              v-model="scope.row.editSalary"
              size="small"
              :class="{'is-error': !scope.row.editSalary}"
              @keyup.native="moneyLimit($event, scope.row)"
            ></el-input>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="drawer-footer">
      <el-button type="primary" size="small" @click="doSave">保存</el-button>
      <el-button size="small" @click="drawer = false">取消</el-button>
    </div>
  </el-drawer>
</template>

<script>
import { saveSalary } from "@/api/admin/salary.js";
export default {
  data() {
    return {
      drawer: false,
      drawerLoading: false,
      tableData: []
    };
  },
  methods: {
    // 打开抽屉
    openDrawer() {},
    // 关闭抽屉
    closeDrawer() {},
    // 限制金额输入（整数或两位小数）
    moneyLimit(e, row) {
      this.common.moneyInput(e);
      row.editSalary = e.target.value;
    },
    // 保存
    doSave() {
      if (this.tableData.some(i => !i.editSalary)) {
        this.$message({
          showClose: true,
          type: "error",
          message: "请输入外挂工资"
        });
      } else {
        let params = this.tableData.map(i => {
          return {
            id: i.id,
            userid: i.userid,
            username: i.username,
            salary: i.editSalary.toString().replace(/\.$/, "")
          };
        });
        this.drawerLoading = true;
        saveSalary(params)
          .then(res => {
            this.drawerLoading = false;
            if (res.success) {
              this.$message({
                showClose: true,
                type: "success",
                message: `保存成功！`
              });
              this.drawer = false;
              this.$emit("doFunc");
            } else {
              this.$message({
                showClose: true,
                type: "error",
                message: `保存失败：${res.data.message}`
              });
            }
          })
          .catch(err => {
            this.drawerLoading = false;
            this.$message({
              showClose: true,
              type: "error",
              message: `保存失败：${err}`
            });
          });
      }
    }
  }
};
</script>

<style scoped>
.el-form-item {
  margin-bottom: 12px;
}
</style>