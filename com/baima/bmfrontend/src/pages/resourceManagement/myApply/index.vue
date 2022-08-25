<template>
  <div class="common-content">
    <div class="search-group">
      <!--搜索框-->
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

      <div class="my-button green title-right" @click="downForm">
        <!--        <i class="el-icon-plus"></i>-->
        <span>下载转账单</span>
      </div>
    </div>

    <!-- <div class="my-tab-wrap">
      <el-tabs class="my-el-tabs" v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="待审批" name="1"></el-tab-pane>
        <el-tab-pane label="已审批" name="2"></el-tab-pane>
      </el-tabs>
    </div> -->

    <!--表格-->
    <el-table
      class="my-table"
      :data="applyList"
      style="width: 100%"
      stripe
      v-loading="loading"
    >
      <!--        <el-table-column prop="name" label="申请编号" width="180"></el-table-column>-->
      <!--      <el-table-column label="序号" align="center" type="index"></el-table-column>-->
      <el-table-column
        prop="useType"
        label="申请类型"
        align="center"
        :formatter="common.useTypeFormatter"
      ></el-table-column>
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
        prop="projectName"
        label="项目名称"
        align="center"
        width="300"
        show-overflow-tooltip
      ></el-table-column>
      <el-table-column prop="useCycle" label="使用时长" align="center">
        <template slot-scope="scope">
          {{ common.cycleUnit(scope.row) }}
        </template>
      </el-table-column>
      <el-table-column prop="approver" label="审批人" align="center">
        <!-- v-if="activeName == 2" -->
        <template slot-scope="scope">
          <!-- {{
            (
              $store.state.leaderList.find(l => l.id === scope.row.approver) ||
              {}
            ).name || "--"
          }} -->
          {{ charger(scope.row) }}
        </template>
      </el-table-column>
      <!-- <el-table-column prop="applystatus" label="状态" align="center">
        <template slot-scope="scope">
          <span :class="common.statusColor('', '', scope.row.applystatus)">{{
            common.processFormatter("", "", scope.row.applystatus)
          }}</span>
        </template>
      </el-table-column> -->

      <el-table-column prop="id" label="协议" align="left" width="150">
        <template slot-scope="scope">
          <div v-if="scope.row.useType != 3" class="table-center">
            <img
              class="table-img-attachment"
              src="../../../../static/images/attachment-icon.png"
              alt=""
            />
            <span
              class="table-text-download"
              @click="downloadAgreement(1, scope.row)"
              >{{ scope.row.projectName }}协议</span
            >
          </div>
          <div v-else>--</div>
        </template>
      </el-table-column>

      <el-table-column
        prop="id"
        label="进驻/退出交接单"
        width="150"
        align="left"
      >
        <template slot-scope="scope">
          <!-- <div v-if="scope.row.useType != 3"> -->
          <div class="table-center">
            <img
              class="table-img-attachment"
              src="../../../../static/images/attachment-icon.png"
              alt=""
            />
            <span
              class="table-text-download"
              @click="downloadApplyForm(1, scope.row)"
              >{{ scope.row.projectName }}交接单</span
            >
          </div>
        </template>
      </el-table-column>

      <el-table-column label="操作" fixed="right" width="200" align="center">
        <template slot-scope="scope">
          <!--          <div v-if ="scope.row.applystatus ==0" class="table-btn orange" @click="operateApply('edit',scope.row)">编辑</div>-->
          <div class="table-btn green" @click="goDetail(scope.row.id)">
            详情
          </div>
          <div
            class="table-btn pink"
            @click="withDraw(scope.row)"
            v-if="scope.row.status == 1 && scope.row.useType != 3"
          >
            撤回
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
      diagTitle="提示"
      diagBody="确定要撤回申请吗？"
      :dVisible="dVisible"
      :hasCancel="true"
      v-if="dVisible"
      @confirm="doSubmit"
    ></confirm-dialog>
    <agreement-form
      style="margin-left: -2000px"
      ref="agree"
      :hasSignature="true"
      v-show="isDomShow"
      :tableTable="tableTable"
      :dialogType="dialogType"
      :resTypeDetail="resTypeDetail"
    ></agreement-form>
    <handover-sheet
      style="margin-left: -2000px"
      v-show="handover"
      :form="resTypeDetail"
    >
    </handover-sheet>
  </div>
</template>

