<template>
  <div class="main-div" ref="mainDiv">
    <div class="base-search-table" style="overflow: auto;">
      <div class="search-box clearfix">
        <h3>规章制度列表</h3>
        <!---------------------------- 查询条件 ---------------------------->
        <div class="search-box-right">
          <el-input
            class="input-box"
            v-model="keyword"
            placeholder="请输入名称"
            size="middle"
            clearable
            @clear="getTableData(1,pageSize)"
            @keyup.enter.native="getTableData(1,pageSize)"
            style=" margin-right:20px"
          >
            <el-button slot="append" icon="el-icon-search" @click="getTableData(1,pageSize)"></el-button>
          </el-input>
          <el-button type="primary" size="middle" icon="el-icon-plus" @click="handleUpdate">新增</el-button>
        </div>
      </div>
      <!---------------------------- 表格 ---------------------------->
      <div class="table-content">
        <el-table
          :data="tableData"
          style="width:100%"
          header-row-class-name="table-header"
          v-loading="loading"
          :row-style="{height:'10px'}"
          :cell-style="{padding:'26px 0px'}"
          empty-text=" "
        >
          <el-table-column prop="name" label="规章制度名称" show-overflow-tooltip></el-table-column>
          <el-table-column prop="version" label="版本号" show-overflow-tooltip></el-table-column>
          <el-table-column prop="isrelease" label="状态">
            <template slot-scope="scope">{{scope.row.status=='1'?'已启用':'未启用'}}</template>
          </el-table-column>
          <el-table-column label="操作" align="center">
            <template slot-scope="scope">
              <span @click.stop="handleLook(scope.row)">查看</span>
              <el-divider direction="vertical"></el-divider>
              <span @click="handleUpdate(scope.row)">编辑</span>
              <el-divider direction="vertical"></el-divider>
              <span @click="handleDel(scope.row)">删除</span>
            </template>
          </el-table-column>
        </el-table>
      </div>
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
        <p>暂无规章制度信息</p>
      </div>
      <!---------------------------- 弹窗 ---------------------------->
      <update-dialog class="fixed-dialog" ref="updateDialog" @doFunc="getTableData(1,pageSize)"></update-dialog>
      <look-dialog class="fixed-dialog" ref="lookDialog"></look-dialog>
    </div>
  </div>
</template>

<script>
import { fetchRuleInfo, deleteRuleInfo } from "@/api/manage/ruleinfo";
import updateDialog from "./updateDialog";
import lookDialog from "./lookDialog";
export default {
  data() {
    return {
      loading: false,
      keyword: "",
      tableData: [],
      total: 0,
      pageSize: 10,
      currentPage: 1
    };
  },
  components: { updateDialog, lookDialog },
  computed: {},
  methods: {
    // 获取用户
    getTableData(page, pageSize) {
      this.loading = true;
      let data = {
        filter: {
          name: this.keyword
        },
        page: page || 1,
        limit: pageSize || this.pageSize
      };
      fetchRuleInfo(data)
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
    handleDel(row) {
      this.$confirm(`确认删除该规章制度吗?`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          let data = {
            id: row.id
          };
          deleteRuleInfo(data).then(res => {
            if (res.success) {
              this.$message({
                showClose: true,
                type: "success",
                message: "规章制度删除成功"
              });
              this.getTableData();
            } else {
              this.$message({
                showClose: true,
                type: "error",
                message: "制度删除失败" + res.data.message
              });
            }
          });
        })
        .catch(err => {});
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
    handleUpdate(row) {
      let updateDialog = this.$refs.updateDialog;
      updateDialog.dialogVisible = true;
      updateDialog.row = row;
      if (row.id) {
        updateDialog.getDetail();
      }
      updateDialog.title = row.id ? "编辑制度" : "新增制度";
    },

    lookUser(row) {}
  },
  mounted() {
    this.getTableData();
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
</style>