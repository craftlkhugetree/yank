<template>
  <div>
    <van-nav-bar title="维修完工" left-arrow fixed @click-left="$router.go(-1)" />
    <div style="width:100%;height:46px;"></div>
    <van-form class="repairform" ref="repairForm" :colon="true" :show-error-message="false">
      <van-field
        v-model="photosid"
        label="上传图片"
        :rules="[{ required: true, message: '请填写' }]"
        :required="true"
      />
      <upload :attaches="photos"></upload>
      <van-field v-model="repairnote" label="详细描述" />
      <van-field
        type="textarea"
        :rows="3"
        v-model="repairnote"
        class="fieldbottom"
        placeholder="请输入说明，不超过200字"
        :maxlength="200"
      />
    </van-form>
    <div class="withdrawbtn">
      <van-button
        class="btn"
        @click="complete"
        :disabled="loading"
        type="info"
        icon="checked"
        >提交</van-button
      >
    </div>
    <orderInfo :info="info" v-if="info.createtime" />
    <div class="disinfo">
      <h2 class="distitle">
        派单信息
        <span class="orderstate">
          <i class="iconfont iconshijianzhongbiao2"></i>维修时间 ：{{
            util.formatTime(disInfo.starttime, "YYYY-MM-DD")
          }}
        </span>
      </h2>
      <p class="sendnote">
        {{ disInfo.sendnote }}
      </p>
      <p class="sendnote">
        派单人：{{ disInfo.repairleadername }}
        <span class="distime">
          派单时间：{{ util.formatTime(disInfo.createtime, "YYYY-MM-DD") }}
        </span>
      </p>
    </div>
  </div>
</template>

<script>
import { Notify } from "vant";
import upload from "@/components/attaches";
import orderInfo from "@/components/orderInfo";
import { setListInfo } from "@/assets/js/global";
export default {
  data() {
    return {
      info: {},
      disInfo: {},
      repairnote: "",
      photos: [],
      photosid: "",
      loading: false,
    };
  },
  watch: {
    photos(val) {
      this.photosid = val.join(",");
    },
  },
  components: { orderInfo, upload },

  methods: {
    //维修结束
    complete() {
      if (this.loading) return;
      this.$refs["repairForm"].validate().then((res) => {
        this.loading = true;
        this.util
          .postAjax({
            code: this.global.code,
            url: "/repair/complete",
            isRep: true,
            data: {
              id: this.$route.params.id,
              photos: this.photosid,
              repairnote: this.repairnote,
            },
          })
          .then((res) => {
            if (res.success) {
              Notify({ type: "success", message: "办理成功！" });
              setTimeout(() => {
                history.go(-1);
              }, 1500);
            } else {
              Notify({ type: "danger", message: "办理失败！" });
              this.loading = false;
            }
          })
          .catch((err) => {
            this.loading = false;
            Notify({ type: "danger", message: "办理失败！" });
          });
      });
    },
    //获取单子信息
    getOrderInfo() {
      this.util
        .postAjax({
          code: this.global.code,
          url: "/repair/findById",
          data: {
            id: this.$route.params.id,
          },
        })
        .then((res) => {
          if (res.success) {
            for (let i in res.data.relationApplys) {
              if (res.data.title === res.data.relationApplys[i].title) {
                this.info = setListInfo(res.data.relationApplys[i]);
                break;
              }
            }
            this.disInfo = res.data;
          }
        });
    },
  },
  created() {
    this.getOrderInfo();
  },
};
</script>
<style lang='scss' scoped>
.disinfo {
  padding: 16px;
  background-color: #fff;
  margin-top: 1px;
  .distitle {
    font-size: 16px;
    font-weight: 400;
    color: #333333;
    line-height: 24px;
  }
  .orderstate {
    font-size: 12px;
    font-weight: 400;
    color: #fd7d18;
    padding: 0 8px;
    height: 26px;
    line-height: 26px;
    background-color: rgba(253, 125, 24, 0.1);
    float: right;
    border-radius: 3px;
  }
  .sendnote {
    margin-top: 12px;
    font-size: 14px;
    font-weight: 400;
    color: #93928e;
    line-height: 21px;
    .distime {
      float: right;
    }
  }
}
.repairform {
  margin-top: 6px;
  background-color: #fff;
  padding-bottom: 20px;
  & /deep/ .van-cell__title + .van-cell__value.van-field__value {
    display: none;
  }
  & /deep/ .uploadimgs {
    margin-top: 10px !important;
  }
  & .fieldbottom {
    padding: 0;
    margin: 0 16px;
    border-bottom: 1px solid rgba(219, 219, 219, 1);
    width: 90%;
  }
}
.withdrawbtn {
  width: 100%;
  padding-top: 20px;
  padding-bottom: 20px;
  text-align: center;
  background-color: rgba(246, 246, 246, 1);
  & .btn {
    width: 85%;
  }
}
</style>