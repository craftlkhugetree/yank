<template>
  <div class="main-div" ref="mainDiv">
    <div class="base-search-table">
      <div class="search-div">
        <span class="title">预约规则列表</span>
        <!---------------------------- 查询条件 ---------------------------->
        <div class="btn-right">
          <el-button type="primary" size="middle" icon="el-icon-plus" @click="handleUpdate">新增</el-button>
        </div>
      </div>
      <!---------------------------- 表格 ---------------------------->
      <el-table
        ref="roleTable"
        :data="tableData"
        style="padding-top:0px"
        row-key="id"
        header-row-class-name="table-header"
        v-loading="loading"
        :highlight-current-row="true"
        :row-style="{height:'10px'}"
        :cell-style="{padding:'26px 0px'}"
        empty-text=" "
        @sort-change="sortChange"
      >
        <el-table-column prop="name" label="规则名称"></el-table-column>
        <el-table-column
          prop="createtime"
          label="创建时间"
          sortable="custom"
          :formatter="common.allTimeFormat"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column label="操作" align="center" width="300">
          <template slot-scope="scope">
            <span @click.stop="handleLook(scope.row)">查看</span>
            <span v-if="scope.row.CODE !=='default'" @click.stop="handleUpdate(scope.row)">编辑</span>
            <span v-if="scope.row.CODE !=='default'" @click.stop="handleDelete(scope.row)">删除</span>
          </template>
        </el-table-column>
      </el-table>

      <!---------------------------- 分页 ---------------------------->
      <div class="pagination-box" v-if="total > 0">
        <el-pagination
          background
          :hide-on-single-page="true"
          layout="sizes, prev, pager, next,jumper"
          :total="total"
          :page-size="pageSize"
          :page-sizes="[10,20,50,100]"
          :current-page.sync="currentPage"
          @current-change="page => getTableData(page, pageSize)"
          @size-change="size => {pageSize = size; getTableData(1, size)}"
        ></el-pagination>
      </div>
      <!---------------------------- 无数据 ---------------------------->
      <div class="nodata" v-if="total == 0">
        <img src="@/assets/img/nofind.png" alt />
        <p>暂无预约规则信息</p>
      </div>
    </div>
    <look-dialog class="fixed-dialog" ref="lookDialog"></look-dialog>
  </div>
</template>

<script>
import { fetchRuleList, deleteRule } from "@/api/manage/rule";
import lookDialog from "./lookDialog";
export default {
  components: { lookDialog },
  data() {
    return {
      loading: false,
      tableData: [],
      loading: false,
      keyword: null,
      tableData: [],
      total: 0,
      pageSize: 10,
      currentPage: 1,
      orderBy: "",
      sort: ""
    };
  },
  mounted() {
    this.getTableData();
  },
  methods: {
    sortChange(column, prop, order) {
      if (column.prop == null || column.order == null) {
        this.orderBy = "";
        this.sort = "";
      } else {
        this.orderBy = column.prop;
        this.sort = column.order.replace(/ending/gi, "");
      }
      this.getTableData();
    },

    // 获取用户
    getTableData(page, pageSize) {
      this.loading = true;
      let data = {
        orderBy: this.orderBy,
        sort: this.sort, //asc
        page: page || 1,
        limit: pageSize || this.pageSize
      };
      fetchRuleList(data)
        .then(res => {
          this.loading = false;
          this.tableData = res.data;
          this.total = res.total;
          this.currentPage = page;
        })
        .catch(err => {
          this.loading = false;
        });
    },

    //查看
    handleLook(row) {
      let lookDialog = this.$refs.lookDialog;
      lookDialog.dialogVisible = true;
      lookDialog.row = row;
      if (row.id) {
        lookDialog.getDetail();
      }
    },

    //新增、编辑
    handleUpdate(rule) {
      let id = rule.id ? rule.id : "create";

      this.$router.push(`/rule-manage/rules/update/${id}`);
    },

    handleDelete(rule) {
      this.$confirm(`确认删除该预约规则吗?`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          let param = {
            id: rule.id
          };
          deleteRule(param).then(res => {
            if (res.success) {
              this.$message({
                type: "success",
                message: "删除成功！"
              });
              this.getTableData();
            } else {
              this.$message({
                type: "error",
                message: "删除失败：" + res.data.message
              });
            }
          });
        })
        .catch(err => {});
    }
  }
};
</script>

<style lang="scss" scoped>
.main-div {
  width: 100%;
  height: 100%;
  min-height: 800px;
  margin: 0 auto;
  padding: 0;
  background: #fff;
}
.search-div {
  line-height: 80px;
  height: 80px;
  .title {
    margin-left: 24px;
    // margin-top: 24px;
    font-weight: 500;
    color: #333333;
    font-size: 16px;
  }
  .btn-right {
    float: right;
    margin-right: 24px;
  }
}
</style>