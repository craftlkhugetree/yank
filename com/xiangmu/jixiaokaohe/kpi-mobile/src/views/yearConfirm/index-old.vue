<template>
  <div class="confirm">
    <van-nav-bar fixed :border="false" left-arrow @click-left="$router.goBack()">
      <template #title>
        <div class="nav-bar-title">
          <img src="@/assets/img/arrow-left.png" alt @click="changeYear('prev')" />
          <span>{{year}}</span>
          <img src="@/assets/img/arrow-right.png" alt @click="changeYear('next')" />
        </div>
      </template>
    </van-nav-bar>
    <div style="width:100%;height:46px;"></div>
    <!----------------------------- tab页 ----------------------------->
    <el-tabs v-model="activeTab" @tab-click="handleClick" class="more-tabs">
      <el-tab-pane v-for="tab in groupList" :key="tab.id" :name="tab.id" :label="tab.name">
        <!------------------------ 查看 ------------------------>
        <div class="handle">
          <van-cell title="查看考核材料" is-link @click="goFileList" />
          <van-cell title="查看操作记录" is-link @click="goRecord" />
        </div>
        <!------------------------ 列表 ------------------------>
        <div class="info-list">
          <div class="total-fee">
            <div>
              <label>可用额度：</label>
              <span>{{common.moneyFormat(lastfee,true)}}元</span>
            </div>
            <div>
              <label>年终考核奖合计：</label>
              <span>{{common.moneyFormat(kpiDetail.totalfee,true)}}元</span>
            </div>
          </div>
          <div
            class="info-box"
            v-for="(item,index) in list"
            :key="item.id"
            :class="`animation-${index + 1}`"
          >
            <div class="title">
              {{item.username}}
              <span>{{item.tagname}}</span>
              <span class="total-tag">{{common.moneyFormat(item.yearsalary)}}元</span>
            </div>
          </div>
          <div v-if="list.length == 0" class="nodata">暂无数据</div>
        </div>
        <!------------------------ 操作 ------------------------>
        <div class="footer-handle" v-if="showFooter">
          <van-field v-model="note" placeholder="请输入说明" />
          <div class="btns">
            <van-button round type="warning" @click="doConfirm('no')">不通过</van-button>
            <van-button round type="info" @click="doConfirm('yes')">通过</van-button>
          </div>
        </div>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import {
  fetchMyWorkGroups,
  fetchKpiDetail,
  doKpiConfirm
} from "@/api/kpi/confirm";
import { fetchQuotaList } from "@/api/admin/quota";
import ProgressCircle from "@/components/ProgressCircle";
export default {
  components: {
    ProgressCircle
  },
  data() {
    return {
      year: null,
      activeTab: null,
      groupList: [],
      yearQuota: null,
      list: [],
      kpiDetail: {},
      note: null
    };
  },
  computed: {
    // 可用额度
    lastfee() {
      let yearQuota = this.yearQuota || 0;
      // if (this.kpiDetail.grantstatus == "3") {
        let totalfee = this.kpiDetail.totalfee || 0;
        let data = this.common.subtract(yearQuota, totalfee);
        return data;
      // } else {
      //   return yearQuota;
      // }
    },
    // 绩效状态：1-草稿，2-已提交，3-已确认，4-已审核
    status() {
      return this.kpiDetail.status;
    },
    // 是否展示底部操作：绩效状态是已提交，并且当前用户不在已确认的人员中
    showFooter() {
      let curUser = this.$store.state.userInfo.ID;
      return this.status == "2" && !this.kpiDetail.confirmids.includes(curUser);
    }
  },
  methods: {
    // 改变年份
    changeYear(type) {
      let date = this.moment(this.year, "YYYY年");
      date = type == "next" ? date.add(1, "years") : date.subtract(1, "years");
      this.year = date.format("YYYY年");
      this.getGroupQuota();
      this.getKpiDetail();
    },

    // 文件列表页面
    goFileList() {
      let fileIds = this.kpiDetail.attachment;
      sessionStorage.setItem("fileIds", fileIds);
      this.$router.push("/file-list");
    },

    // 操作记录
    goRecord() {
      let events = this.kpiDetail.events;
      sessionStorage.setItem("events", JSON.stringify(events));
      this.$router.push("/record");
    },

    // 获取当前用户负责的考核组
    getGroupList() {
      fetchMyWorkGroups().then(res => {
        if (res.success) {
          this.groupList = res.data || [];
          this.initParam();
          this.getGroupQuota();
          this.getKpiDetail();
        }
      });
    },
    // 获取考核组额度
    getGroupQuota() {
      let param = {
        groupid: this.activeTab,
        kpiyear: this.moment(this.year, "YYYY年").format("YYYY")
      };
      fetchQuotaList(param).then(res => {
        if (res.success) {
          let data = res.data[0] || {};
          this.yearQuota = data.yearquota;
        }
      });
    },
    // 获取绩效详情
    getKpiDetail() {
      let param = {
        type: "2",
        groupid: this.activeTab,
        year: this.moment(this.year, "YYYY年").format("YYYY"),
        month: null
      };
      fetchKpiDetail(param)
        .then(res => {
          if (res.success) {
            let data = res.data || {};
            this.kpiDetail = data;
            this.list = data.details || [];
            this.list.forEach(i => {
              i.tagname = i.joblvname ? `${i.joblvname}/${i.rylxm}` : i.rylxm;
            });
            // 记录查询参数
            let params = {
              groupid: this.activeTab,
              year: this.year
            };
            sessionStorage.setItem("yearConfirmParams", JSON.stringify(params));
          }
        })
        .catch(err => {});
    },
    // 切换tab页
    handleClick(tab) {
      this.getGroupQuota();
      this.getKpiDetail();
    },
    // 通过/不通过
    doConfirm(type) {
      this.$toast.loading({
        message: "加载中...",
        forbidClick: true
      });
      let param = {
        kpiid: this.kpiDetail.id,
        note: this.note,
        result: type == "yes" ? "1" : "0",
        type: 4 // type 1发起 2撤回 3提交 4确认 5审核
      };
      doKpiConfirm(param)
        .then(res => {
          this.$toast.clear();
          if (res.success) {
            this.$toast.success("操作成功");
            this.getKpiDetail();
          } else {
            this.$toast.fail("操作失败：" + res.data.message);
          }
        })
        .catch(err => {
          this.$toast.clear();
          this.$toast.fail("操作失败：" + err);
        });
    },
    initParam() {
      let data = sessionStorage.getItem("yearConfirmParams");
      let params = data ? JSON.parse(data) : {};
      this.year = params.year || this.moment().format("YYYY年");
      let index = this.groupList.findIndex(i => i.id === params.groupid);
      if (index < 0) {
        this.activeTab = this.groupList[0].id;
      } else {
        this.activeTab = params.groupid;
      }
    }
  },
  created() {
    this.getGroupList();
  }
};
</script>

