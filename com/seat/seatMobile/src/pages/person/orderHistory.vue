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
      v-model="signLoading"
      :finished="signfinished"
      finished-text="没有更多了"
      @load="getOrderHistory"
    >
      <div class="single" v-for="(v,i) in signhistoryList" :key="i">
        <h3>
          <span>{{v.sectionname}} {{v.seatname}}号座</span>
          <i :class="{'sign':v.signtime}"></i>
        </h3>
        <p>{{v.showtime}}</p>
      </div>
    </van-list>
    <van-list
      class="orderHistorybox"
      v-else
      v-model="nosignLoading"
      :finished="nosignfinished"
      finished-text="没有更多了"
      @load="getOrderHistory"
    >
      <div class="single" v-for="(v,i) in nosignhistoryList" :key="i">
        <h3>
          <span>{{v.sectionname}} {{v.seatname}}号座</span>
          <i v-if="v.cancelreason=='用户取消'" class="cancel"></i>
          <i v-else-if="v.cancelreason=='用户退座'" class="quit"></i>
          <i v-else></i>
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
        { name: "已签到", id: "1" },
        { name: "未签到", id: "2" }
      ],
      num: "1",
      page: 1,
      limit: 10,
      signhistoryList: [],
      nosignhistoryList: [],
      signLoading: false,
      signfinished: false,
      nosignLoading: false,
      nosignfinished: false
    };
  },
  methods: {
    goperson() {
      this.$router.push("person");
    },
    changetab(id) {
      this.num = id;
      this.page = 1;
      this.signhistoryList = [];
      this.nosignhistoryList = [];
      if (this.num == 1) {
        this.signLoading = true;
        this.nosignLoading = false;
      } else {
        this.signfinished = false;
        this.nosignLoading = true;
      }
      this.getOrderHistory();
    },
    getOrderHistory() {
      this.util
        .postAjax({
          code: this.code.base,
          url: this.code.orderHistory,
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
                this.signLoading = false;
                this.signfinished = true;
              } else {
                this.nosignLoading = false;
                this.nosignfinished = true;
              }
            } else {
              if (this.num == 1) {
                this.signLoading = false;
                this.signfinished = false;
              } else {
                this.nosignLoading = false;
                this.nosignfinished = false;
              }
              this.page++;
            }
            data.forEach(e => {
              e.showtime =
                e.orderdate.substring(0, 4) +
                "-" +
                e.orderdate.substring(4, 6) +
                "-" +
                e.orderdate.substring(6, 8) +
                " " +
                e.starttime.substring(0, 2) +
                ":" +
                e.starttime.substring(2, 4) +
                "-" +
                e.endtime.substring(0, 2) +
                ":" +
                e.endtime.substring(2, 4);
              if (this.num == 1) {
                this.signhistoryList.push(e);
              } else {
                this.nosignhistoryList.push(e);
              }
            });
          } else {
            this.Toast(res.data.message);
          }
        });
    }
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
.orderHistoryContent > .tabs > li.act > i {
  width: 110px;
  height: 4px;
  background: #ffa033;
  border-radius: 2px;
  position: absolute;
  bottom: 0;
  left: calc(50% - 50px);
}
</style>
