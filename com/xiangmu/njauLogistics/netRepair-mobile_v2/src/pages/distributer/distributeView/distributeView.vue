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
    <div>
      <!-- 接报修 -->
      <div class="handler" v-if="info.applystatus === '2'">
        <van-button class="halfbtn" type="info" @click="toHandle"
          >办理</van-button
        >
        <van-button class="halfbtn" plain type="info" @click="toCallback"
          >退回</van-button
        >
      </div>
      <div class="repairinfo" v-if="info.applystatus === '3'">
        <h1 class="labeltitle">维修信息</h1>
        <div class="status3info">
          <p>
            <span>维修人：{{ repairInfo.repairername }}</span>
            <span style="float: right"
              >维修时间：{{
                util.formatTime(repairInfo.repairtime, "YYYY-MM-DD")
              }}</span
            >
          </p>
          <p>维修说明：{{ repairInfo.note }}</p>
        </div>
        <div class="handler">
          <van-button class="fullbtn" type="info" @click="toChangeOrder"
            >修改</van-button
          >
        </div>
      </div>
      <h2 v-if="relationApplys.length">关联报修单</h2>
      <div class="relations" v-if="relationApplys.length">
        <listItem
          class="listitem"
          v-for="item in relationApplys"
          :key="item.id"
          :info="item"
        >
          <div slot="states">
            <div class="orderbtns clearfix">
              <!-- <span class="orderstate"> {{ item.statusname }} </span> -->
              <div class="btns">
                <!-- <span class="btn gray">评价</span> -->
                <span class="btn" @click="toView(item.id)">查看更多</span>
              </div>
            </div>
          </div>
        </listItem>
      </div>
    </div>
    <h2>
      报修单进展<span class="repairdept">维修单位：{{ repairdeptname }}</span>
    </h2>
    <div class="progresslist">
      <orderProgress :events="events" v-if="events.length"></orderProgress>
    </div>
  </div>
</template>

<script>
import { Notify } from "vant";
import { setListInfo } from "@/assets/js/global";
import listItem from "@/components/listItem.vue";
import orderProgress from "@/components/orderProgress.vue";
import orderInfo from "@/components/orderInfo.vue";
export default {
  data() {
    return {
      info: {},
      events: [],
      relationApplys: [],
      repairdeptname: "",
      repairInfo: {
        repairername: "",
        repairtime: "",
        note: "",
        id: "",
      },
    };
  },
  components: { orderInfo, orderProgress, listItem },

  methods: {
    toView(id) {
      this.$router.push({
        name: "distributeView",
        params: { id: id },
      });
    },
    //维修负责人--处理单子（派单重复保修暂不维修已维修
    toHandle() {
      this.$router.replace({
        name: "handleDistribute",
        params: { id: this.info.id },
      });
    },
    //退回单子
    toCallback() {
      this.$router.push({
        name: "callbackDistribute",
        params: { id: this.info.id },
      });
    },
    //重新办理
    toChangeOrder() {
      console.log(this.repairInfo.id);
      this.$router.push({
        name: "changeDistribute",
        params: { id: this.repairInfo.id },
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
            this.info = setListInfo(res.data);
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
                  this.repairdeptname =
                    res.items[
                      _.findIndex(res.items, { ID: this.info.repairdeptid })
                    ].NAME;
                }
              });
            let repairId = "";
            this.events.push({
              eventtitle: "报修",
              createtime: this.info.createtime,
              note: "发起报修",
              id: "0001",
            });
            res.data.events.reverse();
            _.map(res.data.events, (event) => {
              //如果订单当前是在维修，那么就请求维修信息
              if (event.repairid) {
                repairId = event.repairid;
                this.repairInfo.id = event.repairid;
              }
            });
            //获取维修单信息
            if (repairId) {
              this.util
                .postAjax({
                  code: this.global.code,
                  url: "/repair/findById",
                  data: {
                    id: repairId,
                  },
                })
                .then((res) => {
                  // debugger
                  if (res.data.relationApplys.length) {
                    let index = _.findIndex(res.data.relationApplys, {
                      id: this.$route.params.id,
                    });
                    res.data.relationApplys.splice(index, 1);
                    this.relationApplys = _.map(
                      res.data.relationApplys,
                      (applys) => {
                        return setListInfo(applys);
                      }
                    );
                  }
                  this.repairInfo = {
                    repairername: res.data.repairername,
                    repairtime: res.data.starttime,
                    note: res.data.sendnote,
                    id: repairId,
                  };
                });
            }

            _.forEach(res.data.events, (event, index) => {
              if (event.photos) {
                event.photos = event.photos.split(",");
              }
              //type是4，handletype是1，维修负责人派单给维修工，创建了维修单，所以需要请求维修单的信息
              if (event.type === "4" && event.handletype === "1") {
                this.events.push({
                  eventtitle: "派单",
                  handletype: "1",
                  createtime: event.createtime,
                  type: "4",
                  id: event.repairid,
                  createrid: event.createrid,
                });
              }
              //type是4，handletype是4的时候是关联了其他单子，被视作派出了维修单，需要维修单信息
              if (event.type === "4" && event.handletype === "4") {
                this.events.push({
                  eventtitle: "派单",
                  handletype: "1",
                  createtime: event.createtime,
                  type: "4",
                  id: event.repairid,
                  createrid: event.createrid,
                });
              }
              //type是4，handletype是2，3是直接选择了维修完，所以不需要请求维修单
              if (event.type === "4" && event.handletype === "2") {
                this.events.push({
                  eventtitle: "维修完工",
                  createtime: event.createtime,
                  creatername: event.creatername,
                  createrid: event.createrid,
                  note: event.note,
                  type: "4",
                  id: "self",
                });
              }
              if (event.type === "4" && event.handletype === "3") {
                this.events.push({
                  eventtitle: "维修完工",
                  createtime: event.createtime,
                  creatername: event.creatername,
                  note: event.note,
                  createrid: event.createrid,
                  type: "4",
                  id: "self",
                });
              }
              // type是5，handletype是3表示已经维修完
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
  },
  created() {
    this.getOrderInfo();
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
.labeltitle {
  height: 48px;
  font-size: 16px;
  font-weight: 400;
  color: #333333;
  line-height: 48px;
  padding-left: 16px;
  background-color: rgba(246, 246, 246, 1);
}
.status3info {
  background-color: #fff;
  padding: 0 16px;
  padding-top: 16px;
  font-size: 12px;
  font-weight: 400;
  color: #666666;
  line-height: 18px;
  p {
    padding-bottom: 12px;
  }
}
h2 {
  font-size: 16px;
  font-weight: 400;
  color: #333333;
  line-height: 48px;
  padding-left: 16px;
  background-color: rgba(246, 246, 246, 1);
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
.relations {
  padding: 12px;
  padding-bottom: 0px;
  background-color: #fff;
  & /deep/ .item.listitem {
    background-color: rgba(246, 246, 246, 1);
  }
  & /deep/ .orderinfos .leftinfo .ordercontent .more {
    background-color: rgba(246, 246, 246, 1);
  }
}
</style>