<template>
  <div class="base-search-table">
    <!---------------------------- tab页 ---------------------------->
    <div class="bg-white" v-loading="loading" style="padding:0 0 18px;">
      <p v-if="groupList.length == 0" style="padding: 20px 0 0 20px;">暂无考核分组</p>
      <el-button
        class="right-btn"
        type="primary"
        size="small"
        icon="el-icon-plus"
        @click="openDrawer"
      >新增考核分组</el-button>
      <el-tabs v-model="activeTab" @tab-click="handleClick">
        <el-tab-pane v-for="tab in groupList" :key="tab.id" :name="tab.id">
          <!---------------------------- 标签 ---------------------------->
          <span slot="label" v-if="!tab.isEdit">
            {{tab.name}}
            <span v-if="activeTab == tab.id && tab.isdefault !== '1'">
              <i class="el-icon-edit" style="color:#8E8E8E" @click.stop="tab.isEdit=true;"></i>
              <i class="el-icon-close" style="color:#8E8E8E" @click.stop="deleteGroup(tab)"></i>
            </span>
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
                @click.stop="editUserGroup(tab)"
              ></el-button>
            </el-input>
          </span>
          <div class="tab-content" v-loading="tableLoading">
            <div class="base-search-table">
              <div class="search-box clearfix">
                <div v-if="tab.isdefault !== '1'">
                  <label>分管领导：</label>
                  <span>{{leaders}}</span>
                  <span class="btn" @click="openEditDrawer('leaders',tab)">编辑</span>
                </div>
                <div v-if="tab.isdefault !== '1'">
                  <label>考核工作组：</label>
                  <span>{{workers}}</span>
                  <span class="btn" @click="openEditDrawer('workers',tab)">编辑</span>
                </div>
                <div>
                  <label>{{tab.isdefault == '1' ? "人员名单：" : "被考核人："}}</label>
                  <span class="tag">{{total}}人</span>
                  <span class="btn" @click="openEditDrawer('users',tab)">编辑</span>
                </div>
              </div>
              <!---------------------------- 表格 ---------------------------->
              <el-table
                :data="tableData"
                style="width:100%"
                header-row-class-name="table-header"
                v-loading="tableLoading"
              >
                <el-table-column type="index" label="序号" show-overflow-tooltip width="80"></el-table-column>
                <el-table-column prop="name" label="姓名" show-overflow-tooltip>
                  <template slot-scope="scope">{{scope.row.name}}（{{scope.row.id}}）</template>
                </el-table-column>
                <el-table-column
                  prop="orgname"
                  label="部门"
                  show-overflow-tooltip
                  :formatter="common.defaultFormat"
                ></el-table-column>
                <el-table-column
                  prop="joblvname"
                  label="领导岗位级别"
                  show-overflow-tooltip
                  :formatter="common.defaultFormat"
                ></el-table-column>
                <el-table-column
                  prop="rylxm"
                  label="人员类型"
                  show-overflow-tooltip
                  :formatter="common.defaultFormat"
                ></el-table-column>
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
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>
    <!------------------------- 新增考核分组 ------------------------->
    <add-drawer ref="addDrawer" @doFunc="getGroupList"></add-drawer>
    <!------------------------- 编辑考核分组 ------------------------->
    <edit-drawer ref="editDrawer" @doFunc="getGroupList"></edit-drawer>
  </div>
</template>

