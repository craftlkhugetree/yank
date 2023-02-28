<template>
  <!-- 交接单 -->
  <div id="handover" class="boss">
    <h3 class="font6">
      南京农业大学白马教学科研基地实验温网室租、退用交接单
    </h3>
    <table border="1" class="normal-table">
      <tr>
        <td style="vertical-align:middle;" colspan="2">
          <p><span class="font1" style="font-weight:bold;">资源类型</span></p>
        </td>
        <td colspan="2" style="vertical-align:middle;">
          <p class="font1">
            <span class="font0">{{ form.typeName }}</span>
          </p>
        </td>
        <td style="vertical-align:middle;" colspan="2">
          <p><span class="font1" style="font-weight:bold;">资源编号</span></p>
        </td>
        <td style="vertical-align:middle;" colspan="5">
          <p class="font0">{{ form.resName }}</p>
        </td>
      </tr>
      <tr>
        <td style="vertical-align:middle;" colspan="2">
          <p>
            <span class="font1" style="font-weight:bold;">资源面积(㎡)</span>
          </p>
        </td>
        <td colspan="2" style="vertical-align:middle;">
          <p class="font0">{{ form.areas }}</p>
        </td>
        <td style="vertical-align:middle;" colspan="2">
          <p><span class="font1" style="font-weight:bold;">经办人</span></p>
        </td>
        <td style="vertical-align:middle;" colspan="1"></td>
        <td colspan="2" style="vertical-align:middle;">
          <p><span class="font1" style="font-weight:bold;">联系电话</span></p>
        </td>
        <td style="vertical-align:middle;" colspan="2"></td>
      </tr>
      <tr>
        <td style="vertical-align:middle;" colspan="2">
          <p><span class="font1" style="font-weight:bold;">所属学院</span></p>
        </td>
        <td colspan="2" style="vertical-align:middle;">
          <p class="font1">{{ form.orgName }}</p>
        </td>
        <td style="vertical-align:middle;" colspan="2">
          <p><span class="font1" style="font-weight:bold;">项目名称</span></p>
        </td>
        <td style="vertical-align:middle;" colspan="5">
          <p class="font1">{{ form.projectName }}</p>
        </td>
      </tr>
      <tr>
        <td rowspan="5" style="vertical-align:middle;">
          <p>
            <span class="font1" style="font-weight:bold;"
              >水<br /> 电<br />结<br />算<br />情<br />况</span
            >
          </p>
        </td>
        <td rowspan="5" style="vertical-align:middle;">
          <p><span class="font1" style="font-weight:bold;">水</span></p>
        </td>
        <td style="vertical-align:middle;" colspan="2">
          <p><span class="font1" style="font-weight:bold;">起始度数</span></p>
        </td>
        <td colspan="2"></td>
        <td rowspan="5" style="vertical-align:middle;">
          <p><span class="font1" style="font-weight:bold;">电</span></p>
        </td>
        <td style="vertical-align:middle;" colspan="2">
          <p><span class="font1" style="font-weight:bold;">起始度数</span></p>
        </td>
        <td colspan="2"></td>
      </tr>
      <tr>
        <td style="vertical-align:middle;" colspan="2">
          <p>
            <span class="font1" style="font-weight:bold;">中期结算度数</span>
          </p>
        </td>
        <td colspan="2"></td>
        <td style="vertical-align:middle;" colspan="2">
          <p>
            <span class="font1" style="font-weight:bold;">中期结算度数</span>
          </p>
        </td>
        <td colspan="2"></td>
      </tr>
      <tr>
        <td style="vertical-align:middle;" colspan="2">
          <p>
            <span class="font1" style="font-weight:bold;">中期结算度数</span>
          </p>
        </td>
        <td colspan="2"></td>
        <td style="vertical-align:middle;" colspan="2">
          <p>
            <span class="font1" style="font-weight:bold;">中期结算度数</span>
          </p>
        </td>
        <td colspan="2"></td>
      </tr>
      <tr>
        <td style="vertical-align:middle;" colspan="2">
          <p><span class="font1" style="font-weight:bold;">结束度数</span></p>
        </td>
        <td colspan="2"></td>
        <td style="vertical-align:middle;" colspan="2">
          <p><span class="font1" style="font-weight:bold;">结束度数</span></p>
        </td>
        <td colspan="2"></td>
      </tr>
      <tr>
        <td style="vertical-align:middle;" colspan="2">
          <p>
            <span class="font1" style="font-weight:bold;">需缴费用度数</span>
          </p>
        </td>
        <td colspan="2"></td>
        <td style="vertical-align:middle;" colspan="2">
          <p>
            <span class="font1" style="font-weight:bold;">需缴费用度数</span>
          </p>
        </td>
        <td colspan="2"></td>
      </tr>
      <tr>
        <td rowspan="3" style="vertical-align:middle;">
          <p>
            <span class="font1" style="font-weight:bold;"
              >房<br /> 间<br />状<br />况</span
            >
          </p>
        </td>
        <td colspan="10">
          <p>
            <span class="font1" style="font-weight:bold;">入驻房间情况：</span>
          </p>
          <p>&nbsp;</p>
          <p>&nbsp;</p>
        </td>
      </tr>
      <tr>
        <td colspan="10">
          <p>
            <span class="font1" style="font-weight:bold;"
              >退租时及恢复情况：</span
            >
          </p>
          <pre>&nbsp;</pre>
          <pre>&nbsp;</pre>
        </td>
      </tr>
      <tr>
        <td colspan="4" style="vertical-align:middle;">
          <p>
            <span class="font1" style="font-weight:bold;"
              >维修赔偿等费用（元）</span
            >
          </p>
          <p>&nbsp;</p>
          <p>&nbsp;</p>
        </td>
        <td colspan="6"></td>
      </tr>

      <tr>
        <td rowspan="5" colspan="5" style="vertical-align:middle;">
          <p>
            <span class="font1" style="font-weight:bold;"
              >入驻经办双方签字：</span
            >
          </p>
          <p>&nbsp;</p>
          <p>&nbsp;</p>
          <p>&nbsp;</p>
          <p>&nbsp;</p>
          <p>&nbsp;</p>
          <p>&nbsp;</p>
          <p>&nbsp;</p>
          <p style="font-weight:bold;text-align:right">
            <span class="font1">
              年&nbsp;&nbsp;&nbsp;&nbsp;月&nbsp;&nbsp;&nbsp;&nbsp;日
            </span>
          </p>
        </td>
        <td rowspan="5" colspan="6">
          <p>
            <span class="font1" style="font-weight:bold;">
              退租经办双方签字：</span
            >
          </p>
          <p>&nbsp;</p>
          <p>&nbsp;</p>
          <p>&nbsp;</p>
          <p>&nbsp;</p>
          <p>&nbsp;</p>
          <p>&nbsp;</p>
          <p>&nbsp;</p>
          <p style="font-weight:bold;text-align:right">
            <span class="font1">
              年&nbsp;&nbsp;&nbsp;&nbsp;月&nbsp;&nbsp;&nbsp;&nbsp;日
            </span>
          </p>
        </td>
      </tr>
    </table>
  </div>
</template>

<script>
export default {
  name: "HandoverSheet",
  props: {
    form: Object
  },
  data() {
    return {};
  }
};
</script>

<style lang="scss" scoped>
.font0 {
  font: 12pt Garamond, serif;
}
.font1 {
  font: 12pt SimHei, sans-serif;
}
.font2 {
  font: 16pt SimHei, sans-serif;
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
  width: 900px;
  padding: 120px 100px 0;
  table {
    border: 1px solid #000;
    table-layout: fixed;
    width: 100%;
    background: #fff;
    td {
      line-height: 20px;
      border: 1px solid #000;
      .people {
        text-align: right;
        width: 100%;
      }
    }
  }
}
</style>
