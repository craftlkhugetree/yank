<template>
  <div class="agreement-page">
    <div>
      甲方：
      <span class="text-with-underline">南京农业大学实验室与基地处</span>
    </div>
    <div>
      乙方：
      <span class="text-with-underline">{{form.orgname}}-{{form.classname}}</span>
    </div>
    <div>
      (项目名称：
      <span class="text-with-underline">{{form.projectname}}</span>)
    </div>
    <p style="margin-bottom: 15px">乙方提出科教资源使用需求的基础上，甲方根据学校发展和白马教学科研基地现有资源情况进行经统筹调配，经双方协商后达成如下协议：</p>
    <p class="item-content">
      <span class="order-num">第一条</span> 乙方租用甲方科教资源用于教学科研实验，资源的所有权归学校，甲方代表学校负责统筹管理与服务，乙方租赁期负责资源的日常管理。
    </p>
    <p class="item-order">
      <span class="order-num">第二条</span> 租用情况
    </p>
    <p
      class="item-order"
    >租用的资源类型：{{resTypeDetail.name}}&nbsp;&nbsp;单价：{{'元/'+resTypeDetail.chargecycle+'/'+resTypeDetail.chargetype}}&nbsp;&nbsp;计费周期：{{resTypeDetail.chargecycle}}&nbsp;&nbsp;计费方式：{{resTypeDetail.chargetype2}}</p>
    <p class="item-content">
      <el-table
        class="my-table my-table-with-total"
        :data="tableData"
        style="width: 100%"
        show-summary
        :summary-method="getSummaries"
        border
      >
        <el-table-column prop="rescode" label="资源编号" align="center"></el-table-column>
        <el-table-column prop="area" label="面积" align="center"></el-table-column>
        <el-table-column
          prop="price"
          :label="'单价(元/'+resTypeDetail.chargecycle+'/'+resTypeDetail.chargetype+')'"
          align="center"
          :formatter="common.moneyFormatter"
        ></el-table-column>
        <el-table-column
          prop="usecycle"
          :label="'时长('+ resTypeDetail.chargecycle+ ')'"
          align="center"
        ></el-table-column>
        <el-table-column
          prop="cost"
          label="费用(元)"
          align="center"
          :formatter="common.moneyFormatter"
        ></el-table-column>
      </el-table>
    </p>
    <p class="item-order">
      <span class="order-num">第三条</span> 租用期限
    </p>
    <p
      class="item-content"
    >租期自{{today}}到 {{newDate}}，共{{form.usecycle}}{{resTypeDetail.chargecycle}}。租期满前30天，乙方如需继续使用，向甲方提出续租申请，经审批后办理续租手续。</p>
    <p class="item-order">
      <span class="order-num">第四条</span> 相关规定
    </p>
    <p class="item-content">{{resTypeDetail.rules}}</p>
    <p class="item-order">
      <span class="order-num">第五条</span> 协议自双方签字之日起生效。一式两份，双方各执一份。
    </p>
  </div>
</template>

<script>
import util from "../../../assets/js/util";
import global from "../../../assets/js/global";

export default {
  name: "agreementForm",
  props: {
    form: Object,
    resList: Array,
    usetype: String // 使用类型 1.入驻 2.续租
  },
  data() {
    return {
      tableData: [], //表格内容
      today: "",
      newDate: ""
    };
  },
  computed: {
    // 资源类型详情
    resTypeDetail() {
      let curEduResType = sessionStorage.getItem("curEduResType");
      let resTypeDetail = curEduResType ? JSON.parse(curEduResType) : {};
      // 转换计费方式
      resTypeDetail.chargetype2 = this.common.chargetypeFormatter(
        resTypeDetail.chargetype,
        "name"
      );
      resTypeDetail.chargetype = this.common.chargetypeFormatter(
        resTypeDetail.chargetype,
        "unit"
      );
      // 转换计费周期
      resTypeDetail.chargecycle = this.common.chargecycleFormatter(
        resTypeDetail.chargecycle
      );
      return resTypeDetail;
    }
  },
  methods: {
    // 合计
    getSummaries({ columns, data }) {
      let sums = [];
      sums[0] = "合计";
      columns.forEach((column, index) => {
        if (index > 0 && index < 4) {
          sums[index] = "--";
          return;
        }
      });
      if (columns[4]) {
        let values = data.map(i => i[columns[4].property]);
        sums[4] = values.reduce((pre, cur) => {
          return this.common.add(pre, cur);
        }, 0);
      } else {
        sums[4] = "--";
      }
      return sums;
    },

    // 表格
    setTableData() {
      let resids = this.form.resList.map(i => i.resid);
      this.tableData = this.resList.filter(i => resids.includes(i.id));
      this.tableData.forEach(i => {
        i.usecycle = this.form.usecycle;
        i.cost =
          this.resTypeDetail.chargetype === "间"
            ? this.common.multiply(i.usecycle, i.price)
            : this.common.multiply(
                this.common.multiply(i.usecycle, i.price),
                i.area
              );
      });
    },

    // 日期
    setDate() {
      let interval = this.resTypeDetail.chargecycle;
      let now = "";
      if (this.usetype === "1") {
        now = new Date();
      } else if (this.usetype === "2") {
        let date = sessionStorage.getItem("lastEndTime");
        let date2 = this.util.formatTime(date, "yyyy-MM-dd hh:mm:ss");
        now = new Date(date2);
      }
      this.today = this.util.formatTime(now.getTime(), "yyyy年MM月dd日");
      let newDate = this.common.DateAdd(interval, this.form.usecycle, now);
      this.newDate = this.util.formatTime(newDate.getTime(), "yyyy年MM月dd日");
    }
  },
  created() {
    // 计算日期
    this.setDate();
    // 设置表格数据
    this.setTableData();
  }
};
</script>

<style lang="scss" scoped>
.agreement-page {
  color: #333333;
  line-height: 18px;
  letter-spacing: 1px;
  font-size: 10px;
  padding: 10px;
  max-height: 350px;
  overflow: auto;

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
</style>
