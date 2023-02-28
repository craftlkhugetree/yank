<template>
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
    <div class="drawer-container">
      <div class="base-search-table">
        <div class="search-box clearfix">
          <!---------------------------- 查询条件 ---------------------------->
          <div class="search-box-right">
            <el-input
              class="input-box"
              v-model="keyword"
              placeholder="请输入名称"
              size="small"
              clearable
            ></el-input>
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
            <!-- <el-table-column type="index" label="序号" width="80" align="center"></el-table-column> -->
            <el-table-column prop="name" label="物品名称" show-overflow-tooltip>
              <template slot-scope="scope">
                <el-input v-if="scope.row.isEdit" v-model="scope.row.editName"></el-input>
                <span style="color:rgba(0,0,0,0.65)" v-else>{{scope.row.name}}</span>
              </template>
            </el-table-column>
            <el-table-column label="操作" align="center" width="190">
              <template slot-scope="scope">
                <div class="more-span" v-if="!scope.row.isEdit">
                  <span @click="scope.row.isEdit = true">编辑</span>
                  <span @click="deleteRow(scope.row)">删除</span>
                </div>
                <div class="more-span" v-else>
                  <span @click="editRow(scope.row,true)">保存</span>
                  <span @click="editRow(scope.row,false)">取消</span>
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
          append-to-body
          v-loading="loading"
        >
          <el-form ref="editForm" :model="editForm" :rules="rules">
            <el-form-item prop="name" label="物品名称">
              <el-input v-model="editForm.name" placeholder="请输入物品名称"></el-input>
            </el-form-item>
          </el-form>
          <span slot="footer">
            <el-button type="primary" size="small" @click="submitEditForm">提交</el-button>
            <el-button size="small" @click="dialogVisible=false">取消</el-button>
          </span>
        </el-dialog>
      </div>
    </div>
  </el-drawer>
</template>

<script>
export default {
  data() {
    return {
      faulttype: null,   // 维修类型
      goodsTypeId: null, // 物品类型id
      drawerTitle: "物品管理",
      drawer: false,
      drawerLoading: false,
      keyword: null,
      tableData: [],
      loading: false,
      total: 0,
      pageSize: 10,
      currentPage: 1,
      title: "新增物品",
      dialogVisible: false,
      editForm: {
        id: null,
        name: null
      },
      rules: {
        name: [{ required: true, message: "请输入物品名称", trigger: "change" }]
      },
      isChanged: false
    };
  },
  methods: {
    // 关闭drawer
    closeDrawer() {
      if (this.isChanged) {
        this.$emit("doFunc");
      }
    },
    // 关闭弹窗
    cancelDialog() {
      this.$refs.editForm.resetFields();
      this.editForm = {
        id: null,
        name: null
      };
    },
    // 获取物品列表
    getTableData(page, pageSize) {
      this.loading = true;
      this.util
        .postAjax({
          code: this.global.code,
          url: "item/pageQuery",
          isRep: true,
          data: {
            filter: {
              name: this.keyword,
              pid: this.goodsTypeId
            },
            limit: pageSize || this.pageSize,
            page: page || 1
          }
        })
        .then(res => {
          this.loading = false;
          if (res.success) {
            this.tableData = res.data || [];
            this.tableData.forEach(i => {
              this.$set(i, "isEdit", false);
              this.$set(i, "editName", i.name);
            });
            this.total = res.total || 0;
          }
          this.currentPage = page;
          this.pageSize = pageSize;
        })
        .catch(err => {
          this.loading = false;
        });
    },

    // 提交
    submitEditForm() {
      this.$refs.editForm.validate(valid => {
        if (valid) {
          let params = {
            pid: this.goodsTypeId,
            ...this.editForm,
            faulttype: this.faulttype
          };
          this.saveData(params, "提交");
        }
      });
    },
    // 编辑
    editRow(row, isSave) {
      if(!row.editName) {
        this.$message({
          showClose: true,
          type: "error",
          message: "请输入物品名称"
        });
        return;
      }
      if (isSave && (row.name !== row.editName || row.isuse !== row.editUse)) {
        let params = {
          pid: this.goodsTypeId,
          id: row.id,
          name: row.editName,
          faulttype: this.faulttype
        };
        this.saveData(params, "保存");
      } else {
        row.isEdit = false;
        row.editName = row.name;
      }
    },
    // 保存
    saveData(params, msg) {
      this.loading = true;
      this.util
        .postAjax({
          code: this.global.code,
          url: "item/save",
          isRep: true,
          data: params
        })
        .then(res => {
          this.loading = false;
          if (res.success) {
            this.$message({
              showClose: true,
              type: "success",
              message: `${msg}成功！`
            });
            this.dialogVisible = false;
            this.getTableData(this.currentPage, this.pageSize);
            this.isChanged = true;
          } else {
            this.$message({
              showClose: true,
              type: "error",
              message: `${msg}失败！` + res.data.message
            });
          }
        })
        .catch(err => {
          this.loading = false;
          this.$message({
            showClose: true,
            type: "error",
            message: `${msg}失败！` + err
          });
        });
    },
    // 删除
    deleteRow(row) {
      this.$confirm(`是否确认删除该物品？`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.loading = true;
          this.util
            .postAjax({
              code: this.global.code,
              url: "item/delete",
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
                this.isChanged = true;
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
    }
  }
};
</script>

<style lang="scss" scoped>
.dot-span {
  color: #606266 !important;
  &::before {
    display: inline-block;
    content: "";
    width: 6px;
    height: 6px;
    border-radius: 6px;
    background: #52c41a;
    margin-right: 8px;
    margin-bottom: 2px;
  }
  &.disabled::before {
    background: #ccc;
  }
}
</style>