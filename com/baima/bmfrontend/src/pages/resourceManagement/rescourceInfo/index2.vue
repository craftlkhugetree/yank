<template>
  <div class="common-content" v-loading="loading">
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
    </div>

    <!--tab切换-->
    <div class="my-tab-wrap">
      <el-tabs class="my-el-tabs" v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="全部" name="1"></el-tab-pane>
        <el-tab-pane label="空闲" name="2"></el-tab-pane>
        <el-tab-pane label="占用" name="3"></el-tab-pane>
      </el-tabs>

      <span style="float: right;">
        <div
          v-if="activeName == 3"
          class="my-button plain-red"
          style="margin-top: 3px;margin-right: 10px"
          @click="changeStatus('3', 'more', null)"
        >
          <img
            class="image"
            style="margin-top: 7px"
            src="@/../static/images/exit.png"
            alt=""
          />
          <span>强制退出</span>
        </div>

        <div v-else>
          <div
            class="my-button plain-green"
            style=""
            @click="changeStatus('1', 'more', null)"
          >
            <img
              class="image"
              style="margin-top: 7px"
              src="@/../static/images/bm-res-open.png"
              alt=""
            />
            <span>批量开放</span>
          </div>
          <div
            class="my-button plain-green"
            style=""
            @click="changeStatus('2', 'more', null)"
          >
            <img
              class="image"
              style="margin-top: 7px"
              src="@/../static/images/bm-res-close.png"
              alt=""
            />
            <span>批量关闭</span>
          </div>
        </div>
      </span>
    </div>

    <el-divider style=""></el-divider>

    <!--表格-->
    <el-table
      class="my-table"
      :data="resList"
      style="width: 100%"
      stripe
      ref="multipleTable"
      @selection-change="handleSelectionChange"
    >
      <el-table-column
        type="selection"
        width="55"
        align="center"
        fixed="left"
        :selectable="selectable"
      ></el-table-column>
      <el-table-column
        prop="typeName"
        label="资源类型"
        align="center"
      ></el-table-column>
      <el-table-column
        prop="resName"
        label="资源编号"
        align="center"
      ></el-table-column>

      <el-table-column
        prop="area"
        label="面积(㎡)"
        align="center"
        v-if="activeName == 2"
        key="mianji"
      ></el-table-column>

      <el-table-column
        prop="price"
        :label="'单价'"
        align="center"
        width="150"
        v-if="activeName == 2"
        key="danjjia"
      >
        <template slot-scope="scope">
          {{
            common.moneyFormatter("", "", scope.row.price) +
              ((scope.row.billingCycle && scope.row.billingMethod || (scope.row.eduType && scope.row.eduType.billingCycle && scope.row.eduType.billingMethod))
                ? "元/" + scope.row.chargecycle + "/" + scope.row.ct2
                : "元/" + "--" + "/" + "--")
          }}
        </template>
      </el-table-column>

      <el-table-column
        prop="status"
        label="资源状态"
        align="center"
        v-if="activeName == 2"
        key="zyzt"
      >
        <template slot-scope="scope">
          <span
            :class="scope.row.status == 0 ? 'status-grey' : 'status-blue'"
            >{{ common.resStateFormatterJump("", "", scope.row.status) }}</span
          >
        </template>
      </el-table-column>

      <el-table-column
        prop="liveinfo"
        label="入驻信息"
        align="center"
        v-if="activeName != 2"
      >
        <el-table-column
          prop="liveinfo.orgName"
          label="学院名称"
          width="200"
          show-overflow-tooltip
          align="center"
        ></el-table-column>
        <el-table-column
          align="center"
          prop="liveinfo.projectName"
          label="项目名称"
          width="200"
          show-overflow-tooltip
        >
          <!-- <template slot-scope="scope">
              <el-tooltip v-if="scope.row.liveinfo.projectname" class="item" effect="dark" :content="scope.row.liveinfo.projectname" placement="right">
                <div style="width: 100%;" class="ellipsis">{{scope.row.liveinfo.projectname}}</div>
              </el-tooltip>
            </template>-->
        </el-table-column>
        <el-table-column
          prop="liveinfo.contacterName"
          label="日常联系人"
          align="center"
          width="120"
        ></el-table-column>
        <el-table-column
          prop="liveinfo.contacterMobile"
          label="联系方式"
          align="center"
          width="120"
        ></el-table-column>
        <el-table-column
          prop="liveinfo.expectCheckoutTime"
          label="退出时间"
          align="center"
          width="200"
        >
          <template slot-scope="scope">
            {{
              (scope.row.expectCheckoutTime &&
                common.formatTime(
                  scope.row.expectCheckoutTime,
                  "yyyy-MM-dd HH:mm:ss"
                )) ||
                ""
            }}
          </template>
        </el-table-column>

        <el-table-column
          prop="liveinfo.limitday"
          label="剩余使用时间(天)"
          width="120"
          align="center"
        >
          <template slot-scope="scope">
            <span
              :style="{
                color:
                  scope.row.liveinfo && scope.row.liveinfo.limitday <= 0
                    ? 'red'
                    : scope.row.liveinfo && scope.row.liveinfo.limitday <= 30
                    ? 'orange'
                    : ''
              }"
              >{{
                scope.row.liveinfo && (scope.row.liveinfo.limitday || scope.row.liveinfo.limitday == 0)
                  ? scope.row.liveinfo.limitday
                  : ""
              }}</span
            >
          </template>
        </el-table-column>
      </el-table-column>

      <el-table-column
        prop="useState"
        label="入驻状态"
        align="center"
        v-if="activeName == 1"
      >
        <template slot-scope="scope">
          <span
            :class="scope.row.useState == 1 ? 'status-blue' : 'status-grey'"
            >{{ scope.row.useState == 1 ? "占用" : "空闲" }}</span
          >
        </template>
      </el-table-column>

      <el-table-column
        label="操作"
        fixed="right"
        width="280"
        align="center"
        key="caozuo"
      >
        <template slot-scope="scope">
          <div class="table-btn green" @click="goDetail(scope.row)">
            详情
          </div>
          <div
            class="table-btn blue"
            @click="changeStatus('1', 'single', scope.row.id)"
            v-if="scope.row.status == 0 && scope.row.useState == 0"
          >
            开放
          </div>
          <div
            class="table-btn blue"
            @click="changeStatus('2', 'single', scope.row.id)"
            v-if="scope.row.status == 1 && scope.row.useState == 0"
          >
            关闭
          </div>
          <div
            v-if="scope.row.useState == '1'"
            class="table-btn pink"
            @click="changeStatus('3', 'single', scope.row.id)"
          >
            强制退出
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

    <confirm-dialog
      diagTitle="确认要强制退出吗？"
      :diagBody="diagBody"
      :dVisible="dVisible"
      :hasCancel="true"
      v-if="dVisible"
      @confirm="doSubmit"
    ></confirm-dialog>
  </div>
