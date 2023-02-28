<template>
  <div>
    <van-nav-bar title="查看报修单" left-arrow fixed @click-left="$router.go(-1)" />
    <div style="width:100%;height:46px;"></div>
    <orderInfo
      class="orderInfo"
      v-if="info.createtime"
      :info="info"
      :showApplyer="false"
    ></orderInfo>
    <h2>
      报修单进展 <span class="repairdept">维修单位：{{ repairdeptname }}</span>
    </h2>
    <div class="progresslist">
      <orderProgress :events="events" v-if="events.length"></orderProgress>
    </div>
    <div v-if="showRate" class="rateform">
      <h2>维修评价</h2>
      <div class="replybtn clearfix">
        <img
          src="../../../../static/images/nodata.png"
          alt=""
          width="80px"
          height="80px"
        />
        <div class="labels">
          <p>还没收到你的评价信息</p>
          <button @click="toRate">立即评价</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { setListInfo, eventtype } from "@/assets/js/global";
import orderProgress from "@/components/orderProgress.vue";
// import quickReplies from "@/components/quickReplies.vue";
import orderInfo from "@/components/orderInfo.vue";

export default {
  data() {
    return {
      repairdeptname: "",
      info: {},
      events: [],
      showRate: false,
    };
  },
  components: { orderInfo, orderProgress },

  methods: {
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
            this.util
              .postAjax({
                code: this.global.authCode,
                url: "rest/UserGroup/getList",
                data: {
                  filter: JSON.stringify({
                    APPID: this.$store.state.GROUPID
                  }),
                  limit: 10000,
                  page: 1,
                  ISDELETE: "0"
                }
              })
              .then((res) => {
                if (res.success) {
                  this.repairdeptname =
                    res.items[
                      _.findIndex(res.items, { ID: this.info.repairdeptid })
                    ].NAME;
                }
              });
            this.events.push({
              eventtitle: "报修",
              createtime: this.info.createtime,
              note: "发起报修",
              id: "0001"
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
              //直接不维修
              if (event.type === "4" && event.handletype === "5") {
                this.events.push({
                  eventtitle: "不维修",
                  createtime: event.createtime,
                  creatername: event.creatername,
                  note: event.note,
                  createrid: event.createrid,
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
            });
            this.events.reverse();
            //判断何时出现评价按钮
            if (
              res.data.applyerid === this.$store.state.userInfo.userId &&
              this.info.applystatus == "4"
            ) {
              this.showRate = true;
            }
          }
        });
    },
    toRate() {
      this.$router.push({
        name: "rate",
        params: { id: this.info.id,version:this.info.version },
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
h2 {
  font-size: 16px;
  font-weight: 400;
  color: #333333;
  line-height: 48px;
  padding-left: 16px;
  background-color: rgba(246, 246, 246, 1);
}
.replybtn {
  width: 60%;
  margin: 0 auto;
  padding: 40px 0;
  background-color: #fff;
  img {
    float: left;
    margin-right: 12px;
  }
  .labels {
    float: left;
    p {
      font-size: 12px;
      font-weight: 400;
      color: #999999;
      line-height: 30px;
      height: 30px;
      margin-bottom: 8px;
    }
    button {
      width: 100%;
      height: 40px;
      background: #fd7d18;
      border-radius: 5px;
      border: none;
      color: #fff;
    }
  }
}
.rateform {
  background-color: #fff;
}
</style>
