<template>
  <div class="base-search-table">
    <div class="search-box clearfix" style="padding: 0 20px 10px 0;">
      <h3>资源管理</h3>
      <div class="search-box-right">
        <el-button
          type="primary"
          size="small"
          icon="el-icon-plus"
          @click="$refs.resGroupDialog.dialogVisible = true;"
        >新增资源集</el-button>
        <!---------------------------- 新增资源集弹窗 ---------------------------->
        <res-group-dialog class="fixed-dialog" ref="resGroupDialog" @doFunc="getResGroupList"></res-group-dialog>
      </div>
    </div>
    <!---------------------------- tab页 ---------------------------->
    <div class="bg-white" v-loading="loading" style="padding:0 0 18px;">
      <p v-if="resGroupList.length == 0" style="padding:80px 20px;">该用户所属部门暂无资源集</p>
      <el-tabs v-model="activeTab" @tab-click="handleClick">
        <el-tab-pane v-for="tab in resGroupList" :key="tab.id" :name="tab.id">
          <!---------------------------- 标签 ---------------------------->
          <span slot="label" v-if="!tab.isEdit">
            {{tab.name}}
            <i
              v-if="activeTab === tab.id"
              class="el-icon-edit"
              @click.stop="tab.isEdit=true;"
            ></i>
          </span>
          <span slot="label" v-if="tab.isEdit">
            <el-input
              class="tab-label-btn"
              v-model="tab.editName"
              style="width:120px;"
              size="small"
            >
              <el-button
                slot="append"
                icon="el-icon-check"
                style="padding:0;"
                @click.stop="editResGroup(tab)"
              ></el-button>
            </el-input>
          </span>
          <div class="tab-content" v-loading="tableLoading">
            <!---------------------------- 有资源数据 ---------------------------->
            <div class="base-search-table" v-if="totalAll > 0">
              <div class="search-box clearfix" style="padding: 0 10px 0;">
                <el-button
                  type="primary"
                  size="small"
                  icon="el-icon-edit-outline"
                  @click="openManageRuleDrawer"
                >管理办法</el-button>
                <!-- 开放对象 -->
                <open-user-group-btn
                  style="margin:0 10px;"
                  :curResGroup="curResGroup"
                  @doFunc="getResGroupList"
                ></open-user-group-btn>
                <el-button
                  type="primary"
                  size="small"
                  icon="el-icon-plus"
                  @click="openResDrawer"
                >新增资源</el-button>
                <!---------------------------- 查询条件 ---------------------------->
                <div class="search-box-right">
                  <el-input
                    class="input-box"
                    v-model="keyword"
                    placeholder="请输入名称"
                    size="small"
                    clearable
                    @clear="getTableData(1,pageSize)"
                    @keyup.enter.native="getTableData(1,pageSize)"
                  ></el-input>
                  <el-button
                    type="primary"
                    size="small"
                    icon="el-icon-search"
                    @click="getTableData(1,pageSize)"
                  >查询</el-button>
                </div>
              </div>
              <!---------------------------- 表格 ---------------------------->
              <el-table
                :data="tableData"
                style="width:100%"
                header-row-class-name="table-header"
                v-loading="tableLoading"
              >
                <el-table-column type="index" label="序号" width="55"></el-table-column>
                <el-table-column prop="name" label="资源名称" width="150" show-overflow-tooltip></el-table-column>
                <el-table-column
                  prop="location"
                  label="资源位置"
                  width="240"
                  :formatter="common.defaultFormat"
                  show-overflow-tooltip
                ></el-table-column>
                <el-table-column
                  prop="note"
                  label="资源描述"
                  :formatter="common.defaultFormat"
                  show-overflow-tooltip
                ></el-table-column>
                <el-table-column prop="status" label="状态" align="center" width="60">
                  <template slot-scope="scope">
                    <el-switch
                      ref="elSwitch"
                      v-model="scope.row.status"
                      :width="50"
                      active-color="#3F86F7"
                      active-value="1"
                      inactive-color="#c3c3c3"
                      inactive-value="0"
                      @change="changeStatus(scope.row)"
                    ></el-switch>
                    <span
                      :class="scope.row.status == '1' ? 'switch-text-left' : 'switch-text-right'"
                      @click="$refs.elSwitch[scope.$index].handleChange()"
                    >{{scope.row.status == "1" ? "开放" : "关闭"}}</span>
                  </template>
                </el-table-column>
                <el-table-column label="操作" align="center" width="180">
                  <template slot-scope="scope">
                    <span @click="toDetail(scope.row)">详情</span>
                    <span @click="deleteRes(scope.row)">删除</span>
                    <span @click="copyRes(scope.row)">复制</span>
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
                  :page-sizes="[5,10,15,20]"
                  :current-page.sync="currentPage"
                  @current-change="page => getTableData(page, pageSize)"
                  @size-change="size => {pageSize = size; getTableData(1, size)}"
                ></el-pagination>
              </div>
            </div>
            <!---------------------------- 没有资源数据 ---------------------------->
            <div class="nodata" v-if="totalAll == 0 && !tableLoading">
              <el-button
                class="right-btn"
                type="info"
                plain
                size="small"
                @click="deleteResGroup(tab)"
              >删除资源集</el-button>
              <img src="@/assets/img/nodata.png" alt />
              <p>没有找到资源，你可以</p>
              <div>
                <el-button
                  type="primary"
                  size="small"
                  icon="el-icon-edit-outline"
                  @click="openManageRuleDrawer"
                >管理办法</el-button>
                <!-- 开放对象 -->
                <open-user-group-btn
                  style="margin:0 10px;"
                  :curResGroup="curResGroup"
                  @doFunc="getResGroupList"
                ></open-user-group-btn>
                <el-button
                  type="primary"
                  size="small"
                  icon="el-icon-plus"
                  @click="openResDrawer"
                >新增资源</el-button>
              </div>
            </div>
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>
    <!---------------------------- 管理办法弹窗 ---------------------------->
    <manage-rule-drawer ref="manageRuleDrawer" @doFunc="getResGroupList"></manage-rule-drawer>
    <!---------------------------- 新增资源弹窗 ---------------------------->
    <res-drawer ref="resDrawer"></res-drawer>
  </div>
