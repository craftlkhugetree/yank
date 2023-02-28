<template>
  <!-- 申请表 -->
  <div id="applyTable" class="boss">
    <h3 class="font6">科教资源申请</h3>
    <p><span class="font5" style="font-weight:bold;">一、申请信息</span></p>
    <table border="1" class="normal-table">
      <tr>
        <td style="vertical-align:middle;">
          <p><span class="font4" style="font-weight:bold;">资源类型</span></p>
        </td>
        <td style="vertical-align:middle;">
          <p>
            <span class="font3">
              <!-- <span class="font3" style="font-style:italic;"> -->
              {{ form.typeName }}</span
            >
          </p>
        </td>
        <td style="vertical-align:middle;">
          <p><span class="font4" style="font-weight:bold;">资源编号</span></p>
        </td>
        <td style="vertical-align:middle;">
          <p class="font2">{{ form.resName }}</p>
        </td>
      </tr>
      <tr>
        <td style="vertical-align:middle;">
          <p><span class="font4" style="font-weight:bold;">面积(㎡)</span></p>
        </td>
        <td style="vertical-align:middle;">
          <p class="font2">
            {{ form.areas }}
          </p>
        </td>
        <td style="vertical-align:middle;">
          <p><span class="font4" style="font-weight:bold;">使用时长</span></p>
        </td>
        <td style="vertical-align:middle;">
          <p class="font2">
            {{ common.cycleUnit(form) }}
          </p>
        </td>
      </tr>
      <tr>
        <td style="vertical-align:middle;">
          <p>
            <span class="font4" style="font-weight:bold;"
              >课题组经费负责人</span
            >
          </p>
        </td>
        <td style="vertical-align:middle;">
          <p class="font4">{{ form.classfeeLeaderName }}</p>
        </td>
        <td style="vertical-align:middle;">
          <p><span class="font4" style="font-weight:bold;">联系电话</span></p>
        </td>
        <td style="vertical-align:middle;">
          <p class="font2">{{ form.classfeeLeaderMobile }}</p>
        </td>
      </tr>
      <tr>
        <td style="vertical-align:middle;">
          <p><span class="font4" style="font-weight:bold;">学院名称</span></p>
        </td>
        <td style="vertical-align:middle;">
          <p class="font4">{{ form.orgName }}</p>
        </td>
        <td style="vertical-align:middle;">
          <p>
            <span class="font4" style="font-weight:bold;">课题组名称</span>
          </p>
        </td>
        <td style="vertical-align:middle;">
          <p class="font4">{{ form.classgroupName }}</p>
        </td>
      </tr>
      <tr>
        <td style="vertical-align:middle;">
          <p>
            <span class="font4" style="font-weight:bold;">日常联系人</span>
          </p>
        </td>
        <td style="vertical-align:middle;">
          <p class="font4">{{ form.contacterName }}</p>
        </td>
        <td style="vertical-align:middle;">
          <p><span class="font4" style="font-weight:bold;">联系电话</span></p>
        </td>
        <td style="vertical-align:middle;">
          <p class="font2">{{ form.contacterMobile }}</p>
        </td>
      </tr>
      <tr>
        <td style="vertical-align:middle;">
          <p><span class="font4" style="font-weight:bold;">项目名称</span></p>
        </td>
        <td style="vertical-align:middle;">
          <p class="font4">{{ form.projectName }}</p>
        </td>
        <td style="vertical-align:middle;">
          <p><span class="font4" style="font-weight:bold;">项目来源</span></p>
        </td>
        <td style="vertical-align:middle;">
          <p class="font4">{{ form.projectFrom }}</p>
        </td>
      </tr>
      <tr>
        <td style="vertical-align:middle;">
          <p><span class="font4" style="font-weight:bold;">项目经费</span></p>
        </td>
        <td style="vertical-align:middle;">
          <p class="font2">
            {{ form.projectFee }}<span class="font4">万元</span>
          </p>
        </td>
        <td style="vertical-align:middle;">
          <p><span class="font4" style="font-weight:bold;">项目时间</span></p>
        </td>
        <td style="vertical-align:middle;">
          <p class="font2">
            {{ form.projectStarttime }} ~
            {{ form.projectEndtime }}
          </p>
        </td>
      </tr>
      <tr>
        <td style="vertical-align:middle;">
          <p><span class="font4" style="font-weight:bold;">项目概况</span></p>
        </td>
        <td colspan="3" style="vertical-align:middle;">
          <p class="font4">
            {{ form.projectOverview }}
          </p>
        </td>
      </tr>
      <tr>
        <td style="vertical-align:middle;">
          <p><span class="font4" style="font-weight:bold;">实验概况</span></p>
        </td>
        <td colspan="3" style="vertical-align:middle;">
          <p class="font4">
            {{ form.experimentOverview }}
          </p>
        </td>
      </tr>
      <tr>
        <td style="vertical-align:middle;">
          <p><span class="font4" style="font-weight:bold;">预期成果</span></p>
        </td>
        <td colspan="3" style="vertical-align:middle;">
          <p class="font4">
            {{ form.expectedResult }}
          </p>
        </td>
      </tr>
    </table>

    <p><span class="font5" style="font-weight:bold;">二、费用</span></p>
    <table border="1" class="normal-table">
      <tr>
        <td style="vertical-align:middle;">
          <p><span class="font4" style="font-weight:bold;">资源编号</span></p>
        </td>
        <td style="vertical-align:middle;">
          <p><span class="font4" style="font-weight:bold;">面积(㎡)</span></p>
        </td>
        <td style="vertical-align:middle;">
          <p>
            <span class="font4 line-one" style="font-weight:bold;">
              {{ "单价（元/" + form.chargecycle + "/" + form.ct2 + "）" }}
            </span>
          </p>
        </td>
        <td style="vertical-align:middle;">
          <p>
            <span class="font4" style="font-weight:bold;">{{
              "时长(" + form.chargecycle + ")"
            }}</span>
          </p>
        </td>
        <td style="vertical-align:middle;">
          <p><span class="font4" style="font-weight:bold;">费用（元）</span></p>
        </td>
      </tr>
      <tr
        v-for="item in (form.resArr || []).filter(
          (r, id, arr) => id !== arr.length - 1
        )"
        :key="item.eduResourceId"
      >
        <td style="vertical-align:middle;">
          <p class="font2">{{ item.eduResourceName }}</p>
        </td>
        <td style="vertical-align:middle;">
          <p class="font2">{{ item.eduResourceArea }}</p>
        </td>
        <td style="vertical-align:middle;">
          <p class="font2">
            {{ common.moneyFormatter("", "", item.eduResourcePrice) }}
          </p>
        </td>
        <td style="vertical-align:middle;">
          <p class="font2">
            {{ item.useCycle }}
          </p>
        </td>
        <td style="vertical-align:middle;">
          <p class="font2">{{ item.cost }}</p>
        </td>
      </tr>

      <tr>
        <td
          colspan="4"
          style="vertical-align:middle;font-weight:bold;text-align: center"
        >
          <p><span class="font4">合计</span></p>
        </td>
        <td style="vertical-align:middle;">
          <p class="font2">{{ form.resArr && form.resArr[form.resArr.length - 1].cost }}</p>
        </td>
      </tr>
    </table>

    <p><span class="font5" style="font-weight:bold;">三、审批信息</span></p>
    <table border="1" class="normal-table">
      <tr v-if="depInfo('LD').bizNode === 'LD'">
        <td style="vertical-align:middle;">
          <p>
            <span class="font4" style="font-weight:bold;">申请部门意见</span>
          </p>
        </td>
        <td style="width: 75%">
          <p class="font4">
            {{ depInfo("LD").eventNote || (depInfo("LD").eventResult == 1 ? "同意申请。" : "不同意申请。") }}
          </p>
          <p class="font4 people">单位领导：{{ depInfo("LD").createName }}</p>
          <p class="font2 people">
            {{ common.formatTime(depInfo("LD").createTime, "yyyy年MM月dd日") }}
          </p>
        </td>
      </tr>
      <tr v-if="depInfo('BM').bizNode === 'BM'">
        <td style="vertical-align:middle;">
          <p>
            <span class="font4" style="font-weight:bold;">审批部门意见</span>
          </p>
        </td>
        <td style="width: 75%">
          <p class="font4">
            {{ depInfo("BM").eventNote || (depInfo("BM").eventResult == 1 ? "同意申请。" : "不同意申请。") }}
          </p>
          <p class="font4 people">基地管理员：{{ depInfo("BM").createName }}</p>
          <p class="font2 people">
            {{ common.formatTime(depInfo("BM").createTime, "yyyy年MM月dd日") }}
          </p>
        </td>
      </tr>
      <div
        v-if="depInfo('BM').bizNode !== 'BM' && depInfo('LD').bizNode !== 'LD'"
      >
        暂无
      </div>
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
          (this.form.events &&
            this.form.events.length &&
            this.form.events.find(e => e.bizNode === str)) ||
          {}
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
.boss {
  width: 100%;
  padding: 20px 10px;
  table {
    table-layout: fixed;
    width: 100%;
    td {
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
</style>
