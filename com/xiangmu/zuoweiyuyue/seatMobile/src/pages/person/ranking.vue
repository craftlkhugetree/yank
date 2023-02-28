<template>
  <div class="rankbox">
    <div class="rangtop"></div>
    <div class="ranktab">
      <ul class="ranktab_title clearfix">
        <li @click="changetab(v.id)" :class="{'act':v.id==num}" v-for="(v,i) in tablist" :key="i">
          {{v.name}}
          <i></i>
        </li>
      </ul>
      <div class="ranktab_content" v-if="ranklists.length>0">
        <div class="clearfix" v-for="(v,i) in ranklists" :key="i">
          <i v-if="i==0" class="first"></i>
          <i v-if="i==1" class="second"></i>
          <i v-if="i==2" class="third"></i>
          <i v-if="i!=0 && i!=1 && i!=2">{{i+1}}</i>
          <!-- <span></span> -->
          <div>
            <h3>
              {{v.username}}
              <span>{{v.showtime}}</span>
            </h3>
            <van-progress inactive :percentage="v.value" />
          </div>
        </div>
      </div>
      <div v-else class="nodata">暂无数据</div>
    </div>
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
        { name: "日榜", id: "1" },
        { name: "周榜", id: "2" },
        { name: "月榜", id: "3" },
        { name: "总计", id: "4" }
      ],
      num: "1",
      value: 50,
      ranklists: [
        { time: 80, username: "111111" },
        { time: 160, username: "222222" },
        { time: 10, username: "333333" },
        { time: 20, username: "4444" }
      ],
      maxnum: 0,
      nowYMD: "",
      startdate: null,
      enddate: null
    };
  },
  methods: {
    changetab(id) {
      this.num = id;

      if (id == "1") {
        this.startdate = this.nowYMD;
        this.enddate = this.nowYMD;
      } else if (id == "2") {
        this.startdate = this.GetMonday(new Date());
        this.enddate = this.nowYMD;
      } else if (id == "3") {
        var currentDay = new Date();
        currentDay.setDate(1);
        this.startdate = this.GetMonthDay(currentDay);
        this.enddate = this.nowYMD;
      } else if (id == "4") {
        this.startdate = null;
        this.enddate = null;
      }
      this.getranking(this.startdate, this.enddate);
    },
    goperson() {
      this.$router.push("person");
    },
    //将分钟转成时分
    ChangeHourMinutestr(str) {
      if (str !== "0" && str !== "" && str !== null) {
        return (
          (Math.floor(str / 60).toString().length < 2
            ? "0" + Math.floor(str / 60).toString()
            : Math.floor(str / 60).toString()) +
          "小时" +
          ((str % 60).toString().length < 2
            ? "0" + (str % 60).toString()
            : (str % 60).toString()) +
          "分钟"
        );
      } else {
        return "";
      }
    },
    //获取周一的日期
    GetMonday(dd) {
      var week = dd.getDay(); //获取时间的星期数
      var minus = week ? week - 1 : 6;
      dd.setDate(dd.getDate() - minus); //获取minus天前的日期
      var y = dd.getFullYear();
      var m =
        parseInt(dd.getMonth() + 1) > 9
          ? parseInt(dd.getMonth() + 1)
          : "0" + parseInt(dd.getMonth() + 1); //获取月份
      var d = dd.getDate() > 9 ? dd.getDate() : "0" + dd.getDate();
      return "" + y + m + d;
    },
    //获取月初的日期
    GetMonthDay(myDate) {
      var month = myDate.getMonth() + 1;
      if (month >= 1 && month <= 9) {
        //月
        month = "0" + month;
      }
      var strDate = myDate.getDate();
      if (strDate >= 0 && strDate <= 9) {
        //日
        strDate = "0" + strDate;
      }
      var hour = myDate.getHours(); // 时

      if (hour >= 0 && hour <= 9) {
        hour = "0" + hour;
      }
      var minutes = myDate.getMinutes(); // 分
      if (minutes >= 0 && minutes <= 9) {
        minutes = "0" + minutes;
      }
      return "" + myDate.getFullYear() + month + strDate;
    },
    getranking(startdate, enddate) {
      var data = {
        startdate: startdate,
        enddate: enddate
      };
      this.util
        .postAjax({
          code: this.code.base,
          url: this.code.ranking,
          data: startdate ? data : ""
          // isRep:true
        })
        .then(res => {
          if (res.success) {
            // var arr = [{time: 160,username: "吕*"},{time: 80,username: "赵秋*"},{time: 10,username: "王丽*"},{time: 20,username: "李梓*"}];
            var arr = res.data;
            this.maxnum = Math.max(...arr.map(x => x.time));
            arr.forEach(e => {
              e.value = (e.time / this.maxnum) * 100;
              e.showtime = this.ChangeHourMinutestr(e.time);
            });
            this.ranklists = arr;
            // console.log('this.ranklists',this.ranklists)
          } else {
            this.Toast(res.data.message);
          }
        });
    }
  },
  created() {
    this.nowYMD = this.util.formatMYD();
    this.getranking(this.nowYMD, this.nowYMD);
  }
};
</script>
<style scoped>
.rankbox {
  position: relative;
}
.rangtop {
  width: 100%;
  height: 330px;
  background: url(../../../static/img/rankback.png) no-repeat center center;
  background-size: cover;
}
.ranktab {
  width: 100%;
  background: #333333;
  border-radius: 40px 40px 0px 0px;
  position: absolute;
  top: 300px;
}
.ranktab_title {
  width: 100%;
  height: 92px;
  background: #333333;
  border-radius: 40px 40px 0px 0px;
}
.ranktab_title > li {
  width: calc(100% / 4);
  height: 100%;
  float: left;
  line-height: 92px;
  text-align: center;
  font-size: 30px;
  font-weight: 400;
  color: rgba(255, 255, 255, 0.65);
  position: relative;
}
.ranktab_title > li > i {
  display: inline-block;
  width: 37px;
  height: 4px;
  background: #ffffff;
  border-radius: 0.08rem;
  position: absolute;
  bottom: 10px;
  right: 70px;
  display: none;
}
.ranktab_title > li.act {
  font-weight: 500;
  color: #ffffff;
}
.ranktab_title > li.act > i {
  display: block;
}
.ranktab_content {
  width: 100%;
  background: #ffffff;
  border-radius: 40px 40px 0px 0px;
  padding: 32px;
  padding-bottom: 3rem;
  box-sizing: border-box;
}
.ranktab_content > div {
  width: 100%;
}
.ranktab_content > div > i {
  display: inline-block;
  width: 46px;
  height: 38px;
  margin-right: 24px;
  float: left;
  margin-top: 0.825rem;
  font-size: 30px;
  font-weight: 400;
  color: #999999;
  line-height: 0.95rem;
  text-align: center;
  font-style: normal;
}
.ranktab_content > div > i.first {
  background: url(../../../static/img/first.png) no-repeat center center;
  background-size: cover;
}
.ranktab_content > div > i.second {
  background: url(../../../static/img/second.png) no-repeat center center;
  background-size: cover;
}
.ranktab_content > div > i.third {
  background: url(../../../static/img/third.png) no-repeat center center;
  background-size: cover;
}
.ranktab_content > div > span {
  display: inline-block;
  width: 2.4rem;
  height: 2.4rem;
  background: red;
  float: left;
  margin-right: 24px;
  margin-top: 8px;
}
.ranktab_content > div > div {
  width: 600px;
  height: 96px;
  float: left;
  margin: 24px 0px;
  box-sizing: border-box;
}
.ranktab_content > div > div > h3 {
  width: 100%;
  height: 36px;
  font-size: 26px;
  font-weight: 400;
  color: #333333;
  line-height: 36px;
  margin-bottom: 20px;
}
.ranktab_content > div > div > h3 > span {
  float: right;
  font-size: 32px;
  font-weight: 600;
  color: #333333;
}
</style>