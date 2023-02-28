<template>
  <div>
    <van-nav-bar title="我要报修" left-arrow fixed @click-left="$router.go(-1)" />
    <div style="width:100%;height:46px;"></div>
    <reportForm ref="reportForm" :caller="caller"
          @switchFormState="switchFormState"
      :showIssueGuide="true"></reportForm>
    <div class="savebtns" v-if="showBtns || caller === 'draft'">
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
      <van-button
        class="btn"
        :disabled="loading"
        type="default"
        @click="saveDraft"
        >保存草稿</van-button
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
      showBtns: true,
      caller: 'report',
      loading: false,
    };
  },

  components: { reportForm },

  methods: {
    switchFormState(flag) {
      this.showBtns = flag;
    },
    //把手机存在本地
    setMobile(number) {
      localStorage.setItem("mobile", number);
    },
    //保存
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
                applytype: "2",
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
                  Notify({ type: "success", message: "录入成功！" });
                  this.loading = false;
                  setTimeout(() => {
                    history.go(-1);
                  }, 1500);
                }
              }
            })
            .catch((err) => {
              this.loading = false;
              Notify({ type: "danger", message: "录入失败！" });
            });
        })

        .catch((err) => {});
    },
    //保存草稿
    saveDraft() {
      this.$refs["reportForm"]
        .getFormData()
        .then((formData) => {
          this.loading = true;
          this.util
            .postAjax({
              code: this.global.code,
              url: "/applydraft/save",
              isRep: true,
              data: {
                ...formData,
                applytype: "2",
              },
            })
            .then((res) => {
              if (res.success) {
                this.setMobile(formData.mobile);
                Notify({ type: "success", message: "草稿保存成功！" });
                setTimeout(() => {
                  history.go(-1);
                }, 1500);
              }
            })
            .catch((err) => {
              this.loading = false;
              Notify({ type: "danger", message: "草稿保存失败！" });
            });
        })
        .catch((err) => {});
    },
  },
  created() {
    let id = this.$route.params.id
    if (id !== '0') {
      this.caller = 'draft'
    }
  }
};
</script>
<style lang='scss' scoped>
.savebtns {
  border-top: 1px solid rgba(219, 219, 219, 1);
  padding: 10px;
  background-color: #fff;
  .btn {
    height: 40px;
    border-radius: 5px;
  }
  .btn + .btn {
    margin-left: 10px;
  }
}
</style>
