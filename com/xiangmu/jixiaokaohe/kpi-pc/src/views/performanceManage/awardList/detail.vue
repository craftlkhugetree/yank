<template>
  <div class="base-search-table">
    <div class="search-box clearfix" style="padding: 15px 20px 10px;">
      <i class="el-icon-arrow-left" @click="$router.push('/kpi/award-list')">返回</i>
      <el-divider direction="vertical"></el-divider>
      {{title}}
    </div>
    <!---------------------------- 考核材料 ---------------------------->
    <div class="files">
      <label>考核材料：</label>
      <div
        class="attach"
        v-for="item in attaches"
        :key="item.ID"
        @click="common.downloadFile(item.ID)"
      >
        <img src="@/assets/img/fujian.png" alt />
        <span>{{item.TITLE}}</span>
      </div>
      <div class="attach" v-if="attaches.length==0">无</div>
    </div>
    <!---------------------------- 合计 ---------------------------->
    <div class="total">
      <label v-if="['1','4'].includes(kpitype)">月度考核奖合计：</label>
      <label v-else>年终考核奖合计：</label>
      <span>{{common.moneyFormat(totalFee)}}元</span>
    </div>
    <!---------------------------- 表格 ---------------------------->
    <el-table
      :data="tableData"
      style="width:100%;"
      header-row-class-name="table-header"
      v-loading="tableLoading"
    >
      <el-table-column type="index" label="序号" width="50"></el-table-column>
      <el-table-column prop="username" label="姓名" show-overflow-tooltip>
        <template slot-scope="scope">{{scope.row.username}}（{{scope.row.userid}}）</template>
      </el-table-column>
      <el-table-column
        prop="orgname"
        label="部门"
        show-overflow-tooltip
        :formatter="common.defaultFormat"
      ></el-table-column>
      <el-table-column
        prop="joblvname"
        label="领导岗位级别"
        show-overflow-tooltip
        :formatter="common.defaultFormat"
      ></el-table-column>
      <el-table-column
        prop="rylxm"
        label="人员类型"
        show-overflow-tooltip
        :formatter="common.defaultFormat"
      ></el-table-column>
      <el-table-column
        v-if="['1','4'].includes(kpitype)"
        prop="allowance"
        label="领导岗位津贴(元)"
        :formatter="(row, column, val) => common.moneyFormat(val)"
      ></el-table-column>
      <el-table-column
        v-if="['1','4'].includes(kpitype)"
        prop="outsalary"
        label="外挂工资(元)"
        :formatter="(row, column, val) => common.moneyFormat(val)"
      ></el-table-column>
      <el-table-column
        v-if="['1','4'].includes(kpitype)"
        prop="monthsalary"
        label="月度考核奖（元）"
        show-overflow-tooltip
        :formatter="(row, column, val) => common.moneyFormat(val)"
      ></el-table-column>
      <el-table-column
        v-if="['1','4'].includes(kpitype)"
        prop="othersalary"
        label="其他（元）"
        show-overflow-tooltip
        :formatter="(row, column, val) => common.moneyFormat(val)"
      ></el-table-column>
      <el-table-column
        v-if="['1','4'].includes(kpitype)"
        prop="totalsalary"
        label="月绩效合计（元）"
        :formatter="(row, column, val) => common.moneyFormat(val)"
      ></el-table-column>
      <el-table-column
        v-if="['2','3'].includes(kpitype)"
        prop="yearsalary"
        label="年终考核奖(元)"
        :formatter="(row, column, val) => common.moneyFormat(val)"
      ></el-table-column>
      <el-table-column label="操作" align="center" width="100" v-if="['1','4'].includes(kpitype)">
        <template slot-scope="scope">
          <span @click="openDrawer(scope.row)">历史记录</span>
        </template>
      </el-table-column>
    </el-table>
    <!---------------------------- 历史记录 ---------------------------->
    <history-drawer ref="historyDrawer"></history-drawer>
  </div>
</template>

<script>
import { fetchKpiDetail, fetchFileInfo } from "@/api/kpi/awardList";
import historyDrawer from "../components/historyDrawer";
export default {
  components: {
    historyDrawer
  },
  props: {
    kpiid: String,
    title: String
  },
  data() {
    return {
      loading: false,
      tableLoading: false,
      kpitype: null, // 1-月绩效，2-年绩效，3-特殊发放，4-领导绩效
      attaches: [],
      totalFee: 0,
      tableData: []
    };
  },
  methods: {
    // 打开历史记录弹窗
    openDrawer(row) {
      let historyDrawer = this.$refs.historyDrawer;
      historyDrawer.drawer = true;
      historyDrawer.type = this.kpitype;
      historyDrawer.title = `『 ${row.username} 』绩效历史记录`;
      historyDrawer.userid = row.userid;
      historyDrawer.getTableData();
    },
    // 获取详情
    getDetail() {
      this.tableLoading = true;
      let param = {
        id: this.kpiid
      };
      fetchKpiDetail(param)
        .then(res => {
          this.tableLoading = false;
          let data = res.data || {};
          this.kpitype = data.type;
          // type: 1-月绩效，2-年绩效，3-特殊发放，4-领导绩效
          if (data.type == "1" || data.type == "4") {
            this.totalFee = data.totalmonthfee;
          } else if (data.type == "2") {
            this.totalFee = data.totalfee;
          }
          this.tableData = data.details || [];
          let fileIds = data.attachment.split(",");
          this.getFileList(fileIds);
        })
        .catch(err => {
          this.tableLoading = false;
        });
    },

    // 获取文件列表
    getFileList(ids) {
      // 获取考核文件
      if (ids.length > 0) {
        fetchFileInfo({ IDs: ids }).then(res => {
          if (res.success) {
            let data = res.data || {};
            let arr = [];
            for (let key in data) {
              arr.push(data[key]);
            }
            this.attaches = arr;
          }
        });
      }
    }
  },
  created() {
    this.getDetail();
  }
};
</script>

<style lang="scss" scoped>
.search-box {
  width: 100%;
  border-bottom: 1px solid #d8d8d8;
  font-size: 16px;
  font-weight: 600;
  color: #373b4b;
  line-height: 22px;
  i {
    font-size: 14px;
    font-weight: 400;
    color: #3f86f7;
    cursor: pointer;
    margin-right: 5px;
  }
}

.total {
  margin: 10px 20px 16px;
  span {
    font-size: 14px;
    color: #3f86f7;
    line-height: 22px;
    padding: 1px 4px;
    background: #ebf2fe;
    border-radius: 2px;
    border: 1px solid #85b2fa;
  }
}
.files {
  margin: 26px 20px 10px;
}
.files,
.total {
  label {
    font-size: 14px;
    color: #5f6464;
    line-height: 20px;
  }
}
</style>
