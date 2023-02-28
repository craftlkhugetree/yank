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
        label-width="130px"
        :show-message="false"
        label-position="right"
        :rules="rules"
      >
        <el-form-item prop="name" label="鹤位：" required>
          <el-input size="small" v-model="editForm.name" placeholder="请输入"></el-input>
        </el-form-item>
        <el-form-item prop="location" label="罐号：" required>
          <el-select
            v-model="editForm.location"
            size="small"
            filterable
            placeholder="请输入罐号查询"
            style="margin-right: 10px"
          >
            <el-option
              v-for="item in locationList"
              :key="item"
              :label="item"
              :value="item"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item prop="goodsId" label="是否支持装车：">
          <el-radio v-model="editForm.canLoad" :label="1">支持</el-radio>
          <el-radio v-model="editForm.canLoad" :label="0">不支持</el-radio>
          <el-select
            v-model="editForm.goodsId"
            size="small"
            filterable
            @change="changeGood"
            v-if="editForm.canLoad == '1'"
          >
            <el-option
              v-for="item in goodsList"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item prop="unloadGoodsId" label="是否支持卸车：">
          <el-radio v-model="editForm.canUnload" :label="1">支持</el-radio>
          <el-radio v-model="editForm.canUnload" :label="0">不支持</el-radio>
          <el-select
            v-model="editForm.unloadGoodsId"
            size="small"
            filterable
            @change="unchangeGood"
            v-if="editForm.canUnload == '1'"
          >
            <el-option
              v-for="item in goodsList"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item prop="isOpen" label="状态：" required>
          <div class="switch">
            <el-switch
              ref="switch"
              :width="54"
              v-model="editForm.isOpen"
              :active-value="1"
              :inactive-value="0"
            ></el-switch>
            <span class="on" v-show="editForm.isOpen == 1" @click="editForm.isOpen = 0">开启</span>
            <span class="off" v-show="editForm.isOpen == 0" @click="editForm.isOpen = 1">关闭</span>
          </div>
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
import { saveGhhw } from '@/api/ghhw';
import { mapState } from 'vuex';
export default {
  data() {
    return {
      drawer: false,
      drawerLoading: false,
      title: '新增罐号鹤位',
      editForm: {
        goodsId: '',
        goodsName: '',
        location: null,
        name: null,
        isOpen: 1,
        canLoad: 0,
        canUnload: 0,
        unloadGoodsId: '',
        unloadGoodsName: '',
      },
      locationLoading: false,
      rules: {
        unloadGoodsId: [{ message: '请选择卸车物料', trigger: 'blur', required: false }],
        goodsId: [{ message: '请选择装车物料', trigger: 'blur', required: false }],
      },
    };
  },
  watch: {
    'editForm.canLoad': {
      handler(val) {
        if (val == '1') {
          this.rules.goodsId[0].required = true;
        } else {
          this.editForm.goodsId = '';
          this.editForm.goodsName = '';
          this.rules.goodsId[0].required = false;
        }
      },
    },
    'editForm.canUnload': {
      handler(val) {
        if (val == '1') {
          this.rules.unloadGoodsId[0].required = true;
        } else {
          this.editForm.unloadGoodsId = '';
          this.editForm.unloadGoodsName = '';
          this.rules.unloadGoodsId[0].required = false;
        }
      },
    },
  },
  computed: mapState({
    locationList: state => state.locationList,
    goodsList: state => state.goodsList,
    canUnload() {
      return (this.editForm && this.editForm.canUnload == '1') || false;
    },
    canLoad() {
      return (this.editForm && this.editForm.canLoad == '1') || false;
    },
  }),
  methods: {
    // 打开抽屉
    openDrawer() {},
    // 关闭抽屉
    closeDrawer() {
      this.$refs.editForm.resetFields();
      this.editForm = {
        goodsId: '',
        goodsName: '',
        location: null,
        name: null,
        isOpen: 1,
        canLoad: 0,
        canUnload: 0,
        unloadGoodsId: '',
        unloadGoodsName: '',
      };
    },
    // 选择物料
    changeGood(val) {
      let good = this.goodsList.find(i => i.id == val);
      this.editForm.goodsName = good.name;
    },
    unchangeGood(val) {
      let good = this.goodsList.find(i => i.id == val);
      this.editForm.unloadGoodsName = good.name;
    },
    // 保存
    saveData() {
      this.$refs.editForm.validate(valid => {
        if (valid) {
          this.drawerLoading = true;
          let param = { ...this.editForm };
          saveGhhw(param)
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
  created() {
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
</style>
