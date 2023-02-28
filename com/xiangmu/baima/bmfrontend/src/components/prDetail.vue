<template>
  <div style="background: #ffffff;">
    <!--面包屑-->
    <bread-crumb :breadList="breadList"></bread-crumb>

    <div class="back-top">
      <div class="my-button green" style="border-radius: 16px" @click="back">
        <i class="el-icon-back"></i>
        <span>返回</span>
      </div>
      <div
        class="my-button green"
        style="border-radius: 16px; float: right; width: 150px"
        @click="downStd"
      >
        <i class="el-icon-printer"></i>
        <span>下载学生信息表</span>
      </div>
      <div
        class="my-button green"
        style="border-radius: 16px; float: right; margin: auto 20px; width: 150px"
        @click="downloadForm"
      >
        <i class="el-icon-printer"></i>
        <span>下载申请表</span>
      </div>
    </div>

    <!--进度条-->
    <process
      :applyInfoForm="applyInfoForm"
      :processData="processData"
    ></process>

    <!--申请信息和审批意见-->
    <div class="audit-content" style="margin-top: 20px" v-loading="loading">
      <!-- 基本信息 -->
      <div style="margin-bottom: 20px">
        <div class="item-title">
          <img src="../../static/images/bm-basic-info.png" alt />
          <span>基本信息</span>
        </div>
        <table class="normal-table" style="table-layout: fixed;width: 100%">
          <tr>
            <td>学院名称</td>
            <td>{{ applyInfoForm.orgname }}</td>
            <td>班级名称</td>
            <td>{{ applyInfoForm.classname }}</td>
            <td>课程名称</td>
            <td>{{ applyInfoForm.coursename }}</td>
            <td>实习人数</td>
            <td>{{ applyInfoForm.prpersonnum }}</td>
          </tr>
          <tr>
            <td>实习日期</td>
            <td>
              {{
                common.formatTime(applyInfoForm.prstarttime, "yyyy.MM.dd")
              }}~{{ common.formatTime(applyInfoForm.prendtime, "yyyy.MM.dd") }}
            </td>
            <td>申请人</td>
            <td>{{ applyInfoForm.applyername }}</td>
            <td>联系电话</td>
            <td>{{ applyInfoForm.applymobile }}</td>
            <td>负责教师</td>
            <td>{{ applyInfoForm.leadername }}</td>
          </tr>
          <tr>
            <td>联系电话</td>
            <td>{{ applyInfoForm.leadermobile }}</td>
            <td>参与教师</td>
            <td colspan="5">
              <a @click="dialogVisible = true">点击查看全部详情</a>
            </td>
          </tr>
          <tr>
            <td>实习内容</td>
            <td colspan="7">{{ applyInfoForm.prcontent }}</td>
          </tr>
        </table>
      </div>
      <!-- 住宿信息 -->
      <div v-if="applyInfoForm.issleep == '1'" style="margin-bottom: 20px">
        <div class="item-title">
          <img src="../../static/images/bm-stay-info.png" alt />
          <span>住宿信息</span>
        </div>
        <table class="normal-table" style="table-layout: fixed;width: 100%">
          <tr>
            <td>住宿日期</td>
            <td colspan="3">
              {{
                common.formatTime(applyInfoForm.sleepstarttime, "yyyy.MM.dd")
              }}~{{
                common.formatTime(applyInfoForm.sleependtime, "yyyy.MM.dd")
              }}
            </td>
            <td>住宿人数</td>
            <td colspan="3">
              男：{{ applyInfoForm.sleepboynum }}，女：{{
                applyInfoForm.sleepgirlnum
              }}
            </td>
          </tr>
        </table>
      </div>
      <!-- 餐食信息 -->
      <div v-if="applyInfoForm.iseat == '1'" style="margin-bottom: 20px">
        <div class="item-title">
          <img src="../../static/images/bm-eat-info.png" alt />
          <span>餐食信息</span>
        </div>
        <table class="normal-table" style="table-layout: fixed;width: 100%">
          <tr>
            <td>用餐开始时间</td>
            <td>
              {{
                common.formatTime(applyInfoForm.eatstarttime, "yyyy.MM.dd")
              }}（{{ applyInfoForm.eatstarttype }}）
            </td>
            <td>用餐结束时间</td>
            <td>
              {{
                common.formatTime(applyInfoForm.eatendtime, "yyyy.MM.dd")
              }}（{{ applyInfoForm.eatendtype }}）
            </td>
            <td>用餐人数</td>
            <td colspan="3">
              总人数：{{ applyInfoForm.eatpersonnum }}，民族生人数：{{
                applyInfoForm.eatmpersonnum
              }}
            </td>
          </tr>
        </table>
      </div>
      <!-- 其他信息 -->
      <div style="margin-bottom: 20px">
        <div class="item-title">
          <img src="../../static/images/bm-other-info.png" alt />
          <span>其他信息</span>
        </div>
        <table class="normal-table" style="table-layout: fixed;width: 100%">
          <tr>
            <td>实习条件</td>
            <td colspan="7">{{ applyInfoForm.prconditions }}</td>
          </tr>
          <tr>
            <td>学生信息表</td>
            <td colspan="7">
              <div class="table-file">
                <img src="../../static/images/appendix.png" />
                <span style="max-width: calc(100% - 140px);" class="ellipsis">{{
                  stdFile
                }}</span>
                <!-- <span style="max-width: calc(100% - 140px);" class="ellipsis">{{stuinfofile.TITLE}}</span> -->
                <div class="operate">
                  <span @click="stdVisible = true">
                    <!-- <span @click="common.previewFile(stuinfofile.ID)"> -->
                    <img src="../../static/images/bm-file-view-green.png" alt />
                    预览
                  </span>
                  <span @click="downTemp">
                    <!-- <span @click="downloadFile(stuinfofile.ID)"> -->
                    <img src="../../static/images/bm-file-down-green.png" alt />
                    下载
                  </span>
                </div>
              </div>
            </td>
          </tr>
        </table>
      </div>

      <!-- 审批 -->
      <div style="margin-bottom: 20px">
        <div class="item-title">
          <img src="../../static/images/bm-audit-info.png" alt />
          <span>审批</span>
        </div>

        <div
          v-if="auditList && auditList.length == 0 && operType === 'view'"
          style="margin-bottom: 20px;"
        >
          暂无审批内容
        </div>
        <div
          v-else
          class="inner-item"
          v-for="item in auditList"
          :key="item.id"
          style="margin-bottom: 20px;"
        >
          <div class="part">
            <span v-show="item.eventtype == '3'">单位领导审批意见:</span>
            <span v-show="item.eventtype == '4'">基地审批意见:</span>
            <span v-show="item.eventtype == '5'">后勤审批意见:</span>
          </div>
          <div class="advice-content">
            <div class="text">
              <span style="margin-right: 25px">
                <label>审批人:</label>
                <span>{{ item.eventername }}</span>
              </span>
              <span>{{ item.eventtime }}</span>
            </div>
            <div>{{ item.eventnote }}</div>
          </div>
        </div>
        <!-- 审批操作 -->
        <opinions
          ref="opinions"
          v-if="operType === 'audit'"
          :auditDev="auditDev"
          :isHq="isRearService"
        ></opinions>
      </div>

      <!--操作按钮-->
      <div style="text-align: center" v-if="operType === 'audit'">
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

    <!--参与教师详情弹框-->
    <el-dialog
      class="res-apply-dialog"
      title="参与教师"
      :visible.sync="dialogVisible"
      width="600px"
      :close-on-click-modal="false"
    >
      <div class="teacher-list">
        <el-row
          :gutter="20"
          v-for="item in teacherList"
          :key="item.id"
          class="teacher-item"
        >
          <el-col :span="10" style="border-right: 3px solid #f3f5f9">
            <img src="../../static/images/bm-teacher-avater.png" alt />
            {{ item.teachername }}
          </el-col>
          <el-col :span="14">
            <img src="../../static/images/bm-teacher-phone.png" alt />
            {{ item.teachermobile }}
          </el-col>
        </el-row>
      </div>
      <div slot="footer" class="dialog-footer">
        <div class="my-button" @click="dialogVisible = false">关闭</div>
      </div>
    </el-dialog>

    <!--学生信息表-->
    <el-dialog
      class="res-apply-dialog"
      :title="stdFile"
      :visible.sync="stdVisible"
      width="80%"
      :close-on-click-modal="false"
    >
      <el-table
        :data="stdList"
        stripe
        style="width: 100%"
        height="250"
        ref="table"
        :header-cell-style="{ background: '#F3F5F9' }"
      >
        <el-table-column type="index" label="序号"></el-table-column>
        <el-table-column
          v-for="(item, index) in tableT"
          :prop="item.name"
          :label="item.label"
          :key="item.name + index"
          align="center"
          :width="index == 3 ? 200 : ''"
        >
        </el-table-column>
      </el-table>
      <div slot="footer" class="dialog-footer">
        <div class="my-button" @click="stdVisible = false">关闭</div>
      </div>
    </el-dialog>
    <div id="tmpTable" v-show="isDomShow">
      <h2>本科生实习申请</h2>
      <table border="1" cellspacing="0">
        <thead>
          <tr>
            <th v-for="(h, i) in dataTitle" :key="i">{{ h }}</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(tr, i) in studentList"
            :key="tr.idcard + i"
            class="trClassFlag"
          >
            <td>{{ tr.classname }}</td>
            <td>{{ tr.username }}</td>
            <td>{{ tr.userid }}</td>
            <td>{{ tr.idcard }}</td>
            <td>{{ tr.sex }}</td>
            <td>{{ tr.national }}</td>
          </tr>
        </tbody>
      </table>
    </div>

    <student-apply
      v-show="stdApply"
      :form="applyInfoForm"
      style="margin-left: -2000px"
    >
    </student-apply>
  </div>
