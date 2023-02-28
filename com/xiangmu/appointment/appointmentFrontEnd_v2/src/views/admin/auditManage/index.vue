<template>
  <div class="base-search-table">
    <div class="search-box clearfix" style="padding: 0 20px 10px 0;">
      <h3>审核管理</h3>
    </div>
    <!---------------------------- tab页 ---------------------------->
    <div class="bg-white" v-loading="loading" style="padding:0 0 18px;">
      <el-tabs v-model="activeTab" @tab-click="handleClick">
        <el-tab-pane v-for="tab in tabs" :key="tab.id" :name="tab.id">
          <!---------------------------- 标签 ---------------------------->
          <span slot="label">{{tab.name}}</span>
          <div class="tab-content" v-loading="tableLoading">
            <!---------------------------- 有资源数据 ---------------------------->
            <div class="base-search-table">
              <div class="search-box clearfix" style="padding: 0 10px 0;">
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
                    v-model="resGroupId"
                    size="small"
                    placeholder="资源集"
                    style="width:150px;margin:0 5px;"
                    clearable
                    @change="getTableData(1,pageSize)"
                  >
                    <el-option
                      v-for="item in resGroupList"
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
                </div>
              </div>
              <!---------------------------- 表格 ---------------------------->
              <el-table
                :data="tableData"
                style="width:100%"
                header-row-class-name="table-header"
                v-loading="tableLoading"
              >
                <el-table-column type="index" width="55"></el-table-column>
                <el-table-column prop="resname" label="资源名称" show-overflow-tooltip></el-table-column>
                <el-table-column prop="resgroupname" label="资源集" show-overflow-tooltip></el-table-column>
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
                <el-table-column label="操作" align="center" width="180">
                  <template slot-scope="scope">
                    <span v-if="activeTab=='1'" @click="openDrawer(scope.row, 'audit')">审核</span>
                    <span v-else @click="openDrawer(scope.row, 'view')">详情</span>
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
    <detail-drawer ref="detailDrawer" @doFunc="getTableData(1,pageSize)"></detail-drawer>
  </div>
</template>

<script>
import detailDrawer from "./detailDrawer";
import { fetchResGroupList } from "@/api/admin/res";
import { fetchApproveList } from "@/api/admin/approve";
export default {
  components: {
    detailDrawer
  },
  data() {
    return {
      loading: false,
      activeTab: "1",
      tabs: [
        { id: "1", name: "待审核" },
        { id: "2", name: "已审核" }
      ],
      tableLoading: false,
      tableData: [],
      total: 0,
      currentPage: 1,
      pageSize: 10,
      useTimes: [],
      resGroupId: null,
      keyword: null,
      resGroupList: []
    };
  },
  computed: {
    orgId() {
      return this.$store.state.userInfo.ORGID;
    }
  },
  // watch: {
  //   orgId() {
  //     this.getResGroupList();
  //     this.getTableData(this.currentPage, this.pageSize);
  //   }
  // },
  methods: {
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

    // 详情弹窗
    openDrawer(row, type) {
      let detailDrawer = this.$refs.detailDrawer;
      detailDrawer.drawer = true;
      detailDrawer.id = row.id;
      detailDrawer.operType = type;
    },
    // 点击tab
    handleClick(tab, event) {
      this.getTableData(1, this.pageSize);
    },

    // 获取资源集
    getResGroupList() {
      let data = {
        // orgid: this.orgId
      };
      fetchResGroupList(data)
        .then(res => {
          this.resGroupList = res.data || [];
        })
        .catch(err => {});
    },

    // 获取表格数据
    getTableData(page, pageSize) {
      this.tableLoading = true;
      let times = this.useTimes;
      let data = {
        filter: {
          starttime: times ? times[0] : null,
          endtime: times ? times[1] : null,
          resgroupid: this.resGroupId,
          keyword: this.keyword
        },
        page: page || 1,
        limit: pageSize || this.pageSize
      };
      fetchApproveList(this.activeTab, data)
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
    // if (this.orgId) {
      this.getResGroupList();
      this.getTableData(this.currentPage, this.pageSize);
    // }
  }
};
</script>

<style lang="scss" scoped>
.search-box-right {
  position: relative;
  max-width: 100% !important;
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