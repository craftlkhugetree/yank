<template>
  <div class="wrapper">
    <van-nav-bar
      title="选择日期"
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
      <van-calendar
        class="appoint"
        :formatter="formatter"
        title="日历"
        :show-title="false"
        :poppable="false"
        :show-confirm="false"
        :default-date="null"
        @select="selectDay"
        :style="{ height: '500px' }"
      />
    </section>
  </div>
</template>
<script>
import { fetchAppointList } from "@/api/client/appoint";
export default {
  data() {
    return {};
  },
  components: {},
  created() {
    this.getResAppointed();
  },
  computed: {
    resDetailData() {
      return this.$store.state.currentResDetail;
    }
  },
  mounted() {},
  methods: {
    //跳转到搜索
    jumpSearch() {
      this.$router.push({
        name: "res-search"
      });
    },
    selectDay(value) {
      this.$store.commit("setAppointDay", value);
      this.$router.push({
        name: "res-detail"
      });
    },
    formatter(day) {
      let flag = this.canAppointt(day.date);
      if (flag) {
        day.bottomInfo = "不可约";
      }
      return day;
    },
    //是否在不可约日期内
    canAppointt(day) {
      let openT = this.resDetailData.opentimes || [];
      let colseT = this.resDetailData.closetimes || [];
      let isClosed = false,
        disableFlag = false;

      colseT.map(close => {
        let colDay = this.moment(day).format("YYYYMMDDhhmmss");
        let today = this.moment().format("YYYYMMDDhhmmss");
        if (
          colDay >= today &&
          colDay >= close.starttime &&
          colDay <= close.endtime
        ) {
          isClosed = true;
        }
      });
      return isClosed;
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

    //查询已被约的时间段
    getResAppointed() {
      this.tableLoading = true;
      let times = this.useTimes;
      let starttime = this.moment()
        .startOf("month")
        .format("YYYYMMDD");
      let endtime = this.moment()
        .endOf("month")
        .format("YYYYMMDD");
      let data = {
        filter: {
          starttime: starttime,
          endtime: endtime,
          applystatus: "1,2,3,8,9"
        },
        page: 1,
        limit: 10
      };
      fetchAppointList(data)
        .then(res => {
          this.$toast.clear();
          this.loading = false;
          this.finished = true;
          let list = res.data || [];
          list.forEach(i => {
            let imgs = i.resicon;
            imgs = imgs ? imgs.split(",") : [];
            i.imgs = imgs.map(i => window.g.viewUrl + i);
          });
          this.opointList = list;
        })
        .catch(err => {
          this.loading = false;
          this.finished = true;
        });
    }
  }
};
</script>
<style>
.el-calendar-table .el-calendar-day {
  display: flex;
  justify-content: center;
  align-items: center;
}

.el-calendar-table td {
  border: none !important;
  height: 64px;
  width: 64px;
  line-height: 64px;
  font-size: 30px;
}
td.current.is-selected {
  width: 64px;
  height: 64px;
  background: #3f86f7;
  border-radius: 64px;
}
</style>

<style lang="scss" scoped>
.main-wapper {
  background: #f6f6f6;
  margin-top: 88px;
}
.is-selected {
  color: #1989fa;
}
.appoint /deep/ .van-calendar__bottom-info {
  color: #f56323;
}
</style>
