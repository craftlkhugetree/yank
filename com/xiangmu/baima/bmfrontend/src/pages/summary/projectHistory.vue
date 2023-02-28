<template>
  <div class="common-content">
    <!--搜索框-->
    <div class="search-group">
      <span v-if="!isLeader">
        <label>学院</label>
        <el-select
          v-model="searchForm.orgid"
          filterable
          remote
          placeholder="请输入或选择"
          size="small"
          :remote-method="remoteMethod"
          :loading="selectLoading"
          style="width: 150px"
        >
          <el-option
            v-for="item in groupList"
            :label="item.name"
            :value="item.id"
            :key="item.id"
          ></el-option>
        </el-select>
      </span>
      <span>
        <el-input
          v-model="searchForm.projectname"
          placeholder="请输入项目名称"
          prefix-icon="el-icon-search"
          size="small"
          style="width: 220px"
        ></el-input>
        <el-button size="small" style="width: 100px" @click="search"
          >搜索</el-button
        >
      </span>
      <span class="reset-icon" @click="reset">
        <i class="el-icon-refresh-right" style="margin-right: 5px"></i>重置
      </span>

      <div
        style="display:inline-block;float: right;margin-top: 3px;margin-bottom: 20px"
      >
        <div class="my-button green" style="" @click="download">
          <span>导出</span>
        </div>
      </div>
    </div>

    <div class="my-tab-wrap">
      <el-tabs class="my-el-tabs" v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="当前科研项目" name="1"></el-tab-pane>
        <el-tab-pane label="历史科研项目" name="2,3"></el-tab-pane>
      </el-tabs>
    </div>

    <el-divider style=""></el-divider>

    <!--表格-->
    <el-table
      class="my-table"
      :header-cell-style="{ background: '#F3F5F9' }"
      :data="resList"
      style="width: 100%"
      stripe
      ref="multipleTable"
      v-loading="loading"
    >
      <el-table-column
        prop="orgName"
        label="学院名称"
        align="center"
        show-overflow-tooltip
      ></el-table-column>
      <el-table-column
        align="center"
        prop="projectName"
        label="项目名称"
        width="300"
        show-overflow-tooltip
      ></el-table-column>
      <el-table-column
        prop="projectFrom"
        label="项目来源"
        align="center"
        show-overflow-tooltip
      ></el-table-column>
      <el-table-column
        prop="projectFee"
        label="项目经费(万元)"
        align="center"
      ></el-table-column>
      <el-table-column
        prop="contacterName"
        label="日常联系人"
        align="center"
        show-overflow-tooltip
      ></el-table-column>
      <el-table-column
        prop="eduTypeName"
        label="资源类型"
        align="center"
        show-overflow-tooltip
      ></el-table-column>
      <el-table-column
        prop="eduResourceName"
        label="资源编号"
        align="center"
        show-overflow-tooltip
      ></el-table-column>
      <el-table-column
        prop="checkinTime"
        label="入驻时间"
        align="center"
        width="200"
      >
        <template slot-scope="scope">
          {{ common.formatTime(scope.row.checkinTime, "yyyy-MM-dd hh:mm:ss") }}
        </template>
      </el-table-column>
      <el-table-column
        prop="checkoutTime"
        label="退租时间"
        align="center"
        width="200"
      >
        <template slot-scope="scope">
          {{ common.formatTime(scope.row.checkoutTime, "yyyy-MM-dd hh:mm:ss") }}
        </template>
      </el-table-column>
    </el-table>

    <!--分页-->
    <div class="my-pagination" v-if="totalPage > limit">
      <span>显示{{ limit }}条，共{{ totalPage }}条</span>
      <el-pagination
        class="my-el-pagination"
        background
        layout="prev, pager, next"
        :total="totalPage"
        :page-size="limit"
        :current-page="currentPage"
        small
        @current-change="getCurrentChange"
      ></el-pagination>
    </div>
  </div>
</template>

<script>
export default {
  name: "ProjectHistory",
  props: {
    isLeader: Boolean
  },
  data() {
    return {
      activeName: "1",
      activeResType: "", //默认资源id
      totalPage: 1,
      limit: 10,
      currentPage: 1,
      resList: [], //申请列表
      groupList: [], //学院列表
      searchForm: {},
      loading: false,
      resTypeList: [],
      selectLoading: false
    };
  },
  methods: {
    //搜索学院名称
    remoteMethod(query) {
      this.selectLoading = true;
      if (query !== "") {
        this.common
          .getGroupList2(query)
          .then(res => {
            console.log(res);
            this.selectLoading = false;
            this.groupList = res.items;
          })
          .catch(err => {
            this.selectLoading = false;
            this.groupList = [];
          });
      } else {
        this.selectLoading = false;
        this.groupList = [];
      }
    },

    //导出
    download() {
      const data = {
        status: this.activeName,
        projectName: this.searchForm.projectname,
        orgId: this.isLeader
          ? this.$store.state.userInfo.ORGID
          : this.searchForm.orgid
      };
      let url = "/data/eduResProjectExport";
      let fileName = this.activeName == 1 ? "当前科研项目" : "历史科研项目";
      this.util.exportFile(url, false, data, fileName, "xlsx");
    },

    //点击分页
    getCurrentChange(currentPage) {
      this.currentPage = currentPage;
      this.getList(currentPage);
    },

    //搜索
    search() {
      this.getList(1);
    },

    //清空
    reset() {
      this.searchForm = {};
      this.currentPage = 1;
      this.getList(this.currentPage);
    },

    //tab切换
    handleClick(row) {
      this.currentPage = 1;
      this.getList(1);
    },
    //获取列表
    getList(page) {
      this.loading = true;
      const data = {
        limit: this.limit,
        page,
        filter: {
          status: this.activeName,
          projectName: this.searchForm.projectname,
          orgId: this.isLeader
            ? this.$store.state.userInfo.ORGID
            : this.searchForm.orgid
        }
      };
      this.util
        .postAjax({
          code: this.global.code,
          url: "/data/eduResProject",
          isRep: true,
          data
        })
        .then(res => {
          this.loading = false;
          if (res.success == true) {
            this.resList = res.data;
            this.totalPage = res.total;
          }
        });
    }
  },
  created() {
    this.getList(this.currentPage);
  }
};
</script>

<style scoped></style>
