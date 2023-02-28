<template>
  <div class="wrapper">
    <van-nav-bar
      class="nav-bar"
      title="修改订单"
      :border="false"
      left-arrow
      fixed
      @click-left="jumperTab"
    ></van-nav-bar>

    <!----------------------------修改订单信息 提交订单 ---------------------------->
    <section class="main-wapper">
      <div class="address-box">
        <!---------------------------- 订餐类型展示 -------------------------->
        <ul>
          <li v-for="(tab, index) in tabs" :key="index" :class="{ active: active == tab.view }">
            {{ tab.title }}
          </li>
        </ul>
        <!---------------------------- 提示语 -------------------------->
        <div class="tips-box">
          <div class="yellow-tips" v-show="active == 'group' && showGroupTips">
            <van-icon name="warning" color="#FAAD14" size="20" />
            <span>送餐上门后请扫码收餐，并及时结算订单。</span>
            <van-icon
              class="del-btn"
              name="cross"
              color="#8E8E8E"
              size="16"
              @click="showGroupTips = false"
            />
          </div>
          <div class="yellow-tips" v-show="active == 'self' && showSelfTips">
            <van-icon name="warning" color="#FAAD14" size="20" />
            <span>需自行去往餐厅取餐。</span>
            <van-icon
              class="del-btn"
              name="cross"
              color="#8E8E8E"
              size="16"
              @click="showSelfTips = false"
            />
          </div>
        </div>
        <!---------------------------- 无地址 单位 -------------------------->
        <van-cell
          center
          value
          is-link
          @click="addNewAds"
          v-if="!addressArr.length && active == 'group'"
          class="info"
        >
          <template #title>
            <span>新增地址</span>
          </template>
        </van-cell>
        <!---------------------------- 无地址 个人 -------------------------->
        <van-cell
          center
          value
          is-link
          @click="addNewAds"
          v-else-if="!userphone && active == 'self'"
          class="info"
        >
          <template #title>
            <span>新增联系人手机</span>
          </template>
        </van-cell>
        <!---------------------------- 单位订餐 -------------------------->
        <van-cell
          center
          value
          is-link
          @click="showAddress = true"
          v-else-if="active == 'group' && orderData"
          class="info"
        >
          <template #title>
            <span class="ads-title">{{ orderData.area }} {{ orderData.house }}</span>
          </template>
          <template #label>
            <span class="ads-des">
              {{ orderData.creatername }}（{{ orderData.createrid }}）{{ orderData.mobile }}
            </span>
          </template>
        </van-cell>
        <!---------------------------- 个人订餐 -------------------------->
        <van-cell center value is-link @click="showphone = true" class="info" v-else>
          <template #title>
            <span class="time-title">联系手机</span>
          </template>
          <span class="time-day">{{ userphone }}</span>
        </van-cell>
        <!---------------------------- 时间 -------------------------->
        <van-cell
          is-link
          @click="doChooseTime"
          class="info"
          v-if="[1, 2].includes(cafeConfig.orderway)"
        >
          <template #title>
            <span class="time-title" v-if="active == 'self'">
              {{ isOrderOne ? '预计取餐时间' : cafeConfig.orderway == 2 ? '预计取餐日期' : '' }}
            </span>
            <span class="time-title" v-else>
              {{ isOrderOne ? '期望送达时间' : cafeConfig.orderway == 2 ? '期望送达日期' : '' }}
            </span>
          </template>
          <span class="time-day" v-if="isOrderOne">
            {{ moment(defaultday).format('YYYY-MM-DD') }}
            {{ activeTime }}
          </span>
          <span class="time-day" v-if="cafeConfig.orderway == 2">
            {{ pickupTime ? moment(pickupTime).format('YYYY-MM-DD') : '' }}
          </span>
        </van-cell>
        <!---------------------------- 单位订餐事由 -------------------------->
        <div class="cause-div" v-show="active == 'group'" @click="updateReason()">
          <label class="cause-title">订餐事由</label>
          <div class="cause-box">
            <span class="cause-text">{{ reasonInfo }}</span>
            <van-icon
              style="float: right; margin-left: 5px"
              size="17"
              color="#969799"
              name="arrow"
            />
          </div>
        </div>
      </div>
      <!---------------------------- 商品列表 -------------------------->
      <div class="meal-list">
        <van-cell value="添加菜品" is-link @click="addMealbtn">
          <template #title>
            <span class="shop-title">{{ orderData && orderData.shopname }}</span>
          </template>
        </van-cell>
        <template v-for="(res, index) in tableData">
          <div
            class="res-mincard"
            :class="`animation-${index + 1}`"
            :key="'eidtorder' + res.itemid"
            :body-style="{ padding: '0px' }"
          >
            <div class="img-box">
              <img
                :src="common.viewIcon(res.photo)"
                class="image"
                v-if="res.photo && res.photo != '-1'"
              />
              <img src="@/assets/img/no-img.png" class="image" v-else />
            </div>

            <div class="right-box">
              <h1 class="name ellipsis">{{ res.itemname }}</h1>
              <p>
                <span class="orange-money">
                  <i class="orange-tag">￥</i>
                  <span class="orange-num">{{ res.totalPrice }}</span>
                  <span v-show="res.promotionprice">
                    <i class="gray-tag">￥</i>
                    <span class="gray-num">{{ res.price }}</span>
                  </span>
                  <!-- <span
                    class="limit-tips"
                    v-show="res.onelimit == '1' || res.alllimit == '1'"
                    >{{ res.limittext }}
                  </span> -->
                </span>
                <span class="right-btn">
                  <!-- 选中改变数字值，删除仍保留减号及input框 -->
                  <van-stepper
                    v-if="res.id == changeIndex"
                    v-model="res.itemnum"
                    theme="round"
                    button-size="22"
                    :min="0"
                    :max="res.max"
                    integer
                    @blur="event => handleBlur(event, res)"
                  />
                  <!-- 非选中数字时   -->
                  <van-stepper
                    v-else
                    :show-minus="res.itemnum >= 1"
                    :show-input="res.itemnum >= 1"
                    :value="res.itemnum"
                    async-change
                    theme="round"
                    button-size="22"
                    :min="0"
                    :max="res.max"
                    integer
                    @focus="event => handleFocus(event, res)"
                    @plus="addNum(res)"
                    @minus="reduceNumBtn(res)"
                  />
                </span>
              </p>
            </div>
          </div>
        </template>
      </div>
    </section>
    <!---------------------------- 底部订单合计 -------------------------->
    <div class="footer">
      <div class="card-money">
        <span class="total-money">
          <span>共{{ badgeNum }}份，合计：</span>
          <span class="orange-money">
            <i class="orange-tag">￥</i>
            <span class="orange-num">{{ totalPrice }}</span>
          </span>
        </span>
      </div>
      <van-button
        round
        type="info"
        :disabled="badgeNum == 0"
        :class="badgeNum ? 'submit-blue' : 'submit-gray'"
        size="small"
        :loading="submitLoading"
        @click="onSubmit"
      >
        提交订单
      </van-button>
    </div>

    <!---------------------------- 订餐数量过多提示 -------------------------->
    <van-dialog
      class="mini-dialog"
      theme="round-button"
      v-model="showVisible"
      :showCancelButton="false"
      :showConfirmButton="false"
    >
      <slot name="title">
        <h1 class="dialog-title">确认提交</h1>
      </slot>
      <p>
        您的订餐数量过多，可能无法在指定时间配送到，可拨打
        <span class="blue-text">{{ cafeConfig.mobile }}</span>
        联系餐厅确认~
      </p>
      <div class="bottom-btn">
        <van-button class="cancel-btn" plain round type="primary" @click="showVisible = false">
          取消
        </van-button>
        <van-button class="clear-btn" round type="info" @click="confirmSubmit">确认提交</van-button>
      </div>
    </van-dialog>
    <!---------------------------- 选择配送地址 -------------------------->
    <van-popup v-model="showAddress" round position="bottom" :style="{ height: '50%' }">
      <div class="address">
        <p class="head">
          <span class="title">选择配送地址</span>
          <span class="addnew" @click="updateAddress(null)">新增地址</span>
        </p>
        <template v-for="(ads, index) in addressArr">
          <div
            class="address-card"
            :class="`animation-${index + 1}`"
            :key="'address' + ads.id"
            :body-style="{ padding: '0px' }"
          >
            <div @click="chooseAds(ads)" class="address-info">
              <div class="icon-check">
                <van-icon
                  name="checked"
                  class="budge"
                  color="#1890FF"
                  v-if="activeAds == `${ads.area}${ads.house}${ads.userid}${ads.mobile}`"
                />
                <van-icon name="circle" class="budge" color="#DEDEDE" v-else />

                <span class="address-title">{{ ads.area }} {{ ads.house }}</span>
              </div>
              <p @click="chooseAds(ads)" class="gray-info">
                {{ ads.username }}（{{ ads.userid }}）{{ ads.mobile }}
              </p>
            </div>
            <i class="iconfont icon-edit" @click="updateAddress(ads)"></i>
          </div>
        </template>
      </div>
    </van-popup>
    <!---------------------------- 选择联系手机 -------------------------->
    <van-popup v-model="showphone" round position="bottom" :style="{ height: '50%' }">
      <div class="address">
        <van-form @submit="savePhone">
          <p class="head">
            <span class="title">配送信息</span>
            <van-button round class="savebtn" type="info" native-type="submit">保存</van-button>
          </p>
          <div class="info">
            <span class="label">联系手机</span>
            <van-field
              class="field"
              v-model="userphone"
              name
              label
              type="tel"
              placeholder="请输入手机号"
              :rules="[{ pattern, message: '请填写正确的手机号' }]"
            />
          </div>
          <div style="margin: 16px"></div>
        </van-form>
      </div>
    </van-popup>
    <!---------------------------- 选择送达时间 -------------------------->
    <van-popup v-model="showTime" round position="bottom" :style="{ height: '50%' }">
      <div class="timepop">
        <div class="head">
          {{ active == 'group' ? '选择送达时间' : '选择取餐时间' }}
        </div>
        <div class="menu-box">
          <van-sidebar v-model="activedayIndex" @change="clickDayMenu" class="side-menu">
            <template v-for="(date, index) in tabDays">
              <van-sidebar-item :title="getDay(date)" :key="'slide' + index" />
            </template>
          </van-sidebar>
          <ul class="right-list">
            <li v-for="item in selectableTimeList" :key="item" @click="activeTime = item">
              <span class="times">{{ item }}</span>
              <van-icon name="checked" class="budge" color="#1890FF" v-show="activeTime == item" />
            </li>
          </ul>
        </div>
      </div>
    </van-popup>
    <van-calendar v-model="showPickup" :min-date="minDate" color="#3F86F7" @confirm="onConfirm" />
    <!---------------------------- 添加菜品 -------------------------->
    <van-popup
      @close="refreshList"
      v-model="showMeal"
      round
      position="bottom"
      :style="{ height: '50%' }"
    >
      <div class="goods">
        <p class="head">
          <span class="title">添加菜品</span>
          <span class="clear" @click="addMealConfirm">确定</span>
        </p>
        <van-search
          class="search-btn"
          v-model="keyword"
          placeholder="请输入菜品名称"
          shape="round"
          @input="getFoodList()"
        />
        <template v-for="(res, index) in foodList">
          <div
            class="footer-card"
            :class="`animation-${index + 1}`"
            :key="'footer' + res.id"
            :body-style="{ padding: '0px' }"
          >
            <div class="img-box">
              <img
                :src="common.viewIcon(res.photo)"
                class="image"
                v-if="res.photo && res.photo != '-1'"
              />
              <img src="@/assets/img/no-img.png" class="image" v-else />
            </div>

            <div class="right-box">
              <h1 class="name ellipsis">{{ res.name }}</h1>
              <div class="money-div">
                <span class="orange-money">
                  <i class="orange-tag">￥</i>
                  <span class="orange-num">
                    {{ res.promotionprice ? res.promotionprice : res.price }}
                  </span>
                  <span v-show="res.promotionprice">
                    <i class="gray-tag">￥</i>
                    <span class="gray-num">{{ res.price }}</span>
                  </span>
                  <!-- <span
                    class="limit-tips"
                    v-show="res.onelimit == '1' || res.alllimit == '1'"
                    >{{ res.limittext }}
                  </span> -->
                </span>
                <span class="right-btn">
                  <!-- 选中改变数字值，删除仍保留减号及input框 -->
                  <van-stepper
                    v-if="res.id == changeMealIndex"
                    v-model="res.num"
                    theme="round"
                    button-size="22"
                    :min="0"
                    :max="res.max"
                    integer
                    @blur="event => handleMealBlur(event, res)"
                  />
                  <!-- 非选中数字时 -->
                  <van-stepper
                    v-else
                    :show-minus="res.num >= 1"
                    :show-input="res.num >= 1"
                    :value="res.num"
                    async-change
                    theme="round"
                    button-size="22"
                    :min="0"
                    :max="res.max"
                    integer
                    @focus="event => handleMealFocus(event, res)"
                    @plus="addMeal(res)"
                    @minus="reduceMeal(res)"
                  />
                </span>
              </div>
            </div>
          </div>
        </template>
      </div>
    </van-popup>
  </div>
