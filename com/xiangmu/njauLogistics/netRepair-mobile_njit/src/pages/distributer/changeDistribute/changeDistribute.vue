<template>
  <div>
    <van-nav-bar
      title="维修派单修改"
      left-arrow
      fixed
      @click-left="$router.go(-1)"
    />
    <div style="width:100%;height:46px;"></div>
    <h1 class="labeltitle">报修信息</h1>
    <van-form
      class="reportform"
      ref="distributeform"
      :colon="true"
      :show-error-message="false"
    >
      <van-field
        v-model="reportForm.handletype"
        label="选择操作"
        :rules="[{ required: true, message: '请选择' }]"
        :required="true"
      />
      <div class="selecters">
        <span
          class="selectbtns"
          :class="{ active: item.id == reportForm.handletype }"
          v-for="item in handletype"
          :key="item.id"
          @click="reportForm.handletype = item.id"
          >{{ item.name }}</span
        >
      </div>
      <div class="selectforms">
        <!-- 派单的表单 -->
        <div class="forms forms1" v-show="reportForm.handletype == '1'">
          <van-field
            v-model="repair1.repairerid"
            label="维修人"
            :rules="[
              { required: reportForm.handletype == '1', message: '请填写' }
            ]"
            :required="true"
          />
          <div class="selecters">
            <span
              class="workselectbtns"
              :class="{ active: item.ID == repair1.repairerid }"
              v-for="item in repairers"
              :key="item.ID"
              @click="selectRepairer(item)"
              >{{ item.NAME }}</span
            >
          </div>
          <van-field
            class="fieldbottom"
            readonly
            v-model="repair1.repairername"
            placeholder="请选择维修人"
            right-icon="arrow"
            :rules="[
              { required: reportForm.handletype == '1', message: '请填写' }
            ]"
          />
          <!-- 维修时间 -->
          <van-field
            v-model="repair1.starttime"
            label="维修时间"
            :rules="[
              { required: reportForm.handletype == '1', message: '请填写' }
            ]"
            :required="true"
          />
          <van-field
            class="fieldbottom"
            readonly
            clickable
            v-model="repair1.starttimestr"
            placeholder="请选择维修时间"
            right-icon="arrow"
            @click="showCalendar = true"
            :rules="[
              { required: reportForm.handletype == '1', message: '请填写' }
            ]"
          />
          <van-calendar v-model="showCalendar" @confirm="onRepairTimeConfirm" />
          <!-- 维修说明 -->
          <van-field v-model="repair1.sendnote" label="维修说明" />
          <van-field
            type="textarea"
            :rows="4"
            v-model="repair1.sendnote"
            class="fieldbottom"
            placeholder="请输入说明，不超过200字"
            :maxlength="200"
          />
          <div class="quicks">
            <quickReplies
              type="3"
              :height="180"
              @userReply="getnote1"
            ></quickReplies>
          </div>
        </div>

        <!-- 暂不维修的表单 -->
        <div class="forms forms3" v-show="reportForm.handletype === '3'">
          <van-field v-model="repair3.note" label="暂停说明" :required="true" />
          <van-field
            type="textarea"
            :rows="3"
            v-model="repair3.note"
            class="fieldbottom"
            placeholder="请输入说明，不超过200字"
            :maxlength="200"
            :rules="[
              { required: reportForm.handletype === '3', message: '请填写' }
            ]"
          />
          <div class="quicks">
            <quickReplies
              type="5"
              :height="180"
              @userReply="getnote3"
            ></quickReplies>
          </div>
        </div>
      </div>
    </van-form>
    <div class="withdrawbtn">
      <van-button
        class="btn"
        @click="showConfirm"
        :disabled="loading"
        type="info"
        icon="checked"
        >提交</van-button
      >
    </div>
    <van-popup v-model="reDis" class="confirm size-in-center">
      <h1>重新派单</h1>
      <p class="deslable">关联报修单也同步重新派单的信息，是否确定重新派单？</p>
      <div class="continuebtn" @click="change">重新派单</div>
      <p class="continuebtn close" @click="reDis = false">暂时不要</p>
    </van-popup>
    <van-popup v-model="stoprepair" class="confirm size-in-center">
      <h1>暂不维修</h1>
      <p class="deslable">关联报修单也同步重新派单的信息，是否确定重新派单？</p>
      <div class="continuebtn" @click="change">暂不维修</div>
      <p class="continuebtn close" @click="stoprepair = false">取消</p>
    </van-popup>
  </div>
