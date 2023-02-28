<template>
  <div class="detail">
    <van-nav-bar title="绩效奖励查询" fixed :border="false" left-arrow @click-left="$router.goBack()" />
    <div style="width:100%;height:46px;"></div>
    <div class="user-info clearfix">
      <img src="@/assets/img/user.png" alt />
      <div class="user-info-right">
        <div class="title">
          <span class="name">{{userDetail.name}}</span>
          <span>{{tagName}}</span>
        </div>
        <div>
          <div class="info">
            <label>岗位津贴</label>
            <span>{{common.moneyFormat(userDetail.allowance)}}元</span>
          </div>
          <div class="info">
            <label>外挂工资</label>
            <span>{{common.moneyFormat(userDetail.salary)}}元</span>
          </div>
        </div>
      </div>
    </div>
    <div class="info-list clearfix">
      <!---------------------------- 选择年份 ---------------------------->
      <div class="select-box" @click="showPicker=true">
        <img src="@/assets/img/calendar.png" alt />
        <span>{{year ? year : "全部"}}</span>
        <van-icon name="arrow-down" v-show="!showPicker" />
        <van-icon name="arrow-up" v-show="showPicker" />
      </div>
      <van-popup v-model="showPicker" position="bottom">
        <van-picker
          show-toolbar
          :columns="yearList"
          @confirm="chooseYear"
          @cancel="showPicker=false"
        />
      </van-popup>
      <!---------------------------- list ---------------------------->
      <div class="info-box" v-for="(item,index) in tableData" :key="item.id" :class="`animation-${index + 1}`">
        <div class="title">{{item.title}}</div>
        <div class="tag" :class="item.grantstatus == '3' ? 'status-yes' : 'status-no'">{{statusFormat(item.grantstatus)}}</div>
        <!-- 月绩效 -->
        <div class="content" v-if="['1','4'].includes(item.type)">
          <div class="info">
            <label>岗位津贴</label>
            <span>{{common.moneyFormat(item.allowance)}}元</span>
          </div>
          <div class="info">
            <label>外挂工资</label>
            <span>{{common.moneyFormat(item.outsalary)}}元</span>
          </div>
          <div class="info">
            <label>月考核奖</label>
            <span>{{common.moneyFormat(item.monthsalary)}}元</span>
          </div>
          <div class="info">
            <label>其他</label>
            <span>{{common.moneyFormat(item.othersalary)}}元</span>
          </div>
        </div>
        <div class="footer" v-if="['1','4'].includes(item.type)">
          <p>
            <label>合计：</label>
            <span>{{common.moneyFormat(item.totalsalary)}}元</span>
          </p>
          <p v-if="item.grantstatus == '3'">
            <label>发放时间：</label>
            <span>{{common.defaultTimeFormat(item.sendtime, "YYYY年MM月")}}</span>
          </p>
          <p v-if="item.grantstatus == '2'">
            <label>说明：</label>
            <span>这里是暂不发放说明哦</span>
          </p>
        </div>
        <!-- 年绩效 -->
        <div class="footer" v-if="item.type == '2'">
          <p>
            <label>年终绩效奖励：</label>
            <span>{{common.moneyFormat(item.yearsalary)}}元</span>
          </p>
          <p v-if="item.grantstatus == '3'">
            <label>发放时间：</label>
            <span>{{common.defaultTimeFormat(item.sendtime, "YYYY年MM月")}}</span>
          </p>
        </div>
        <!-- 特殊发放 -->
        <div class="footer" v-if="item.type == '3'">
          <p>
            <label>发放金额：</label>
            <span>{{common.moneyFormat(item.specialsalary)}}元</span>
          </p>
          <p v-if="item.grantstatus == '3'">
            <label>发放时间：</label>
            <span>{{common.defaultTimeFormat(item.sendtime, "YYYY年MM月")}}</span>
          </p>
        </div>
      </div>
      <div v-if="list.length == 0" class="nodata">暂无数据</div>
    </div>
  </div>
</template>

