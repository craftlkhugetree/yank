<template>
  <div class="wrapper">
    <van-nav-bar
      title="预约日历"
      fixed
      :border="false"
      left-arrow
      @click-left="$router.go(-1)"
      @click-right="jumpSearch"
    >
      <template #right>
        <van-icon name="search" size="18" />
      </template>
    </van-nav-bar>
    <section class="main-wapper">
      <el-calendar class="appoint-calendar" v-model="value">
        <template slot="dateCell" slot-scope="{date, data}">
          <!--自定义内容 -->
          <div>
            <div class="calendar-day" @click="selectDate(data.day)">{{ getDay(data)}}</div>
            <div class="green budge" v-if="isHaveAppoint(data)"></div>
          </div>
        </template>
      </el-calendar>
      <div class="res-box">
        <h3 class="title">预约时间</h3>
        <div class="content-time">
          <!---------------------------- 列表 ---------------------------->
          <van-list v-model="loading" :finished="finished" @load="getTodayResList()">
            <template v-for="(item,index) in resList">
              <div
                class="list-item"
                :key="item.id"
                :class="`animation-${index + 1}`"
                @click="toDetail(item)"
              >
                <div class="content clearfix">
                  <div class="img-box">
                    <img v-if="item.imgs.length > 0" :src="item.imgs[0]" alt />
                    <img v-else src="@/assets/img/no-img.png" alt />
                  </div>
                  <div class="right-info">
                    <h3 class="van-ellipsis">
                      <span class="tag">{{item.resgroupname}}</span>
                      {{item.resname}}
                    </h3>
                    <span
                      class="time"
                    >{{moment(item.starttime, "HHmm").format("HH:mm")}} ~ {{moment(item.endtime, "HHmm").format("HH:mm")}}</span>
                  </div>
                </div>
              </div>
            </template>
            <div slot="finished" :class="`animation-${resList.length + 1}`">
              <van-divider
                :style="{ color: '#999999', fontSize: '12px', borderColor: '#dbdbdb', padding: '0 24px' }"
              >没有更多了</van-divider>
            </div>
          </van-list>
        </div>
      </div>
    </section>
  </div>
</template>
<script>
import { getAppointCalendar } from "@/api/client/appoint";
export default {
  data() {
    return {
      calendarData: [],
      resList: [],
      value: new Date(),
      loading: false,
      finished: false,
      selectDay: new Date()
    };
  },
  components: {},
  created() {
    this.getTodayResList();
    this.getResAppointed();
    this.$nextTick(() => {
      // 点击前一个月
      let prevBtn = document.querySelector(
        ".el-calendar__button-group .el-button-group>button:nth-child(1)"
      );
      prevBtn.addEventListener("click", e => {
        this.selectDay = this.value;
        this.getTodayResList();
        this.getResAppointed();
      });
      //点击下一个月
      let nextBtn = document.querySelector(
        ".el-calendar__button-group .el-button-group>button:nth-child(3)"
      );
      nextBtn.addEventListener("click", () => {
        this.selectDay = this.value;
        this.getTodayResList();
        this.getResAppointed();
      });
      //点击今天
      let todayBtn = document.querySelector(
        ".el-calendar__button-group .el-button-group>button:nth-child(2)"
      );
      todayBtn.addEventListener("click", () => {
        this.selectDay = this.value;
        this.getTodayResList();
        this.getResAppointed();
      });
    });
  },
  computed: {},
  mounted() {},
  methods: {
    jumpSearch() {
      this.$router.push({
        name: "res-search"
      });
    },
    toDetail(item) {
      this.$router.push(`/appoint/detail/${item.id}`);
    },
    //选中日期
    selectDate(day) {
      this.selectDay = day;
      this.getTodayResList();
    },

    //查询已被约的时间段
    getTodayResList() {
      let key = this.moment(this.selectDay).format("YYYYMMDD");
      let data = {
        starttime: key,
        endtime: key
      };
      getAppointCalendar(data)
        .then(res => {
          this.loading = false;
          this.finished = true;
          let resArr = res.data[key] || [];
          resArr.forEach(i => {
            let imgs = i.resicon;
            imgs = imgs ? imgs.split(",") : [];
            i.imgs = imgs.map(i => window.g.viewUrl + i);
          });
          this.resList = resArr;
        })
        .catch(err => {
          this.loading = false;
          this.finished = true;
        });
    },

    // 当前日期是否有预约
    isHaveAppoint(data) {
      let appointDays = Object.keys(this.calendarData);
      let curday = data.day.replace(/-/g, "");
      return appointDays.includes(curday);
    },
    //日历 中的天
    getDay(data) {
      let day = data.day
        .split("-")
        .slice(2)
        .join("-");
      if (day[0] == "0") {
        return (day = day.slice(1));
      } else {
        return day;
      }
      return day;
    },

    //查询当前整个月 所有 已被约的时间段，显示蓝色点点
    getResAppointed() {
      this.tableLoading = true;
      let times = this.useTimes;
      let starttime = this.moment(this.selectDay)
        .startOf("month")
        .format("YYYYMMDD");
      let endtime = this.moment(this.selectDay)
        .endOf("month")
        .format("YYYYMMDD");
      let data = {
        starttime: starttime,
        endtime: endtime
      };
      getAppointCalendar(data)
        .then(res => {
          let list = res.data || [];
          this.calendarData = list;
        })
        .catch(err => {});
    }
  }
};
</script>
<style  lang="scss">
.el-calendar-table .el-calendar-day {
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
}
.el-calendar__header {
  font-size: 28px;
}

