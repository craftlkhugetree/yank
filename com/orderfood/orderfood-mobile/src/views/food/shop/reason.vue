<template>
  <div class="wrapper">
    <van-nav-bar class="nav-bar" title="订餐事由" :border="false" left-arrow fixed @click-left="jumper"></van-nav-bar>
    <!---------------------------- 订餐事由 ---------------------------->
    <section class="main-wapper">
      <van-form @submit="onSubmit">
        <van-field
          class="big-field"
          v-model="textInfo"
          type="textarea"
          autosize
          rows="4"
          maxlength="50"
          placeholder="请输入订餐事由，不超过50字"
        />

        <div>
          <van-button
            class="sub-btn"
            :loading="saveLoading"
            round
            block
            type="info"
            native-type="submit"
          >完成</van-button>
        </div>
      </van-form>
    </section>
  </div>
</template>
<script>
import {
  fetchAreas,
  saveAddress,
  fetchAddressById,
  fetchAddressDelete
} from "@/api/client/address";
export default {
  props: {
    isOrder: String,
    shopId: String,
    shopTypeId: String,
    activeTab: String
  },
  data() {
    return {
      textInfo: "",
      saveLoading: false
    };
  },

  computed: {
    //事由
    reasonInfo() {
      return this.$store.state.reasonInfo;
    }
  },

  created() {},

  mounted() {
    this.textInfo = this.reasonInfo;
  },
  methods: {
    jumper() {
      if (this.isOrder) {
        this.$router.push({
          path: `/order/${this.shopId}`,
          query: {
            shopTypeId: this.shopTypeId,
            activeTab: "group"
          }
        });
      } else {
        this.$router.go(-1);
      }
      this.$store.commit("setReasonInfo", "");
    },
    onSubmit() {
      if (this.isOrder) {
        this.$router.push({
          path: `/order/${this.shopId}`,
          query: {
            shopTypeId: this.shopTypeId,
            activeTab: "group"
          }
        });
      } else {
        this.$router.go(-1);
      }
      this.$store.commit("setReasonInfo", this.textInfo);
      sessionStorage.setItem("reasonInfo", this.textInfo);
      sessionStorage.setItem("hasReason", "1");
    }
  }
};
</script>

<style lang="scss" scoped>
.main-wapper {
  padding: 32px 24px;
  margin-top: 84px;
}
.sub-btn {
  height: 72px;
  background: #3a78fc;
  border-radius: 36px;
  margin-top: 24px;
}

.big-field {
  height: 240px;
  background: #f6f6f6;
  border-radius: 12px;
}
</style>
