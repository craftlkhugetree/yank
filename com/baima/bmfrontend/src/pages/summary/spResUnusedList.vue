<template>
  <div class="info-detail">
    <div class="back-box title-back">
      <div class="table-btn white" @click="back">返回</div>
      <span>{{ typeName }}</span>
    </div>

    <div class="table-div">
      <!--表格-->
      <el-table
        class="my-table"
        :data="resList"
        style="width: 100%"
        stripe
        ref="multipleTable"
        v-loading="loading"
        empty-text=" "
        :header-cell-style="{ background: '#F3F5F9' }"
      >
        <el-table-column
          prop="typeName"
          label="资源类型"
          align="center"
        ></el-table-column>
        <el-table-column
          prop="name"
          label="资源编号"
          align="center"
        ></el-table-column>
        <el-table-column
          prop="area"
          label="面积(㎡)"
          align="center"
        ></el-table-column>
        <el-table-column prop="price" :label="'单价'" align="center">
          <template slot-scope="scope">
            {{
              common.moneyFormatter("", "", scope.row.price) +
                (scope.row.billingCycle && scope.row.billingMethod
                  ? "元/" + scope.row.chargecycle + "/" + scope.row.ct2
                  : "元/" + "--" + "/" + "--")
            }}
          </template>
        </el-table-column>
      </el-table>

      <!--分页-->
      <div
        class="my-pagination"
        v-if="totalPage > limit"
        style="padding-bottom: 80px"
      >
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
      <div class="no-data" v-show="!resList.length">
        <img src="@/../static/images/nodata.png" alt />
      </div>
    </div>
  </div>
</template>

<script>
import { eduResourcePageQuery, eduTypeList } from "@/assets/js/api";

export default {
  name: "unusedList",
  computed: {
    userInfo() {
      return this.$store.state.userInfo;
    }
  },
  props: {
    typeName: String,
    id: Number | String
  },
  data() {
    return {
      totalPage: 1,
      limit: 10,
      currentPage: 1,
      resTypeList: [],
      resList: [], //资源列表
      loading: false
    };
  },
  methods: {
    back() {
      window.history.go(-1);
    },

    //点击分页
    getCurrentChange(currentPage) {
      this.currentPage = currentPage;
      this.getList(currentPage);
    },

    //获取资源列表
    getList(page) {
      this.loading = true;
      const filter = {
        useState: 0,
        // status: 1,
        eduTypeId: this.id
      };
      const params = {
        page: page || this.currentPage,
        limit: this.limit,
        filter
      };
      eduResourcePageQuery(params)
        .then(res => {
          this.loading = false;
          if (res && res.success) {
            this.resList = res.data;
            this.totalPage = res.total;

            this.resList.forEach(r => {
              const obj =
                this.resTypeList.find(t => t.id === r.eduTypeId) || {};
              r.typeName = obj.name || "";
              r.rules = obj.rules || "";

              let chargecycle = r.billingCycle + "";
              let chargetype = r.billingMethod + "";
              this.common.chargecycleFormatter(chargecycle, r);
              this.common.chargetypeFormatter(chargetype, r);
              this.common.chargetypeFormatter2(chargetype, r, "ct2", "ct1");
            });
          }
        })
        .catch(e => {
          this.loading = false;
        });
    },

    //获取资源类型列表
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
          this.getList(this.currentPage);
        }
      });
    }
  },
  created() {
    this.getResTypeList();
  },

  beforeDestroy() {
    sessionStorage.removeItem("currentPage");
  }
};
</script>

<style scoped lang="scss">
.no-data {
  width: 100%;
  padding: 30px 0;
  border-radius: 5px;
  border: 1px dashed #dbdbdb;
  text-align: center;
  img {
    width: 100px;
    height: 100px;
    vertical-align: middle;
  }
}

.title-back {
  > div {
    margin-left: -10px;
  }
  span {
    font-weight: bold;
    margin-left: 20px;
  }
}

.table-div {
  background: #fff;
  box-shadow: 0px 2px 5px 0px rgba(102, 102, 102, 0.2);
  border-radius: 5px;
  padding: 20px;
  margin-top: 50px;
}
</style>
