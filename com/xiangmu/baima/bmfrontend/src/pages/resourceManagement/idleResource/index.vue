<template>
  <div class="common-content">
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

      <div class="title-left">
        <div
          @click="applyProcess"
          class="batchImg orange"
          style="margin-left: 10px"
        >
          <el-image-viewer
            v-if="showViewer"
            :on-close="closeViewer"
            :url-list="srcList"
          ></el-image-viewer>
          <i class="el-icon-question"></i>
          <span>申请流程</span>
        </div>
        <div
          @click.stop="batch"
          class="my-button green batchImg"
          style="margin-left: 10px"
        >
          <img :src="require(`st@tic/images/batch_approve.png`)" />
          <span>批量申请</span>
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
      @selection-change="handleSelectionChange"
      v-loading="loading"
      empty-text=" "
    >
      <el-table-column
        type="selection"
        width="55"
        align="center"
        fixed="left"
      ></el-table-column>
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
        width="100"
        align="center"
      ></el-table-column>

      <el-table-column prop="price" :label="'单价'" align="center" width="150">
        <template slot-scope="scope">
          {{
            common.moneyFormatter("", "", scope.row.price) +
              (scope.row.billingCycle && scope.row.billingMethod
                ? "元/" + scope.row.chargecycle + "/" + scope.row.ct2
                : "元/" + "--" + "/" + "--")
          }}
        </template>
      </el-table-column>

      <el-table-column label="操作" fixed="right" width="280" align="center">
        <template slot-scope="scope">
          <div class="table-btn green" @click="goDetail(scope.row)">
            详情
          </div>
          <div class="table-btn blue" @click="operateApply('add', [scope.row])">
            申请
          </div>
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
    <!-- <div class="no-data" v-show="!resList.length">
      <img src="@/../static/images/nodata.png" alt />
    </div> -->
    <!-- empty-text="当前无空闲资源，请及时关注。" -->

    <div v-show="!resList.length" style="text-align:center">
      <img :src="require('st@tic/images/no-message.png')" />
      <div style="margin-top:-60px;color:#999999;font-size:16px">
        当前无空闲资源，请及时关注。
      </div>
    </div>

    <el-dialog
      v-if="dVisible"
      :visible.sync="dVisible"
      :close-on-click-modal="false"
      :modal-append-to-body="false"
      :modal="false"
      :show-close="false"
      width="50%"
    >
      <template #title>
        <div class="diag">
          <img :src="require('st@tic/images/dialog.png')" />
          <span class="diag-title">{{ diagTitle }}</span>
        </div>
      </template>
      <span class="info44">{{ diagBody }}</span>
      <div slot="footer" class="dialog-footer">
        <div
          class="my-button"
          @click="dVisible = false"
          v-if="diagType !== 'same'"
        >
          取 消
        </div>
        <div class="my-button green" @click="submitDiag()">确 定</div>
      </div>
    </el-dialog>

    <!--资源申请弹框-->
    <el-dialog
      class="res-apply-dialog"
      :title="applyTitle"
      v-if="applyFormVisible"
      :visible.sync="applyFormVisible"
      width="750px"
      :close-on-click-modal="false"
    >
      <apply-form
        :resListParams="resListParams"
        ref="child"
        :form="form"
        :formLabelWidth="formLabelWidth"
        :resTypeList="resTypeList"
        :dialogType="dialogType"
        @submitDiag="submitDiag"
        :notRent="true"
      ></apply-form>

      <div slot="footer" class="dialog-footer">
        <div class="my-button" @click="applyFormVisible = false">取 消</div>
        <el-tooltip
          class="item"
          effect="dark"
          content="请确认所有内容填写完整，否则审核无法通过。"
          placement="top"
        >
          <div
            v-if="dialogType == 'add'"
            class="my-button green"
            @click="submit('add')"
          >
            提 交
          </div>
        </el-tooltip>
        <el-tooltip
          class="item"
          effect="dark"
          content="请确认所有内容填写完整，否则审核无法通过。"
          placement="top"
        >
          <div
            v-if="dialogType == 'continue'"
            class="my-button green"
            @click="submit('continue')"
          >
            提 交
          </div>
        </el-tooltip>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  eduApplySave,
  eduResourcePageQuery,
  eduTypeList
} from "@/assets/js/api";
export default {
  name: "idle",
  components: {
    applyForm: () => import("../resourceApply/resApplyDialog"),
    confirmDialog: () => import("@/components/confirmDialog")
  },
  computed: {
    userInfo() {
      return this.$store.state.userInfo;
    }
  },
  data() {
    return {
      resListParams: [],
      showViewer: false,
      srcList: [require("st@tic/images/help-kjzy.png")],
      readchecked: false, //是否已经阅读
      innerVisible: false,
      totalPage: 1,
      limit: 10,
      currentPage: JSON.parse(sessionStorage.getItem("currentPage")) || 1,
      orderBy: null,
      sort: null,
      searchForm: {},
      applyList: [], //申请列表
      applyFormVisible: false,
      form: {},
      formLabelWidth: "120px",
      formLabelWidth2: "100px",
      dialogType: "", //弹框类型
      resTypeList: [], //资源类型列表
      activeResType: "", //默认资源id
      resList: [], //资源列表
      selectedIds: "", //多选框值
      selected: [], //多选框值
      // userid:this.userInfo,
      loading: false,
      applyTitle: "",
      endApplyTime: "", //申请单退租时间
      diagType: "",
      diagTitle: "",
      diagBody: "",
      dVisible: false
    };
  },
  methods: {
    // 申请流程
    applyProcess() {
      this.showViewer = true;
      // let addr = `svn://160.255.0.56/01module/bsermip/02doc/操作手册/白马基地科教资源管理系统--白马办.docx`
    },
    // 关闭查看器
    closeViewer() {
      this.showViewer = false;
    },
    // 批量申请
    batch() {
      if (!this.selectedIds) {
        this.$message({
          type: "warning",
          message: "请先选择资源"
        });
        return;
      }
      if (!this.normalize(this.selected)) {
        this.diagType = "same";
        this.diagTitle = "请选择同一类型资源";
        this.diagBody = "批量申请时，请选择同一类型资源进行申请。";
        this.dVisible = true;
        return;
      }
      this.operateApply("add", this.selected);
    },
    // 对话框
    submitDiag() {
      if (this.diagType === "same") {
        this.dVisible = false;
      } else {
        this.innerSubmit(this.dialogType);
      }
    },

    //多选框
    handleSelectionChange(val) {
      let arr = [];
      val.forEach(v => {
        arr.push(v.id);
      });
      this.selected = val;
      this.selectedIds = arr.join(",").toString();
    },

    // 类型是否唯一
    normalize(arr) {
      if (arr && arr.length) {
        const obj = {};
        arr.forEach(a => {
          if (obj[a.eduTypeId]) {
            obj[a.eduTypeId]++;
          } else {
            obj[a.eduTypeId] = 1;
          }
        });
        return Object.keys(obj).length === 1;
      }
      return false;
    },

    //查询
    search() {
      this.currentPage = 1;
      this.getList(this.currentPage);
    },

    //重置
    reset() {
      this.searchForm = {};
      this.currentPage = 1;
      this.getList(this.currentPage);
    },

    timeFormatter(row, column, cellValue) {
      if (cellValue == null) {
        return "--";
      } else {
        return this.util.formatTime(cellValue, "yyyy.MM.dd hh:mm:ss");
      }
    },

    //表格内日期格式转化
    dateFormatter(row, column, cellValue) {
      if (cellValue && cellValue.length == 14) {
        return this.util.formatTime(cellValue, "yyyy.MM.dd");
      } else {
        return cellValue;
      }
    },

    //点击分页
    getCurrentChange(currentPage) {
      this.currentPage = currentPage;
      this.getList(currentPage);
    },

    //跳转详情
    goDetail(row) {
      this.$router.push({
        path: `/jump/detail/${row.id}`,
        query: {
          restypeid: row.eduTypeId,
          currentPage: this.currentPage,
          prevPage: "idle"
        }
      });
    },

    //获取资源列表
    getList(page) {
      this.loading = true;
      const filter = {
        useState: 0,
        status: 1,
        name: this.searchForm.name || undefined,
        eduTypeId: this.searchForm.eduTypeId || undefined
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

    //打开弹框
    operateApply(type, rowArr) {
      this.dialogType = type;

      this.form = {
        orgId: this.userInfo.ORGID,
        orgName: this.userInfo.ORGNAME,
        classfeeLeaderName: this.userInfo.NAME,
        classfeeLeader: this.userInfo.ID,
        eduTypeId: rowArr[0].eduTypeId,
        billingCycle: rowArr[0].billingCycle,
        billingMethod: rowArr[0].billingMethod,
        eduTypeName: rowArr[0].typeName,
        eduResourceIds: rowArr.map(r => r.id),
        areas: rowArr.map(r => r.area).join(","),
        rules: rowArr[0].rules,
        rentStartTime: rowArr[0].rentStartTime
      };
      this.form.ct2 = this.resTypeList.find(
        r => r.id === this.form.eduTypeId
      ).ct2;
      this.form.chargecycle = this.resTypeList.find(
        r => r.id === this.form.eduTypeId
      ).chargecycle;
      this.form.ct1 = this.resTypeList.find(
        r => r.id === this.form.eduTypeId
      ).ct1;
      this.applyTitle = "资源申请新增(请在审批后5个工作日内办理入驻)";
      this.resListParams = rowArr;
      this.applyFormVisible = true;
    },

    //提交
    submit(type) {
      if (
        this.$refs.child.form.eduResourceIds &&
        this.$refs.child.form.eduResourceIds.length > this.$refs.child.limitNum
      ) {
        this.$message({
          type: "warning",
          message: "所选资源数超过限制"
        });
        return;
      }
      this.$refs.child.$refs.form.validate(valid => {
        if (valid) {
          let form = this.$refs.child.form;
          if(form.projectStarttime > form.projectEndtime) {
            this.$message({
              type: 'warning',
              message: '项目开始时间不能晚于结束时间'
            })
            return
          }
          let resList = this.$refs.child.resList;
          const resArr =
            resList.filter(r => {
              return form.eduResourceIds.some(e => e == r.id);
            }) || [];
          const arrTmp = resArr.map(r => {
            return {
              eduResourceArea: r.area,
              eduResourceId: r.id,
              eduResourceName: r.name,
              eduResourcePrice: r.price,
              useCycle: form.useCycle,
              cost: this.common.moneyFormatter(
                "",
                "",
                r.billingMethod == 1
                  ? r.price * form.useCycle * r.area
                  : r.price * form.useCycle
              )
            };
          });
          let cost = arrTmp.reduce((pre, item) => {
            return pre + parseFloat(item.cost);
          }, 0);
          let summary = {};
          for (let p in arrTmp[0]) {
            summary[p] = "";
          }
          summary.eduResourceName = "合计";
          summary.cost = cost;
          arrTmp.push(summary);
          // form.resArr = arrTmp;
          this.$refs.child.tableTable = arrTmp;
          this.$refs.child.agreeVisible = true;
          // this.diagType = "warn";
          // this.diagTitle = "提示";
          // this.diagBody = "请确认所有内容填写完整，否则审核无法通过。";
          // this.dVisible = true;
        }
      });
    },

    //弹框内确认
    innerSubmit(type) {
      let form = this.$refs.child.form;

      let form2 = {};
      let useType = null; //使用类型：1入驻，2续租
      let message = "";
      if (type == "add") {
        message = "添加成功";
        useType = 1;
      } else if (type == "edit") {
        message = "编辑成功";
      } else if (type == "continue") {
        message = "续租申请已提交，请等待基地管理员审批";
        useType = 2;
      }
      for (let p in form) {
        form2[p] = form[p];
      }
      form2.useType = useType;
      let a0 = this.util.formatTime(form.projectStarttime, "yyyy-MM-dd");
      let a1 = this.util.formatTime(form.projectEndtime, "yyyy-MM-dd");
      form2.projectStarttime = this.util.formatTime(
        this.util.formatMYD(new Date(a0)),
        // this.util.formatMYD(this.$refs.child.value1[0]),
        "yyyyMMdd"
      );
      form2.projectEndtime = this.util.formatTime(
        this.util.formatMYD(new Date(a1)),
        // this.util.formatMYD(this.$refs.child.value1[1]),
        "yyyyMMdd"
      );
      const loading = this.$loading({
        lock: true,
        text: "提交中",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.7)"
      });

      eduApplySave(form2)
        .then(res => {
          loading.close();
          if (res.success == true) {
            this.$refs.child.agreeVisible = false;
            this.applyFormVisible = false;
            this.$message({
              type: "success",
              message: message
            });
            // this.currentPage = 1;
            // this.getList(this.currentPage);
            this.$router.push("/my-apply");
          } else {
            this.$message({
              type: "warning",
              message: res.data.message
            });
          }
        })
        .catch(e => loading.close());
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
.title-left {
  float: right;
  display: flex;
  flex-wrap: nowrap;
  align-items: center;
  .batchImg {
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
  .orange {
    display: flex;
    align-items: center;
    border: none;
    background-color: inherit;
    color: #faac16;
  }
}

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

.info44 {
  width: 341px;
  height: 20px;
  overflow-wrap: break-word;
  color: rgba(31, 35, 47, 1);
  font-size: 14px;
  letter-spacing: -0.12098753452301025px;
  text-align: left;
  white-space: nowrap;
  line-height: 20px;
  display: block;
  margin: 20px 0 0 0;
}
.diag {
  width: 121px;
  height: 27px;
  text-align: left;
  img {
    vertical-align: middle;
    width: 29px;
    height: 27px;
  }
  .diag-title {
    vertical-align: middle;
    height: 25px;
    margin-top: 1px;
    width: 72px;
  }
}
/deep/ .el-table__empty-block {
  display: none;
}
</style>
