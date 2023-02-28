<template>
  <div>
    <!---------------------------- 支付弹窗 -------------------------->
    <el-dialog
      :visible.sync="dialogVisible"
      width="425px"
      v-loading="loading"
      :close-on-click-modal="false"
      :show-close="false"
    >
      <h3 class="dialog-title" slot="title">
        <i class="el-icon-warning"></i>
        支付订单
      </h3>
      <div class="dialog-content">
        <p>支付方式： 校园一卡通</p>
        <p>订单金额： ￥{{totalfee}}</p>
        <p class="tips">校园卡支付有默认额度限制，教职工和研究生单笔200，当天400；本科生单笔30，当天200。超当天限额需在校园卡-个人中心-消费设置中修改，或去充值机修改。</p>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="cancelPay" size="small">取 消</el-button>
        <el-button type="primary" @click="confirmPay(null)" size="small">确认支付</el-button>
      </span>
    </el-dialog>
    <!---------------------------- 失败弹窗 -------------------------->
    <el-dialog
      :visible.sync="failDialogVisible"
      width="425px"
      v-loading="loading"
      :close-on-click-modal="false"
      :show-close="false"
    >
      <h3 class="dialog-title" slot="title">
        <i class="el-icon-warning"></i>
        支付失败
      </h3>
      <div class="dialog-content">
        <p>{{errorMsg}}</p>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="cancelPay();" size="small">查看订单</el-button>
        <el-button type="primary" @click="confirmPay(null)" size="small">重新支付</el-button>
      </span>
    </el-dialog>
    <!---------------------------- 超额输入密码弹窗 -------------------------->
    <el-dialog
      :visible.sync="pwdDialogVisible"
      width="425px"
      v-loading="loading"
      :close-on-click-modal="false"
      :show-close="false"
    >
      <h3 class="dialog-title" slot="title">
        <i class="el-icon-warning"></i>
        支付超额
      </h3>
      <div class="dialog-content">
        <p style="margin-bottom:12px;">请输入支付密码（默认身份证后六位）</p>
        <pwd ref="pwd" :nums="6"></pwd>
        <p class="error-tips">{{pwdErrorMsg}}</p>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="cancelPay();" size="small">取消</el-button>
        <el-button type="primary" @click="pwdConfirmPay" size="small">确认支付</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { payOrder } from "@/api/admin/order";
import Pwd from "@/components/Pwd";
export default {
  components: {
    Pwd
  },
  data() {
    return {
      id: null, // 订单id
      totalfee: 0,
      msg: null,
      dialogVisible: false,
      loading: false,
      failDialogVisible: false,
      errorMsg: null,
      pwdDialogVisible: false,
      needPwd: false,
      pwdErrorMsg: null
    };
  },
  methods: {
    // 取消支付
    cancelPay() {
      this.dialogVisible = false;
      this.failDialogVisible = false;
      this.pwdDialogVisible = false;
      let path = `/record/view/${this.id}`;
      if (this.$route.path !== path) {
        this.$router.push(path);
      } else {
        this.$emit("doFunc");
      }
    },
    // 密码确认支付
    pwdConfirmPay() {
      let pwdCom = this.$refs.pwd;
      pwdCom.validate();
      if (pwdCom.pwd) {
        this.confirmPay(pwdCom.pwd);
      }
    },
    // 确认支付
    confirmPay(pwd) {
      this.loading = true;
      let data = {
        orderid: this.id,
        paypwd: pwd || null
      };
      payOrder(data)
        .then(res => {
          this.loading = false;
          this.dialogVisible = false;
          if (res.success) {
            let msg = this.msg + "（支付账单可在校园卡平台“查询流水”中查看）";
            this.$confirm(msg, "支付成功", {
              confirmButtonText: "查看订单",
              cancelButtonText: "继续订餐",
              type: "success"
            })
              .then(() => {
                this.cancelPay();
              })
              .catch(() => {
                this.$router.push("/order");
              });
          } else {
            this.errorMsg = res.data.message;
            if (this.errorMsg == "需要密码认证") {
              this.needPwd = true;
            }
            // 是否密码支付
            if (this.needPwd) {
              if (this.errorMsg !== "需要密码认证") {
                this.pwdErrorMsg = res.data.message;
              }
              this.pwdDialogVisible = true;
            } else {
              this.failDialogVisible = true;
            }
          }
        })
        .catch(err => {
          this.loading = false;
          this.dialogVisible = false;
          this.errorMsg = err;
          this.failDialogVisible = true;
        });
    }
  }
};
</script>

<style lang="scss" scoped>
.dialog-title {
  font-size: 16px;
  font-weight: 500;
  color: rgba(0, 0, 0, 0.85);
  line-height: 24px;
  i {
    color: #faad14;
    font-size: 20px;
    margin-right: 10px;
  }
}
.dialog-content {
  margin: -30px 0;
  padding-left: 35px;
  p {
    font-size: 14px;
    font-weight: 400;
    color: rgba(0, 0, 0, 0.65);
    line-height: 22px;
  }
  .error-tips {
    color: #f56c6c;
    font-size: 12px;
    margin: 5px 0;
  }
  .tips {
    font-size: 14px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: #999999;
    line-height: 22px;
    margin: 12px 0;
  }
}
</style>