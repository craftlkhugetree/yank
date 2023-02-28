<template>
  <div>
    <van-nav-bar title="维修评价" left-arrow fixed @click-left="$router.go(-1)" />
    <div style="width:100%;height:46px;"></div>
    <div class="rateform">
      <div class="formlabels">
        维修结果
        <span class="right" @click="setResult('0')">
          <img
            src="../../../../static/images/fail2.png"
            v-show="result === '1'"
            width="20px"
            height="20px"
          />
          <transition name="bounce-size" mode="out-in">
            <img
              src="../../../../static/images/fail.png"
              v-show="result === '0'"
              width="20px"
              height="20px"
            />
          </transition>未修复
        </span>
        <span class="right" @click="setResult('1')">
          <img
            src="../../../../static/images/success2.png"
            v-show="result === '0'"
            width="20px"
            height="20px"
          />
          <transition name="bounce-size" mode="out-in">
            <img
              src="../../../../static/images/success.png"
              v-show="result === '1'"
              width="20px"
              height="20px"
            />
          </transition>已完结
        </span>
      </div>
      <div class="formlabels" v-show="result === '1'">
        维修评价
        <span class="right">
          <van-rate @change="changeScore" class="bounce-size" v-model="markscore" :size="17" />
        </span>
      </div>
      <van-field
        type="textarea"
        :rows="3"
        v-model="note"
        class="fieldbottom"
        placeholder="请输入说明，不超过200字"
        :maxlength="200"
        show-word-limit
      />
      <attaches color="#fd7d18" v-show="result === '0'" :attaches="photos"></attaches>
    </div>
    <div class="withdrawbtn">
      <van-button class="btn" @click="rate" :disabled="loading" type="info" icon="checked">提交评价</van-button>
    </div>
  </div>
</template>

<script>
import { Notify } from "vant";
import attaches from "@/components/attaches";
export default {
  data() {
    return {
      markscore: 0,
      result: "1",
      photos: [],
      note: "",
      loading: false
    };
  },

  components: { attaches },

  methods: {
    setResult(result) {
      this.result = result;
    },

    // 改变评分，兼容动效
    changeScore(val) {
      this.markscore = 0;
      setTimeout(() => {
        this.markscore = val;
      },10)
    },

    //用户评价
    rate() {
      if (this.loading) {
        return;
      }
      if (this.markscore == '0') {
        Notify({ type: "danger", message: "请打分！" }); 
        return
      }
      this.loading = true;
      let data = {
        result: this.result,
        note: this.note,
        version : this.$route.params.version,
        applyid: this.$route.params.id
      };
      if (this.result === "0") {
        data.photos = this.photos.join(",");
      } else {
        data.markscore = this.markscore;
      }

      this.util
        .postAjax({
          code: this.global.code,
          url: "/apply/markscore",
          isRep: true,
          data: data
        })
        .then(res => {
          if (res.success) {
            Notify({ type: "success", message: "评价成功！" });
            setTimeout(() => {
              history.go(-1);
            }, 1500);
          } else {
            Notify({ type: "danger", message: "评价失败！" });
            this.loading = false;
          }
        })
        .catch(err => {
          this.loading = false;
          Notify({ type: "danger", message: "评价失败！" });
        });
    }
  }
};
</script>
<style lang='scss' scoped>
.rateform {
  background-color: #fff;
  margin-top: 8px;
  padding: 16px;
  .formlabels {
    font-size: 14px;
    font-weight: 400;
    color: #464032;
    line-height: 21px;
    margin-bottom: 18px;
  }
  & /deep/ .uploadimgs {
    margin-left: 0;
  }
}
.right {
  float: right;
  margin-left: 40px;
  img {
    float: left;
    margin-right: 4px;
    margin-top: 2px;
  }
}
.withdrawbtn {
  width: 100%;
  padding-top: 20px;
  padding-bottom: 20px;
  text-align: center;
  background-color: rgba(246, 246, 246, 1);
  & .btn {
    width: 90%;
  }
}
.fieldbottom.van-cell {
  padding-left: 0;
  padding-right: 0;
  background-color: rgba(243, 243, 243, 1);
  border-radius: 3px;
  & /deep/ .van-cell__value {
    padding-left: 15px;
    padding-right: 15px;
  }
}
</style>