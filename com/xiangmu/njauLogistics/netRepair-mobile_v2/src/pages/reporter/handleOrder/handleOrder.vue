<template>
  <div>
    <van-nav-bar
      title="查看报修单"
      left-arrow
      fixed
      @click-left="$router.go(-1)"
    />
    <div style="width: 100%; height: 46px"></div>
    <orderInfo
      :info="info"
      v-if="info.createtime"
      class="orderInfo"
    ></orderInfo>
    <div v-if="!showHandle" class="otherdept">
      维修部门：{{ repairDeptName }}
    </div>
    <div v-if="showHandle">
      <!-- 接报修 -->
      <div class="handler" v-if="info.applystatus === '1'">
        <van-button class="halfbtn" type="info" @click="openHandle"
          >办理</van-button
        >
        <van-button class="halfbtn" plain type="info" @click="openMove"
          >转移</van-button
        >
      </div>

      <div class="handler" v-if="info.applystatus === '2'">
        <van-button class="fullbtn" type="info" @click="toWithDraw"
          >撤回</van-button
        >
      </div>
    </div>
    <h2>
      报修单进展
      <span class="repairdept">维修单位：{{ repairDeptName }}</span>
    </h2>
    <div class="progresslist">
      <orderProgress :events="events" v-if="events.length"></orderProgress>
    </div>
    <!-- 接报修人员选择维修负责人弹窗 -->
    <van-popup
      v-model="handleVis"
      position="bottom"
      :style="{ height: '30%' }"
      :close-on-click-overlay="false"
      class="reportform"
    >
      <div class="popuptitle">
        <span class="cancel" @click="handleVis = false">取消</span>
        维修办理
        <span class="save" @click="saveOrderToRepairLeader">确认</span>
      </div>
      <van-form ref="handleForm" :show-error-message="false">
        <van-field
          class="selectfiled"
          clickable
          @click="repairleaderPick = true"
          v-model="repairleadername"
          label="维修负责人："
          :rules="[{ required: true, message: '请填写用户' }]"
        />
        <van-field
          readonly
          clickable
          v-model="repairleadername"
          @click="repairleaderPick = true"
          class="fieldbottom"
          :rules="[{ required: true, message: '请填写用户' }]"
        />
        <van-field v-show="false" v-model="repairleaderid" />
      </van-form>
    </van-popup>
    <!-- 维修负责人选择 -->
    <van-popup
      v-model="repairleaderPick"
      position="bottom"
      :style="{ height: '40%' }"
    >
      <van-picker
        value-key="NAME"
        show-toolbar
        @confirm="onRepairleaderConfirm"
        :columns="repairLeaders"
        @cancel="repairleaderPick = false"
      />
    </van-popup>
    <!-- 接报修人员转移弹窗 -->
    <van-popup
      v-model="moveVis"
      position="bottom"
      :style="{ height: '67%' }"
      :close-on-click-overlay="false"
      class="reportform"
    >
      <div class="popuptitle">
        <span class="cancel" @click="moveVis = false">取消</span>
        转移
        <span class="save" @click="moveOrder">确认</span>
      </div>
      <van-form ref="moveForm" :show-error-message="false">
        <van-field
          class="selectfiled"
          clickable
          @click="movePick = true"
          v-model="repairdeptname"
          label="维修单位："
          :rules="[{ required: true, message: '请选择单位' }]"
        />
        <van-field
          readonly
          clickable
          v-model="repairdeptname"
          @click="movePick = true"
          class="fieldbottom"
          :rules="[{ required: true, message: '请选择单位' }]"
        />
        <van-field v-show="false" v-model="repairdeptid" />
        <van-field v-model="note" label="转移描述" />
        <van-field
          type="textarea"
          :rows="3"
          v-model="note"
          class="fieldbottom"
          placeholder="请输入说明，不超过200字"
          :maxlength="200"
        />
        <van-field v-model="photosid" label="上传图片" />
        <upload :attaches="photos"></upload>
      </van-form>
    </van-popup>
    <!-- 维修负责人选择 -->
    <van-popup v-model="movePick" position="bottom" :style="{ height: '40%' }">
      <van-picker
        value-key="NAME"
        show-toolbar
        @confirm="onMoveConfirm"
        :columns="depts"
        @cancel="movePick = false"
      />
    </van-popup>
  </div>
</template>

