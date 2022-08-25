<template>
  <div class="common-content" v-loading="loading">
    <el-tabs
      class="my-border-card"
      type="border-card"
      v-model="isPay"
      @tab-click="handleClick"
    >
      <el-tab-pane label="未支付" name="0"></el-tab-pane>
      <el-tab-pane label="已支付" name="1"></el-tab-pane>
    </el-tabs>

    <!--搜索框-->
    <div class="search-group">
      <span>
        <label>资源类型</label>
        <el-select
          v-model="searchForm.eduTypeId"
          placeholder="请选择"
          size="small"
          style="width: 150px"
        >
          <el-option
            v-for="item in resTypeList"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          ></el-option>
        </el-select>
      </span>
      <span>
        <el-input
          v-model.trim="searchForm.name"
          maxlength="100"
          placeholder="请输入资源编号"
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

      <div class="my-button green title-right">
        <div v-if="isBM" @click="downTemp">
          <img :src="require('st@tic/images/export.png')" />
          <span>全部导出</span>
        </div>
        <div v-else @click="downForm">
          <i class="el-icon-printer"></i>
          <span>下载转账单</span>
        </div>
      </div>
    </div>

    <!--tab切换-->
    <div class="my-tab-wrap">
      <el-tabs class="my-el-tabs" v-model="priceType" @tab-click="handleClick">
        <el-tab-pane label="租金" name="1"></el-tab-pane>
        <el-tab-pane label="逾期租金" name="2"></el-tab-pane>
        <el-tab-pane label="水表" name="3"></el-tab-pane>
        <el-tab-pane label="电表" name="4"></el-tab-pane>
      </el-tabs>
    </div>

    <el-divider style=""></el-divider>

    <!--表格-->
    <el-table
      v-if="priceType == 1 || priceType == 2"
      class="my-table"
      :data="resList"
      style="width: 100%"
      stripe
      ref="multipleTable"
    >
      <el-table-column
        prop="eduTypeName"
        label="资源类型"
        align="center"
      ></el-table-column>
      <el-table-column
        prop="resName"
        label="资源编号"
        align="center"
      ></el-table-column>

      <el-table-column
        prop="resArea"
        label="面积(㎡)"
        align="center"
        key="mianji"
      ></el-table-column>
      <el-table-column
        prop="createTime"
        label="申请时间"
        align="center"
        width="200"
      >
        <template slot-scope="scope">
          {{
            (scope.row.createTime &&
              common.formatTime(scope.row.createTime, "yyyy-MM-dd HH:mm:ss")) ||
              "--"
          }}
        </template>
      </el-table-column>
      <el-table-column
        prop="resPrice"
        :label="'单价'"
        align="center"
        width="150"
        key="danjjia"
      >
        <template slot-scope="scope">
          {{
            common.moneyFormatter("", "", scope.row.resPrice) +
              (scope.row.billingCycle && scope.row.billingMethod
                ? "元/" + scope.row.chargecycle + "/" + scope.row.ct2
                : "元/" + "--" + "/" + "--")
          }}
        </template>
      </el-table-column>
      <el-table-column
        prop="limitday"
        label="剩余使用时间(天)"
        width="150"
        align="center"
        key="shengyushiyong1"
      >
        <template slot-scope="scope">
          <span
            :style="{
              color:
                scope.row.limitday || scope.row.limitday == 0
                  ? scope.row.limitday <= 0
                    ? 'red'
                    : scope.row.limitday <= 30
                    ? 'orange'
                    : ''
                  : ''
            }"
            >{{
              scope.row.limitday || scope.row.limitday == 0
                ? scope.row.limitday
                : "--"
            }}</span
          >
        </template>
      </el-table-column>
      <el-table-column
        prop="amount"
        :label="priceType == 1 ? '租金(元)' : `逾期租金(元)`"
        align="center"
      ></el-table-column>
      <el-table-column
        prop="payerName"
        label="付方"
        align="center"
      ></el-table-column>
      <el-table-column
        v-if="isBM && isPay == 0"
        label="操作"
        fixed="right"
        align="center"
        key="caozuo"
        width="100"
      >
        <template slot-scope="scope">
          <div
            v-show="scope.row.isPay == '0' && scope.row.amount != 0"
            class="table-btn green"
            @click="payment(scope.row)"
          >
            缴费
          </div>
        </template>
      </el-table-column>
    </el-table>

    <el-table
      v-else
      class="my-table"
      :data="resList"
      style="width: 100%"
      stripe
      ref="multipleTable"
      ><el-table-column
        prop="createTime"
        label="记录时间"
        align="center"
        width="200"
        key="jilushijian"
      >
        <template slot-scope="scope">
          {{
            (scope.row.createTime &&
              common.formatTime(scope.row.createTime, "yyyy-MM-dd HH:mm:ss")) ||
              "--"
          }}
        </template>
      </el-table-column>
      <el-table-column
        prop="eduTypeName"
        label="资源类型"
        align="center"
      ></el-table-column>
      <el-table-column
        prop="resName"
        label="资源编号"
        align="center"
      ></el-table-column>
      <el-table-column
        prop="limitday"
        label="剩余使用时间(天)"
        width="150"
        align="center"
        key="shengyu"
      >
        <template slot-scope="scope">
          <span
            :style="{
              color:
                scope.row.limitday || scope.row.limitday == 0
                  ? scope.row.limitday <= 0
                    ? 'red'
                    : scope.row.limitday <= 30
                    ? 'orange'
                    : ''
                  : ''
            }"
            >{{
              scope.row.limitday || scope.row.limitday == 0
                ? scope.row.limitday
                : "--"
            }}</span
          >
        </template>
      </el-table-column>

      <el-table-column
        prop="priceNum"
        :label="'数值(' + (priceType == 3 ? '吨' : '度') + ')'"
        align="center"
        width="150"
        key="shuzhi"
      >
      </el-table-column>
      <el-table-column
        prop="price"
        :label="'单价(元/' + (priceType == 3 ? '吨' : '度') + ')'"
        align="center"
        width="150"
        key="danjjia"
        :formatter="common.moneyFormatter"
      >
      </el-table-column>

      <el-table-column
        prop="amount"
        label="费用(元)"
        align="center"
      ></el-table-column>
      <el-table-column
        prop="payerName"
        label="付方"
        align="center"
      ></el-table-column>

      <el-table-column
        prop="photos"
        label="图片"
        align="center"
        width="100"
        key="tupian"
      >
        <template slot-scope="scope">
          <div v-if="!scope.row.photos">--</div>
          <el-image
            v-else
            :src="viewUrl + scope.row.photos"
            :preview-src-list="[viewUrl + scope.row.photos]"
            fit="contain"
            style="
                width: 50px;
                height: 50px;"
          >
          </el-image>
        </template>
      </el-table-column>

      <el-table-column
        v-if="isBM && isPay == 0"
        label="操作"
        fixed="right"
        align="center"
        key="caozuo"
        width="100"
      >
        <template slot-scope="scope">
          <div
            v-show="scope.row.isPay == '0' && scope.row.amount != 0"
            class="table-btn green"
            @click="payment(scope.row)"
          >
            缴费
          </div>
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
import {
  eduTypeList,
  eduResourceAmountPageQuery,
  eduResourceAmountPay
} from "@/assets/js/api";

