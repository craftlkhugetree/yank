<template>
  <div style="background: #ffffff;" v-loading="loading">
    <!--面包屑-->
    <bread-crumb :breadList="breadList"></bread-crumb>

    <div class="back-top" style="margin-bottom: 30px">
      <div class="my-button green" style="border-radius: 16px" @click="back">
        <i class="el-icon-back"></i>
        <span>返回</span>
      </div>
    </div>

    <!--进度条-->
    <process
      :applyInfoForm="applyInfoForm"
      :processData="
        this.applyInfoForm.useType == '1' ? processData : processData2
      "
    ></process>

    <div class="audit-content">
      <!--申请信息和费用-->
      <apply-info-fee :applyInfoForm="applyInfoForm"></apply-info-fee>

      <!--查看审批详情-->
      <div style="margin-bottom: 20px">
        <div class="item-title">
          <img
            style="width: 22px;height: 20px"
            src="../../../../static/images/bm-audit-info.png"
            alt=""
          />
          <span>审批</span>
        </div>

        <!--        <div v-if="auditList && auditList.length ==0">暂无审批内容</div>-->
        <div class="inner-item" v-for="item in auditList" :key="item.id">
          <div class="part">
            <span v-show="item.bizNode == 'LD'">单位领导审批意见:</span>
            <span v-show="item.bizNode == 'BM'">基地审批意见:</span>
          </div>
          <div class="advice-content">
            <div class="text">
              <span style="margin-right: 25px">
                <label>审批人:</label>
                <span>{{ item.createName }}</span>
              </span>
              <span>
                {{ item.eventTime }}
              </span>
            </div>
            <div>
              {{ item.eventNote }}
            </div>
          </div>
        </div>

        <opinions ref="opinions" :auditDev="auditDev"></opinions>
      </div>

      <!--操作按钮-->
      <div style="text-align: center">
        <div class="my-button plain-red" @click="operate('0')">
          <span>审批不通过</span>
        </div>

        <div
          style="margin-left: 20px"
          class="my-button green"
          @click="operate('1')"
        >
          <span>审批通过</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import applyInfoFee from "../applyInfoFee";
