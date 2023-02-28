<template>
  <div>
    <van-nav-bar title="转移" left-arrow @click-left="goback" />
    <van-form @submit="onSubmit" :show-error-message="false">
      <van-field
        readonly
        clickable
        class="depts"
        name="handledeptid"
        label="转移部门:"
        :value="moveForm.handledeptname"
        placeholder="请选择"
        @click="showPicker = true"
        :rules="[{ required: true, message: '请选择' }]"
      />
      <van-popup v-model="showPicker" position="bottom">
        <van-picker
          :columns="$store.state.departments.filter(i => i.ISLOCK=='0')"
          @cancel="showPicker = false"
          @confirm="onConfirm"
          value-key="NAME"
          show-toolbar
        />
      </van-popup>
      <van-field
        v-model="moveForm.note"
        type="textarea"
        name="note"
        label="转移说明:"
        rows="6"
        maxlength="200"
        placeholder="请输入转移说明，不超过200字"
        :rules="[{ required: true, message: '请填写说明' }]"
      />
      <div style="margin: 16px">
        <van-button icon="checked" :loading="loading" block type="info" native-type="submit">提 交</van-button>
      </div>
    </van-form>
  </div>
</template>

<script>
import { Notify } from "vant";
export default {
  data() {
    return {
      showPicker: false,
      loading: false,
      moveForm: {
        applyid: "",
        note: "",
        handledeptid: "",
        handledeptname: "",
		version:""
      }
    };
  },

  components: {},
  methods: {
    goback() {
      history.go(-1);
    },
    onConfirm(value) {
      this.moveForm.handledeptid = value.ID;
      this.moveForm.handledeptname = value.NAME;
      this.showPicker = false;
    },
    onSubmit(values) {
      if (this.loading) {
        return;
      }
      this.loading = true;
      this.util
        .postAjax({
          code: this.global.code,
          url: "apply/move",
          isRep: true,
          data: this.moveForm
        })
        .then(res => {
          if (res.success) {
            Notify({ type: "success", message: "转移成功" });
            setTimeout(() => {
              history.go(-1);
            }, 1500);
          } else {
            Notify({ type: "danger", message: res.data.message });
            this.loading = false;
          }
        });
    }
  },
  created() {
    this.moveForm.applyid = this.$route.params.id;
	this.moveForm.version = this.$route.params.version;
  }
};
</script>
<style lang='scss' scoped>
.depts {
  margin-bottom: 1px;
}
</style>
