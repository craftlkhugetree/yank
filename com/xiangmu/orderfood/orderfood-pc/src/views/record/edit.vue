<template>
  <div class="base-search-table" v-loading="loading">
    <div class="search-box clearfix" style="padding: 15px 20px 10px">
      <i class="el-icon-arrow-left" @click="$router.go(-1)">返回</i>
      <el-divider direction="vertical"></el-divider>
      订单 {{ tid }}
      <span
        :class="{
          'blue-tag': detail.orderstatus == '3',
          'orange-tag': ['0', '1', '2'].includes(detail.orderstatus),
          'gray-tag': detail.orderstatus == '4',
        }"
        style="margin-left: 10px"
      >
        {{ common.statusFormat(detail.orderstatus, detail.ordertype) }}
      </span>
    </div>
    <div class="detail">
      <div class="item">
        <h3>{{ detail.shopname }}</h3>
        <p v-if="detail.ordertype == 'group' && isOrderOne">
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
      <div class="item">
        <h3>订餐类型</h3>
        <span class="type select">{{ detail.ordertype == 'group' ? '单位订餐' : '个人订餐' }}</span>
        <div v-if="showTip" class="type-tips">
          <i class="el-icon-warning"></i>
          {{
            detail.ordertype == 'group'
              ? '送餐上门后请扫码收餐，并及时结算订单。'
              : '需自行去往餐厅取餐。'
          }}
          <i class="el-icon-close" @click="showTip = false"></i>
        </div>
      </div>
      <div class="item" v-if="detail.ordertype == 'group'">
        <h3>选择配送地址</h3>
        <span>{{ detail.addressName }}</span>
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
            <el-radio-group v-model="curAddressId" @change="selectAddress">
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
          v-model="detail.mobile"
          placeholder="请输入手机号"
          size="small"
          style="width: 300px"
          :class="{ 'is-error': !/^1\d{10}$/.test(detail.mobile) }"
        ></el-input>
        <span class="tips" v-if="!/^1\d{10}$/.test(detail.mobile)">请输入正确的手机号码！</span>
      </div>

      <!-- 预计取餐时间/日期 -->
      <div class="item">
        <h3 v-if="detail.ordertype == 'self'">
          {{ isOrderOne ? '预计取餐时间' : shopDetail.orderway == 2 ? '预计取餐日期' : '' }}
        </h3>
        <h3 v-else>
          {{ isOrderOne ? '期望送达时间' : shopDetail.orderway == 2 ? '期望送达日期' : '' }}
        </h3>
        <div v-if="isOrderOne">
          <el-date-picker
            v-model="detail.senddate"
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
              v-model="detail.sendtime"
              size="small"
              style="width: 100px"
              readonly
            ></el-input>
            <ul class="timeUl">
              <li v-if="selectableTimeList.length == 0">暂无可选时间</li>
              <li
                v-for="item in selectableTimeList"
                :key="item"
                :class="{ select: detail.sendtime == item }"
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

      <div class="item" v-if="detail.ordertype == 'group'">
        <h3>订餐事由</h3>
        <el-input
          type="textarea"
          v-model="detail.reason"
          placeholder="请输入订餐事由，不超过50字"
          size="small"
          maxlength="50"
          show-word-limit
          resize="none"
          style="width: 500px"
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
          <el-table-column prop="itemname" label="菜品名称" show-overflow-tooltip min-width="150">
            <template slot-scope="scope">
              <div v-if="!scope.row.type || scope.row.type !== 'new'">
                <img
                  v-if="!scope.row.photo || scope.row.photo == -1"
                  src="@/assets/img/nodata.png"
                  alt
                />
                <img v-else :src="scope.row.url" alt />
                {{ scope.row.itemname }}
              </div>
              <div v-else>
                <el-select
                  v-model="scope.row.itemid"
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
          <el-table-column prop="itemnum" label="数量" show-overflow-tooltip min-width="180">
            <template slot-scope="scope">
              <el-input-number
                v-model="scope.row.itemnum"
                @change="(val, old) => handleChange(val, old, scope.row)"
                :min="1"
                size="mini"
                :max="scope.row.max"
                step-strictly
                :disabled="!scope.row.itemname"
              ></el-input-number>
              <!-- <span class="limit" v-if="scope.row.onelimit=='1' || scope.row.alllimit == '1'">
                <span style="color:#fd7d18;">{{scope.row.limittext}}</span>
              </span> -->
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
    <div class="footer" v-if="tableData.length > 0">
      共 {{ detail.totalnum }} 份，合计：
      <span class="primary">{{ detail.totalfee }}元</span>
      <el-button type="primary" size="small" @click="save">提交订单</el-button>
    </div>

    <!---------------------------- 新增地址 -------------------------->
    <address-drawer ref="addressDrawer" @doFunc="getAddressList"></address-drawer>
  </div>
