<template>
  <div class="form-box">
    <div class="search-box clearfix">
      <h3>常规信息设置</h3>
      <div class="search-box-right">
        <span class="go-back" @click="reset('base')">
          <i class="el-icon-refresh-right">&nbsp; &nbsp;重置</i>
        </span>
      </div>
    </div>
    <div class="form-content">
      <el-form ref="editForm" :model="editForm" label-position="right" label-width="130px">
        <el-form-item
          label="区间名称"
          prop="name"
          :rules="[{ required: true, message: '请输入区间名称', trigger: 'blur' }]"
        >
          <el-input
            :maxlength="40"
            show-word-limit
            v-model="editForm.name"
            size="small"
            style="width:600px;"
            placeholder="不能超过40个字符"
          ></el-input>
        </el-form-item>
        <el-form-item
          label="开放地点"
          prop="location"
          :rules="[{ required: true, message: '请输入开放地点', trigger: 'blur' }]"
        >
          <el-input
            :maxlength="40"
            show-word-limit
            v-model="editForm.location"
            size="small"
            style="width:600px;"
            placeholder="不能超过40个字符"
          ></el-input>
        </el-form-item>
        <el-form-item
          label="是否开放预约"
          prop="status"
          :rules="[{ required: true, message: '请选择是否开放预约', trigger: 'blur' }]"
        >
          <el-radio-group v-model="editForm.status" size="small">
            <el-radio label="1">开放</el-radio>
            <el-radio label="2">关闭</el-radio>
            <el-radio label="3">临时关闭</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item
          label="是否寒暑假开放"
          prop="isvacationopen"
          :rules="[{ required: true, message: '请选择是否开放寒暑假', trigger: 'blur' }]"
        >
          <el-radio-group v-model="editForm.isvacationopen" size="small">
            <el-radio label="1">是</el-radio>
            <el-radio label="0">否</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item
          label="是否有柜子"
          prop="islocakers"
          :rules="[{ required: true, message: '请选择是否有柜子', trigger: 'blur' }]"
        >
          <el-radio-group v-model="editForm.islocakers" size="small">
            <el-radio label="1">是</el-radio>
            <el-radio label="0">否</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item
          label="预约规则"
          prop="ruleid"
          :rules="[{ required: true, message: '请选择预约规则', trigger: 'blur' }]"
        >
          <el-select
            v-model="editForm.ruleid"
            size="small"
            placeholder="请选择"
            filterable
            clearable
            popper-class="noarrow"
            ref="resGroupSelect"
            style="width:600px"
          >
            <el-option v-for="item in rulesData" :key="item.id" :label="item.name" :value="item.id">
              <span style="float: left; color: rgba(0,0,0,0.65)">{{ item.name }}</span>
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
    </div>
    <section class="section">
      <div class="search-box clearfix">
        <h3>开放时间段设置</h3>
        <div class="search-box-right">
          <span class="go-back" @click="reset('time')">
            <i class="el-icon-refresh-right">&nbsp;&nbsp;重置</i>
          </span>
        </div>
      </div>
      <h3 class="link" @click="defaultSet">获取默认设置</h3>
      <time-table ref="timeSet" :tableTimes="editForm.opentimes"></time-table>
    </section>
    <section class="section">
      <div class="search-box clearfix">
        <h3>座位设置</h3>
        <div class="search-box-right">
          <span class="go-back">
            <div class="img-span" @click="$refs.impDg.dialogVisible = true" >
              <img
                style="width: 14px; height: 14px"
                src="@/assets/img/import.png"
              />
              <i>&nbsp;&nbsp;导入座位&nbsp;&nbsp;</i>
            </div>
            <i class="el-icon-refresh-right" @click="reset('seat')">&nbsp;&nbsp;重置</i>
          </span>
        </div>
      </div>
      <seat-set ref="seatSet" :detailData="seatData"></seat-set>
    </section>
    <!--  -->
    <div class="btn-footer">
      <el-button type="primary" :loading="submitLoading" size="middle" @click="submit">提交</el-button>
      <el-button size="middle" @click="$router.go(-1)">返回</el-button>
    </div>
    <import-dialog ref="impDg" :id="id" @importExcel="getSeatList"></import-dialog>
  </div>
</template>

