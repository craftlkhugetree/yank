<template>
  <el-drawer
    class="base-drawer"
    title="黑名单规则"
    :visible.sync="isRuleDrawer"
    direction="rtl"
    :wrapperClosable="false"
    @close="closeDrawer"
    v-loading="drawerLoading"
    size="700px"
  >
    <div class="drawer-container form_style">
      <div class="div_flex">
        <img :src="bc" />
        <span class="title">违规</span>
      </div>
      <el-checkbox v-model="isSign" class="check">未签到，记违规</el-checkbox>
      <br />
      <el-checkbox v-model="isHour" class="check">
        近24小时内取消预约
          <!-- controls-position="right" -->
        <el-input-number
          size="mini"
          v-model="hourNum"
          :controls="false"
          :min="minHourNum"
          :max="10000"
        ></el-input-number>
        次，记违规
      </el-checkbox>
      <div class="div_flex">
        <img :src="bc" />
        <span class="title">记入黑名单</span>
        <span class="tips">加入黑名单即取消预约资格</span>
      </div>
      <div class="input_text">
        违规
        <el-input-number
          size="mini"
          v-model="breakNum"
          :controls="false"
          :min="0"
          :max="10000"
        ></el-input-number>
        次，记入黑名单
      </div>
      <div class="div_flex">
        <img :src="bc" />
        <span class="title">清除黑名单</span>
      </div>
      <div class="input_text">
        <el-input-number
          size="mini"
          v-model="dayNum"
          :controls="false"
          :min="0"
          :max="10000"
        ></el-input-number>
        天后自动解除黑名单
      </div>
    </div>
    <div class="drawer-footer">
      <el-button type="primary" size="small" @click="save">保存</el-button>
      <el-button size="small" @click="closeDrawer">取消</el-button>
    </div>
  </el-drawer>
</template>

<script>
import { apBlacklistRuleSaveBatch, apBlacklistRulePageQuery } from '@/api/admin/sysman';
import bc from '@/assets/img/blueCircle.png';
export default {
  props: {
    isRuleDrawer: Boolean,
  },
  data() {
    return {
      bc,
      hourNum: 0,
      minHourNum: 0,
      breakNum: 0,
      dayNum: 0,
      isSign: false,
      isHour: false,
      rules: [
        {
          id: 1,
          ruleKey: 'A0001',
          ruleVal: '1',
          ruleDesc: '未签到，记违规',
          isUse: 0,
        },
        {
          id: 2,
          ruleKey: 'A0002',
          ruleVal: '5',
          ruleDesc: '近24小时内取消预约${1}次，记违规一次',
          isUse: 0,
        },
        {
          id: 3,
          ruleKey: 'B0001',
          ruleVal: '1',
          ruleDesc: '违规${1}次，记入黑名单',
          isUse: 0,
        },
        {
          id: 4,
          ruleKey: 'B0002',
          ruleVal: '1',
          ruleDesc: '清除黑名单：${1}天后自动解除黑名单',
          isUse: 0,
        },
      ],
      drawerLoading: false,
    };
  },
  watch: {
    isHour(n) {
      console.log(n);
      if(n) {
        this.minHourNum = 1
        if (this.hourNum <= 0) {
          this.hourNum = 1
        }
      } else {
        this.minHourNum = 0
      }
    }
  },
  methods: {
    // 关闭抽屉
    closeDrawer() {
      this.$emit('close');
    },
    // 保存
    save() {
      this.drawerLoading = true;
      this.rules.forEach(r => {
        if (r.ruleKey === 'A0001') {
          r.isUse = this.isSign ? 1 : 0;
        } else if (r.ruleKey === 'A0002') {
          r.ruleVal = this.isHour ? this.hourNum : 0;
          r.isUse = this.isHour ? 1 : 0;
        } else if (r.ruleKey === 'B0001') {
          r.ruleVal = this.breakNum;
          r.isUse = this.breakNum ? 1 : 0;
        } else if (r.ruleKey === 'B0002') {
          r.ruleVal = this.dayNum;
          r.isUse = this.dayNum ? 1 : 0;
        }
      });
      apBlacklistRuleSaveBatch(this.rules)
        .then(res => {
          this.drawerLoading = false;
          if (res.success) {
            this.$message({
              showClose: true,
              type: 'success',
              message: '保存成功！',
            });
            this.closeDrawer();
            this.$emit('query');
          } else {
            this.$message({
              showClose: true,
              type: 'error',
              message: '保存失败！' + res.data.errInf.shortBusInf,
            });
          }
        })
        .catch(err => {
          this.drawerLoading = false;
          this.$message({
            showClose: true,
            type: 'error',
            message: '保存失败！' + err,
          });
        });
    },
    getRules() {
      const p = {
        page: 1,
        limit: 1000,
      };
      apBlacklistRulePageQuery(p).then(res => {
        if (res.success) {
          this.rules = res.data;
          this.rules.forEach(r => {
            if (r.ruleKey === 'A0001') {
              this.isSign = r.isUse ? true : false;
            } else if (r.ruleKey === 'A0002') {
              this.isHour = r.isUse ? true : false;
              this.hourNum = r.ruleVal ? parseInt(r.ruleVal) : 0;
            } else if (r.ruleKey === 'B0001') {
              this.breakNum = r.ruleVal ? parseInt(r.ruleVal) : 0;
            } else if (r.ruleKey === 'B0002') {
              this.dayNum = r.ruleVal ? parseInt(r.ruleVal) : 0;
            }
          });
        }
      });
    },
  },
  mounted() {
    this.getRules();
  },
};
</script>

<style lang="scss" scoped>
.form_style {
  margin: 0 30px;
}
.div_flex {
  display: flex;
  align-items: center;
  margin: 30px 0 10px 0;
  &:first-child {
    margin-bottom: 0;
  }
  img {
    margin-top: 1px;
    width: 16px;
    height: 16px;
  }
  .title {
    height: 22px;
    overflow-wrap: break-word;
    color: rgba(71, 77, 81, 1);
    font-size: 16px;
    font-weight: bolder;
    font-family: PingFangSC-Semibold;
    text-align: left;
    white-space: nowrap;
    line-height: 22px;
    margin-left: 10px;
  }
  .tips {
    height: 17px;
    overflow-wrap: break-word;
    color: rgba(153, 153, 153, 1);
    font-size: 12px;
    text-align: left;
    white-space: nowrap;
    line-height: 17px;
    margin: 3px 0 0 10px;
  }
}
.check {
  margin: 30px 0 0 1px;
}
.input_text {
  margin: 30px 0 0 1px;
}
</style>
