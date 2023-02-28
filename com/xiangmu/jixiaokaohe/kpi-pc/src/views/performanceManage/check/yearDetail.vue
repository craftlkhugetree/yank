<template>
  <!---------------------------- 头信息 ---------------------------->
  <div class="base-tab" ref="baseTab" v-loading="loading">
    <div class="base-search-table">
      <div class="header-box">
        <span class="back" @click="$router.go(-1)">
          <i class="el-icon-arrow-left"></i>返回
        </span>
        <el-divider direction="vertical"></el-divider>
        <h3 v-if="kpiData">『 {{kpiData.groupname}} 』{{kpiData.yeardate}}年终绩效清单审核</h3>
        <span>
          <el-tag class="blue-tag" v-show="events&& events.type=='5'&&events.result=='1'">审核通过</el-tag>
          <span v-show="events&& events.type=='5'&&events.result=='0'">
            <el-tag class="orange-tag">审核不通过</el-tag>
          </span>
          <span class="tips">{{events &&events.note}}</span>
        </span>
      </div>
      <div class="search-box clearfix">
        <div class="search-box-left">
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
          <p>
            <label>
              年终考核奖合计：
              <el-tag class="blue-tag">{{alltotal}}元</el-tag>
            </label>
          </p>
        </div>
        <!---------------------------- 数据展示 ---------------------------->
        <div class="search-box-right">
          <div>
            <div style="margin-bottom: 10px;">
              <label>{{kpiData&&kpiData.yeardate}}年终考核奖合计：</label>
              <span>{{yearquota}}元</span>
            </div>
            <div>
              <label>
                <i class="blue-square"></i>已用：
              </label>
              <span class="mg-r20">{{quota.used}}元</span>
              <label>
                <i class="gray-square"></i>剩余：
              </label>
              <span class="mg-r10">{{quota.last}}元</span>
            </div>
          </div>
          <progress-circle :percent="percent"></progress-circle>
        </div>
      </div>
      <!---------------------------- 表格 ---------------------------->
      <el-table
        :data="tableData"
        style="width:100%;margin-bottom: 80px;"
        header-row-class-name="table-header"
        v-loading="tableLoading"
      >
        <el-table-column type="index" label="序号" width="80"></el-table-column>
        <el-table-column prop="username" label="姓名" show-overflow-tooltip>
          <template slot-scope="scope">{{scope.row.username}}（{{scope.row.userid}}）</template>
        </el-table-column>
        <el-table-column prop="orgname" label="部门" show-overflow-tooltip></el-table-column>
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
        <el-table-column prop="yearsalary" label="年终考核奖(元)"></el-table-column>
      </el-table>
    </div>
    <div style="height:100px"></div>
    <div class="btn-footer" v-show="isCheck=='1'">
      <el-input v-model="explain" class="explain-input" style="width:300px" placeholder="请输入说明"></el-input>
      <el-button size="small" type="warning" @click="doCheck('0')">退回</el-button>
      <el-divider direction="vertical"></el-divider>
      <el-button size="small" type="primary" @click="doCheck('1')">审核通过</el-button>
    </div>
    <!---------------------------- 历史记录 ---------------------------->
    <history-drawer ref="historyDrawer"></history-drawer>
  </div>
</template>
<script>
import ProgressCircle from "@/components/ProgressCircle";
import historyDrawer from "../components/historyDrawer";
import { findKpiById, reviewKpi } from "@/api/kpi/manage";
import { fetchFileInfo } from "@/api/kpi/awardList";
import { fetchQuotaList } from "@/api/admin/quota";
export default {
  props: {
    kpiId: String,
    isCheck: String,
    activeTab: String
  },
  components: {
    ProgressCircle,
    historyDrawer
  },
  data() {
    return {
      loading: false,
      explain: "",
      kpiData: null,
      attaches: [],
      yearquota: "",
      quota: {
        used: "",
        last: ""
      },
      tableLoading: false,
      tableData: [],
      events: null,
      percent: 0,
      availableFund: null
    };
  },
  computed: {
    userInfo() {
      return this.$store.state.userInfo;
    },

    alltotal() {
      let sum = 0,
        grant = 0;
      this.tableData.forEach(row => {
        sum = this.common.add(sum, row.yearsalary, 2);
        //已发放的=已用的
        if (this.kpiData.status >= "2") {
          grant = this.common.add(grant, row.yearsalary, 2);
        }
      });
      this.quota.used = grant;
      this.quota.last = this.common.subtract(this.yearquota, grant, 2);
      if (this.yearquota > 0 && this.quota.last > 0) {
        let data = (this.quota.last / this.yearquota) * 100;
        this.percent = parseFloat(data.toFixed(1));
      } else {
        this.percent = 0;
      }
      return sum;
    }
  },
  created() {},
  mounted() {
    this.getDetailData();
  },
  methods: {
    // 根据id查询数据
    getDetailData() {
      let param = {
        id: this.kpiId
      };
      this.tableLoading = true;
      findKpiById(param).then(res => {
        if (res.success) {
          this.tableLoading = false;
          let kpiItmes = res.data;
          this.kpiData = kpiItmes;
          this.getQuota(kpiItmes);
          this.tableData = kpiItmes.details || [];
          if (this.activeTab == "4") {
            //已审核的，type为5的最新一条事件值
            let eventArr = res.data.events.filter(item => item.type == "5");
            let event = eventArr.pop();
            this.events = event;
          }
          let fileIds = kpiItmes.attachment.split(",");
          this.getFileList(fileIds);
        }
      });
    },

    // 获取文件列表
    getFileList(ids) {
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
    },
    //组下的额度
    getQuota(kpiItmes) {
      let param = {
        groupid: kpiItmes.groupid,
        kpiyear: kpiItmes.yeardate
      };
      fetchQuotaList(param)
        .then(res => {
          if (res.success) {
            let quota = res.data[0];
            this.yearquota = quota.yearquota;
          }
        })
        .catch(err => {
          this.loading = false;
        });
    },

    // 打开历史记录弹窗
    openDrawer(row) {
      let historyDrawer = this.$refs.historyDrawer;
      historyDrawer.drawer = true;
      historyDrawer.title = `『 ${row.username}（${row.userid}）』绩效历史记录`;
      historyDrawer.userid = row.userid;
      historyDrawer.getTableData();
    },
    //审核通过 不通过
    doCheck(flag) {
      let { id } = this.kpiData;
      let param = {
        kpiid: id,
        note: this.explain,
        result: flag,
        type: 5
      };
      reviewKpi(param).then(res => {
        if (res.success) {
          this.$message({
            showClose: true,
            message: "审核完成！",
            type: "success"
          });
          this.$router.go(-1);
        } else {
          this.$message({
            showClose: true,
            message: "审核失败！",
            type: "error"
          });
        }
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.base-tab {
  // height: 100%;
  position: relative;
  min-height: 950px;
  margin-bottom: 100px;
}

.search-box {
  border-bottom: 1px solid rgba(0, 0, 0, 0.06);
  .search-box-left {
    float: left;
    line-height: 40px;
  }
  label {
    color: #5f6464;
  }
}
.search-box-right {
  & > div {
    display: inline-block;
  }
}
.header-box {
  padding: 20px;
  border-bottom: 1px solid #d8d8d8;
  .back {
    color: #3f86f7;
    cursor: pointer;
  }
  h3 {
    display: inline-block;
  }
  .el-tag {
    margin-left: 10px;
  }
  .tips {
    color: #999999;
    font-size: 13px;
    display: inline-block;
    margin-left: 10px;
  }
}
</style>
