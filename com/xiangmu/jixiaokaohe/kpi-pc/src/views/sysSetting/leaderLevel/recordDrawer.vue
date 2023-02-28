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
    size="660px"
  >
    <div class="drawer-container">
      <el-table :data="tableData" style="width:100%" header-row-class-name="table-header">
        <el-table-column
          prop="createtime"
          label="修改时间"
          show-overflow-tooltip
          :formatter="common.timeFormat"
        ></el-table-column>
        <el-table-column prop="creatername" label="操作人" show-overflow-tooltip>
          <template slot-scope="scope">
            {{scope.row.creatername}}（{{scope.row.createrid}}）
          </template>
        </el-table-column>
        <el-table-column
          prop="allowance"
          label="领导岗位津贴（元）"
          show-overflow-tooltip
          :formatter="(row, column, val) => common.moneyFormat(val)"
        ></el-table-column>
      </el-table>
    </div>
  </el-drawer>
</template>

<script>
import { fetchLevelRecord } from "@/api/admin/leaderLevel.js";
export default {
  data() {
    return {
      drawer: false,
      drawerLoading: false,
      levelId: null,
      title: null,
      tableData: []
    };
  },
  methods: {
    // 打开抽屉
    openDrawer() {
      this.getTableData();
    },
    // 关闭抽屉
    closeDrawer() {
      this.title = null;
      this.levelId = null;
      this.tableData = [];
    },
    // 获取数据
    getTableData() {
      this.drawerLoading = true;
      let param = {
        id: this.levelId
      };
      fetchLevelRecord(param)
        .then(res => {
          this.drawerLoading = false;
          this.tableData = res.data || [];
        })
        .catch(err => {
          this.drawerLoading = false;
        });
    }
  }
};
</script>

<style scoped>
</style>