</template>

<script>
import { Notify } from "vant";
import quickReplies from "@/components/quickReplies";
export default {
  data() {
    return {
      reDis: false,
      stoprepair: false,
      loading: false,
      repairers: [],
      orders: [],
      handletype: [
        { name: "重新派单", id: "1" },
        { name: "暂不维修", id: "3" }
      ],
      reportForm: {
        handletype: "1",
        repairid: null
      },
      repair1: {
        repairerid: "",
        repairername: "",
        sendnote: "",
        starttime: "",
        starttimestr: ""
      },
      repair3: {
        note: ""
      },
      showCalendar: false
    };
  },

  components: { quickReplies },

  methods: {
    //选择维修人
    selectRepairer(item) {
      this.repair1.repairerid = item.ID;
      this.repair1.repairername = item.NAME;
    },
    //设置维修时间
    onRepairTimeConfirm(time) {
      this.showCalendar = false;
      let YYYY = time.getFullYear();
      let MM = time.getMonth() + 1;
      let DD = time.getDate();
      MM = MM < 10 ? "0" + MM : MM;
      DD = DD < 10 ? "0" + DD : DD;
      this.repair1.starttime = `${YYYY}${MM}${DD}`;
      this.repair1.starttimestr = `${YYYY}年${MM}月${DD}日`;
    },
    showConfirm() {
      this.$refs["distributeform"].validate().then(() => {
        if (this.reportForm.handletype == 1) {
          this.reDis = true;
        } else {
          this.stoprepair = true;
        }
      });
    },
    change() {
      if (this.loading) return;
      this.$refs["distributeform"].validate().then(flag => {
        this.loading = true;
        let upData = {
          id: this.reportForm.repairid,
          status: this.reportForm.handletype
        };
        if (upData.status == 1) {
          upData.starttime = this.repair1.starttime;
          upData.repairerid = this.repair1.repairerid;
          upData.repairername = this.repair1.repairername;
          upData.sendnote = this.repair1.sendnote;
        } else {
          upData.repairnote = this.repair3.note;
        }

        this.util
          .postAjax({
            code: this.global.code,
            url: "/repair/edit",
            isRep: true,
            data: upData
          })
          .then(res => {
            if (res.success) {
              Notify({ type: "success", message: "修改成功！" });
              setTimeout(() => {
                this.$router.push("/distributeList");
              }, 1500);
            } else {
              Notify({ type: "danger", message: "修改失败！" });
              this.loading = false;
            }
          })
          .catch(err => {
            this.loading = false;
            Notify({ type: "danger", message: "修改失败！" });
          });
      });
    },
    //获取维修共
    getRepairers() {
      this.util
        .postAjax({
          code: this.global.authCode,
          url: "rest/UserGroup/getUserByGroup2Role",
          data: {
            GROUPID: this.$store.state.userInfo.userOrgId,
            ROLEID: "9100002njit2-4"
          }
        })
        .then(res => {
          if (res.success) {
            this.repairers = res.items;
          }
        });
    },
    getnote1(content) {
      this.repair1.sendnote = content;
    },
    getnote3(content) {
      this.repair3.note = content;
    },
    //获取维修单信息
    getRepairInfo() {
      this.util
        .postAjax({
          code: this.global.code,
          url: "/repair/findById",
          data: {
            id: this.$route.params.id
          }
        })
        .then(res => {
          if (res.success) {
            let repairInfo = res.data;
            this.repair1 = {
              repairerid: repairInfo.repairerid,
              repairername: repairInfo.repairername,
              sendnote: repairInfo.sendnote,
              starttime: repairInfo.starttime,
              starttimestr: this.util.formatTime(
                repairInfo.starttime,
                "YYYY-MM-DD"
              )
            };
          }
        });
    }
  },
  created() {
    // this.reportForm.mobile = localStorage.getItem("mobile") || "";
    this.getRepairers();
    this.reportForm.repairid = this.$route.params.id;
    this.getRepairInfo();
  }
};
</script>
<style lang="scss" scoped>
.labeltitle {
  font-size: 16px;
  font-weight: 400;
  color: #333333;
  height: 48px;
  line-height: 48px;
  padding-left: 16px;
}
.reportform {
  // margin-top: 6px;
  background-color: #fff;
  padding-bottom: 20px;
  & /deep/ .van-cell__title + .van-cell__value.van-field__value {
    display: none;
  }
  & /deep/ .van-calendar__selected-day {
    background-color: rgba(99, 141, 236, 1);
  }
  & /deep/ .van-calendar__footer .van-button--danger {
    background-color: rgba(99, 141, 236, 1);
    border-color: rgba(99, 141, 236, 1);
  }
  .selecters {
    margin-left: 15px;
  }
  .selectbtns {
    display: inline-block;
    margin-right: 12px;
    width: 163px;
    height: 40px;
    text-align: center;
    border-radius: 4px;
    line-height: 40px;
    border: 1px solid rgba(147, 146, 142, 1);
    color: rgba(147, 146, 142, 1);
    &.active {
      background-color: rgba(99, 141, 236, 1);
      border: 1px solid rgba(99, 141, 236, 1);
      color: #fff;
    }
  }
  .workselectbtns {
    height: 28px;
    background: #ffffff;
    border-radius: 14px;
    border: 1px solid #dbdbdb;
    padding: 0 10px;
    text-align: center;
    line-height: 28px;
    display: inline-block;
    margin-bottom: 8px;
    margin-right: 12px;
    &.active {
      background: #eff3fd;
      border: 1px solid #638dec;
      color: rgba(99, 141, 236, 1);
    }
  }
  .flexselectbtns {
    display: inline-block;
    margin-right: 6px;
    padding: 0 12px;
    height: 40px;
    text-align: center;
    border-radius: 4px;
    line-height: 40px;
    border: 1px solid rgba(147, 146, 142, 1);
    color: rgba(147, 146, 142, 1);
    &.active {
      background-color: rgba(99, 141, 236, 1);
      border: 1px solid rgba(99, 141, 236, 1);
      color: #fff;
    }
  }
  .fieldbottom {
    padding: 0;
    margin: 0 16px;
    border-bottom: 1px solid rgba(219, 219, 219, 1);
    width: 90%;
    min-height: 45px;
    line-height: 45px;
  }
  & /deep/ .van-cell::after {
    border-bottom: 1px solid #fff;
  }
  .fieldbottom.deptname {
    margin-top: 16px;
    margin-bottom: 16px;
    margin-left: 0;
    margin-right: 0;
    width: 100%;
  }
  .forms {
    // padding: 0 16px;
    margin-top: 16px;
    .half {
      display: inline-block;
      width: 44%;
      height: 30px;
      line-height: 30px;
      margin: 0;
    }
    & > span {
      display: inline-block;
      width: 30px;
      text-align: center;
      height: 30px;
      line-height: 30px;
      position: relative;
      top: -10px;
      font-size: 14px;
    }
  }
}
.popupsearch {
  width: 100%;
  position: fixed;
  top: 40%;
}
.deptinfos {
  margin-left: 23px;
  line-height: 16px;
  font-size: 14px;
  margin-bottom: 16px;
  color: rgba(0, 0, 0, 0.7);
}
.popuplist {
  margin-top: 60px;
}
.withdrawbtn {
  width: 100%;
  padding-top: 20px;
  padding-bottom: 20px;
  text-align: center;
  background-color: rgba(246, 246, 246, 1);
  & .btn {
    width: 90%;
  }
}
.quicks {
  padding: 0 12px;
}
.confirm {
  width: 80%;
  height: 250px;
  text-align: center;
  border-radius: 10px;
  h1 {
    font-size: 16px;
    font-weight: 600;
    color: #2a2e2e;
    margin-top: 32px;
  }
  .deslable {
    text-align: left;
    font-size: 14px;
    font-weight: 400;
    color: #5f6464;
    line-height: 21px;
    padding: 0 24px;
    margin-top: 16px;
  }
  .continuebtn {
    width: 60%;
    height: 40px;
    background: #638dec;
    border-radius: 5px;
    font-size: 17px;
    font-weight: 400;
    color: #ffffff;
    line-height: 40px;
    margin: 0 auto;
    margin-top: 40px;
    &.close {
      background: #fff;
      color: rgba(153, 153, 153, 1);
      margin-top: 0px;
      font-size: 14px;
    }
  }
}
</style>
