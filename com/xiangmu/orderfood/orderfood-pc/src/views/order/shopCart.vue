<template>
  <div class="base-search-table" v-loading="loading">
    <div class="search-box clearfix" style="padding: 15px 20px 10px">
      <i class="el-icon-arrow-left" @click="$router.go(-1)">返回</i>
      <el-divider direction="vertical"></el-divider>
      购物车
      <div class="search-box-right">
        <i class="iconfont icon-qingkong" @click="clearShopCart">清空</i>
      </div>
    </div>
    <div class="detail">
      <div class="item">
        <h3>{{ shopname }}</h3>
        <p v-if="curOrderType == 'group' && isOrderOne">
          <label>配送时间：</label>
          <span>{{ sendTimes }}</span>
        </p>
        <p v-if="isOrderOne">
          <label>备餐时间：</label>
          <span>{{ prepare || '--' }}</span>
        </p>
        <p v-if="!isOrderOne">
          <label>取餐时间：</label>
          <span>{{ common.pickupTimeText(shopDetail) }}</span>
        </p>
        <p>
          <label>联系电话：</label>
          <span>{{ mobiles || '--' }}</span>
        </p>
      </div>
      <div class="item" style="position: relative">
        <h3>订餐类型</h3>
        <span
          slot="reference"
          class="type"
          :class="{ select: curOrderType == type.id }"
          v-for="type in orderTypes"
          :key="type.id"
          @click="
            curOrderType = type.id;
            showTip = true;
            addressVisible = false;
          "
        >
          {{ type.name }}
        </span>
        <div v-if="showTip" class="type-tips" :class="{ top: curOrderType == 'group' }">
          <i class="el-icon-warning"></i>
          {{
            curOrderType == 'group'
              ? '送餐上门后请扫码收餐，并及时结算订单。'
              : '需自行去往餐厅取餐。'
          }}
          <i class="el-icon-close" @click="showTip = false"></i>
        </div>
      </div>
      <div class="item" v-if="curOrderType == 'group'">
        <h3>选择配送地址</h3>
        <span>{{ curAddressName }}</span>
        <el-popover
          ref="addressPopover"
          placement="bottom-start"
          width="380"
          trigger="manual"
          v-model="addressVisible"
        >
          <span slot="reference" class="btn" @click="addressVisible = !addressVisible">
            选择地址
          </span>
          <i class="el-icon-close" @click="addressVisible = false"></i>
          <div style="padding: 8px; height: 240px; overflow-y: auto" v-loading="addressLoadinng">
            <el-button
              type="primary"
              size="small"
              style="margin-bottom: 10px"
              @click="openDrawer('add')"
            >
              新增地址
            </el-button>
            <el-radio-group v-model="curAddressId">
              <el-radio v-for="item in addressList" :key="item.id" :label="item.id">
                <span class="area">
                  {{ item.area }}{{ item.house }}
                  <i class="el-icon-edit" @click.stop="openDrawer('edit', item)"></i>
                  <i class="el-icon-delete" @click.stop="deleteAddress(item)"></i>
                </span>
                <span class="area-note">
                  {{ item.username }}（{{ item.userid }}） {{ item.mobile }}
                </span>
              </el-radio>
            </el-radio-group>
          </div>
        </el-popover>
      </div>
      <div class="item" v-else>
        <h3>联系手机</h3>
        <el-input
          v-model="mobile"
          placeholder="请输入手机号"
          size="small"
          style="width: 300px"
          :class="{ 'is-error': !/^1\d{10}$/.test(mobile) }"
        ></el-input>
        <span class="tips" v-if="!/^1\d{10}$/.test(mobile)">请输入正确的手机号码！</span>
      </div>
      <!-- 预计取餐时间/日期 -->
      <div class="item">
        <h3 v-if="curOrderType == 'self'">
          {{ isOrderOne ? '预计取餐时间' : shopDetail.orderway == 2 ? '预计取餐日期' : '' }}
        </h3>
        <h3 v-else>
          {{ isOrderOne ? '期望送达时间' : shopDetail.orderway == 2 ? '期望送达日期' : '' }}
        </h3>
        <div v-if="isOrderOne">
          <el-date-picker
            v-model="date"
            type="date"
            placeholder="选择日期"
            value-format="yyyyMMdd"
            size="small"
            style="width: 150px; margin-right: 10px"
            :picker-options="pickerOptions"
            :clearable="false"
            @change="setSelectableTimeList"
          ></el-date-picker>
          <el-popover
            ref="popover"
            popper-class="no-padding"
            placement="bottom-start"
            width="100"
            trigger="click"
          >
            <el-input
              slot="reference"
              placeholder="选择时间"
              prefix-icon="el-icon-time"
              v-model="time"
              size="small"
              style="width: 100px"
              readonly
            ></el-input>
            <ul class="timeUl">
              <li v-if="selectableTimeList.length == 0">暂无可选时间</li>
              <li
                v-for="item in selectableTimeList"
                :key="item"
                :class="{ select: time == item }"
                @click="chooseTime(item)"
              >
                {{ item }}
              </li>
            </ul>
          </el-popover>
        </div>
        <div v-if="shopDetail.orderway == 2">
          <el-date-picker
            v-model="pickupDate"
            type="date"
            placeholder="选择日期"
            value-format="yyyyMMdd"
            size="small"
            style="width: 150px; margin-right: 10px"
            :clearable="false"
            :picker-options="pickerOptions2"
            @focus="focusPickupTime"
          ></el-date-picker>
        </div>
      </div>
      <div class="item" v-if="curOrderType == 'group'">
        <h3>订餐事由</h3>
        <el-input
          type="textarea"
          v-model="reason"
          placeholder="请输入订餐事由，不超过50字"
          size="small"
          maxlength="50"
          show-word-limit
          style="width: 500px"
          resize="none"
        ></el-input>
      </div>
      <div class="item">
        <h3>菜品信息</h3>
        <el-button
          class="right-btn"
          type="primary"
          icon="el-icon-plus"
          size="small"
          @click="addFood"
        >
          添加
        </el-button>
        <!---------------------------- 表格 ---------------------------->
        <el-table :data="tableData" style="width: 100%" header-row-class-name="table-header">
          <el-table-column
            type="index"
            label="序号"
            show-overflow-tooltip
            width="80"
          ></el-table-column>
          <el-table-column prop="name" label="菜品名称" show-overflow-tooltip min-width="150">
            <template slot-scope="scope">
              <div v-if="!scope.row.type || scope.row.type !== 'new'">
                <img
                  v-if="!scope.row.photo || scope.row.photo == -1"
                  src="@/assets/img/nodata.png"
                  alt
                />
                <img v-else :src="scope.row.url" alt />
                {{ scope.row.name }}
              </div>
              <div v-else>
                <el-select
                  v-model="scope.row.id"
                  size="small"
                  style="width: 90%"
                  @focus="getFoodList"
                  @change="val => selectFood(val, scope.$index)"
                  :loading="foodLoading"
                >
                  <el-option
                    v-for="item in canSelectFoodList"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id"
                    :disabled="item.disabled"
                  ></el-option>
                </el-select>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="price" label="单价（元)" show-overflow-tooltip>
            <template slot-scope="scope">
              <span v-if="scope.row.promotionprice">
                {{ common.moneyFormat(scope.row.promotionprice) }}
                <span class="delete">{{ common.moneyFormat(scope.row.price) }}</span>
              </span>
              <span v-else>{{ common.moneyFormat(scope.row.price) }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="num" label="数量" show-overflow-tooltip min-width="180">
            <template slot-scope="scope">
              <el-input-number
                v-model="scope.row.num"
                @change="(val, old) => handleChange(val, old, scope.row)"
                :min="1"
                size="mini"
                :max="scope.row.max"
                step-strictly
                :disabled="!scope.row.name"
              ></el-input-number>
              <span class="limit" v-if="scope.row.onelimit == '1' || scope.row.alllimit == '1'">
                <span style="color: #fd7d18">{{ scope.row.limittext }}</span>
              </span>
            </template>
          </el-table-column>
          <el-table-column
            prop="totalPrice"
            label="价格（元)"
            show-overflow-tooltip
            width="150"
            class-name="total"
            :formatter="(row, column, val) => common.moneyFormat(val)"
          ></el-table-column>
          <el-table-column label="操作" align="center" width="100">
            <template slot-scope="scope">
              <span @click="deleteRow(scope.$index, scope.row)">删除</span>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
    <div class="footer" v-if="shopCart && totalNum > 0">
      共 {{ totalNum }} 份，合计：
      <span class="primary">{{ totalPrice }}元</span>
      <el-button type="primary" size="small" @click="save" :disabled="can3Submit">
        提交订单
      </el-button>
    </div>

    <!---------------------------- 新增地址 -------------------------->
    <address-drawer ref="addressDrawer" @doFunc="getAddressList"></address-drawer>

    <!---------------------------- 支付弹窗 -------------------------->
    <pay ref="payDialog"></pay>
  </div>
</template>

<script>
import { fetchOrderList, saveOrder } from '@/api/admin/order';
import { fetchAllFoodList, fetchTypeDetail } from '@/api/admin/food';
import { fetchCafeConfig } from '@/api/admin/cafe';
import { fetchAddressList, deleteAddress } from '@/api/admin/address';
import AddressDrawer from './addressDrawer';
import Pay from './pay';
export default {
  components: {
    AddressDrawer,
    Pay,
  },
  props: {
    shopid: String,
    shopname: String,
    // typeid: String
  },
  data() {
    return {
      loading: false,
      shopCartList: null,
      shopCart: null,
      shopDetail: {},
      prepare: null,
      preparetime: null,
      mobiles: null,
      sendTimes: null,
      sendTimeList: [],
      curOrderType: null,
      showTip: true,
      addressVisible: false,
      curAddressId: null,
      curAddress: { area: '', house: '' },
      addressList: [],
      addressLoadinng: false,
      mobile: localStorage.getItem('mobile'),
      reason: null,
      date: this.moment().format('YYYYMMDD'),
      pickerOptions: {
        disabledDate: time => {
          return (
            time.getTime() < this.minTime - 24 * 60 * 60 * 1000 ||
            time.getTime() > this.minTime + 6 * 24 * 60 * 60 * 1000
          );
        },
      },
      pickupDate: null,
      pickerOptions2: {},
      time: null,
      minTime: this.moment(),
      selectableTimeList: [],
      tableData: [],
      foodList: [],
      foodLoading: false,
      totalPrice: 0,
      totalNum: 0,
      d1: '$',
      d2: '|',
    };
  },
  computed: {
    // 是否订餐类
    isOrderOne() {
      return this.shopDetail.orderway == 1;
    },
    userInfo() {
      return this.$store.state.userInfo;
    },
    // 当前用户购物车列表名称
    shopCartName() {
      return 'shopCartList-' + this.$store.state.userInfo.ID;
    },
    // 订餐类型
    orderTypes() {
      let arr = [
        { id: 'group', name: '单位订餐' },
        { id: 'self', name: '个人订餐' },
      ];
      let data = this.shopDetail || {};
      let types = data.ordertype || '';
      return arr.filter(i => types.includes(i.id));
    },
    // 地址
    curAddressName() {
      let i = this.addressList.filter(j => j.id == this.curAddressId)[0];
      return i ? `${i.area}${i.house}，${i.username}（${i.userid}），${i.mobile}` : null;
    },
    // 可以选择的菜品
    canSelectFoodList() {
      let foodIds = this.tableData.map(i => i.id);
      return this.foodList.map(i => {
        i.disabled = foodIds.includes(i.id);
        return i;
      });
    },
    // 预定货品类是否能提交订单
    can3Submit() {
      let flag = this.shopDetail.fixedtime1 && this.shopDetail.fixedtime2;
      let fixedtime1, fixedtime2;
      if (flag) {
        fixedtime1 = new Date(this.shopDetail.fixedtime1).getTime();
        fixedtime2 = new Date(this.shopDetail.fixedtime2).getTime();
        let time = new Date().getTime();
        flag = fixedtime1 > time || time > fixedtime2;
      }
      return this.shopDetail.orderway == 3 && flag;
    },
  },
  watch: {
    shopCartName: {
      handler(newVal, oldVal) {
        this.initShopCart();
      },
      immediate: true,
    },
    preparetime() {
      this.setSelectableTimeList();
    },
  },
  methods: {
    focusPickupTime() {
      this.pickerOptions2 = {
        disabledDate: time => {
          let now = new Date().getTime();
          let arr = this.common.transIOS(
            this.moment().format('YYYY-MM-DD') + ' ' + this.shopDetail.fixedtime1
          );
          let fixedtime1 = arr.getTime();
          let fixedtime2 =
            (this.shopDetail.fixedtime2 && parseFloat(this.shopDetail.fixedtime2)) || 0;
          if (now < fixedtime1) {
            return (
              time.getTime() <
              now + (!fixedtime2 || fixedtime2 == '0' ? 0 : fixedtime2 - 1) * 24 * 60 * 60 * 1000
            );
          } else {
            return (
              time.getTime() <
              now + (!fixedtime2 || fixedtime2 == '0' ? 0 : fixedtime2) * 24 * 60 * 60 * 1000
            );
          }
        },
      };
    },
    clearShopCart() {
      if (this.shopCart) {
        this.tableData.splice(0, this.tableData.length);
        this.setTotalPrice();
        localStorage.setItem(this.shopCartName, JSON.stringify(this.shopCartList));
      }
    },
    // 获取餐厅的配置
    getCafeConfig() {
      let param = {
        shopid: this.shopid,
      };
      this.loading = true;
      fetchCafeConfig(param)
        .then(res => {
          this.loading = false;
          if (res.success) {
            // this.getTypeDetail();
            this.shopDetail = res.data;

            let mobiles = this.shopDetail.mobile || '';
            this.mobiles = mobiles.split(',').join('，');
            this.curOrderType = this.orderTypes[0].id;
            this.initSendTimeList();
            let uint = res.data.prepareunit;
            let time = res.data.preparetime;
            switch (uint) {
              case 'minute':
                this.preparetime = time;
                this.prepare = time + ' 分钟';
                break;
              case 'hour':
                this.preparetime = time * 60;
                this.prepare = time + ' 小时';
                break;
              case 'day':
                this.preparetime = time * 60 * 24;
                this.prepare = time + ' 天';
            }
            // 设置期望送达最早时间
            this.setMinTime();
            this.date = this.moment(this.minTime).format('YYYYMMDD');
            // 设置可选时间列表
            this.setSelectableTimeList();
          }
        })
        .catch(err => {
          this.loading = false;
        });
    },
    // 获取分类详情
    getTypeDetail() {
      fetchTypeDetail({ id: this.typeid }).then(res => {
        if (res.success) {
          let data = res.data || {};
          let uint = data.prepareunit;
          let time = data.preparetime;
          switch (uint) {
            case 'minute':
              this.preparetime = time;
              this.prepare = time + ' 分钟';
              break;
            case 'hour':
              this.preparetime = time * 60;
              this.prepare = time + ' 小时';
              break;
            case 'day':
              this.preparetime = time * 60 * 24;
              this.prepare = time + ' 天';
          }
          // 设置期望送达最早时间
          this.setMinTime();
          this.date = this.moment(this.minTime).format('YYYYMMDD');
          // 设置可选时间列表
          this.setSelectableTimeList();
        }
      });
    },
    // 配送时间
    initSendTimeList() {
      if (this.shopDetail && this.shopDetail.sendtime) {
        let list = this.shopDetail.sendtime.split(',');
        let arr = list.map(i => {
          return i.split('-');
        });
        this.sendTimeList = arr;
        if (arr.length > 0) {
          this.sendTimes = arr.map(i => i[0] + ' ~ ' + i[1]).join('，');
        }
      }
    },
    // 设置期望送达最早时间
    setMinTime() {
      // 备餐时间
      let setupTime = this.preparetime || 0;
      // 默认时间：当前时间+备餐时间
      this.minTime = this.moment().add(setupTime, 'm');
    },
    // 设置可选时间列表
    setSelectableTimeList() {
      let list = [];
      let now = this.moment().format('HH:mm');
      this.setMinTime();
      let defaultTime = this.minTime.format('HH:mm');
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
          if (this.date == this.moment(this.minTime).format('YYYYMMDD')) {
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
      if (this.date == this.moment().format('YYYYMMDD')) {
        // 当前时间如果小于11:30，并且12点可以选，则默认时间为12点
        if (now <= '11:30' && times.includes('12:00')) {
          defaultTime = '12:00';
          // 14:00 ~ 17:00，并且12点可以选，则是17:30
        } else if (now > '14:00' && now <= '17:00' && times.includes('17:30')) {
          defaultTime = '17:30';
        }
        if (times.includes(defaultTime)) {
          this.time = defaultTime;
        }
      }
      this.time = times.includes(this.time) ? this.time : times[0];
    },
    // 获取菜品列表
    getFoodList() {
      let param = {
        shopid: this.shopid,
        // shopitemtypeid: this.typeid,
        status: '1',
      };
      this.foodLoading = true;
      fetchAllFoodList(param)
        .then(res => {
          this.foodLoading = false;
          if (res.success) {
            this.foodList = res.data || [];
            this.common.setLastAndMaxNum(this.foodList);
          }
        })
        .catch(() => {
          this.foodLoading = false;
        });
    },
    // 获取地址列表
    getAddressList() {
      fetchAddressList().then(res => {
        if (res.success) {
          this.addressList = res.data || [];
          if (!this.curAddressId && this.addressList.length) {
            // this.curAddressId = this.addressList[0].id || null;
            let obj =
              this.addressList.find(
                a =>
                  a.area &&
                  a.house &&
                  a.area === this.curAddress.area &&
                  a.house === this.curAddress.house
              ) || {};
            this.curAddressId = obj.id || localStorage.getItem(this.userInfo.ID + 'CurAddressId');
          }
        }
      });
    },
    // 新增编辑地址
    openDrawer(type, item) {
      let drawer = this.$refs.addressDrawer;
      if (type == 'add') {
        drawer.title = `新增地址`;
        drawer.editForm.userid = this.userInfo.ID;
        drawer.editForm.username = this.userInfo.NAME;
        drawer.editForm.user = `${this.userInfo.NAME}（${this.userInfo.ID}）`;
      } else {
        drawer.title = `编辑地址`;
        drawer.editForm = item;
        drawer.editForm.user = `${item.username}（${item.userid}）`;
      }
      drawer.drawer = true;
    },
    // 删除地址
    deleteAddress(item) {
      this.$confirm(`删除内容无法找回，确定要删除吗？`, '确定要删除这条地址吗', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(() => {
          this.addressLoadinng = true;
          let data = {
            id: item.id,
          };
          deleteAddress(data)
            .then(res => {
              this.addressLoadinng = false;
              if (res.success) {
                this.$message({
                  showClose: true,
                  type: 'success',
                  message: `删除成功！`,
                });
                if (item.id == this.curAddressId) {
                  this.curAddressId = null;
                }
                this.getAddressList();
              } else {
                this.$message({
                  showClose: true,
                  type: 'error',
                  message: `删除失败：${res.data.message}`,
                });
              }
            })
            .catch(err => {
              this.addressLoadinng = false;
              this.$message({
                showClose: true,
                type: 'error',
                message: `删除失败：${err}`,
              });
            });
        })
        .catch(() => {
          return;
        });
    },
    // 选择时间
    chooseTime(time) {
      this.time = time;
      this.$refs.popover.showPopper = false;
    },

    // 总计
    setTotalPrice() {
      let priceList = this.tableData.map(i => i.totalPrice);
      this.totalPrice = priceList.reduce((sum, num) => {
        return this.common.add(sum, num);
      }, 0);
      let numList = this.tableData.filter(i => i.name).map(i => i.num);
      this.totalNum = numList.reduce((sum, num) => {
        return this.common.add(sum, num);
      }, 0);
    },

    // 改变数量
    async handleChange(newVal, oldVal, row) {
      // 如果限制每人预定数量
      if (row.onelimit == '1' && newVal > oldVal) {
        // 获取当前登录人已购买量
        let perLimit = await this.common.fetchItemBuyNum(row);
        if (perLimit <= 0 || newVal > perLimit) {
          this.$message({
            showClose: true,
            type: 'error',
            message: `每人最多预订${row.onelimitnum}份!`,
          });
          row.num = oldVal;
          return;
        }
      }
      if (!newVal) {
        newVal = 0;
        row.num = 0;
      }
      this.$nextTick(() => {
        let price = row.promotionprice ? row.promotionprice : row.price;
        row.totalPrice = this.common.multiply(price, row.num, 2);
        this.setTotalPrice();
        localStorage.setItem(this.shopCartName, JSON.stringify(this.shopCartList));
      });
    },
    // 删除
    deleteRow(index, row) {
      this.tableData.splice(index, 1);
      if (row.name) {
        this.setTotalPrice();
      }
      localStorage.setItem(this.shopCartName, JSON.stringify(this.shopCartList));
    },
    // 添加菜品
    addFood() {
      let obj = {
        num: 1,
        type: 'new',
      };
      this.tableData.push(obj);
    },
    // 选择菜品
    async selectFood(foodid, index) {
      let food = this.foodList.filter(i => i.id == foodid)[0];
      let price = food.promotionprice ? food.promotionprice : food.price;
      let obj = Object.assign({}, food);
      obj.num = 1;
      obj.type = 'new';
      obj.totalPrice = price;
      // 如果剩余数量为0
      if (food.lastnum == 0) {
        this.$message({
          showClose: true,
          type: 'error',
          message: `菜品余量0份!`,
        });
        obj = {
          num: 1,
          type: 'new',
        };
      }
      // 如果限制每人预定数量
      if (food.onelimit == '1') {
        // 获取当前登录人已购买量
        let perLimit = await this.common.fetchItemBuyNum(food);
        if (perLimit <= 0) {
          this.$message({
            showClose: true,
            type: 'error',
            message: `每人最多预订${food.onelimitnum}份!`,
          });
          obj = {
            num: 1,
            type: 'new',
          };
        }
      }
      this.$set(this.tableData, index, obj);
      this.setTotalPrice();
      localStorage.setItem(this.shopCartName, JSON.stringify(this.shopCartList));
    },
    // 提交订单
    save() {
      if (this.curOrderType == 'group' && !this.curAddressName) {
        this.$message({
          showClose: true,
          type: 'error',
          message: '请选择地址！',
        });
        return;
      }
      let msg = this.curOrderType == 'group' ? '期望送达时间' : '预计取餐时间';
      if ((!this.date || !this.time) && this.isOrderOne) {
        this.$message({
          showClose: true,
          type: 'error',
          message: `请选择${msg}！`,
        });
        return;
      }
      if (!this.pickupDate && this.shopDetail.orderway == 2) {
        this.$message({
          showClose: true,
          type: 'error',
          message: `请选择日期！`,
        });
        return;
      }
      // 重新设置最小时间
      this.setMinTime();
      if (
        this.isOrderOne &&
        (this.date < this.moment(this.minTime).format('YYYYMMDD') ||
          !this.selectableTimeList.includes(this.time) ||
          (this.date == this.moment(this.minTime).format('YYYYMMDD') &&
            this.time < this.minTime.format('HH:mm')))
      ) {
        this.$message({
          showClose: true,
          type: 'error',
          message: `${msg}已过期，请重新选择${msg}！`,
        });
        return;
      }
      if (this.curOrderType == 'self' && (!this.mobile || !/^1\d{10}$/.test(this.mobile))) {
        this.$message({
          showClose: true,
          type: 'error',
          message: '请输入正确的手机号！',
        });
        return;
      }
      if (this.totalNum == 0) {
        this.$message({
          showClose: true,
          type: 'error',
          message: '请添加菜品！',
        });
        return;
      }
      // 计算送达时间距离现在的时间差
      let sendDateTime = this.moment(this.date + ' ' + this.time, 'YYYYMMDD HH:mm');
      let now = this.moment();
      let diff = sendDateTime.diff(now, 'hour', true);
      let maxitems = this.shopDetail.maxitems || 15;
      let timeinfo = this.shopDetail.timeinfo || 5;
      if (this.totalNum >= maxitems && diff <= timeinfo) {
        const h = this.$createElement;
        this.$msgbox({
          title: '确定提交订单吗',
          message: h('p', null, [
            '您的订单数量过多，可能无法在指定时间配送到，可拨打 ',
            h('span', { style: 'color:#3A78FC' }, this.shopDetail.mobile),
            ' 联系餐厅确认~',
          ]),
          confirmButtonText: '确定提交',
          showCancelButton: true,
          cancelButtonText: '取消',
          type: 'warning',
        })
          .then(() => {
            this.doSave();
          })
          .catch(() => {
            return;
          });
      } else {
        this.doSave();
      }
    },
    // 最终提交
    doSave() {
      this.loading = true;
      let curAddress =
        this.curOrderType == 'group'
          ? this.addressList.filter(i => i.id == this.curAddressId)[0]
          : {};
      let items = this.shopCart.list
        .filter(i => i.name)
        .map(i => {
          return {
            itemid: i.id,
            itemname: i.name,
            itemnum: i.num,
            price: i.price,
            promotionprice: i.promotionprice,
          };
        });
      // 计算总价格
      let priceList = items.map(i => {
        let price = i.promotionprice ? i.promotionprice : i.price;
        return this.common.multiply(price, i.itemnum, 2);
      });
      let totalfee = priceList.reduce((sum, num) => {
        return this.common.add(sum, num);
      }, 0);
      let mobile = this.curOrderType == 'group' ? curAddress.mobile || null : this.mobile;
      let pickupDate3;
      if (this.shopDetail.orderway == 3) {
        let str = this.common.pickupTimeText(this.shopDetail);
        let arr = str && str !== '--' ? str.split('~') : [];
        pickupDate3 = arr[0] && arr[0].replace(/[.\s]/g, '');
      }
      let senddate = this.isOrderOne
        ? this.date
        : this.shopDetail.orderway == 2
        ? this.pickupDate
        : pickupDate3;
      let sendtime = this.isOrderOne ? this.time : undefined;
      let data = {
        area: curAddress.area || null,
        house: curAddress.house || null,
        mobile,
        id: null,
        items: items,
        ordertype: this.curOrderType,
        senddate,
        sendtime,
        shopid: this.shopid,
        shopname: this.shopCart.shopname,
        shopitemtypeid: this.typeid,
        totalfee: totalfee,
        reason: this.reason,
      };
      saveOrder(data)
        .then(res => {
          this.loading = false;
          if (res.success) {
            localStorage.setItem('mobile', mobile);
            this.shopCart.list = [];
            localStorage.setItem(this.shopCartName, JSON.stringify(this.shopCartList));
            // 单位订餐直接提交成功
            if (this.curOrderType == 'group') {
              localStorage.setItem(this.userInfo.ID + 'CurAddressId', this.curAddressId);
              this.$confirm('您的订餐已成功提交！', '提交成功', {
                confirmButtonText: '查看订单',
                cancelButtonText: '继续订餐',
                type: 'success',
              })
                .then(() => {
                  this.$router.push(`/record/view/${res.data}`);
                })
                .catch(() => {
                  this.$router.push('/order');
                });
            } else {
              // 个人订餐需要支付
              let msg = '';
              if (this.isOrderOne) {
                msg = `您的订餐已成功提交！请于${
                  this.date ? this.moment(this.date, 'YYYYMMDD').format('YYYY-MM-DD') : '规定日期'
                } ${this.time || ''}前到${this.shopCart.shopname}取餐~`;
              } else {
                msg = `您的订餐已成功提交！取餐日期内${this.common.pickupTimeText(
                  this.shopDetail
                )}，地点：${this.shopCart.shopname}~`;
              }
              let dialog = this.$refs.payDialog;
              dialog.id = res.data;
              dialog.totalfee = totalfee;
              dialog.msg = msg;
              dialog.dialogVisible = true;
            }
          } else {
            this.$message({
              showClose: true,
              type: 'error',
              message: `提交失败：${res.data.message}`,
            });
          }
        })
        .catch(err => {
          this.loading = false;
          this.$message({
            showClose: true,
            type: 'error',
            message: `提交失败：${err}`,
          });
        });
    },
    // 初始化购物车
    initShopCart() {
      let data = localStorage.getItem(this.shopCartName);
      this.shopCartList = data ? JSON.parse(data) : [];
      // this.shopCart = this.shopCartList.filter(i => i.typeid == this.typeid)[0];
      this.shopCart = this.shopCartList.filter(i => i.shopid == this.shopid)[0];
      if (this.shopCart) {
        this.shopCart.list = this.shopCart.list.filter(i => i.name);
        this.tableData = this.shopCart.list;
        this.tableData.forEach(i => {
          i.url = i.photo ? window.g.viewUrl + i.photo : '@/assets/img/nodata.png';
          let price = i.promotionprice ? i.promotionprice : i.price;
          i.totalPrice = this.common.multiply(price, i.num, 2);
        });
        this.setTotalPrice();
      } else {
        this.shopCart = {
          shopid: this.shopid,
          shopname: this.shopname,
          list: [],
        };
        this.tableData = this.shopCart.list;
        this.shopCartList.push(this.shopCart);
      }
    },
    getAddress() {
      let param = {
        filter: {
          // id: this.keyword || null,
          createrid: 'myself',
          ordertype: 'group',
        },
        limit: 1,
        page: 1,
      };
      fetchOrderList(param).then(res => {
        if (res && res.success) {
          this.curAddress.area = (res.data && res.data.length && res.data[0].area) || '';
          this.curAddress.house = (res.data && res.data.length && res.data[0].house) || '';
        }
        this.getAddressList();
      });
    },
  },
  created() {
    this.getCafeConfig();
    this.getAddress();
    this.getFoodList();
  },
};
</script>

<style lang="scss" scoped>
.base-search-table {
  position: relative;
  height: 100%;
  overflow: hidden;
}
.search-box {
  width: 100%;
  border-bottom: 1px solid #d8d8d8;
  font-size: 16px;
  font-weight: 600;
  color: #373b4b;
  line-height: 22px;
  i {
    font-size: 14px;
    font-weight: 400;
    color: #3f86f7;
    cursor: pointer;
    margin-right: 5px;
  }
}
.search-box-right {
  i {
    color: #999999;
  }
}
.timeUl {
  height: 200px;
  overflow-y: auto;
  li {
    padding: 8px 10px;
    font-size: 14px;
    line-height: 20px;
    cursor: pointer;
    &:hover {
      background-color: #f5f7fa;
      font-weight: 700;
    }
    &.select {
      color: #409eff;
      font-weight: 700;
    }
  }
}
.detail {
  height: calc(100% - 100px);
  overflow-y: auto;
  padding: 20px 20px 50px;
  .item {
    position: relative;
    margin-bottom: 20px;
    h3 {
      font-size: 16px;
      font-weight: 600;
      color: #373b4b;
      line-height: 22px;
      margin-bottom: 10px;
    }
    .right-btn {
      position: absolute;
      right: 0;
      top: -5px;
    }
    span {
      color: rgba(0, 0, 0, 0.65);
      margin-right: 10px;
    }
    .tips {
      margin-left: 10px;
      font-size: 12px;
      color: #f56c6c;
    }
    p {
      font-size: 14px;
      color: rgba(0, 0, 0, 0.65);
      line-height: 22px;
      margin-bottom: 10px;
    }
    .type {
      display: inline-block;
      background: #ffffff;
      border-radius: 5px;
      border: 1px dashed rgba(0, 0, 0, 0.15);
      color: #999999;
      line-height: 22px;
      padding: 5px 20px;
      margin-right: 14px;
      margin-bottom: 0;
      cursor: pointer;
      &:hover {
        background: #f5f8ff;
      }
      &.select {
        color: #3a78fc;
        background: #f5f8ff;
        border-radius: 5px;
        border: 1px solid #9dbcfe;
      }
    }
    .btn {
      color: #3a78fc;
      cursor: pointer;
    }
  }
}
.el-radio-group {
  width: 100%;
}
.el-radio {
  margin-right: 0 !important;
  margin-bottom: 8px;
  .area {
    display: inline-block;
    color: #474d51;
    font-weight: 400;
    line-height: 22px;
    margin-bottom: 5px;
    white-space: normal;
    i {
      color: #999999;
      margin-left: 10px;
      cursor: pointer;
    }
  }
  .area-note {
    font-weight: 400;
    display: block;
    color: #999999;
    line-height: 22px;
    padding-left: 24px;
    white-space: normal;
  }
}
.el-table {
  img {
    height: 45px;
    width: auto;
    vertical-align: middle;
    margin-right: 10px;
  }
  .limit {
    float: right;
    line-height: 28px;
  }
}
.footer {
  z-index: 2;
  width: 100%;
  padding: 16px 20px;
  position: absolute;
  bottom: 0;
  text-align: right;
  background: #ffffff;
  box-shadow: 0px -3px 6px -4px rgba(0, 0, 0, 0.12), 0px -6px 16px 0px rgba(0, 0, 0, 0.08),
    0px -9px 28px 8px rgba(0, 0, 0, 0.05);
  .primary {
    color: #3a78fc;
    font-size: 16px;
    font-weight: 600;
    margin-right: 20px;
  }
}
.el-popover {
  .el-icon-close {
    position: absolute;
    right: 15px;
    top: 15px;
    cursor: pointer;
  }
}

.delete {
  text-decoration: line-through;
  color: #999999 !important;
  font-weight: 400;
}
</style>
