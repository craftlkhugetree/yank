<template>
  <div class="main-div" ref="mainDiv">
    <div class="left-div base-search-table">
      <div class="search-box clearfix">
        <h3>用户组</h3>
        <!---------------------------- 查询条件 ---------------------------->
        <div class="search-box-right">
          <el-button type="primary" size="small" icon="el-icon-plus" @click="dialogVisible=true">新增</el-button>
        </div>
      </div>
      <!---------------------------- 表格 ---------------------------->
      <el-table
        ref="groupTable"
        :data="groupData"
        style="width:100%"
        row-key="id"
        header-row-class-name="table-header"
        v-loading="groupLoading"
        @row-click="rowClick"
        :height="tableHeight"
        :highlight-current-row="true"
      >
        <el-table-column prop="NAME" label="用户组">
          <template slot-scope="scope">
            <el-input v-if="scope.row.isEdit" v-model="scope.row.editName"></el-input>
            <span v-else style="color:#606266;">{{scope.row.NAME}}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" width="180">
          <template slot-scope="scope">
            <div v-if="!scope.row.isEdit">
              <span v-if="scope.row.ISLOCK == '0'" @click.stop="scope.row.isEdit = true">编辑</span>
              <span v-if="scope.row.ISLOCK == '0'" @click.stop="deleteGroup(scope.row)">删除</span>
            </div>
            <div v-else>
              <span @click.stop="editRow(scope.row,true)">保存</span>
              <span @click.stop="editRow(scope.row,false)">取消</span>
            </div>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="right-div base-search-table" style="overflow: auto;">
      <div class="search-box clearfix">
        <h3>{{selectGroupName}}用户</h3>
        <!---------------------------- 查询条件 ---------------------------->
        <div class="search-box-right">
          <el-input
            class="input-box"
            v-model="keyword"
            placeholder="请输入工号或姓名"
            size="small"
            clearable
            style="width:180px;"
            @clear="getTableData(1,pageSize)"
            @keyup.enter.native="getTableData(1,pageSize)"
          ></el-input>
          <el-button
            type="primary"
            size="small"
            icon="el-icon-search"
            @click="getTableData(1,pageSize)"
          >查询</el-button>
          <div v-if="selectGroupIslock == '0'" style="display:inline-block;">
            <el-divider direction="vertical"></el-divider>
            <el-button
              class="orange-btn"
              type="primary"
              size="small"
              icon="el-icon-plus"
              @click="openUserDrawer"
            >添加</el-button>
            <el-button type="primary" size="small" icon="el-icon-upload2" @click="upload">导入</el-button>
            <el-button type="primary" size="small" plain @click="downloadTemp">下载模板</el-button>
            <el-button
              type="danger"
              size="small"
              icon="el-icon-close"
              @click="deleteUser('more')"
            >删除</el-button>
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
          @selection-change="selectRows"
        >
          <el-table-column type="selection" width="55"></el-table-column>
          <el-table-column prop="LOGINNAME" sortable="custom" label="工号"></el-table-column>
          <el-table-column prop="USERNAME" sortable="custom" label="姓名"></el-table-column>
          <el-table-column
            prop="ORGNAME"
            sortable="custom"
            label="部门"
            :formatter="common.defaultFormat"
          ></el-table-column>
          <el-table-column prop="USERSEX" label="性别">
            <template slot-scope="scope">
              <p v-if="scope.row.USERSEX == '0'">男</p>
              <p v-else>女</p>
            </template>
          </el-table-column>
          <el-table-column label="操作" align="center" width="80" v-if="selectGroupIslock == '0'">
            <template slot-scope="scope">
              <span @click.stop="deleteUser('one',scope.row)">删除</span>
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
        <el-form-item prop="name" label="用户组">
          <el-input v-model="editForm.name" placeholder="请输入用户组名称"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer">
        <el-button type="primary" size="small" @click="saveGroup">提交</el-button>
        <el-button size="small" @click="dialogVisible=false">取消</el-button>
      </span>
    </el-dialog>
    <!---------------------------- 添加用户弹窗 ---------------------------->
    <user-drawer ref="userDrawer" @doFunc="getTableData(1,pageSize)"></user-drawer>
    <!------------------------- 上传组件 ------------------------->
    <upload
      v-show="false"
      :multiple="false"
      :size="51200"
      exts="xls|XLS|xlsx|XLSX"
      @done="uploaded"
      @choose="loading=true"
      :url="uploadUrl"
      ref="upload"
      :extraParams="extraParams"
    ></upload>
  </div>
