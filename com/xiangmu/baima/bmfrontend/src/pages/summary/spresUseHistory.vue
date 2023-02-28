<template>
  <div class="common-content">
    <el-tabs
      class="my-border-card"
      type="border-card"
      v-model="activeResType"
      @tab-click="resTypeChange"
      v-loading="tabLoading"
    >
      <el-tab-pane
        :label="item.name"
        v-for="item in resTypeList"
        :key="item.id"
        :name="item.id + ''"
      ></el-tab-pane>
    </el-tabs>

    <!--搜索框-->
    <div class="search-group">
      <span>
        <label>学院</label>
        <!-- <el-select v-model="searchForm.orgid" placeholder="请选择" size="small" style="width: 150px" filterable>
          <el-option v-for="item in groupList" :key="item.id" :label="item.name" :value="item.id" ></el-option>
        </el-select>-->
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
          v-model="searchForm.key"
          placeholder="搜索资源编号或项目名称"
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
          <span>全部导出</span>
        </div>
      </div>
    </div>

    <!--表格-->
    <el-table
      class="my-table"
      :data="resList"
      style="width: 100%"
      stripe
      ref="multipleTable"
      v-loading="loading"
    >
      <el-table-column
        prop="name"
        label="资源编号"
        align="center"
        show-overflow-tooltip
      ></el-table-column>
      <el-table-column
        prop="area"
        label="面积(㎡)"
        align="center"
        show-overflow-tooltip
      ></el-table-column>
      <el-table-column
        prop="orgName"
        label="学院"
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
        prop="classfeeLeaderName"
        label="负责人"
        align="center"
        show-overflow-tooltip
      ></el-table-column>
      <el-table-column
        prop="classfeeLeaderMobile"
        label="联系电话"
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
import { eduTypeList } from "@/assets/js/api";

export default {
  name: "spresUseHistory",
  data() {
    return {
      activeResType: "", //默认资源id
      totalPage: 1,
      limit: 10,
      currentPage: 1,
      activeName: "second",
      resList: [], //申请列表
      groupList: [], //学院列表
      searchForm: {},
      loading: false,
      tabLoading: false,
      typeDetail: {},
      selectedIds: "",
      resTypeDetail: {},
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
        orgId: this.searchForm.orgid,
        keyword: this.searchForm.key,
        // eduTypeId: this.activeResType
      };
      let url = "/data/eduResUseHistoryExport";
      // let fileName =
      //   (this.resTypeList.find(r => r.id == this.activeResType) || {}).name ||
      //   "";
      this.util.exportFile(
        url,
        false,
        data,
        "科教资源历史使用记录",
        // fileName + "科教资源历史使用记录",
        "xlsx"
      );
    },

    //资源类型tab切换
    resTypeChange(tab, event) {
      this.activeResType = tab.name;
      this.currentPage = 1;
      this.getList(this.currentPage);
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

    //获取列表
    getList(page) {
      this.loading = true;
      this.util
        .postAjax({
          code: this.global.code,
          url: "/data/eduResUseHistory",
          isRep: true,
          data: {
            limit: this.limit,
            page,
            filter: {
              orgId: this.searchForm.orgid,
              keyword: this.searchForm.key,
              eduTypeId: this.activeResType
            }
          }
        })
        .then(res => {
          this.loading = false;
          if (res.success == true) {
            this.resList = res.data;
            this.totalPage = res.total;
          }
        });
    },
    // 获取资源类型列表
    getResTypeList() {
      eduTypeList({}).then(res => {
        if (res.success == true) {
          this.resTypeList = res.data;
          this.resTypeList.forEach(r => {
            let chargecycle = r.billingCycle + "";
            let chargetype = r.billingMethod + "";
            this.common.chargecycleFormatter(chargecycle, r);
            this.common.chargetypeFormatter2(chargetype, r, "ct2", "ct1");
          });
          this.activeResType = this.resTypeList[0].id + "";
          this.getList(this.currentPage);
        }
      });
    }
  },
  created() {
    this.getResTypeList();
  }
};
</script>

<style scoped></style>
