<template>
  <div class="main-div" ref="mainDiv">
    <div class="base-search-table" style="overflow: auto;">
      <div class="search-box clearfix">
        <h3>公告列表</h3>
        <!---------------------------- 查询条件 ---------------------------->
        <div class="search-box-right">
          <el-input
            class="input-box"
            v-model="keyword"
            placeholder="请输入标题"
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
          <el-table-column prop="title" label="公告标题" show-overflow-tooltip width="300"></el-table-column>
          <el-table-column prop="content" label="内容" show-overflow-tooltip>
            <template slot-scope="scope">
              <div class="content">{{scope.row.content| filterHtml}}</div>
            </template>
          </el-table-column>
          <el-table-column prop="isrelease" label="状态" width="80">
            <template slot-scope="scope">{{scope.row.isrelease=='1'?'已发布':'未发布'}}</template>
          </el-table-column>
          <el-table-column label="操作" align="center" width="300">
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
        <p>暂无公告信息</p>
      </div>
      <!---------------------------- 弹窗 ---------------------------->
      <update-dialog class="fixed-dialog" ref="updateDialog" @doFunc="getTableData(1,pageSize)"></update-dialog>
      <look-dialog class="fixed-dialog" ref="lookDialog"></look-dialog>
    </div>
  </div>
</template>

<script>
import { fetchNotice, deleteNotice } from "@/api/manage/notice";
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
  //过滤掉html标签及空行
  filters: {
    filterHtml(val) {
      if (val) {
        val = val.replace(/<\/?[^>]*>/g, ""); //去除HTML tag
        val = val.replace(/&nbsp;/gi, "");
        val = val.replace(/[ | ]*\n/g, "\n"); //去除行尾空白
        val = val.replace(/\n[\s| | ]*\r/g, "\n"); //去除多余空行
        val = val.replace(/ /gi, ""); //去掉
      }
      return val;
    }
  },
  methods: {
    // 获取用户
    getTableData(page, pageSize) {
      this.loading = true;
      let data = {
        filter: {
          title: this.keyword
        },
        page: page || 1,
        limit: pageSize || this.pageSize
        // orderBy: "istop",
        // sort: "desc" //asc
      };
      fetchNotice(data)
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
      this.$confirm(`确认删除该通知公告吗?`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          let data = {
            id: row.id
          };
          deleteNotice(data).then(res => {
            if (res.success) {
              this.$message({
                showClose: true,
                type: "success",
                message: "通知公告删除成功"
              });
              this.getTableData();
            } else {
              this.$message({
                showClose: true,
                type: "error",
                message: "通知公告删除失败" + res.data.message
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
      updateDialog.title = row.id ? "编辑公告" : "新增公告";
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

.content {
  overflow: hidden;
  -webkit-box-orient: vertical;
  text-overflow: ellipsis;
}
</style>