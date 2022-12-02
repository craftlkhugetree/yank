<template>
  <div class="main-wapper">
    <!---------------------------- 资源详情---------------------------->
    <div class="title-box">
      <div class="link-title">
        <el-link :underline="false" @click="$router.push(`home`)">首页</el-link>
        <span class="gray">/</span>
        <el-link :underline="false" @click="jumpList(resData)">{{resData.resgroupname}}</el-link>
        <span class="gray">/</span>
        <el-link :underline="false">详情</el-link>
      </div>
      <h1 class="h1-title">{{resData.name}}</h1>
      <p>
        <span class="group-title">{{resData.resgroupname}}</span>
        <span>
          <i class="el-icon-location"></i>
          {{resData.location}}
        </span>
      </p>
    </div>
    <!------------------------- 图片 ------------------------->
    <div class="image-view">
      <el-image
        style="width: 200px; height: 150px"
        v-for="img in imgUrls"
        :key="img"
        :src="img"
        :preview-src-list="imgUrls"
        fit="contain"
      ></el-image>
    </div>
    <p class="note">{{resData.note}}</p>
    <el-collapse v-model="activeNames" @change="handleChange" class="mycollapse">
      <el-collapse-item name="1">
        <template slot="title">
          <span class="rule-title">查看规则</span>
        </template>
        <div class="rules">
          <span class="subhead">预约规则</span>
          <appoint-time ref="yyTime"></appoint-time>
          <p>
            <label>预约限制时间：</label>
            <template v-for=" conf in resData.conditions">
              <span :key="conf.id">
                <span
                  v-show="conf.conditioncode =='01'"
                >{{`在资源使用时间前${conf.conditionval&&conf.conditionval.days ?JSON.parse(conf.conditionval).days天JSON.parse(conf.conditionval).time:'0天'}`+'停止预约；'}}</span>
                <span
                  v-show="conf.conditioncode =='02'"
                >{{`每次预约时间段的最多${conf.conditionval||'无限'}个`+'；'}}</span>
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
            <span class="subhead mgtp">签到规则</span>
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
            <span class="subhead mgtp">审核规则</span>
            <div v-if="approves.length">
              <p>
                <label>审核层级：</label>
                {{ approves.map(v=>v.name).join('->')}}
              </p>
              <p>
                <label>审核超时：</label>
                资源使用时间开始前{{approves[0].timeout}}分钟未审核，则默认审核不通过
              </p>
            </div>
            <span v-else>暂无审核规则</span>
          </div>
        </div>
      </el-collapse-item>
    </el-collapse>
    <!---------------------------- 预约时间表格---------------------------->
    <open-time-table
      :resDetail="resData"
      ref="openTimeTable"
      :resId="resId"
      @setOpenTimes="setOpenTimes"
    ></open-time-table>
  </div>
</template>
<script>
import openTimeTable from "./components/openTimeTable";
import AppointTime from "./components/appointTime";
import { fetchResDetail, fetchResAppoint } from "@/api/client/resources.js";
export default {
  data() {
    return {
      resData: {},
      openTimes: [],
      activeNames: ["1"],
      cancel: {}, //取消预约
      check: {}, //签到规则
      approves: [] //审核规则
    };
  },
  props: {
    resId: String
  },
  components: {
    openTimeTable,
    AppointTime
  },
  created() {},
  computed: {
    imgUrls() {
      let imgIds = this.resData.icon ? this.resData.icon.split(",") : [];
      return imgIds.map(i => window.g.viewUrl + i);
    }
  },
  watch: {
    resData() {
      this.setYyTime();
      this.cancel = this.resData.cancel;
      this.check = this.resData.check;
      this.approves = this.resData.approves;
    }
  },
  mounted() {
    this.getResDetail();
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
    handleChange(val) {
      console.log(val);
    },
    jumpList(items) {
      let currentGroup = {};
      this.$router.push({
        name: "res-list"
      });
    },
    // 设置开放时间
    setOpenTimes(data) {
      this.openTimes = data;
    },
    // 预约
    appoint() {
      let appointTable = this.$refs.openTimeTable;
      appointTable.openTimes = _.cloneDeep(this.openTimes);
      appointTable.setRowSpan();
    },

    //获取资源详情
    getResDetail() {
      let params = {
        id: this.resId
      };
      fetchResDetail(params).then(res => {
        if (res.success) {
          this.resData = res.data;
          let data = JSON.stringify(res.data);
          sessionStorage.setItem("resData", data);
        }
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.main-wapper {
  min-height: 740px;
  padding: 0 100px;
  margin: 0 auto;
  margin-top: 120px;
  margin-left: 200px;
  width: 1200px;
}
.link-title {
  margin-bottom: 30px;
  .el-link.el-link--default {
    color: #c9c9c9;
    font-size: 12px;
    line-height: 17px;
    &:hover {
      color: #3f86f7;
    }
  }
}
.title-box {
  color: #474d51;
  margin: 30px 0;
  padding: 20px 0;
  border-bottom: 1px solid #f2f2f2;
  width: 100%;
  .gray {
    color: #c9c9c9;
    font-size: 12px;
    padding: 5px;
  }
  .h1-title {
    height: 48px;
    font-size: 34px;
    font-weight: 600;
    line-height: 48px;
    margin-bottom: 10px;
  }
  i.el-icon-location {
    color: #cccccc;
  }
  .group-title {
    width: 59px;
    height: 24px;
    background: #f56323;
    border-radius: 2px;
    font-size: 13px;
    font-weight: 400;
    color: #ffffff;
    line-height: 18px;
    padding: 3px 10px;
    margin-right: 30px;
  }
}
.image-view {
  .el-image {
    margin-right: 20px;
    margin-bottom: 12px;
  }
}
.note {
  margin-top: 12px;
  height: 42px;
  font-size: 14px;
  font-weight: 400;
  color: #474d51;
  line-height: 21px;
}

.rule-title {
  color: #3f86f7;
  font-weight: 600;
  color: #3f86f7;
  font-size: 16px;
}
.el-collapse-item__arrow {
  float: left;
  line-height: 48px;
  font-size: 16px;
  color: #7d7d80;
}
.el-collapse-item__content {
  padding-left: 22px;
}
.el-collapse,
.mycollapse /deep/ .el-collapse-item__wrap {
  border-color: #f2f2f2 !important;
  position: relative;
  min-height: 48px;
  clear: both;
}
.mycollapse /deep/ .el-collapse-item__header {
  flex-direction: row-reverse;
  float: left;
}
.rules {
  font-size: 14px;
  color: #474d51;
  clear: both;
  padding-left: 20px;
}
.subhead {
  font-weight: 600;
  color: #474d51;
  line-height: 20px;
  font-size: 14px;
  height: 20px;
  width: 56px;
  display: block;
  margin-bottom: 10px;
}
.mgtp {
  margin-top: 10px;
}
</style>