.el-calendar-table td {
  border: none !important;
  height: 64px;
  width: 32px;
  line-height: 64px;
  font-size: 30px;
}
// 日历单元格鼠标经过背景色
.el-calendar-table .el-calendar-day:hover {
  background-color: inherit;
}

//今天的字体颜色
.el-backtop,
.el-calendar-table td.is-today {
  color: #3f86f7;
}
//选中时字体的背景
td.current.is-selected.is-today,
td.current.is-selected {
  background-color: inherit;
  text-align: center;
  .calendar-day {
    color: #fff;
    width: 64px;
    height: 64px;
    display: inline-block;
    border-radius: 50%;
    background: #3f86f7;
  }
}
</style>

<style lang="scss" scoped>
.main-wapper {
  background: #f6f6f6;
  margin-top: 88px;
}

.appoint-calendar /deep/ button.el-button.el-button--plain.el-button--mini {
  font-size: 28px;
}

.budge {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background-color: #3f86f7;
  position: absolute;
  bottom: -4px;
  right: 45%;
}

.res-box {
  margin-bottom: 30px;
  background: #fff;
  .title {
    height: 33px;
    font-size: 28px;
    font-weight: blod;
    color: #51575c;
    line-height: 33px;
    position: relative;
    padding: 32px 0 64px 68px;
    &::before {
      display: inline-block;
      content: "";
      width: 12px;
      height: 12px;
      border: 6px solid #3f86f7;
      border-radius: 12px;
      position: absolute;
      left: 32px;
      top: 36px;
    }
  }
}

.list-item {
  width: 100%;
  background: #ffffff;
  border-bottom: 1px solid #dbdbdb;
  border-radius: 10px;
  margin-bottom: 24px;
  .content {
    padding: 24px;
    .img-box {
      width: 134px;
      height: 100px;
      float: left;
      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
    }
    .right-info {
      float: left;
      margin-left: 25px;
      width: calc(100% - 180px);
      h3 {
        height: 42px;
        font-size: 28px;
        font-weight: blod;
        color: #474d51;
        width: 100%;
        margin-bottom: 20px;
      }
      .tag {
        display: inline-block;
        font-size: 24px;
        color: #ffffff;
        height: 42px;
        line-height: 42px;
        background: #f56323;
        border-radius: 2px;
        padding: 0 16px;
        margin-right: 16px;
      }
      .time {
        font-size: 28px;
        color: #474d51;
        line-height: 33px;
      }
    }
  }
}
.list-item:last-child {
  border: none !important;
}
</style>
