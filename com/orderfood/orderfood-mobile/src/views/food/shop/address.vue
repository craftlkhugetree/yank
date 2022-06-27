<template>
  <div class="wrapper">
    <van-nav-bar
      class="nav-bar"
      :title="adstitle"
      :border="false"
      left-arrow
      fixed
      @click-left="handleJumper"
      @click-right="handleDel"
    >
      <template #right>
        <span class="del-btn" v-show="adsId!='add'">删除</span>
      </template>
    </van-nav-bar>

    <!---------------------------- 配送地址 ---------------------------->
    <section class="main-wapper">
      <van-form @submit="onSubmit">
        <div class="info">
          <span class="label">联系人</span>
          <van-field
            readonly
            class="field"
            v-model="username"
            name
            label
            placeholder="请填写联系人"
            :rules="[{ required: true }]"
          />
        </div>
        <div class="info">
          <span class="label">联系手机</span>
          <van-field
            class="field"
            v-model="userphone"
            name
            label
            type="tel"
            placeholder="请输入手机号"
            :rules="[{ pattern, required: true}]"
          />
        </div>
        <div class="info">
          <span class="label">配送地址</span>
          <van-field
            readonly
            is-link
            clickable
            class="field"
            name="picker"
            :value="value"
            placeholder="请选择楼宇"
            @click="showPicker = true"
            :rules="[{ required: true}]"
          />
          <van-popup v-model="showPicker" position="bottom">
            <van-picker
              show-toolbar
              :columns="areas"
              @confirm="onConfirm"
              @cancel="showPicker = false"
            />
          </van-popup>
        </div>

        <div class="info">
          <span class="label"></span>
          <van-field
            class="field"
            v-model="door"
            name
            label
            placeholder="请输入具体门牌号"
            :rules="[{ required: true,  }]"
          />
        </div>
        <div style="margin: 16px;">
          <van-button
            class="sub-btn"
            :loading="saveLoading"
            round
            block
            type="info"
            native-type="submit"
          >保存地址</van-button>
        </div>
      </van-form>
    </section>
    <van-dialog
      class="mini-dialog"
      theme="round-button"
      v-model="showVisible"
      :showCancelButton="false"
      :showConfirmButton="false"
    >
      <slot name="title">
        <h1 class="dialog-title">删除配送地址</h1>
      </slot>
      <div class="bottom-btn">
        <van-button class="cancel-btn" plain round type="primary" @click="showVisible=false">取消</van-button>
        <van-button class="clear-btn" round type="info" @click="handleSure">确定</van-button>
      </div>
    </van-dialog>
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
    adsId: String,
    shopId: String,
    shopTypeId: String,
    activeTab: String
  },
  data() {
    return {
      username: "",
      userphone: localStorage.getItem("mobile"),
      pattern: this.util.regExps.yphone,
      value: "",
      areas: [],
      showPicker: false,
      door: "",
      adstitle: "",
      showVisible: false,
      saveLoading: false
    };
  },

  computed: {
    userInfo() {
      return this.$store.state.userInfo;
    }
  },

  created() {
    this.getAreas();
  },

  mounted() {
    this.username = `${this.userInfo.NAME}（${this.userInfo.ID}）`;
    if (this.adsId == "add") {
      this.adstitle = "新增配送地址";
    } else {
      this.getAdsDetail();
      this.adstitle = "编辑配送地址";
    }
  },
  methods: {
    //返回地址，到单位订餐tab;
    handleJumper() {
      if (this.isOrder) {
        this.$router.push({
          path: `/order/${this.shopId}`,
          query: {
            shopTypeId: this.shopTypeId,
            activeTab: this.activeTab,
            isShowAddress: "1"
          }
        });
      } else {
        this.$router.push({
          path: `/editOrder/${this.shopId}`,
          query: {
            orderId: this.shopTypeId,
            activeTab: this.activeTab,
            isShowAddress: "1"
          }
        });
        // this.$router.go(-1);
      }
    },

    getAdsDetail() {
      let params = {
        id: this.adsId
      };
      fetchAddressById(params).then(res => {
        if (res.success) {
          let ads = res.data;
          this.userphone = ads.mobile;
          this.door = ads.house;
          this.value = ads.area;
        }
      });
    },

    // 获取楼宇
    getAreas() {
      fetchAreas({}).then(res => {
        if (res.success) {
          let datalist = res.data;
          datalist.push({
            id: "other",
            name: "其他"
          });

          this.areas = datalist.map(v => v.name);
        }
      });
    },

    onConfirm(value) {
      this.value = value;
      this.showPicker = false;
    },

    //删除二次确认框
    handleDel() {
      this.showVisible = true;
    },

    //确认删除
    handleSure() {
      let params = {
        id: this.adsId
      };
      fetchAddressDelete(params).then(res => {
        if (res.success) {
          this.showVisible = false;

          this.handleJumper();
        }
      });
    },

    onSubmit(values) {
      localStorage.setItem("mobile", this.userphone);
      this.saveLoading = true;
      let params = {
        area: this.value,
        house: this.door,
        id: this.adsId == "add" ? null : this.adsId,
        mobile: this.userphone,
        userid: this.userInfo.ID,
        username: this.userInfo.NAME
      };
      saveAddress(params).then(res => {
        if (res.success) {
          // this.$router.go(-1);
          this.handleJumper();
          this.saveLoading = false;
        } else {
          let tips = res.data.message || "";
          this.$toast.fail(`${tips}`);
          this.saveLoading = false;
        }
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.main-wapper {
  padding: 32px 0px;
  margin-top: 84px;
}
.sub-btn {
  height: 72px;
  background: #3a78fc;
  border-radius: 36px;
  border: none;
}
.info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 24px;
  .label {
    width: 214px;
    height: 38px;
    font-size: 30px;
    font-weight: 600;
    color: #474d51;
    line-height: 38px;
  }
  .field {
    border-bottom: 1px solid #dbdbdb;
  }
  .areas {
    display: flex;
    flex-direction: column;
    justify-content: center;
  }
}

//确认弹框
.mini-dialog {
  height: 261px;
  padding: 60px 48px;
  .dialog-title {
    width: 100%;
    text-align: center;
    height: 39px;
    font-size: 28px;
    font-weight: 600;
    color: #474d51;
    line-height: 39px;
    margin-bottom: 30px;
  }
  .bottom-btn {
    display: flex;
  }
  .cancel-btn {
    width: 240px;
    height: 72px;
    background: #ffffff;
    border-radius: 36px;
    border: 1px solid rgba(0, 0, 0, 0.15);
    color: rgba(0, 0, 0, 0.65) !important;
    margin-right: 24px;
  }
  .clear-btn {
    width: 240px;
    height: 72px;
    background: #3a78fc;
    border-radius: 36px;
    border: none;
  }
}
.del-btn {
  color: #999999;
}
</style>
