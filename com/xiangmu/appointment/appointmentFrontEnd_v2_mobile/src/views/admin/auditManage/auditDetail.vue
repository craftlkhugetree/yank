<template>
  <div class="main">
    <van-nav-bar title="查看详细" fixed :border="false" left-arrow @click-left="$router.go(-1)">
      <template #right>
        <van-icon name="search" size="18" @click="toSearch" />
      </template>
    </van-nav-bar>
    <detail ref="detail" :id="id">
      <!--------------------------- 审核意见 --------------------------->
      <div class="apply-form" v-if="activeTab=='1'">
        <div class="item">
          <h3 class="title">审核意见</h3>
          <div class="process-content">
            <van-field v-model="note" rows="1" autosize type="textarea" placeholder="请输入审核意见" />
          </div>
        </div>
      </div>
    </detail>
    <!--------------------------- 审核按钮 --------------------------->
    <div class="footer-btn" v-if="activeTab=='1'">
      <el-button type="info" plain @click="doAudit('0')">不通过</el-button>
      <el-button type="primary" @click="doAudit('1')">通过</el-button>
    </div>
    <!------------------------------ 确认审核 ------------------------------>
    <van-dialog v-model="showDialog" :title="title" width="280" :show-confirm-button="false">
      <el-button type="primary" @click="doConfirm" style="margin-top:24px;">确认审核</el-button>
      <span @click="showDialog=false;">暂时不用</span>
    </van-dialog>
  </div>
</template>

<script>
import { doApprove } from "@/api/admin/approve";
import detail from "../detail";
export default {
  components: {
    detail
  },
  props: {
    id: String,
    activeTab: String
  },
  data() {
    return {
      note: "",
      showDialog: false,
      result: ""
    };
  },
  computed: {
    title() {
      return this.result == "1" ? "确认审核通过" : "确认审核不通过";
    }
  },
  methods: {
    // 查询页面
    toSearch() {
      this.$router.push(`/audit-manage/search/${this.activeTab}`);
    },

    // 审核
    doAudit(result) {
      this.result = result;
      this.showDialog = true;
    },

    // 确认审核
    doConfirm() {
      this.$toast.loading({
        message: "加载中...",
        forbidClick: true
      });
      let data = {
        applyid: this.id,
        note: this.note,
        result: this.result
      };
      doApprove(data)
        .then(res => {
          this.$toast.clear();
          if (res.success) {
            this.$toast.success("审核成功！");
            this.showDialog = false;
            this.$router.go(-1);
          } else {
            this.$toast.fail("审核失败：" + res.data.message);
          }
        })
        .catch(err => {
          this.$toast.clear();
          this.$toast.fail("审核失败：" + err);
        });
    }
  }
};
</script>

<style lang="scss" scoped>
.main {
  height: 100%;
  background: #f6f6f6;
}
.van-field {
  border-bottom: 1px solid #dbdbdb;
  margin-bottom: 20px;
}

.footer-btn {
  width: 100%;
  height: 120px;
  line-height: 120px;
  position: fixed;
  bottom: 0;
  padding: 0 48px;
  background: #ffffff;
  box-shadow: 0px -2px 4px 0px rgba(0, 0, 0, 0.05);
  .el-button {
    width: calc(50% - 22px);
    height: 70px;
    border-radius: 35px;
    font-size: 30px;
    &:first-child {
      margin-right: 22px;
    }
  }
  .el-button--primary {
    background: #3f86f7;
    border-color: #3f86f7;
  }
  .el-button--info {
    background: #ffffff;
    border-color: #d6d6d6;
    color: #686868;
  }
}

.van-dialog {
  p {
    text-align: center;
    margin: 16px 0 40px;
    font-size: 14px;
    color: #5f6464;
    line-height: 42px;
  }
  .el-button {
    display: block;
    width: 180px;
    height: 36px;
    margin: 0 auto 14px;
    border-radius: 20px;
    font-size: 15px;
    background: #3f86f7;
    border-color: #3f86f7;
  }
  span {
    display: block;
    text-align: center;
    margin: 0 auto 32px;
    font-size: 14px;
    color: #999999;
    line-height: 20px;
    cursor: pointer;
  }
}
</style>