</template>
<script>
import { fetchDetail, saveOrder, fetchAllFoodList, fetchTypeList } from '@/api/client/order';
import { fetchAddress } from '@/api/client/address';
import { fetchOneCafeConfig } from '@/api/client/cafe';
import { getOrderById } from '@/api/client/order';

export default {
  props: {
    shopId: String,
    orderId: String,
    activeTab: String,
    isShowAddress: String,
  },
  data() {
    return {
      // 取餐时间相关
      showPickup: false,
      nowTime: new Date(),
      pickupTime: null,
      shopTypeId: '',
      showGroupTips: true,
      showSelfTips: false,
      active: 'group',
      keyword: '',
      tabs: [
        {
          title: '单位订餐',
          view: 'group',
        },
        {
          title: '个人订餐',
          view: 'self',
        },
      ],
      cafeConfig: {}, //餐厅配置信息
      sendTimes: null,
      sendTimeList: [],
      selectableTimeList: [],
      resData: [],
      showVisible: false,
      showAddress: false,
      showphone: false,
      showMeal: false,
      showTime: false,
      chooseId: false,
      orderData: null,
      addressArr: [],
      valuetime: '',
      showPicker: false,
      defaultday: this.moment().format('YYYYMMDD'),
      startDay: this.moment().format('YYYYMMDD'),
      startTime: null,
      activeTime: '',
      showCalendar: false,
      shopname: '',
      shopCarts: [],
      shopCartList: [],
      shopCart: [],
      tableData: [],
      foodList: [], //添加菜品 全部商品
      activeAds: '', //选中的地址
      activedayIndex: 0, //默认选中的日期
      tabDays: [], // 可选日期
      userphone: localStorage.getItem('mobile'),
      pattern: this.util.regExps.yphone,
      totalPrice: 0, // 总计钱
      badgeNum: 0, // 总计个数
      submitFlag: false,
      changeIndex: '',
      changeMealIndex: '',
      submitLoading: false,
      reasonInfo: '',
      initTableData: [],
      preparetime: null,
    };
  },
  computed: {
    minDate() {
      let now = this.nowTime.getTime();
      let arr = this.common.transIOS(
        this.moment().format('YYYY-MM-DD') + ' ' + this.cafeConfig.fixedtime1
      );
      let fixedtime1 = arr.getTime();
      let fixedtime2 = (this.cafeConfig.fixedtime2 && parseFloat(this.cafeConfig.fixedtime2)) || 0;
      if (now < fixedtime1) {
        return this.moment().add('days', fixedtime2).toDate();
      } else {
        return this.moment()
          .add('days', fixedtime2 + 1)
          .toDate();
      }
    },
    isOrderOne() {
      return this.cafeConfig.orderway == 1;
    },
  },

  created() {
    //修改订单时不能修改订单类型（单位、个人）
    let edittabs = this.tabs.filter(v => v.view == this.activeTab);
    this.tabs = edittabs;
    this.getCafeConfig();
    this.getAddress();
  },
  mounted() {
    this.showAddress = this.isShowAddress ? true : false;
    for (let i = 0; i < 7; i++) {
      let next_day = this.moment().add(i, 'days').format('YYYYMMDD');
      let weekArr = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
      let nowWeek = this.moment(next_day).weekday(); //今天是周几
      this.tabDays.push({
        day: next_day,
        week: weekArr[nowWeek],
      });
    }
    //获取修改订单详情
    if (this.orderId) {
      this.active = this.activeTab || 'group';
      this.showGroupTips = this.active == 'group' ? true : false;
      this.showSelfTips = this.active == 'self' ? true : false;
      this.getOrderDetail();
    }
  },
  methods: {
    // 取餐时间
    onConfirm(date) {
      this.showPickup = false;
      this.pickupTime = this.moment(date).format('yyyyMMDD');
    },
    //返回到记录页
    jumperTab() {
      sessionStorage.setItem('recordTab', 'group');
      sessionStorage.setItem('reasonInfo', '');
      this.$store.commit('setReasonInfo', '');
      sessionStorage.setItem('hasReason', '');
      sessionStorage.removeItem('curAdsAndTime');
      this.$router.push('/record');
    },
    // 获取菜品分类
    getTypeList() {
      let param = {
        shopid: this.shopId,
      };
      fetchTypeList(param).then(res => {
        if (res.success) {
          let listData = res.data;
          let activeArr = listData.filter(v => v.id == this.shopTypeId);
          let activeItem = activeArr[0];
          let { prepareunit, preparetime } = this.cafeConfig;
          // 备餐时间
          let setupTime = preparetime || 0;
          switch (prepareunit) {
            case 'minute':
              setupTime = preparetime;
              break;
            case 'hour':
              setupTime = preparetime * 60;
              break;
            case 'day':
              setupTime = preparetime * 60 * 24;
          }
          this.preparetime = setupTime;
          // 默认时间：当前时间+备餐时间
          this.startTime = this.moment().add(setupTime, 'm');
          this.startDay = this.startTime.format('YYYYMMDD');
          this.initDayList();
          // 设置可选时间列表
          this.setSelectableTimeList();
        }
      });
    },
    //跳转到详情页
    jumpDetail(meal) {
      sessionStorage.removeItem('curAdsAndTime');
      this.$router.push(`/detail/${meal.id}`);
    },

    initDayList() {
      let arr = [];
      for (let i = 0; i < 7; i++) {
        let next_day = this.moment(this.startDay).add(i, 'days').format('YYYYMMDD');
        let weekArr = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
        let nowWeek = this.moment(next_day).weekday(); //今天是周几

        arr.push({
          day: next_day,
          week: weekArr[nowWeek],
        });
      }
      this.tabDays = arr;
      //默认选中的日期，过期时不选中任何日期
      let index = this.tabDays.findIndex(v => v.day == this.defaultday);
      this.activedayIndex = index;
    },
    // 获取详情 初始化编辑参数
    getOrderDetail() {
      this.loading = true;
      let data = {
        id: this.orderId,
      };
      getOrderById(data)
        .then(res => {
          this.loading = false;
          if (res.success) {
            this.orderData = res.data || {};
            if (this.orderData) {
              this.shopTypeId = res.data.shopitemtypeid;
              let totalnum = 0;
              let { area, house, createrid, mobile, senddate, sendtime, items, reason } =
                this.orderData;
              this.activeAds = `${area}${house}${createrid}${mobile}`;
              this.defaultday = senddate;
              this.pickupTime = senddate;
              this.startDay = senddate;
              this.getTypeList();
              this.activeTime = sendtime;
              this.common.setLastAndMaxNum(items);
              this.tableData = items;
              this.tableData.forEach(i => {
                i.newprice = i.promotionprice ? i.promotionprice : i.price;
                i.totalPrice = this.common.multiply(i.newprice, i.itemnum, 2);
                totalnum += i.itemnum;
                i.initnum = i.itemnum + 0;
                if (i.alllimit == '1' || i.onelimit == '1') {
                  i.max = i.max + i.initnum;
                } else {
                  i.max = Infinity;
                }
              });

              this.badgeNum = totalnum;
              this.setTotalPrice();
              let hasReason = sessionStorage.getItem('hasReason') || '';
              if (hasReason) {
                this.reasonInfo = sessionStorage.getItem('reasonInfo');
              } else {
                this.reasonInfo = reason;
              }
              this.initTableData = [...this.tableData];
              this.initAdsAndTime();
            }
          }
        })
        .catch(err => {
          this.loading = false;
        });
    },

    // 再次获取详情状态
    getNowOrderDetail() {
      let data = {
        id: this.orderId,
      };
      getOrderById(data).then(res => {
        this.loading = false;
        if (res.success) {
          let orders = res.data || {};
          if (orders.orderstatus == 1) {
            this.$toast.fail('订单配送中，无法修改！');
            this.submitFlag = true;
          }
        }
      });
    },

    // 获取楼宇
    getAddress() {
      fetchAddress({}).then(res => {
        if (res.success) {
          this.addressArr = res.data || [];
          let defaultAds = this.addressArr.length ? this.addressArr[0] : null;
          if (defaultAds) {
            let { area, house, createrid, mobile } = defaultAds;
            this.activeAds = `${area}${house}${createrid}${mobile}`;
          }
          // this.initAdsAndTime()
        }
      });
    },
    //提交订单
    handleSubmit() {
      let data = {
        id: this.orderId,
      };
      this.submitLoading = true;
      getOrderById(data).then(res => {
        this.loading = false;
        if (res.success) {
          let orders = res.data || {};
          if (orders.orderstatus > 1) {
            let msg = null;
            switch (orders.orderstatus) {
              case '2':
                msg = this.active == 'group' ? '订单正在配送中' : '订单正在等待取餐';
                break;
              case '3':
                msg = this.active == 'group' ? '订单已送达' : '订单已取餐';
                break;
              case '4':
                msg = '订单已取消';
                break;
            }
            this.$toast.fail(`${msg}`);
            this.submitLoading = false;
            return false;
          } else {
            if (!this.addressArr.length && this.active == 'group') {
              this.$toast.fail('提交失败：请添加配送地址！');
              this.submitLoading = false;
              return false;
            }
            if (!this.userphone && this.active == 'self') {
              this.$toast.fail('提交失败：请添加联系人电话！');
              this.submitLoading = false;
              return false;
            }
            if (!this.activeTime && this.isOrderOne) {
              this.$toast.fail('提交失败：请选择配送时间点！');
              this.submitLoading = false;
              return false;
            }
            let cartArr = [];
            this.tableData.forEach(cart => {
              let { itemid, itemname, itemnum, price, promotionprice } = cart;
              cartArr.push({
                itemid,
                itemname,
                itemnum,
                price,
                promotionprice,
              });
            });
            cartArr = cartArr.filter(i => i.itemnum > 0);
            // 计算总额
            let priceList = cartArr.map(i => {
              let newprice = i.promotionprice ? i.promotionprice : i.price;
              return this.common.multiply(newprice, i.itemnum, 2);
            });
            let alltotalPrice = priceList.reduce((sum, num) => {
              return this.common.add(sum, num);
            }, 0);
            let pickupDate3;
            if (this.cafeConfig.orderway == 3) {
              let str = this.common.pickupTimeText(this.cafeConfig);
              let arr = str && str !== '--' ? str.split('~') : [];
              pickupDate3 = arr[0] && arr[0].replace(/[.\s]/g, '');
            }
            let senddate = this.isOrderOne
              ? this.defaultday
              : this.cafeConfig.orderway == 2
              ? this.pickupTime
              : pickupDate3;
            let sendtime = this.isOrderOne ? this.activeTime : undefined;
            let params = {
              area: this.orderData ? this.orderData.area : '',
              house: this.orderData ? this.orderData.house : '',
              mobile: this.orderData ? this.orderData.mobile : this.userphone,
              id: this.orderId || null,
              items: cartArr,
              ordertype: this.active, //"订单类型 self个人  group团体",
              senddate, //this.defaultday, //"预期送达日期，比如20210806",
              sendtime, //this.activeTime, //"预期送达时间，比如1010",
              shopid: this.shopId,
              shopitemtypeid: this.shopTypeId,
              shopname: this.orderData.shopname,
              totalfee: alltotalPrice,
              reason: this.reasonInfo,
            };

            //返回订单id
            saveOrder(params).then(res => {
              this.submitLoading = false;
              if (res.success) {
                this.$store.commit('setReasonInfo', '');
                sessionStorage.setItem('reasonInfo', '');
                sessionStorage.setItem('hasReason', '');
                sessionStorage.removeItem('curAdsAndTime');
                this.showVisible = true;
                this.$router.push(`/orderSuccess/${res.data}`);
              } else {
                let tips = res.data.message || '';
                this.$toast.fail(`${tips}`);
              }
            });
          }
        }
      });
    },
    //确认提交订单
    confirmSubmit() {
      this.handleSubmit();
    },
    // 提交订单
    onSubmit() {
      if (!this.addressArr.length && this.active == 'group') {
        this.$toast.fail('提交失败：请添加配送地址！');
        return false;
      }
      if (!this.userphone && this.active == 'self') {
        this.$toast.fail('提交失败：请添加联系人电话！');
        return false;
      }

      let tips = this.active == 'group' ? '期望送达时间' : '预计取餐时间';
      if ((!this.defaultday || !this.activeTime) && this.isOrderOne) {
        this.$toast.fail(`提交失败：请选择${tips}！`);
        return false;
      }
      if (
        this.isOrderOne &&
        (this.defaultday < this.moment(this.startDay).format('YYYYMMDD') ||
          !this.selectableTimeList.includes(this.activeTime) ||
          (this.defaultday == this.moment(this.startDay).format('YYYYMMDD') &&
            this.activeTime < this.moment().add(this.preparetime, 'm').format('HH:mm')))
      ) {
        this.$toast.fail(`${tips}已过期，请重新选择${tips}！`);
        return false;
      }
      // 计算送达时间距离现在的时间差
      let sendDateTime = this.moment(this.defaultday + ' ' + this.activeTime, 'YYYYMMDD HH:mm');
      let now = this.moment();
      let diff = sendDateTime.diff(now, 'hour', true);
      let maxdiff = this.cafeConfig.maxitems || 15;
      let mindiff = this.cafeConfig.timeinfo || 5;
      if (this.badgeNum >= maxdiff && diff <= mindiff) {
        this.showVisible = true;
      } else {
        this.showVisible = false;
        this.handleSubmit();
      }
    },
    addNewAds() {
      if (this.active == 'group') {
        this.updateAddress(null);
      } else {
        this.showphone = true;
      }
    },
    //计算总额
    setTotalPrice() {
      let priceList = this.tableData.map(i => i.totalPrice);
      this.totalPrice = priceList.reduce((sum, num) => {
        return this.common.add(sum, num);
      }, 0);
    },
    //计算数量
    setTotalNum() {
      let numList = this.tableData.map(i => parseInt(i.itemnum));
      let allNums = numList.reduce((sum, num) => {
        return this.common.add(sum, num);
      }, 0);
      this.badgeNum = parseInt(allNums);
    },

    updateAddress(ads) {
      this.storeAdsAndTime();
      let id = ads ? ads.id : 'add';
      // this.$router.push(`/address/${id}`);
      this.$router.push({
        path: `/address/${id}`,
        query: {
          isOrder: 0,
          shopId: this.shopId,
          shopTypeId: this.orderId,
          activeTab: this.activeTab,
        },
      });
    },

    // 存储当前的地址和时间
    storeAdsAndTime() {
      let data = {
        // activeAds: this.activeAds,
        // defaultAds: this.defaultAds,
        defaultday: this.defaultday,
        activeTime: this.activeTime,
        activedayIndex: this.activedayIndex,
      };
      sessionStorage.setItem('curAdsAndTime', JSON.stringify(data));
    },

    // 初始化地址和时间
    initAdsAndTime() {
      let data = sessionStorage.getItem('curAdsAndTime');
      if (data) {
        let param = JSON.parse(data);
        // this.activeAds = param.activeAds
        // this.defaultAds = param.defaultAds
        this.defaultday = param.defaultday;
        this.activeTime = param.activeTime;
        this.activedayIndex = param.activedayIndex;
        // this.clickDayMenu(this.activedayIndex)
      }
    },
    //保存、编辑事由
    updateReason() {
      this.storeAdsAndTime();
      this.$store.commit('setReasonInfo', this.reasonInfo);
      this.$router.push({
        path: `/reason`,
      });
    },
    //保存联系人电话
    savePhone() {
      this.orderData.mobile = this.userphone;
      localStorage.setItem('mobile', this.userphone);
      this.showphone = false;
    },

    //选中的地址
    chooseAds(ads) {
      let { area, house, username, userid, mobile } = ads;
      this.activeAds = `${area}${house}${userid}${mobile}`;
      this.orderData.area = area;
      this.orderData.house = house;
      this.orderData.creatername = username;
      this.orderData.createrid = userid;
      this.orderData.mobile = mobile;
    },
    // 获取餐厅配置详情
    getCafeConfig() {
      this.loading = true;
      let data = {
        shopid: this.shopId,
      };
      fetchOneCafeConfig(data)
        .then(res => {
          this.loading = false;
          if (res.success) {
            this.cafeConfig = res.data;
            this.initSendTimeList();
          }
        })
        .catch(err => {
          this.loading = false;
        });
    },

    //失去焦点时 购物车订单页面
    async handleBlur(event, food) {
      this.changeIndex = '';
      let curNum = food.itemnum > food.max ? food.max : food.itemnum;
      this.$set(food, 'itemnum', curNum);
      //个人限制--个人剩余量
      if (food.onelimit == '1') {
        let personSurplusNum = (await this.common.fetchItemBuyNum(food)) + food.initnum || 0;
        if (food.itemnum > personSurplusNum) {
          this.$set(food, 'itemnum', personSurplusNum);
          this.$toast.fail(`限${food.onelimitnum}份每人`);
        }
      }
      food.totalPrice = this.common.multiply(food.newprice, curNum, 2);
      this.setTotalPrice();
      this.setTotalNum();
      //去掉为0的商品
      this.tableData = this.tableData.filter(i => i.itemnum > 0);
    },

    //获取焦点时
    handleFocus(event, res) {
      this.changeIndex = res.id;
    },

    // 购物车数量加1  如果不存在当前购物车，则新增购物车
    async addNum(food) {
      // 判断是否初始的菜品
      let initvalue = 0;
      //个人限制--个人剩余量
      if (food.onelimit == '1') {
        let initIndex = this.initTableData.findIndex(i => i.itemid == food.itemid);
        if (initIndex > -1) {
          initvalue = this.initTableData[initIndex].initnum;
        }
        let personSurplusNum = (await this.common.fetchByitemid(food)) + initvalue || 0;
        if (food.itemnum >= personSurplusNum) {
          this.$toast.fail(`限${food.onelimitnum}份每人`);
          return false;
        }
      }
      //总量限制
      if ((food.alllimit == '1' && food.itemnum > food.surplusnum + food.initnum) || 0) {
        this.$toast.fail(`菜品余量不足，最多可定${food.surplusnum}份`);
        return false;
      }

      food.itemnum = parseInt(food.itemnum) + 1;

      food.totalPrice = this.common.multiply(food.newprice, food.itemnum, 2);
      this.badgeNum += 1;
      this.setTotalPrice();
    },

    // 购物车数量减1
    reduceNumBtn(food) {
      let index = this.tableData.findIndex(i => i.itemid == food.id);
      food.itemnum -= 1;
      this.tableData = this.tableData.filter(v => v.itemnum > 0);
      this.badgeNum -= 1;
      food.totalPrice = this.common.multiply(food.newprice, food.itemnum, 2);
      this.setTotalPrice();
    },

    //添加菜品按钮
    addMealbtn() {
      this.getFoodList();
      this.showMeal = true;
    },

    // 获取该餐厅下默认全部菜品列表
    getFoodList() {
      this.foodLoading = true;
      let param = {
        name: this.keyword || null,
        shopid: this.shopId,
        // shopitemtypeid: this.shopTypeId,
        status: '1',
      };
      fetchAllFoodList(param)
        .then(res => {
          this.foodLoading = false;
          if (res.success) {
            let list = res.data || [];
            list.forEach(i => {
              this.$set(i, 'num', 0);
              i.newprice = i.promotionprice ? i.promotionprice : i.price;
            });
            // this.common.setLastAndMaxNum(list);
            this.foodList = list;
            // 设置菜品的购物车数量
            if (this.tableData.length) {
              this.foodList.forEach(i => {
                this.tableData.forEach(j => {
                  if (j.itemid == i.id) {
                    i.num = j.itemnum;
                  }
                });
              });
            }

            // 设置菜品的购物车数量
            if (this.initTableData.length) {
              this.foodList.forEach(i => {
                this.initTableData.forEach(j => {
                  if (j.itemid == i.id) {
                    i.max = j.max;
                  }
                });
              });
            }
          }
        })
        .catch(err => {
          this.foodLoading = false;
        });
    },

    //失去焦点时 添加菜品列表
    async handleMealBlur(event, food) {
      this.changeMealIndex = '';
      let curNum = food.num > food.max ? food.max : food.num;
      this.$set(food, 'num', curNum);
      let initvalue = 0;
      //个人限制--个人剩余量
      if (food.onelimit == '1') {
        let initIndex = this.initTableData.findIndex(i => i.itemid == food.id);
        if (initIndex > -1) {
          initvalue = this.initTableData[initIndex].initnum;
        }
        let personSurplusNum = (await this.common.fetchItemBuyNum(food)) + initvalue;
        if (food.num > personSurplusNum) {
          curNum = personSurplusNum;
          this.$set(food, 'num', curNum);
          this.$toast.fail(`限${food.onelimitnum}份每人`);
        }
      }
      food.totalPrice = this.common.multiply(food.newprice, food.num, 2);

      let { id, name, num, price, totalPrice } = food;
      let obj = {
        itemid: id,
        itemname: name,
        itemnum: parseInt(curNum),
        price: price,
        totalPrice: totalPrice,
        newprice: food.newprice,
        ...food,
      };
      let index = this.tableData.findIndex(i => i.itemid == food.id);
      this.tableData[index] = obj;
      this.setTotalPrice();
      this.setTotalNum();
    },

    //获取焦点时
    handleMealFocus(event, res) {
      this.changeMealIndex = res.id;
    },

    //  添加菜品购物车数量加1  如果不存在当前购物车，则新增购物车
    async addMeal(food) {
      // 判断是否初始的菜品
      let initvalue = 0;
      //个人限制--个人剩余量
      if (food.onelimit == '1') {
        let initIndex = this.initTableData.findIndex(i => i.itemid == food.id);
        if (initIndex > -1) {
          initvalue = this.initTableData[initIndex].initnum;
        }
        let personSurplusNum = (await this.common.fetchItemBuyNum(food)) + initvalue || 0;
        if (food.num >= personSurplusNum) {
          this.$toast.fail(`限${food.onelimitnum}份每人`);
          return false;
        }
      }
      //总量限制
      if (food.alllimit == '1' && food.num > food.surplusnum) {
        this.$toast.fail(`菜品余量不足，最多可定${food.surplusnum}份`);
        return false;
      }

      food.num = parseInt(food.num) + 1;
      let obj = {
        itemid: food.id,
        itemname: food.name,
        itemnum: 1,
        totalPrice: food.newprice,
        newprice: food.newprice,
        ...food,
      };

      let index = this.tableData.findIndex(i => i.itemid == food.id);
      if (index == -1) {
        this.tableData.push(obj);
      } else {
        this.tableData[index].itemnum = food.num;
      }

      this.setTotalPrice();
      this.badgeNum += 1;
    },

    //添加菜品 购物车数量减1
    reduceMeal(food) {
      let index = this.tableData.findIndex(i => i.itemid == food.id);
      if (food.num == 1) {
        food.num = 0;
        this.tableData.splice(index, 1);
      } else {
        food.num -= 1;
        this.tableData[index].itemnum -= 1;
      }

      this.setTotalPrice();
      this.badgeNum -= 1;
    },
    //关闭遮罩
    refreshList() {
      this.tableData.forEach(food => {
        food.totalPrice = this.common.multiply(food.newprice, food.itemnum, 2);
      });
      this.tableData = this.tableData.filter(i => i.itemnum > 0);
      this.setTotalPrice();
    },

    addMealConfirm() {
      this.showMeal = false;
    },
    //选择时间
    getDay(date) {
      let day = this.moment(date.day).format('MM-DD');
      let today = this.moment().format('MM-DD');
      let tommorw = this.moment().add(1, 'days').format('MM-DD');
      if (today == day) {
        day = '今日';
      }
      if (day == tommorw) {
        day = '明日';
      }
      let str = `${day}（${date.week}）`;
      return str;
    },
    clickDayMenu(dayindex) {
      let chooseday = this.tabDays[dayindex];
      this.defaultday = chooseday.day;
      this.setSelectableTimeList();
    },
    doChooseTime() {
      if (this.isOrderOne == 1) {
        this.showTime = true;
        this.showPickup = false;
      } else if (this.cafeConfig.orderway == 2) {
        this.showTime = false;
        this.showPickup = true;
        this.nowTime = new Date();
      }
    },
    // 配送时间
    initSendTimeList() {
      if (this.cafeConfig && this.cafeConfig.sendtime) {
        let list = this.cafeConfig.sendtime.split(',');
        let arr = list.map(i => {
          return i.split('-');
        });
        this.sendTimeList = arr;
        if (arr.length > 0) {
          this.sendTimes = arr.map(i => i[0] + ' ~ ' + i[1]).join('，');
        }
        // 设置可选时间列表
        this.setSelectableTimeList();
      }
    },
    // 设置可选时间列表
    setSelectableTimeList() {
      let list = [];
      let now = this.moment().format('HH:mm');
      let defaultTime = this.startTime.format('HH:mm');
      // 取整十分钟
      let m = defaultTime.substring(defaultTime.length - 1);
      if (m != '0') {
        defaultTime = this.moment(defaultTime, 'HH:mm')
          .add(10 - m, 'm')
          .format('HH:mm');
      }
      // 可选时间
      this.sendTimeList.forEach(i => {
        let st = i[0],
          et = i[1];
        let time = st;
        while (time <= et) {
          // 如果是当天 要判断 默认时间 是否已经超过了 可选时间
          if (this.defaultday == this.moment(this.startDay).format('YYYYMMDD')) {
            if (defaultTime <= time) {
              list.push(time);
            }
          } else {
            list.push(time);
          }
          if (time >= '23:50') break;
          time = this.moment(time, 'HH:mm').add(10, 'm').format('HH:mm');
        }
      });
      this.selectableTimeList = list;
      // 设置默认时间
      let times = list;
      // 如果是当天
      if (this.defaultday == this.moment().format('YYYYMMDD')) {
        // 当前时间如果小于11:30，并且12点可以选，则默认时间为12点
        if (now <= '11:30' && times.includes('12:00')) {
          defaultTime = '12:00';
          // 14:00 ~ 17:00，并且12点可以选，则是17:30
        } else if (now > '14:00' && now <= '17:00' && times.includes('17:30')) {
          defaultTime = '17:30';
        }
        if (times.includes(defaultTime)) {
          this.activeTime = defaultTime;
        }
      }
      this.activeTime = times.includes(this.activeTime) ? this.activeTime : times[0];
    },
  },
};
</script>

