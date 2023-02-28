<template>
  <!-- 申请表 -->
  <div id="stdApply" class="boss">
    <h3 class="font6">本科生实习申请</h3>
    <p><span class="font5" style="font-weight:bold;">一、基本信息</span></p>
    <table border="1" class="normal-table">
      <tr>
        <td style="vertical-align:middle;">
          <p><span class="font4" style="font-weight:bold;">学院名称</span></p>
        </td>
        <td style="vertical-align:middle;">
          <p>
            <span class="font3">
              <!-- <span class="font3" style="font-style:italic;"> -->
              {{ form.orgname }}</span
            >
          </p>
        </td>
        <td style="vertical-align:middle;">
          <p><span class="font4" style="font-weight:bold;">班级名称</span></p>
        </td>
        <td style="vertical-align:middle;">
          <p class="font2">{{ form.classname }}</p>
        </td>
      </tr>
      <tr>
        <td style="vertical-align:middle;">
          <p><span class="font4" style="font-weight:bold;">课程名称</span></p>
        </td>
        <td style="vertical-align:middle;" colspan="3">
          <p class="font2">
            {{ form.coursename }}
          </p>
        </td>
      </tr>
      <tr>
        <td style="vertical-align:middle;">
          <p>
            <span class="font4" style="font-weight:bold;">实习人数</span>
          </p>
        </td>
        <td style="vertical-align:middle;">
          <p class="font4">{{ form.prpersonnum }}</p>
        </td>
        <td style="vertical-align:middle;">
          <p><span class="font4" style="font-weight:bold;">实习日期</span></p>
        </td>
        <td style="vertical-align:middle;">
          <p class="font2">
            {{ common.formatTime(form.prstarttime, "yyyy.MM.dd") }}~{{
              common.formatTime(form.prendtime, "yyyy.MM.dd")
            }}
          </p>
        </td>
      </tr>
      <tr>
        <td style="vertical-align:middle;">
          <p><span class="font4" style="font-weight:bold;">申请人</span></p>
        </td>
        <td style="vertical-align:middle;">
          <p class="font4">{{ form.applyername }}</p>
        </td>
        <td style="vertical-align:middle;">
          <p>
            <span class="font4" style="font-weight:bold;">联系电话</span>
          </p>
        </td>
        <td style="vertical-align:middle;">
          <p class="font4">{{ form.applymobile }}</p>
        </td>
      </tr>
      <tr>
        <td style="vertical-align:middle;">
          <p>
            <span class="font4" style="font-weight:bold;">负责教师</span>
          </p>
        </td>
        <td style="vertical-align:middle;">
          <p class="font4">{{ form.leadername }}</p>
        </td>
        <td style="vertical-align:middle;">
          <p><span class="font4" style="font-weight:bold;">联系电话</span></p>
        </td>
        <td style="vertical-align:middle;">
          <p class="font2">{{ form.leadermobile }}</p>
        </td>
      </tr>
      <tr>
        <td style="vertical-align:middle;">
          <p><span class="font4" style="font-weight:bold;">参与教师</span></p>
        </td>
        <td style="vertical-align:middle;" colspan="3">
          <p class="font4" v-for="item in form.teachers" :key="item.id">
            {{ item.teachername + "  " + item.teachermobile }} <br />
          </p>
        </td>
      </tr>
      <tr>
        <td style="vertical-align:middle;">
          <p><span class="font4" style="font-weight:bold;">实习内容</span></p>
        </td>
        <td colspan="3" style="vertical-align:middle;">
          <p class="font4">
            {{ form.prcontent }}
          </p>
        </td>
      </tr>
    </table>

    <p><span class="font5" style="font-weight:bold;">二、住宿信息</span></p>
    <table border="1" class="normal-table" v-if="form.issleep == 1">
      <tr>
        <td style="vertical-align:middle;" >
          <p><span class="font4" style="font-weight:bold;">住宿日期</span></p>
        </td>
        <td style="vertical-align:middle;" colspan="2">
          <p>
            <span class="font4">
              {{ common.formatTime(form.sleepstarttime, "yyyy.MM.dd") }}~{{
                common.formatTime(form.sleependtime, "yyyy.MM.dd")
              }}
            </span>
          </p>
        </td>
        <td style="vertical-align:middle;" >
          <p>
            <span class="font4" style="font-weight:bold;">
              住宿人数
            </span>
          </p>
        </td>
        <td style="vertical-align:middle;" colspan="2">
          <p>
            <span class="font4">
              男：{{ form.sleepboynum }}人，女：{{ form.sleepgirlnum }}人
            </span>
          </p>
        </td>
      </tr>
    </table>

    <div v-else>
      <p>
        <span class="font4" style="font-weight:bold;">
          无住宿信息
        </span>
      </p>
    </div>

    <p><span class="font5" style="font-weight:bold;">三、餐食信息</span></p>
    <table border="1" class="normal-table" v-if="form.iseat == 1">
      <tr>
        <td style="vertical-align:middle;">
          <p>
            <span class="font4" style="font-weight:bold;">用餐开始时间</span>
          </p>
        </td>
        <td>
          <p class="font4">
            {{ common.formatTime(form.eatstarttime, "yyyy.MM.dd") }}（{{
              form.eatstarttype
            }}）
          </p>
        </td>
      </tr>
      <tr>
        <td style="vertical-align:middle;">
          <p>
            <span class="font4" style="font-weight:bold;">用餐结束时间</span>
          </p>
        </td>
        <td style="width: 75%">
          <p class="font4">
            {{ common.formatTime(form.eatendtime, "yyyy.MM.dd") }}（{{
              form.eatendtype
            }}）
          </p>
        </td>
      </tr>
      <tr>
        <td style="vertical-align:middle;">
          <p><span class="font4" style="font-weight:bold;">用餐人数</span></p>
        </td>
        <td style="vertical-align:middle;">
          <p class="font2">
            总人数：{{ form.eatpersonnum }}，民族生人数：{{
              form.eatmpersonnum
            }}
          </p>
        </td>
      </tr>
    </table>

    <div v-else>
      <p>
        <span class="font4" style="font-weight:bold;">
          无餐食信息
        </span>
      </p>
    </div>

    <p><span class="font5" style="font-weight:bold;">四、其他信息</span></p>
    <table border="1" class="normal-table">
      <tr>
        <td style="vertical-align:middle;">
          <p><span class="font4" style="font-weight:bold;">实习条件</span></p>
        </td>
        <td style="vertical-align:middle;">
          <p class="font2">
            {{ form.prconditions }}
          </p>
        </td>
      </tr>
      <tr>
        <td style="vertical-align:middle;">
          <p><span class="font4" style="font-weight:bold;">学生信息表</span></p>
        </td>
        <td style="vertical-align:middle;">
          <p class="font2">
            详见下一页
          </p>
        </td>
      </tr>
    </table>

    <p><span class="font5" style="font-weight:bold;">五、审批信息</span></p>
    <div v-if="!depInfo(3) && !depInfo(4) && !depInfo(5)">
      <p>
        <span class="font4" style="font-weight:bold;">
          暂无
        </span>
      </p>
    </div>
    <table border="1" class="normal-table" v-else>
      <tr v-if="depInfo(3)">
        <td style="vertical-align:middle;">
          <p>
            <span class="font4" style="font-weight:bold;">申请部门意见</span>
          </p>
        </td>
        <td style="width: 75%">
          <p class="font4">
            {{ depInfo(3).eventnote || (depInfo(3).eventresult == 1 ? "同意申请。" : "不同意申请。") }}
          </p>
          <p class="font4 people">单位领导：{{ depInfo(3).eventername }}</p>
          <p class="font2 people">
            {{ common.formatTime(depInfo(3).eventtime, "yyyy年MM月dd日") }}
          </p>
        </td>
      </tr>
      <tr v-if="depInfo(4)">
        <td style="vertical-align:middle;">
          <p>
            <span class="font4" style="font-weight:bold;">审批部门意见</span>
          </p>
        </td>
        <td style="width: 75%">
          <p class="font4">
            {{ depInfo(4).eventnote || (depInfo(4).eventresult == 1 ? "同意申请。" : "不同意申请。") }}
          </p>
          <p class="font4 people">基地管理员：{{ depInfo(4).eventername }}</p>
          <p class="font2 people">
            {{ common.formatTime(depInfo(4).eventtime, "yyyy年MM月dd日") }}
          </p>
        </td>
      </tr>
      <tr v-if="depInfo(5)">
        <td style="vertical-align:middle;">
          <p>
            <span class="font4" style="font-weight:bold;">后勤主管意见</span>
          </p>
        </td>
        <td style="width: 75%">
          <p class="font4">
            {{ depInfo(5).eventnote || (depInfo(5).eventresult == 1 ? "同意申请。" : "不同意申请。") }}
          </p>
          <p class="font4 people">后勤管理员：{{ depInfo(5).eventername }}</p>
          <p class="font2 people">
            {{ common.formatTime(depInfo(5).eventtime, "yyyy年MM月dd日") }}
          </p>
        </td>
      </tr>
    </table>
  </div>
