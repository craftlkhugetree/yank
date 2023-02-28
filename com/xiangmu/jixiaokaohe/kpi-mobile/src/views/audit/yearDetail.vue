<template>
  <div class="confirm">
    <van-nav-bar fixed title="绩效审核" :border="false" left-arrow @click-left="$router.goBack()" />
    <div style="width:100%;height:46px;"></div>
    <div class="title">{{auditDetail.title}}</div>
    <!------------------------ 查看 ------------------------>
    <div class="handle">
      <van-cell title="查看考核材料" is-link @click="goFileList" />
      <van-cell title="查看操作记录" is-link @click="goRecord" />
    </div>
    <!------------------------ 列表 ------------------------>
    <div class="info-list" v-if="list.length > 0">
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
    </div>
    <!------------------------ 操作 ------------------------>
    <div class="footer-handle" v-if="status=='3' && auditType=='3'">
      <van-field v-model="note" placeholder="请输入说明" />
      <div class="btns">
        <van-button round type="warning" @click="doAudit('no')">退回</van-button>
        <van-button round type="info" @click="doAudit('yes')">审核通过</van-button>
      </div>
    </div>
  </div>
</template>

<script>
import { fetchKpiDetail } from "@/api/kpi/confirm";
import { fetchQuotaList } from "@/api/admin/quota";
import { doKpiAudit } from "@/api/kpi/audit";
import ProgressCircle from "@/components/ProgressCircle";
export default {
  components: {
    ProgressCircle
  },
  props: {
    auditType: String   // 3-未审核，4-已审核
  },
  data() {
    return {
      auditDetail: {},
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
    }
  },
  methods: {
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

    // 获取考核组额度
    getGroupQuota() {
      let param = {
        groupid: this.auditDetail.groupid,
        kpiyear: this.auditDetail.yeardate
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
        groupid: this.auditDetail.groupid,
        year: this.auditDetail.yeardate,
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
          }
        })
        .catch(err => {});
    },
    // 初始化
    init() {
      this.getGroupQuota();
      this.getKpiDetail();
    },
    // 通过/不通过
    doAudit(type) {
      this.$toast.loading({
        message: "加载中...",
        forbidClick: true
      });
      let param = {
        kpiid: this.kpiDetail.id,
        note: this.note,
        result: type == "yes" ? "1" : "0",
        type: 5 // type 1发起 2撤回 3提交 4确认 5审核
      };
      doKpiAudit(param)
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
    }
  },
  created() {
    let data = sessionStorage.getItem("auditDetail");
    this.auditDetail = data ? JSON.parse(data) : {};
    this.init();
  }
};
</script>

<style lang="scss" scoped>
.confirm {
  width: 100%;
  height: 100%;
  background: #f6f6f6;
  & > .title {
    font-size: 28px;
    font-weight: 600;
    color: #474d51;
    line-height: 36px;
    padding: 24px 24px 16px;
    background: #ffffff;
    border-bottom: 1px solid #dbdbdb;
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