</template>

<script>
import ResDrawer from "./addResDrawer";
import OpenUserGroupBtn from "./components/OpenUserGroupBtn";
import ResGroupDialog from "./resGroupDialog";
import ManageRuleDrawer from "./manageRuleDrawer";
import wangEditor from "wangeditor";
import {
  fetchResGroupList,
  fetchResList,
  saveResGroup,
  deleteResGroup,
  changeResStatus,
  deleteRes
} from "@/api/admin/res";
export default {
  components: {
    ResDrawer,
    OpenUserGroupBtn,
    ResGroupDialog,
    ManageRuleDrawer
  },
  data() {
    return {
      loading: false,
      activeTab: null,
      lastActiveTab: null,
      curResGroup: {}, // 当前资源集
      resGroupList: [],
      keyword: null,
      tableLoading: false,
      tableData: [],
      total: 0,
      totalAll: 0,
      currentPage: 1,
      pageSize: 10
    };
  },
  computed: {
    orgId() {
      return this.$store.state.userInfo.ORGID;
    }
  },
  watch: {
    orgId() {
      this.getResGroupList();
    }
  },
  methods: {
    // 打开管理办法弹窗
    openManageRuleDrawer() {
      let ruleDrawer = this.$refs.manageRuleDrawer;
      ruleDrawer.drawer = true;
      ruleDrawer.resGroup = this.curResGroup;
      ruleDrawer.ugroupids = this.curResGroup.ugroupids || "";
      // 设置富文本内容
      this.$nextTick(() => {
        ruleDrawer.$refs.editor.editor.txt.html(this.curResGroup.managerinfo);
      });
    },
    // 打开新增资源弹窗
    openResDrawer() {
      let resDrawer = this.$refs.resDrawer;
      resDrawer.drawer = true;
      resDrawer.editForm.resgroupid = this.activeTab;
    },
    // 点击tab
    handleClick(tab, event) {
      if (this.lastActiveTab !== tab.name) {
        this.lastActiveTab = this.activeTab;
        // 当前的资源集
        this.curResGroup = this.resGroupList.filter(
          i => i.id === this.activeTab
        )[0];
        this.getTableData(1, this.pageSize);
      }
    },
    // 获取资源集
    getResGroupList() {
      this.loading = true;
      let data = {
        orgid: this.orgId
      };
      fetchResGroupList(data)
        .then(res => {
          this.loading = false;
          this.resGroupList = res.data || [];
          this.resGroupList.forEach(i => {
            this.$set(i, "isEdit", false);
            this.$set(i, "editName", i.name);
          });
          if (this.resGroupList.length > 0) {
            this.initParams();
            let ids = this.resGroupList.map(i => i.id);
            let index = this.resGroupList.findIndex(
              i => i.id === this.activeTab
            );
            if (index < 0) {
              this.activeTab = this.resGroupList[0].id;
              this.curResGroup = this.resGroupList[0];
            } else {
              this.curResGroup = this.resGroupList[index];
            }
            this.getTableData(1, this.pageSize);
          }
        })
        .catch(err => {
          this.loading = false;
        });
    },
    // 获取资源
    getTableData(page, pageSize) {
      this.tableLoading = true;
      let data = {
        filter: {
          name: this.keyword,
          resgroupid: this.activeTab
        },
        page: page,
        limit: pageSize || this.pageSize
      };
      fetchResList(data)
        .then(res => {
          this.tableLoading = false;
          this.tableData = res.data || [];
          this.total = res.total;
          if (!this.keyword) {
            this.totalAll = res.total;
          }
          this.currentPage = page;
          let resParams = {
            activeTab: this.activeTab,
            keyword: this.keyword,
            page: page,
            totalAll: this.totalAll
          };
          sessionStorage.setItem("res-params", JSON.stringify(resParams));
        })
        .catch(err => {
          this.tableLoading = false;
        });
    },
    // 编辑资源集
    editResGroup(tab) {
      if (tab.editName && tab.editName !== tab.name) {
        let data = {
          id: tab.id,
          name: tab.editName
        };
        this.loading = true;
        saveResGroup(data)
          .then(res => {
            this.loading = false;
            if (res.success) {
              this.$message({
                showClose: true,
                type: "success",
                message: "保存成功！"
              });
              tab.isEdit = false;
              this.getResGroupList();
            } else {
              this.$message({
                showClose: true,
                type: "error",
                message: "保存失败：" + res.data.message
              });
            }
          })
          .catch(err => {
            this.loading = false;
            this.$message({
              showClose: true,
              type: "error",
              message: "保存失败：" + err
            });
          });
      } else {
        tab.isEdit = false;
      }
    },
    // 删除资源集
    deleteResGroup(tab) {
      this.$confirm(`是否确认删除该资源集？`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(res => {
          let data = {
            id: tab.id
          };
          this.loading = true;
          deleteResGroup(data)
            .then(res => {
              this.loading = false;
              if (res.success) {
                this.$message({
                  showClose: true,
                  type: "success",
                  message: "删除成功！"
                });
                this.getResGroupList();
              } else {
                this.$message({
                  showClose: true,
                  type: "error",
                  message: "删除失败：" + res.data.message
                });
              }
            })
            .catch(err => {
              this.loading = false;
              this.$message({
                showClose: true,
                type: "error",
                message: "删除失败：" + err
              });
            });
        })
        .catch(() => {
          return;
        });
    },
    // 改变状态
    changeStatus(row) {
      let flag = row.status;
      row.status = flag == "0" ? "1" : "0"; // 之前的值
      let message = flag == "0" ? "关闭" : "开放";
      this.$confirm(`是否确认${message}该资源？`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(res => {
          this.loading = true;
          let data = {
            id: row.id,
            status: flag
          };
          changeResStatus(data)
            .then(res => {
              this.loading = false;
              if (res.success) {
                this.$message({
                  showClose: true,
                  type: "success",
                  message: `${message}成功！`
                });
                this.getTableData(this.currentPage, this.pageSize);
              } else {
                this.$message({
                  showClose: true,
                  type: "error",
                  message: `${message}失败：` + res.data.message
                });
              }
            })
            .catch(err => {
              this.loading = false;
              this.$message({
                showClose: true,
                type: "error",
                message: `${message}失败：` + err
              });
            });
        })
        .catch(() => {
          return;
        });
    },
    // 详情
    toDetail(row) {
      this.$router.push(`/res-manage/detail/${row.id}`);
    },

    // 删除资源
    deleteRes(row) {
      this.$confirm(`是否确认删除该资源？`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(res => {
          let data = {
            id: row.id
          };
          this.loading = true;
          deleteRes(data)
            .then(res => {
              this.loading = false;
              if (res.success) {
                this.$message({
                  showClose: true,
                  type: "success",
                  message: "删除成功！"
                });
                this.getTableData(this.currentPage, this.pageSize);
              } else {
                this.$message({
                  showClose: true,
                  type: "error",
                  message: "删除失败：" + res.data.message
                });
              }
            })
            .catch(err => {
              this.loading = false;
              this.$message({
                showClose: true,
                type: "error",
                message: "删除失败：" + err
              });
            });
        })
        .catch(() => {
          return;
        });
    },

    // 复制资源
    copyRes(row) {
      this.$router.push({
        path: `/res-manage/edit-res/${row.id}`,
        query: {
          isCopy: true
        }
      });
    },

    // 初始化查询参数
    initParams() {
      let data = sessionStorage.getItem("res-params");
      if (data) {
        let params = JSON.parse(data);
        this.activeTab = params.activeTab;
        this.keyword = params.keyword;
        this.currentPage = params.page;
        this.totalAll = params.totalAll;
      }
    }
  },
  created() {
    if (this.orgId) {
      this.getResGroupList();
    }
  }
};
</script>

<style lang="scss" scoped>
.search-box-right {
  position: relative;
}
.fixed-dialog {
  position: absolute;
  width: 400px;
  height: 200px;
  left: -240px;
  top: 36px;
}
.tab-content {
  position: relative;
  min-height: 500px;
}
.nodata {
  width: 800px;
  margin: 100px auto;
  padding: 60px 0;
  text-align: center;
  box-shadow: 0px 4px 8px 0px rgba(3, 27, 78, 0.12);
  border-radius: 5px;
  img {
    width: 100px;
    height: 100px;
  }
  p {
    font-size: 14px;
    color: #999999;
    line-height: 20px;
    margin: 20px 0 10px;
  }
  .right-btn {
    position: absolute;
    right: 20px;
    top: -100px;
  }
}
.switch-text-left,
.switch-text-right {
  position: absolute;
  font-size: 12px;
  color: #ffffff !important;
}
.switch-text-left {
  left: 16px;
  top: 12px;
}
.switch-text-right {
  right: 6px;
  top: 12px;
}
</style>