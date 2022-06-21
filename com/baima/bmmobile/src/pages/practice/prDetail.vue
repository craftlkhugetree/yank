<template>
  <div>
    <van-nav-bar title="详情" :border="false" left-arrow @click-left="goBack" />
    <!-- 撤回 -->
    <div class="recall" v-if="isReCall">该申请已被撤回</div>
    <div class="recall" v-if="isOverTime">超时，该申请已被系统退回</div>
    <!-- 步骤条 -->
    <basic-process v-show="detail.applystatus !== 0" :active="active" :data="processData"></basic-process>
    <!-- 申请信息 -->
    <div class="form-box">
      <div class="form-box-title">基本信息</div>
      <div class="form-box-content">
        <van-cell title="学院名称" :value="detail.orgname" />
        <van-cell title="班级名称" :value="detail.classname" />
        <van-cell title="课程名称" :value="detail.coursename" />
        <van-cell title="实习人数" :value="detail.prpersonnum + ' 人'" />
        <van-cell title="实习日期" :value="detail.prtime" />
        <van-cell title="申请人" :border="false" :value="detail.applyername" />
        <van-cell title="联系电话" class="van-cell-phone">
          <span slot="default">
            <van-icon name="phone" />
            {{detail.applymobile}}
          </span>
        </van-cell>
        <van-cell title="负责教师" :border="false" :value="detail.leadername" />
        <van-cell title="联系电话" class="van-cell-phone">
          <span slot="default">
            <van-icon name="phone" />
            {{detail.leadermobile}}
          </span>
        </van-cell>
        <van-cell v-if="detail.teachers && detail.teachers.length === 0" title="参与教师" value="--"></van-cell>
        <div class="field-box" v-if="detail.teachers && detail.teachers.length > 0">
          <p>参与教师</p>
          <div class="field-box-box">
            <li v-for="(item,index) in detail.teachers" :key="index">
              <van-cell class="van-cell-phone" :border="false">
                <span slot="default">
                  <van-icon name="manager" />
                  {{item.teachername}}
                </span>
              </van-cell>
              <van-cell class="van-cell-phone" :border="false">
                <span slot="default">
                  <van-icon name="phone" />
                  {{item.teachermobile}}
                </span>
              </van-cell>
            </li>
          </div>
        </div>
        <van-cell title="实习内容" :border="false" :value="detail.prcontent" />
      </div>
    </div>
    <!-- 住宿信息 -->
    <div class="form-box" v-if="detail.issleep === '1'">
      <div class="form-box-title">住宿信息</div>
      <div class="form-box-content">
        <van-cell title="住宿日期" :value="detail.sleeptime" />
        <van-cell
          title="住宿人数"
          :value="'男-' + detail.sleepboynum + ' 人，女-' + detail.sleepgirlnum + ' 人'"
        />
      </div>
    </div>
    <!-- 餐食信息 -->
    <div class="form-box" v-if="detail.iseat === '1'">
      <div class="form-box-title">餐食信息</div>
      <div class="form-box-content">
        <van-cell title="用餐开始日期" :value="detail.eatstarttimeFormat" :border="false" />
        <van-cell class="van-cell-phone" title="包含餐食" :value="detail.eatstarttype" />
        <van-cell title="用餐结束日期" :value="detail.eatendtimeFormat" :border="false" />
        <van-cell class="van-cell-phone" title="包含餐食" :value="detail.eatendtype" />
        <van-cell title="用餐总人数" :value="detail.eatpersonnum + ' 人'" />
        <van-cell title="用餐民族生人数" :value="detail.eatmpersonnum + ' 人'" />
      </div>
    </div>
    <!-- 备注信息 -->
    <div class="form-box">
      <div class="form-box-title">备注信息</div>
      <div class="form-box-content">
        <van-cell title="实习条件" :value="detail.prconditions" />
        <van-cell class="van-cell-file" :title="stdFile">
          <div slot="default">
            <!-- <img src="../../../static/imgs/bm-file-xls.png" />
            <div class="file-list-content">
              <h3 class="ellipsis">{{stdFile || attment.TITLE}}</h3>
              <span>{{common.formatTime(attment.CREATETIME, "YYYY.MM.DD hh:mm")}}</span>
            </div> -->
            <div class="file-list-btns" style="top: 5px">
              <!-- <img
                class="file-view"
                src="../../../static/imgs/bm-file-view.png"
                @click="goFileView(attment)"
              /> -->
              <img
                class="file-down"
                src="../../../static/imgs/bm-file-down.png"
                @click="downTemp"
              />
                <!-- @click="common.downloadFile(attment.ID)" -->
            </div>
          </div>
        </van-cell>
      </div>
    </div>
    <el-table
      :data="stdList"
      stripe
      style="width: 100%"
      height="250"
      ref="table"
    >
      <el-table-column type="index" width="20"> </el-table-column>
      <el-table-column
        v-for="(item, index) in tableT"
        :prop="item.name"
        :label="item.label"
        :key="item.name + index"
        align="center"
        :width="index == 3 ? 150 : ''"
      >
      </el-table-column>
    </el-table>
    <!-- 审批信息 -->
    <div class="form-box">
      <div class="form-box-title">审批信息</div>
      <div class="form-box-content" v-show="auditList.length === 0">
        <van-cell title="暂无审批信息" />
      </div>
      <div class="form-box-content" v-for="item in auditList" :key="item.id">
        <van-cell
          :title="item.eventresult === 1 ? '通过该申请' : '驳回该申请'"
          :class="{'van-cell-pass':item.eventresult === 1,'van-cell-reject': item.eventresult !== 1}"
        >
          <van-icon slot="right-icon" :name="item.eventresult === 1 ? 'checked' : 'clear'"></van-icon>
        </van-cell>
        <van-cell title="审批人" :border="false" style="padding-bottom: 0">{{item.eventername}}</van-cell>
        <van-cell title="审批意见" :border="false" style="padding-bottom: 0">{{item.eventnote}}</van-cell>
        <van-cell title="审批日期">{{common.formatTime(item.eventtime, "YYYY.MM.DD")}}</van-cell>
      </div>
    </div>
    <!-- 审批意见 -->
    <div class="form-box" v-if="operType === 'audit'" style="margin-bottom: 54px;">
      <div class="form-box-title">审批意见</div>
      <div class="form-box-content">
        <van-field
          style="background:#f8f8f8;"
          v-model="eventnote"
          name="审批意见"
          placeholder="请输入审批意见"
          rows="4"
          autosize
          type="textarea"
          maxlength="100"
          :show-word-limit="true"
          :rules="[{ required: true, message: '请输入审批意见' }]"
        />
      </div>
    </div>
    <div class="form-btns" v-if="operType === 'audit'">
      <van-button type="default" @click="doAudit(0)">不通过</van-button>
      <van-button type="primary" @click="doAudit(1)">通过</van-button>
    </div>
  </div>