<script>
import addDrawer from "./addDrawer";
import editDrawer from "./editDrawer";
import { deleteRoleUser } from "@/api/admin/roles";
import {
  fetchGroupList,
  deleteGroup,
  saveGroupName,
  fetchGroupDetail,
  getUserLeaderGroups,
  getUserWorkGroups
} from "@/api/admin/group.js";
import { fetchUserList } from "@/api/admin/users.js";
export default {
  components: {
    addDrawer,
    editDrawer
  },
  data() {
    return {
      loading: false,
      activeTab: null,
      lastActiveTab: null,
      groupList: [],
      groupDetail: {
        leaders: [],
        workers: []
      },
      tableLoading: false,
      tableData: [],
      total: 0,
      currentPage: 1,
      pageSize: 10
    };
  },
  computed: {
    leaders() {
      let data = this.groupDetail.leaders;
      return data.map(i => `${i.leadername}(${i.leaderid})`).join("，");
    },
    workers() {
      let data = this.groupDetail.workers;
      return data.map(i => `${i.workername}(${i.workerid})`).join("，");
    }
  },
  methods: {
    // 点击tab
    handleClick(tab, event) {
      if (this.lastActiveTab !== tab.name) {
        this.lastActiveTab = this.activeTab;
        this.getGroupDetail();
        this.getTableData(1, this.pageSize);
      }
    },

    // 打开新增考核分组弹窗
    openDrawer() {
      this.$refs.addDrawer.drawer = true;
    },

    // 打开编辑考核分组弹窗
    openEditDrawer(type, tab) {
      let editDrawer = this.$refs.editDrawer;
      editDrawer.type = type;
      editDrawer.title = `编辑考核分组-${tab.name}`;
      editDrawer.groupId = tab.id;
      switch (type) {
        case "leaders":
          editDrawer.editForm.leaders = this.leaders.split("，");
          editDrawer.leadersArr = this.groupDetail.leaders.map(i => {
            return {
              userid: i.leaderid,
              username: i.leadername
            };
          });
          editDrawer.initArr = this.groupDetail.leaders.map(i => i.leaderid);
          break;
        case "workers":
          editDrawer.editForm.workers = this.workers.split("，");
          editDrawer.workersArr = this.groupDetail.workers.map(i => {
            return {
              userid: i.workerid,
              username: i.workername
            };
          });
          editDrawer.initArr = this.groupDetail.workers.map(i => i.workerid);
          break;
      }
      editDrawer.drawer = true;
    },

    // 获取考核分组
    getGroupList() {
      this.loading = true;
      let data = {};
      fetchGroupList(data)
        .then(res => {
          this.loading = false;
          this.groupList = res.data || [];
          this.groupList.forEach(i => {
            this.$set(i, "isEdit", false);
            this.$set(i, "editName", i.name);
          });
          if (this.groupList.length > 0) {
            let ids = this.groupList.map(i => i.id);
            let index = this.groupList.findIndex(i => i.id === this.activeTab);
            if (index < 0) {
              this.activeTab = this.groupList[0].id;
            }
            this.getGroupDetail();
            this.getTableData(1, this.pageSize);
          }
        })
        .catch(err => {
          this.loading = false;
        });
    },
    // 获取分组详情
    getGroupDetail() {
      let param = {
        id: this.activeTab
      };
      fetchGroupDetail(param)
        .then(res => {
          if (res.success) {
            this.groupDetail = res.data || {};
          }
        })
        .catch(err => {});
    },
    // 获取表格数据
    getTableData(page, pageSize) {
      this.tableLoading = true;
      let param = {
        filter: {
          groupid: this.activeTab
        },
        limit: pageSize,
        page: page || 1
      };
      fetchUserList(param)
        .then(res => {
          this.tableLoading = false;
          this.tableData = res.data || [];
          this.total = res.total;
          this.currentPage = page || 1;
        })
        .catch(err => {
          this.tableLoading = false;
        });
    },
    // 编辑
    editUserGroup(tab) {
      if (tab.editName && tab.editName !== tab.name) {
        let data = {
          id: tab.id,
          name: tab.editName
        };
        this.loading = true;
        saveGroupName(data)
          .then(res => {
            this.loading = false;
            if (res.success) {
              this.$message({
                showClose: true,
                type: "success",
                message: "保存成功！"
              });
              tab.isEdit = false;
              this.getGroupList();
              // 更新用户负责的考核分组
              this.$store.dispatch("getUserRoleGroupList");
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
        tab.editName = tab.name;
      }
    },
    // 删除
    deleteGroup(tab) {
      this.$confirm(
        `考核分组『 ${tab.name} 』在使用中，确认要删除吗？`,
        "确认要删除吗？",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }
      )
        .then(res => {
          let param = {
            id: tab.id
          };
          this.loading = true;
          deleteGroup(param)
            .then(res => {
              this.loading = false;
              if (res.success) {
                this.getGroupList();
                // 删除分管领导角色
                let leaderIds = this.groupDetail.leaders.map(i => i.leaderid);
                this.deleteUserRole("20210604-3", leaderIds);
                // 删除工作组角色
                let workerIds = this.groupDetail.workers.map(i => i.workerid);
                this.deleteUserRole("20210604-2", workerIds);
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
    // 用户所管理的分组
    getUserManageGroups(role, userid) {
      return new Promise((resolve, reject) => {
        let func = null;
        switch (role) {
          case "20210604-3":
            func = getUserLeaderGroups;
            break;
          case "20210604-2":
            func = getUserWorkGroups;
            break;
        }
        let param = {
          userid: userid
        };
        func(param)
          .then(res => {
            if (res.success) {
              let data = res.data || [];
              data = data.map(i => i.groupid);
              resolve(data);
            } else {
              reject(res.data.errInf.shortBusInf);
            }
          })
          .catch(err => {
            reject(err);
          });
      });
    },
    // 删除用户角色
    deleteUserRole(role, data) {
      // 查找每个用户所管理的用户组
      data.forEach(i => {
        this.getUserManageGroups(role, i).then(res => {
          let data = res.filter(j => j !== this.activeTab);
          // 如果还在其他用户组则不需要删除其角色
          if (data.length > 0) {
            return;
          } else {
            // 如果不在其他用户组则删除其角色
            let param = {
              data: JSON.stringify({
                ROLEID: role,
                USERID: [i]
              })
            };
            deleteRoleUser(param)
              .then(res => {
                if (!res.success) {
                  this.$message({
                    showClose: true,
                    type: "error",
                    message: "用户角色删除失败！"
                  });
                }
              })
              .catch(err => {
                this.$message({
                  showClose: true,
                  type: "error",
                  message: "用户角色删除失败！"
                });
              });
          }
        });
      });
    },
  },
  created() {
    this.getGroupList();
  }
};
</script>

<style lang="scss" scoped>
.bg-white {
  position: relative;
}
.right-btn {
  position: absolute;
  right: 20px;
  top: 8px;
  z-index: 200;
}
.tab-content {
  position: relative;
  min-height: 500px;
}
.search-box {
  font-size: 14px;
  font-weight: 400;
  color: #5f6464;
  line-height: 20px;
  padding: 0 10px 0 20px !important;
  & > div {
    margin: 2px 0 10px;
    label {
      display: inline-block;
      width: 90px;
    }
    .tag {
      background: #ebf2fe;
      border-radius: 2px;
      border: 1px solid #85b2fa;
      padding: 0 5px;
      color: #3f86f7;
    }
    .btn {
      color: #3f86f7;
      margin-left: 10px;
      cursor: pointer;
    }
  }
}
</style>