<template>
  <div class="base-search-table">
    <div class="search-box clearfix" style="padding: 15px 20px 0;">
      <h3 style="width:100px;">
        人员管理
        <span>
          <strong>{{total}}</strong>人
        </span>
        <!-- <p class="title-tips">未分组{{noGroupdata.length}}人，当前参加考核{{groupdata.length}}人</p> -->
      </h3>
      <!---------------------------- 查询条件 ---------------------------->
      <div class="search-box-right" style="max-width:100%;">
        <el-select
          v-model="orgname"
          placeholder="选择部门"
          size="small"
          class="select-no-wrap"
          style="width:120px;"
          clearable
          multiple
          @change="getTableData(1,pageSize)"
        >
          <el-option
            v-for="item in orgList"
            :key="item.orgname"
            :label="item.orgname"
            :value="item.orgname"
          ></el-option>
        </el-select>
        <el-select
          v-model="group"
          placeholder="选择考核分组"
          size="small"
          class="select-no-wrap"
          style="width:120px;"
          clearable
          multiple
          @change="getTableData(1,pageSize)"
        >
          <el-option v-for="item in nGroupList" :key="item.id" :label="item.name" :value="item.id"></el-option>
        </el-select>
        <el-select
          v-model="joblvid"
          placeholder="选择领导岗位级别"
          size="small"
          class="select-no-wrap"
          style="width:146px;"
          clearable
          multiple
          @change="getTableData(1,pageSize)"
        >
          <el-option v-for="item in nLevelList" :key="item.id" :label="item.name" :value="item.id"></el-option>
        </el-select>
        <el-select
          v-model="rylxm"
          placeholder="选择人员类型"
          size="small"
          class="select-no-wrap"
          style="width:120px;"
          clearable
          multiple
          @change="getTableData(1,pageSize)"
        >
          <el-option
            v-for="item in rylxList"
            :key="item.rylxm"
            :label="item.rylxm"
            :value="item.rylxm"
          ></el-option>
        </el-select>
        <el-input
          class="input-box"
          v-model="keyword"
          placeholder="输入姓名或工号"
          size="small"
          clearable
          style="width:155px;"
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
        <el-divider direction="vertical"></el-divider>
        <!-- <el-button type="primary" size="small" icon="el-icon-refresh" @click="syncData">同步</el-button> -->
        <el-button type="primary" size="small" icon="el-icon-edit" @click="batchEdit">批量编辑</el-button>
        <el-button
          type="primary"
          size="small"
          style="margin-left:5px;"
          icon="el-icon-plus"
          @click="$refs.addDrawer.drawer=true;"
        >添加</el-button>
        <el-button size="small" @click="exportData">导出数据</el-button>
      </div>
    </div>
    <div class="tips">
      <i class="el-icon-warning"></i>
      <!-- <span v-if="noLeveldata.length > 0">有{{noLeveldata.length}}人的领导岗位级别为空。</span>
      <span v-if="noGroupdata.length > 0">有{{noGroupdata.length}}人的考核分组为空。</span>
      <span v-if="noSalarydata.length > 0">有{{noSalarydata.length}}个租赁人员的外挂工资为空。</span>-->
      <span>未分组{{noGroupdata.length}}人，当前参加考核{{groupdata.length}}人</span>
    </div>
    <!---------------------------- 表格 ---------------------------->
    <div class="table-content">
      <el-table
        :data="tableData"
        style="width:100%;margin-top:10px;"
        header-row-class-name="table-header"
        @selection-change="selectRows"
        v-loading="loading"
        @sort-change="sortBy"
      >
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column type="index" label="序号" show-overflow-tooltip width="60"></el-table-column>
        <el-table-column prop="name" label="姓名" show-overflow-tooltip>
          <template slot-scope="scope">{{scope.row.name}}（{{scope.row.id}}）</template>
        </el-table-column>
        <el-table-column
          prop="orgname"
          label="部门"
          sortable="custom"
          show-overflow-tooltip
          :formatter="common.defaultFormat"
        ></el-table-column>
        <el-table-column
          prop="joblvid"
          label="领导岗位级别"
          sortable="custom"
          show-overflow-tooltip
          min-width="100"
        >
          <template slot-scope="scope">
            <el-select
              v-if="scope.row.isEdit"
              v-model="scope.row.editJoblvid"
              placeholder="请选择"
              size="small"
              style="width:100%;"
              clearable
            >
              <el-option
                v-for="item in levelList"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              ></el-option>
            </el-select>
            <span v-else style="color:#606266">{{scope.row.joblvname || "--"}}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="groupid"
          label="考核分组"
          sortable="custom"
          show-overflow-tooltip
          min-width="100"
        >
          <template slot-scope="scope">
            <el-select
              v-if="scope.row.isEdit"
              v-model="scope.row.editGroupid"
              placeholder="请选择"
              size="small"
              style="width:100%;"
            >
              <el-option
                v-for="item in groupList"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              ></el-option>
            </el-select>
            <span v-else style="color:#606266">{{scope.row.groupname || "--"}}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="rylxm"
          label="人员类型"
          sortable="custom"
          show-overflow-tooltip
          :formatter="common.defaultFormat"
        ></el-table-column>
        <el-table-column
          prop="salary"
          label="外挂工资（元）"
          show-overflow-tooltip
          :formatter="(row, column, val) => common.moneyFormat(val)"
          min-width="90"
        ></el-table-column>
        <el-table-column label="操作" align="center" width="120">
          <template slot-scope="scope">
            <div v-if="!scope.row.isEdit">
              <span @click="scope.row.isEdit = true">编辑</span>
              <span v-if="scope.row.ismanadd == '1'" @click="deleteRow(scope.row)">删除</span>
            </div>
            <div v-else>
              <span @click.stop="editRow(scope.row,true)">保存</span>
              <span @click.stop="editRow(scope.row,false)">取消</span>
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
          :page-sizes="[5,10,15,20]"
          :current-page.sync="currentPage"
          @current-change="page => getTableData(page, pageSize)"
          @size-change="size => {pageSize = size; getTableData(1, size)}"
        ></el-pagination>
      </div>
    </div>
    <!---------------------------- 批量编辑 ---------------------------->
    <batch-drawer ref="batchDrawer" @doFunc="getTableData(1,pageSize);getAllData();"></batch-drawer>
    <!---------------------------- 添加 ---------------------------->
    <add-drawer ref="addDrawer" @doFunc="getTableData(1,pageSize);getAllData();"></add-drawer>
  </div>
