<template>
  <div>
    <van-nav-bar title="维修办理" left-arrow fixed @click-left="$router.go(-1)" />
    <div style="width: 100%; height: 46px"></div>
    <h1 class="labeltitle">报修信息</h1>
    <van-form class="reportform" ref="distributeform" :colon="true" :show-error-message="false">
      <van-field
        v-model="reportForm.handletype"
        label="维修类型"
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
        >{{ item.name }}</span>
      </div>
      <div class="selectforms">
        <!-- 派单的表单 -->
        <div class="forms forms1" v-show="reportForm.handletype == '1'">
          <van-field
            v-model="repair1.repairerid"
            label="维修人"
            :rules="[
              { required: reportForm.handletype == '1', message: '请填写' },
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
            >{{ item.NAME }}</span>
          </div>
          <van-field
            class="fieldbottom"
            readonly
            v-model="repair1.repairername"
            placeholder="请选择维修人"
            right-icon="arrow"
            :rules="[
              { required: reportForm.handletype == '1', message: '请填写' },
            ]"
          />
          <!-- 维修时间 -->
          <van-field
            v-model="repair1.starttime"
            label="维修时间"
            :rules="[
              { required: reportForm.handletype == '1', message: '请填写' },
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
              { required: reportForm.handletype == '1', message: '请填写' },
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
            <quickReplies type="3" :height="180" @userReply="getnote1"></quickReplies>
          </div>
        </div>
        <!-- 重复报修的表单 -->
        <div class="forms forms2" v-show="reportForm.handletype === '4'">
          <van-field v-model="repair4.repairid" label="关联单" :required="true" />
          <van-field
            class="fieldbottom"
            readonly
            v-model="repair4.repairname"
            placeholder="请选择关联单"
            right-icon="arrow"
            @click="showPicker = true"
            :rules="[
              {
                required: reportForm.handletype === '4',
                message: '请选择关联单',
              },
            ]"
          />
        </div>
        <!-- 暂不维修的表单 -->
        <div class="forms forms3" v-show="reportForm.handletype === '3'">
          <van-field v-model="repair3.note" label="退回说明" :required="true" />
          <van-field
            type="textarea"
            :rows="3"
            v-model="repair3.note"
            class="fieldbottom"
            placeholder="请输入说明，不超过200字"
            :maxlength="200"
            :rules="[
              { required: reportForm.handletype === '3', message: '请填写' },
            ]"
          />
          <div class="quicks">
            <quickReplies type="5" :height="180" @userReply="getnote3"></quickReplies>
          </div>
        </div>
        <!-- 已维修的表单 -->
        <div class="forms forms3" v-show="reportForm.handletype === '2'">
          <van-field v-model="repair2.note" label="退回说明" :required="true" />
          <van-field
            type="textarea"
            :rows="3"
            v-model="repair2.note"
            class="fieldbottom"
            placeholder="请输入说明，不超过200字"
            :maxlength="200"
            :rules="[
              { required: reportForm.handletype === '2', message: '请填写' },
            ]"
          />
          <div class="quicks">
            <quickReplies type="4" :height="180" @userReply="getnote2"></quickReplies>
          </div>
        </div>
        <!-- 不维修的表单 -->
        <div class="forms forms3" v-show="reportForm.handletype === '5'">
          <van-field v-model="repair5.note" label="不维修说明" :required="true" />
          <van-field
            type="textarea"
            :rows="3"
            v-model="repair5.note"
            class="fieldbottom"
            placeholder="请输入说明，不超过200字"
            :maxlength="200"
            :rules="[
              { required: reportForm.handletype === '5', message: '请填写' },
            ]"
          />
          <div class="quicks">
            <quickReplies type="6" :height="180" @userReply="getnote5"></quickReplies>
          </div>
        </div>
      </div>
    </van-form>
    <div class="withdrawbtn">
      <van-button class="btn" @click="handle" :disabled="loading" type="info" icon="checked">提交</van-button>
    </div>
    <!-- 订单弹窗 -->
    <van-popup v-model="showPicker" position="bottom" :style="{ height: '60%' }">
      <van-field
        v-model="searchInput"
        placeholder="请输入报修单名称"
        right-icon="search"
        class="popupsearch"
        size="large"
        @keypress.native.enter="getOrders"
        @change="getOrders"
      />
      <van-list class="popuplist">
        <p
          class="deptinfos"
          v-for="item in orders"
          :key="item.id"
          @click="setOrder(item)"
        >{{ item.title }}</p>
      </van-list>
    </van-popup>
  </div>