<style lang="scss" scoped>
.main-wapper {
  padding: 110px 24px 120px;
  background: #f6f6f6;
  min-height: 1550px;
}
.address-box {
  margin-bottom: 24px;
  ul {
    justify-content: center;
    position: relative;
    font-size: 28px;
  }
  ul li {
    display: inline-block;
    width: 50%;
    height: 70px;
    line-height: 70px;
    text-align: center;
    background: #e7eefe;
    border-radius: 10px 10px 0px 0px;
    color: #7d7d80;
    position: relative;
  }
  ul li.active {
    height: 80px;
    font-weight: 500;
    background: #ffffff;
    color: #474d51;
    border-top: 10px solid #fff;
  }

  .time-day {
    color: #3a78fc;
    font-weight: 600;
  }
}

.meal-list {
  background: #fff;
  .shop-title {
    font-size: 28px;
    font-weight: 600;
    color: #474d51;
    line-height: 39px;
    padding-top: 24px;
  }
}
.bigImg {
  width: 100%;
  height: 566px;
  display: block;
}
.image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.meal-box {
  display: block;
  margin: 24px;
  padding: 24px;
  height: 234px;
  background: #ffffff;
  box-shadow: 0px 5px 20px 0px #e6e6e6;
  border-radius: 10px;
  .name {
    height: 54px;
    font-size: 39px;
    font-weight: 600;
    color: #474d51;
    line-height: 54px;
    display: block;
    .search-text {
      color: #586add !important;
    }
  }
  .res-des {
    margin-top: 12px;
    margin-bottom: 24px;
    height: 32px;
    font-size: 23px;
    font-weight: 400;
    color: #999999;
    line-height: 32px;
    display: -webkit-box;
    overflow: hidden;
    -webkit-box-orient: vertical;
    text-overflow: ellipsis;
    //超出多少行显示省略号
    -webkit-line-clamp: 1;
  }

  .right-btn {
    float: right;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .orange-money {
    font-size: 34px;
    font-weight: 600;
    color: #fd7d18;
    line-height: 48px;
    .orange-tag {
      font-size: 24px;
      font-weight: 600;
    }
    .orange-num {
      font-weight: 600;
    }
  }

  .num {
    padding: 0 18px;
    color: #474d51;
    font-size: 28px;
  }
  .minus-btn {
    border: 1px solid #3f86f7 !important;
  }
  .plus-btn {
    margin-right: 27px;
    background-color: #3f86f7 !important;
    border: 1px solid #3f86f7 !important;
  }
}
.total-money {
  height: 36px;
  font-size: 24px;
  font-weight: 400;
  color: #474d51;
  line-height: 36px;
  margin-right: 24px;
  .orange-money {
    font-size: 37px;
    font-weight: 600;
    color: #fd7d18;
    line-height: 48px;
    .orange-tag {
      font-size: 24px;
      font-weight: 600;
    }
    .orange-num {
      font-weight: 600;
    }
  }
}
.blue-text {
  color: #3a78fc;
}

//确认弹框
.mini-dialog {
  min-height: 353px;
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
  p {
    font-size: 24px;
    font-weight: 400;
    color: #474d51;
    line-height: 40px;
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
.address {
  padding: 30px 24px;
  .head {
    display: flex;
    justify-content: space-between;
  }
  .title {
    height: 38px;
    font-size: 27px;
    font-weight: 400;
    color: #474d51;
    line-height: 38px;
  }
  .savebtn {
    height: 32px;
    font-size: 23px;
    font-weight: 400;
    color: #3a78fc;
    line-height: 32px;
    background: #fff;
    border: none;
  }
  .addnew {
    height: 36px;
    font-size: 24px;
    font-weight: 400;
    color: #3a78fc;
    line-height: 36px;
  }
  .address-title {
    font-size: 28px;
    font-weight: 600;
    color: #474d51;
    line-height: 39px;
  }
  .address-card {
    padding: 30px 0px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    .address-info {
      width: 90%;
    }
  }
  .icon-check:before {
    display: none;
  }
  .icon-check {
    display: flex;
    justify-content: flex-start;
  }
  p.gray-info {
    height: 36px;
    font-size: 24px;
    font-weight: 400;
    color: #999999;
    line-height: 36px;
    padding-left: 42px;
  }
  .icon-edit {
    width: 32px;
    height: 32px;
    font-size: 32px;
  }
}
.van-cell__label {
  width: 300px;
}

.budge {
  display: inline-block;
  width: 32px;
  height: 32px;
  font-size: 32px;
  margin-right: 12px;
}

//购物车
.goods {
  padding: 30px 24px;
  .head {
    display: flex;
    justify-content: space-between;
    height: 38px;
    line-height: 38px;
  }
  .title {
    font-size: 27px;
    font-weight: 400;
    color: #474d51;
  }
  .clear {
    font-size: 23px;
    font-weight: 400;
    color: #999999;
    margin-right: 24px;
  }
}
//时间
.timepop {
  .head {
    padding: 24px;
    height: 80px;
    background: #f6f6f6;
    text-align: center;
    width: 100%;
    font-size: 27px;
    font-weight: 400;
    color: #474d51;
    position: fixed;
    z-index: 9999;
  }
}
.van-sidebar-item--select::before {
  width: 0px;
}
.menu-box {
  padding-bottom: 24px;
  display: flex;
  justify-content: space-between;

  .right-list {
    margin-top: 90px;
    li {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 15px;
      .times {
        line-height: 60px;
        height: 60px;
        display: inline-block;
      }
    }
    margin-left: 365px;
    width: calc(100% - 95px);
  }
  .side-menu {
    width: 220px;
    position: fixed;
    background: #f6f6f6;
    margin-top: 80px;
    text-align: center;
    height: calc(100% - 380px);
    .van-sidebar-item {
      padding: 24px;
      font-size: 24px;
    }
  }
}

//联系手机表单
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

.footer {
  padding: 24px;
  position: fixed;
  bottom: 0;
  height: 120px;
  width: 100%;
  background: rgba(255, 255, 255, 0.9);
  box-shadow: 0px -3px 6px 0px rgba(0, 0, 0, 0.05);
  display: flex;
  justify-content: flex-end;
  align-items: center;
  z-index: 999;
  .card-money {
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .submit-gray,
  .submit-blue {
    width: 220px;
    height: 72px;
    font-size: 30px;
    background: #3a78fc !important;
    border-color: #3a78fc !important;
    border-radius: 36px;
  }
  .submit-gray {
    background: #999999 !important;
    border-color: #999999 !important;
  }
}
.ads-des,
.ads-title {
  display: inherit;
  width: 600px;
}
.info .van-cell {
  padding: 24px;
  position: relative;
  height: 36px;
}

.van-cell::after {
  border: none !important;
}
.van-search {
  padding: 24px 0;
}
.van-search .van-cell {
  padding: 8px !important;
}
.search-btn {
  width: 100%;
}

span.ads-title {
  font-size: 32px;
  font-weight: 600;
  color: #474d51;
}
.time-title {
  color: #474d51;
}

.tips-box {
  padding: 24px 24px 0px 24px;
  background: #fff;

  .yellow-tips {
    height: 82px;
    line-height: 82px;
    background: #fffbe6;
    border-radius: 10px;
    font-size: 24px;
    color: rgba(0, 0, 0, 0.65);
    border: 1px solid #ffe58f;
    display: flex;
    align-items: center;
    padding-left: 20px;
    position: relative;
    .van-icon {
      margin-right: 20px;
    }
    .van-icon.del-btn {
      position: absolute;
      right: 0px;
    }
  }
}

.cause-div {
  background: #fff;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.32rem;
  font-size: 28px;
  color: #474d51;

  .cause-box {
    max-width: 70%;
    display: flex;
    justify-content: end;
  }
  .cause-text {
    color: #474d51;
    line-height: 36px;
    overflow: hidden;
    -webkit-box-orient: vertical;
    text-overflow: ellipsis;
    //超出多少行显示省略号
    -webkit-line-clamp: 2;
    display: -webkit-box;
  }
}
</style>