import Opinions from "../../../components/opinions";
import breadCrumb from "../../../components/breadcrumb";
import process from "../resProcess";
import { eduApplyFind } from "@/assets/js/api";
export default {
  name: "LeaderAudit",
  components: {
    applyInfoFee,
    Opinions,
    breadCrumb,
    process
  },
  props: {
    id: String,
    auditDev: String,
    breadList: Array,
    indexCurrentPage: Number | String,
    indexActiveName: String
  },
  data() {
    return {
      loading: false,
      isOver: false, //进程是否结束
      /*processData:[
          {hideLine:true,num:1,date:"2010.10.13",active:true,text:"申请时间"},
          {hideLine:false,num:2,date:"",active:false,text:"审批时间"},
          {hideLine:false,num:3,date:"",active:false,text:"接收"},
        ],*/

      applyInfoForm: {
        restype: {}
      }, //申请信息表格
      typeList: JSON.parse(sessionStorage.getItem("typeList")), //资源类型列表
      codeList: JSON.parse(sessionStorage.getItem("codeList")), //资源编号列表
      groupList: JSON.parse(sessionStorage.getItem("groupList")), //学院列表

      auditList: [], //审核列表
      chargecyclename: "",
      processData: [
        {
          hideLine: true,
          num: 1,
          date: "",
          active: true,
          text: "申请时间",
          status: "success"
        },
        {
          hideLine: false,
          num: 2,
          date: "",
          active: false,
          text: "单位领导审批",
          status: "fail"
        },
        {
          hideLine: false,
          num: 3,
          date: "",
          active: false,
          text: "基地审批",
          status: ""
        }
      ],
      processData2: [
        {
          hideLine: true,
          num: 1,
          date: "",
          active: true,
          text: "申请时间",
          status: "success"
        },
        {
          hideLine: false,
          num: 2,
          date: "",
          active: false,
          text: "基地审批",
          status: "fail"
        }
        // {hideLine:false,num:3,date:"",active:false,text:"基地审批",status: ""},
      ]
    };
  },

  methods: {
    back() {
      sessionStorage.setItem("activeName", this.indexActiveName);
      sessionStorage.setItem(
        "currentPage",
        JSON.stringify(this.indexCurrentPage)
      );
      this.common.back();
    },

    //获取详情接口
    getDetail() {
      this.loading = true;
      eduApplyFind(this.id)
        .then(res => {
          if (res && res.success == true) {
            this.applyInfoForm = res.data || {};
            const r = this.applyInfoForm;

            this.applyInfoForm.typeName = r.eduTypeName;
            this.applyInfoForm.billingCycle = r.billingCycle;
            this.applyInfoForm.billingMethod = r.billingMethod;

            let chargecycle = r.billingCycle + "";
            let chargetype = r.billingMethod + "";
            this.common.chargecycleFormatter(chargecycle, r);
            this.common.chargetypeFormatter2(chargetype, r, "ct2", "ct1");

            const tmp = res.data.resources;
            if (tmp && tmp.length) {
              // 合成resName和areas
              this.applyInfoForm.resName = tmp
                .map(t => t.eduResourceName)
                .join(",");
              this.applyInfoForm.areas = tmp
                .map(t => t.eduResourceArea)
                .join(",");
              const arrTmp = tmp.map(t => ({
                ...t,
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
              this.applyInfoForm.resArr = arrTmp;
            }

            //审核列表转换
            let events =
              (res.data.events &&
                JSON.parse(JSON.stringify(res.data.events))) ||
              [];
            events.forEach(v => {
              v.eventTime = this.util.formatTime(v.createTime, "yyyy.MM.dd");
              // 审批
              if (v.eventType == "2") {
                this.auditList.push(v);
              }
              // 提交
              else if (v.eventType == "1") {
                this.applyInfoForm.eventnote = v.eventNote;
                this.applyInfoForm.eventername = v.createName;
              }

              // status (integer, optional): 申请单状态：1审核2已完成8驳回9撤回 ,
              // useType (integer, optional): 申请类型1入住2续租3退租
              // eventResult (string, optional): 处理结果0不通过1通过 ,
              // eventType (integer, optional): 1提交2审批 ,

              //进程时间
              if (this.applyInfoForm.useType == "1") {
                switch (v.eventType + "") {
                  case "1":
                    this.processData[0].date = v.eventTime;
                    break;
                  case "2":
                    if (v.bizNode === "LD") {
                      this.processData[1].date = v.eventTime;
                      this.processData[1].text = "单位领导审批";
                      this.processData[1].active = true;
                      this.processData[1].status =
                        v.eventResult == 1 ? "success" : "fail";
                    } else if (v.bizNode === "BM") {
                      this.processData[2].date = v.eventTime;
                      this.processData[2].text = "基地审批";
                      this.processData[2].active = true;
                      this.processData[2].status =
                        v.eventResult == 1 ? "success" : "fail";
                    }
                    break;
                }
              } else {
                switch (v.eventType + "") {
                  case "1":
                    this.processData2[0].date = v.eventTime;
                    break;
                  case "2":
                    this.processData2[1].date = v.eventTime;
                    this.processData2[1].text = "基地审批";
                    this.processData2[1].active = true;
                    this.processData2[1].status =
                      v.eventResult == 1 ? "success" : "fail";
                    break;
                }
              }
            });
          }
          this.loading = false;
        })
        .catch(e => {
          this.loading = false;
        });
    },

    //添加常用字段
    addOpenUse() {
      this.util
        .postAjax({
          code: this.global.code,
          url: "/opinions/add",
          isRep: true,
          data: {
            note: this.$refs.opinions.eventnote
          }
        })
        .then(res => {
          if (res.success == true) {
            /* this.getTipList();
               this.dialogVisible = false;*/
          } else {
            // console.log(res);
            this.$message({
              type: "warning",
              message: res.data.message
            });
          }
        });
    },

    //审核操作
    operate(type) {
      if (!this.$refs.opinions.eventnote) {
        this.$message({
          type: "warning",
          message: "请输入审批意见!"
        });
      } else {
        // let params = {
        //   eventNote: this.$refs.opinions.eventNote,
        //   eventresult: type,
        //   eventtype: this.auditDev == "leader" ? 3 : 4,
        //   applyid: this.id
        // };
        const EduApplyEvent = {
          bizNode: this.auditDev === "leader" ? "LD" : "BM", // (string, optional): 处理节点LD，BM ,
          // createId: "", // (string, optional): 创建人 ,
          // createName: "", // (string, optional): 创建人姓名 ,
          // createTime: "", // (string, optional): 创建时间 ,
          eduApplyId: this.applyInfoForm.id, // (integer, optional): 科教资源申请单id ,
          eventNote: this.$refs.opinions.eventnote, // (string, optional): 事件备注 ,
          eventResult: type, // (string, optional): 处理结果0不通过1通过 ,
          eventType: 2 // (integer, optional): 1提交2审批 ,
          // id: "" // (integer, optional)
        };
        let url =
          this.auditDev === "leader"
            ? "/eduApply/approveLD"
            : "/eduApply/approveBM";
        const loading = this.$loading({
          lock: true,
          text: "提交审批中",
          spinner: "el-icon-loading",
          background: "rgba(0, 0, 0, 0.7)"
        });

        this.util
          .postAjax({
            code: this.global.code,
            url,
            isRep: true,
            data: EduApplyEvent
          })
          .then(res => {
            loading.close();
            if (res && res.success) {
              this.$message({
                type: type == "0" ? "error" : "success",
                message: type == "0" ? "审批不通过" : "审批通过"
              });
              this.addOpenUse();
              this.back();
            } else {
              this.$message({
                type: "warning",
                message: res.data.message || "内部错误"
              });
            }
          })
          .catch(e => loading.close());
      }
    }
  },

  created() {
    this.getDetail();
  }
};
</script>

<style scoped></style>
