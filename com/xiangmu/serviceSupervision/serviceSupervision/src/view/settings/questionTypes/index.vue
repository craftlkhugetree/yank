<template>
  <div class="base-search-table">
    <div class="search-box clearfix">
      <h3>问题分类</h3>
      <!---------------------------- 查询条件 ---------------------------->
      <div class="search-box-right">
        <el-input class="input-box" v-model="keyword" placeholder="请输入名称" size="small" clearable></el-input>
        <el-button
          type="primary"
          size="small"
          icon="el-icon-search"
          @click="getTableData(1,pageSize)"
        >查询</el-button>
        <el-divider direction="vertical"></el-divider>
        <el-button
          class="orange-btn"
          type="primary"
          size="small"
          icon="el-icon-plus"
          @click="dialogVisible=true"
        >新增</el-button>
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
        <el-table-column prop="name" label="问题分类" show-overflow-tooltip></el-table-column>
        <el-table-column label="操作" align="center" width="190">
          <template slot-scope="scope">
            <div class="more-span">
              <span @click="editType(scope.row)">编辑</span>
              <span @click="deleteType(scope.row)">删除</span>
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
        @size-change="size => getTableData(currentPage, size)"
      ></el-pagination>
    </div>

    <!---------------------------- 弹窗 ---------------------------->
    <el-dialog
      class="base-dialog"
      :title="title"
      :visible.sync="dialogVisible"
      :close-on-click-modal="false"
      width="400px"
      @close="cancelDialog"
    >
      <el-form ref="editForm" :model="editForm" :rules="rules">
        <el-form-item prop="name" label="问题分类">
          <el-input v-model="editForm.name" placeholder="请输入问题分类"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer">
        <el-button type="primary" size="small" @click="saveType">提交</el-button>
        <el-button size="small" @click="dialogVisible=false">取消</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      keyword: null,
      tableData: [],
      loading: false,
      total: 0,
      pageSize: 10,
      currentPage: 1,
      title: "新增问题分类",
      dialogVisible: false,
      editForm: {
        id: null,
        name: null
      },
      rules: {
        name: [{ required: true, message: "请输入问题分类", trigger: "change" }]
      }
    };
  },
  computed: {
    // 用户orgid
    orgid() {
      let userInfo = this.$store.state.userInfo || {}
      return userInfo.ORGID;
    }
  },
  methods: {
    // 获取数据
    getTableData(page, pageSize) {
      this.loading = true;
      this.util
        .postAjax({
          code: this.global.code,
          url: "questtype/pageQuery",
          isRep: true,
          data: {
            filter: {
              name: this.keyword
            },
            limit: pageSize,
            page: page
          }
        })
        .then(res => {
          this.loading = false;
          if (res.success) {
            this.tableData = res.data || [];
            this.total = res.total || 0;
          }
          this.currentPage = page;
          this.pageSize = pageSize;
        })
        .catch(err => {
          this.loading = false;
        });
    },
    // 删除
    deleteType(row) {
      this.$confirm(`是否确认删除该分类？`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.loading = true;
          this.util
            .postAjax({
              code: this.global.code,
              url: "questtype/delete",
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
    // 编辑
    editType(row) {
      this.editForm.id = row.id;
      this.editForm.name = row.name;
      this.title = "编辑问题分类";
      this.dialogVisible = true;
    },
    // 关闭弹窗
    cancelDialog() {
      this.$refs.editForm.resetFields();
      this.editForm = {
        id: null,
        name: null
      };
      this.title = "新增问题分类";
    },
    // 提交
    saveType() {
      this.$refs.editForm.validate(valid => {
        if (valid) {
          this.loading = true;
          this.util
            .postAjax({
              code: this.global.code,
              url: "questtype/save",
              isRep: true,
              data: {
                id: this.editForm.id,
                name: this.editForm.name,
                orgid: this.orgid
              }
            })
            .then(res => {
              this.loading = false;
              if (res.success) {
                this.$message({
                  showClose: true,
                  type: "success",
                  message: "提交成功！"
                });
                this.dialogVisible = false;
                this.getTableData(1,this.pageSize);
              } else {
                this.$message({
                  showClose: true,
                  type: "error",
                  message: "提交失败：" + res.data.message
                });
              }
            })
            .catch(err => {
              this.loading = false;
              this.$message({
                showClose: true,
                type: "error",
                message: "提交失败：" + err
              });
            });
        }
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