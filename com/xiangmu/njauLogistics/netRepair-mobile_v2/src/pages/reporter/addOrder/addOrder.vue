<template>
  <div>
    <van-nav-bar
      title="报修录单"
      left-arrow
      fixed
      @click-left="$router.go(-1)"
    />
    <div style="width: 100%; height: 46px"></div>
    <reportForm ref="reportForm" :showIssueGuide="false"></reportForm>
    <div class="savebtns">
      <van-button
        class="btn"
        :disabled="loading"
        type="info"
        @click="save(false)"
        >提交报修</van-button
      >
      <!-- <van-button
        class="btn"
        :disabled="loading"
        plain
        type="info"
        @click="save(true)"
        >提交并录入下一条</van-button
      > -->
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
    setArea(name) {
      localStorage.setItem("area", name);
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
                this.setArea(formData.areaname);
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
    width: 90%;
    height: 40px;
    border-radius: 5px;
  }
  .btn + .btn {
    margin-left: 12px;
  }
}
</style>
