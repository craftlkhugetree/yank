<template>
  <div class="common-content" v-loading="loading">
    <el-tabs
      class="my-border-card"
      type="border-card"
      v-model="activeResType"
      @tab-click="changeTab"
    >
      <el-tab-pane
        :label="item.name"
        v-for="item in resTypeList"
        :key="item.id"
        :name="item.id"
      ></el-tab-pane>
    </el-tabs>

    <div v-if="0 == activeResType">
      <div class="my-tab-wrap">
        <el-tabs class="my-el-tabs" v-model="activeTab" @tab-click="changeTab">
          <el-tab-pane :label="'待办任务' + pendingNum" :name="P"></el-tab-pane>
          <el-tab-pane :label="'历史任务' + historyNum" :name="H"></el-tab-pane>
        </el-tabs>
      </div>
      <el-divider></el-divider>
    </div>

    <!--表格-->
    <el-table
      class="my-table"
      :data="resList"
      style="width: 100%"
      stripe
      ref="multipleTable"
    >
      <el-table-column
        prop="title"
        label="内容"
        align="center"
      ></el-table-column>
      <el-table-column prop="createTime" label="时间" align="center">
        <template slot-scope="scope">
          {{ util.formatTime(scope.row.createTime, "YYYY-MM-DD hh:mm:ss") }}
        </template>
      </el-table-column>
      <el-table-column
        label="操作"
        fixed="right"
        width="280"
        align="center"
        v-if="(activeResType == '0' && activeTab === P) || activeResType == 1"
      >
        <template slot-scope="scope">
          <div
            class="table-btn green"
            @click="goDetail(scope.row)"
            v-if="activeResType == '1'"
          >
            详情
          </div>
          <div
            class="table-btn blue"
            @click="handle(scope.row)"
            v-if="activeResType == '0' && activeTab === P"
          >
            处理
          </div>
        </template>
      </el-table-column>
    </el-table>

    <!--分页-->
    <div class="my-pagination" v-if="totalPage">
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
import { myTasks, myMessages } from "@/assets/js/api";

export default {
  name: "MyMessage",
  data() {
    return {
      activeTab: "pending",
      P: "pending",
      H: "history",
      totalPage: 0,
      limit: 10,
      currentPage: 1,
      resList: [], //列表
      loading: false,
      pendingNum: "",
      historyNum: "",
      activeResType: "0", // 任务标识
      resTypeList: [
        { name: "任务", id: "0" },
        { name: "消息", id: "1" }
      ],
      biz: undefined
    };
  },
  methods: {
    changeTab() {
      this.currentPage = 1;
      this.getList();
      this.getAll();
    },
    handle(row) {
      row &&
        row.pcUrl &&
        this.$router.push({
          path: row.pcUrl,
        });
    },
    //跳转详情
    goDetail(row) {
      row &&
        row.pcUrl &&
        this.$router.push({
          path: row.pcUrl,
        });
    },
    // 获取tab数字
    getAll() {
      0 == this.activeResType &&
        this.H === this.activeTab &&
        myTasks({
          page: 1,
          limit: 5,
          filter: { status: 0, assignId: this.$store.state.userId }
        }).then(res => {
          this.pendingNum = "";
          if (res && res.success) {
            this.pendingNum = res.total;
          }
        });
      0 == this.activeResType &&
        this.P === this.activeTab &&
        myTasks({
          page: 1,
          limit: 5,
          filter: { status: 1, assignId: this.$store.state.userId }
        }).then(res => {
          this.historyNum = "";
          if (res && res.success) {
            this.historyNum = res.total;
          }
        });
    },
    //点击分页
    getCurrentChange(currentPage) {
      this.currentPage = currentPage;
      this.getList(currentPage);
    },
    //获取列表
    getList(page = 1) {
      this.loading = true;
      const params = { page, limit: this.limit };
      let fun = null;
      if (0 == this.activeResType) {
        fun = myTasks;
        let status = this.P === this.activeTab ? 0 : 1;
        let filter = { status, assignId: this.$store.state.userId };
        params.filter = filter;
        fun = myTasks(params);
      } else if (1 == this.activeResType) {
        fun = myMessages(params);
      }
      fun
        .then(res => {
          this.loading = false;
          if (res && res.success) {
            this.resList = res.data;
            this.totalPage = res.total;
            if (0 == this.activeResType && this.H === this.activeTab) {
              this.historyNum = res.total;
            } else if (0 == this.activeResType && this.P === this.activeTab) {
              this.pendingNum = res.total;
            }
          } else {
            this.$message({
              type: "warning",
              message: res.data.message
            });
          }
        })
        .catch(err => {
          this.loading = false;
        });
    }
  },
  created() {
    this.getList();
    this.getAll();
  }
};
</script>

<style scoped></style>