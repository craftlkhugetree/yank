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
    size="660px"
  >
    <div class="drawer-container">
      <!-------------------- 保存 -------------------->
      <el-form
        ref="editForm"
        :model="editForm"
        label-width="100px"
        :show-message="true"
        label-position="right"
        :validate-on-rule-change="false"
        :rules="rules"
      >
        <el-form-item prop="billNo" label="订单编号：">
          <el-input
            size="small"
            v-model="editForm.billNo"
            placeholder=""
            :maxlength="maxLen"
            disabled
          ></el-input>
        </el-form-item>
        <el-form-item prop="shipname" label="车牌号：">
          <el-input
            size="small"
            v-model="editForm.shipname"
            placeholder="请输入"
            :maxlength="maxLen"
          ></el-input>
        </el-form-item>
        <el-form-item prop="mobile" label="联系方式：">
          <el-input
            size="small"
            v-model="editForm.mobile"
            placeholder="请输入"
            :maxlength="maxLen"
            id="mobile"
          ></el-input>
        </el-form-item>

        <div v-for="(item, id) in editForm.drivers" :key="id">
          <el-form-item
            :prop="`driverName${id}`"
            label="司机姓名："
            :rules="[
              {
                trigger: 'blur',
                required: id == '0',
                validator: (r, v, callback) => {
                  if (!item.name && id == '0') {
                    vDriver(callback, '请输入司机姓名');
                  } else {
                    callback();
                  }
                },
              },
            ]"
          >
            <el-input
              size="small"
              v-model="item.name"
              placeholder="请输入"
              :maxlength="maxLen"
              class="first-driver"
            ></el-input>
            <i
              class="el-icon-delete del-driver"
              @click="delDriver(id)"
              v-if="editForm.drivers.length > 1"
            ></i>
          </el-form-item>
          <el-form-item
            :prop="`driverId${id}`"
            label="身份证号："
            :rules="[
              {
                trigger: 'blur',
                required: id == '0',
                validator: (r, v, callback) => {
                  if (item.name && !util.regExps.idCard.test(item.idcard)) {
                    vDriver(callback, '身份证号有误');
                  } else {
                    callback();
                  }
                },
              },
            ]"
          >
            <el-input
              size="small"
              v-model="item.idcard"
              placeholder="请输入"
              :maxlength="maxLen"
            ></el-input>
            <el-button
              :style="{ '--len': iptLen }"
              size="small"
              class="driver-btn"
              plain
              @click="addDriver"
              v-if="editForm.drivers.length < 2"
            >
              <i class="el-icon-plus"></i>
              新增司机
            </el-button>
          </el-form-item>
        </div>

        <el-form-item prop="goodsId" label="物料：">
          <el-select v-model="editForm.goodsId" size="small" filterable @change="changeGood">
            <el-option
              v-for="item in goodsList"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item prop="consignee" label="客户名称：">
          <el-input
            size="small"
            v-model="editForm.consignee"
            placeholder="请输入"
            :maxlength="maxLen"
          ></el-input>
        </el-form-item>
        <el-form-item prop="unloadDate" label="卸车时间：">
          <el-date-picker
            v-model="value1"
            type="date"
            placeholder="请选择日期"
            size="small"
            class="unload-time"
          ></el-date-picker>
        </el-form-item>
        <el-form-item prop="quantity" label="卸车重量：">
          <el-input
            size="small"
            v-model="editForm.quantity"
            placeholder="请输入"
            :maxlength="maxLen"
            style="vertical-align: middle"
          >
            <template slot="append">| KG</template>
          </el-input>
        </el-form-item>
      </el-form>
    </div>
    <div class="drawer-footer">
      <el-button type="primary" size="small" @click="saveData">保存</el-button>
      <el-button size="small" @click="drawer = false">取消</el-button>
    </div>
  </el-drawer>
</template>

