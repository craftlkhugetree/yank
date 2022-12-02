<template>
  <div class="base-search-table">
    <div class="search-box clearfix" style="padding: 0 20px 10px 0;">
      <h3>预约管理</h3>
    </div>
    <!---------------------------- tab页 ---------------------------->
    <div class="bg-white" v-loading="loading" style="padding:0 0 18px;">
      <p v-if="resGroupList.length == 0" style="padding:60px 20px;">该用户所属部门暂无资源集</p>
      <el-tabs v-model="activeTab" @tab-click="handleClick">
        <el-tab-pane v-for="tab in resGroupList" :key="tab.id" :name="tab.id">
          <!---------------------------- 标签 ---------------------------->
          <span slot="label">{{tab.name}}</span>
          <div class="tab-content" v-loading="tableLoading">
            <!---------------------------- 有资源数据 ---------------------------->
            <div class="base-search-table">
              <div class="search-box clearfix" style="padding: 0 10px 0;">
                <el-button type="primary" size="small" @click="openCancelDrawer()">批量取消预约</el-button>
                <!---------------------------- 查询条件 ---------------------------->
                <div class="search-box-right">
                  <el-date-picker
                    v-model="useTimes"
                    type="daterange"
                    range-separator="至"
                    start-placeholder="请选择使用日期"
                    end-placeholder="请选择使用日期"
                    size="small"
                    style="width:280px;"
                    value-format="yyyyMMdd"
                    @change="getTableData(1,pageSize)"
                  ></el-date-picker>
                  <el-select
                    v-model="status"
                    size="small"
                    placeholder="状态"
                    style="width:100px;margin:0 5px;"
                    clearable
                    @change="getTableData(1,pageSize)"
                  >
                    <el-option
                      v-for="item in statusList"
                      :key="item.name"
                      :label="item.name"
                      :value="item.id"
                    ></el-option>
                  </el-select>
                  <el-input
                    class="input-box"
                    v-model="keyword"
                    placeholder="请输入资源名称或申请人"
                    size="small"
                    style="width:190px;"
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
                  <el-divider direction="vertical"></el-divider>
                  <el-button
                    class="orange-btn"
                    type="primary"
                    size="small"
                    icon="el-icon-plus"
                    @click="exportData"
                  >导出</el-button>
                </div>
              </div>
              <!---------------------------- 表格 ---------------------------->
              <el-table
                :data="tableData"
                style="width:100%"
                header-row-class-name="table-header"
                v-loading="tableLoading"
                @selection-change="selectRows"
              >
                <el-table-column type="selection" width="55" :selectable="canSelect"></el-table-column>
                <el-table-column prop="resname" label="资源名称" show-overflow-tooltip></el-table-column>
                <el-table-column prop="applyername" label="申请人" show-overflow-tooltip></el-table-column>
                <el-table-column
                  prop="usedate"
                  label="使用时间"
                  :formatter="useTimeFormat"
                  show-overflow-tooltip
                ></el-table-column>
                <el-table-column
                  prop="createtime"
                  label="申请时间"
                  :formatter="common.timeFormat"
                  show-overflow-tooltip
                ></el-table-column>
                <el-table-column
                  prop="status"
                  label="状态"
                  align="center"
                  width="100"
                  :formatter="statusFormat"
                ></el-table-column>
                <el-table-column label="操作" align="center" width="180">
                  <template slot-scope="scope">
                    <span @click="openDrawer(scope.row)">详情</span>
                    <span
                      v-if="!['3','8','9'].includes(scope.row.applystatus)"
                      @click="openCancelDrawer(scope.row)"
                    >取消预约</span>
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
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>
    <!---------------------------- 预约单详情弹窗 ---------------------------->
    <detail-drawer ref="detailDrawer" @doFunc="openCancelDrawer(curRow)"></detail-drawer>
    <!---------------------------- 取消预约弹窗 ---------------------------->
    <cancel-drawer ref="cancelDrawer" @doFunc="afterCancel"></cancel-drawer>
  </div>
</template>

