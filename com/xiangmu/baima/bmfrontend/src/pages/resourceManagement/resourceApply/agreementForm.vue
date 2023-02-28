<template>
  <div class="agreement-page" id="agreement" :class="{ boss: hasSignature }">
    <p style=" text-align:center;">
      <span
        class="font2"
        style="font-weight:bold; display:inline-block; margin: 50px auto;"
        >南京农业大学白马教学科研基地科教资源租用协议</span
      >
    </p>
    <div>
      甲方：<span class="text-with-underline">南京农业大学实验室与基地处</span>
    </div>
    <div>
      乙方：<span class="text-with-underline"
        >{{ resTypeDetail.orgName }}-{{ resTypeDetail.classgroupName }}</span
      >
    </div>
    <div>
      (项目名称：<span class="text-with-underline">{{
        resTypeDetail.projectName
      }}</span
      >)
    </div>
    <p style="margin-bottom: 15px">
      乙方提出科教资源使用需求的基础上，甲方根据学校发展和白马教学科研基地现有资源情况进行经统筹调配，经双方协商后达成如下协议：
    </p>
    <p class="item-content">
      <span class="order-num">第一条</span>
      乙方租用甲方科教资源用于教学科研实验，资源的所有权归学校，甲方代表学校负责统筹管理与服务，乙方租赁期负责资源的日常管理。
    </p>
    <p class="item-order"><span class="order-num">第二条</span> 租用情况</p>
    <p class="item-order">
      租用的资源类型：{{ resTypeDetail.eduTypeName }}，&nbsp;&nbsp;计费周期：{{
        resTypeDetail.chargecycle
      }}，&nbsp;&nbsp;计费方式：{{ resTypeDetail.ct1 }}
    </p>
    <table border="1" class="normal-table tableT">
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
              {{ "单价（元/" + resTypeDetail.chargecycle + "/" + resTypeDetail.ct2 + "）" }}
            </span>
          </p>
        </td>
        <td style="vertical-align:middle;">
          <p>
            <span class="font4" style="font-weight:bold;">{{
              "时长(" + resTypeDetail.chargecycle + ")"
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

    <!-- <p class="item-content">
      <el-table
        class="my-table my-table-with-total"
        :data="tableTable"
        border
        stripe
        v-loading="tableLoading"
        :span-method="objectSpanMethod"
      >
        <el-table-column
          prop="eduResourceName"
          label="资源编号"
          align="center"
          width="180"
        ></el-table-column>
        <el-table-column
          prop="eduResourceArea"
          label="面积(㎡)"
          align="center"
          width="180"
        ></el-table-column>
        <el-table-column
          width="300"
          prop="eduResourcePrice"
          :label="
            '单价（元/' +
              resTypeDetail.chargecycle +
              '/' +
              resTypeDetail.ct2 +
              '）'
          "
          align="center"
          :formatter="common.moneyFormatter"
        ></el-table-column>
        <el-table-column
          prop="useCycle"
          :label="'时长(' + resTypeDetail.chargecycle + ')'"
          align="center"
          width="160"
        ></el-table-column>

        <el-table-column
          width="180"
          prop="cost"
          label="费用(元)"
          align="center"
          :formatter="common.moneyFormatter"
          key="hasmoney"
        ></el-table-column>
      </el-table>
    </p> -->
    <p class="item-order"><span class="order-num">第三条</span> 租用期限</p>
    <p class="item-content">
      租期自{{ today }}到 {{ newDate }}，共{{
        common.cycleUnit(resTypeDetail)
      }}。乙方如需继续使用，租期满前30天，向甲方提出续租申请，经审批后办理续租手续。
    </p>
    <p class="item-order"><span class="order-num">第四条</span> 相关规定</p>
    <pre class="item-content">{{ resTypeDetail.rules }}</pre>
    <p class="item-order">
      <span class="order-num">第五条</span>
      协议自双方签字之日起生效。一式两份，双方各执一份。
    </p>
    <el-row v-if="hasSignature">
      <el-col :span="12">甲方：</el-col>
      <el-col :span="12">乙方：</el-col>
      <el-col :span="12">甲方签字：</el-col>
      <el-col :span="12">乙方签字：</el-col>
      <el-col :span="12">电话：</el-col>
      <el-col :span="12">电话：</el-col>
      <el-col :span="12"
        >签订日期：&nbsp;&nbsp;&nbsp;&nbsp;年&nbsp;&nbsp;&nbsp;&nbsp;月&nbsp;&nbsp;&nbsp;&nbsp;日</el-col
      >
      <el-col :span="12"
        >签订日期：&nbsp;&nbsp;&nbsp;&nbsp;年&nbsp;&nbsp;&nbsp;&nbsp;月&nbsp;&nbsp;&nbsp;&nbsp;日</el-col
      >
    </el-row>
  </div>
</template>

<script>
export default {
  name: "agreementForm",
  props: {
    hasSignature: Boolean,
    resTypeDetail: Object,
    dialogType: String,
    tableTable: Array //表格内容
  },
  watch: {
    resTypeDetail: {
      handler() {
        this.calDay();
      }
    }
  },
  data() {
    return {
      today: "",
      newDate: "",
      tableLoading: false
    };
  },

  methods: {
    objectSpanMethod({ row, column, rowIndex, columnIndex }) {
      if (this.tableTable && this.tableTable.length) {
        if (rowIndex === this.tableTable.length - 1) {
          if (columnIndex === 0) {
            //定位到6行0列的ID，告诉该单元格合并1行4列
            return [1, 4];
          } else if (columnIndex === 4) {
            return [1, 1];
          } else {
            //定位到6行其他列，告诉该单元格不显示
            return [0, 0];
          }
        }
      }
    },
    calDay() {
      const r = this.resTypeDetail;
      if (!r.chargecycle) {
        return;
      }
      let interval = "";
      switch (r.chargecycle) {
        case "天":
          interval = "d";
          break;
        case "月":
          interval = "M";
          break;
        case "年":
          interval = "y";
          break;
      }
      let newDate;
      let now = r.rentStartTime
        ? new Date(this.util.formatTime(r.rentStartTime, "yyyy-MM-dd"))
        : new Date();
      this.today = this.util.formatTime(now.getTime(), "yyyy年MM月dd日");
      newDate = this.common.DateAdd(interval, r.useCycle, now).getTime();
      this.newDate = this.util.formatTime(newDate, "yyyy年MM月dd日");
    }
  },

  created() {
    this.calDay();
  }
};
</script>

<style scoped lang="scss">
.font2 {
  font: 20px SimHei, sans-serif;
}
pre {
  white-space: pre-wrap;
  word-wrap: break-word;
  font-size: 18px;
  font-family: 'SimHei';
  line-height: 24px;
}
.order-num {
  font-size: 20px;
  font-weight: bolder;
}
.boss {
  width: 900px;
  // width: 100%;
  padding: 20px 80px;
}
p {
  white-space: normal;
  line-height: 32px;
}
span {
  line-height: 32px;
}
.tableT {
  table-layout: fixed;
  width: 100%;
  background: #fff;
  border: 1px solid #000;
  td {
    border: 1px solid #000;
    line-height: 32px;
    width: 25%;
  }
}
.font4 {
  font: 12pt SimHei, sans-serif;
}
.line-one {
  white-space: nowrap;
}
</style>
