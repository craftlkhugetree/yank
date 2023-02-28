<template>
  <div class="orderHistoryContent">
    <ul class="tabs clearfix">
      <li v-for="(v,i) in tablist" @click="changetab(v.id)" :class="{'act':v.id==num}" :key="i">
        {{v.name}}
        <i></i>
      </li>
    </ul>
    <van-list
      class="orderHistorybox"
      v-if="num=='1'"
      v-model="mySendLoading"
      :finished="mySendFinshed"
      finished-text="没有更多了"
      @load="getMoitorHistory"
    >
      <div class="single" v-for="(v,i) in mySendList" :key="i">
        <h3>
          <span>{{v.sectionname}}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{{v.seatname}}号座</span>
        </h3>
        <p>{{v.showtime}}</p>
      </div>
    </van-list>
    <van-list
      class="orderHistorybox"
      v-else
      v-model="myReceivedLoading"
      :finished="myReceivedFinshed"
      finished-text="没有更多了"
      @load="getMoitorHistory"
    >
      <div class="single" v-for="(v,i) in myReceivedList" :key="i">
        <h3>
          <span>{{v.sectionname}}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{{v.seatname}}号座</span>
        </h3>
        <p>{{v.showtime}}</p>
      </div>
    </van-list>
    <div class="bottom">
      <div @click="goperson">返 回</div>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      tablist: [
        { name: "我提交的", id: "1" },
        { name: "我收到的", id: "2" }
      ],
      num: "1",
      page: 1,
      limit: 10,
      mySendList: [],
      myReceivedList: [],
      mySendLoading: false,
      mySendFinshed: false,
      myReceivedLoading: false,
      myReceivedFinshed: false
    };
  },
  methods: {
    goperson() {
      this.$router.push("person");
    },
    changetab(id) {
      this.num = id;
      this.page = 1;
      this.mySendList = [];
      this.myReceivedList = [];
      if (this.num == 1) {
        this.mySendLoading = true;
        this.myReceivedLoading = false;
      } else {
        this.mySendFinshed = false;
        this.myReceivedLoading = true;
      }
      this.getMoitorHistory();
    },
    getMoitorHistory(){
      this.util
        .postAjax({
          code: this.code.base,
          url: this.num == 1?this.code.mySend:this.code.myReceived,
          data: {
            filter: {
              issign: this.num == 1 ? "1" : "0"
            },
            limit: this.limit,
            page: this.page
          },
          isRep: true
        })
        .then(res => {
          if (res.success) {
            var data = res.data;
            if (data.length < this.limit || data.length === 0) {
              if (this.num == 1) {
                this.mySendLoading = false;
                this.mySendFinshed = true;
              } else {
                this.myReceivedLoading = false;
                this.myReceivedFinshed = true;
              }
            } else {
              if (this.num == 1) {
                this.mySendLoading = false;
                this.mySendFinshed = false;
              } else {
                this.myReceivedLoading = false;
                this.myReceivedFinshed = false;
              }
              this.page++;
            }
            data.forEach(e => {
              e.showtime =
                e.createtime.substring(0, 4) +
                "-" +
                e.createtime.substring(4, 6) +
                "-" +
                e.createtime.substring(6, 8) +
                " " +
                e.createtime.substring(8, 10) +
                ":" +
                e.createtime.substring(10, 12) +
                ":" +
                e.createtime.substring(12, 14);
              if (this.num == 1) {
                this.mySendList.push(e);
              } else {
                this.myReceivedList.push(e);
              }
            });
          } else {
            this.Toast(res.data.message);
          }
        })
    },

  },
  created() {
    // this.getOrderHistory();
  }
};
</script>
<style scoped>
.orderHistoryContent > .orderHistorybox {
  width: 100%;
  margin-top: 24px;
  padding-bottom: 3rem;
  box-sizing: border-box;
}
.orderHistoryContent > .orderHistorybox > div.single {
  width: 100%;
  background: #ffffff;
  box-shadow: 0px -1px 0px 0px #eeeeee;
  padding: 30px;
  box-sizing: border-box;
}
.orderHistoryContent > .orderHistorybox > div > h3 {
  width: 100%;
  font-size: 30px;
  font-weight: 400;
  color: #222222;
  line-height: 42px;
  margin-bottom: 20px;
}
.orderHistoryContent > .orderHistorybox > div > h3 > span {
  display: inline-block;
  width: calc(100% - 1.6rem);
}
.orderHistoryContent > .orderHistorybox > div > h3 > i {
  display: inline-block;
  width: 48px;
  height: 36px;
  background: url(../../../static/img/nosignicon.png) no-repeat center center;
  background-size: cover;
  border-radius: 4px;
  position: absolute;
  right: 20px;
}
.orderHistoryContent > .orderHistorybox > div > h3 > i.sign {
  background: url(../../../static/img/signicon.png) no-repeat center center;
  background-size: cover;
}
.orderHistoryContent > .orderHistorybox > div > h3 > i.cancel  {
  width: 68px;
  background: url(../../../static/img/yqx.png) no-repeat center center;
  background-size: cover;
}
.orderHistoryContent > .orderHistorybox > div > h3 > i.quit  {
  width: 68px;
  background: url(../../../static/img/ytz.png) no-repeat center center;
  background-size: cover;
}
.orderHistoryContent > .orderHistorybox > div > p {
  width: 100%;
  height: 36px;
  font-size: 28px;
  font-weight: 400;
  color: #999999;
  line-height: 40px;
}
.orderHistoryContent > .orderHistorybox > div > p > span {
  float: right;
  color: #f23c3c;
}

.orderHistoryContent > .tabs {
  width: 100%;
  height: 84px;
  background: #ffffff;
}
.orderHistoryContent > .tabs > li {
  width: calc(100% / 2);
  height: 100%;
  float: left;
  font-size: 34px;
  font-weight: 400;
  color: #333333;
  line-height: 84px;
  text-align: center;
  position: relative;
}
.orderHistoryContent > .tabs > li.act{color: #ffa033;}
.orderHistoryContent > .tabs > li.act > i {
  width: 150px;
  height: 4px;
  background: #ffa033;
  border-radius: 2px;
  position: absolute;
  bottom: 0;
  left: calc(43% - 50px);
}
</style>