</template>

<script>
import { Notify } from "vant";
import quickReplies from "@/components/quickReplies";
export default {
  data() {
    return {
      loading: false,
      batchArr: [],
      repairers: [],
      orders: [],
      handletype: [
        { name: "派单", id: "1" },
        { name: "重复报修", id: "4" },
        { name: "暂不维修", id: "3" },
        { name: "已维修", id: "2" },
        { name: "不维修", id: "5" }
      ],
      reportForm: {
        handletype: "1"
      },
      repair1: {
        repairerid: "",
        repairername: "",
        sendnote: "",
        starttime: "",
        starttimestr: ""
      },
      repair4: {
        repairid: "",
        repairname: ""
      },
      repair3: {
        note: ""
      },
      repair2: {
        note: ""
      },
      repair5: {
        note: ""
      },
      showCalendar: false,
      showPicker: false,
      searchInput: ""
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
    //设置关联的订单
    setOrder(item) {
      this.showPicker = false;
      this.repair4.repairid = item.id;
      this.repair4.repairname = item.title;
    },
    handle() {
      if (this.loading) return;
      this.$refs["distributeform"].validate().then(flag => {
        this.loading = true;
        let upData = this.reportForm;
        if (upData.handletype == 1) {
          upData.repair = this.repair1;
        } else {
          _.assign(upData, this[`repair${upData.handletype}`]);
        }

        let arr = this.batchArr.map(i => {
          return {
            type: "4",
            applyid: i.id,
            version: i.version,
            ...upData
          };
        });
        this.util
          .postAjax({
            code: this.global.code,
            url: "/apply/handleBatch",
            isRep: true,
            data: arr
          })
          .then(res => {
            if (res.success) {
              Notify({ type: "success", message: "办理成功！" });
              setTimeout(() => {
                this.$router.push("/distributeList");
              }, 1500);
            } else {
              Notify({ type: "danger", message: "办理失败！" });
              this.loading = false;
            }
          })
          .catch(err => {
            this.loading = false;
            Notify({ type: "danger", message: "办理失败！" });
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
            ROLEID: "9100002-4"
          }
        })
        .then(res => {
          if (res.success) {
            this.repairers = res.items;
          }
        });
    },
    //获取关联保修单
    getOrders() {
      this.util
        .postAjax({
          code: this.global.code,
          url: "/repair/repairs",
          isRep: true,
          data: {
            status: "1",
            title: this.searchInput,
            repairdeptid: this.$store.state.userInfo.userOrgId || ""
          }
        })
        .then(res => {
          if (res.success) {
            this.orders = res.data;
          }
        });
    },
    getnote1(content) {
      this.repair1.sendnote = content;
    },
    getnote3(content) {
      this.repair3.note = content;
    },
    getnote2(content) {
      this.repair2.note = content;
    },
    getnote5(content) {
      this.repair5.note = content;
    }
  },
  created() {
    // this.reportForm.mobile = localStorage.getItem("mobile") || "";
    this.getRepairers();
    this.getOrders();
    let batchArr = sessionStorage.getItem("batchArr");
    if (batchArr) {
      this.batchArr = JSON.parse(batchArr);
    }
  }
};
</script>
<style lang='scss' scoped>
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
    margin-bottom: 10px;
    width: 77px;
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
</style>