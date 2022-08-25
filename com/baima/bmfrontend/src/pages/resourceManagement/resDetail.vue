<template>
  <div class="info-detail" v-loading="loading">
    <!--面包屑-->
    <bread-crumb :breadList="breadList"></bread-crumb>

    <div class="back-box">
      <div class="table-btn white" @click="back">返回</div>
      <div style="float: right">
        <div
          v-if="!isUser && obj && obj.status == 1"
          class="table-btn pink"
          @click="checkOut(id, '1')"
        >
          强制退出
        </div>
        <div
          v-if="prevPage == 'resource-apply' && canOP && limitday <= 30"
          class="table-btn blue"
          @click="norender('continue', id)"
        >
          续租
        </div>
        <div
          v-if="prevPage == 'resource-apply' && canOP"
          class="table-btn pink"
          @click="checkOut(id, '2')"
        >
          退出
        </div>
      </div>
    </div>

    <div class="info-content">
      <el-row :gutter="15">
        <el-col :span="15">
          <div class="res-info">
            <div class="item" style="margin:0 30px 0 0">
              <label>编号:</label>
              <span>{{ resTypeForm.name }}</span>
            </div>

            <div class="item">
              <img src="../../../static/images/bm-info-area.png" alt="" />
              <label>面积</label>
              <span>{{ resTypeForm.area }}㎡</span>
            </div>

            <el-divider direction="vertical"></el-divider>

            <div class="item">
              <img src="../../../static/images/bm-info-price.png" alt="" />
              <label>单价</label>
              <span
                >{{ common.moneyFormatter("", "", resTypeForm.price) }}元/{{
                  typeDetail.chargecycle ? typeDetail.chargecycle : "--"
                }}/{{
                  typeDetail.chargetype ? typeDetail.chargetype : "--"
                }}</span
              >
            </div>

            <el-divider direction="vertical"></el-divider>

            <div class="item">
              <img src="../../../static/images/bm-info-base.png" alt="" />
              <label>设施</label>
              <el-tooltip
                class="item"
                effect="dark"
                :content="resTypeForm.ownInfrastructure"
                placement="top-start"
              >
                <div
                  style="max-width:260px;vertical-align:top;margin-top:1px"
                  class="ellipsis"
                >
                  {{ resTypeForm.ownInfrastructure }}
                </div>
              </el-tooltip>
            </div>
          </div>
          <div class="left-right list-shadow" style="padding: 20px">
            <div style="font-weight: bold;font-size:16px;margin-bottom: 10px">
              水电信息
            </div>
            <!--tab切换-->
            <div class="my-tab-wrap">
              <el-tabs
                class="my-el-tabs"
                v-model="activeName"
                @tab-click="handleClick"
              >
                <el-tab-pane label="水表" name="3"></el-tab-pane>
                <el-tab-pane label="电表" name="4"></el-tab-pane>
              </el-tabs>

              <div
                v-if="!isUser"
                class="my-button green"
                style="float: right;margin-top: 3px;"
                @click="operateApply('add', null)"
              >
                <i class="el-icon-plus"></i>
                <span>新建记录</span>
              </div>
            </div>

            <el-divider></el-divider>

            <!--表格-->
            <el-table
              class="my-table"
              :data="applyList"
              style="width: 100%"
              stripe
            >
              <el-table-column
                prop="createTime"
                label="记录时间"
                align="center"
                :formatter="timeFormatter"
                width="150"
              ></el-table-column>
              <el-table-column
                prop="priceNum"
                :label="activeName == 3 ? '数值(吨)' : '数值(度)'"
                align="center"
              ></el-table-column>
              <el-table-column
                prop="price"
                :label="activeName == 3 ? '单价(元/吨)' : '单价(元/度)'"
                align="center"
                :formatter="common.moneyFormatter"
                width="100"
              ></el-table-column>

              <el-table-column
                prop="amount"
                label="费用(元)"
                align="center"
                :formatter="common.moneyFormatter"
                width="100"
              ></el-table-column>
              <el-table-column
                prop="payerName"
                label="付方"
                align="center"
                width="100"
              ></el-table-column>
              <el-table-column
                prop="photos"
                label="图片"
                align="center"
                width="100"
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
              <el-table-column prop="isPay" label="缴费状态" align="center">
                <template slot-scope="scope">
                  <span
                    :class="
                      scope.row.isPay == 0 ? 'status-orange' : 'status-green'
                    "
                    >{{
                      common.payFormatter("", "", scope.row.isPay + "")
                    }}</span
                  >
                </template>
              </el-table-column>
              <el-table-column
                prop="payTime"
                label="缴费时间"
                align="center"
                width="150"
                :formatter="timeFormatter"
              ></el-table-column>

              <el-table-column
                v-if="!isUser && applyList.some(a => a.isPay == 0)"
                label="操作"
                fixed="right"
                width="220"
                align="center"
              >
                <template slot-scope="scope">
                  <div
                    v-if="scope.row.isPay == '0' && isFirstRecord(scope)"
                    class="table-btn orange"
                    @click="operateApply('edit', scope.row)"
                  >
                    编辑
                  </div>
                  <div
                    v-if="scope.row.isPay == '0' && isFirstRecord(scope)"
                    class="table-btn pink"
                    @click="deletetr(scope.row)"
                  >
                    删除
                  </div>
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
        </el-col>
        <el-col class="right-item" :span="9">
          <div class="check-in-list left-right list-shadow">
            <div class="top">
              {{ prevPage === "resource-apply" ? "当前入驻信息" : "入驻信息" }}
              <div
                v-if="
                  prevPage === 'resource-apply' && resTypeForm.status == '1'
                "
                class="tag"
              >
                已入驻
              </div>
            </div>
            <div class="my-el-divider" style="margin-top: 0"></div>
            <div
              class="list-box my-scroll"
              v-loading="liveLoading"
              v-infinite-scroll="getMore"
              :infinite-scroll-disabled="liveDisabled"
            >
              <live-list
                :liveLoading="liveLoading"
                :finishTable="finishTable"
                :liveList="liveList"
                :prevPage="prevPage"
                @pq="getLiveList"
              ></live-list>
            </div>
          </div>
        </el-col>
      </el-row>
    </div>

    <!--弹框-->
    <el-dialog
      class=""
      :title="
        (activeName == '3' ? '水表' : '电表') +
          '记录' +
          (dialogType2 == 'add' ? '新增' : '编辑')
      "
      v-if="dialogFormVisible2"
      :visible.sync="dialogFormVisible2"
      width="500px"
      :close-on-click-modal="false"
    >
      <pay-form
        ref="child2"
        :form2="form2"
        :formLabelWidth="formLabelWidth2"
        :activeName="activeName"
      ></pay-form>
      <div slot="footer" class="dialog-footer">
        <div class="my-button" @click="dialogFormVisible2 = false">取 消</div>
        <div class="my-button green" @click="paySubmit(1)">提 交</div>
      </div>
    </el-dialog>

    <confirm-dialog
      :diagTitle="diagTitle"
      :diagBody="diagBody"
      :dVisible="dVisible"
      :hasCancel="true"
      v-if="dVisible"
      @confirm="doSubmit"
    ></confirm-dialog>

    <el-dialog
      class="res-apply-dialog"
      :title="applyTitle"
      v-if="applyFormVisible"
      :visible.sync="applyFormVisible"
      width="700px"
      :close-on-click-modal="false"
    >
      <apply-form
        ref="childrender"
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
import payForm from "./rescourceInfo/payDialog";
import liveList from "./rescourceInfo/liveList";
import resForm from "./rescourceInfo/resDialog2";
import breadCrumb from "../../components/breadcrumb";
import {
  find,
  eduResourceUserecordPageQuery,
  eduResourceAmountPageQuery,
  eduResourceFind,
  eduResourceAmountFind,
  eduResourceAmountDelete,
  eduResourceAmountPay,
  eduResourceCheckoutApply,
  eduResourceReCheckin,
  eduTypeList,
  eduApplySave,
  forceCheckoutBatch
} from "@/assets/js/api";

