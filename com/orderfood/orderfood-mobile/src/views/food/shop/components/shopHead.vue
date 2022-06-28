<template>
  <div>
    <!---------------------------- 餐厅名称 ---------------------------->
    <div class="top-img">
      <img class="top-bg" src="@/assets/img/bg-header.png" alt />
      <div v-for="(tab, index) in openCafeList" :key="index" class="card-box">
        <div class="card">
          <h1 class="title-box">
            <p class="shop-title" @click="openShowTips(tab)">
              <span v-if="tab.orderway == 1" class="ellipsis">
                备餐时间：{{ tab.preparetime || '--' }}{{ common.unitFormat(tab.prepareunit) }}
              </span>
              <span v-else class="ellipsis">取餐时间：{{ common.pickupTimeText(tab) }}</span>
              <span class="ellipsis">餐厅说明：{{ tab.note || '--' }}</span>
            </p>
            <span class="shop-phone" @click="openShowPhone(tab)">
              <img class="btn" src="@/assets/img/phone.png" alt />
              联系餐厅
            </span>
          </h1>
        </div>
      </div>
      <div class="header-height"></div>
    </div>
    <!---------------------------- 拨打手机号 ---------------------------->
    <van-popup
      v-model="showPhone"
      round
      position="bottom"
      :style="{ height: '50%', background: 'transparent' }"
    >
      <div class="phone-info">
        <ul>
          <li v-for="item in phoneList" :key="item" @click="callPhone(item)">{{ item }}</li>
        </ul>
      </div>
      <div class="footer">
        <van-button type="default" class="big-btn" @click="showPhone = false">取消</van-button>
      </div>
    </van-popup>
    <!---------------------------- 展示餐厅说明 ---------------------------->
    <van-popup v-model="showTips" round position="bottom" :style="{ height: '50%' }">
      <div class="shopTips">
        <p class="head">
          <span class="shopTips-title">{{ curshop.shopname }}</span>
          <van-icon
            class="del-btn"
            name="cross"
            color="#8E8E8E"
            size="16"
            @click="showTips = false"
          />
        </p>
        <div v-if="curshop.orderway == 1">
          <label class="info-label">配送时间</label>
          <p class="gray-info">{{ common.sendTimeFormat(curshop.sendtime) }}</p>
        </div>
        <div v-else>
          <label class="info-label">取餐时间</label>
          <p class="gray-info">{{ common.pickupTimeText(curshop) }}</p>
        </div>
        <div>
          <label class="info-label">餐厅说明</label>
          <p class="gray-info">{{ curshop.note || '--' }}</p>
        </div>
      </div>
    </van-popup>
  </div>
</template>

<script>
export default {
  props: {
    openCafeList: Array,
    activeCafeId: String,
  },
  components: {},
  data() {
    return {
      phoneList: [],
      showPhone: false,
      showTips: false,
      curshop: { sendtime: '' },
    };
  },

    methods: {
    //显示餐厅手机号
    openShowPhone(shop) {
      this.phoneList = shop.mobile && shop.mobile.includes(',') ? shop.mobile.split(',') : [shop.mobile || ''];
      this.showPhone = true;
    },
    //显示餐厅说明
    openShowTips(shop) {
      this.curshop = shop;
      this.showTips = true;
    },
    //打电话
    callPhone(phoneNum) {
      window.location.href = `tel://${phoneNum}`;
    },
  },
  mounted() {},
};
</script>

<style lang="scss" scoped>
.top-img {
  position: relative;
  background: #fff;
  width: 100%;
  // z-index: 0;
  .top-bg {
    width: 100%;
    height: 80px;
  }
}
.card-box {
  position: absolute;
  top: 32px;
  left: 24px;
}

.card {
  background: #ffffff;
  text-align: left;
  width: 702px;
  height: 104px;
  box-shadow: 0px 5px 20px 0px #e6e6e6;
  border-radius: 20px;
  padding: 24px;
  .title-box {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .shop-title {
    width: 70%;
    height: 56px;
    line-height: 28px;
    font-size: 22px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: #474d51;
  }
  .shop-phone {
    font-size: 20px;
    color: #3a78fc;
    float: right;
    display: flex;
    justify-content: center;
    align-items: center;
    img {
      width: 28px;
      height: 28px;
      background-size: cover;
      margin-right: 6px;
    }
  }
  .send-time {
    color: #474d51;
  }
  .shop-tip {
    color: #999999;
    display: -webkit-box;
    overflow: hidden;
    -webkit-box-orient: vertical;
    text-overflow: ellipsis;
    //超出多少行显示省略号
    -webkit-line-clamp: 2;
  }
  p {
    padding-top: 10px;
    font-weight: 400;
    line-height: 32px;
    white-space: break-spaces;
  }
}

.phone-info {
  padding: 27px;
  text-align: center;
  position: fixed;
  bottom: 93px;
  width: 100%;
  margin-bottom: 24px;
  ul {
    background: #ffffff;
    border-radius: 20px;
    li {
      font-size: 32px;
      color: #3a78fc;
      height: 93px;
      line-height: 93px;
      border-bottom: 1px solid #ebebeb;
    }
    li:last-child {
      border: none;
    }
  }
}
.footer {
  text-align: center;
  position: fixed;
  bottom: 0;
  width: 100%;
  padding: 27px;
  // z-index: 99999;
}
.big-btn {
  font-size: 32px;
  color: #3a78fc;
  width: 100%;
  height: 93px;
  line-height: 93px;
  background: #ffffff;
  border-radius: 20px;
}

.shopTips {
  padding: 30px 24px;
  .head {
    text-align: center;
    margin-bottom: 60px;
  }

  .shopTips-title {
    font-size: 36px;
    font-weight: 600;
    color: #474d51;
    line-height: 50px;
  }
  .del-btn {
    float: right;
  }
  .info-label {
    font-size: 28px;
    color: #474d51;
    line-height: 32px;
  }

  p.gray-info {
    font-size: 24px;
    font-weight: 400;
    color: #999999;
    line-height: 36px;
    margin-top: 24px;
    margin-bottom: 32px;
  }
}
</style>
