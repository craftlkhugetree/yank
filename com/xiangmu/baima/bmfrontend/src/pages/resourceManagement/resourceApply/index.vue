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
      <span class="reset-icon" @click="reSet">
        <i class="el-icon-refresh-right" style="margin-right: 5px"></i>重置
      </span>
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

      <el-table-column prop="liveinfo" label="入驻信息" align="center">
        <el-table-column
          prop="liveinfo.orgName"
          label="学院名称"
          width="200"
          align="center"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column
          align="center"
          prop="liveinfo.projectName"
          label="项目名称"
          width="200"
          show-overflow-tooltip
        >
          <!-- <template slot-scope="scope">
            <el-tooltip class="item" effect="dark" :content="scope.row.liveinfo.projectname" placement="right">
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
          label="退租时间"
          width="200"
          align="center"
        >
          <template slot-scope="scope">
            {{
              common.formatTime(
                scope.row.expectCheckoutTime,
                "yyyy-MM-dd HH:mm:ss"
              )
            }}
          </template>
        </el-table-column>
        <el-table-column
          prop="liveinfo.waterFee"
          label="待缴水费(元)"
          :formatter="common.moneyFormatter"
          align="center"
          width="90"
        ></el-table-column>
        <el-table-column
          prop="liveinfo.eleFee"
          label="待缴电费(元)"
          :formatter="common.moneyFormatter"
          align="center"
          width="90"
        ></el-table-column>
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
                scope.row.liveinfo && scope.row.liveinfo.limitday
                  ? scope.row.liveinfo.limitday
                  : ""
              }}</span
            >
          </template>
        </el-table-column>
      </el-table-column>
      <!-- <el-table-column prop="usestatus" label="入驻状态" align="center">
        <template slot-scope="scope">
          <span :class="common.useColor('', '', scope.row.usestatus)">{{
            common.useStateFormatter("", "", scope.row.usestatus)
          }}</span>
        </template>
      </el-table-column> -->
      <el-table-column label="操作" fixed="right" width="280" align="center">
        <template slot-scope="scope">
          <!-- <div
            v-if="scope.row.usestatus == '3'"
            class="table-btn orange"
            @click="repair('add', scope.row)"
          >
            报修
          </div> -->
          <div class="table-btn green" @click="goDetail(scope.row)">
            详情
          </div>
          <!-- 续租：已入驻 并且 没有续租申请 并且 没有 退租申请 并且 剩余时间小于30天 -->
          <!-- scope.row.liveinfo.limitday > 0 && -->
          <div
            v-if="
              scope.row.useType != '3' &&
                scope.row.useType != '2' &&
                scope.row.limitday <= 30
            "
            class="table-btn blue"
            @click="operateApply('continue', scope.row)"
          >
            续租
          </div>
          <!-- 退租：已入驻 并且 没有续租申请 并且 没有 退租申请 -->
          <div
            v-if="scope.row.useType != '3' && scope.row.useType != '2'"
            class="table-btn pink"
            @click="checkOut(scope.row.id)"
          >
            退租
          </div>

          <!-- <div v-if="scope.row.resstatus =='2'" class="table-btn purple" @click="changeStatus('1','single',scope.row.id)">开启</div>
          <div v-else class="table-btn purple" @click="changeStatus('2','single',scope.row.id)">关闭</div>-->
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
        ref="child"
        :resListParams="resListParams"
        :form="form"
        :formLabelWidth="formLabelWidth"
        :resTypeList="resTypeList"
        :dialogType="dialogType"
        @submitDiag="submitDiag"
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

    <confirm-dialog
      diagTitle="确认退租？"
      diagBody="一旦退租后便不可再使用，确定退租吗？"
      :dVisible="dVisible"
      :hasCancel="true"
      v-if="dVisible"
      @confirm="doSubmit"
    ></confirm-dialog>
  </div>
</template>

<script>
import {
  eduResourceReCheckin,
  eduResourceCheckoutApply,
  eduTypeList,
  eduApplySave
} from "@/assets/js/api";

