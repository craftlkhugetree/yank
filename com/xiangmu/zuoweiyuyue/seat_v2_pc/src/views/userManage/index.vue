<template>
  <div class="main-div" ref="mainDiv">
    <div class="base-search-table" style="overflow: auto;">
      <div class="search-box clearfix">
        <h3>用户列表</h3>
        <!---------------------------- 查询条件 ---------------------------->
        <div class="search-box-right">
          <el-input
            class="input-box"
            v-model="keyword"
            placeholder="请输入学号"
            size="middle"
            clearable
            @clear="getTableData(1,pageSize)"
            @keyup.enter.native="getTableData(1,pageSize)"
            style=" margin-right:40px"
          >
            <el-button slot="append" icon="el-icon-search" @click="getTableData(1,pageSize)"></el-button>
          </el-input>

          <div style="display:inline-block;">
            <el-button
              style="margin-right:16px;"
              size="middle"
              icon="el-icon-upload2"
              @click="upload"
            >导入</el-button>
            <el-divider direction="vertical"></el-divider>
            <el-button
              style="margin-left:16px;"
              type="primary"
              size="middle"
              icon="el-icon-download"
              @click="downloadTemp"
            >下载模板</el-button>
          </div>
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
          <el-table-column prop="NAME" label="姓名" :formatter="common.defaultFormat"></el-table-column>
          <el-table-column prop="LOGINNAME" label="学号" :formatter="common.defaultFormat"></el-table-column>
          <el-table-column prop="ORGNAME" label="学院/专业" :formatter="common.defaultFormat"></el-table-column>
          <el-table-column label="操作" align="center">
            <template slot-scope="scope">
              <span @click.stop="deleteUser(scope.row)">删除</span>
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
        <p>暂无用户信息</p>
      </div>
    </div>
    <!-- ----------------------- 上传组件 ----------------------- -->
    <upload
      v-show="false"
      :multiple="false"
      :size="51200"
      exts="xls|XLS|xlsx|XLSX"
      @done="uploaded"
      @choose="loading=true"
      :url="uploadUrl"
      ref="upload"
    ></upload>
    <!-- :extraParams="extraParams" -->
  </div>
</template>

<script>
import upload from "@/components/BaseUpload";
import { getUserGroups, simpleDel } from "@/api/admin/user";

export default {
  components: {
    upload
  },
  data() {
    return {
      loading: false,
      keyword: null,
      tableData: [],
      total: 0,
      pageSize: 10,
      currentPage: 1,
      uploadUrl: window.g.authUrl + "rest/Data/handleSeatTemplate"
    };
  },

  methods: {
    // 下载模板
    downloadTemp() {
      let url = `${window.g.authUrl}rest/Data/getSeatUserTemplate`;
      window.open(url, "_blank");
    },
    // 上传
    upload() {
      this.$refs.upload.toupload();
    },
    // 上传完成
    uploaded(res) {
      this.loading = false;
      if (res.success) {
        let data = "";
        if (res.errorNum > 0) {
          data =
            "\n" +
            "其中" +
            res.errorInfoArr
              .map(i => {
                return `第${i.line}行${i.info}`;
              })
              .join("；\n") +
            "。";
        }
        this.$confirm(
          `本次成功导入用户${res.addNum + res.updateNum}人，失败${
            res.errorNum
          }人。${data}`,
          "导入完成",
          {
            confirmButtonText: "确定",
            showCancelButton: false,
            type: "success"
          }
        );
        this.getTableData(1, this.pageSize);
      } else {
        this.$message({
          showClose: true,
          message: "导入失败！",
          type: "error"
        });
      }
    },
    // 获取用户
    getTableData(page, pageSize) {
      this.loading = true;
      let data = {
        filter: JSON.stringify({
          STATUS: "1",
          KEYWORD: this.keyword
        }),
        page: page || 1,
        limit: pageSize || this.pageSize
      };
      getUserGroups(data)
        .then(res => {
          this.loading = false;
          this.tableData = res.items;
          this.total = res.total;
          this.currentPage = page;
        })
        .catch(err => {
          this.loading = false;
        });
    },

    //删除用户
    deleteUser(row) {
      let names = row.NAME || "";
      this.$confirm(`是否确认将『 ${names} 』删除？`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.loading = true;
          let data = {
            id: row.ID
          };
          simpleDel(data)
            .then(res => {
              this.loading = false;
              if (res.success) {
                this.$message({
                  showClose: true,
                  type: "success",
                  message: "删除成功！"
                });
                this.getTableData(1, this.pageSize);
              } else {
                this.$message({
                  showClose: true,
                  type: "error",
                  message: "删除失败！" + res.data.message
                });
              }
            })
            .catch(err => {
              this.loading = true;
              this.$message({
                showClose: true,
                type: "error",
                message: "删除失败！" + err
              });
            });
        })
        .catch(() => {
          return;
        });
    }
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
.base-search-table {
  padding: 0;
  background: #fff;
}
</style>