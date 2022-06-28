<template>
  <el-drawer
    class="base-drawer"
    title="授权结算"
    :visible.sync="drawer"
    direction="rtl"
    :wrapperClosable="false"
    @close="closeDrawer"
    size="660px"
  >
    <!---------------------------- 授权结算 ---------------------------->
    <div class="drawer-container base-search-table">
      <h1 class="h1-title" style="margin-bottom:10px">授权结算人</h1>
      <el-form ref="editForm" :model="editForm" label-position="right" label-width="100px">
        <el-form-item
          label="授权结算人"
          prop="users"
          :rules="[{ required: true, message: '请选择授权结算人', trigger: 'blur' }]"
        >
          <base-user-select :vmodel.sync="editForm.users[0]" @doFunc="val => changeSelect( val)"></base-user-select>
        </el-form-item>
      </el-form>
      <section>
        <h1 class="h1-title">授权结算单</h1>
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
import BaseUserSelect from "@/components/BaseUserSelect";
import { authSettle } from "@/api/admin/settle";
export default {
  components: {
    BaseUserSelect
  },
  data() {
    return {
      drawer: false,
      tableLoading: false,
      tableData: [],
      editForm: {
        id: null,
        name: null,
        users: []
      }
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
      this.editForm.id = user.id;
      this.editForm.name = user.name;
      this.editForm.users[0] = `${user.name}(${user.id})`;
    },
    doSave() {
      this.$refs.editForm.validate(valid => {
        if (valid) {
          let data = {
            settlerid: this.editForm.id,
            settlername: this.editForm.name,
            orderids: JSON.stringify(this.tableData.map(v => v.id))
          };
          authSettle(data).then(res => {
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