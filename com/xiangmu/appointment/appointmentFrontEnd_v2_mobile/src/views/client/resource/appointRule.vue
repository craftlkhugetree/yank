<template>
  <div class="wrapper">
    <van-nav-bar
      title="查看规则"
      fixed
      :border="false"
      left-arrow
      @click-right="jumpSearch"
      @click-left="$router.go(-1)"
    >
      <template #right>
        <van-icon name="search" size="18" />
      </template>
    </van-nav-bar>
    <section class="main-wapper">
      <div class="rules">
        <span class="subhead">预约规则</span>
        <appoint-time ref="yyTime"></appoint-time>
        <p>
          <label>预约限制时间：</label>
          <template v-for=" conf in resData.conditions">
            <span :key="conf.id">
              <span
                v-show="conf.conditioncode =='01'"
              >{{`在资源使用时间前${JSON.parse(conf.conditionval).days}天${JSON.parse(conf.conditionval).time}停止预约`+'；'}}</span>
              <span v-show="conf.conditioncode =='02'">{{`每次预约时间段的最多${conf.conditionval}个`+'；'}}</span>
			  <span v-show="conf.conditioncode =='05'">{{`每人每月最多预约${conf.conditionval}次`+'；'}}</span>
              <span
                v-show="conf.conditioncode =='03' &&  conf.conditionval=='true'"
              >{{conf.description+'；'}}</span>
              <span
                v-show="conf.conditioncode =='04' && conf.conditionval=='true'"
              >{{conf.description+'；'}}</span>
            </span>
          </template>
        </p>
        <p>
          <label>取消预约：</label>
          资源使用时间开始前{{cancel.cancelval}}{{cancel.cancelunit=='hour'?'小时':'分钟'}}可以取消预约
        </p>

        <div>
          <span class="subhead">签到规则</span>
          <div v-if="check.checktype">
            <p>
              <label>签到方式：</label>
              {{ JSON.parse(check.checktype).note}}
            </p>
            <p>
              <label>签到时间：</label>
              资源使用时间开始前{{JSON.parse(check.checkin).checkTime}}分钟可以签到
            </p>
            <p>
              <label>停止签到：</label>
              资源使用时间开始后 {{JSON.parse(check.checkin).stopCheckTime}}分钟停止签到
            </p>
            <p>
              <label>释放资源：</label>
              资源使用时间开始{{check.checktimeout}}后分钟未签到，则释放资源
            </p>
          </div>
          <span v-else>未开启签到规则</span>
        </div>
        <div>
          <span class="subhead">审核规则</span>
          <div v-if="approves.length">
            <p>
              <label>审核层级：</label>
              {{ approves.map(v=>v.usernames).join('->')}}
            </p>
            <p>
              <label>审核超时：</label>
              资源使用时间开始前{{approves[0].timeout}}分钟未审核，则默认审核不通过
            </p>
          </div>
          <span v-else>暂无审核规则</span>
        </div>
      </div>
    </section>
  </div>
</template>
<script>
import AppointTime from "./components/appointTime";
export default {
  data() {
    return {
      cancel: {}, //取消预约
      check: {}, //签到规则
      approves: [] //审核规则
    };
  },
  components: {
    AppointTime
  },
  created() {},
  computed: {
    resData() {
      return this.$store.state.currentResDetail;
    }
  },

  mounted() {
    this.cancel = this.resData.cancel;
    this.check = this.resData.check;
    this.approves = this.resData.approves;
    this.setYyTime();
  },
  methods: {
    // 初始设置预约时间
    setYyTime() {
      let time = this.resData.yytime;
      if (time) {
        let yy = this.$refs.yyTime;
        yy.timetype = time.timetype;
        yy.startday = time.startday;
        yy.endday = time.endday;
        yy.starttime = time.starttime;
        yy.endtime = time.endtime;
      }
    },
    //跳转到搜索
    jumpSearch() {
      this.$router.push({
        name: "res-search"
      });
    }
  }
};
</script>
<style lang='scss'>
.manager-html {
  line-height: 26px;
  padding: 10px 0 20px;
  color: #474d51;
  border-top: 1px solid #f2f2f2;
  overflow-y: auto;
  /deep/ strong {
    font-weight: 600 !important;
  }
  h1 {
    font-size: 2em !important;
  }
  h2 {
    font-size: 1.5em !important;
  }
  h3 {
    font-size: 1.17em !important;
  }
  h4 {
    font-size: 1em !important;
  }
  h5 {
    font-size: 0.83em !important;
  }
  p {
    font-size: 1em !important;
  }
  .placeholder {
    color: #d4d4d4;
    position: absolute;
    font-size: 11pt;
    line-height: 22px;
    left: 10px;
    top: 10px;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
    z-index: -1;
  }

  p,
  h1,
  h2,
  h3,
  h4,
  h5,
  table,
  pre {
    margin: 10px 0 !important;
    line-height: 1.5 !important;
  }
  i {
    font-style: italic !important;
  }
  ul,
  ol {
    margin: 10px 0 10px 20px !important;
  }
  blockquote {
    display: block;
    border-left: 8px solid #d0e5f2;
    padding: 5px 10px;
    margin: 10px 0;
    line-height: 1.4;
    font-size: 100%;
    background-color: #f1f1f1;
  }
  code {
    display: inline-block;
    background-color: #f1f1f1;
    border-radius: 3px;
    padding: 3px 5px;
    margin: 0 3px;
  }
  pre code {
    display: block;
  }
  table {
    border-top: 1pt solid #ccc !important;
    border-left: 1pt solid #ccc !important;
  }
  table td,
  table th {
    border-bottom: 1pt solid #ccc !important;
    border-right: 1pt solid #ccc !important;
    padding: 3px 5px !important;
    min-height: 30px !important;
    height: 30px !important;
  }
  table th {
    border-bottom: 2px solid #ccc !important;
    text-align: center !important;
    background-color: #f1f1f1 !important;
  }
  :focus {
    outline: none;
  }
  img {
    cursor: pointer;
  }
  img:hover {
    box-shadow: 0 0 5px #333;
  }

  li {
    list-style: none;
    font-size: 1em;
  }
  li span:nth-child(1) {
    position: relative;
    left: -18px;
  }
  li span:nth-child(1) input {
    position: absolute;
    margin-right: 3px;
  }
  li span:nth-child(1) input[type="checkbox"] {
    top: 50%;
    margin-top: -6px;
  }
}
</style>
<style lang="scss" scoped>
.main-wapper {
  padding: 32px;
  margin-top: 64px;
}
.subhead {
  font-weight: blod;
  color: #474d51;
  line-height: 33px;
  font-size: 28px;
  height: 33px;
  margin: 20px 0;
  width: 112px;
  display: block;
}
.rules {
  font-size: 28px;
  color: #474d51;
  p {
    line-height: 42px;
  }
}
</style>