<script>
import { Notify } from "vant";
import { setListInfo } from "@/assets/js/global";
import orderProgress from "@/components/orderProgress.vue";
import orderInfo from "@/components/orderInfo.vue";
import upload from "@/components/attaches.vue";
export default {
  data() {
    return {
      showHandle: false,
      repairDeptName: "",
      loading: false,
      info: {},
      events: [],
      //处理
      repairleadername: "",
      repairleaderid: "",
      handleVis: false,
      repairleaderPick: false,
      repairLeaders: [],
      //转移
      repairdeptname: "",
      repairdeptid: "",
      note: "",
      photos: [],
      photosid: "",
      moveVis: false,
      movePick: false,
      depts: [],
    };
  },
  components: { orderInfo, orderProgress, upload },
  watch: {
    photos(val) {
      this.photosid = val.join(",");
    },
  },
  methods: {
    //接报修-打开办理
    openHandle() {
      this.handleVis = true;
    },
    openMove() {
      this.moveVis = true;
    },
    //选择维修负责人
    onRepairleaderConfirm(leader) {
      this.repairleaderPick = false;
      this.repairleadername = leader.name;
      this.repairleaderid = leader.id;
    },
    //派单给维修负责人
    saveOrderToRepairLeader() {
      if (this.loading) {
        return;
      }
      this.loading = true;
      this.$refs["handleForm"].validate().then(() => {
        let data = {
          applyid: this.info.id,
          repairleadername: this.repairleadername,
          repairleaderid: this.repairleaderid,
        };
        this.util
          .postAjax({
            code: this.global.code,
            url: "apply/takeout",
            isRep: true,
            data: data,
          })
          .then((res) => {
            if (res.success) {
              Notify({ type: "success", message: "办理成功！" });
              setTimeout(() => {
                history.go(-1);
              }, 1500);
            } else {
              Notify({ type: "danger", message: "办理失败！" });
              this.loading = false;
            }
          })
          .catch((err) => {
            this.loading = false;
            Notify({ type: "danger", message: "办理失败！" });
          });
      });
    },
    //转移维修单
    moveOrder() {
      if (this.loading) {
        return;
      }

      this.$refs["moveForm"].validate().then(() => {
        let data = {
          applyid: this.info.id,
          repairdeptid: this.repairdeptid,
          note: this.note,
          photos: this.photosid,
        };
        this.loading = true;
        this.util
          .postAjax({
            code: this.global.code,
            url: "apply/move",
            isRep: true,
            data: data,
          })
          .then((res) => {
            if (res.success) {
              Notify({ type: "success", message: "转移成功！" });
              setTimeout(() => {
                history.go(-1);
              }, 1500);
            } else {
              Notify({ type: "danger", message: "转移失败！" });
              this.loading = false;
            }
          })
          .catch((err) => {
            this.loading = false;
            Notify({ type: "danger", message: "转移失败！" });
          });
      });
    },
    //选择转移的维修单位
    onMoveConfirm(dept) {
      this.movePick = false;
      this.repairdeptname = dept.name;
      this.repairdeptid = dept.id;
    },
    toWithDraw() {
      this.$router.push({
        name: "withdraw",
        params: { id: this.info.id },
      });
    },
    //获取单子信息
    getOrderInfo() {
      this.util
        .postAjax({
          code: this.global.code,
          url: "/apply/findById",
          data: {
            id: this.$route.params.id,
          },
        })
        .then((res) => {
          if (res.success) {
            let repairdeptid = res.data.repairdeptid;

            if (
              res.data.repairdeptid === this.$store.state.userInfo.userOrgId
            ) {
              this.showHandle = true;
            }

            // this.util
            //   .postAjax({
            //     code: this.global.code,
            //     url: "dept/depts",
            //     isRep: true,
            //     data: {},
            //   })
            this.util
              .postAjax({
                code: this.global.authCode,
                url: "rest/UserGroup/getUserGroup",
                data: {
                  appid: this.$store.state.GROUPID,
                },
              })
              .then((res) => {
                if (res.success) {
                  this.depts = [];
                  _.forEach(res.items, (dept) => {
                    if (dept.ID !== this.$store.state.userInfo.userOrgId) {
                      this.depts.push(dept);
                    }
                  });
                  this.repairDeptName =
                    res.items[_.findIndex(res.items, { ID: repairdeptid })].NAME;
                }
              });

            this.info = setListInfo(res.data);
            this.events.push({
              eventtitle: "报修",
              createtime: this.info.createtime,
              note: "发起报修",
              id: "0001",
            });
            res.data.events.reverse();
            _.forEach(res.data.events, (event, index) => {
              if (event.photos) {
                event.photos = event.photos.split(",");
              }
              if (event.type === "4" && event.handletype === "1") {
                this.events.push({
                  createrid: event.createrid,
                  eventtitle: "派单",
                  handletype: "1",
                  createtime: event.createtime,
                  type: "4",
                  id: event.repairid,
                });
              }
              if (event.type === "4" && event.handletype === "4") {
                this.events.push({
                  createrid: event.createrid,
                  eventtitle: "派单",
                  handletype: "1",
                  createtime: event.createtime,
                  type: "4",
                  id: event.repairid,
                });
              }
              if (event.type === "4" && event.handletype === "2") {
                this.events.push({
                  createrid: event.createrid,
                  eventtitle: "维修完工",
                  createtime: event.createtime,
                  creatername: event.creatername,
                  note: event.note,
                  type: "4",
                  id: "self",
                });
              }
              if (event.type === "4" && event.handletype === "3") {
                this.events.push({
                  createrid: event.createrid,
                  eventtitle: "维修完工",
                  createtime: event.createtime,
                  creatername: event.creatername,
                  note: event.note,
                  type: "4",
                  id: "self",
                });
              }
              if (event.type === "5") {
                if (event.handletype === "2") {
                  event.eventtitle = "维修完工";
                } else if (event.handletype === "3") {
                  event.eventtitle = "维修完工";
                  event.note = event.note || "【暂不维修】";
                } else {
                  event.eventtitle = "维修完工";
                }
                this.events.push(event);
              }
              if (event.type === "6") {
                event.eventtitle =
                  event.result == "1" ? "维修结束" : "维修未修复";
                event.markscore = this.info.markscore;
                this.events.push(event);
              }
              if (event.type === "3") {
                event.eventtitle = "退回";
                this.events.push(event);
              }
              if (event.type === "1") {
                event.eventtitle = "办理";
                this.events.push(event);
              }
              if (event.type === "2") {
                event.eventtitle = "撤回";
                this.events.push(event);
              }
              if (event.type === "9") {
                event.eventtitle = "转移";
                this.events.push(event);
              }
            });
            this.events.reverse();
          }
        });
    },
    //获取所有部门
    getAllDepts() {
      // this.util
      //   .postAjax({
      //     code: this.global.code,
      //     url: "dept/depts",
      //     isRep: true,
      //     data: {},
      //   })
      this.util
        .postAjax({
          code: global.authCode,
          url: "rest/UserGroup/getList",
          data: {
            filter: JSON.stringify({
              APPID: this.$store.state.GROUPID,
            }),
            limit: 10000,
            page: 1,
            ISDELETE: "0",
          },
        })
        .then((res) => {
          if (res.success) {
            this.depts = [];
            _.forEach(res.items, (dept) => {
              if (dept.ID !== this.$store.state.userInfo.userOrgId) {
                this.depts.push(dept);
              }
            });
          }
        });
    },
    //获取当前部门的维修负责人
    getRepairLeaders() {
      this.util
        .postAjax({
          code: this.global.authCode,
          url: "rest/UserGroup/getUserByGroup2Role",
          data: {
            GROUPID: this.$store.state.userInfo.userOrgId,
            ROLEID: "9100002njit-3",
          },
        })
        // this.util
        //   .postAjax({
        //     code: this.global.code,
        //     url: "user/wxfzrs",
        //     data: {
        //       deptid: this.$store.state.userInfo.userOrgId,
        //     },
        //   })
        .then((res) => {
          if (res.success) {
            this.repairLeaders = res.items;
            this.repairleadername = res.items[0].NAME;
            this.repairleaderid = res.items[0].ID;
          }
        });
    },
  },
  created() {
    this.getOrderInfo();
    // this.getAllDepts();
    this.getRepairLeaders();
  },
};
</script>
<style lang='scss' scoped>
.orderInfo {
  margin-top: 6px;
}
.handler {
  border-top: 1px solid rgba(219, 219, 219, 1);
  padding: 12px 16px;
  background-color: #fff;
  .halfbtn {
    width: 47%;
    height: 40px;
  }
  .halfbtn + .halfbtn {
    margin-left: 12px;
  }
  .fullbtn {
    width: 100%;
    height: 40px;
  }
}
h2 {
  font-size: 16px;
  font-weight: 400;
  color: #333333;
  line-height: 48px;
  margin-left: 16px;
}
.reportform {
  margin-top: 6px;
  background-color: #fff;
  padding-bottom: 40px;
  & /deep/ .van-cell__title + .van-cell__value.van-field__value {
    display: none;
  }
  & /deep/ .van-cell::after {
    border-bottom: 1px solid #fff;
  }
  .fieldbottom {
    padding: 0;
    margin: 0 16px;
    border-bottom: 1px solid rgba(219, 219, 219, 1);
    width: 90%;
  }
  .selectfiled {
    margin-top: 40px;
  }
}
.otherdept {
  font-size: 14px;
  font-weight: 400;
  color: #93928e;
  line-height: 21px;
  background-color: #fff;
  padding: 0 16px;
  padding-bottom: 16px;
}
</style>