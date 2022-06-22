<template>
  <!-- 基本信息 -->
  <div class="form-box">
    <div class="form-box-title">1.基本信息</div>
    <div class="form-box-content">
      <van-field v-model="editForm.orgname" name="学院名称" label="学院名称" placeholder="请输入" disabled />
      <van-field v-model="editForm.classname" name="班级名称" label="班级名称" placeholder="请输入" />
      <van-field v-model="editForm.coursename" name="课程名称" label="课程名称" placeholder="请输入" />
      <!-- <van-field
        v-model="editForm.prcontent"
        name="实习内容"
        label="实习内容"
        placeholder="请输入"
        :rules="[{ required: true, message: '请填写实习内容' }]"
      />-->
      <van-field
        v-model="editForm.prpersonnum"
        name="实习人数(人)"
        label="实习人数(人)"
        placeholder="请输入"
        type="digit"
        label-width="100px"
      />
      <van-field
        readonly
        clickable
        name="实习日期"
        v-model="editForm.prtime"
        label="实习日期"
        placeholder="请选择"
        @click="showPrCalendar = true"
        right-icon="calender-o"
        :border="false"
        style="padding-bottom:0;"
      />
      <van-cell style="padding-top:0;">
        <span style="color:#faac16;font-size:12px;">请提前{{ruleDay}}天申请</span>
      </van-cell>
      <van-calendar
        v-model="showPrCalendar"
        type="range"
        @confirm="onConfirmPrDate"
        :show-confirm="false"
        color="#00b09b"
        :default-date="common.defaultDate(editForm.prtime, true)"
        :min-date="prMinDate"
        :max-date="new Date(2050,1,1)"
      />
      <van-field
        v-model="editForm.applyername"
        name="申请人"
        label="申请人"
        placeholder="请输入"
        disabled
        :border="false"
      />
      <van-field
        v-model="editForm.applymobile"
        name="联系电话"
        label="联系电话"
        placeholder="请输入"
        type="tel"
        style="padding-top: 5px"
        :rules="[{ validator: (v) => {
                if(v) {
                  return /1\d{10}$/.test(v)
                } else {
                  return true;
                }
              },message: '请填写正确的手机号' }]"
      />
      <van-field
        name="负责教师"
        label="负责教师"
        placeholder="请选择"
        readonly
        clickable
        v-model="editForm.leadername"
        @click="showLeaderPicker = true"
        right-icon="arrow-down"
        :border="false"
      />
      <base-user-select-popup :showPicker.sync="showLeaderPicker" @selectItem="selectLeader"></base-user-select-popup>
      <van-field
        v-model="editForm.leadermobile"
        name="联系电话"
        label="联系电话"
        placeholder="请输入"
        type="tel"
        style="padding-top: 5px"
        :rules="[{ validator: (v) => {
                if(v) {
                  let reg = /1\d{10}$/
                  return reg.test(v)
                } else {
                  return true;
                }
              },message: '请填写正确的手机号' }]"
      />
      <!-- 参与教师 -->
      <div class="field-box">
        <p>参与教师</p>
        <div class="field-box-box">
          <li v-for="(item,index) in editForm.teacherList" :key="index">
            <van-field
              class="no-show-error"
              :name="'参与教师' + index"
              v-model="item.teachername"
              left-icon="manager"
              placeholder="请选择"
              input-align="left"
              readonly
              clickable
              @click="showTeacherPicker = true; teacherIndex = index;"
            ></van-field>
            <van-field
              class="no-show-error"
              v-model="item.teachermobile"
              :name="'联系电话' + index"
              left-icon="phone"
              placeholder="请填写"
              input-align="left"
              type="tel"
              :rules="[{ validator: (v) => {
                if(v) {
                  return /1\d{10}$/.test(v)
                } else {
                  return true;
                }
              }, message: '请填写正确的手机号' }]"
            ></van-field>
            <van-icon name="clear" color="#fe3e61" size="20" @click="deleteTeacher(item,index)"></van-icon>
          </li>
          <base-user-select-popup :showPicker.sync="showTeacherPicker" @selectItem="selectTeacher"></base-user-select-popup>
          <van-button icon="add" size="large" @click="addTeacher">新增</van-button>
        </div>
      </div>
      <div class="field-box">
        <div class="field-box-textarea">
          <p>实习内容</p>
          <van-field
            v-model="editForm.prcontent"
            name="实习内容"
            placeholder="请输入"
            rows="3"
            type="textarea"
            :show-word-limit="true"
            input-align="left"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import BaseUserSelectPopup from "../../../components/BaseUserSelectPopup";
