<template>
  <el-drawer
    class="base-drawer"
    title="订单结算"
    :visible.sync="drawer"
    direction="rtl"
    :wrapperClosable="false"
    @close="closeDrawer"
    size="660px"
  >
    <!---------------------------- 订单结算 example ---------------------------->
    <div class="drawer-container base-search-table">
      <el-form ref="editForm" :model="editForm" label-position="right" label-width="110px">
        <el-form-item label="转账凭证信息" class="black-title">
          <img v-show="showImg" class="example-img" src="@/assets/img/example.png" />
          <el-button class="example-btn" @click="showImg=!showImg" type="text">查看图例</el-button>
        </el-form-item>
        <el-form-item
          label="结算单位"
          prop="settleorg"
          :rules="[{ required: true, message: ' ', trigger: ['blur','change'] }]"
        >
          <base-dep-select :vmodel.sync="editForm.settleorg[0]" @doFunc="val => changeSelect( val)"></base-dep-select>
        </el-form-item>
        <el-form-item label="项目编号" prop="projectno">
          <el-input
            style="width:300px"
            show-word-limit
            v-model="editForm.projectno"
            placeholder="请输入"
            size="small"
          ></el-input>
        </el-form-item>
        <el-form-item
          label="经费科目编号"
          prop="fundsno"
          :rules="[{ required: true, message: ' ', trigger: ['blur','change'] }]"
        >
          <el-select
            v-model="editForm.fundsno"
            size="small"
            placeholder="请选择"
            filterable
            clearable
            popper-class="noarrow"
            ref="codeSelect"
          >
            <el-option
              v-for="item in codeList"
              :key="item.id"
              :label="item.fundsno"
              :value="item.fundsno"
            >
              <span style="float: left; color: rgba(0,0,0,0.65)">{{ item.fundsno }}</span>
              <i
                v-if="editForm.fundsno==item.fundsno"
                style="float:right;margin-top:8px;"
                class="el-icon-check"
              ></i>
            </el-option>
          </el-select>
          <i class="iconfont icon-add-circle" @click="$refs.fundCodeDialog.dialogVisible = true"></i>
          <!---------------------------- 新增经费科目编号 ---------------------------->
          <fund-code-dialog class="fixed-dialog" ref="fundCodeDialog" @doFunc="getNOList">
            <i class="el-icon-arrow-left" @click="goBackList"></i>
          </fund-code-dialog>
        </el-form-item>
      </el-form>
      <section>
        <h1 class="h1-title">订单结算</h1>
        <div class="right-div">
          共{{tableData.length}}单，合计：
          <span class="blue-total">{{alltotal}}元</span>
        </div>
      </section>
      <el-table
        :data="tableData"
        style="width:100%"
        v-loading="tableLoading"
        header-row-class-name="table-header"
      >
        <el-table-column prop="tid" label="订单号" show-overflow-tooltip width="110"></el-table-column>
        <el-table-column prop="shopname" label="餐厅" show-overflow-tooltip width="150"></el-table-column>
        <el-table-column
          prop="totalfee"
          label="合计（元)"
          show-overflow-tooltip
          width="120"
          class-name="total"
          :formatter="(row, column, val) => common.moneyFormat(val)"
        ></el-table-column>
        <el-table-column
          prop="createtime"
          label="下单时间"
          show-overflow-tooltip
          :formatter="common.timeFormat"
        ></el-table-column>
      </el-table>
    </div>
    <div class="drawer-footer">
      <el-button type="primary" size="small" @click="doSave">保存</el-button>
      <el-button size="small" @click="drawer = false">取消</el-button>
    </div>
  </el-drawer>
</template>