<script>
import detailDrawer from "./detailDrawer";
import cancelDrawer from "./cancelDrawer";
import { fetchResGroupList } from "@/api/admin/res";
import { fetchApplyList } from "@/api/admin/appoint";
export default {
  components: {
    detailDrawer,
    cancelDrawer
  },
  data() {
    return {
      loading: false,
      activeTab: null,
      curResGroup: {}, // 当前资源集
      resGroupList: [],
      tableLoading: false,
      tableData: [],
      total: 0,
      currentPage: 1,
      pageSize: 10,
      useTimes: [],
      status: null,
      keyword: null,
      selectedRows: [],
      curRow: null
    };
  },
  computed: {
    orgId() {
      return this.$store.state.userInfo.ORGID;
    },
    statusList() {
      return this.$store.state.statusList;
    }
  },
  watch: {
    orgId() {
      this.getResGroupList();
    }
  },
  methods: {
    // 导出数据
    exportData() {
      let times = this.useTimes || [];
      let st = times[0] || "";
      let et = times[1] || "";
      let applystatus = this.status ? ["1-1", "1-2"].includes(this.status)
        ? "1"
        : this.status : "";
      let keyword = this.keyword || "";
      let url = `${window.g.url}apply/exportApply`;
      let query = `?resgroupid=${this.activeTab}&starttime=${st}&endtime=${et}&applystatus=${applystatus}&keyword=${keyword}`
      window.open(url + query, "_blank");
    },

    // 使用时间格式
    useTimeFormat(row) {
      return (
        this.moment(row.usedate).format("YYYY-MM-DD") +
        " " +
        this.moment(row.starttime, "HHmm").format("HH:mm") +
        " - " +
        this.moment(row.endtime, "HHmm").format("HH:mm")
      );
    },
    // 状态格式
    statusFormat(row) {
      let status = "--";
      if (row.approveorder == "-1" && row.applystatus == "1") {
        status = "1-1";
      } else if (row.applystatus == "1") {
        status = "1-2";
      } else {
        status = row.applystatus;
      }
      return this.statusList.filter(i => i.id === status)[0].name;
    },

    // 选择行
    selectRows(rows) {
      this.selectedRows = rows;
    },

    // 判断是否可以选择 （审核不通过、已完成、已取消 时不能选择）
    canSelect(row) {
      return ["3", "8", "9"].includes(row.applystatus) ? false : true;
    },

    // 打开取消弹窗
    openCancelDrawer(row) {
      let ids = row ? [row.id] : this.selectedRows.map(i => i.id);
      let names = row
        ? row.resname
        : this.selectedRows.map(i => i.resname).join("、");
      if (ids.length == 0) {
        this.$message({
          showClose: true,
          type: "error",
          message: "请选择预约单！"
        });
        return;
      }
      let cancelDrawer = this.$refs.cancelDrawer;
      cancelDrawer.drawer = true;
      cancelDrawer.ids = ids;
      cancelDrawer.names = names;
    },

    // 取消预约之后
    afterCancel() {
      this.$refs.cancelDrawer.drawer = false;
      this.$refs.detailDrawer.drawer = false;
      this.getTableData(1, this.pageSize);
    },

    // 详情弹窗
    openDrawer(row) {
      this.curRow = row;
      let detailDrawer = this.$refs.detailDrawer;
      detailDrawer.drawer = true;
      detailDrawer.id = row.id;
    },
    // 点击tab
    handleClick(tab, event) {
      this.getTableData(1, this.pageSize);
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
          if (this.resGroupList.length > 0) {
            let ids = this.resGroupList.map(i => i.id);
            if (!ids.includes(this.activeTab)) {
              this.activeTab = this.resGroupList[0].id;
              this.getTableData(1, this.pageSize);
            }
          }
        })
        .catch(err => {
          this.loading = false;
        });
    },
    // 获取资源
    getTableData(page, pageSize) {
      this.tableLoading = true;
      let times = this.useTimes || [];
      let data = {
        filter: {
          resgroupid: this.activeTab,
          starttime: times[0] || null,
          endtime: times[1] || null,
          applystatus: ["1-1", "1-2"].includes(this.status) ? "1" : this.status,
          keyword: this.keyword
        },
        page: page || 1,
        limit: pageSize || this.pageSize
      };
      fetchApplyList(data)
        .then(res => {
          this.tableLoading = false;
          this.tableData = res.data || [];
          this.total = res.total;
          this.currentPage = page;
        })
        .catch(err => {
          this.tableLoading = false;
        });
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