<script>
import {
  eduApplyPageQuery,
  eduTypeList,
  eduApplyWithdraw
} from "@/assets/js/api";
export default {
  name: "applyRecord",
  components: {
    handoverSheet: () => import("@/components/handoverSheet"),
    confirmDialog: () => import("@/components/confirmDialog"),
    agreementForm: () => import("../resourceApply/agreementForm")
  },
  data() {
    return {
      tableTable: [],
      isDomShow: false,
      handover: false,
      resTypeDetail: {},
      dVisible: false,
      row: {},
      activeName:
        (JSON.parse(sessionStorage.getItem("activeName")) || "1") + "",
      resTypeList: [],
      totalPage: 1,
      limit: 10,
      currentPage:
        parseInt(JSON.parse(sessionStorage.getItem("currentPage")) || 0) || 1,
      searchForm: {},
      applyList: [], //申请列表
      dialogFormVisible: false,
      form: {},
      formLabelWidth: "120px",
      dialogType: "", //弹框类型
      downUrl: window.g.ApiUrl3 + "rest/FileOut/down?ID=",
      loading: false
    };
  },
  computed: {
    charger() {
      return function(row) {
        let obj =
          this.$store.state.leaderList.find(l => l.id === row.approver) || {};
        let name;
        if (row && row.events && row.events.length && row.events[0].eventType != 1) {
          name = row.events[0].createName || name;
        }
        return name || "--";
      };
    }
  },
  methods: {
    //交接单操作
    downloadApplyForm(type, row) {
      // console.log(id);
      // type 1下载2预览
      // this.util
      //   .getUrlByCode(this.global.code, "/spapply/applyForm")
      //   .then(res => {
      //     window.open(res + "?id=" + id + "&type=" + type);
      //   });
      this.resTypeDetail = row;
      this.handover = true;
      let that = this;
      this.$nextTick(() =>
        that.common.transToPdf(
          this.resTypeDetail.projectName + "交接单",
          "handover",
          that
        )
      );
    },

    //协议操作
    downloadAgreement(type, row) {
      // type 1下载2预览
      // this.util
      //   .getUrlByCode(this.global.code, "/spapply/applyRules")
      //   .then(res => {
      //     window.open(res + "?id=" + row.id + "&type=" + type);
      //   });
      this.resTypeDetail = row;
      this.tableTable = row.resArr;
      this.isDomShow = true;
      let that = this;
      this.common.outPutPdfFn(that, 'agreement', 'item-order', row.projectName + "协议")
      // this.$nextTick(() => {
      //   that.common.transToPdf(row.projectName + "协议", "agreement", that);
      // });
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
            // console.log(res);
            window.open(this.downUrl + res.item.rulevalue, "_blank");
          }
        });
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
      this.getList(1);
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

    //跳转申请记录详情
    goDetail(id) {
      this.$router.push({
        path: `my-apply/detail/${id}`,
        query: {
          activeName: this.activeName,
          currentPage: this.currentPage
        }
      });
    },

    doSubmit() {
      eduApplyWithdraw({ eduApplyId: this.row.id }).then(res => {
        if (res.success == true) {
          this.$message({
            type: "success",
            message: "撤回成功"
          });
          this.dVisible = false;
          this.currentPage = 1;
          this.getList(1);
        } else {
          this.$message({
            type: "warning",
            message: res.data.message
          });
        }
      });
    },
    // 撤回
    withDraw(row) {
      this.dVisible = true;
      this.row = row;
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
            this.common.chargetypeFormatter(chargetype, r);
            this.common.chargetypeFormatter2(chargetype, r, "ct2", "ct1");
          });
          this.getList(this.currentPage);
        }
      });
    },

    // 获取资源列表
    getList(page) {
      this.loading = true;
      const filter = {
        // status: this.activeName,
        resName: this.searchForm.name || undefined,
        eduTypeId: this.searchForm.eduTypeId || undefined,
        classfeeLeader: this.$store.state.userId,
      };
      const params = {
        page: page || this.currentPage,
        limit: this.limit,
        filter
      };
      eduApplyPageQuery(params)
        .then(res => {
          this.loading = false;
          if (res && res.success) {
            this.applyList = res.data;
            this.totalPage = res.total;

            this.applyList.forEach(r => {
              let chargecycle = r.billingCycle + "";
              let chargetype = r.billingMethod + "";
              this.common.chargecycleFormatter(chargecycle, r);
              this.common.chargetypeFormatter(chargetype, r);
              this.common.chargetypeFormatter2(chargetype, r, "ct2", "ct1");

              // rules
              const obj =
                this.resTypeList.find(item => item.id === r.eduTypeId) || {};
              r.rules = obj.rules;
              r.typeName = r.eduTypeName;
              r.areas = (
                r.resources.map(item => item.eduResourceArea) || []
              ).join(",");
              const tmp = r.resources;
              if (tmp && tmp.length) {
                const arrTmp = tmp.map(t => ({
                  ...t,
                  useCycle: r.useCycle,
                  cost:
                    r.billingMethod == 1
                      ? t.eduResourcePrice * r.useCycle * t.eduResourceArea
                      : t.eduResourcePrice * r.useCycle
                }));
                // 总消费、行合计需要灵活合并单元格
                let cost = arrTmp.reduce((pre, item) => {
                  return pre + item.cost;
                }, 0);
                let summary = {};
                for (let p in tmp[0]) {
                  summary[p] = "";
                }
                summary.eduResourceName = "合计";
                summary.cost = cost;
                arrTmp.push(summary);
                r.resArr = arrTmp;
              }
            });
          }
        })
        .catch(e => {
          this.loading = false;
        });
    },

    //打开编辑弹框
    eidtAudit(row) {
      this.util
        .postAjax({
          code: this.global.code,
          url: "/irapply/findById",
          data: {
            id: row.id
          }
        })
        .then(res => {
          if (res.success == true) {
            // console.log(res);
            this.dialogFormVisible = true;
            let apply = res.item.apply;
            this.form = {
              id: apply.id,
              orgid: apply.orgid,
              projectname: apply.projectname,
              classleaderInfo: JSON.stringify({
                id: apply.classleaderid,
                name: apply.classleadername
              }),
              classleadermobile: apply.classleadermobile,
              eventername: this.options.userInfo.NAME,
              applyermobile: apply.applyermobile,
              worker: apply.worker,
              workermobile: apply.workermobile,
              irrestypeid: apply.irrestypeid,
              irdate: apply.irdate,
              note: apply.note
            };

            let ress = res.item.ress;
            let arr = [];
            ress.forEach(v => {
              arr.push(v.id);
            });
            this.form.resids = arr;

            // console.log("11",this.form);
            /* let events= res.item.events;

             if(apply.applystatus == 0){
               this.form.event.eventnote = apply.note;
             }else {
               events.forEach(v => {
                 if(v.eventtype == 1){
                   this.form.event.eventnote = v.eventnote
                 }
               })
               // this.form.event.eventnote=events[0].eventnote;
             }*/
          }
        });
    },

    //打开弹框
    operateApply(type, row) {
      this.dialogType = type;
      this.form = {
        orgid: this.options.userInfo.ORGID,
        eventername: this.options.userInfo.NAME
      };
      switch (type) {
        case "add":
          this.dialogFormVisible = true;
          break;
        case "edit":
          this.eidtAudit(row);
          break;
      }
    },

    //提交
    submit(type) {
      this.$refs.child.$refs.form.validate(valid => {
        if (valid) {
          // console.log(this.$refs.child.form);
          // return false;
          let form = this.$refs.child.form;
          let form2 = {};
          let url = "";
          let message = "";
          if (type == 0) {
            // form2.note = form.event.eventnote;
            url = "/irapply/saveDraft";
            message = "保存成功";
          } else {
            // form2.event=form.event;
            url = "/irapply/save";
            message = "提交成功";
          }
          if (form.id) {
            form2.id = form.id;
          }
          // form2.owngroupname=form.owngroupname;

          form2.orgid = form.orgid;
          form2.projectname = form.projectname;
          let classleaderInfo = JSON.parse(form.classleaderInfo);
          form2.classleaderid = classleaderInfo.id;
          form2.classleadername = classleaderInfo.name;
          form2.worker = form.worker;
          form2.classleadermobile = form.classleadermobile;
          form2.applyermobile = form.applyermobile;
          form2.workermobile = form.workermobile;
          form2.irrestypeid = form.irrestypeid;
          form2.note = form.note;
          //资源编号格式转换
          let arr = [];
          this.codeList.forEach(m => {
            form.resids.forEach(v => {
              if (m.id == v) {
                arr.push({ resid: v });
              }
            });
          });
          form2.resList = arr;
          form2.irdate = form.irdate
            ? this.util.formatTime(form.irdate, "yyyyMMdd000000")
            : "";

          // console.log("form2",form2);

          // return false;
          this.util
            .postAjax({
              code: this.global.code,
              url: url,
              isRep: true,
              data: form2
            })
            .then(res => {
              if (res.success == true) {
                this.dialogFormVisible = false;
                this.$message({
                  type: "success",
                  message: message
                });
                this.getList(1);
                this.currentPage = 1;
              } else {
                this.$message({
                  type: "warning",
                  message: res.data.message
                });
              }
            });
        }
      });
      // return false;
    },

    //tab切换
    handleClick(row) {
      this.currentPage = 1;
      this.getList(1);
    }
  },
  created() {
    this.getResTypeList();
  },

  beforeDestroy() {
    sessionStorage.removeItem("currentPage");
    sessionStorage.removeItem("activeName");
  }
};
</script>

<style scoped lang="scss">
.title-right {
  float: right;
  // display: flex;
  // flex-wrap: nowrap;
  // align-items: center;
  cursor: pointer;
  .batchImg {
    img {
      width: 14px;
      height: 14px;
    }
    span {
      display: inline-block;
      margin: auto 0;
    }
  }
}
.table-center {
  vertical-align: middle;
  margin: 0 auto;
}
</style>
