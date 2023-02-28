<template>
  <div class="base-search-table">
    <div class="search-box clearfix">
      <h3>维修工</h3>
      <!---------------------------- 查询条件 ---------------------------->
      <div class="search-box-right">
        <el-input
          class="input-box"
          v-model="keyword"
          placeholder="请输入名称"
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
        <el-table-column prop="NAME" label="维修工" width="200" show-overflow-tooltip></el-table-column>
        <el-table-column prop="DEPT" label="维修单位" show-overflow-tooltip></el-table-column>
        <el-table-column prop="PHONE" label="联系电话" show-overflow-tooltip></el-table-column>
        <el-table-column prop="LOGINNAME" label="登录账号" show-overflow-tooltip></el-table-column>
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
      <el-form
        ref="editForm"
        :model="editForm"
        :rules="rules"
        style="padding:30px;"
        label-width="100px"
        label-position="right"
      >
        <el-form-item label="维修工" prop="name">
          <el-input v-model="editForm.name" placeholder="请输入姓名" size="small" style="width:300px;"></el-input>
        </el-form-item>
        <el-form-item label="联系电话" prop="mobile">
          <el-input v-model="editForm.mobile" placeholder="请输入联系电话" style="width:300px;"></el-input>
        </el-form-item>
        <el-form-item label="登录账号" prop="loginname">
          <el-input v-model="editForm.loginname" placeholder="请输入登录账号" style="width:300px;"></el-input>
        </el-form-item>
        <el-form-item label="登录密码" prop="pwd">
          <el-input v-model="editForm.pwd" placeholder="请输入登录密码" style="width:300px;"></el-input>
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
        mobile: null,
        loginname: null,
        pwd: null
      },
      rules: {
        name: [{ required: true, message: "请输入维修工", trigger: "change" }],
        mobile: [
          {
            required: false,
            pattern: /^1\d{10}$/,
            trigger: "change",
            message: "请输入正确的手机号码"
          }
        ],
        loginname: [
          { required: true, message: "请输入登录账号", trigger: "change" }
        ],
        pwd: [{ required: true, message: "请输入登录密码", trigger: "change" }]
      },
      uploadUrl: window.g.authUrl + "rest/Data/handleNjitwxgTemplate",
      extraParams: {
        ROLEID: "9100002njit-4"
      }
    };
  },
  methods: {
    // 下载模板
    downloadTemp() {
      let url = `${window.g.authUrl}rest/Data/getUserTemplate?modelType=njitwxg`;
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
          message: "导入失败，数据有误！",
          type: "error"
        });
      }
    },

    // 打开弹窗
    openDrawer(type, row) {
      this.drawerTitle = type === "add" ? "新增维修工" : `编辑-${row.NAME}`;
      if (row) {
        this.editForm.id = row.ID;
        this.editForm.name = row.NAME;
        this.editForm.mobile = row.PHONE;
        this.editForm.loginname = row.LOGINNAME;
        this.editForm.pwd = row.PWD;
      }
      this.drawer = true;
    },

    // 关闭弹窗
    closeDrawer() {
      this.$refs.editForm.resetFields();
      this.editForm = {
        id: null,
        name: null,
        mobile: null,
        loginname: null,
        pwd: null
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
              url: "rest/User/simpleSave",
              data: {
                d: JSON.stringify({
                  ID: this.editForm.id,
                  LOGINNAME: this.editForm.loginname,
                  NAME: this.editForm.name,
                  PWD: this.editForm.pwd,
                  PHONE: this.editForm.mobile,
                  ISINSCHOOL: "0",
                  ROLEID: "9100002njit-4"
                })
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
      this.$confirm(`是否确认删除该维修工？`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.loading = true;
          this.util
            .postAjax({
              code: this.global.authCode,
              url: "rest/User/simpleSave",
              data: {
                d: JSON.stringify({ ID: row.ID, STATUS: "0" })
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
          url: "rest/User/simpleList",
          data: {
            filter: JSON.stringify({
              KEYWORD: this.keyword,
              ISINSCHOOL: "0", // 固定必传
              ROLEID: "9100002njit-4", // 固定必传
              STATUS: "1" // 固定必传
            }),
            appid: this.$store.state.GROUPID,
            withUserGroup: "1", // 需要用户的维修单位
            limit: pageSize || this.pageSize,
            page: page || 1
          }
        })
        .then(res => {
          this.loading = false;
          if (res.success) {
            this.tableData = res.items || [];
            this.tableData.forEach(i => {
              let groups = i.groups || [];
              i.DEPT = groups.map(j => j.NAME).join(",") || "--";
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
.select-label {
  font-size: 16px;
  color: rgba(0, 0, 0, 0.65);
  font-weight: 500;
}
</style>