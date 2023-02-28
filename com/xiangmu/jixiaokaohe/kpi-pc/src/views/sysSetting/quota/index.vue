<template>
  <div class="base-search-table">
    <div class="search-box clearfix" style="padding: 15px 20px 0;">
      <h3>绩效额度管理</h3>
      <!---------------------------- 查询条件 ---------------------------->
      <div class="search-box-right">
        <el-date-picker
          class="no-border date-select no-clear"
          v-model="kpiyear"
          type="year"
          placeholder="选择年"
          size="small"
          value-format="yyyy"
          format="yyyy年"
          style="width:80px;"
          :clearable="false"
          @change="getTableData"
        ></el-date-picker>
        <i class="el-icon-arrow-down"></i>
        <el-divider direction="vertical"></el-divider>
        <el-button type="primary" size="small" icon="el-icon-plus" @click="openAddDrawer">新增</el-button>
      </div>
    </div>
    <!---------------------------- 表格 ---------------------------->
    <div class="table-content">
      <el-table
        :data="tableData"
        style="width:100%;margin-top:10px;"
        header-row-class-name="table-header"
        v-loading="loading"
      >
        <el-table-column type="index" label="序号" show-overflow-tooltip width="60"></el-table-column>
        <el-table-column prop="groupname" label="考核分组" show-overflow-tooltip></el-table-column>
        <el-table-column prop="monthquota" :label="kpiyear + '年月度考核奖总额（元）'" show-overflow-tooltip>
          <template slot-scope="scope">
            <el-input
              v-if="scope.row.isEdit"
              v-model="scope.row.editMonthquota"
              size="small"
              :class="{'is-error': !scope.row.editMonthquota}"
              @keyup.native="moneyLimit($event, scope.row, 'editMonthquota')"
            ></el-input>
            <span v-else style="color:#606266;">{{common.moneyFormat(scope.row.monthquota)}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="yearquota" :label="kpiyear + '年终考核奖总额（元）'" show-overflow-tooltip>
          <template slot-scope="scope">
            <el-input
              v-if="scope.row.isEdit"
              v-model="scope.row.editYearquota"
              size="small"
              @keyup.native="moneyLimit($event, scope.row, 'editYearquota')"
            ></el-input>
            <span v-else style="color:#606266;">{{common.moneyFormat(scope.row.yearquota)}}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" width="250">
          <template slot-scope="scope">
            <div v-if="scope.row.id">
              <div v-if="!scope.row.isEdit">
                <!-- <span @click="scope.row.isEdit = true" v-if="kpiyear >= moment().format('YYYY')">编辑</span> -->
                <span @click="scope.row.isEdit = true">编辑</span>
                <span @click="openDrawer(scope.row)">操作记录</span>
              </div>
              <div v-else>
                <span @click.stop="editRow(scope.row,true)">保存</span>
                <span @click.stop="editRow(scope.row,false)">取消</span>
              </div>
            </div>
            <div v-else>--</div>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!-------------------------- 批量编辑弹窗 -------------------------->
    <add-drawer ref="addDrawer" @doFunc="getTableData"></add-drawer>
    <!-------------------------- 操作记录弹窗 -------------------------->
    <record-drawer ref="recordDrawer"></record-drawer>
  </div>
</template>

<script>
import { fetchQuotaList, saveQuota } from "@/api/admin/quota.js";
import { fetchGroupList } from "@/api/admin/group.js";
import addDrawer from "./addDrawer";
import recordDrawer from "./recordDrawer";
export default {
  components: {
    addDrawer,
    recordDrawer
  },
  data() {
    return {
      loading: false,
      keyword: null,
      kpiyear: null,
      tableData: []
    };
  },
  methods: {
    // 新增
    openAddDrawer() {
      let drawer = this.$refs.addDrawer;
      drawer.drawer = true;
    },

    // 打开弹窗
    openDrawer(row) {
      let drawer = this.$refs.recordDrawer;
      drawer.title = `『 ${row.groupname} 』${this.kpiyear}年绩效额度操作记录`;
      drawer.id = row.id;
      drawer.drawer = true;
    },

    // 限制金额输入（整数或两位小数）
    moneyLimit(e, row, prop) {
      this.common.moneyInput(e);
      row[prop] = e.target.value;
    },

    // 编辑 （保存、取消）
    editRow(row, isSave) {
      if (isSave) {
        if (!row.editMonthquota) {
          return false;
        } else if (
          row.monthquota == row.editMonthquota &&
          row.yearquota == row.editYearquota
        ) {
          row.isEdit = false;
        } else {
          let params = [
            {
              id: row.id,
              groupid: row.groupid,
              groupname: row.groupname,
              monthquota: row.editMonthquota.toString().replace(/\.$/, ""),
              yearquota: row.editYearquota
                ? row.editYearquota.toString().replace(/\.$/, "")
                : null
            }
          ];
          this.doSave(params);
        }
      } else {
        row.isEdit = false;
        row.editMonthquota = row.monthquota;
        row.editYearquota = row.yearquota;
      }
    },

    // 保存
    doSave(params) {
      this.loading = true;
      saveQuota(params)
        .then(res => {
          this.loading = false;
          if (res.success) {
            this.$message({
              showClose: true,
              type: "success",
              message: `保存成功！`
            });
            this.getTableData();
          } else {
            this.$message({
              showClose: true,
              type: "error",
              message: `保存失败：${res.data.message}`
            });
          }
        })
        .catch(err => {
          this.loading = false;
          this.$message({
            showClose: true,
            type: "error",
            message: `保存失败：${err}`
          });
        });
    },

    // 获取表格数据
    getTableData() {
      this.loading = true;
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
                yearquota: null,
                editMonthquota: null,
                editYearquota: null,
                isEdit: false
              };
            });
            // 获取已设置额度的考核分组
            fetchQuotaList(param).then(res => {
              this.loading = false;
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
                        i.editMonthquota = j.monthquota;
                        i.editYearquota = j.yearquota;
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
            this.loading = false;
          }
        })
        .catch(err => {
          this.loading = false;
        });
    }
  },
  created() {
    this.kpiyear = this.moment().format("YYYY");
    this.getTableData();
  }
};
</script>

<style lang="scss" scoped>
.base-search-table {
  min-height: 800px;
  padding-bottom: 20px;
}
.el-icon-date {
  color: #606266;
}
</style>
<style lang="scss">
.el-input.is-error .el-input__inner {
  border-color: #f56c6c;
}
.no-border .el-input__inner {
  border: none;
  padding-left: 10px;
}
.no-clear.el-input--suffix .el-input__inner {
  padding-right: 0;
}
</style>