export default {
  name: "detail",
  props: {
    id: String,
    restypeid: String,
    prevPage: String,
    breadList: Array,
    indexCurrentPage: Number | String,
    indexActiveName: String,
    limitday: Number | String
  },
  components: {
    payForm,
    liveList,
    resForm,
    breadCrumb,
    applyForm: () => import("./resourceApply/resApplyDialog"),
    confirmDialog: () => import("@/components/confirmDialog")
  },
  data() {
    return {
      diagType: "",
      diagTitle: "",
      diagBody: "",
      resTypeList: [],
      formLabelWidth: "120px",
      applyTitle: "",
      applyFormVisible: false,
      dVisible: false,
      obj: {},
      liveList: [],
      totalLive: 1,
      totalPage: 0,
      limit: 10,
      finishTable: false,
      currentPage: 1,
      livePage: 1,
      activeName: "3",
      searchForm: {},
      applyList: [], //申请列表
      dialogFormVisible2: false,
      dialogFormVisible: false,
      form2: {},
      form: {},
      lastNum: 0,
      formLabelWidth2: "100px",
      formLabelWidth: "120px",
      dialogType2: "", //弹框类型
      dialogType: "", //弹框类型
      loading: false, //表格加载
      liveLoading: false, //入驻列表加载
      resTypeForm: {},
      dialogLoading: false,
      typeDetail: {},
      disabled: false
    };
  },
  computed: {
    isFirstRecord() {
      return function(row) {
        return 1 == this.currentPage && row.$index === 0
      }
    },
    viewUrl() {
      return this.$store.state.viewUrl;
    },
    canOP() {
      return (
        this.obj.status == 1 &&
        this.obj.apply &&
        this.obj.apply.useType != 2 &&
        this.obj.apply.useType != 3
      );
    },
    isUser() {
      return this.prevPage === "resource-apply" || this.prevPage === "idle";
    },
    liveDisabled() {
      return this.liveLoading || this.finishTable;
    }
  },
  methods: {
    // 无限滚动
    getMore() {
      this.getLiveList(this.livePage + 1).then(list => {
        this.liveList = this.liveList.concat(list);
        this.finishTable = this.totalLive === this.liveList.length;
      });
    },
    //返回
    back() {
      sessionStorage.setItem(
        "currentPage",
        JSON.stringify(this.indexCurrentPage)
      );
      if (this.indexActiveName) {
        sessionStorage.setItem("activeName", this.indexActiveName);
      }
      this.common.back();
    },
    //获取类型详情
    getTypeInfo() {
      find(this.restypeid).then(res => {
        if (res && res.success) {
          this.typeDetail = res.data;

          const baseList = this.common.comma(this.typeDetail, "infrastructure");
          this.typeDetail.baseList = baseList.map(b => ({ name: b, id: b }));
          const attrList = this.common.comma(this.typeDetail, "extraAttrKey");
          this.typeDetail.attrList = attrList.map(b => ({ name: b }));

          let chargecycle = this.typeDetail.billingCycle + "";
          let chargetype = this.typeDetail.billingMethod + "";
          this.common.chargecycleFormatter(chargecycle, this.typeDetail);
          this.common.chargetypeFormatter(chargetype, this.typeDetail);
          this.common.chargetypeFormatter2(
            chargetype,
            this.typeDetail,
            "ct2",
            "ct1"
          );
        }
      });
    },

    // 获取资源详情
    getResTypeDetail() {
      eduResourceFind(this.id).then(res => {
        if (res && res.success) {
          this.resTypeForm = res.data;
          let arr = this.common.comma(this.resTypeForm, "ownInfrastructure");
          this.resTypeForm.baseList = arr;
        }
      });
    },

    //tab切换
    handleClick() {
      this.currentPage = 1;
      this.getList(1);
    },

    //获取入驻信息
    getLiveList(page) {
      return new Promise((resolve, reject) => {
        this.liveLoading = true;
        const filter = { eduResourceId: this.id };
        const params = {
          page: page || this.livePage,
          limit: this.limit,
          filter
        };
        eduResourceUserecordPageQuery(params)
          .then(res => {
            this.liveLoading = false;
            if (res.success == true) {
              this.totalLive = res.total;
              this.livePage = page;
              let list = res.data || [];
              // for (let i = 0; i < 3; i++) {
              //   list = list.concat(list);
              // }

              list.forEach(v => {
                let r = v.apply;
                let chargecycle = r.billingCycle + "";
                let chargetype = r.billingMethod + "";
                this.common.chargecycleFormatter(chargecycle, r);
                this.common.chargetypeFormatter2(chargetype, r, "ct2", "ct1");
                v.isCollapse = false;
              });
              // 该资源当前唯一入驻放在最前
              if (list.length && list[0].status != 1) {
                list.forEach((v, index) => {
                  if (v.status == 1) {
                    let tmp = JSON.stringify(v);
                    list[index] = list[0];
                    list[0] = JSON.parse(tmp);
                  }
                });
              }

              if (page == 1) {
                if (
                  this.prevPage == "resource-apply" &&
                  list.length &&
                  list[0].status == 1
                ) {
                  list = [list[0]];
                }
                this.liveList = [...list];
                this.obj = list[0] || {};
              }
              this.finishTable =
                list.length < this.limit || list.length === res.total;
              resolve(list);
            }
          })
          .catch(e => {
            this.liveLoading = false;
          });
      });
    },

    //费用
    chargeFormatter(row, column, cellValue) {
      return row.priceNum * row.price;
    },

    //时间转换
    timeFormatter(row, column, cellValue) {
      if (!cellValue) {
        return "--";
      } else {
        return this.util.formatTime(cellValue, "yyyy.MM.dd hh:mm");
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

    //删除
    deletetr(row) {
      this.$confirm("此操作将永久删除该记录, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          eduResourceAmountDelete(row.id).then(res => {
            if (res.success == true) {
              this.currentPage = 1;
              this.getList(this.currentPage);
              this.$message({
                type: "success",
                message: "删除成功!"
              });
              //刷新列表
            } else {
              this.$message({
                type: "warning",
                message: res.data.message
              });
            }
          });
        })
        .catch(() => {});
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
                type: "warning",
                message: res.data.message
              });
            }
          });
        })
        .catch(() => {});
    },

    //获取列表
    getList(page) {
      this.loading = true;
      const filter = { eduResourceId: this.id, priceType: this.activeName };
      const params = {
        page: page || this.currentPage,
        limit: this.limit,
        filter
      };
      eduResourceAmountPageQuery(params)
        .then(res => {
          this.loading = false;
          if (res.success == true) {
            this.applyList = res.data;
            this.totalPage = res.total;
          }
        })
        .catch(e => {
          this.loading = false;
        });
    },

    //打开水电费编辑弹框
    eidtAudit(row) {
      eduResourceAmountFind(row.id).then(res => {
        if (res && res.success) {
          this.dialogFormVisible2 = true;
          this.form2 = res.data;
          this.$nextTick(() => {
            this.$refs.child2.files =
              res.data && res.data.photos ? [{ ID: res.data.photos }] : [];
          });
        }
      });
    },

    //打开弹框
    operateApply(type, row) {
      this.dialogType2 = type;

      switch (type) {
        case "add":
          this.form2 = {};
          this.dialogFormVisible2 = true;
          break;
        case "edit":
          this.lastNum = (row && row.priceNum - row.amount / row.price) || 0;
          this.eidtAudit(row);
          break;
      }
    },

    //提交
    paySubmit(type) {
      this.$refs.child2.$refs.form2.validate(async valid => {
        if (valid) {
          let form = this.$refs.child2.form2;
          let form2 = {};
          let url = "/eduResourceAmount/save";
          let message = "";
          if (this.dialogType2 == "add") {
            message = "添加成功";
            this.currentPage = 1;
          } else if (this.dialogType2 == "edit") {
            message = "编辑成功";
          }
          if (form.id) {
            form2.id = form.id;
          }

          form2.price = form.price;
          form2.priceNum = form.priceNum;
          form2.priceType = parseInt(this.activeName);
          form2.eduResourceId = this.id;
          form2.photos =
            (this.$refs.child2.files.length && this.$refs.child2.files[0].ID) ||
            "";
          if (this.dialogType2 === "add") {
            if (this.totalPage) {
              let num = await new Promise(resolve => {
                eduResourceAmountPageQuery({
                  page: 1,
                  limit: 1,
                  filter: { eduResourceId: this.id, priceType: this.activeName }
                }).then(res => {
                  if (res && res.success == true) {
                    let list = res.data;
                    resolve((list.length && list[0].priceNum) || 0);
                  }
                });
              });
              form2.amount = (form.priceNum - num) * form.price;
            } else {
              form2.amount = 0;
              // form2.amount = form.priceNum * form.price;
            }
          } else {
            form2.amount = (form.priceNum - this.lastNum) * form.price;
          }

          const loading = this.$loading({
            lock: true,
            text: "提交中",
            spinner: "el-icon-loading",
            background: "rgba(0, 0, 0, 0.7)"
          });

          this.util
            .postAjax({
              code: this.global.code,
              url,
              isRep: true,
              data: form2
            })
            .then(res => {
              loading.close();
              if (res.success == true) {
                this.dialogFormVisible2 = false;
                this.$message({
                  type: "success",
                  message: message
                });
                this.getList(this.currentPage);
              } else {
                this.$message({
                  type: "warning",
                  message: res.data.message
                });
              }
            })
            .catch(e => loading.close());
        }
      });
    },

    // 协议提交
    submitDiag() {
      this.innerSubmit(this.dialogType);
    },
    // 续租提交
    submit() {
      this.$refs.childrender.$refs.form.validate(valid => {
        if (valid) {
          let form = this.$refs.childrender.form;
          let resList = this.$refs.childrender.resList;
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
              cost:
                this.common.moneyFormatter('', '', r.billingMethod == 1
                  ? r.price * form.useCycle * r.area
                  : r.price * form.useCycle)
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
          this.$refs.childrender.tableTable = arrTmp;
          this.$refs.childrender.agreeVisible = true;
        }
      });
    },
    doSubmit() {
      if (this.diagType == 2) {
        eduResourceCheckoutApply({ id: this.id }).then(res => {
          if (res && res.success) {
            this.dVisible = false;
            this.$message({
              type: "success",
              message: "退出成功"
            });
            this.getList(this.currentPage);
            this.getLiveList(1);
          } else {
            this.$message({
              type: "warning",
              message: res.data.message
            });
          }
        });
      } else {
        this.forceQuit(this.id);
      }
    },
    // 一键退出
    checkOut(id, num) {
      this.diagType = num;
      if (num == 1) {
        let str = `#${this.resTypeForm.name},${this.typeDetail.name || ""} `;
        this.diagBody = `确定要强制退出资源 ${str} 吗？`;
        this.diagTitle = "确认要强制退出吗？";
      } else {
        this.diagBody = "一旦退出后便不可再使用，确定退出吗？";
        this.diagTitle = "确认退出？";
      }
      this.dVisible = true;
    },
    // 续租
    norender(type, id) {
      this.loading = true;
      this.dialogType = type;

      switch (type) {
        case "continue":
          this.applyTitle = "续租申请(请在审批后5个工作日内办理入驻)";
          break;
      }
      eduResourceReCheckin({ id })
        .then(res => {
          if (res && res.success) {
            this.form = res.data;
            this.form.ct2 = this.typeDetail.ct2;
            this.form.ct1 = this.typeDetail.ct1;
            this.form.chargecycle = this.typeDetail.chargecycle;
            this.form.rules = this.typeDetail.rules;
            this.form.eduResourceIds = [id];
            this.form.areas = this.resTypeForm.area;
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

    //弹框内确认
    innerSubmit(type) {
      let form = this.$refs.childrender.form;

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
      form2.projectStarttime = this.util.formatTime(
        this.util.formatMYD(this.$refs.childrender.value1[0]),
        "yyyyMMdd"
      );
      form2.projectEndtime = this.util.formatTime(
        this.util.formatMYD(this.$refs.childrender.value1[1]),
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
        }
      });
    },
    // 强制退出
    forceQuit(id) {
      forceCheckoutBatch({ ids: id }).then(res => {
        if (res.success == true) {
          this.$message({
            type: "success",
            message: "强制退出完成"
          });
          this.dVisible = false;
          this.getList(this.currentPage);
          this.getLiveList(1);
        } else {
          this.$message({
            type: "warning",
            message: res.data.message
          });
        }
      });
    }
  },
  created() {
    this.getTypeInfo();
    this.getResTypeDetail();
    this.getResTypeList();
    this.getList(this.currentPage);
    this.getLiveList(1);
  }
};
</script>

<style scoped lang="scss"></style>