<script>
import { saveUnload } from '@/api/order';
import { mapState } from 'vuex';
export default {
  data() {
    return {
      drawer: false,
      drawerLoading: false,
      title: '新增卸车单',
      maxLen: 100,
      iptLen: '50%',
      value1: null,
      editForm: {
        drivers: [
          {
            idcard: '', //'string',
            name: '',
          },
        ],
        consignee: '',
        billNo: null, // 'string',
        createTime: '', // '2023-01-04T08:54:14.478Z',
        goodsId: '', // 'string',
        goodsName: '', // 'string',
        // id: '', // 0,
        // location: '', // 'string',
        mobile: '', // 'string',
        quantity: '', // 0,
        shipname: '', // 'string',
        unloadDate: '', // '2023-01-04T08:54:14.478Z',
      },
      locationLoading: false,
      rules: {
        // driverName0: [
        //   {
        //     message: '请输入司机信息',
        //     trigger: 'blur',
        //     required: true,
        //     // validator: (r, v, callback) => {
        //     //   if (hasDriver(0)) {
        //     //     vDriver(callback, '请输入司机信息');
        //     //   } else {
        //     //     callback();
        //     //   }
        //     // },
        //   },
        // ],
        // driverName1: [{ message: '请输入司机信息', trigger: 'blur', required: false }],
        consignee: [{ message: '请输入客户名称', trigger: 'blur', required: true }],
        mobile: [
          {
            trigger: 'blur',
            validator: (r, v, callback) => {
              if (this.util.regExps.yphone.test(v) || this.util.regExps.phone.test(v)) {
                callback();
              } else {
                this.vDriver(callback, '请输入正确的联系方式');
              }
            },
          },
          { message: '请输入联系方式', trigger: 'blur', required: true },
        ],
        shipname: [{ message: '请输入车牌号', trigger: 'blur', required: true }],
        billNo: [{ message: '请输入订单编号', trigger: 'blur', required: false }],
        quantity: [
          { message: '请输入卸车重量', trigger: 'blur', required: true },
          {
            trigger: 'blur',
            validator: (r, v, callback) => {
              let reg = /^\d+(\.\d+|\d*)$/;
              if (reg.test(v)) {
                callback();
              } else {
                this.vDriver(callback, '卸车重量为数字值');
              }
            },
          },
        ],
        goodsId: [{ message: '请选择物料', trigger: 'change', required: true }],
        unloadDate: [{ message: '请选择日期', trigger: 'change', required: true }],
      },
    };
  },
  watch: {
    value1(val) {
      this.editForm.unloadDate = val && this.util.ymd(val);
    },
  },
  computed: mapState({
    locationList: state => state.locationList,
    goodsList: state => state.goodsList,
    hasDriver() {
      return function (num) {
        return (
          this.editForm &&
          this.editForm.drivers &&
          this.editForm.drivers[num] &&
          this.editForm.drivers[num].name
        );
      };
    },
  }),
  methods: {
    vDriver(callback, str) {
      callback(new Error(str));
    },
    delDriver(num) {
      this.editForm.drivers.splice(num, 1);
    },
    addDriver() {
      this.editForm.drivers.push({
        idcard: '', //'string',
        name: '',
      });
    },
    // 打开抽屉
    openDrawer() {},
    // 关闭抽屉
    closeDrawer() {
      this.$refs.editForm.resetFields();
      this.value1 = null;
      this.editForm = {
        drivers: [
          {
            idcard: '', //'string',
            name: '',
          },
        ],
        consignee: '',
        billNo: null, // 'string',
        createTime: '', // '2023-01-04T08:54:14.478Z',
        goodsId: '', // 'string',
        goodsName: '', // 'string',
        mobile: '', // 'string',
        quantity: '', // 0,
        shipname: '', // 'string',
        unloadDate: '', // '2023-01-04T08:54:14.478Z',
      };
    },
    // 选择物料
    changeGood(val) {
      let good = this.goodsList.find(i => i.id == val);
      this.editForm.goodsName = good.name;
    },
    // 保存
    saveData() {
      let tmp = this.editForm.drivers[1];
      if (tmp && !tmp.name) {
        this.editForm.drivers.splice(1, 1);
      }
      this.$refs.editForm.validate(valid => {
        if (valid) {
          this.drawerLoading = true;
          let param = { ...this.editForm };
          saveUnload(param)
            .then(res => {
              this.drawerLoading = false;
              if (res.code == '000000') {
                this.$message({
                  showClose: true,
                  type: 'success',
                  message: '保存成功！',
                });
                this.drawer = false;
                this.$emit('doFunc');
              } else {
                this.$message({
                  showClose: true,
                  type: 'error',
                  message: '保存失败：' + res.msg,
                });
              }
            })
            .catch(err => {
              this.drawerLoading = false;
              this.$message({
                showClose: true,
                type: 'error',
                message: '保存失败：' + err,
              });
            });
        }
      });
    },
  },
  mounted() {
    if (this.locationList.length == 0) {
      this.$store.dispatch('getLocationList');
    }
    if (this.goodsList.length == 0) {
      this.$store.dispatch('getGoodsList');
    }
  },
};
</script>
<style lang="scss" scoped>
.drawer-container {
  padding: 0 24px;
  .el-form-item {
    margin-bottom: 12px;
  }
  .el-select,
  .el-input {
    width: 360px !important;
  }
}

.select-box {
  margin-bottom: 12px;
  i {
    margin-left: 10px;
    color: #666;
    cursor: pointer;
  }
}
.add {
  width: 360px;
  height: 32px;
  line-height: 32px;
  border-radius: 2px;
  border: 1px dashed #d0d0d0;
  color: rgba(0, 0, 0, 0.65);
  text-align: center;
  cursor: pointer;
}
.unload-time {
  width: 100%;
}

.drawer-container {
  /deep/ .el-button {
    border: 1px dashed #dcdfe6;
    width: var(--len);
  }
}
.driver-btn {
  //   width: 100%;
}
.del-driver {
  cursor: pointer;
  margin-left: 5px;
}
</style>
