<template>
  <el-drawer
    class="base-drawer"
    :title="title"
    :visible.sync="drawer"
    direction="rtl"
    :wrapperClosable="false"
    @close="closeDrawer"
    size="660px"
  >
    <div class="drawer-container base-search-table">
      <el-form ref="editForm" :model="editForm" label-position="right" label-width="100px">
        <el-form-item
          label="记录名称"
          prop="collectName"
          :rules="[{ required: true, message: '请输入记录名称', trigger: 'blur' }]"
        >
          <el-input
            style="width:300px"
            :maxlength="40"
            show-word-limit
            v-model="editForm.collectName"
            placeholder="请输入"
          ></el-input>
        </el-form-item>

        <el-form-item label="汇总合计" prop="alltotal">
          <el-tag class="blue-tag">{{alltotal}}元</el-tag>
        </el-form-item>
      </el-form>
      <el-table
        :data="tableData"
        style="width:100%"
        v-loading="tableLoading"
        header-row-class-name="table-header"
      >
        <el-table-column prop="title" label="绩效清单" show-overflow-tooltip width="300"></el-table-column>
        <el-table-column prop="totalfee" label="发放总金额(元)"></el-table-column>
        <el-table-column prop="orignal" label="来源">
          <template slot-scope="scope">
            <i>{{getOrignal(scope.row)}}</i>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="drawer-footer">
      <el-button type="primary" :loading="saveLoading" size="small" @click="doSave">保存</el-button>
      <el-button size="small" @click="drawer = false">取消</el-button>
    </div>
  </el-drawer>
</template>

<script>
import { collectSave } from "@/api/kpi/collect";
export default {
  data() {
    return {
      saveLoading: false,
      drawer: false,
      tableLoading: false,
      tableData: [],
      title: "",
      editForm: {
        collectName: ""
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
    getOrignal(row) {
      let str;
      if (row.orignal == "kpi") {
        str = ["1", "2"].includes(row.type) ? "考核组录入" : "发放录入";
      } else {
        str = row.orignal == "collect" ? "发放汇总" : "系统生成";
      }
      return str;
    },
    doSave() {
      this.$refs.editForm.validate(valid => {
        if (valid) {
          let uncollectArr =
            this.tableData.filter(item => item.orignal !== "collect") || [];
          let uncollectids = uncollectArr.map(v => v.id);

          let ids = this.tableData.map(item => item.id);
          let collectArr =
            this.tableData.filter(item => item.orignal == "collect") || [];
          let collectids = collectArr.map(v => v.id);
          let data = {
            collectids: collectids,
            kpiids: uncollectids,
            name: this.editForm.collectName,
            totalfee: this.alltotal
          };
          this.saveLoading = true;
          collectSave(data).then(res => {
            if (res.success) {
              this.$message({
                showClose: true,
                type: "success",
                message: "保存成功"
              });
              this.editForm.collectName = "";
              this.drawer = false;
              this.$emit("doFunc");
              this.saveLoading = false;
            } else {
              this.$message({
                showClose: true,
                type: "error",
                message: "保存失败" + res.data.message
              });
              this.saveLoading = false;
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
</style>