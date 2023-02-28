<template>
  <!---------------------------- tab页 ---------------------------->
  <div class="base-tab" ref="baseTab" v-loading="loading">
    <p v-if="tabList.length == 0" style="padding:60px 20px;">暂无数据</p>
    <div class="right-btn" v-if="activeTab=='4'">
      <label>选择分组：</label>
      <el-select
        style="width:120px;margin-right:20px"
        class="no-border date-select no-clear"
        v-model="group"
        size="small"
        placeholder="全部"
        @change="getTableData()"
        clearable
      >
        <el-option v-for="item in groupList" :key="item.id" :label="item.name" :value="item.id"></el-option>
      </el-select>
      <label>选择年度：</label>
      <el-date-picker
        class="no-border date-select no-clear"
        v-model="year"
        type="year"
        placeholder="全部"
        size="small"
        value-format="yyyy"
        format="yyyy年"
        style="width:90px;"
        :clearable="true"
        @change="getTableData()"
      ></el-date-picker>
      <i class="el-icon-arrow-down"></i>
    </div>
    <el-tabs v-model="activeTab" @tab-click="handleClick">
      <el-tab-pane v-for="tab in tabList" :key="tab.id" :name="tab.id">
        <!---------------------------- 标签 ---------------------------->
        <span slot="label">{{tab.name}}</span>
        <!---------------------------- 内容 ---------------------------->
        <div class="tab-content" v-loading="tableLoading">
          <div class="base-search-table">
            <!---------------------------- 表格 ---------------------------->
            <el-table
              :data="tableData"
              style="width:100%"
              header-row-class-name="table-header"
              v-loading="tableLoading"
            >
              <el-table-column type="index" label="序号" width="100"></el-table-column>
              <el-table-column prop="username" label="绩效清单" show-overflow-tooltip>
                <template slot-scope="scope">
                  <i
                    v-if="scope.row.monthdate"
                  >『 {{scope.row.groupname}} 』{{scope.row.yeardate}}年{{scope.row.monthdate}}月绩效清单</i>
                  <i v-else>『 {{scope.row.groupname}} 』{{scope.row.yeardate}}年终绩效清单</i>
                </template>
              </el-table-column>
              <el-table-column
                prop="result"
                label="审核结果"
                show-overflow-tooltip
                v-if="activeTab=='4'"
              >
                <template slot-scope="scope">
                  <i v-if="scope.row.result=='1'">
                    <el-tag class="blue-tag">审核通过</el-tag>
                    {{scope.row.note }}
                  </i>
                  <i v-else>
                    <el-tag class="orange-tag" style="color:#FF9F0A">审核不通过</el-tag>
                    {{scope.row.note }}
                  </i>
                </template>
              </el-table-column>
              <el-table-column label="操作" align="center" width="300">
                <template slot-scope="scope">
                  <span @click="handleCheck(scope.row,1)" v-if="activeTab=='3'">审核</span>
                  <span @click="handleCheck(scope.row,0)" v-else>查看</span>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </div>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script>
import { needReviews, myReviewed } from "@/api/kpi/manage";
import { getUserLeaderGroups } from "@/api/admin/group";
export default {
  components: {},
  data() {
    return {
      loading: false,
      activeTab: "3",
      tabList: [
        {
          id: "3",
          name: "待审核"
        },
        {
          id: "4",
          name: "已审核"
        }
      ],
      tableLoading: false,
      tableData: [],
      keyword: "",
      year: null,
      groupList: [],
      group: null
    };
  },
  computed: {
    userInfo() {
      return this.$store.state.userInfo;
    }
  },
  watch: {
    userInfo() {
      this.getGroupList();
    }
  },
  created() {
    if (this.userInfo.ID) {
      this.getGroupList();
    }
    this.getTableData();
  },
  mounted() {},
  methods: {
    // 获取考核分组
    getGroupList() {
      let data = { userid: this.userInfo.ID };
      getUserLeaderGroups(data).then(res => {
        this.groupList = res.data || [];
      });
    },
    //详情页  月 年
    handleCheck(row, type) {
      if (row.type == "1") {
        this.$router.push({
          path: `/kpi/check/month/${row.id}`,
          query: {
            isCheck: type,
            activeTab: this.activeTab
          }
        });
      } else {
        this.$router.push({
          path: `/kpi/check/year/${row.id}`,
          query: {
            isCheck: type,
            activeTab: this.activeTab
          }
        });
      }
    },
    // 切换tab
    handleClick(tab, event) {
      this.getTableData();
    },
    getTableData() {
      this.tableLoading = true;
      if (this.activeTab == "3") {
        //待审核列表
        needReviews().then(res => {
          this.tableLoading = false;
          this.tableData = res.data || [];
        });
      } else {
        let param = {};
        if (this.year) {
          param.yeardate = this.year;
        }
        if (this.group) {
          param.groupid = this.group;
        }
        //已审核列表
        myReviewed(param).then(res => {
          this.tableLoading = false;
          this.tableData = res.data || [];
        });
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.tab-content {
  position: relative;
  min-height: 500px;
  margin-bottom: 70px;
}
.right-btn {
  position: absolute;
  right: 20px;
  top: 8px;
  z-index: 200;
  label {
    color: #5f6464;
  }
}
.search-box {
  border-bottom: 1px solid rgba(0, 0, 0, 0.06);
  .search-box-left {
    float: left;
  }
  label {
    color: #5f6464;
  }
  .tips {
    margin-left: 10px;
    color: rgba(0, 0, 0, 0.65);
  }
}
.search-box-right {
  & > div {
    display: inline-block;
  }
}
.header-box {
  float: right;
  position: relative;
  z-index: 999;
  label {
    color: #5f6464;
    margin-right: 30px;
  }
  .iconrili:before {
    font-size: 32px;
    position: absolute;
    right: 65px;
    bottom: 6px;
    display: inline-block;
  }
  .all {
    position: absolute;
    right: 40px;
    bottom: 6px;
    display: inline-block;
    z-index: 998;
  }
}

//日历
.year /deep/.el-input__inner {
  border: none;
  padding-right: 0px;
  padding-left: 0px;
}
.year /deep/.el-input__icon {
  display: none;
}
</style>