<script>
import { fetchMyKpi } from "@/api/kpi/awardDetail";
import { fetchUserDetail } from "@/api/admin/users";
export default {
  data() {
    return {
      loading: false,
      year: null,
      showPicker: false,
      list: []
    };
  },
  computed: {
    // 用户详情
    userDetail() {
      return this.$store.state.userDetail;
    },
    // 用户标签
    tagName() {
      let joblvname = this.userDetail.joblvname;
      let rylxm = this.userDetail.rylxm;
      return joblvname ? `${joblvname}/${rylxm}` : rylxm;
    },
    // 年份列表
    yearList() {
      let arr = [];
      let year = 2020;
      let curYear = this.moment().format("YYYY");
      while (year <= curYear) {
        arr.push(year);
        year++;
      }
      return arr;
    },
    // 列表排序
    tableData() {
      let list = [...this.list];
      list.sort((a,b) => b.sendtime - a.sendtime)
      return list
      // let list = this.list;
      // let yearList = list.filter(i => i.type == "2");
      // let otherList = list.filter(i => i.type !== "2");
      // otherList.sort((a, b) => {
      //   return a.time > b.time ? -1 : 1;
      // });
      // return yearList.concat(otherList);
    }
  },
  methods: {
    chooseYear(val) {
      this.year = val;
      this.showPicker = false;
      this.getMyKpi();
    },
    // 发放状态：1-未发放， 2-暂不发放，3-已发放
    statusFormat(status) {
      let data = "";
      switch(status) {
        case "1":
          data = "未发放";
          break;
        case "2":
          data = "暂不发放";
          break;
        case "3":
          data = "已发放";
          break;
      }
      return data;
    },

    // 获取用户kpi
    getMyKpi() {
      this.$toast.loading({
        message: "加载中...",
        forbidClick: true
      });
      let param = this.year ? {year: this.year} : null;
      fetchMyKpi(param)
        .then(res => {
          this.$toast.clear();
          if (res.success) {
            let data = res.data || [];
            // 已通过审核的月绩效和年绩效，已发放的发放录入和领导绩效
            data = data.filter(
              i =>
                (["1", "2"].includes(i.type) && i.status == "4") ||
                (["3", "4"].includes(i.type) && i.grantstatus == "3")
            );
            data.forEach(i => {
              let title = "";
              let time = "";
              // type: 1-月绩效，2-年绩效，3-特殊发放，4-领导绩效
              if(i.type == "1" || i.type == "4") {
                title = `${i.yeardate}年${i.monthdate}月绩效清单`
                time = i.monthdate;
              } else if(i.type == "2") {
                title = `${i.yeardate}年终绩效清单`
              } else if(i.type == "3") {
                title = i.kpiname
                time = this.moment(i.sendtime, "YYYYMMDDhhmmss").format("MM");
              }
              i.title = title;
              i.time = time;
            });
            this.list = data;
          }
        })
        .catch(err => {
          this.$toast.clear();
        });
    }
  },
  created() {
    this.getMyKpi();
  }
};
</script>

<style lang="scss" scoped>
.detail {
  width: 100%;
  height: 100%;
}
.user-info {
  padding: 24px 0 24px 35px;
  background: #ffffff;
  img {
    float: left;
    width: 180px;
    height: 180px;
    margin-right: 35px;
  }
  .user-info-right {
    float: left;
    width: calc(100% - 215px);
    .title {
      padding-bottom: 24px;
      margin-bottom: 24px;
      border-bottom: 1px solid #dbdbdb;
      span {
        font-size: 24px;
        font-weight: 400;
        color: #7d7d80;
      }
      .name {
        font-size: 28px;
        font-weight: 600;
        color: #474d51;
        line-height: 36px;
        margin-right: 24px;
      }
    }
    .info {
      width: 50%;
      display: inline-block;
      label {
        display: block;
        font-size: 24px;
        font-weight: 400;
        color: #7d7d80;
        line-height: 36px;
        margin-bottom: 24px;
      }
      span {
        font-size: 24px;
        font-weight: 400;
        color: #474d51;
        line-height: 36px;
      }
    }
  }
}
.info-list {
  margin: 25px 24px;
  .select-box {
    // float: right;
    text-align: right;
    img {
      width: 30px;
      height: 30px;
      vertical-align: text-bottom;
      margin-right: 18px;
    }
    span {
      font-size: 24px;
      font-weight: 400;
      color: rgba(0, 0, 0, 0.45);
      line-height: 20px;
      display: inline-block;
      width: 80px;
      text-align: left;
    }
    .van-icon {
      color: rgba(0, 0, 0, 0.45);
    }
  }
  .info-box {
    position: relative;
    width: 100%;
    margin: 24px 0;
    background: #ffffff;
    box-shadow: 0px 5px 20px 0px #e6e6e6;
    border-radius: 10px;
    .title {
      padding: 24px;
      font-size: 32px;
      font-weight: 600;
      color: #474d51;
      line-height: 38px;
      border-bottom: 1px solid #dbdbdb;
    }
    .tag {
      position: absolute;
      font-size: 24px;
      font-weight: 400;
      color: #ffffff;
      line-height: 28px;
      padding: 8px 22px;
      right: -10px;
      top: 17px;
      border-top-left-radius: 20px;
      border-bottom-left-radius: 20px;
      &.status-no {
        background: #ffb032;
        &::before {
          content: "";
          position: absolute;
          right: 0;
          top: 42px;
          border-top: 10px solid #b96313;
          border-right: 10px solid transparent;
        }
      }
      &.status-yes {
        background: #3f86f7;
        &::before {
          content: "";
          position: absolute;
          right: 0;
          top: 42px;
          border-top: 10px solid #1950a9;
          border-right: 10px solid transparent;
        }
      }
    }
    .content {
      border-bottom: 1px solid #dbdbdb;
    }
    .info {
      display: inline-block;
      width: 25%;
      padding: 24px 0;
      text-align: center;
      label {
        display: block;
        font-size: 24px;
        color: #7d7d80;
        line-height: 36px;
        margin-bottom: 24px;
      }
      span {
        font-size: 24px;
        color: #474d51;
        line-height: 36px;
      }
    }
    .footer {
      font-size: 24px;
      font-weight: 400;
      color: #7d7d80;
      line-height: 36px;
      padding: 24px;
      p {
        label {
          display: inline-block;
          min-width: 120px;
        }
        &:not(:last-child) {
          margin-bottom: 24px;
        }
      }
      span {
        color: #474d51;
      }
    }
  }
}
</style>