<template>
  <el-drawer
    class="base-drawer"
    title="新增年度绩效额度"
    :visible.sync="drawer"
    direction="rtl"
    :wrapperClosable="false"
    @open="openDrawer"
    @close="closeDrawer"
    v-loading="drawerLoading"
    size="660px"
  >
    <div class="drawer-container">
      <div class="select-box">
        <label>
          <span>*</span>年度：
        </label>
        <el-select v-model="kpiyear" size="small" style="width:300px;" @change="getGroupList">
          <el-option v-for="item in yearList" :key="item" :label="item" :value="item"></el-option>
        </el-select>
      </div>
      <el-table
        :data="tableData"
        style="width:100%"
        header-row-class-name="table-header"
        show-summary
        :summary-method="getSum"
      >
        <el-table-column type="index" label="序号" width="60"></el-table-column>
        <el-table-column prop="groupname" label="考核分组" show-overflow-tooltip width="140"></el-table-column>
        <el-table-column prop="monthquota" label="月度考核奖总额（元）" show-overflow-tooltip>
          <template slot-scope="scope">
            <el-input
              v-model="scope.row.monthquota"
              size="small"
              @keyup.native="moneyLimit($event, scope.row, 'monthquota')"
            ></el-input>
            <!-- :class="{'is-error': !scope.row.monthquota}" -->
          </template>
        </el-table-column>
        <el-table-column prop="yearquota" label="年终考核奖总额（元）" show-overflow-tooltip>
          <template slot-scope="scope">
            <el-input
              v-model="scope.row.yearquota"
              size="small"
              @keyup.native="moneyLimit($event, scope.row, 'yearquota')"
            ></el-input>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="drawer-footer">
      <el-button type="primary" size="small" @click="doSave">保存</el-button>
      <el-button size="small" @click="drawer = false">取消</el-button>
    </div>
  </el-drawer>
</template>

<script>
import { fetchQuotaList, saveQuota } from "@/api/admin/quota.js";
import { fetchGroupList } from "@/api/admin/group.js";
export default {
  data() {
    return {
      drawer: false,
      drawerLoading: false,
      kpiyear: null,
      tableData: [],
      groupList: []
    };
  },
  computed: {
    yearList() {
      let arr = [];
      for (let i = 0; i < 5; i++) {
        arr.push(
          this.moment()
            .add(i, "y")
            .year()
        );
      }
      return arr;
    }
  },
  methods: {
    // 打开抽屉
    openDrawer() {
      this.kpiyear = this.yearList[0];
      this.getGroupList();
    },
    // 关闭抽屉
    closeDrawer() {},
    // 限制金额输入（整数或两位小数）
    moneyLimit(e, row, prop) {
      this.common.moneyInput(e);
      row[prop] = e.target.value;
    },
    // 合计
    getSum(param) {
      const { columns, data } = param;
      const sums = [];
      columns.forEach((column, index) => {
        if (index == 0) {
          sums[index] = "合计";
          return;
        }
        switch (column.property) {
          case "monthquota":
          case "yearquota":
            const values = data.map(i => Number(i[column.property]));
            sums[index] = values.reduce((prev, curr) => {
              const value = Number(curr);
              if (!isNaN(value)) {
                return prev + curr;
              } else {
                return prev;
              }
            }, 0);
        }
      });
      return sums;
    },
    // 获取审核分组列表
    getGroupList() {
      this.drawerLoading = true;
      let param = {
        kpiyear: this.kpiyear
      };
      fetchGroupList()
        .then(res => {
          if (res.success) {
            this.groupList = res.data || [];
            // 去掉部门领导分组
            this.groupList = this.groupList.filter(i => i.isdefault !== "1");
            this.tableData = this.groupList.map(i => {
              return {
                id: null,
                groupid: i.id,
                groupname: i.name,
                monthquota: null,
                yearquota: null
              };
            });
            // 获取已设置额度的考核分组
            fetchQuotaList(param).then(res => {
              this.drawerLoading = false;
              if (res.success) {
                let data = res.data || [];
                // 如果存在已设置额度的考核分组，则将其值赋值到table中
                if (data.length > 0) {
                  this.tableData.forEach(i => {
                    data.forEach(j => {
                      if (i.groupid == j.groupid) {
                        i.id = j.id;
                        i.monthquota = j.monthquota;
                        i.yearquota = j.yearquota;
                      }
                    });
                  });
                  this.tableData.sort((a, b) => {
                    if (!a.id) {
                      return 1;
                    } else if (!b.id) {
                      return -1;
                    } else {
                      return a.groupid > b.groupid ? 1 : -1;
                    }
                  });
                }
              }
            });
          } else {
            this.drawerLoading = false;
          }
        })
        .catch(err => {
          this.drawerLoading = false;
        });
    },
    // 保存
    doSave() {
      // if (this.tableData.every(i => !i.monthquota)) {
      //   this.$message({
      //     showClose: true,
      //     type: "error",
      //     message: "请输入月度考核奖总额！"
      //   });
      // } else {
        let params = this.tableData.map(i => {
          return {
            ...i,
            kpiyear: this.kpiyear
          };
        });
        this.drawerLoading = true;
        saveQuota(params)
          .then(res => {
            this.drawerLoading = false;
            if (res.success) {
              this.$message({
                showClose: true,
                type: "success",
                message: `保存成功！`
              });
              this.drawer = false;
              this.$emit("doFunc");
            } else {
              this.$message({
                showClose: true,
                type: "error",
                message: `保存失败：${res.data.message}`
              });
            }
          })
          .catch(err => {
            this.drawerLoading = false;
            this.$message({
              showClose: true,
              type: "error",
              message: `保存失败：${err}`
            });
          });
      // }
    }
  }
};
</script>

<style lang="scss" scoped>
.select-box {
  margin: 0 0 20px 30px;
  label {
    span {
      color: #ff0000;
      margin-right: 10px;
    }
  }
}
.el-form-item {
  margin-bottom: 12px;
}
</style>