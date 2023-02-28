<template>
  <div>
    <van-nav-bar
      title="报修录单"
      left-arrow
      fixed
      @click-left="$router.go(-1)"
    />
    <div style="width: 100%; height: 46px"></div>
    <reportForm ref="reportForm" caller="record"></reportForm>
    <div class="ask" style="bottom: 100px">
      <a @click="$router.push('/createdOrderList')">
        <img src="../../../../static/images/gnsy.png" alt />
        <span>录单记录</span>
      </a>
    </div>
    <div class="savebtns">
      <van-button
        class="btn"
        :disabled="loading"
        type="info"
        @click="save(false)"
        >提交报修</van-button
      >
      <van-button
        class="btn"
        :disabled="loading"
        plain
        type="info"
        @click="save(true)"
        >提交并录入下一条</van-button
      >
    </div>
  </div>
</template>

<script>
import { Notify } from "vant";
import reportForm from "@/components/reportForm.vue";
export default {
  data() {
    return {
      loading: false,
    };
  },

  components: { reportForm },

  methods: {
    setMobile(number) {
      localStorage.setItem("mobile", number);
    },
    save(next) {
      this.$refs["reportForm"]
        .getFormData()
        .then((formData) => {
          this.loading = true;
          this.util
            .postAjax({
              code: this.global.code,
              url: "/apply/save",
              isRep: true,
              data: {
                ...formData,
                applytype: "1",
              },
            })
            .then((res) => {
              if (res.success) {
                this.setMobile(formData.mobile);
                Notify({ type: "success", message: "录入成功！" });
                if (next) {
                  this.$refs["reportForm"].setNext();
                  this.loading = false;
                } else {
                  Notify({ type: "success", message: "关闭页面" });
                  this.loading = false;
                  setTimeout(() => {
                    history.go(-1);
                  }, 1500);
                }
              }
            })
            .catch((err) => {
              console.log(err);
              this.loading = false;
              Notify({ type: "danger", message: "录入失败！" });
            });
        })

        .catch((err) => {});
    },
  },
};
</script>
<style lang='scss' scoped>
.savebtns {
  border-top: 1px solid rgba(219, 219, 219, 1);
  padding: 12px;
  background-color: #fff;
  .btn {
    width: 46%;
    height: 40px;
    border-radius: 5px;
  }
  .btn + .btn {
    margin-left: 12px;
  }
}
.ask {
  position: fixed;
  right: 20px;
  width: 100px;
  height: 36px;
  background: #ffffff;
  box-shadow: 0px 4px 6px 0px rgba(0, 0, 0, 0.12);
  border-radius: 18px;
  text-align: center;
  padding-top: 4px;
  img {
    width: 32px;
    height: 32px;
    vertical-align: middle;
  }
  span {
    color: #2a2e2e;
  }
}
</style>