<script>
import BaseDepSelect from "@/components/BaseDepSelect";
import FundCodeDialog from "./fundCodeDialog";
import {
  fetchSubmitSettle,
  fetchFundCodeList,
  fetchDepList
} from "@/api/admin/settle";
export default {
  components: {
    FundCodeDialog,
    BaseDepSelect
  },
  data() {
    return {
      drawer: false,
      tableLoading: false,
      tableData: [],
      title: "",
      showImg: false,
      editForm: {
        projectno: "",
        fundsno: "",
        settleorg: [],
        settleorgid: "",
        settleorgname: ""
      },
      codeid: "",
      codeList: [],
      resGroupId: "",
      depList: []
    };
  },
  computed: {
    alltotal() {
      let sum = 0;
      this.tableData.forEach(item => {
        sum = this.common.add(sum, item.totalfee, 2);
      });
      return sum;
    }
  },
  mounted() {},

  methods: {
    // 改变选择值
    changeSelect(val) {
      let user = JSON.parse(val);
      console.log("uu", user);
      this.editForm.settleorgid = user.id;
      this.editForm.settleorgname = user.name;
      this.editForm.settleorg[0] = `${user.name}`;
    },
    // 返回下拉列表
    goBackList() {
      this.$refs.fundCodeDialog.dialogVisible = false;
      this.$refs.codeSelect.focus();
    },
    // 获取项目编号
    getCodeList() {
      let data = {
        filter: {},
        limit: 1000,
        page: 1
      };
      fetchFundCodeList(data)
        .then(res => {
          this.codeList = res.data || [];
        })
        .catch(err => {});
    },

    getNOList() {
      this.getCodeList();
    },

    doSave() {
      this.$refs.editForm.validate(valid => {
        if (valid) {
          let ids = this.tableData.map(v => v.id);
          let shop = this.tableData[0];
          let data = {
            projectno: this.editForm.projectno || null,
            fundsno: this.editForm.fundsno || null,
            orderids: ids,
            shopid: shop.shopid,
            shopname: shop.shopname,
            totalfee: this.alltotal,
            settleorgid: this.editForm.settleorgid || null, //结算单位id 结算单位名称
            settleorgname: this.editForm.settleorgname || null
          };
          fetchSubmitSettle(data).then(res => {
            if (res.success) {
              this.$message({
                showClose: true,
                type: "success",
                message: "保存成功"
              });
              this.editForm.projectno = "";
              this.drawer = false;
              this.$emit("doFunc");
            } else {
              this.$message({
                showClose: true,
                type: "error",
                message: "保存失败" + res.data.message
              });
            }
          });
        }
      });
    },

    // 关闭抽屉
    closeDrawer() {
      this.drawer = false;
    }
  }
};
</script>

<style scoped lang="scss">
.drawer-container {
  padding: 0 24px;
}
section {
  padding: 20px 0;
  .h1-title {
    height: 22px;
    font-size: 16px;
    font-weight: 600;
    color: #373b4b;
    line-height: 22px;
    display: inline-block;
  }
  .right-div {
    float: right;
  }
}
.example-btn {
  position: relative;
  z-index: 999;
}
.example-img {
  position: absolute;
  left: -74px;
  z-index: 998;
}

.el-form-item.black-title /deep/ .el-form-item__label {
  font-size: 16px;
  font-weight: 600;
  color: #373b4b;
}
.blue-total {
  font-size: 16px;
  font-weight: 600;
  color: #3a78fc;
}
//表单中的圆加号
.el-form {
  .el-select,
  .el-input {
    width: 300px;
  }
  .el-checkbox {
    display: block;
    height: 30px;
  }
  .el-form-item {
    margin-bottom: 14px;
    position: relative;
  }
  i.iconfont {
    margin-left: 5px;
    color: #3f86f7;
    font-size: 16px;
    font-weight: bold;
    cursor: pointer;
  }
  i.iconfont.icon-add-circle {
    position: relative;
    width: 40px;
    height: 26px;
    line-height: 26px;
    margin-left: -45px;
    vertical-align: middle;
    display: inline-block;
    text-align: center;
    background: #ffffff;
  }
}

.fixed-dialog {
  position: absolute;
  width: 400px;
  height: 400px;
  left: -50px;
  top: 42px;
  .el-icon-arrow-left {
    position: absolute;
    top: 15px;
    left: 15px;
    cursor: pointer;
  }
}
</style>