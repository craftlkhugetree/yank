<template>
  <div>
    <div id="swipe" class="swipe">
      <!--   @touchstart="touchStart"
      @touchmove="touchMove"
      @touchend="touchEnd"-->
      <!---------------------------- 轮播卡片 ---------------------------->
      <div id="swipeWrapper" class="swipe-wrapper clearfix">
        <div class="swipe-item" v-for="(tab,index) in openCafeList" :key="index">
          <div class="scroll-card-item clearfix">
            <h1 class="shop-title">
              {{tab.shopname}}
              <span class="shop-phone" @click="openShowPhone(tab)">
                <img class="btn" src="@/assets/img/phone.png" alt />联系餐厅
              </span>
            </h1>
          </div>
        </div>
      </div>
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
          <span class="shopTips-title">{{curshop.shopname}}</span>
          <van-icon class="del-btn" name="cross" color="#8E8E8E" size="16" @click="showTips=false" />
        </p>
        <div>
          <label class="info-label">配送时间</label>
          <p class="gray-info">{{common.sendTimeFormat(curshop.sendtime)}}</p>
        </div>
        <div>
          <label class="info-label">餐厅说明</label>
          <p class="gray-info">{{curshop.note || "--"}}</p>
        </div>
      </div>
    </van-popup>
  </div>
</template>

<script>
import moment from "moment";

export default {
  props: {
    openCafeList: Array,
    activeCafeId: String
  },
  components: {},
  data() {
    return {
      phoneList: [],
      showPhone: false,
      showTips: false,
      curshop: {
        sendtime: ""
      },
      num: 1, // 轮播卡片数量
      index: 0, // 当前卡片index
      width: 330, // 轮播卡片宽度
      startPoint: 0, // 触摸开始点
      endPoint: 0, // 触摸结束点
      ismove: false, // 是否滑动
      moveLength: 0 // startPoint与endPoint的差值
    };
  },
  computed: {},
  methods: {
    //显示餐厅手机号
    openShowPhone(shop) {
      this.phoneList = shop.mobile.includes(",")
        ? shop.mobile.split(",")
        : [shop.mobile];
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

    // 触摸开始
    touchStart(event) {
      //获取触摸的开始点
      this.startPoint = event.changedTouches[0].pageX;
    },

    // 触摸滑动
    touchMove(event) {
      this.ismove = true;
      //获取触摸的结束点
      this.endPoint = event.changedTouches[0].pageX;
      this.slidings();
    },

    // 触摸结束
    touchEnd(event) {
      //判断是点击还是滑动
      if (!this.ismove) {
        return;
      } else {
        this.jump();
      }
      this.ismove = false;
    },

    //处理在滑动过程中，轮播图跟着手指滑动的距离移动
    slidings() {
      //判断是点击还是滑动
      if (!this.ismove) {
        return;
      }

      let wrapper = document.getElementById("swipeWrapper");
      wrapper.style.transition = "none";

      this.moveLength = this.startPoint - this.endPoint;

      //判断是否超出滑动范围，即第一页无法再往前一页滑动，最后一页无法再往后一页滑动
      if (
        (this.moveLength > 0 && this.index !== this.num - 1) ||
        (this.moveLength < 0 && this.index !== 0)
      ) {
        this.setTranslateX(-this.moveLength - this.index * this.width);
      }
    },

    //处理滑动到一定程度后松手自动跳转到下一页或上一页
    jump() {
      let wrapper = document.getElementById("swipeWrapper");
      wrapper.style.transition = "all 1s";
      //滑动超过轮播图宽度的百分之40，则跳转下一张，否则不跳转
      if (
        this.moveLength > 0 &&
        this.index !== this.num - 1 &&
        this.moveLength > this.width * 0.3
      ) {
        this.index += 1;
      } else if (
        this.moveLength < 0 &&
        this.index !== 0 &&
        -this.moveLength > this.width * 0.3
      ) {
        this.index -= 1;
      }
      let curshop = this.openCafeList[this.index];
      this.$emit("changeCafe", curshop.shopid);
      this.setTranslateX(-this.index * this.width);
    },
    // 设置卡片容器滚动
    setTranslateX(x) {
      let ele = document.getElementById("swipeWrapper");
      ele.style.transform = "translateX(" + x + "px)";
      ele.style.webkitTransform = "translateX(" + x + "px)";
    },
    //跳转其他页面后，返回当前的餐厅
    setInitIndex() {
      if (this.activeCafeId) {
        let cafeindex = this.openCafeList.findIndex(
          v => v.shopid == this.activeCafeId
        );
        let wrapper = document.getElementById("swipeWrapper");
        wrapper.style.transition = "all 1s";

        this.index = cafeindex;
        this.setTranslateX(-this.index * this.width);
      }
    },
    // 初始化
    initSwipe() {
      // 设置轮播卡片容器宽度
      let domWidth = document.documentElement.offsetWidth;
      let wrapper = document.getElementById("swipeWrapper");
      let items = document.getElementsByClassName("swipe-item");
      this.num = items.length;

      // 卡片容器宽度
      wrapper.style.width = items.length * domWidth + "px";
      this.width = domWidth * 0.9;

      // 卡片宽度
      for (let i = 0; i < items.length; i++) {
        items[i].style.width = domWidth * 0.9 + "px";
        // items[i].style.margin = "0px " + domWidth * 0.02 + "px";
        // 统一右移4%
        items[i].style.transform = "translateX(" + domWidth * 0.05 + "px)";
      }
      this.setInitIndex();
    }
  },
  mounted() {
    // 初始化
    this.initSwipe();
  }
};
</script>

<style lang="scss" scoped>
.swipe {
  width: 100%;
  overflow: hidden;
  position: relative;
  .swipe-wrapper {
    transition: all 0s;
  }
  .swipe-item {
    float: left;
    padding: 24px 12px;
  }
}

.scroll-card-item {
  background: #ffffff;
  float: left;
  text-align: left;
  // width: 654px;
  width: 702px;
  height: 104px;
  box-shadow: 0px 5px 20px 0px #e6e6e6;
  border-radius: 20px;
  padding: 24px;
  margin: 0 auto;
  .shop-title {
    height: 56px;
    font-size: 40px;
    font-weight: 600;
    color: #474d51;
    line-height: 56px;
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