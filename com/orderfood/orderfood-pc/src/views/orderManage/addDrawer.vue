<template>
  <el-drawer
    class="base-drawer"
    :title="title"
    :visible.sync="drawer"
    direction="rtl"
    :wrapperClosable="false"
    @open="openDrawer"
    @close="closeDrawer"
    v-loading="drawerLoading"
    size="700px"
  >
    <div class="drawer-container">
      <div class="item">
        <h3>配送信息</h3>
        <el-form
          ref="editForm"
          :model="editForm"
          style="padding:0 30px;"
          label-width="100px"
          label-position="right"
          :rules="rules"
        >
          <el-form-item label="订餐人：" prop="creater">
            <el-select
              v-model="editForm.creater"
              filterable
              remote
              placeholder="请输入姓名或工号"
              :remote-method="remoteMethod"
              :loading="userloading"
              @change="changeUser"
              size="small"
              style="width:300px;"
            >
              <el-option
                v-for="item in userList"
                :key="item.ID"
                :label="item.NAME"
                :value="JSON.stringify({ID:item.ID,NAME:item.NAME})"
              >
                <span>{{item.NAME + '--' + item.ID}}</span>
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="联系手机：" prop="mobile">
            <el-input v-model="editForm.mobile" placeholder="请输入" size="small" style="width:300px;"></el-input>
          </el-form-item>
          <el-form-item label="配送地址：" prop="area">
            <el-select
              v-model="editForm.area"
              filterable
              remote
              placeholder="请输入楼宇名称查询"
              :remote-method="remoteMethodArea"
              :loading="arealoading"
              style="width:300px;"
              size="small"
            >
              <el-option
                v-for="item in areaList"
                :key="item.id"
                :label="item.name"
                :value="item.name"
              ></el-option>
            </el-select>
            <i class="el-icon-search select-search"></i>
          </el-form-item>
          <el-form-item prop="house">
            <el-input
              v-model="editForm.house"
              placeholder="请输入具体的门牌号"
              size="small"
              style="width:300px;"
            ></el-input>
          </el-form-item>
          <el-row style="width:400px;">
            <el-col :span="16">
              <el-form-item prop="senddate" label="送达时间：">
                <el-date-picker
                  v-model="editForm.senddate"
                  type="date"
                  placeholder="选择日期"
                  value-format="yyyyMMdd"
                  size="small"
                  style="width:180px;margin-right:10px;"
                  :picker-options="pickerOptions"
                  :clearable="false"
                  @change="setSelectableTimeList"
                ></el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item style="margin-left:-80px;" prop="sendtime">
                <el-popover
                  ref="popover"
                  popper-class="no-padding"
                  placement="bottom-start"
                  width="120"
                  trigger="click"
                >
                  <el-input
                    slot="reference"
                    placeholder="选择时间"
                    prefix-icon="el-icon-time"
                    v-model="editForm.sendtime"
                    size="small"
                    style="width:115px;"
                    readonly
                  ></el-input>
                  <ul class="timeUl">
                    <li
                      v-for="item in selectableTimeList"
                      :key="item"
                      :class="{'select': editForm.sendtime == item}"
                      @click="chooseTime(item)"
                    >{{item}}</li>
                  </ul>
                </el-popover>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </div>
      <div class="item base-search-table">
        <h3>菜品信息</h3>
        <!-- <el-select
          class="right-btn"
          v-model="typeid"
          placeholder="请选择菜品分类"
          size="small"
          style="width:200px;right:100px;"
        >
          <el-option v-for="item in typeList" :key="item.id" :label="item.name" :value="item.id"></el-option>
        </el-select>-->
        <el-button
          class="right-btn"
          type="primary"
          icon="el-icon-plus"
          size="small"
          @click="addFood"
        >添加</el-button>
        <!---------------------------- 表格 ---------------------------->
        <el-table
          :data="tableData"
          style="width:100%"
          header-row-class-name="table-header"
          show-summary
          :summary-method="getSum"
        >
          <el-table-column type="index" label="序号" show-overflow-tooltip width="50"></el-table-column>
          <el-table-column prop="itemname" label="菜品名称" show-overflow-tooltip width="220">
            <template slot-scope="scope">
              <el-select
                v-model="scope.row.itemid"
                size="small"
                style="width:90%;"
                @focus="getFoodList"
                @change="val => selectFood(val, scope.$index)"
              >
                <el-option
                  v-for="item in canSelectFoodList"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                  :disabled="item.disabled"
                ></el-option>
              </el-select>
            </template>
          </el-table-column>
          <el-table-column prop="price" label="单价（元)" width="120" show-overflow-tooltip>
            <template slot-scope="scope">
              <span v-if="scope.row.promotionprice">
                {{common.moneyFormat(scope.row.promotionprice)}}
                <span
                  class="delete"
                >{{common.moneyFormat(scope.row.price)}}</span>
              </span>
              <span v-else>{{common.moneyFormat(scope.row.price)}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="itemnum" label="数量" show-overflow-tooltip width="120">
            <template slot-scope="scope">
              <el-input-number
                v-model="scope.row.itemnum"
                @change="(val,old) => handleChange(val,old,scope.row)"
                :min="1"
                size="mini"
                step-strictly
                style="width:100%"
              ></el-input-number>
            </template>
          </el-table-column>
          <el-table-column
            prop="totalPrice"
            label="价格（元)"
            show-overflow-tooltip
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
    <div class="drawer-footer">
      <el-button type="primary" size="small" @click="save">保存</el-button>
      <el-button size="small" @click="drawer = false">取消</el-button>
    </div>
  </el-drawer>
</template>

<script>
import { fetchUserList } from "@/api/admin/roles";
import { fetchBuildingList } from "@/api/admin/building";
import { fetchCafeConfig } from "@/api/admin/cafe";
import { fetchAllFoodList, fetchTypeList } from "@/api/admin/food";
import { fetchOrderDetail, saveOrder } from "@/api/admin/order";
export default {
  data() {
    return {
      drawer: false,
      drawerLoading: false,
      title: "录入单位订餐",
      shopid: null,
      shopname: null,
      shopConfig: {},
      editForm: {
        id: null,
        creater: null,
        createrid: null,
        creatername: null,
        mobile: null,
        area: null,
        house: null,
        senddate: this.moment().format("YYYYMMDD"),
        sendtime: null
      },
      rules: {
        creater: [{ required: true, message: "请选择订餐人" }],
        mobile: [
          {
            required: true,
            pattern: /^1\d{10}$/,
            trigger: "change",
            message: "请输入联系人手机号"
          }
        ],
        area: [{ required: true, trigger: "change", message: "请选择楼宇" }],
        house: [
          { required: true, trigger: "change", message: "请输入具体门牌号" }
        ],
        senddate: [
          { required: true, trigger: "change", message: "请选择送达日期" }
        ],
        sendtime: [
          { required: true, trigger: "change", message: "请选择送达时间" }
        ]
      },
      pickerOptions: {
        disabledDate: time => {
          return time.getTime() < Date.now() - 24 * 60 * 60 * 1000;
        }
      },
      userList: [],
      userloading: false,
      areaList: [],
      arealoading: false,
      selectableTimeList: [], // 可选配送时间列表
      tableData: [],
      foodList: [],
      totalfee: 0,
      typeid: null,
      typeList: []
    };
  },
  computed: {
    // 可以选择的菜品
    canSelectFoodList() {
      let foodIds = this.tableData.map(i => i.itemid);
      return this.foodList.map(i => {
        i.disabled = foodIds.includes(i.id);
        return i;
      });
    }
  },
  methods: {
    // 打开抽屉
    openDrawer() {
      this.getCafeConfig();
      this.getTypeList();
      this.setTotalFee();
    },
    // 关闭抽屉
    closeDrawer() {
      this.$refs.editForm.resetFields();
      this.editForm = {
        id: null,
        creater: null,
        createrid: null,
        creatername: null,
        mobile: null,
        area: null,
        house: null,
        senddate: null,
        sendtime: null
      };
      this.typeid = null;
      this.tableData = [];
      this.$emit("doFunc");
    },
    // 选择用户
    changeUser(val) {
      let user = JSON.parse(val);
      this.editForm.createrid = user.ID;
      this.editForm.creatername = user.NAME;
      this.editForm.creater = `${user.NAME}(${user.ID})`;
    },
    // 搜索用户列表
    remoteMethod(query) {
      if (query) {
        this.userloading = true;
        let param = {
          page: 1,
          limit: 1000,
          filter: JSON.stringify({
            KEYWORD: query
          })
        };
        fetchUserList(param)
          .then(res => {
            this.userloading = false;
            this.userList = res.items || [];
          })
          .catch(err => {
            this.userloading = false;
            this.userList = [];
          });
      } else {
        this.userList = [];
      }
    },
    // 搜索区域
    remoteMethodArea(query) {
      if (query !== "") {
        this.arealoading = true;
        fetchBuildingList({
          filter: {
            name: query
          },
          limit: 1000,
          page: 1
        })
          .then(res => {
            this.arealoading = false;
            this.areaList = res.data || [];
            this.areaList.push({
              id: "other",
              name: "其他"
            });
          })
          .catch(err => {
            this.arealoading = false;
            this.areaList = [
              {
                id: "other",
                name: "其他"
              }
            ];
          });
      } else {
        this.areaList = [
          {
            id: "other",
            name: "其他"
          }
        ];
      }
    },
    // 获取餐厅的配置
    getCafeConfig() {
      let param = {
        shopid: this.shopid
      };
      fetchCafeConfig(param).then(res => {
        if (res.success) {
          let data = res.data || null;
          let sendtime = data.sendtime || "";
          let sendTimeList = sendtime.split(",").map(i => {
            return i.split("-");
          });
          this.shopConfig = {
            setupTime: data.setuptime || 0,
            sendTimeList
          };
          this.setSelectableTimeList();
        }
      });
    },
    // 设置可选时间列表
    setSelectableTimeList() {
      let list = [];
      let now = this.moment().format("HH:mm");
      // 默认时间：当前时间+备餐时间
      let defaultTime = this.moment()
        .add(this.shopConfig.setupTime, "m")
        .format("HH:mm");
      // 取整十分钟
      let m = defaultTime.substring(defaultTime.length - 1);
      if (m != "0") {
        defaultTime = this.moment(defaultTime, "HH:mm")
          .add(10 - m, "m")
          .format("HH:mm");
      }
      // 可选时间
      // let sendTimeList = this.shopConfig.sendTimeList;
      let sendTimeList = [["00:00", "23:50"]];
      sendTimeList.forEach(i => {
        let st = i[0],
          et = i[1];
        let time = st;
        while (time <= et) {
          // 如果是当天 要判断 默认时间 是否已经超过了 可选时间
          if (this.editForm.senddate == this.moment().format("YYYYMMDD")) {
            if (defaultTime <= time) {
              list.push(time);
            }
          } else {
            list.push(time);
          }
          if (time >= "23:50") break;
          time = this.moment(time, "HH:mm")
            .add(10, "m")
            .format("HH:mm");
        }
      });
      this.selectableTimeList = list;
      // 设置默认时间
      let times = list;
      // 当前时间如果小于11:30，并且12点可以选，则默认时间为12点
      if (now <= "11:30" && times.includes("12:00")) {
        defaultTime = "12:00";
        // 14:00 ~ 17:00，并且12点可以选，则是17:30
      } else if (now > "14:00" && now <= "17:00" && times.includes("17:30")) {
        defaultTime = "17:30";
      }
      if (times.includes(defaultTime)) {
        this.editForm.sendtime = defaultTime;
      } else {
        this.editForm.sendtime = times[0];
      }
    },
    // 选择时间
    chooseTime(time) {
      this.editForm.sendtime = time;
      this.$refs.popover.showPopper = false;
    },
    // 获取菜品分类
    getTypeList() {
      this.typeLoading = true;
      let param = {
        shopid: this.shopid
      };
      fetchTypeList(param)
        .then(res => {
          this.typeLoading = false;
          if (res.success) {
            let data = res.data || [];
            data.sort((a, b) => {
              return a.level > b.level ? 1 : -1;
            });
            this.typeList = data;
          }
        })
        .catch(err => {
          this.typeLoading = false;
        });
    },
    // 获取菜品列表
    getFoodList() {
      let param = {
        shopid: this.shopid,
        // shopitemtypeid: this.typeid,
        status: "1"
      };
      fetchAllFoodList(param).then(res => {
        if (res.success) {
          this.foodList = res.data || [];
        }
      });
    },
    // 添加菜品
    addFood() {
      let obj = {
        itemnum: 1
      };
      this.tableData.push(obj);
    },
    // 选择菜品
    selectFood(foodid, index) {
      let food = this.foodList.filter(i => i.id == foodid)[0];
      let price = food.promotionprice ? food.promotionprice : food.price;
      let obj = {
        itemid: food.id,
        itemname: food.name,
        itemnum: 1,
        price: food.price,
        promotionprice: food.promotionprice,
        totalPrice: price
      };
      this.$set(this.tableData, index, obj);
      this.setTotalFee();
    },
    // 改变数量
    handleChange(newVal, oldVal, row) {
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
      this.setTotalFee();
    },
    // 计算合计
    setTotalFee() {
      let priceList = this.tableData.map(i => i.totalPrice);
      this.totalfee = priceList.reduce((sum, num) => {
        return this.common.add(sum, num);
      }, 0);
    },
    // 合计
    getSum(param) {
      const { columns, data } = param;
      const sums = [];
      columns.forEach((column, index) => {
        if (index == 0) {
          sums[index] = "合计";
          return;
        }
        switch (column.property) {
          case "itemnum":
          case "totalPrice":
            const values = data.map(i => Number(i[column.property]));
            sums[index] = values.reduce((prev, curr) => {
              const value = Number(curr);
              let precision = column.property == "itemnum" ? 0 : 2;
              if (!isNaN(value)) {
                return this.common.add(prev, curr, precision);
              } else {
                return this.common.add(prev, 0, precision);
              }
            }, 0);
        }
      });
      return sums;
    },
    // 保存
    save() {
      // 如果是修改，则判断订单是否已配送
      if (this.editForm.id) {
        fetchOrderDetail({ id: this.editForm.id }).then(res => {
          if (res.success) {
            let data = res.data || {};
            let orderstatus = res.data.orderstatus;
            let ordertype = res.data.ordertype;
            // 只有在待确认的时候才能提交
            if (orderstatus == "1") {
              this.doSave();
            } else {
              let msg = null;
              switch (orderstatus) {
                case "2":
                  msg =
                    ordertype == "group"
                      ? "订单正在配送中"
                      : "订单正在等待取餐";
                  break;
                case "3":
                  msg = ordertype == "group" ? "订单已送达" : "订单已取餐";
                  break;
                case "4":
                  msg = "订单已取消";
                  break;
              }
              this.$message({
                showClose: true,
                type: "error",
                message: `${msg}，无法修改！`
              });
              return;
            }
          }
        });
      } else {
        this.doSave();
      }
    },
    // 保存
    doSave() {
      this.$refs.editForm.validate(valid => {
        if (valid) {
          if (this.editForm.senddate < this.moment().format("YYYYMMDD")) {
            this.$message({
              showClose: true,
              type: "error",
              message: "请重新选择时间！"
            });
            return;
          }
          let items = this.tableData.filter(i => i.itemname);
          if (items.length == 0) {
            this.$message({
              showClose: true,
              type: "error",
              message: "请添加菜品！"
            });
            return;
          }
          this.drawerLoading = true;
          items = items.map(i => {
            return {
              itemid: i.itemid,
              itemname: i.itemname,
              itemnum: i.itemnum,
              price: i.price,
              promotionprice: i.promotionprice
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
          let param = {
            ...this.editForm,
            items,
            ordertype: "group",
            shopid: this.shopid,
            shopname: this.shopname,
            totalfee: totalfee,
            // shopitemtypeid: this.typeid,
            orderfrom: "2" // 1自己 2管理员
          };
          saveOrder(param)
            .then(res => {
              if (res.success) {
                this.drawerLoading = false;
                this.$message({
                  showClose: true,
                  type: "success",
                  message: "保存成功！"
                });
                this.drawer = false;
              } else {
                this.drawerLoading = false;
                this.$message({
                  showClose: true,
                  type: "error",
                  message:
                    "保存失败：" + res.data.message ||
                    res.data.errInf.shortBusInf
                });
              }
            })
            .catch(err => {
              this.drawerLoading = false;
              this.$message({
                showClose: true,
                type: "error",
                message: `保存失败:${err}`
              });
            });
        }
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.el-form-item {
  margin-bottom: 12px;
}
.select-search {
  position: absolute;
  left: 280px;
  top: 14px;
  color: rgba(0, 0, 0, 0.35);
}
.item {
  margin-bottom: 10px;
  position: relative;
  h3 {
    font-size: 16px;
    font-weight: 600;
    color: #373b4b;
    line-height: 22px;
    padding: 0 20px 20px 24px;
  }
  .right-btn {
    position: absolute;
    right: 20px;
    top: -5px;
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
.delete {
  text-decoration: line-through;
  color: #999999 !important;
  font-weight: 400;
}
</style>
<style lang="scss">
.el-form-item__error {
  padding-top: 0;
}
.el-textarea .el-input__count {
  line-height: 20px;
}
</style>