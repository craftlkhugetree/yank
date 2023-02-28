<template>
  <div>
    <van-nav-bar title="我要续报" left-arrow fixed @click-left="$router.go(-1)" />
    <div style="width:100%;height:46px;"></div>
    <orderInfo class="orderInfo" v-if="info.createtime" :info="info" :showApplyer="false"></orderInfo>
    <!---------------------- 表单 ---------------------->
    <van-form class="reportform" ref="reportform" :colon="true" :show-error-message="false">
      <van-field
        v-model="reportForm.note"
        label="续报说明"
        :required="true"
        :rules="[{ required: true, message: '请输入续报说明' }]"
      />
      <van-field
        v-model="reportForm.note"
        :rows="1"
        autosize
        type="textarea"
        placeholder="请输入续报说明"
        :maxlength="200"
        class="fieldbottom"
        :rules="[{ required: true, message: '请输入续报说明' }]"
      />
      <upload :attaches="photos"></upload>
      <p class="tips" v-if="photos.length==0 && isChecked">请上传图片</p>
      <van-button class="btn" :disabled="loading" type="info" @click="save">提交报修</van-button>
    </van-form>
  </div>
</template>

<script>
import { Notify } from "vant";
import { setListInfo } from "@/assets/js/global";
import orderInfo from "@/components/orderInfo.vue";
import upload from "@/components/attaches";
export default {
  components: {
    orderInfo,
    upload
  },
  props: {
    id: String
  },
  data() {
    return {
      info: {},
      reportForm: {
        note: null
      },
      photos: [],
      isChecked: false,
      loading: false
    };
  },
  methods: {
    getOrderInfo() {
      this.util
        .postAjax({
          code: this.global.code,
          url: "/apply/findById",
          data: {
            id: this.id
          }
        })
        .then(res => {
          if (res.success) {
            this.info = setListInfo(res.data);
          }
        });
    },
    // 提交报修
    save() {
      this.isChecked = true;
      this.$refs["reportform"]
        .validate()
        .then(flag => {
          if (!flag) {
            if (this.photos.length == 0) {
              return;
            }
            this.loading = true;
            this.util
              .postAjax({
                code: this.global.code,
                url: "/applycontinue/save",
                isRep: true,
                data: {
                  applyid: this.id,
                  note: this.reportForm.note,
                  photos: this.photos.join(",")
                }
              })
              .then(res => {
                if (res.success) {
                  Notify({ type: "success", message: "提交成功！" });
                  this.$router.go(-1);
                } else {
                  Notify({ type: "danger", message: "提交失败！" });
                }
              })
              .catch(err => {
                Notify({ type: "danger", message: "提交失败！" });
              });
          }
        })
        .catch(err => {
          console.log(err);
        });
    }
  },
  created() {
    this.getOrderInfo();
  }
};
</script>
<style lang='scss' scoped>
.orderInfo {
  margin-top: 6px;
}

.fieldbottom {
  padding: 0;
  margin: 0 16px;
  border-bottom: 1px solid rgba(219, 219, 219, 1);
  width: 90%;
}
.van-cell::after {
  border-bottom: 1px solid #fff;
}
.van-cell {
  & /deep/ .van-cell__title + .van-cell__value.van-field__value {
    display: none;
  }
}
.van-form {
  padding: 0 8px 30px;
  background: #fff;
}
.btn {
  height: 40px;
  border-radius: 5px;
  margin: 20px 15px;
}
.tips {
  color: #ee0a24;
  font-size: 14px;
  padding-left: 15px;
  padding-top: 5px;
}
</style>