<script>
import { fetchRules } from "@/api/manage/rule";
import { queryConfigtimes } from "@/api/manage/params";
import { saveSection, getSectionDetail } from "@/api/manage/section";
import SeatSet from "./seat/SeatSet";
import TimeTable from "@/components/TimeTable";
export default {
  components: {
    TimeTable,
    SeatSet,
    ImportDialog: () => import("./importDialog.vue")
  },
  props: {
    id: String
  },
  data() {
    return {
      submitLoading: false,
      editForm: {
        closeend: "",
        closenote: "",
        closestart: "",
        col: "",
        id: "",
        isinterval: "0",
        islocakers: "0",
        isvacationopen: "0",
        location: "",
        name: "",
        opentimes: [],
        row: "",
        ruleid: "",
        seatnum: "",
        seats: [],
        status: "3"
      },
      rulesData: [],
      seatData: {}
    };
  },
  mounted() {
    this.getRules();
    this.seatData = _.cloneDeep(this.editForm);
    if (this.id !== "create") {
      this.getDetail();
    }
  },

  methods: {
    getSeatList(arr) {
      // this.$set(this.seatData, 'seats', arr);
      this.seatData.seats = arr;
      this.seatData = {...this.seatData}
    },
    getDetail() {
      let param = {
        id: this.id
      };
      getSectionDetail(param).then(res => {
        if (res.success) {
          this.editForm = _.cloneDeep(res.data);
          this.seatData = _.cloneDeep(res.data);
        }
      });
    },
    submit() {
      this.$refs.editForm.validate(valid => {
        if (valid) {
          let param = _.cloneDeep(this.editForm);
          // 座位
          param.col = this.$refs.seatSet.editForm.col;
          param.row = this.$refs.seatSet.editForm.row;
          param.seatnum = this.$refs.seatSet.seatNum;
          param.seats = this.$refs.seatSet.seatList.flat();
          // 默认开放时间
          let openTimes = _.cloneDeep(this.$refs.timeSet.openTimes);
          openTimes.forEach(item => {
            item.starttime = item.starttime.replace(/:/gi, "");
            item.endtime = item.endtime.replace(/:/gi, "");
          });
          param.opentimes = openTimes;
          this.submitLoading = true;
          saveSection(param).then(res => {
            this.submitLoading = false;
            if (res.success) {
              this.$message({
                type: "success",
                message: "提交成功！"
              });
              this.$router.push("/section-manage");
            } else {
              this.$message({
                type: "error",
                message: "提交失败：" + res.data.message
              });
            }
          });
        }
      });
    },
    //获取全部的规则
    getRules() {
      fetchRules({}).then(res => {
        if (res.success) {
          this.rulesData = res.data;
        }
      });
    },
    //默认时间设置
    defaultSet() {
      queryConfigtimes({}).then(res => {
        if (res.success) {
          let timesArr = res.data;
          timesArr.forEach(item => {
            item.starttime = this.moment(item.starttime, "HHmm").format(
              "HH:mm"
            );
            item.endtime = this.moment(item.endtime, "HHmm").format("HH:mm");
          });
          this.$refs.timeSet.openTimes = timesArr;
        }
      });
    },
    //分段 重置
    reset(type) {
      if (type == "base") {
        this.editForm.name = "";
        this.editForm.location = "";
        this.editForm.status = "3";
        this.editForm.isvacationopen = "0";
        this.editForm.islocakers = "0";
        this.editForm.ruleid = "";
      }
      if (type == "time") {
        this.editForm.opentimes = [];
      }
      if (type == "seat") {
        this.seatData = {
          row: "",
          seats: [],
          col: "",
          id: ""
        };
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.search-box {
  padding: 15px 24px;
  line-height: 30px;
  border-bottom: 1px solid #d7dbe0;
  background: #fff;

  h3 {
    display: inline-block;
    width: 20%;
    min-width: 150px;
    font-size: 16px;
    height: 30px;
    line-height: 30px;
    font-weight: 500;
    color: #333333;
  }
  .search-box-right {
    float: right;
    max-width: 80%;
    .go-back {
      cursor: pointer;
    }
    .img-span {
      padding-right: 41px;
      display: inline-block;
      font-family: 'element-icons' !important;
      speak: none;
      font-style: normal;
      font-weight: normal;
      font-variant: normal;
      text-transform: none;
      line-height: 1;
      vertical-align: baseline;
    }
    span {
      color: #666666;
      line-height: 20px;
      font-size: 14px;
    }
  }
}
.form-box {
  padding: 0;
  .form-content {
    font-size: #333;
    margin: 0 auto;
    padding: 24px;
    background: #fff;
    margin-bottom: 24px;

    .mg-rt {
      margin-right: 12px;
    }
    .mg-lf {
      margin-left: 12px;
    }
    .time-picker {
      width: 135px;
      margin: 0 12px;
    }
    .radio-col {
      width: 100%;
      padding-bottom: 26px;
    }
    .radio-col:nth-last-child(1) {
      width: 100%;
      padding-bottom: 0px;
    }
  }
  .section {
    background: #fff;
    margin-bottom: 24px;
  }
  .btn-footer {
    padding: 20px;
    text-align: center;
    background: #fff;
    box-shadow: 0px -3px 6px 0px rgba(0, 0, 0, 0.06);
    .el-button {
      height: 38px;
      width: 70px;
    }
    .el-button + .el-button {
      margin-left: 24px;
    }
  }
}

.link {
  color: #3d7fff;
  font-size: 14px;
  font-weight: 400;
  height: 22px;
  line-height: 30px;
  margin-top: 24px;
  margin-left: 24px;
  text-decoration: underline;
  cursor: pointer;
  // float: left;
}
</style>