</template>

<script>
import userDrawer from "./userDrawer";
import upload from "@/components/BaseUpload";
import {
  fetchGroupList,
  saveGroup,
  deleteGroup,
  fetchGroupUserList,
  deleteGroupUser
} from "@/api/admin/userGroup";
import { fetchUserList } from "@/api/admin/roles";
export default {
  components: {
    userDrawer,
    upload
  },
  data() {
    return {
      groupLoading: false,
      tableHeight: "500px",
      selectGroupId: null,
      selectGroupName: null,
      selectGroupIslock: "0",
      groupData: [],
      loading: false,
      keyword: null,
      tableData: [],
      selectedRows: [],
      total: 0,
      pageSize: 10,
      currentPage: 1,
      title: "新增用户组",
      editForm: {
        id: null,
        name: null
      },
      rules: {
        name: [
          { required: true, message: "请输入用户组名称！", trigger: "change" }
        ]
      },
      dialogVisible: false,
      uploadUrl: window.g.authUrl + "rest/UserGroup/handleTemplate"
    };
  },
  computed: {
    // 导入 参数
    extraParams() {
      return {
        groupId: this.selectGroupId
      };
    }
  },
  methods: {
    // 下载模板
    downloadTemp() {
      let url = `${window.g.authUrl}rest/Data/getUserTemplate?modelType=groupUser`;
      window.open(url, "_blank");
    },
    // 上传
    upload() {
      if (this.selectGroupId) {
        this.$refs.upload.toupload();
      } else {
        this.$message({
          showClose: true,
          type: "error",
          message: "请选择需要导入用户的用户组！"
        });
        return;
      }
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
            res.error
              .map(i => {
                return `第${i.line}行${i.msg}`;
              })
              .join("；\n") +
            "。";
        }
        this.$confirm(
          `本次成功导入用户${res.successNum}人，失败${res.errorNum}人。${data}`,
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
    // 点击用户组
    rowClick(row) {
      this.$refs.groupTable.setCurrentRow(row);
      this.selectGroupId = row.ID;
      this.selectGroupName = row.NAME;
      this.selectGroupIslock = row.ISLOCK;
      this.getTableData(1, this.pageSize);
    },
    // 获取用户组
    getGroupData() {
      this.groupLoading = true;
      fetchGroupList()
        .then(res => {
          this.groupLoading = false;
          if (res.success) {
            this.groupData = res.items || [];
            this.groupData.forEach(i => {
              this.$set(i, "isEdit", false);
              this.$set(i, "editName", i.NAME);
            });
            this.rowClick(this.groupData[0]);
          }
        })
        .catch(err => {
          this.groupLoading = false;
          console.log(err);
        });
    },
    // 获取用户
    getTableData(page, pageSize) {
      this.loading = true;
      // 如果是全校师生
      if (this.selectGroupId == "9200001-1") {
        let data = {
          filter: JSON.stringify({
            KEYWORD: this.keyword
          }),
          page: page || 1,
          limit: pageSize || this.pageSize
        };
        fetchUserList(data)
          .then(res => {
            this.loading = false;
            this.tableData = res.items;
            this.tableData.forEach(i => {
              i.USERNAME = i.NAME;
              i.USERSEX = i.SEX;
            })
            this.total = res.total;
            this.currentPage = page;
          })
          .catch(err => {
            this.loading = false;
          });
      } else {
        let data = {
          filter: JSON.stringify({
            GROUPID: this.selectGroupId,
            KEYWORD: this.keyword
          }),
          page: page || 1,
          limit: pageSize || this.pageSize
        };
        fetchGroupUserList(data)
          .then(res => {
            this.loading = false;
            this.tableData = res.items;
            this.total = res.total;
            this.currentPage = page;
          })
          .catch(err => {
            this.loading = false;
          });
      }
    },
    // 选择行
    selectRows(rows) {
      this.selectedRows = rows;
    },
    // 关闭弹窗
    cancelDialog() {
      this.$refs.editForm.resetFields();
      this.editForm = {
        id: null,
        name: null
      };
    },

    // 编辑用户组
    editRow(row, isSave) {
      if (isSave && row.editName && row.NAME !== row.editName) {
        let params = {
          data: JSON.stringify({
            ID: row.ID,
            NAME: row.editName,
            APPID: this.$store.state.GROUPID
          })
        };
        this.doSaveGroup(params);
      } else {
        row.isEdit = false;
        row.editName = row.NAME;
      }
    },

    // 提交用户组
    saveGroup() {
      this.$refs.editForm.validate(valid => {
        if (valid) {
          let data = {
            data: JSON.stringify({
              ID: this.editForm.id,
              NAME: this.editForm.name,
              APPID: this.$store.state.GROUPID
            })
          };
          this.doSaveGroup(data);
        }
      });
    },

    // 最终保存用户组
    doSaveGroup(data) {
      this.groupLoading = true;
      saveGroup(data)
        .then(res => {
          this.groupLoading = false;
          if (res.success) {
            this.dialogVisible = false;
            this.getGroupData();
          } else {
            this.$message({
              showClose: true,
              type: "error",
              message: "保存失败：" + res.data.message
            });
          }
        })
        .catch(err => {
          this.groupLoading = false;
          this.$message({
            showClose: true,
            type: "error",
            message: "保存失败：" + err
          });
        });
    },

    // 删除用户组
    deleteGroup(row) {
      let data = {
        filter: JSON.stringify({
          GROUPID: row.ID
        }),
        page: 1,
        limit: 5
      };
      fetchGroupUserList(data)
        .then(res => {
          if (res.success) {
            if (res.total === 0) {
              this.$confirm(`是否确认删除『 ${row.NAME} 』用户组？`, "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning"
              })
                .then(() => {
                  this.groupLoading = true;
                  let data = {
                    ID: row.ID
                  };
                  deleteGroup(data)
                    .then(res => {
                      this.groupLoading = false;
                      if (res.success) {
                        this.$message({
                          showClose: true,
                          type: "success",
                          message: `删除成功！`
                        });
                        this.getGroupData();
                      } else {
                        console.log(res);
                        this.$message({
                          showClose: true,
                          type: "error",
                          message: `删除失败：${res.data.message}`
                        });
                      }
                    })
                    .catch(err => {
                      this.groupLoading = false;
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
            } else {
              this.$confirm("该用户组包含用户，不可删除。", "用户组不能删除", {
                confirmButtonText: "确定",
                showCancelButton: false,
                type: "warning"
              });
            }
          }
        })
        .catch(err => {
          this.groupLoading = false;
        });
    },
    // 打开添加用户弹窗
    openUserDrawer() {
      if (this.selectGroupId) {
        let userDrawer = this.$refs.userDrawer;
        userDrawer.groupId = this.selectGroupId;
        userDrawer.drawer = true;
        this.$nextTick(() => {
          userDrawer.getUserList();
        });
      } else {
        this.$message({
          showClose: true,
          type: "error",
          message: "请选择一个用户组！"
        });
      }
    },
    // 删除用户
    deleteUser(type, row) {
      if (
        (type === "one" && !row) ||
        (type === "more" && this.selectedRows.length === 0)
      ) {
        this.$message({
          showClose: true,
          type: "error",
          message: "请选择需要删除的用户！"
        });
        return;
      }
      let names =
        type === "one"
          ? row.USERNAME
          : this.selectedRows.map(i => i.USERNAME).join("，");
      this.$confirm(
        `是否确认将『 ${names} 』从『 ${this.selectGroupName} 』中删除？`,
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }
      )
        .then(() => {
          this.loading = true;
          let data = {
            IDs: JSON.stringify(
              type === "one" ? [row.ID] : this.selectedRows.map(i => i.ID)
            )
          };
          deleteGroupUser(data)
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
    },
    // 初始化表格高度
    initTableHeight() {
      this.tableHeight = this.$refs.mainDiv.offsetHeight - 92;
    }
  },
  mounted() {
    this.getGroupData();
    this.$nextTick(() => {
      this.initTableHeight();
    });
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
  .left-div,
  .right-div {
    height: 100%;
    background: #ffffff;
  }
  .left-div {
    width: 320px;
    float: left;
    .el-menu {
      border: none;
      .el-menu-item {
        margin-bottom: 10px;
        &.is-active,
        &:hover {
          font-weight: bold;
          background: #f0f5ff;
        }
      }
    }
  }
  .right-div {
    width: calc(100% - 340px);
    float: right;
  }
}
</style>