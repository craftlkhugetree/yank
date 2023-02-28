<template>
  <div class="main">
    <van-nav-bar title="查看详细" fixed :border="false" left-arrow @click-left="$router.go(-1)">
      <template #right>
        <van-icon name="search" size="18" @click="toSearch" />
      </template>
    </van-nav-bar>
    <detail ref="detail" :id="id"></detail>
    <!--------------------------- 取消预约按钮 --------------------------->
    <div class="footer-btn" v-if="isCanCancel">
      <el-button type="primary" @click="showPopup">取消预约</el-button>
    </div>
    <!------------------------------ 取消预约弹窗 ------------------------------>
    <van-popup v-model="isShowPopup" position="bottom" :style="{ height: '30%' }">
      <div class="cancel-popup">
        <div>
          <span class="left-btn" @click="isShowPopup=false;">取消</span>
          <span class="title">取消预约</span>
          <span class="right-btn" @click="confirmCancel">确认</span>
        </div>
        <div class="content">
          <van-field
            v-model="note"
            :class="{'required':!note }"
            rows="1"
            autosize
            type="textarea"
            placeholder="请输入取消预约说明"
          />
        </div>
      </div>
    </van-popup>
    <!------------------------------ 确认取消预约 ------------------------------>
    <van-dialog v-model="showDialog" title="确认取消预约" width="280" :show-confirm-button="false">
      <p>确认取消预约该资源预约单吗？</p>
      <el-button type="primary" @click="doCancel">确认取消</el-button>
      <span @click="showDialog=false;">暂时不用</span>
    </van-dialog>
  </div>
</template>

<script>
import { doCancel } from "@/api/admin/appoint";
import detail from "../detail";
export default {
  components: {
    detail
  },
  props: {
    id: String
  },
  data() {
    return {
      isShowPopup: false,
      note: "",
      showDialog: false
    };
  },
  computed: {
    // 是否可以取消预约：已预约、审核中、审核通过
    isCanCancel() {
      return this.$store.state.isCanCancel;
    }
  },
  methods: {
    // 查询页面
    toSearch() {
      this.$router.push(`/appoint-manage/search`);
    },
    // 显示取消预约弹出层
    showPopup() {
      this.note = "";
      this.isShowPopup = true;
    },
    // 确认取消
    confirmCancel() {
      if (!this.note) {
        // this.$toast.fail("请输入取消预约说明！");
      } else {
        this.showDialog = true;
      }
    },
    // 取消预约
    doCancel() {
      this.$toast.loading({
        message: "加载中...",
        forbidClick: true
      });
      let data = {
        ids: this.id,
        note: this.note
      };
      doCancel(data)
        .then(res => {
          this.$toast.clear();
          if (res.success) {
            this.$toast.success("取消预约成功！");
            this.showDialog = false;
            this.isShowPopup = false;
            this.$router.go(-1);
          } else {
            this.$toast.fail("取消预约失败：" + res.data.message);
          }
        })
        .catch(err => {
          this.$toast.clear();
          this.$toast.fail("取消预约失败：" + err);
        });
    }
  }
};
</script>

<style lang="scss" scoped>
.main {
  height: 100%;
  background: #f6f6f6;
}
.cancel-popup {
  padding: 32px;
  position: relative;
  .left-btn,
  .right-btn {
    font-size: 28px;
    position: absolute;
    line-height: 40px;
  }
  .left-btn {
    color: #999999;
    left: 32px;
    top: 35px;
  }
  .right-btn {
    color: #3f86f7;
    right: 32px;
    top: 35px;
  }
  .title {
    display: inline-block;
    width: 100%;
    text-align: center;
    font-size: 32px;
    font-weight: 400;
    color: #000000;
    line-height: 45px;
  }
  .content {
    padding-top: 60px;
    .required {
      border-color: red !important;
    }
  }
  .van-field {
    border-bottom: 1px solid #dbdbdb;
  }
}

.footer-btn {
  width: 100%;
  height: 120px;
  line-height: 120px;
  position: fixed;
  bottom: 0;
  background: #ffffff;
  text-align: center;
  padding: 0 48px;
  box-shadow: 0px -2px 4px 0px rgba(0, 0, 0, 0.05);
  .el-button {
    width: 100%;
    height: 70px;
    border-radius: 35px;
    font-size: 30px;
    background: #3f86f7;
    border-color: #3f86f7;
  }
}

.van-dialog {
  p {
    text-align: center;
    margin: 16px 0 40px;
    font-size: 14px;
    color: #5f6464;
    line-height: 42px;
  }
  .el-button {
    display: block;
    width: 180px;
    height: 36px;
    margin: 0 auto 14px;
    border-radius: 20px;
    font-size: 15px;
    background: #3f86f7;
    border-color: #3f86f7;
  }
  span {
    display: block;
    text-align: center;
    margin: 0 auto 32px;
    font-size: 14px;
    color: #999999;
    line-height: 20px;
    cursor: pointer;
  }
}
</style>