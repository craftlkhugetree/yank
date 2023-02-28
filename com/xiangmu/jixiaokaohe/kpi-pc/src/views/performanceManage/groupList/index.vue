<template>
  <div class="base-search-table">
    <!---------------------------- tab页 ---------------------------->
    <div class="bg-white" v-loading="loading" style="padding:0 0 18px;">
      <p v-if="groupList.length == 0" style="padding: 20px 0 0 20px;">暂无考核分组</p>
      <el-tabs v-model="activeTab" @tab-click="handleClick">
        <el-tab-pane v-for="tab in groupList" :key="tab.id" :name="tab.id" :label="tab.name">
          <div class="tab-content" v-loading="tableLoading">
            <div class="base-search-table">
              <div class="search-box clearfix">
                <div v-if="tab.isdefault !== '1'">
                  <label>分管领导：</label>
                  <span>{{leaders}}</span>
                </div>
                <div v-if="tab.isdefault !== '1'">
                  <label>考核工作组：</label>
                  <span>{{workers}}</span>
                </div>
                <div>
                  <label>{{tab.isdefault == '1' ? "人员名单：" : "被考核人："}}</label>
                  <span class="tag">{{total}}人</span>
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
  </div>
</template>

<script>
import { fetchGroupDetail } from "@/api/admin/group.js";
import { fetchUserList } from "@/api/admin/users.js";
export default {
  data() {
    return {
      loading: false,
      activeTab: null,
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
    // 用户有权限查看的工作组
    groupList() {
      return this.$store.state.userRoleGroupList;
    },
    leaders() {
      let data = this.groupDetail.leaders;
      return data.map(i => `${i.leadername}(${i.leaderid})`).join("，");
    },
    workers() {
      let data = this.groupDetail.workers;
      return data.map(i => `${i.workername}(${i.workerid})`).join("，");
    }
  },
  watch: {
    groupList() {
      this.init();
    }
  },
  methods: {
    // 点击tab
    handleClick(tab, event) {
      this.getGroupDetail();
      this.getTableData(1, this.pageSize);
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

    // 初始化
    init() {
      if (this.groupList.length > 0) {
        this.activeTab = this.groupList[0].id;
        this.getGroupDetail();
        this.getTableData(this.currentPage, this.pageSize);
      }
    }
  },
  created() {
    if (this.groupList.length > 0) {
      this.init();
    }
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