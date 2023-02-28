<template>
  <div class="main">
    <van-nav-bar
      title="黑名单规则"
      fixed
      :border="false"
      left-arrow
      @click-left="back"
      ref="navBar"
    ></van-nav-bar>

    <div class="wrapper" style="margin-top: 80px">
      <div class="item">
        <h3 class="title">违规</h3>
      </div>
      <van-checkbox v-model="isSign" shape="square">未签到，记违规</van-checkbox>
      <br />
      <van-checkbox v-model="isHour" shape="square" @click="clickCheck">
        近24小时内取消预约
        <el-input-number
          @focus.prevent="focusInput"
          size="mini"
          v-model="hourNum"
          :controls="false"
          :min="minHourNum"
          :max="10000"
        ></el-input-number>
        次，记违规
      </van-checkbox>
    </div>

    <div class="wrapper">
      <div class="item">
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
    </div>

    <div class="wrapper">
      <div class="item">
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

    <div class="div_flex">
      <van-button class="big-btn" type="info" @click="save">保存</van-button>
    </div>
  </div>
</template>

<script>
import { apBlacklistRuleSaveBatch, apBlacklistRulePageQuery } from '@/api/admin/sysman';
export default {
  data() {
    return {
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
      useCapture: false,
    };
  },
  watch: {
    isHour(n) {
      console.log(n);
      if (n) {
        this.minHourNum = 1;
        if (this.hourNum <= 0) {
          this.hourNum = 1;
        }
      } else {
        this.minHourNum = 0;
      }
    },
  },
  methods: {
    clickCheck(e) {
      console.log('check', e);
      let event = e || window.event;
      event.stopPropagation && event.stopPropagation();
      event.preventDefault && event.preventDefault();
      if (this.useCapture) {
      }
      this.useCapture = false;
    },
    focusInput(e) {
      console.log('input', e);
      this.useCapture = true;
      let event = e || window.event;
      event.stopPropagation && event.stopPropagation();
      event.preventDefault && event.preventDefault();
    },
    back() {
      this.$router.go(-1);
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
            this.$toast.success('保存成功');
            this.back();
          } else {
            this.$toast.fail('保存失败');
          }
        })
        .catch(err => {
          this.drawerLoading = false;
          this.$toast.fail('保存失败');
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
.main {
  margin: 0 auto;
  width: 100%;
  background-color: rgba(246, 246, 246, 1);
}
.wrapper {
  background: #ffffff;
}
.item {
  margin-top: 30px;
  background: #ffffff;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-right: 32px;
  .title {
    height: 33px;
    font-size: 28px;
    font-weight: bolder;
    color: #51575c;
    line-height: 33px;
    position: relative;
    padding: 32px 0 64px 68px;
    &::before {
      display: inline-block;
      content: '';
      width: 12px;
      height: 12px;
      border: 6px solid #3f86f7;
      border-radius: 12px;
      position: absolute;
      left: 32px;
      top: 36px;
    }
  }
}
.tips {
  height: 33px;
  overflow-wrap: break-word;
  color: rgba(0, 0, 0, 0.25);
  font-size: 24px;
  text-align: left;
  white-space: nowrap;
  line-height: 33px;
  flex: 1.5;
  margin-left: 20px;
}
.big-btn {
  height: 88px;
  background: #3f86f7;
  width: 70%;
}
.div_flex {
  margin-top: 30px;
  display: flex;
  align-items: center;
  justify-content: space-around;
  background: #ffffff;
}
/deep/ .el-input {
  font-size: 28px;
}
/deep/ .van-checkbox {
  display: flex;
  align-items: center;
  padding-left: 32px;
}
/deep/ .van-checkbox__icon {
  font-size: 28px;
}
/deep/ .van-checkbox__label {
  margin-top: 5px;
  overflow-wrap: break-word;
  color: rgba(0, 0, 0, 0.65);
  font-size: 28px;
  text-align: left;
  white-space: nowrap;
}

.input_text {
  overflow-wrap: break-word;
  color: rgba(0, 0, 0, 0.65);
  font-size: 28px;
  text-align: left;
  white-space: nowrap;
  margin-left: 32px;
}
</style>
