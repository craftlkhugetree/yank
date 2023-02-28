<template>
  <div class="base-search-table">
    <div class="search-box clearfix">
      <h3>维修单位</h3>
      <!---------------------------- 查询条件 ---------------------------->
      <div class="search-box-right">
        <el-input
          class="input-box"
          v-model="keyword"
          placeholder="请输入维修单位名称"
          size="small"
          clearable
          style="width:200px;"
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
          @click="openDrawer('add')"
        >新增</el-button>
        <!-- <el-button class="orange-btn" type="primary" size="small" plain>导入</el-button> -->
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
        <el-table-column prop="NAME" label="维修单位" show-overflow-tooltip></el-table-column>
        <el-table-column prop="users" label="人员" show-overflow-tooltip>
          <template slot-scope="scope">{{scope.row.users.map(i => i.NAME).join(",")}}</template>
        </el-table-column>
        <el-table-column label="操作" align="center" width="220">
          <template slot-scope="scope">
            <div class="more-span">
              <span @click="openDrawer('edit',scope.row)">编辑</span>
              <span v-if="scope.row.ISLOCK != '1'" @click="deleteRow(scope.row)">删除</span>
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
      <el-form
        ref="editForm"
        :model="editForm"
        :rules="rules"
        style="padding:30px;"
        label-width="100px"
        label-position="right"
      >
        <el-form-item label="维修单位：" prop="name">
          <el-input v-model="editForm.name" placeholder="请输入" size="small" style="width:360px;"></el-input>
        </el-form-item>
        <el-form-item prop="users" label="人员：">
          <el-select
            v-model="editForm.users"
            multiple
            filterable
            remote
            placeholder="请输入姓名或工号"
            :remote-method="remoteMethod"
            :loading="userloading"
            style="width:360px"
            value-key="ID"
            size="small"
          >
            <el-option
              v-for="item in userList"
              :key="item.ID"
              :label="item.NAME"
              :value="{ID:item.ID,NAME:item.NAME}"
            >
              <span>{{item.NAME}}{{ item.LOGINNAME ? '--' + item.LOGINNAME : ''}}</span>
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div class="drawer-footer">
        <el-button type="primary" size="small" @click="doSubmit">提交</el-button>
        <el-button size="small" @click="drawer = false">取消</el-button>
      </div>
    </el-drawer>
  </div>
</template>

<script>
export default {
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
        name: null,
        users: []
      },
      rules: {
        name: [
          { required: true, message: "请输入维修单位", trigger: "change" }
        ],
        users: [{ required: true, message: "请选择管理员", trigger: "change" }]
      },
      userloading: false,
      userList: [] // 用户列表
    };
  },
  methods: {
    // 打开弹窗
    openDrawer(type, row) {
      this.drawerTitle = type === "add" ? "新增" : `编辑-${row.NAME}`;
      if (row) {
        this.editForm.id = row.ID;
        this.editForm.name = row.NAME;
        this.editForm.users = row.users;
        this.userList = [].concat(this.editForm.users);
      }
      this.drawer = true;
    },

    // 搜索用户列表
    remoteMethod(query) {
      if (query) {
        this.userloading = true;
        this.api
          .getUserList(1, query)
          .then(res => {
            this.userloading = false;
            this.userList = res.items;
          })
          .catch(err => {
            this.userloading = false;
            this.userList = [];
          });
      } else {
        this.userList = [];
      }
    },
    // 关闭弹窗
    closeDrawer() {
      this.$refs.editForm.resetFields();
      this.editForm = {
        id: null,
        name: null,
        users: []
      };
    },
    // 提交
    doSubmit() {
      this.$refs.editForm.validate(valid => {
        if (valid) {
          this.drawerLoading = true;
          this.util
            .postAjax({
              code: this.global.authCode,
              url: "rest/UserGroup/saveGroup2Users",
              data: {
                data: JSON.stringify({
                  ID: this.editForm.id,
                  APPID: "9100002njit",
                  NAME: this.editForm.name,
                  users: this.editForm.users.map(i => i.ID)
                }),
                oneGroup: "1" // 用户只能存在于一个维修单位
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
                let msg = "";
                if (res.data.code == "2") {
                  let users = res.data.users || [];
                  let names = users.map(i => i.NAME).join(",");
                  msg = "用户" + names + "已存在于其他维修单位";
                } else {
                  msg = res.data.message;
                }
                this.$message({
                  showClose: true,
                  type: "error",
                  message: `提交失败！` + msg
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
      this.$confirm(`是否确认删除该维修单位？`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.loading = true;
          this.util
            .postAjax({
              code: this.global.authCode,
              url: "rest/UserGroup/deleteGroup",
              data: {
                ID: row.ID,
                strict: "0" // 存在用户的时候也可以删除
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
          code: this.global.authCode,
          url: "rest/UserGroup/getList",
          data: {
            filter: JSON.stringify({
              APPID: "9100002njit",
              NAME: this.keyword
            }),
            limit: pageSize || this.pageSize,
            page: page || 1,
            withUser: "1", // 需要返回该维修单位的用户
            ISDELETE: "0"
          }
        })
        .then(res => {
          this.loading = false;
          if (res.success) {
            this.tableData = res.items || [];
            // 转换数据
            this.tableData.forEach(i => {
              let arr = i.userinfos ? i.userinfos.split(",") : [];
              i.users = arr.map(j => {
                return {
                  ID: j.split("|")[0],
                  NAME: j.split("|")[1]
                };
              });
            });
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

<style lang="scss" scoped>
.base-search-table {
  min-height: 800px;
}
</style>