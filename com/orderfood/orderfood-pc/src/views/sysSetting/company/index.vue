<template>
  <div class="base-search-table">
    <div class="search-box clearfix" style="padding: 15px 20px 0;">
      <h3>企业管理</h3>
      <!---------------------------- 查询条件 ---------------------------->
      <div class="search-box-right">
        <el-input
          class="input-box"
          v-model="keyword"
          placeholder="请输入企业名称"
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
        <el-table-column prop="name" label="企业名称" show-overflow-tooltip min-width="240">
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
        <el-table-column prop="status" label="是否启用">
          <template slot-scope="scope">
            <div class="switch-div" v-if="scope.row.id">
              <el-switch
                :ref="`elSwitch-${scope.$index}`"
                v-model="scope.row.status"
                active-color="#3F86F7"
                active-value="1"
                inactive-color="#c3c3c3"
                inactive-value="0"
                :width="62"
                @change="changeStatus(scope.row)"
              ></el-switch>
              <span
                class="switch-text left"
                v-if="scope.row.status == '1'"
                @click="$refs[`elSwitch-${scope.$index}`].handleChange()"
              >启用</span>
              <span
                class="switch-text right"
                v-else
                @click="$refs[`elSwitch-${scope.$index}`].handleChange()"
              >不启用</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" width="280">
          <template slot-scope="scope">
            <div v-if="!scope.row.isEdit">
              <span @click="scope.row.isEdit = true">编辑</span>
              <span @click="deleteRow(scope.row)">删除</span>
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
import {
  fetchCompanyList,
  saveCompany,
  deleteCompany,
  changeCompanyStatus
} from "@/api/admin/company";
import upload from "@/components/BaseUpload";
export default {
  components: {
    upload
  },
  data() {
    return {
      loading: false,
      uploadUrl: window.g.url + "company/handleTemplate",
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
      let url = `${window.g.url}company/downloadTemplate`;
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
        if (res.data.code == "1") {
          let err = res.data.errorInfo;
          this.$message({
            showClose: true,
            message: "导入失败！" + err,
            type: "error"
          });
        } else {
          this.$message({
            showClose: true,
            message: "导入成功！",
            type: "success"
          });
          this.getTableData(1, this.pageSize);
        }
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
        isEdit: true,
        status: "1"
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
            name: row.editName,
            status: row.status
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

    // 改变状态
    changeStatus(row) {
      let flag = row.status;
      row.status = flag == "0" ? "1" : "0"; // 之前的值
      let message = flag == "0" ? "不启用" : "启用";
      let msg = `是否确认${message}该企业？`;
      let shops = row.shops || [];
      if (message == "不启用" && shops.length > 0) {
        msg = `企业『 ${row.name} 』已是餐厅的所属企业，不启用该企业将同时删除对应餐厅的所属企业，是否确认不启用？`
      }
      this.$confirm(msg, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(res => {
          let data = {
            id: row.id,
            name: row.name,
            status: flag
          };
          this.doSave(data);
        })
        .catch(() => {
          return;
        });
    },

    // 保存
    doSave(params) {
      this.loading = true;
      saveCompany(params)
        .then(res => {
          this.loading = false;
          if (res.success) {
            this.$message({
              showClose: true,
              type: "success",
              message: `保存成功！`
            });
            this.getTableData(this.currentPage, this.pageSize);
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
      let msg = `是否确认删除企业『 ${row.name} 』？`;
      let shops = row.shops || [];
      if (shops.length > 0) {
        msg = `企业『 ${row.name} 』已是餐厅的所属企业，删除该企业将同时删除对应餐厅的所属企业，是否确认删除？`
      }
      this.$confirm(msg, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.loading = true;
          let data = {
            id: row.id
          };
          deleteCompany(data)
            .then(res => {
              this.loading = false;
              if (res.success) {
                this.$message({
                  showClose: true,
                  type: "success",
                  message: `删除成功！`
                });
                this.getTableData(this.currentPage, this.pageSize);
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
    getTableData(page, pageSize) {
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
      fetchCompanyList(param)
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
    this.getTableData(this.currentPage, this.pageSize);
  }
};
</script>

<style lang="scss" scoped>
.base-search-table {
  min-height: 800px;
  padding-bottom: 20px;
}
.switch-div {
  position: relative;
  .switch-text {
    position: absolute;
    color: #ffffff !important;
    font-size: 12px;
    &.left {
      left: 6px;
      top: 0;
    }
    &.right {
      left: 20px;
      top: 0;
    }
  }
}
</style>
<style lang="scss">
.el-input.is-error .el-input__inner {
  border-color: #f56c6c;
}
.el-switch {
  .el-switch__core {
    height: 22px;
    &::after {
      top: 2px;
    }
  }
}
</style>