</template>

<script>
import BasicProcess from "../../components/BasicProcess";
import * as XLSX from "xlsx";
import { roleId } from "@/assets/js/options";
export default {
  components: {
    BasicProcess
  },
  computed: {
    curRole() {
      return sessionStorage.getItem("curRole") || "";
    },
    isRearService() {
      return roleId.hq === this.curRole;
    }
  },
  data() {
    return {
      dataTitle: ["班级", "姓名", "学号", "身份证号", "性别", "民族"],
      tableT: [],
      stdList: [],
      stdFile: '学生信息表',
      active: 1,
      processData: [
        { id: 1, title: "申请日期", des: "", status: "success" },
        { id: 2, title: "单位领导审批", des: "", status: "" },
        { id: 3, title: "白马办审批", des: "", status: "" },
        { id: 4, title:"后勤审批", des: "", status: "", rearService: 1},
      ],
      detail: {},
      attment: {},
      auditList: [],
      eventnote: "",
      isReCall: false, // 是否撤回
      isOverTime: false // 是否超时
    };
  },
  props: {
    id: String,
    operDev: String,   // 审批单位：单位领导leader、白马办bm
    operType: String   // 操作类型：审批audit
  },
  methods: {
    // 下载学生信息表
    downTemp() {
      const data = [this.dataTitle];
      this.stdList.forEach(s => {
        let arr = [s.classname, s.username, s.userid, s.idcard, s.sex, s.national];
        data.push(arr);
      })
      try {
        let ws = XLSX.utils.aoa_to_sheet(data);
        let wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws);
        XLSX.writeFile(wb, "学生信息表.xlsx");
      } catch (e) {
      }
    },
    // 返回
    goBack() {
      this.$router.go(-1);
    },
    // 文件预览页面
    goFileView(item) {
      this.$router.push({
        path: "/service-info-view/file-view/" + item.ID,
        query: {
          ftype: item.FTYPE,
          title: item.TITLE
        }
      });
    },
    // 获取详情
    getDetail() {
      this.util
        .postAjax({
          code: this.global.bmCode,
          url: "/prapply/findById",
          data: {
            id: this.id
          }
        })
        .then(res => {
          if (res.success) {
            this.detail = res.item.apply || {};
            this.detail.teachers = res.item.teachers || [];
            this.stdList = res.item.students || [];
            this.stdList.forEach(s => {
              s.sex = s.sex == '1' ? '男' : '女';
            })
            // 转换实习日期
            this.detail.prtime =
              this.common.formatTime(this.detail.prstarttime, "YYYY.MM.DD") +
              "-" +
              this.common.formatTime(this.detail.prendtime, "YYYY.MM.DD");
            // 转换住宿日期
            if (this.detail.issleep === "1") {
              this.detail.sleeptime =
                this.common.formatTime(
                  this.detail.sleepstarttime,
                  "YYYY.MM.DD"
                ) +
                "-" +
                this.common.formatTime(this.detail.sleependtime, "YYYY.MM.DD");
            }
            // 转换餐食日期
            if (this.detail.iseat === "1") {
              this.detail.eatstarttimeFormat = this.common.formatTime(
                this.detail.eatstarttime,
                "YYYY.MM.DD"
              );
              this.detail.eatendtimeFormat = this.common.formatTime(
                this.detail.eatendtime,
                "YYYY.MM.DD"
              );
            }
            //开始：早中晚餐转换
            let eatstarttype = this.detail.eatstarttype;
            if (eatstarttype) {
              switch (eatstarttype) {
                case "1":
                  this.detail.eatstarttype = "含早、中、晚餐";
                  break;
                case "2":
                  this.detail.eatstarttype = "含中、晚餐";
                  break;
                case "3":
                  this.detail.eatstarttype = "含晚餐";
              }
            }
            //结束：早中晚餐转换
            let eatendtype = this.detail.eatendtype;
            if (eatendtype) {
              switch (eatendtype) {
                case "1":
                  this.detail.eatendtype = "含早餐";
                  break;
                case "2":
                  this.detail.eatendtype = "含早、中餐";
                  break;
                case "3":
                  this.detail.eatendtype = "含早、中、晚餐";
              }
            }
            // 从详情中获取备注数据
            this.attment = res.item.attment || {};
            // 审批列表转换
            this.auditList = res.item.events.filter(i =>
              ["3", "4", "5"].includes(i.eventtype)
            );

            //进程日期 1申请 3单位领导 4白马办 5水电工
            let process = res.item.events.filter(i =>
              ["1", "3", "4", '5'].includes(i.eventtype)
            );
            process.forEach(i => {
              let eventtime = this.common.formatTime(i.eventtime, "YYYY.MM.DD");
              switch (i.eventtype) {
                case "1":
                  this.processData[0].des = eventtime;
                  break;
                case "3":
                  this.processData[1].des = eventtime;
                  this.processData[1].status =
                    i.eventresult === 1 ? "success" : "fail";
                  break;
                case "4":
                  this.processData[2].des = eventtime;
                  this.processData[2].status =
                    i.eventresult === 1 ? "success" : "fail";
                  break;
                case "5":
                  this.processData[3].des = eventtime;
                  this.processData[3].rearService = undefined;
                  this.processData[3].status = v.eventresult == 1 ? "success" :"fail";
                  break;
              }
            });

            // 是否撤回
            this.isReCall = res.item.events.some(i => i.eventtype === '2');
            // 是否超时
            this.isOverTime = res.item.apply.applystatus === "7";
          } else {
            this.$toast.fail("获取数据失败" + '\n' + res.message);
          }
        })
        .catch(err => {
          // this.$toast.fail("获取数据失败" + '\n' + err);
        });
    },

    // 审批
    doAudit(type) {
      let params = {
        eventnote: this.eventnote,
        eventresult: type,
        eventtype: this.isRearService ? 5 : this.operDev === "leader" ? 3 : 4,
        applyid: this.id
      };
      if(!this.eventnote) {
        this.$toast.fail("请输入审批意见");
        return
      }
      this.$toast.loading({
        message: "审批中...",
        forbidClick: true,
        duration: 0
      });
      this.util
        .postAjax({
          code: this.global.bmCode,
          url: "/prapply/saveEvent",
          isRep: true,
          data: params
        })
        .then(res => {
          this.$toast.clear();
          if (res.success) {
            this.$toast.success("审批成功");
            this.goBack();
          } else {
            this.$toast.fail("审批失败" + '\n' + res.message);
          }
        })
        .catch(err => {
          this.$toast.clear();
          this.$toast.fail("审批失败" + '\n' + err);
        });
    }
  },
  created() {
    this.getDetail();
    let title = this.dataTitle;
    let name = ["classname", "username", "userid", "idcard", 'sex', 'national'];
    name.forEach((n, id) => {
      let obj = { name: n, label: title[id] };
      this.tableT.push(obj);
    });
  }
};
</script>

<style lang="scss" scoped>
.recall {
  background: #ffeaed;
  padding: 10px 20px;
  color: #fe3e61;
  font-size: 14px;
  text-align: center;
}
</style>