</template>

<script>
import {
  eduTypeList,
  eduResourceResourceCheckList,
  batchOpen,
  batchClose,
  forceCheckoutBatch
} from "@/assets/js/api";
export default {
  name: "CheckinList",
  components: {
    confirmDialog: () => import("@/components/confirmDialog")
  },
  data() {
    return {
      ids: "",
      dVisible: false,
      diagBody: "",
      totalPage: 1,
      limit: 10,
      activeName: sessionStorage.getItem("activeName") || "1",
      currentPage: JSON.parse(sessionStorage.getItem("currentPage")) || 1,
      resList: [], //申请列表
      form: {},
      searchForm: {},
      loading: false,
      selectedIds: "",
      resTypeList: []
    };
  },
  methods: {
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

    //跳转详情
    goDetail(row) {
      this.$router.push({
        path: `/resource-info-management/detail/${row.id}`,
        query: {
          restypeid: row.eduTypeId,
          currentPage: this.currentPage,
          activeName: this.activeName
        }
      });
    },

    changeStatusInner(resstatus, num, id) {
      let ids = "";
      switch (num) {
        case "more":
          ids = this.selectedIds;
          break;
        case "single":
          ids = id;
          break;
      }
      const batchOp = resstatus == 1 ? batchOpen : batchClose;
      if (!ids) {
        this.$message({
          type: "warning",
          message: "请先选择资源"
        });
      } else {
        batchOp({ ids }).then(res => {
          if (res.success == true) {
            this.getList(this.currentPage);

            if (res.errorList && res.errorList.length > 0) {
              let arr = [];
              res.errorList.forEach(v => {
                arr.push(v.name);
              });
              arr = arr.join(",");
              let text = resstatus == "1" ? "资源已开放" : "资源已关闭";
              this.$message({
                type: "success",
                message: "除" + arr + "资源外,其它资源均" + text
              });
            } else {
              this.$message({
                type: "success",
                message: resstatus == "1" ? "资源已开放" : "资源已关闭"
              });
            }
          } else {
            this.$message({
              type: "warning",
              message: res.data.message
            });
          }
        });
      }
    },

    //资源状态开放和关闭
    changeStatus(resstatus, num, id) {
      if (resstatus == 2) {
        this.$confirm("此操作将关闭选中的资源, 是否继续?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
          .then(() => {
            this.changeStatusInner(resstatus, num, id);
          })
          .catch(() => {});
      } else if (resstatus == 1) {
        this.changeStatusInner(resstatus, num, id);
      } else if (resstatus == 3) {
        let ids = "";
        switch (num) {
          case "more":
            ids = this.selectedIds;
            break;
          case "single":
            ids = id + "";
            break;
        }
        this.ids = ids;
        if (!this.ids) {
          this.$message({
            type: "warning",
            message: "请先选择资源"
          });
          return;
        }
        const idArr = ids.split(",");
        let resArr = this.resList.filter(r => idArr.includes(r.id + ""));
        let str = "";
        resArr.forEach(r => {
          str += `#${r.resName},${r.typeName || ""} `;
        });
        this.diagBody = `确定要强制退出资源 ${str} 吗？`;
        this.dVisible = true;
      }
    },
    // 强制退出
    doSubmit() {
      forceCheckoutBatch({ ids: this.ids }).then(res => {
        if (res.success == true) {
          this.$message({
            type: "success",
            message: "强制退出完成"
          });
          this.dVisible = false;
          this.getList(this.currentPage);
        } else {
          this.$message({
            type: "warning",
            message: res.data.message
          });
        }
      });
    },

    //多选框
    handleSelectionChange(val) {
      let arr = [];
      val.forEach(v => {
        arr.push(v.id);
      });
      this.selectedIds = arr.join(",").toString();
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
        name: this.searchForm.name || undefined,
        eduTypeId: this.searchForm.eduTypeId || undefined
      };
      if (1 == this.activeName) {
        // filter.allNode = 'BM'
      } else if (2 == this.activeName) {
        filter.useState = 0;
      } else if (3 == this.activeName) {
        filter.useState = 1;
      }
      const params = {
        page: page || this.currentPage,
        limit: this.limit,
        filter
      };
      eduResourceResourceCheckList(params)
        .then(res => {
          this.loading = false;
          if (res.success == true) {
            this.resList = res.data;
            this.totalPage = res.total;

            this.resList.forEach(r => {
              const obj =
                this.resTypeList.find(t => t.id === r.eduTypeId) || {};
              r.typeName = obj.name || "";
              r.resName = r.name;

              let chargecycle = (r.billingCycle || r.eduType && r.eduType.billingCycle) + "";
              let chargetype = (r.billingMethod || r.eduType && r.eduType.billingMethod) + "";
              this.common.chargecycleFormatter(chargecycle, r);
              this.common.chargetypeFormatter2(chargetype, r, "ct2", "ct1");

              r.liveinfo = r;
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
      // this.$refs.multipleTable.doLayout();
      this.$nextTick(() => {
        this.$refs.multipleTable.doLayout();
      });
    },
    selectable: function(row, index) {
      if (row.useState == 0) {
        return true;
      } else if (this.activeName == 3) {
        return true
      }

      // 函数必须有返回值且是布尔值
      // 页面刷新后该函数会执行 N 次进行判断(N 为表格行数)
      // 如果没有返回值则默认返回false(全部无法选中)
    }
  },
  created() {
    this.getResTypeList();
  },

  beforeDestroy() {
    sessionStorage.removeItem("activeName");
    sessionStorage.removeItem("currentPage");
  }
};
</script>

<style scoped lang="scss">
/deep/ .el-checkbox__input.is-checked .el-checkbox__inner {
  background-color: #00b09b !important;
  border-color: #00b09b !important;
}
/deep/ .el-checkbox__input.is-indeterminate .el-checkbox__inner {
  background-color: #00b09b !important;
  border-color: #00b09b !important;
}
/deep/ .el-checkbox__input.is-checked + .el-checkbox__label {
  color: #00b09b !important;
}
/deep/ .el-checkbox.is-bordered.is-checked {
  border-color: #00b09b !important;
}
/deep/ .el-checkbox__input.is-focus .el-checkbox__inner {
  border-color: #00b09b !important;
}
</style>