</template>

<script>
export default {
  name: "ApplyTable",
  props: {
    form: Object
  },
  computed: {
    depInfo() {
      return function(str) {
        return (
          this.form.events &&
          this.form.events.length &&
          this.form.events.find(e => e.eventtype == str)
        );
      };
    }
  },
  data() {
    return {};
  }
};
</script>

<style lang="scss" scoped>
.font0 {
  font: 10pt Arial, sans-serif;
}
.font1 {
  font: 10pt Arial Unicode MS, sans-serif;
}
.font2 {
  font: 12pt Garamond, serif;
}
.font3 {
  font: 11pt SimHei, sans-serif;
}
.font4 {
  font: 12pt SimHei, sans-serif;
}
.font5 {
  font: 14pt SimHei, sans-serif;
  display: inline-block;
  margin-top: 20px;
  margin-bottom: 20px;
}
.font6 {
  display: inline-block;
  width: 100%;
  font: 16pt SimHei, sans-serif;
  font-weight: bold;
  margin: 20px auto;
  text-align: center;
}

.normal-table{
  background: #fff;
  border: 1px solid #000;
  td{
    border: 1px solid #000;
    padding: 8px 13px;
    white-space: normal;
    word-break:break-all;
    line-height: 32px;
  }

  & tr td:nth-child(2n+1){
    font-weight: bold;
  }
}
.boss {
  width: 1000px;
  padding: 120px 100px 0;
  table {
    border: 1px solid #000;
    background: #fff;
    table-layout: fixed;
    width: 100%;
    td {
      line-height: 32px;
      border: 1px solid #000;
      width: 25%;
      .people {
        text-align: right;
        width: 100%;
      }
    }
  }
}
.line-one {
  white-space: nowrap;
}
</style>
