<template>
  <div id="agreement2" class="agreement-page" :style="hasSignature ? {'max-height': '100vh'} : ''">
    <p style=" text-align:center;" v-if="hasSignature">
      <span class="font2" style="font-weight:bold; display:inline-block; margin: 50px auto;">
        南京农业大学白马教学科研基地科教资源租用协议
      </span>
    </p>
    <div>
      甲方：
      <span class="text-with-underline">南京农业大学实验室与基地处</span>
    </div>
    <div>
      乙方：
      <span class="text-with-underline">{{ form.orgName }}-{{ form.classgroupName }}</span>
    </div>
    <div>
      (项目名称：
      <span class="text-with-underline">{{ form.projectName }}</span>
      )
    </div>
    <p style="margin-bottom: 15px">
      乙方提出科教资源使用需求的基础上，甲方根据学校发展和白马教学科研基地现有资源情况进行经统筹调配，经双方协商后达成如下协议：
    </p>
    <p class="item-content">
      <span class="order-num">第一条</span>
      乙方租用甲方科教资源用于教学科研实验，资源的所有权归学校，甲方代表学校负责统筹管理与服务，乙方租赁期负责资源的日常管理。
    </p>
    <p class="item-order">
      <span class="order-num">第二条</span>
      租用情况
    </p>
    <p class="item-order">
      租用的资源类型：{{ form.eduTypeName }}&nbsp;&nbsp;计费周期：{{
        form.chargecycle
      }}&nbsp;&nbsp;计费方式：{{ form.ct1 }}
    </p>
    <p class="item-content">
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
        v-for="item in (tableTable || []).filter(
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
          <p class="font2">
            {{ tableTable && tableTable.length && tableTable[tableTable.length - 1].cost }}
          </p>
        </td>
      </tr>
    </table>
    </p>
    <p class="item-order">
      <span class="order-num">第三条</span>
      租用期限
    </p>
    <p class="item-content">
      租期自{{ today }}到 {{ newDate }}，共{{
       common.cycleUnit(form)
      }}。租期满前30天，乙方如需继续使用，向甲方提出续租申请，经审批后办理续租手续。
    </p>
    <p class="item-order">
      <span class="order-num">第四条</span>
      相关规定
    </p>
    <pre class="item-content">{{ form.rules }}</pre>
    <p class="item-order">
      <span class="order-num">第五条</span>
      协议自双方签字之日起生效。一式两份，双方各执一份。
    </p>
    <van-row v-if="hasSignature">
      <van-col :span="12">甲方：</van-col>
      <van-col :span="12">乙方：</van-col>
      <van-col :span="12">甲方签字：</van-col>
      <van-col :span="12">乙方签字：</van-col>
      <van-col :span="12">电话：</van-col>
      <van-col :span="12">电话：</van-col>
      <van-col :span="12"
        >签订日期：&nbsp;&nbsp;&nbsp;&nbsp;年&nbsp;&nbsp;&nbsp;&nbsp;月&nbsp;&nbsp;&nbsp;&nbsp;日</van-col
      >
      <van-col :span="12"
        >签订日期：&nbsp;&nbsp;&nbsp;&nbsp;年&nbsp;&nbsp;&nbsp;&nbsp;月&nbsp;&nbsp;&nbsp;&nbsp;日</van-col
      >
    </van-row>
  </div>
</template>

<script>

export default {
  name: 'agreementForm',
  props: {
    form: Object,
    tableTable: Array,
    usetype: String, // 使用类型 1.入驻 2.续租
    today: String,
    newDate: String,
    hasSignature: Boolean,
  },
  data() {
    return {
    };
  },
  methods: {
  },
  created() {
  },
};
</script>

<style lang="scss" scoped>
.agreement-page {
  color: #333333;
  font-family: 'SimHei';
  line-height: 18px;
  letter-spacing: 1px;
  font-size: 10px;
  padding: 10px;
  max-height: 350px;
  overflow: auto;
  width: 100%;
  .text-with-underline {
    text-decoration: underline;
  }

  .order-num {
    font-size: 15px;
    font-weight: bold;
  }

  .item-order {
    margin-bottom: 10px;
  }
  .item-content {
    margin-bottom: 15px;
  }
}

pre {
  white-space: pre-wrap;
  word-wrap: break-word;
  font-family: 'SimHei';
}

.normal-table{
  table-layout: fixed;
  width: 100%;
  background: #fff;
  border: 1px solid #000;
  td{
    border: 1px solid #000;
    padding: 8px 13px;
    white-space: normal;
    word-break:break-all;
    line-height: 16px;
  }

  & tr td:nth-child(2n+1){
    font-weight: bold;
  }
}
</style>
