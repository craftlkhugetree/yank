<template>
  <div class="monitor_content">
    <h3>请选择举报类型</h3>
    <p>占座举报</p>
    <div>
      <div v-for="(v,i) in monitorType" :key="i" @click="selectmonitorType(v.id)">
        <div v-if="v.id=='1'" class="needSeat" :class="{'needSeatact':needSeat=='1'}"></div>
        <div v-if="v.id=='0'" class="noneedSeat" :class="{'noneedSeatact':needSeat=='0'}"></div>
        <p>{{v.name}}</p>
      </div>
    </div>
    <span class="sure_no" v-if="!needSeat">确 定</span>
    <span class="sure" :class="{'isBlack':isBlack}" v-else @click="suremonitorType">确 定</span>
    <span @click="back">返 回</span>
    <div class="bottom"></div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      monitorType: [
        { name: "需要座位", id: "1" },
        { name: "不需要座位", id: "0" }
      ],
      needSeat: "", //是否需要座位
      isBlack: "",
      usingDetail: "",
      signList: ""
    };
  },
  methods: {
    selectmonitorType(id) {
      // console.log('id', id,this.usingDetail)
      if (this.isBlack) {
        return;
      }
      if (id == 1) {
        if (this.usingDetail.sectionid || this.signList.sectionid) {
          this.Toast("您当前已有座位");
          return;
        }
      }
      this.needSeat = id;
    },
    suremonitorType() {
      window.sessionStorage.removeItem("monotorText");
      window.sessionStorage.removeItem("monotorFiles");
      this.$router.push({
        path: "writemonitor",
        query: {
          roomname: "",
          roomid: "",
          type: this.needSeat
        }
      });
    },
    back() {
      this.$router.push("/");
    },
    getUseing() {
      this.util
        .postAjax({
          code: this.code.base,
          url: this.code.isuseing,
          isRep: true
        })
        .then(res => {
          if (res.success) {
            if (res.data) {
              this.usingDetail = res.data;
            }
          }
        });
    },
    getsignRemind() {
      this.util
        .postAjax({
          code: this.code.base,
          url: this.code.signRemind,
          isRep: true
        })
        .then(res => {
          if (res.success) {
            if (res.data) {
              this.signList = res.data;
            } else {
              this.signList = "";
            }
          }
        });
    }
  },
  created() {
    this.getUseing();
    this.getsignRemind();
    this.isBlack = this.$store.state.BlackText.isBlack;
  }
};
</script>
<style scoped>
.monitor_content {
  padding-top: 2rem;
  box-sizing: border-box;
  text-align: center;
}
.monitor_content > h3 {
  width: 100%;
  height: 67px;
  font-size: 39px;
  font-weight: 550;
  color: #333333;
  line-height: 67px;
  letter-spacing: 1px;
  text-align: center;
  margin-bottom: 12px;
}
.monitor_content > p {
  width: 100%;
  height: 50px;
  font-size: 36px;
  font-weight: 400;
  color: #999999;
  line-height: 50px;
  text-align: center;
  margin-bottom: 120px;
}
.monitor_content > div {
  text-align: center;
  box-sizing: border-box;
  margin-bottom: 200px;
  padding: 0 30px;
  display: flex;
  justify-content: space-around;
}
.monitor_content > div.bottom {
  width: 100%;
  height: 2.84rem;
  position: fixed;
  left: 0;
  bottom: 0;
  padding: 0;
  margin-bottom: 0;
  background: url(../../../static/img/monitorback.png) no-repeat center center;
  background-size: cover;
  z-index: -1;
}
.monitor_content > div > div {
  width: 160px;
  height: 160px;
  /* width: calc(calc(100% - 3.68rem) / 2);
  height: 100%;
  float: left; */
}
.monitor_content > div > div:first-of-type {
  /* margin-right: 3.68rem; */
}
.monitor_content > div > div > div {
  width: 100%;
  background: yellow;
  margin-bottom: 0.4rem;
}
.monitor_content > div > div > div.needSeat {
  background: url(../../../static/img/needSeat.png) no-repeat center center;
  background-size: cover;
}
.monitor_content > div > div > div.needSeat.needSeatact {
  border-radius: 50%;
  background: url(../../../static/img/needSeat_act.png) no-repeat center center;
  background-size: cover;
}
.monitor_content > div > div > div.noneedSeat.noneedSeatact {
  border-radius: 50%;
  background: url(../../../static/img/noSeat_act.png) no-repeat center center;
  background-size: cover;
}
.monitor_content > div > div > div.noneedSeat {
  background: url(../../../static/img/noSeat.png) no-repeat center center;
  background-size: cover;
}
.monitor_content > div > div > p {
  width: 100%;
  height: 42px;
  font-size: 30px;
  font-weight: 400;
  color: #666666;
  line-height: 42px;
  text-align: center;
}
.monitor_content > div > div > div::before {
  content: "";
  padding-top: 100%;
  display: block;
}
.monitor_content > span {
  display: inline-block;
  width: calc(100% - 60px);
  height: 84px;
  background: #ffffff;
  border-radius: 44px;
  border: 2px solid #cccccc;
  font-size: 30px;
  font-weight: 500;
  line-height: 84px;
  color: #333333;
}
.monitor_content > span.sure {
  background: linear-gradient(90deg, #ffd200 0%, #ffa033 100%);
  box-shadow: 0rem 5px 0.25rem 0rem rgba(202, 108, 0, 0.25);
  margin-bottom: 40px;
  border: none;
  color: #ffffff;
}
.monitor_content > span.sure_no {
  background: #dddddd;
  margin-bottom: 40px;
  border: none;
  color: #999999;
}
</style>