export default {
  name: "MyApply",
  components: {
    applyForm: () => import("./resApplyDialog"),
    confirmDialog: () => import("@/components/confirmDialog")
  },
  data() {
    return {
      resListParams: [],
      id: "",
      dVisible: false,
      totalPage: 1,
      limit: 10,
      currentPage: JSON.parse(sessionStorage.getItem("currentPage")) || 1,
      orderBy: null,
      sort: null,
      activeName: sessionStorage.getItem("activeName") || "1",
      searchForm: {},
      applyList: [], //申请列表
      applyFormVisible: false,
      form: {},
      formLabelWidth: "120px",
      formLabelWidth2: "100px",
      applyStatus: this.options.applyStatus, //状态列表
      codeList: JSON.parse(sessionStorage.getItem("codeList")), //资源编号列表
      dialogType: "", //弹框类型
      groupList: JSON.parse(sessionStorage.getItem("groupList")), //学院列表
      resTypeList: [], //资源类型列表
      activeResType: "", //默认资源id
      resList: [], //资源列表
      resListNoPage: [], //资源列表无分页
      selectedIds: "", //多选框值
      // userid:this.userInfo,
      loading: false,
      applyTitle: "",
      resTypeDetail: {},
      repairFormVisible: false,
      repairform: {},
      endApplyTime: "" //申请单退租时间
    };
  },

  computed: {
    userInfo() {
      return this.$store.state.userInfo;
    }
  },

  methods: {
    //排序
    sortChange(column, prop, order) {
      this.orderBy = column.prop.toUpperCase();
      // console.log(this.orderBy);
      switch (column.order) {
        case "ascending":
          this.sort = "asc";
          break;
        case "descending":
          this.sort = "desc";
          break;
      }
      this.currentPage = 1;
      this.getList(this.currentPage);
      this.getListNoPage();
    },

    // 列表查询
    getList(page) {
      const filter = {
        name: this.searchForm.name || undefined,
        eduTypeId: this.searchForm.eduTypeId || undefined
      };
      const data = {
        page: page || this.currentPage,
        limit: this.limit,
        filter
      };
      this.util
        .postAjax({
          code: this.global.code,
          url: "/eduResource/myResource",
          data,
          isRep: true
        })
        .then(res => {
          if (res && res.success) {
            this.resList = res.data;
            this.totalPage = res.total;

            this.resList.forEach(r => {
              const obj =
                this.resTypeList.find(t => t.id === r.eduTypeId) || {};
              r.typeName = obj.name || "";
              r.rules = obj.rules || "";
              r.resName = r.name;

              let chargecycle = r.billingCycle + "";
              let chargetype = r.billingMethod + "";
              this.common.chargecycleFormatter(chargecycle, r);
              this.common.chargetypeFormatter(chargetype, r);
              this.common.chargetypeFormatter2(chargetype, r, "ct2", "ct1");

              [r.waterFee, r.eleFee] = r.amounts.reduce(
                (pre, item) => {
                  return [
                    pre[0] +
                      (item.priceType == 3 && item.isPay == 0
                        ? item.amount
                        : 0),
                    pre[1] +
                      (item.priceType == 4 && item.isPay == 0 ? item.amount : 0)
                  ];
                },
                [0, 0]
              );

              r.liveinfo = r;
            });
          }
          this.$nextTick(() => {
            this.$refs.multipleTable.doLayout();
          });
        });
    },

    //查询
    search() {
      this.currentPage = 1;
      this.getList(this.currentPage);
    },

    //重置
    reSet() {
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
        path: `resource-apply/detail/${row.id}`,
        query: {
          restypeid: row.eduTypeId,
          currentPage: this.currentPage,
          activeName: this.activeName,
          limitday: row.limitday
        }
      });
    },

    doSubmit() {
      eduResourceCheckoutApply({ id: this.id }).then(res => {
        if (res && res.success) {
          this.dVisible = false;
          this.$message({
            type: "success",
            message: "退租申请成功"
          });
          this.getList(this.currentPage);
        } else {
          this.$message({
            type: "warning",
            message: res.data.message
          });
        }
      });
    },
    //一键退租
    checkOut(id) {
      this.dVisible = true;
      this.id = id;
      // this.$confirm("一旦退租后便不可再使用，确定退租吗？", "确认退租？", {
      //   confirmButtonText: "确定",
      //   cancelButtonText: "取消",
      //   type: "warning"
      // })
      //   .then(() => {
      //     /*let params={
      //       resid:row.id
      //     };*/

      //     this.loading = true;
      //     this.util
      //       .postAjax({
      //         code: this.global.code,
      //         url: "/spres/saveCheckOut",
      //         // isRep:true,
      //         data: {
      //           resId: id
      //         }
      //       })
      //       .then(res => {
      //         this.loading = false;
      //         // console.log(res);
      //         if (res.success == true) {
      //           this.getList(this.currentPage);
      //           this.getListNoPage();
      //           this.$message({
      //             type: "success",
      //             message: "已提交退租申请，请等待基地审批!"
      //           });
      //         } else {
      //           this.$message({
      //             type: "warning",
      //             message: res.data.message
      //           });
      //         }
      //       });
      //   })
      //   .catch(() => {
      //     this.loading = false;
      //   });
    },

    //获取资源列表
    getListNoPage() {
      this.loading = true;
      this.util
        .postAjax({
          code: this.global.code,
          url: "/spres/pageList",
          data: {
            params: JSON.stringify({
              page: 1,
              limit: 10000,
              restypeid: this.activeResType,
              usestatus: this.searchForm.usestatus,
              userid: this.searchForm.usestatus == 3 ? this.userInfo.ID : null,
              resstatus: this.searchForm.usestatus == 1 ? "1" : null
            })
          }
        })
        .then(res => {
          this.loading = false;
          if (res.success == true) {
            // console.log(res);
            this.resListNoPage = res.items;
          }
        });
    },

    //打开弹框
    operateApply(type, row) {
      this.loading = true;
      this.dialogType = type;

      switch (type) {
        case "add":
          this.applyTitle = "资源申请新增(请在审批后5个工作日内办理入驻)";
          break;
        case "edit":
          this.applyTitle = "资源申请编辑(请在审批后5个工作日内办理入驻)";
          break;
        case "continue":
          this.applyTitle = "续租申请(请在审批后5个工作日内办理入驻)";
          break;
      }
      eduResourceReCheckin({ id: row.id })
        .then(res => {
          if (res && res.success) {
            this.form = res.data;
            this.form.ct2 = this.resTypeList.find(
              r => r.id === this.form.eduTypeId
            ).ct2;
            this.form.chargecycle = this.resTypeList.find(
              r => r.id === this.form.eduTypeId
            ).chargecycle;
            this.form.ct1 = this.resTypeList.find(
              r => r.id === this.form.eduTypeId
            ).ct1;
            this.form.rules = this.resTypeList.find(
              r => r.id === this.form.eduTypeId
            ).rules;
            this.form.eduResourceIds = [row.id];
            this.form.areas = row.area;
            this.form.classfeeLeader = this.userInfo.ID;
            this.form.classfeeLeaderName = this.userInfo.NAME;
            this.resListParams = res.data.resources;
            this.applyFormVisible = true;
          } else {
            this.$message({
              type: "warning",
              message: res.data.message
            });
          }
          this.loading = false;
        })
        .catch(e => {
          this.loading = false;
        });
    },

    submitDiag() {
      this.innerSubmit(this.dialogType);
    },
    //提交
    submit(type) {
      this.$refs.child.$refs.form.validate(valid => {
        if (valid) {
          let form = this.$refs.child.form;
          if (form.projectStarttime > form.projectEndtime) {
            this.$message({
              type: "warning",
              message: "项目开始时间不能晚于结束时间"
            });
            return;
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
          this.loading = false;
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
          this.getList(1);
        }
      });
    }
  },
  created() {
    this.getResTypeList();
    // this.common.getGroupList();
  },

  beforeDestroy() {
    sessionStorage.removeItem("currentPage");
    sessionStorage.removeItem("activeName");
  }
};
</script>

<style scoped></style>
