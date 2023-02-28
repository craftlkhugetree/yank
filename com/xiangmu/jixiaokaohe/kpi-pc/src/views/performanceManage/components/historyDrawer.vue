<template>
  <el-drawer
    class="base-drawer"
    :title="title"
    :visible.sync="drawer"
    direction="rtl"
    :wrapperClosable="false"
    @open="openDrawer"
    @close="closeDrawer"
    v-loading="drawerLoading"
    size="750px"
  >
    <div class="drawer-container base-search-table">
      <div class="header-box">
        <label>
          绩效合计：
          <el-tag class="blue-tag">{{alltotal}}元</el-tag>
        </label>
        <span style="float:right">
          <el-date-picker
            class="no-border date-select"
            v-model="year"
            type="year"
            placeholder="选择年"
            size="small"
            value-format="yyyy"
            format="yyyy年"
            style="width:100px;"
            :clearable="false"
            @change="getTableData"
          ></el-date-picker>
          <i class="el-icon-arrow-down"></i>
        </span>
      </div>
      <el-table :data="tableData" style="width:100%" header-row-class-name="table-header">
        <el-table-column type="index" label="时间" show-overflow-tooltip width="100">
          <template slot-scope="scope">{{scope.row.yeardate}}年{{scope.row.monthdate}}月</template>
        </el-table-column>
        <el-table-column
          prop="allowance"
          label="领导岗位津贴（元）"
          :formatter="(row, column, val) => common.moneyFormat(val)"
        ></el-table-column>
        <el-table-column
          prop="outsalary"
          label="外挂工资(元)"
          :formatter="(row, column, val) => common.moneyFormat(val)"
        ></el-table-column>
        <el-table-column
          prop="monthsalary"
          label="月度考核奖（元）"
          :formatter="(row, column, val) => common.moneyFormat(val)"
        ></el-table-column>
        <el-table-column
          prop="othersalary"
          label="其他（元）"
          :formatter="(row, column, val) => common.moneyFormat(val)"
        ></el-table-column>
        <el-table-column
          prop="totalsalary"
          label="月绩效合计（元）"
          :formatter="(row, column, val) => common.moneyFormat(val)"
        ></el-table-column>
      </el-table>
    </div>
  </el-drawer>
</template>

<script>
import { findUserDetails } from "@/api/kpi/manage";
export default {
  data() {
    return {
      drawer: false,
      drawerLoading: false,
      tableData: [],
      title: "",
      type: "1", // 1-月绩效，2-年绩效，3-特殊发放，4-领导绩效
      userid: null,
      year: this.moment().format("YYYY")
    };
  },
  computed: {
    levelList() {
      return this.$store.state.levelList;
    },
    alltotal() {
      let sum = 0;
      this.tableData.forEach(item => {
        sum = this.common.add(sum, item.totalsalary, 2);
      });
      return sum;
    }
  },
  mounted() {
    let yy = this.moment().format("YYYY");
  },
  methods: {
    // 打开抽屉
    openDrawer() {},
    // 关闭抽屉
    closeDrawer() {
      this.$emit("doFunc");
    },

    getTableData() {
      let param = {
        userid: this.userid,
        type: this.type,
        yeardate: this.year
      };
      findUserDetails(param).then(res => {
        if (res.success) {
          let newData = res.data || [];
          this.tableData = newData;
        }
      });
    },
    // 保存
    doSave() {
      this.$refs.editForm.validate(valid => {
        if (valid) {
        }
      });
    }
  }
};
</script>

<style scoped lang="scss">
.el-form-item {
  margin-bottom: 12px;
}
.header-box {
  padding: 0px 20px;
  position: relative;
  .iconrili:before {
    font-size: 32px;
    position: absolute;
    right: 86px;
    bottom: -2px;
    display: inline-block;
  }
}
.tag-blue /deep/ .el-tag {
  color: #3f86f7;
  background: #ebf2fe;
  border-radius: 2px;
  border: 1px solid #85b2fa;
  height: 24px;
  line-height: 24px;
}
.year /deep/.el-input__inner {
  border: none;
  padding-right: 0px;
  padding-left: 0px;
}
.year /deep/.el-input__icon {
  display: none;
}
</style>