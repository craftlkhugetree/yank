<template>
  <div class="appointlist_content">
    <div class="now_emptyseat appoint_emptyseat">
      <div v-if="appointList.length > 0">
        <!-- <div class="occupy_seat"> -->
        <van-list
          class="occupy_seat"
          v-model="appointLoading"
          :finished="appointfinished"
          finished-text="没有更多了"
          @load="getAppointLists"
        >
          <div v-for="(v, i) in appointList" :key="i">
            <div class="single_occupy_seat">
              <h3 v-if="v.islocakers == 1">
                <span>{{ v.name }}</span>
                <i>有柜子</i>
              </h3>
              <h3 v-else>{{ v.name }}</h3>
              <p v-if="v.orderunit == 'week'">
                开放时间：{{ v.starttime }}～{{ v.endtime }}
              </p>
              <p v-if="v.orderunit == 'day'">
                开放时间：{{ v.starttime }}～{{ v.endtime }}
              </p>
              <h4 :class="{ fulltext: v.unusenum == 0 }">
                当前剩余：{{ v.unusenum }}座
              </h4>
              <i
                @click="goAppoint(v)"
                :class="{ isBlack: isBlack }"
                v-if="v.unusenum != 0"
                >预约</i
              >
              <i class="full" v-else>满座</i>
            </div>
            <div class="occupySeat_line"></div>
          </div>
        </van-list>
        <!-- </div> -->
      </div>
      <div v-else class="nodata">暂无预约列表</div>
    </div>
    <div class="appointlist_bottom">
      <div @click="goback">返 回</div>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      showList: false,
      page: 1,
      limit: 10,
      appointList: [],
      appointLoading: false,
      appointfinished: false,
      isBlack: ""
    };
  },
  methods: {
    goback() {
      this.$router.push("/");
    },
    goAppoint(obj) {
      if (this.isBlack) {
        return;
      }
      if (obj.orderunit == "day") {
        obj.opendate = obj.opendate + "|" + obj.opendate;
      }
      this.$router.push({
        path: "appointSelect",
        query: {
          id: obj.id,
          opendate: obj.opendate,
          ruleid: obj.ruleid,
          name: obj.name,
          location: obj.location,
          orderunit: obj.orderunit,
          islocakers: obj.islocakers
        }
      });
    },
    getAppointLists() {
      this.util
        .postAjax({
          code: this.code.base,
          url: this.code.OrderList,
          data: {
            filter: {
              ORDERUNIT: "day,week"
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
              this.appointLoading = false;
              this.appointfinished = true;
            } else {
              this.appointLoading = false;
              this.page++;
              this.appointfinished = false;
            }

            data.forEach(e => {
              if (e.orderunit == "week") {
                e.starttime = e.opendate.split("|")[0];
                e.endtime = e.opendate.split("|")[1];
              } else if (e.orderunit == "day") {
                e.starttime = e.opendate;
                e.endtime = e.opendate;
              }
              // this.appointList.push(e);
              if (
                e.isvacationopen == 1 ||
                (e.isvacationopen == 0 && this.showList)
              ) {
                this.appointList.push(e);
              }
            });
          }
        });
    },
    getNowHourMin(type) {
      var myDate = new Date();
      var hour = myDate.getHours(); // 时
      if (hour >= 0 && hour <= 9) {
        hour = "0" + hour;
      }
      var minutes = myDate.getMinutes(); // 分
      if (minutes >= 0 && minutes <= 9) {
        minutes = "0" + minutes;
      }
      var seconds = myDate.getSeconds(); // 分
      if (seconds >= 0 && seconds <= 9) {
        seconds = "0" + seconds;
      }
      if (type) {
        return "" + hour + minutes + seconds;
      } else {
        return "" + hour + minutes;
      }
    },
    getlistTime() {
      this.util
        .postAjax({
          code: this.code.base,
          url: this.code.configitems,
          isRep: true
        })
        .then(res => {
          var configs = res.data.configs;
          if (res.success) {
            var listShowTime = configs.filter(m => {
              return m.identifycode == "B02";
            })[0].codeval;
            var winterStart = configs.filter(m => {
              return m.identifycode == "C03";
            })[0].codeval;
            var winterEnd = configs.filter(m => {
              return m.identifycode == "C04";
            })[0].codeval;
            var summerStart = configs.filter(m => {
              return m.identifycode == "C01";
            })[0].codeval;
            var summerEnd = configs.filter(m => {
              return m.identifycode == "C02";
            })[0].codeval;
            //先判断当天是不是在寒暑假时间段
            var today = this.util.formatMYD();
            var nowHourMin = this.getNowHourMin("ss");
            // console.log('tag', today,winterStart,winterEnd,summerStart,summerEnd)
            if (
              (parseInt(today) <= parseInt(winterEnd) &&
                parseInt(today) >= parseInt(winterStart)) ||
              (parseInt(today) <= parseInt(summerEnd) &&
                parseInt(today) >= parseInt(summerStart))
            ) {
              // console.log('在寒暑假设置的时间内')
              this.showList = false;
            } else {
              // console.log('不在寒暑假设置的时间内',nowHourMin,listShowTime)
              if (parseInt(nowHourMin) >= parseInt(listShowTime)) {
                this.showList = true;
              } else {
                this.showList = false;
              }
              // this.showList = true;
            }
            // console.log('this.showList', this.showList)
            if (this.showList) {
            } else {
              this.appointLoading = false;
              this.appointfinished = true;
            }
            this.getAppointLists();
          }
        });
    }
  },
  created() {
    this.isBlack = this.$store.state.BlackText.isBlack;
    this.getlistTime();
  }
};
</script>
<style scoped>
.appointlist_content {
  width: 100%;
  height: 100%;
  background: #fff;
  padding-top: 4px;
  box-sizing: border-box;
  padding-bottom: 3rem;
  box-sizing: border-box;
}
.appoint_emptyseat {
  margin-top: 0;
}
.appointlist_bottom {
  width: 100%;
  height: 132px;
  background: #ffffff;
  position: fixed;
  left: 0;
  bottom: 0;
  padding: 24px 30px;
  box-sizing: border-box;
}
.appointlist_bottom > div {
  width: 100%;
  height: 84px;
  background: #ffffff;
  border-radius: 44px;
  border: 2px solid #cccccc;
  font-size: 30px;
  font-weight: 400;
  color: #333333;
  line-height: 84px;
  text-align: center;
}
</style>