<style lang="scss" scoped>
.confirm {
  width: 100%;
  height: 100%;
  background: #f6f6f6;
  .nav-bar-title {
    img {
      width: 22px;
      height: 22px;
      cursor: pointer;
    }
    span {
      font-size: 32px;
      font-weight: 400;
      color: #000000;
      line-height: 45px;
      background: #f6f6f6;
      border-radius: 26px;
      padding: 3px 24px;
      margin: 0 15px;
    }
  }
  .handle {
    margin: 24px 0;
    .van-cell {
      color: #474d51;
      font-size: 12px;
    }
    .van-icon-arrow {
      font-size: 8px;
    }
  }
  .info-list {
    margin: 24px;
    padding-bottom: 200px;
    .total-fee {
      margin: 24px 0;
      line-height: 36px;
      div {
        display: inline-block;
        width: 50%;
      }
      label {
        font-size: 24px;
        color: #5f6464;
      }
      span {
        font-size: 24px;
        font-weight: 600;
        color: #3f86f7;
      }
    }
    .info-box {
      position: relative;
      width: 100%;
      margin: 24px 0;
      background: #ffffff;
      box-shadow: 0px 5px 20px 0px #e6e6e6;
      border-radius: 10px;
      .title {
        padding: 24px;
        font-size: 32px;
        font-weight: 600;
        color: #474d51;
        line-height: 38px;
        border-bottom: 1px solid #dbdbdb;
        span {
          font-size: 24px;
          font-weight: 400;
          color: #7d7d80;
          margin-left: 24px;
        }
        .total-tag {
          font-size: 28px;
          font-weight: 600;
          color: #3f86f7;
          float: right;
        }
      }
      .info {
        display: inline-block;
        width: 25%;
        padding: 24px 0;
        text-align: center;
        label {
          display: block;
          font-size: 24px;
          color: #7d7d80;
          line-height: 36px;
          margin-bottom: 24px;
        }
        span {
          font-size: 24px;
          color: #474d51;
          line-height: 36px;
        }
      }
    }
  }
  .footer-handle {
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
    background: #ffffff;
    .van-cell {
      line-height: 18px;
      font-size: 12px;
    }
    .btns {
      text-align: center;
      padding: 24px;
      .van-button {
        font-size: 15px;
        color: #ffffff;
        line-height: 18px;
        height: 36px;
        width: 48%;
        &:not(:last-child) {
          margin-right: 2%;
        }
      }
      .van-button--warning {
        background-color: #ff9f0a;
        border-color: #ff9f0a;
      }
      .van-button--info {
        background-color: #3a78fc;
        border-color: #3a78fc;
      }
    }
  }
}
</style>