export default {
  components: {
    BaseUserSelectPopup
  },
  data() {
    return {
      editForm: {
        id: "",
        orgname: "",
        classname: "",
        coursename: "",
        prcontent: "",
        prpersonnum: "",
        prtime: "",
        prstarttime: "",
        prendtime: "",
        applyername: "",
        applymobile: "",
        leadername: "",
        leaderid: "",
        leadermobile: "",
        teacherList: []
      },
      showLeaderPicker: false,
      showPrCalendar: false,
      showTeacherPicker: false,
      teacherIndex: "",
      ruleDay: ""
    };
  },
  props: {
    id: String,
    data: Object
  },
  computed: {
    // 最小可选时间
    prMinDate() {
      let days = parseInt(this.ruleDay) || 0;
      return this.common.DateAdd("天", days, new Date());
    }
  },
  methods: {
    // 选择实习日期
    onConfirmPrDate(date) {
      const [start, end] = date;
      this.editForm.prtime = `${start.getFullYear()}.${start.getMonth() +
        1}.${start.getDate()} - ${end.getFullYear()}.${end.getMonth() +
        1}.${end.getDate()}`;
      this.editForm.prstarttime = this.common.formatTime(
        start.getTime(),
        "YYYYMMDD000000"
      );
      this.editForm.prendtime = this.common.formatTime(
        end.getTime(),
        "YYYYMMDD000000"
      );
      this.showPrCalendar = false;
      this.$emit("changeMinDate",start);
    },
    // 选择负责人
    selectLeader(item) {
      this.editForm.leadername = item.name;
      this.editForm.leaderid = item.id;
      this.showLeaderPicker = false;
    },
    // 新增教师
    addTeacher() {
      this.editForm.teacherList.push({
        teacherid: "",
        teachername: "",
        teachermobile: ""
      });
    },
    // 删除教师
    deleteTeacher(item, index) {
      this.editForm.teacherList.splice(index, 1);
    },
    // 选择参与教师
    selectTeacher(item) {
      let curTeacher = this.editForm.teacherList[this.teacherIndex];
      curTeacher.teacherid = item.id;
      curTeacher.teachername = item.name;
      this.showTeacherPicker = false;
    },
    // 获取规则(提前天数)
    getRule() {
      this.util
        .postAjax({
          code: this.global.bmCode,
          url: "/rules/findByCode",
          data: {
            code: "PRJZGDAY"
          }
        })
        .then(res => {
          if (res.success) {
            this.ruleDay = res.item.rulevalue;
          }
        });
    }
  },
  created() {
    if (!this.id) {
      // 获取用户信息
      let userInfo = this.$store.state.userInfo;
      this.editForm.orgname = userInfo.ORGNAME;
      this.editForm.orgid = userInfo.ORGID;
      this.editForm.applyername = userInfo.NAME;
    } else {
      // 从详情中获取数据
      for (let i in this.editForm) {
        this.editForm[i] = this.data[i] || "";
      }
      this.editForm.prtime = this.editForm.prstarttime ?
        this.common.formatTime(this.editForm.prstarttime, "YYYY.MM.DD") +
        " - " +
        this.common.formatTime(this.editForm.prendtime, "YYYY.MM.DD") : "";
    }
    // 获取规则
    this.getRule();
  }
};
</script>

<style lang="scss" scoped>
</style>