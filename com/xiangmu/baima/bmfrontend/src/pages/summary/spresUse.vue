<template>
  <div class="common-content">
    <!--搜索框-->
    <div class="search-group head">
      <span>科教资源使用情况表</span>
      <div
        style="display:inline-block;float: right;margin-top: 3px;margin-bottom: 20px"
      >
        <div class="my-button green" style="" @click="download">
          导出
        </div>
      </div>
    </div>

    <!--表格-->
    <el-table
      class="my-table"
      :data="tableData"
      style="width: 100%"
      stripe
      v-loading="loading"
      :header-cell-style="{ background: '#F3F5F9' }"
    >
      <el-table-column
        prop="name"
        label="资源类型"
        align="center"
      ></el-table-column>
      <el-table-column
        prop="allNum"
        label="总量"
        align="center"
      ></el-table-column>
      <el-table-column
        prop="useingNum"
        label="使用"
        align="center"
      ></el-table-column>
      <el-table-column prop="unuseNum" label="未使用" align="center">
        <template slot-scope="scope">
          <span
            style="color: #1788FB"
            :style="
              scope.row.unuseNum != 0
                ? { cursor: 'pointer', 'text-decoration': 'underline' }
                : ''
            "
            @click="jumpToUnused(scope.row)"
            >{{ scope.row.unuseNum }}</span
          >
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
export default {
  name: "spresAll",
  data() {
    return {
      loading: false,
      totalPage: 1,
      limit: 10,
      currentPage: 1,
      tableData: [] //申请列表
    };
  },
  methods: {
    //导出
    download() {
      this.loading = true;
      const data = [["资源类型", "总量", "使用", "未使用"]];
      this.tableData.forEach(t => {
        data.push([t.name, t.allNum, t.useingNum, t.unuseNum]);
      });
      try {
        this.common.exportExcel(data, "科教资源使用.xlsx");
        setTimeout(() => {
          this.loading = false;
        }, 3000);
      } catch (e) {
        this.loading = false;
      }
    },
    // 跳转
    jumpToUnused(row) {
      if (row.allNum != 0) {
        this.$router.push({
          path: `/spresUnusedList/${row.id}`,
          query: {
            typeName: row.name
          }
        });
      }
    },

    //分页点击
    getCurrentChange(currentPage) {
      this.currentPage = currentPage;
      this.getList(currentPage);
    },

    //获取列表
    getList(page) {
      this.loading = true;
      this.util
        .postAjax({
          code: this.global.code,
          url: "/data/eduResUseOverview"
          // isRep: true,
          // data: {
          //   sort: 'desc',
          //   orderBy: 'name'
          // }
        })
        .then(res => {
          this.loading = false;
          if (res && res.success == true) {
            let tmp = res.data || [];
            this.tableData = tmp || tmp.sort((a, b) => {
              return typeof a.name === 'string' && typeof b.name === 'string' && a.name.localeCompare(b.name, "zh-Hans-CN");
            });
            this.totalPage = res.total;
          }
        });
    }
  },
  created() {
    this.getList(this.currentPage);
  }
};
</script>

<style scoped lang="scss">
.head {
  display: flex;
  align-items: center;
  span {
    height: 14px;
    font-size: 18px;
    font-family: PingFangSC-Medium, PingFang SC;
    font-weight: 500;
    color: #383a48;
    line-height: 14px;
    margin-right: auto;
  }
}
</style>