export default {
  name: "ResFee",
  props: {
    identity: String
  },
  components: {
    confirmDialog: () => import("@/components/confirmDialog")
  },
  computed: {
    isBM() {
      return this.identity === "bm";
    },
    viewUrl() {
      return this.$store.state.viewUrl;
    }
  },
  data() {
    return {
      totalPage: 1,
      limit: 10,
      currentPage: 1,
      activeName: "1",
      resList: [], //申请列表
      form: {},
      isPay: "0",
      priceType: "1",
      searchForm: {},
      loading: false,
      resTypeList: [],
      downUrl: window.g.ApiUrl3 + "rest/FileOut/down?ID="
    };
  },
  methods: {
    // 批量导出
    downTemp() {
      const filter = {
        name: this.searchForm.name || undefined,
        eduTypeId: this.searchForm.eduTypeId || undefined,
        isPay: this.isPay,
        priceType: this.priceType
      };

      const loading = this.$loading({
        lock: true,
        text: "导出中",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.7)"
      });
      let url = "/eduResourceAmount/exportAmount";
      let fileName = this.isPay == 0 ? "未支付" : "已支付";
      switch (this.priceType) {
        case "1":
          fileName += "租金";
          break;
        case "2":
          fileName += "逾期租金";
          break;
        case "3":
          fileName += "水费";
          break;
        case "4":
          fileName += "电费";
          break;
        default:
          break;
      }
      this.util.exportFile(url, false, filter, fileName, "xlsx");
      loading.close();
    },
    //下载转账单
    downForm() {
      this.util
        .postAjax({
          code: this.global.code,
          url: "/rules/findByCode",
          data: {
            code: "BILLTEMPLATEID"
          }
        })
        .then(res => {
          if (res.success == true) {
            window.open(this.downUrl + res.item.rulevalue, "_blank");
          }
        });
    },
    //缴费
    payment(row) {
      this.$confirm("确定缴费吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          eduResourceAmountPay(row.id).then(res => {
            if (res.success == true) {
              this.getList(this.currentPage);
              this.$message({
                type: "success",
                message: "缴费成功"
              });
            } else {
              this.$message({
                type: "error",
                message: res.data.message || "内部错误"
              });
            }
          });
        })
        .catch(() => {});
    },
    //获取资源类型列表
    getResTypeList() {
      this.loading = true;
      eduTypeList({})
        .then(res => {
          this.loading = false;
          if (res.success == true) {
            this.resTypeList = res.data;
            this.getList(this.currentPage);
          }
        })
        .catch(e => {
          this.loading = false;
        });
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
      const filter = {
        resName: this.searchForm.name || undefined,
        eduTypeId: this.searchForm.eduTypeId || undefined,
        isPay: this.isPay,
        priceType: this.priceType
      };

      const params = {
        page: page || this.currentPage,
        limit: this.limit,
        filter
      };
      eduResourceAmountPageQuery(params)
        .then(res => {
          this.loading = false;
          if (res.success == true) {
            this.resList = res.data;
            this.totalPage = res.total;

            this.resList.forEach(r => {
              let chargecycle = r.billingCycle + "";
              let chargetype = r.billingMethod + "";
              this.common.chargecycleFormatter(chargecycle, r);
              this.common.chargetypeFormatter2(chargetype, r, "ct2", "ct1");
            });
          }
        })
        .catch(e => {
          this.loading = false;
        });
    },

    //tab切换
    handleClick() {
      this.currentPage = 1;
      this.getList(1);
      this.$nextTick(() => {
        this.$refs.multipleTable.doLayout();
      });
    }
  },
  created() {
    this.getResTypeList();
  }
};
</script>

<style scoped lang="scss">
.title-right {
  float: right;
  cursor: pointer;
  img {
    width: 14px;
    height: 14px;
  }
  span {
    display: inline-block;
    margin: auto 0;
  }
}
</style>
