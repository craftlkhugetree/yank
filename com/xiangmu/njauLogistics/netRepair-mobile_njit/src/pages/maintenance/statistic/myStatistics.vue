<template>
  <div>
    <van-nav-bar title="我的维修量统计" left-arrow fixed @click-left="$router.go(-1)" />
    <div style="width:100%;height:46px;"></div>
    <div>
      <van-cell
        is-link
        title="我的维修量统计"
        title-class="title"
        :value="time"
        value-class="value"
        arrow-direction="down"
        @click="showPicker = true"
      ></van-cell>
      <van-popup v-model="showPicker" position="bottom">
        <van-datetime-picker
          show-toolbar
          v-model="currentDate"
          type="year-month"
          :min-date="minDate"
          :max-date="maxDate"
          :formatter="formatter"
          @confirm="chooseTime"
          @cancel="showPicker = false"
        />
      </van-popup>
    </div>
    <div class="data-table">
      <van-row class="header">
        <van-col span="16">时间</van-col>
        <van-col span="8" class="right">当天维修</van-col>
      </van-row>
      <div class="body">
        <van-row v-for="(item,index) in data" :key="index">
          <van-col span="16">{{item.time}}</van-col>
          <van-col span="8" class="right num">
            <countTo :startVal="0" :endVal="item.num" :duration="2000"></countTo>
          </van-col>
        </van-row>
        <div v-if="data.length == 0" class="nodata">
          <img src="../../../../static/images/nodata.png" width="100%" alt />
          <p>没有找到相关记录</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import moment from "moment";
import countTo from "vue-count-to";
export default {
  components: {
    countTo
  },
  data() {
    return {
      showPicker: false,
      time: moment(new Date()).format("yyyy年MM月"),
      currentDate: new Date(),
      minDate: new Date(2020, 0, 1),
      maxDate: new Date(2040, 11, 1),
      data: []
    };
  },
  methods: {
    formatter(type, val) {
      if (type === "year") {
        return `${val}年`;
      } else if (type === "month") {
        return `${val}月`;
      }
      return val;
    },
    // 选择时间
    chooseTime(date) {
      this.time = moment(date).format("yyyy年MM月");
      this.showPicker = false;
      this.getData();
    },

    // 获取月度数据
    getData() {
      this.util
        .postAjax({
          code: this.global.code,
          url: "dataRepairer/queryByMonth",
          data: {
            time: moment(this.currentDate).format("yyyyMM")
          }
        })
        .then(res => {
          if (res.success) {
            this.data = res.data || [];
            this.data.sort((a, b) => {
              if (a.time > b.time) {
                return -1;
              } else {
                return 1;
              }
            });
            this.data.forEach(i => {
              i.time = this.util.formatTime(i.time, "yyyy年MM月DD日");
            });
          }
        });
    }
  },
  created() {
    this.getData();
  }
};
</script>

<style lang="scss" scoped>
.title {
  font-size: 16px;
  color: #464032;
  font-weight: 600;
}
.value {
  font-size: 12px;
  color: #474d51;
}
.van-icon-arrow-down {
  font-size: 12px;
}
.data-table {
  background: #ffffff;
  padding: 2px 16px;
  .header {
    font-size: 14px;
    color: #93928e;
    line-height: 20px;
    padding-bottom: 12px;
    border-bottom: 1px solid #f0f0f0;
  }
  .body {
    font-size: 16px;
    color: #464032;
    line-height: 20px;
    .van-row {
      padding: 16px 0;
    }
  }
  .right {
    text-align: right;
  }
  .num {
    span {
      display: inline-block;
      width: 60px;
      text-align: center;
      font-weight: bold;
    }
  }
}
.nodata {
  padding: 20px 0;
  text-align: center;
  img {
    width: 100px;
    height: 100px;
  }
  p {
    color: #999999;
    margin-top: 8px;
    font-size: 12px;
  }
}
</style>