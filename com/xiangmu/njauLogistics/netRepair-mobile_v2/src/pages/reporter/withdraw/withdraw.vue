<template>
  <div class="page">
    <van-nav-bar title="维修撤回" left-arrow fixed @click-left="$router.go(-1)" />
    <div style="width:100%;height:46px;"></div>
    <van-form ref="withdrawForm" class="withdrawform" :show-error-message="false">
      <van-field
        v-model="note"
        label="撤回说明："
        :rules="[{ required: true, message: '请填写用户' }]"
        :required="true"
      />
      <van-field
        type="textarea"
        :rows="3"
        v-model="note"
        class="fieldbottom"
        placeholder="请输入说明，不超过200字"
        :maxlength="200"
        :rules="[{ required: true, message: '请填写' }]"
      />
    </van-form>
    <div class="quicks">
      <quickReplies type="2" @userReply="getnote"></quickReplies>
    </div>
    <div class="withdrawbtn">
      <van-button
        class="btn"
        :disabled="loading"
        type="info"
        icon="checked"
        @click="withdrawOrder"
        >提交</van-button
      >
    </div>
  </div>
</template>

<script>
import { Notify } from "vant";
import quickReplies from "@/components/quickReplies";
export default {
  data() {
    return {
      loading: false,
      note: "",
      applyid: "",
    };
  },

  components: { quickReplies },

  methods: {
    getnote(note) {
      this.note = note;
    },
    withdrawOrder() {
      if (this.loading) {
        return;
      }

      this.$refs["withdrawForm"].validate().then((res) => {
        this.loading = true;
        this.util
          .postAjax({
            code: this.global.code,
            url: "/apply/withdraw",
            isRep: true,
            data: {
              applyid: this.applyid,
              note: this.note,
            },
          })
          .then((res) => {
            if (res.success) {
              Notify({ type: "success", message: "撤回成功！" });
              setTimeout(() => {
                this.$router.push("/reportedOrderList");
              }, 1500);
            } else {
              Notify({ type: "danger", message: "撤回失败！" });
              this.loading = false;
            }
          })
          .catch((err) => {
            this.loading = false;
            Notify({ type: "danger", message: "撤回失败！" });
          });
      });
    },
  },
  created() {
    this.applyid = this.$route.params.id;
  },
};
</script>
<style lang='scss' scoped>
.page {
  background-color: #fff;
  padding-bottom: 12px;
}
.withdrawform {
  margin-top: 8px;

  & /deep/ .van-cell__title + .van-cell__value.van-field__value {
    display: none;
  }
}
.fieldbottom {
  padding: 0;
  margin: 0 16px;
  border-bottom: 1px solid rgba(219, 219, 219, 1);
  width: 90%;
}
.quicks {
  padding: 0 12px;
}
.withdrawbtn {
  width: 100%;
  margin-top: 28px;
  text-align: center;
  & .btn {
    width: 90%;
  }
}
</style>