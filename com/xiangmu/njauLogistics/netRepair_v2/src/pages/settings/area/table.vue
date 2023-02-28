<template>
  <div class="base-search-table">
    <div class="search-box clearfix">
      <h3>{{title}}</h3>
      <!---------------------------- 查询条件 ---------------------------->
      <div class="search-box-right">
        <el-input
          class="input-box"
          v-model="keyword"
          placeholder="请输入楼宇名称"
          size="small"
          clearable
          style="width:150px;margin-right:0;"
        ></el-input>
        <el-button
          type="primary"
          size="small"
          icon="el-icon-search"
          @click="getTableData(1,pageSize)"
          style="margin-right:-10px;padding:9px 10px;"
        >查询</el-button>
        <el-divider direction="vertical"></el-divider>
        <el-button
          class="orange-btn"
          type="primary"
          size="small"
          icon="el-icon-plus"
          @click="openDrawer('add')"
          style="margin-left:-10px;padding:9px 10px;"
        >新增</el-button>
        <el-button
          class="orange-btn"
          type="primary"
          size="small"
          plain
          style="margin-left:2px;padding:9px 10px;"
          @click="downloadTemp"
        >下载模板</el-button>
        <el-button
          class="orange-btn"
          type="primary"
          size="small"
          plain
          style="margin-left:2px;padding:9px 10px;"
          @click="upload"
        >导入</el-button>
      </div>
    </div>
    <!---------------------------- 表格 ---------------------------->
    <div class="table-content">
      <el-table
        :data="tableData"
        style="width:100%"
        header-row-class-name="table-header"
        v-loading="loading"
      >
        <el-table-column type="index" label="序号" width="80" align="center"></el-table-column>
        <el-table-column prop="name" label="楼宇名称" show-overflow-tooltip></el-table-column>
        <el-table-column label="操作" align="center" width="220">
          <template slot-scope="scope">
            <div class="more-span">
              <span @click="openDrawer('edit',scope.row)">编辑</span>
              <span @click="deleteRow(scope.row)">删除</span>
            </div>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!---------------------------- 分页 ---------------------------->
    <div class="pagination-box" v-if="total > 0">
      <el-pagination
        background
        layout="sizes, prev, pager, next"
        :total="total"
        :page-size="pageSize"
        :page-sizes="[5,10,15,20]"
        :current-page.sync="currentPage"
        @current-change="page => getTableData(page, pageSize)"
        @size-change="size => {pageSize = size; getTableData(1, size)}"
      ></el-pagination>
    </div>
    <!---------------------------- 弹窗 ---------------------------->
    <el-drawer
      class="base-drawer"
      :title="drawerTitle"
      :visible.sync="drawer"
      direction="rtl"
      :wrapperClosable="false"
      @close="closeDrawer"
      v-loading="drawerLoading"
      size="660"
    >
      <el-form ref="editForm" :model="editForm" style="padding:30px;">
        <el-form-item
          label="楼宇名称："
          prop="name"
          :rules="[{required: true,trigger:'change',message:'请输入楼宇名称'}]"
        >
          <el-input v-model="editForm.name" placeholder="请输入" size="small" style="width:300px;"></el-input>
        </el-form-item>
      </el-form>
      <div class="drawer-footer">
        <el-button type="primary" size="small" @click="doSubmit">提交</el-button>
        <el-button size="small" @click="drawer = false">取消</el-button>
      </div>
    </el-drawer>
    <!------------------------- 上传组件 ------------------------->
    <upload
      v-show="false"
      :multiple="false"
      :size="5120"
      exts="xls|XLS|xlsx|XLSX"
      @done="uploaded"
      @choose="loading=true"
      :url="uploadUrl"
      :extraParams="extraParams"
      ref="upload"
    ></upload>
  </div>
</template>

<script>
import upload from "../../../components/BaseUpload";
export default {
  components: {
    upload
  },
  props: {
    title: String,
    type: String // "1" 学生公寓， "2" 校园其他楼宇
  },
  computed: {
    extraParams() {
      let data = {
        type: this.type
      };
      return data;
    }
  },
  data() {
    return {
      loading: false,
      keyword: null,
      tableData: [],
      total: 0,
      pageSize: 10,
      currentPage: 1,
      drawer: false,
      drawerTitle: "",
      drawerLoading: false,
      editForm: {
        id: null,
        name: null
      },
      uploadUrl: window.g.url + "area/importData"
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
        this.getTableData();
      } else {
        this.$message({
          showClose: true,
          message: "导入失败！",
          type: "error"
        });
      }
    },
    // 打开弹窗
    openDrawer(type, row) {
      let oper = type === "add" ? "新增" : "编辑";
      this.drawerTitle = `${oper}${this.title}报修区域`;
      if (row) {
        this.editForm.id = row.id;
        this.editForm.name = row.name;
      }
      this.drawer = true;
    },
    // 关闭弹窗
    closeDrawer() {
      this.$refs.editForm.resetFields();
      this.editForm.id = null;
      this.editForm.name = null;
    },
    // 提交
    doSubmit() {
      this.$refs.editForm.validate(valid => {
        if (valid) {
          this.drawerLoading = true;
          this.util
            .postAjax({
              code: this.global.code,
              url: "area/save",
              isRep: true,
              data: {
                id: this.editForm.id,
                name: this.editForm.name,
                type: this.type
              }
            })
            .then(res => {
              this.drawerLoading = false;
              if (res.success) {
                this.$message({
                  showClose: true,
                  type: "success",
                  message: `提交成功！`
                });
                this.drawer = false;
                this.getTableData(this.currentPage, this.pageSize);
              } else {
                this.$message({
                  showClose: true,
                  type: "error",
                  message: `提交失败！` + res.data.message
                });
              }
            })
            .catch(err => {
              this.drawerLoading = false;
              this.$message({
                showClose: true,
                type: "error",
                message: `提交失败！` + err
              });
            });
        }
      });
    },

    // 删除
    deleteRow(row) {
      this.$confirm(`是否确认删除该区域？`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.loading = true;
          this.util
            .postAjax({
              code: this.global.code,
              url: "area/delete",
              data: {
                id: row.id
              }
            })
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
    // 获取数据
    getTableData(page, pageSize) {
      this.loading = true;
      this.currentPage = page;
      this.util
        .postAjax({
          code: this.global.code,
          url: "area/pageQuery",
          isRep: true,
          data: {
            filter: {
              name: this.keyword,
              type: this.type
            },
            limit: pageSize || this.pageSize,
            page: page || 1
          }
        })
        .then(res => {
          this.loading = false;
          if (res.success) {
            this.tableData = res.data || [];
            this.total = res.total || 0;
          } else {
            this.tableData = [];
            this.total = 0;
          }
        })
        .catch(err => {
          this.loading = false;
          this.tableData = [];
          this.total = 0;
        });
    }
  },
  created() {
    this.getTableData(this.currentPage, this.pageSize);
  }
};
</script>

<style>
</style>