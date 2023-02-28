<template>
  <div class="base-search-table">
    <div class="search-box clearfix">
      <h3>快捷回复</h3>
      <!---------------------------- 查询条件 ---------------------------->
      <div class="search-box-right">
        <el-input
          class="input-box"
          v-model="keyword"
          placeholder="请输入标题"
          size="small"
          clearable
        ></el-input>
        <el-button
          type="primary"
          size="small"
          icon="el-icon-search"
          @click="getTableData(1, pageSize)"
          >查询</el-button
        >
        <el-divider direction="vertical"></el-divider>
        <el-button
          class="orange-btn"
          type="primary"
          size="small"
          icon="el-icon-plus"
          @click="dialogVisible = true"
          >新增</el-button
        >
      </div>
    </div>
    <!---------------------------- 表格 ---------------------------->
    <div class="table-content">
      <el-table
        :data="tableData"
        style="width: 100%"
        header-row-class-name="table-header"
        v-loading="loading"
      >
        <el-table-column
          type="index"
          label="序号"
          width="80"
          align="center"
        ></el-table-column>
        <el-table-column
          prop="deptname"
          label="部门"
          width="160"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column
          prop="title"
          label="标题"
          width="160"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column
          prop="content"
          label="回复"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column label="操作" align="center" width="190">
          <template slot-scope="scope">
            <div class="more-span">
              <span @click="editReply(scope.row)">编辑</span>
              <span @click="deleteReply(scope.row)">删除</span>
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
        :page-sizes="[5, 10, 15, 20]"
        :current-page.sync="currentPage"
        @current-change="(page) => getTableData(page, pageSize)"
        @size-change="(size) => getTableData(currentPage, size)"
      ></el-pagination>
    </div>

    <!---------------------------- 弹窗 ---------------------------->
    <el-dialog
      class="base-dialog"
      :title="title"
      :visible.sync="dialogVisible"
      :close-on-click-modal="false"
      width="600px"
      @close="cancelDialog"
    >
      <el-form ref="editForm" :model="editForm" :rules="rules">
        <el-form-item prop="deptid" label="部门">
          <el-select
            v-model="editForm.deptid"
            placeholder="请选择"
            style="width: 100%"
            @change="$forceUpdate()"
          >
            <el-option
              v-for="item in $store.state.userInfo.userOrgId"
              :key="item.ID"
              :label="item.NAME"
              :value="item.ID"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item prop="title" label="标题">
          <el-input
            v-model="editForm.title"
            placeholder="请输入标题"
          ></el-input>
        </el-form-item>
        <el-form-item prop="content" label="回复">
          <el-input
            type="textarea"
            v-model="editForm.content"
            placeholder="请输入内容，不超过200字"
            maxlength="200"
            resize="none"
            rows="5"
          ></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer">
        <el-button type="primary" size="small" @click="saveReply"
          >提交</el-button
        >
        <el-button size="small" @click="dialogVisible = false">取消</el-button>
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
      title: "新增快捷回复",
      dialogVisible: false,
      editForm: {
        id: null,
        title: null,
        content: null,
        deptid: null,
      },
      rules: {
        title: [{ required: true, message: "请输入标题", trigger: "change" }],
        content: [{ required: true, message: "请输入内容", trigger: "change" }],
        deptid: [{ required: true, message: "请选择部门", trigger: "change" }],
      },
    };
  },
  computed: {
    // 用户orgid
    orgid() {
      let userInfo = this.$store.state.userInfo || {};
      return userInfo.userOrgId;
    },
  },
  watch: {
    orgid() {
      this.getTableData(1, this.pageSize);
    },
  },
  methods: {
    // 获取数据
    getTableData(page, pageSize) {
      this.loading = true;
      let deptids = [];
      _.forEach(this.$store.state.userInfo.userOrgId, (data) => {
        deptids.push(data.ID);
      });
      this.util
        .postAjax({
          code: this.global.code,
          url: "quickanswer/pageQuery",
          isRep: true,
          data: {
            filter: {
              title: this.keyword,
              deptid: deptids.join(","),
            },
            limit: pageSize,
            page: page,
          },
        })
        .then((res) => {
          this.loading = false;
          if (res.success) {
            this.tableData = res.data || [];
            _.forEach(this.tableData, (data) => {
              if (data.deptid) {
                data.deptname = this.$store.state.departments[
                  _.findIndex(this.$store.state.departments, {
                    ID: data.deptid,
                  })
                ].NAME;
              }
            });
            this.total = res.total || 0;
          }
          this.currentPage = page;
          this.pageSize = pageSize;
        })
        .catch((err) => {
          this.loading = false;
        });
    },
    // 删除
    deleteReply(row) {
      this.$confirm(`是否确认删除该快捷回复？`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.loading = true;
          this.util
            .postAjax({
              code: this.global.code,
              url: "quickanswer/delete",
              data: {
                id: row.id,
              },
            })
            .then((res) => {
              this.loading = false;
              if (res.success) {
                this.$message({
                  showClose: true,
                  type: "success",
                  message: `删除成功！`,
                });
                this.getTableData(this.currentPage, this.pageSize);
              } else {
                this.$message({
                  showClose: true,
                  type: "error",
                  message: `删除失败：${res.data.message}`,
                });
              }
            })
            .catch((err) => {
              this.loading = false;
              this.$message({
                showClose: true,
                type: "error",
                message: `删除失败：${err}`,
              });
            });
        })
        .catch(() => {
          return;
        });
    },
    // 编辑
    editReply(row) {
      this.editForm.id = row.id;
      this.editForm.title = row.title;
      this.editForm.content = row.content;
      this.editForm.deptid = row.deptid;
      this.title = "编辑快捷回复";
      this.dialogVisible = true;
    },
    // 关闭弹窗
    cancelDialog() {
      this.$refs.editForm.resetFields();
      this.editForm = {
        id: null,
        title: null,
        content: null,
      };
      this.title = "新增快捷回复";
    },
    // 提交
    saveReply() {
      this.$refs.editForm.validate((valid) => {
        if (valid) {
          this.loading = true;
          this.util
            .postAjax({
              code: this.global.code,
              url: "quickanswer/save",
              isRep: true,
              data: {
                id: this.editForm.id,
                title: this.editForm.title,
                content: this.editForm.content,
                deptid: this.editForm.deptid,
              },
            })
            .then((res) => {
              this.loading = false;
              if (res.success) {
                this.$message({
                  showClose: true,
                  type: "success",
                  message: "提交成功！",
                });
                this.dialogVisible = false;
                this.getTableData(1, this.pageSize);
              } else {
                this.$message({
                  showClose: true,
                  type: "error",
                  message: "提交失败：" + res.data.message,
                });
              }
            })
            .catch((err) => {
              this.loading = false;
              this.$message({
                showClose: true,
                type: "error",
                message: "提交失败：" + err,
              });
            });
        }
      });
    },
  },
  created() {
    if (this.orgid) {
      this.getTableData(this.currentPage, this.pageSize);
    }
  },
};
</script>

<style>
</style>