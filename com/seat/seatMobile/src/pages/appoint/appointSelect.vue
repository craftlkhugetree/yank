<template>
  <div class="appointSelectContent">
    <div class="appointSelect_top">
      <h3>
        {{ name }}
        <i v-if="islocakers == 1">有柜子</i>
      </h3>
      <p>{{ location }}</p>
    </div>
    <div class="appointroomDetail monitorRoom">
      <div class="icons">
        <span> <i class="wall"></i>墙 </span>
        <span> <i class="window"></i>窗 </span>
        <span> <i class="door"></i>门 </span>
        <span> <i class="pass"></i>过道 </span>
        <span> <i class="pillar"></i>书架 </span>
      </div>
      <div class="hastimebox">
        <div class="seatDetail" :class="{ scale: isScale }" v-pinch="pinchCtrl">
          <ul class="clearfix" v-for="(items, index) in seatDeatil">
            <li
              v-for="(itemss, indexs) in items"
              :class="[
                {
                  selected: itemss.selected,
                  full: itemss.nowstatus == 3,
                  part: itemss.nowstatus == 2,
                  epidemic: itemss.isopen == 0,
                },
                'type' + itemss.type,
              ]"
              @click="selectSeat(itemss)"
            >
              {{ itemss.type == 1 ? itemss.name : "" }}
            </li>
          </ul>
        </div>
      </div>
      <div class="appointbottom">
        <h3>
          <span> <i class="empty"></i>可选 </span>
          <span> <i class="noseat"></i>不可选 </span>
          <span> <i class="partSeat"></i>部分可选 </span>
          <span> <i class="epidemic"></i>疫情座位 </span>
        </h3>
        <div class="line"></div>
        <div class="selectSeatBox">
          已选位置
          <span v-if="isselected">
            {{ selectseat.name }}号座
            <i @click="delSeat"></i>
          </span>
        </div>
        <div class="line"></div>
        <div class="selectSeatTime">
          <h3>
            选择时间段
            <span @click="selectTime">
              去选择
              <i></i>
            </span>
          </h3>
          <ul>
            <li
              v-for="(v, i) in selectTimes"
              v-if="v.times.length > 0"
              :key="i"
            >
              {{ v.weekday }}
            </li>
          </ul>
        </div>
        <div class="bottom_" v-if="!isselected" @click="selectTime">
          请 选 择
        </div>
        <div class="bottom_ bottom_1" v-if="isselected" @click="sureAppointy">
          确 定
        </div>
      </div>
    </div>
    <!-- 选择的时间段弹窗 -->
    <!-- <van-overlay :show="showtime" v-if="showtime" @click="closeTime"> -->
    <div v-if="showtime" class="timeMeng" @click="closeTime">
      <timeselect
        @closetimeselect="closetimeselect"
        :appoint="isappoint"
        :currentcancelTime="Opentime"
        :appointTime="appointTime"
        @AppointResult="AppointResult"
      ></timeselect>
    </div>
    <!-- </van-overlay> -->
    <!-- 预约成功弹窗 -->
    <van-overlay :show="appointSucc" v-if="appointSucc">
      <successMeng :ismonitor="ismonitor"></successMeng>
    </van-overlay>
  </div>