</template>

<script>
import Opinions from "../components/opinions";
import process from "./process";
import breadCrumb from "../components/breadcrumb";
import * as XLSX from "xlsx";
export default {
  components: {
    Opinions,
    process,
    breadCrumb,
    studentApply: () => import("@/components/stdApplyInfo")
  },
  computed: {
    isRearService() {
      return this.$route.query.isRearService + '' === 'true'
    }
  },
  props: {
    id: String,
    operType: {
      type: String,
      default: "view"
    },
    auditDev: String,
    breadList: Array,

    indexCurrentPage: Number | String,
    indexActiveName: String
  },
  data() {
    return {
      stdApply: false,
      isDomShow: false,
      studentList: [],
      dataTitle: ["班级", "姓名", "学号", "身份证号", "性别", "民族"],
      tableT: [],
      stdList: [],
      stdVisible: false,
      stdFile: "学生信息表",
      loading: false,
      downUrl: window.g.ApiUrl3 + "rest/FileOut/down?ID=", // 下载地址
      applyInfoForm: {}, // 申请信息表格
      teacherList: [], // 参与教师
      stuinfofile: {}, // 学生信息表
      auditList: [], // 审核列表
      dialogVisible: false,
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
      ]
    };
  },

  methods: {
    // 申请单下载
    downloadForm() {
      // type 1下载2预览
      // this.util
      //   .getUrlByCode(this.global.code, "/prapply/applyForm")
      //   .then(res => {
      //     window.open(res + "?id=" + this.id + "&type=" + 1);
      //   });
      this.stdApply = true;

      let that = this;
      // this.$nextTick(() =>
      //   that.common.transToPdf(this.applyInfoForm.classname + "申请表", "stdApply", that)
      // );
      this.common.outPutPdfFn(
        that,
        "stdApply",
        "normal-table",
        this.applyInfoForm.classname + "申请表"
      );
    },
    downStd() {
      let stdList = this.stdList || [];
      stdList.forEach(s => {
        s.sex = s.sex == "1" ? "男" : "女";
      });
      this.studentList = stdList;
      // this.studentList = stdList.concat(stdList).concat(stdList).concat(stdList).concat(stdList).concat(stdList).concat(stdList).concat(stdList).concat(stdList).concat(stdList).concat(stdList).concat(stdList).concat(stdList)
      this.isDomShow = true;
      let that = this;
      // this.$nextTick(() =>
      //   that.common.transToPdf("学生信息表", "tmpTable", that)
      // );
      this.common.outPutPdfFn(
        that,
        "tmpTable",
        "trClassFlag",
        "学生信息表",
        true
      );
    },
    // 下载学生信息表
    downTemp() {
      const data = [this.dataTitle];
      this.stdList.forEach(s => {
        let arr = [
          s.classname,
          s.username,
          s.userid,
          s.idcard,
          s.sex,
          s.national
        ];
        data.push(arr);
      });
      const loading = this.$loading({
        lock: true,
        text: "提交审批中",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.7)"
      });
      try {
        let ws = XLSX.utils.aoa_to_sheet(data);
        let wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws);
        XLSX.writeFile(wb, "学生信息表.xlsx");
        loading.close();
      } catch (e) {
        loading.close();
      }
    },
    downloadFile(id) {
      window.open(this.downUrl + id, "_blank");
    },
    back() {
      window.history.go(-1);
      sessionStorage.setItem("activeName", this.indexActiveName);
      sessionStorage.setItem(
        "currentPage",
        JSON.stringify(this.indexCurrentPage)
      );
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
          }
        });
    },

    //审核操作
    /* operate(type) {
      let eventnote = this.$refs.opinions.eventnote;
      if (!eventnote) {
        this.$message({
          showClose: true,
          type: "error",
          message: "请输入审批意见！"
        });
        return;
      }
      let params = {
        eventnote: eventnote,
        eventresult: type,
        eventtype: this.auditDev === "bm" ? 4 : 3,
        applyid: this.id
      };
      this.util
        .postAjax({
          code: this.global.code,
          url: "/prapply/saveEvent",
          isRep: true,
          data: params
        })
        .then(res => {
          if (res.success) {
            this.$message({
              showClose: true,
              type: "success",
              message: "审批通过！"
            });
            this.addOpenUse();
            this.back();
          } else {
            this.$message({
              showClose: true,
              type: "error",
              message: "审批不通过！"
            });
          }
        })
        .catch(err => {
          this.$message({
            showClose: true,
            type: "error",
            message: "审批失败！" + err
          });
        });
    },*/

    //审核操作
    operate(type) {
      if (!this.$refs.opinions.eventnote) {
        this.$message({
          type: "warning",
          message: "请输入审批意见!"
        });
      } else {
        let params = {
          eventnote: this.$refs.opinions.eventnote,
          eventresult: type,
          eventtype: this.isRearService ? 5 : this.auditDev === "bm" ? 4 : 3,
          applyid: this.id
        };

        const loading = this.$loading({
          lock: true,
          text: "提交审批中",
          spinner: "el-icon-loading",
          background: "rgba(0, 0, 0, 0.7)"
        });
        this.util
          .postAjax({
            code: this.global.code,
            url: "/prapply/saveEvent",
            isRep: true,
            data: params
          })
          .then(res => {
            // console.log(res);
            loading.close();
            if (res.success) {
              this.addOpenUse();
              this.$message({
                type: type == "0" ? "error" : "success",
                message: type == "0" ? "审批不通过" : "审批通过"
              });
              this.back();
            } else {
              // console.log(res);
              this.$message({
                type: "warning",
                message: res.data.message
              });
            }
          });
      }
    },

    //获取详情接口
    getDetail() {
      this.loading = true;
      this.util
        .postAjax({
          code: this.global.code,
          url: "/prapply/findById",
          data: {
            id: this.id
          }
        })
        .then(res => {
          this.loading = false;
          if (res.success == true) {
            this.applyInfoForm = res.item.apply || {};
            this.$set(
              this.applyInfoForm,
              "events",
              JSON.parse(JSON.stringify(res.item.events))
            );
            this.$set(this.applyInfoForm, "students", res.item.students);
            this.$set(this.applyInfoForm, "teachers", res.item.teachers);
            if (this.applyInfoForm.iseat == 1) {
              this.processData.push({
                hideLine: false,
                num: 4,
                date: "",
                active: false,
                text: "后勤审批",
                status: "",
                rearService: 1
              });
            }
            this.teacherList = res.item.teachers || [];
            this.stdList = res.item.students || [];
            this.stdList.forEach(s => {
              s.sex = s.sex == "1" ? "男" : "女";
            });
            // if (this.applyInfoForm.iseat == '1') {
            //   this.processData.push({hideLine:false,num:4,date:"",active:false,text:"后勤审批",status: ""})
            // }
            this.stuinfofile = res.item.attment || {};
            //开始：早中晚餐转换
            let eatstarttype = this.applyInfoForm.eatstarttype;
            let eatendtype = this.applyInfoForm.eatendtype;
            let isSameDay = this.applyInfoForm.eatstarttime === this.applyInfoForm.eatendtime;
            let eatObj = {
              '1,1': '含早餐',
              '2,2': '含中餐',
              '3,3': '含晚餐',
              '1,2': "含早、中餐",
              '1,3': "含早、中、晚餐",
              '2,3': "含中、晚餐",
            }
            if (isSameDay) {
              let str = eatstarttype <= eatendtype ? eatstarttype + ',' + eatendtype : eatendtype + ',' + eatstarttype;
              this.applyInfoForm.eatstarttype = this.applyInfoForm.eatendtype = eatObj[str];
            } else {
              if (eatstarttype) {
                switch (eatstarttype) {
                  case "1":
                    this.applyInfoForm.eatstarttype = "含早、中、晚餐";
                    break;
                  case "2":
                    this.applyInfoForm.eatstarttype = "含中、晚餐";
                    break;
                  case "3":
                    this.applyInfoForm.eatstarttype = "含晚餐";
                }
              }
              //结束：早中晚餐转换
              if (eatendtype) {
                switch (eatendtype) {
                  case "1":
                    this.applyInfoForm.eatendtype = "含早餐";
                    break;
                  case "2":
                    this.applyInfoForm.eatendtype = "含早、中餐";
                    break;
                  case "3":
                    this.applyInfoForm.eatendtype = "含早、中、晚餐";
                }
              }
            }
            //审核列表转换
            let events = JSON.parse(JSON.stringify(res.item.events));
            events.forEach(v => {
              v.eventtime = this.common.formatTime(
                v.eventtime,
                "yyyy.MM.dd hh:mm:ss"
              );
              if (
                v.eventtype == "3" ||
                v.eventtype == "4" ||
                v.eventtype == "5"
              ) {
                this.auditList.push(v);
              }
            });

            //进程时间
            res.item.events.forEach(v => {
              v.eventtime = this.util.formatTime(v.eventtime, "yyyy.MM.dd");
              switch (v.eventtype) {
                case "1":
                  this.processData[0].date = v.eventtime;
                  break;
                case "3":
                  this.processData[1].date = v.eventtime;
                  this.processData[1].text = "单位领导审批";
                  this.processData[1].active = true;
                  this.processData[1].status =
                    v.eventresult == 1 ? "success" : "fail";
                  break;
                case "4":
                  this.processData[2].date = v.eventtime;
                  this.processData[2].text = "基地审批";
                  this.processData[2].active = true;
                  this.processData[2].status =
                    v.eventresult == 1 ? "success" : "fail";
                  break;
                case "5":
                  this.processData[3].date = v.eventtime;
                  this.processData[3].text = "后勤审批";
                  this.processData[3].active = true;
                  this.processData[3].rearService = undefined;
                  this.processData[3].status =
                    v.eventresult == 1 ? "success" : "fail";
                  break;
              }
            });
          } else {
            this.$message({
              showClose: true,
              type: "error",
              message: "获取详情失败！"
            });
          }
        })
        .catch(err => {
          this.loading = false;
          this.$message({
            showClose: true,
            type: "error",
            message: "获取详情失败！" + err
          });
        });
    }
  },

  created() {
    this.getDetail();
    let title = this.dataTitle;
    let name = ["classname", "username", "userid", "idcard", "sex", "national"];
    name.forEach((n, id) => {
      let obj = { name: n, label: title[id] };
      this.tableT.push(obj);
    });
  }
};
</script>

<style scoped lang="scss">
.normal-table a {
  color: #00b09b;
  text-decoration: underline;
  cursor: pointer;
}
.normal-table td {
  vertical-align: middle;
}
.table-file {
  vertical-align: middle;

  img {
    width: 14px;
    height: 14px;
    vertical-align: middle;
  }
  span {
    vertical-align: middle;
  }
  .operate {
    float: right;

    span {
      cursor: pointer;
      color: #00b09b;
      font-size: 12px;
      margin-right: 10px;
    }
  }
}
#tmpTable {
  padding: 100px 10px;
  margin-top: 3000px;
  width: 900px;
  h2 {
    margin: 20px;
    text-align: center;
  }
  table {
    width: 70%;
    margin: 0 auto;
  }
  th,
  td {
    text-align: center;
    line-height: 30px;
    border: 1px solid black;
  }
}
</style>
