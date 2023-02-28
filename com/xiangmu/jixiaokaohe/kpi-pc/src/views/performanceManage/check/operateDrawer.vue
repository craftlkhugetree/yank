<template>
  <el-drawer
    class="base-drawer"
    :title="title"
    :visible.sync="drawer"
    direction="rtl"
    :wrapperClosable="false"
    @close="closeDrawer"
    size="660px"
  >
    <div class="drawer-container base-search-table">
      <el-table
        :data="tableData"
        style="width:100%"
        v-loading="tableLoading"
        header-row-class-name="table-header"
      >
        <el-table-column type="index" label="操作时间" show-overflow-tooltip width="80"></el-table-column>
        <el-table-column prop="NAME" label="操作人">
          <!-- <template slot-scope="scope">{{scope.row.NAME}}（{{scope.row.ID}}）</template> -->
        </el-table-column>
        <el-table-column prop="res" label="操作内容"></el-table-column>
      </el-table>
    </div>
  </el-drawer>
</template>

<script>
import { fetchOperateList } from "@/api/kpi/awardList";
export default {
  data() {
    return {
      drawer: false,
      tableLoading: false,
      tableData: [],
      title: ""
    };
  },
  computed: {},
  mounted() {
    this.getTableData();
  },
  methods: {
    getTableData(page, pageSize) {
      this.tableLoading = true;
      let data = {
        filter: {
          name: this.keyword
        }
      };
      fetchOperateList(data)
        .then(res => {
          this.tableLoading = false;
          this.tableData = res.data || [];
        })
        .catch(err => {
          this.tableLoading = false;
        });
    },
    // 关闭抽屉
    closeDrawer() {
      this.$emit("doFunc");
    }
  }
};
</script>

<style scoped lang="scss">
</style>