</template>
<script>
import timeselect from "@/components/timeselect";
import successMeng from "@/components/successMeng";
export default {
  props: {
    id: String,
    opendate: String,
    ruleid: String,
    name: String,
    location: String,
    orderunit: String,
    islocakers: String,
  },
  components: {
    timeselect,
    successMeng,
  },
  data() {
    return {
      isselected: false, //是不是选择了座位了
      showtime: false, //显示选择时间的有弹窗
      isappoint: true, //选择时间弹窗是不是预约的
      ismonitor: false,
      appointSucc: false,
      seatDeatil: [], //渲染区间座位
      selectseat: "", //选择的座位信息
      Opentime: [],
      appointTime: [],
      selectTimes: [], //已经选择的时间段
      hasselected: false,
      times: [],
      isScale: false, //
      changeSeat: false,
      sureflag: true,
    };
  },
  methods: {
    pinchCtrl: function (e) {
      if (e === "pinchin") {
        //console.log("捏合");
        this.isScale = false;
      }
      if (e === "pinchout") {
        //console.log("扩大");
        this.isScale = true;
      }
    },
    selectTime() {
      if (!this.selectseat) {
        this.Toast("请先选择座位");
      } else {
        if (!this.hasselected || this.changeSeat) {
          this.queryOpentime();
        } else {
          this.showtime = true;
        }
      }
    },
    closeTime() {
      this.showtime = false;
      if (!this.hasselected) {
        this.Opentime = [];
        this.appointTime = [];
      }
    },
    closetimeselect() {
      this.showtime = false;
    },
    AppointResult(obj) {
      //console.log("obj", obj);
      this.hasselected = true;
      this.Opentime = obj;
      this.selectTimes = obj;
      var time = [];
      obj.forEach((e) => {
        var orderdateMonth = e.weekday.split("月")[0];
		console.log(e.weekday);
        // var orderdateDay = e.weekday.split('月')[1].split('日')[0]<10?'0'+e.weekday.split('月')[1].split('日')[0]:''+e.weekday.split('月')[1].split('日')[0];
        var orderdateDay = e.weekday.split("月")[1].split("日")[0];
        e.orderdate =
          new Date().getFullYear() + "" + orderdateMonth + "" + orderdateDay;
        e.times.forEach((ee) => {
          var newobj = {
            endtime: ee.endtime,
            starttime: ee.starttime,
            orderdate: e.orderdate,
          };
          time.push(newobj);
        });
      });
      this.showtime = false;
      this.times = time;
    },
    getPickDetail() {
      this.util
        .postAjax({
          code: this.code.base,
          url: this.code.PickDetail,
          data: {
            enddate: this.opendate.split("|")[1].replace(/-/g, ""),
            sectionid: this.id,
            startdate: this.opendate.split("|")[0].replace(/-/g, ""),
          },
          isRep: true,
        })
        .then((res) => {
          if (res.success) {
            var seats = res.data;
            var newseats = [];
            seats.forEach((m) => {
              if (m.type == 1) {
                m.selected = false;
              }
              if (typeof newseats[m.rowno - 1] == "undefined") {
                newseats[m.rowno - 1] = [];
              }
              newseats[m.rowno - 1][m.colno - 1] = m;
            });
            this.seatDeatil = newseats;
          }
        });
    },
    selectSeat(obj) {
      this.changeSeat = true;
      this.selectTimes = [];
      if (obj.nowstatus == 3 || obj.isopen == 0) {
        this.Toast("当前座位不可选");
        return;
      }
      this.seatDeatil.forEach((e) => {
        e.forEach((ee) => {
          if (ee.id != obj.id && obj.type == 1) {
            ee.selected = false;
          }
        });
      });
      if (obj.type == 1) {
        obj.selected = !obj.selected;
        // this.hasselected = false;
        if (obj.selected) {
          this.selectseat = obj;
          this.isselected = true;
        } else {
          this.selectseat = "";
          this.isselected = false;
        }
      }
    },
    delSeat() {
      this.isselected = false;
      this.selectseat = "";
      this.seatDeatil.forEach((e) => {
        e.forEach((ee) => {
          ee.selected = false;
        });
      });
    },
    getDay(day) {
      var today = new Date();
      var targetday_milliseconds = today.getTime() + 1000 * 60 * 60 * 24 * day;
      today.setTime(targetday_milliseconds);
      var tYear = today.getFullYear();
      var tMonth = today.getMonth();
      var tDate = today.getDate();
      tMonth = this.doHandleMonth(tMonth + 1);
      tDate = this.doHandleMonth(tDate);
      return "" + tMonth + "月" + tDate + "日";
    },
    doHandleMonth(month) {
      var m = month;
      if (month.toString().length == 1) {
        m = "0" + month;
      }
      return m;
    },
    //获取下周几的日期
    getNextWeekday(week) {
      var Stamp;
      Stamp = new Date();
      var num = 7 - Stamp.getDay() + 1;
      Stamp.setDate(Stamp.getDate() + num);
      var year = Stamp.getFullYear(); //获取完整的年份(4位,1970-????)
      var month = Stamp.getMonth() + 1; //获取当前月份(0-11,0代表1月)
      var mvar = "";
      if (month < 10) {
        mvar = "0" + month;
      } else {
        mvar = month + "";
      }
      var day = Stamp.getDate() + week - 1;
      var dvar = "";
      if (day < 10) {
        dvar = "0" + day;
      } else {
        dvar = day + "";
      }
      var lastSize = new Date(year, parseInt(mvar), 0).getDate(); //下月总天数
      // console.log('lastSize', lastSize,dvar)
      if (parseInt(lastSize) < parseInt(dvar)) {
        // console.log('mvar', mvar)
        var newmonth = parseInt(mvar) + 1;
        if (newmonth < 10) {
          mvar = "0" + newmonth;
        } else {
          mvar = newmonth + "";
        }
        var newday = parseInt(dvar) - parseInt(lastSize);
        if (newday < 10) {
          dvar = "0" + newday;
        } else {
          dvar = newday + "";
        }
        return "" + mvar + "月" + dvar + "日";
      } else {
        return "" + mvar + "月" + dvar + "日";
      }
    },
    //获取明天的日期
    getNextday() {
      var day3 = new Date();
      day3.setTime(day3.getTime() + 24 * 60 * 60 * 1000);
      var month = day3.getMonth() + 1;
      var dmonth = "";
	  var dday = day3.getDate()<10?'0'+day3.getDate():day3.getDate()+'';
      if (month < 10) {
        dmonth = "0" + month;
      } else {
        dmonth = month + "";
      }
	  
      var s3 = dmonth + "月" + dday + "日";
      return s3;
    },
    compare(property) {
      return function (a, b) {
        var value1 = a[property];
        var value2 = b[property];
        return value1 - value2;
      };
    },
    queryOpentime() {
      this.util
        .postAjax({
          code: this.code.base,
          url: this.code.queryOpentime,
          data: {
            enddate: this.opendate.split("|")[1].replace(/-/g, ""),
            sectionid: this.id,
            seatid: this.selectseat.id,
            startdate: this.opendate.split("|")[0].replace(/-/g, ""),
            type: "1", //预约的type 传1
          },
          isRep: true,
        })
        .then((res) => {
          if (res.success) {
            this.Opentime = [];
            var timeArr = res.data;
            if (timeArr.length < 1) {
              this.Toast("当前暂无可预约的时间段");
              return;
            }
            var tempArr = [];
            for (let i = 0; i < timeArr.length; i++) {
              if (tempArr.indexOf(timeArr[i].weekno) === -1) {
                this.Opentime.push({
                  weekno: timeArr[i].weekno,
                  weekday:
                    this.orderunit == "week"
                      ? this.getNextWeekday(timeArr[i].weekno)
                      : this.getNextday(),
                  weekdaynum:
                    this.getNextWeekday(timeArr[i].weekno).substring(0, 2) +
                    this.getNextWeekday(timeArr[i].weekno).substring(3, 5),
                  origin: [timeArr[i]],
                });
                tempArr.push(timeArr[i].weekno);
              } else {
                for (let j = 0; j < this.Opentime.length; j++) {
                  if (this.Opentime[j].weekno == timeArr[i].weekno) {
                    this.Opentime[j].origin.push(timeArr[i]);
                    break;
                  }
                }
              }
            }
            //console.log("this.Opentime", this.Opentime);
            this.Opentime.sort(this.compare("weekdaynum"));
            this.appointTime = this.Opentime[0].origin;
            this.showtime = true;
            // console.log(this.Opentime)
          }
        });
    },
    sureAppointy() {
      if (this.times.length < 1) {
        this.Toast("请先选择时间");
        return;
      }
      if (this.sureflag) {
        this.sureflag = false;
        this.util
          .postAjax({
            code: this.code.base,
            url: this.code.ordersave,
            data: {
              enddate: this.opendate.split("|")[1].replace(/-/g, ""),
              ruleid: this.ruleid,
              seatid: this.selectseat.id,
              seatname: this.selectseat.name,
              sectionid: this.id,
              sectionname: this.name,
              startdate: this.opendate.split("|")[0].replace(/-/g, ""),
              times: this.times,
              type: "1", //1预约 2 选座
            },
            isRep: true,
          })
          .then((res) => {
            if (res.success) {
              this.appointSucc = true;
              // this.$router.push('/')
            } else {
              this.sureflag = true;
              this.Toast(res.data.message);
            }
          });
      }
    },
  },
  created() {
    this.getPickDetail();
  },
};
</script>
<style scoped>
.timeMeng {
  position: fixed;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  background: rgba(0, 0, 0, 0.75);
}
.appointSelectContent > .appointroomDetail {
  width: 100%;
  /* height: calc(100% - 670px); */
  height: 650px;
  background: #f8f8f8;
  overflow: auto;
}
.appointroomDetail > div.hastimebox {
  width: 100%;
  /* height: calc(100% - 15.48rem); */
  overflow: auto;
}
.appointroomDetail > .appointbottom {
  width: 100%;
  /* height: 13.33rem; */
  background: #ffffff;
  box-shadow: 0px -2px 10px 0px rgba(238, 238, 238, 0.4);
  border-radius: 60px 60px 0px 0px;
  position: fixed;
  left: 0;
  bottom: 0;
}
.selectSeatTime {
  width: 100%;
  height: 5.1rem;
  padding: 30px 30px 0;
  box-sizing: border-box;
}
.selectSeatTime > h3 {
  width: 100%;
  height: 36px;
  font-size: 28px;
  font-weight: 400;
  color: #333333;
  line-height: 40px;
}
.selectSeatTime > h3 > span {
  float: right;
  color: #cccccc;
}
.selectSeatTime > h3 > span > i {
  display: inline-block;
  width: 0.35rem;
  height: 26px;
  background: url(../../../static/img/timeArr.png) no-repeat center center;
  background-size: cover;
  float: right;
  margin-left: 24px;
  margin-top: 0.175rem;
}

.selectSeatTime > ul {
  width: 100%;
  margin-top: 24px;
  display: flex;
  justify-content: flex-start;
  overflow: auto;
}
.selectSeatTime > ul > li {
  width: 3.85rem;
  height: 80px;
  background: #ffffff;
  border-radius: 4px;
  border: 0.03rem solid #cccccc;
  font-size: 24px;
  font-weight: 400;
  color: #333333;
  line-height: 80px;
  text-align: center;
  flex-shrink: 0;
  margin-right: 20px;
}
</style>