</template>

<script>
import batchDrawer from "./batchDrawer";
import addDrawer from "./addDrawer";
import { fetchGroupList } from "@/api/admin/group.js";
import {
  fetchAllUserList,
  fetchUserList,
  syncUser,
  saveUser,
  fetchRylxList,
  fetchOrgList,
  deleteUser
} from "@/api/admin/users.js";
import { fetchLevelList } from "@/api/admin/leaderLevel.js";
export default {
  components: {
    batchDrawer,
    addDrawer
  },
  data() {
    return {
      loading: false,
      group: [],
      keyword: null,
      allData: [],
      tableData: [],
      total: 0,
      currentPage: 1,
      pageSize: 10,
      selectData: [],
      sort: null,
      orderBy: null,
      orgname: [],
      joblvid: [],
      rylxm: [],
      rylxList: [],
      orgList: []
    };
  },
  computed: {
    groupList() {
      return this.$store.state.groupList;
    },
    nGroupList() {
      let arr = [
        {
          id: "-1",
          name: "未分组"
        }
      ];
      return arr.concat(this.$store.state.groupList);
    },
    levelList() {
      return this.$store.state.levelList;
    },
    nLevelList() {
      let arr = [
        {
          id: "-1",
          name: "未设置"
        }
      ];
      return arr.concat(this.levelList);
    },
    noLeveldata() {
      return this.allData.filter(i => !i.joblvid);
    },
    noGroupdata() {
      return this.allData.filter(i => !i.groupid);
    },
    groupdata() {
      return this.allData.filter(i => i.groupid);
    },
    // 只针对租赁人员
    noSalarydata() {
      return this.allData.filter(i => i.rylx == "2024" && !i.salary);
    }
  },
  methods: {
    // 同步数据
    syncData() {
      // this.loading = true;
      // syncUser().then(res => {}).catch(err => {})
    },

    // 选中的行
    selectRows(rows) {
      this.selectData = rows;
    },

    // 批量编辑
    batchEdit() {
      if (this.selectData.length > 0) {
        let batchDrawer = this.$refs.batchDrawer;
        batchDrawer.tableData = _.cloneDeep(this.selectData);
        batchDrawer.drawer = true;
      } else {
        this.$message({
          showClose: true,
          type: "error",
          message: "请选择需要编辑的人员！"
        });
      }
    },

    // 编辑
    editRow(row, isSave) {
      if (isSave) {
        if (row.joblvid == row.editJoblvid && row.groupid == row.editGroupid) {
          row.isEdit = false;
        } else {
          this.doSave(row);
        }
      } else {
        row.isEdit = false;
        row.editJoblvid = row.joblvid == "-1" ? null : row.joblvid;
        row.editGroupid = row.groupid;
      }
    },

    // 保存
    doSave(row) {
      this.loading = true;
      let param = [
        {
          id: row.id,
          joblvid: row.editJoblvid || "-1",
          groupid: row.editGroupid || null
        }
      ];
      saveUser(param)
        .then(res => {
          this.loading = false;
          if (res.success) {
            this.$message({
              showClose: true,
              type: "success",
              message: "保存成功！"
            });
            this.getTableData(this.currentPage, this.pageSize);
            this.getAllData();
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
    },

    // 删除
    deleteRow(row) {
      this.$confirm(`确认要删除『 ${row.name} 』吗？`, "确认要删除吗？", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(res => {
          let param = {
            id: row.id
          };
          this.loading = true;
          deleteUser(param)
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

    // 获取审核分组列表
    getGroupList() {
      fetchGroupList()
        .then(res => {
          if (res.success) {
            let data = res.data || [];
            this.$store.commit("setGroupList", data);
          }
        })
        .catch(err => {});
    },

    // 获取领导岗位级别列表
    getLevelList() {
      fetchLevelList()
        .then(res => {
          if (res.success) {
            let data = res.data || [];
            this.$store.commit("setLevelList", data);
          }
        })
        .catch(err => {});
    },

    // 获取人员类型
    getRylxList() {
      fetchRylxList()
        .then(res => {
          if (res.success) {
            this.rylxList = res.data || [];
          }
        })
        .catch(err => {});
    },

    // 获取部门
    getOrgList() {
      fetchOrgList()
        .then(res => {
          if (res.success) {
            this.orgList = res.data || [];
          }
        })
        .catch(err => {});
    },

    // 获取所有用户
    getAllData() {
      fetchAllUserList({})
        .then(res => {
          if (res.success) {
            this.allData = res.data || [];
          }
        })
        .catch(err => {});
    },

    // 表格排序
    sortBy(obj) {
      this.orderBy = obj.prop;
      this.sort = obj.order == "ascending" ? "asc" : "desc";
      this.getTableData(this.currentPage, this.pageSize);
    },

    // 获取人员列表
    getTableData(page, pageSize) {
      this.loading = true;
      let param = {
        filter: {
          orgname: this.orgname.join(",") || null,
          groupid: this.group.join(",") || null,
          joblvid: this.joblvid.join(",") || null,
          rylxm: this.rylxm.join(",") || null,
          keyword: this.keyword || null
        },
        limit: pageSize,
        page: page || 1,
        sort: this.sort,
        orderBy: this.orderBy
      };
      fetchUserList(param)
        .then(res => {
          this.loading = false;
          if (res.success) {
            this.tableData = res.data || [];
            this.total = res.total;
            this.currentPage = page || 1;
            this.tableData.forEach(i => {
              this.$set(i, "isEdit", false);
              this.$set(i, "editJoblvid", i.joblvid == "-1" ? null : i.joblvid);
              this.$set(i, "editGroupid", i.groupid);
            });
          }
        })
        .catch(err => {
          this.loading = false;
        });
    },

    // 导出数据
    exportData() {
      let url = `${window.g.url}user/userDownload`;
      let params = {
        orgname: this.orgname.join(",") || "",
        groupid: this.group.join(",") || "",
        joblvid: this.joblvid.join(",") || "",
        rylxm: this.rylxm.join(",") || "",
        keyword: this.keyword || ""
      };
      let query = "";
      for (let key in params) {
        query += `${key}=${params[key]}&`;
      }
      console.log(`${url}?${query}`)
      window.open(`${url}?${query}`, "_blank");
    }
  },
  created() {
    this.getGroupList();
    this.getLevelList();
    this.getRylxList();
    this.getOrgList();
    this.getAllData();
    this.getTableData(this.currentPage, this.pageSize);
  }
};
</script>

<style lang="scss" scoped>
.title-tips {
  font-size: 14px;
  font-weight: 400;
}
.base-search-table {
  min-height: 800px;
  padding-bottom: 20px;
}
.search-box {
  h3 {
    span {
      font-size: 14px;
      color: #999;
      margin-left: 5px;
      strong {
        color: #3f86f7;
        font-weight: 600;
      }
    }
  }
  .el-button--small {
    padding: 9px !important;
  }
  .el-divider--vertical {
    margin: 0 4px;
  }
}
.tips {
  background: #fffbe6;
  border-radius: 2px;
  border: 1px solid #ffe58f;
  margin: 15px 20px;
  padding: 8px 15px;
  color: rgba(0, 0, 0, 0.65);
  line-height: 22px;
  i {
    color: #faad14;
    margin-right: 5px;
  }
}
</style>
<style lang="scss">
.select-no-wrap {
  .el-select__tags {
    display: inline-block;
    height: 24px;
    overflow: hidden;
    white-space: nowrap;
  }
}
</style>