</template>

<script>
import { fetchOrderDetail, saveOrder } from '@/api/admin/order';
import { fetchAllFoodList, fetchTypeDetail } from '@/api/admin/food';
import { fetchCafeConfig } from '@/api/admin/cafe';
import { fetchAddressList, deleteAddress } from '@/api/admin/address';
import AddressDrawer from '../order/addressDrawer';
export default {
  components: {
    AddressDrawer,
  },
  props: {
    id: String,
  },
  data() {
    return {
      loading: false,
      detail: {}, // 订单详情
      shopid: null,
      typeid: null,
      shopDetail: {},
      showTip: true,
      prepare: null,
      preparetime: null,
      mobiles: null,
      sendTimes: null,
      sendTimeList: [],
      addressVisible: false,
      curAddressId: null,
      addressList: [],
      addressLoadinng: false,
      pickerOptions: {
        disabledDate: time => {
          return (
            time.getTime() < this.minTime - 24 * 60 * 60 * 1000 ||
            time.getTime() > this.minTime + 6 * 24 * 60 * 60 * 1000
          );
        },
      },
      selectableTimeList: [],
      tableData: [],
      initTableData: [],
      foodList: [],
      minTime: this.moment(),
      pickupDate: null,
      pickerOptions2: {},
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
    tid() {
      let l = this.id.toString().length;
      return 'T' + Array(9 - l).join('0') + this.id;
    },
    // 可以选择的菜品
    canSelectFoodList() {
      let foodIds = this.tableData.map(i => i.itemid);
      return this.foodList.map(i => {
        i.disabled = foodIds.includes(i.id);
        return i;
      });
    },
  },
  methods: {
    focusPickupTime() {
      this.pickerOptions2 = {
        disabledDate: time => {
          let now = new Date().getTime();
          // let fixedtime1 = new Date(
          //   this.moment().format('YYYY-MM-DD') + ' ' + this.shopDetail.fixedtime1
          // ).getTime();
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
    // 获取详情
    getDetail() {
      this.loading = true;
      let param = {
        id: this.id,
      };
      fetchOrderDetail(param)
        .then(res => {
          this.loading = false;
          if (res.success) {
            let data = res.data || {};
            this.shopid = data.shopid;
            this.typeid = data.shopitemtypeid;
            this.detail = data;
            this.tableData = data.items;
            let totalnum = 0;
            this.tableData.forEach(i => {
              i.initnum = i.itemnum;
              i.url = i.photo ? window.g.viewUrl + i.photo : '@/assets/img/nodata.png';
              let price = i.promotionprice ? i.promotionprice : i.price;
              i.totalPrice = this.common.multiply(price, i.itemnum, 2);
              totalnum += i.itemnum;
            });
            this.common.setLastAndMaxNum(this.tableData);
            this.tableData.forEach(i => {
              i.max = i.max + i.initnum;
            });
            this.detail.totalnum = totalnum;
            this.$set(
              this.detail,
              'addressName',
              `${data.creatername}（${data.createrid}）${data.mobile}，${data.area}${data.house}`
            );
            this.initTableData = [...this.tableData];
            // this.getTypeDetail();
            this.pickupDate = data.senddate;
            this.getCafeConfig();
            this.getFoodList();
            this.getAddressList();
          }
        })
        .catch(err => {
          this.loading = false;
        });
    },
    // 获取分类详情
    getTypeDetail() {
      this.loading = true;
      fetchTypeDetail({ id: this.typeid })
        .then(res => {
          this.loading = false;
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
            this.getCafeConfig();
            // this.date = this.moment(this.minTime).format("YYYYMMDD");
          }
        })
        .catch(err => {
          this.loading = false;
        });
    },
    // 获取菜品列表
    getFoodList() {
      let param = {
        shopid: this.shopid,
        shopitemtypeid: this.typeid,
        status: '1',
      };
      this.foodLoading = true;
      fetchAllFoodList(param)
        .then(res => {
          this.foodLoading = false;
          if (res.success) {
            this.foodList = res.data || [];
            this.common.setLastAndMaxNum(this.foodList);
            // this.tableData.forEach(i => {
            //   let index = this.foodList.findIndex(j => j.id == i.itemid);
            //   if (index > -1) {
            //     let data = this.foodList[index];
            //     i.onelimit = data.onelimit;
            //     i.alllimit = data.alllimit;
            //     i.limittext = data.limittext;
            //     i.max = data.max;
            //     i.onelimitnum = data.onelimitnum;
            //     i.alllimitnum = data.alllimitnum;
            //   }
            // })
          }
        })
        .catch(err => {
          this.foodLoading = false;
        });
    },
    // 获取地址列表
    getAddressList() {
      fetchAddressList().then(res => {
        if (res.success) {
          this.addressList = res.data || [];
          this.addressList.forEach(i => {
            i.title = `${i.username}（${i.userid}）${i.mobile}，${i.area}${i.house}`;
          });
          let curAddress = this.addressList.filter(i => i.title == this.detail.addressName)[0];
          this.curAddressId = curAddress ? curAddress.id : null;
        }
      });
    },
    // 选择地址
    selectAddress(val) {
      let address = this.addressList.filter(i => i.id == val)[0];
      this.detail.area = address.area;
      this.detail.house = address.house;
      this.detail.mobile = address.mobile;
      this.detail.addressName = address.title;
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
            this.shopDetail = res.data;
            let mobiles = this.shopDetail.mobile || '';
            this.mobiles = mobiles.split(',').join('，');
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
            this.initSendTimeList();
          }
        })
        .catch(err => {
          this.loading = false;
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
        // 设置可选时间列表
        this.setSelectableTimeList();
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
          if (this.detail.senddate == this.moment(this.minTime).format('YYYYMMDD')) {
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
      if (!list.includes(this.detail.sendtime)) {
        this.detail.sendtime = null;
      }
    },
    // 选择时间
    chooseTime(time) {
      this.detail.sendtime = time;
      this.$refs.popover.showPopper = false;
    },
    // 计算合计
    setTotalFee() {
      let priceList = this.tableData.map(i => i.totalPrice);
      this.detail.totalfee = priceList.reduce((sum, num) => {
        return this.common.add(sum, num);
      }, 0);

      let numList = this.tableData.filter(i => i.itemname).map(i => i.itemnum);
      this.detail.totalnum = numList.reduce((sum, num) => {
        return this.common.add(sum, num);
      }, 0);
    },
    // 改变数量
    async handleChange(newVal, oldVal, row) {
      // 如果限制每人预定数量
      if (row.onelimit == '1' && newVal > oldVal) {
        // 获取当前登录人已购买量
        let food = Object.assign({}, row);
        food.id = row.itemid;
        let initnum = row.initnum || 0;
        let perLimit = (await this.common.fetchItemBuyNum(food)) + initnum;
        if (perLimit <= 0 || newVal > perLimit) {
          this.$message({
            showClose: true,
            type: 'error',
            message: `每人最多预订${row.onelimitnum}份!`,
          });
          row.itemnum = oldVal;
          return;
        }
      }
      if (!newVal) {
        newVal = 0;
        row.itemnum = 0;
      }
      this.$nextTick(() => {
        let price = row.promotionprice ? row.promotionprice : row.price;
        row.totalPrice = this.common.multiply(price, row.itemnum, 2);
        this.setTotalFee();
      });
    },
    // 删除
    deleteRow(index, row) {
      this.tableData.splice(index, 1);
      if (row.itemname) {
        this.setTotalFee();
      }
    },
    // 添加菜品
    addFood() {
      let obj = {
        itemnum: 1,
        type: 'new',
      };
      this.tableData.push(obj);
    },
    // 选择菜品
    async selectFood(foodid, index) {
      let food = this.foodList.filter(i => i.id == foodid)[0];
      let price = food.promotionprice ? food.promotionprice : food.price;
      let obj = {
        itemid: food.id,
        itemname: food.name,
        itemnum: 1,
        price: food.price,
        promotionprice: food.promotionprice,
        type: 'new',
        totalPrice: price,
        alllimit: food.alllimit,
        alllimitnum: food.alllimitnum,
        allbuynum: food.allbuynum,
        onelimit: food.onelimit,
        onelimitnum: food.onelimitnum,
        max: food.max,
        lastnum: food.lastnum,
        limittext: food.limittext,
      };
      // 判断是否初始的菜品
      let initIndex = this.initTableData.findIndex(i => i.itemid == foodid);
      if (initIndex > -1) {
        let data = this.initTableData[initIndex];
        obj.max = data.max;
        obj.initnum = data.initnum;
      }
      // 如果剩余数量为0
      if (food.lastnum == 0 && obj.max == 0) {
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
        let initnum = obj.initnum || 0;
        let perLimit = (await this.common.fetchItemBuyNum(food)) + initnum;
        if (perLimit <= 0) {
          this.$message({
            showClose: true,
            type: 'error',
            message: `每人最多预订${food.onelimitnum}份!`,
          });
          obj = {
            itemnum: 1,
            type: 'new',
          };
        }
      }
      this.$set(this.tableData, index, obj);
      this.setTotalFee();
    },
    // 提交订单
    save() {
      let msg = this.detail.ordertype == 'group' ? '期望送达时间' : '预计取餐时间';
      if ((!this.detail.senddate || !this.detail.sendtime) && this.isOrderOne) {
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
        (this.detail.senddate < this.moment(this.minTime).format('YYYYMMDD') ||
          !this.selectableTimeList.includes(this.detail.sendtime) ||
          (this.detail.senddate == this.moment(this.minTime).format('YYYYMMDD') &&
            this.detail.sendtime < this.minTime.format('HH:mm')))
      ) {
        this.$message({
          showClose: true,
          type: 'error',
          message: `${msg}已过期，请重新选择${msg}！`,
        });
        return;
      }
      if (
        this.detail.ordertype == 'self' &&
        (!this.detail.mobile || !/^1\d{10}$/.test(this.detail.mobile))
      ) {
        this.$message({
          showClose: true,
          type: 'error',
          message: '请输入正确的手机号！',
        });
        return;
      }
      if (this.isOrderOne && this.detail.senddate < this.moment().format('YYYYMMDD')) {
        this.$message({
          showClose: true,
          type: 'error',
          message: '请重新选择时间！',
        });
        return;
      }
      if (this.detail.totalnum == 0) {
        this.$message({
          showClose: true,
          type: 'error',
          message: '请添加菜品！',
        });
        return;
      }
      // 计算送达时间距离现在的时间差
      let sendDateTime = this.moment(
        this.detail.senddate + ' ' + this.detail.sendtime,
        'YYYYMMDD HH:mm'
      );
      let now = this.moment();
      let diff = sendDateTime.diff(now, 'hour', true);
      let maxitems = this.shopDetail.maxitems || 15;
      let timeinfo = this.shopDetail.timeinfo || 5;
      if (this.detail.totalnum >= maxitems && diff <= timeinfo) {
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
    doSave() {
      fetchOrderDetail({ id: this.id }).then(res => {
        if (res.success) {
          let data = res.data || {};
          let orderstatus = res.data.orderstatus;
          let ordertype = res.data.ordertype;
          // 只有在待确认的时候才能提交
          if (orderstatus == '1') {
            this.loading = true;
            let obj = this.detail;
            let items = this.tableData
              .filter(i => i.itemname)
              .map(i => {
                return {
                  itemid: i.itemid,
                  itemname: i.itemname,
                  itemnum: i.itemnum,
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
            let pickupDate3;
            if (this.shopDetail.orderway == 3) {
              let str = this.common.pickupTimeText(this.shopDetail);
              let arr = str && str !== '--' ? str.split('~') : [];
              pickupDate3 = arr[0] && arr[0].replace(/[.\s]/g, '');
            }
            let senddate = this.isOrderOne
              ? obj.senddate
              : this.shopDetail.orderway == 2
              ? this.pickupDate
              : pickupDate3;
            let sendtime = this.isOrderOne ? obj.sendtime : undefined;
            let data = {
              id: obj.id,
              area: obj.area,
              house: obj.house,
              mobile: obj.mobile,
              items: items,
              ordertype: obj.ordertype,
              senddate,
              sendtime,
              shopid: obj.shopid,
              shopname: obj.shopname,
              shopitemtypeid: this.typeid,
              totalfee: totalfee,
              reason: obj.reason,
            };
            saveOrder(data)
              .then(res => {
                this.loading = false;
                if (res.success) {
                  let msg = '';
                  if (obj.ordertype == 'group') {
                    msg = '您的订餐已成功提交！';
                  } else {
                    if (this.isOrderOne) {
                      msg = `您的订餐已成功提交！请于${
                        obj.senddate
                          ? this.moment(obj.senddate, 'YYYYMMDD').format('YYYY-MM-DD')
                          : '规定时间'
                      } ${obj.sendtime || ''}前到
                        ${obj.shopname}取餐~`;
                    } else {
                      msg = `您的订餐已成功提交！取餐日期内${this.common.pickupTimeText(
                        this.shopDetail
                      )}，地点：${obj.shopname}~`;
                    }
                  }
                  this.$confirm(msg, '提交成功', {
                    confirmButtonText: '查看订单',
                    cancelButtonText: '订餐记录',
                    type: 'success',
                  })
                    .then(() => {
                      this.$router.push(`/record/view/${obj.id}`);
                    })
                    .catch(() => {
                      this.$router.push('/record');
                    });
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
          } else {
            let msg = null;
            switch (orderstatus) {
              case '2':
                msg = ordertype == 'group' ? '订单正在配送中' : '订单正在等待取餐';
                break;
              case '3':
                msg = ordertype == 'group' ? '订单已送达' : '订单已取餐';
                break;
              case '4':
                msg = '订单已取消';
                break;
            }
            this.$message({
              showClose: true,
              type: 'error',
              message: `${msg}，无法修改！`,
            });
            return;
          }
        }
      });
    },
  },
  created() {
    this.getDetail();
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
.el-radio {
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