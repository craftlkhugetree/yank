<template>
  <div class="base-search-table">
    <div class="search-box clearfix" style="padding: 15px 20px 0;">
      <h3>楼宇管理</h3>
      <!---------------------------- 查询条件 ---------------------------->
      <div class="search-box-right">
        <el-input
          class="input-box"
          v-model="keyword"
          placeholder="请输入楼宇名称"
          size="small"
          clearable
          style="width:170px;"
          prefix-icon="el-icon-search"
          @clear="getTableData(1,pageSize)"
          @keyup.enter.native="getTableData(1,pageSize)"
        ></el-input>
        <el-button
          type="primary"
          size="small"
          icon="el-icon-search"
          @click="getTableData(1,pageSize)"
        >查询</el-button>
        <el-button type="primary" size="small" icon="el-icon-plus" @click="addRow">新增</el-button>
        <el-button class="white-btn" type="primary" size="small" plain @click="downloadTemp">下载模板</el-button>
        <el-button class="white-btn" type="primary" size="small" plain @click="upload">导入</el-button>
      </div>
    </div>
    <!---------------------------- 表格 ---------------------------->
    <div class="table-content">
      <el-table
        :data="tableData"
        style="width:100%;margin-top:10px;"
        header-row-class-name="table-header"
        v-loading="loading"
      >
        <el-table-column type="index" label="序号" show-overflow-tooltip width="80"></el-table-column>
        <el-table-column prop="name" label="楼宇名称" show-overflow-tooltip>
          <template slot-scope="scope">
            <el-input
              v-if="scope.row.isEdit"
              v-model="scope.row.editName"
              size="small"
              style="width:300px;"
              :class="{'is-error': !scope.row.editName}"
            ></el-input>
            <span v-else style="color:#606266;">{{scope.row.name}}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" width="250">
          <template slot-scope="scope">
            <div v-if="!scope.row.isEdit">
              <span @click="scope.row.isEdit = true" v-if="scope.row.source !== 'base'">编辑</span>
              <span @click="deleteRow(scope.row)" v-if="scope.row.source !== 'base'">删除</span>
              <span v-else style="color:#999;cursor:default;">--</span>
            </div>
            <div v-else>
              <span @click.stop="editRow(scope.row,true)">保存</span>
              <span @click.stop="editRow(scope.row,false,scope.$index)">取消</span>
            </div>
          </template>
        </el-table-column>
      </el-table>
      <!---------------------------- 分页 ---------------------------->
      <div class="pagination-box" v-if="total > 0">
        <el-pagination
          background
          layout="sizes, prev, pager, next"
          :total="total"
          :page-size="pageSize"
          :page-sizes="[5,10,15,20,50,100]"
          :current-page.sync="currentPage"
          @current-change="page => getTableData(page, pageSize)"
          @size-change="size => {pageSize = size; getTableData(1, size)}"
        ></el-pagination>
      </div>
    </div>
    <!------------------------- 上传组件 ------------------------->
    <upload
      v-show="false"
      :multiple="false"
      :size="5120"
      exts="xls|XLS|xlsx|XLSX"
      @done="uploaded"
      @choose="loading=true"
      :url="uploadUrl"
      ref="upload"
    ></upload>
  </div>
</template>

<script>
import { fetchBuildingList, saveBuilding, deleteBuilding } from "@/api/admin/building";
import upload from "@/components/BaseUpload";
export default {
  components: {
    upload
  },
  data() {
    return {
      loading: false,
      uploadUrl: window.g.url + "area/importData",
      keyword: null,
      tableData: [],
      total: 0,
      currentPage: 1,
      pageSize: 10
    };
  },
  methods: {
    // 下载模板
    downloadTemp() {
      let url = `${window.g.url}area/exportTemplate`;
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
        this.$message({
          showClose: true,
          message: "导入成功！",
          type: "success"
        });
        this.getTableData(1,this.pageSize);
      } else {
        this.$message({
          showClose: true,
          message: "导入失败！",
          type: "error"
        });
      }
    },
    // 新增
    addRow() {
      let obj = {
        id: null,
        name: null,
        editName: null,
        isEdit: true
      };
      this.tableData.push(obj);
    },

    // 编辑 （保存、取消）
    editRow(row, isSave, index) {
      if (isSave) {
        if (!row.editName) {
          return false;
        } else if (row.name == row.editName) {
          row.isEdit = false;
        } else {
          let params = {
            id: row.id,
            name: row.editName
          };
          this.doSave(params);
        }
      } else {
        row.isEdit = false;
        row.editName = row.name;
        if (!row.id) {
          this.tableData.splice(index, 1);
        }
      }
    },

    // 保存
    doSave(params) {
      this.loading = true;
      saveBuilding(params)
        .then(res => {
          this.loading = false;
          if (res.success) {
            this.$message({
              showClose: true,
              type: "success",
              message: `保存成功！`
            });
            this.getTableData(this.currentPage,this.pageSize);
          } else {
            this.$message({
              showClose: true,
              type: "error",
              message: `保存失败：${res.data.message}`
            });
          }
        })
        .catch(err => {
          this.loading = false;
          this.$message({
            showClose: true,
            type: "error",
            message: `保存失败：${err}`
          });
        });
    },

    // 删除
    deleteRow(row) {
      this.$confirm(`是否确认删除楼宇『 ${row.name} 』？`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.loading = true;
          let data = {
            id: row.id
          };
          deleteBuilding(data)
            .then(res => {
              this.loading = false;
              if (res.success) {
                this.$message({
                  showClose: true,
                  type: "success",
                  message: `删除成功！`
                });
                this.getTableData(this.currentPage,this.pageSize);
              } else {
                this.$message({
                  showClose: true,
                  type: "error",
                  message: `删除失败：${res.data.message}`
                });
              }
            })
            .catch(err => {
              this.loading = false;
              this.$message({
                showClose: true,
                type: "error",
                message: `删除失败：${err}`
              });
            });
        })
        .catch(() => {
          return;
        });
    },

    // 获取表格数据
    getTableData(page,pageSize) {
      this.loading = true;
      let param = {
        filter: {
          name: this.keyword || null
        },
        limit: pageSize,
        page: page || 1,
        sort: this.sort,
        orderBy: this.orderBy
      };
      fetchBuildingList(param)
        .then(res => {
          this.loading = false;
          if (res.success) {
            this.tableData = res.data || [];
            this.tableData.forEach(i => {
              this.$set(i, "isEdit", false);
              this.$set(i, "editName", i.name);
            });
            this.total = res.total;
            this.currentPage = page || 1;
          }
        })
        .catch(err => {
          this.loading = false;
        });
    }
  },
  created() {
    this.getTableData(this.currentPage,this.pageSize);
  }
};
</script>

<style lang="scss" scoped>
.base-search-table {
  min-height: 800px;
  padding-bottom: 20px;
  .el-table .cell span:not(:last-child) {
    margin-right: 40px !important;
  }
}
</style>
<style>
.el-input.is-error .el-input__inner {
  border-color: #f56c6c;
}
</style>