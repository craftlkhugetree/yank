<template>
  <div>
    <div class="progressitem">
      <div class="dot" :class="{ active: active }"></div>
      <h3 class="title" :class="{ active: active }">{{ event.eventtitle }}</h3>
      <div style="width:100%; height:24px;"></div>
      <div class="progressstate">
        <p class="handletime">
          {{
          util.formatTime(event.createtime, "YYYY-MM-DD")
          }}
        </p>
        <span
          class="handletime"
          v-if="event.type === '1'"
        >处理人：{{ event.creatername }}({{ event.createrid }})</span>
        <span
          class="handletime"
          v-if="event.type === '2'"
        >处理人：{{ event.creatername }}({{ event.createrid }})</span>
        <span
          class="handletime"
          v-if="event.type === '3'"
        >处理人：{{ event.creatername }}({{ event.createrid }})</span>
        <span class="handletime" v-if="event.type === '4' && event.id !== 'self'">
          处理人：{{ repairevent.creatername }}({{
          repairevent.repairerid
          }})
        </span>
        <span
          class="handletime"
          v-if="event.type === '4' && event.id === 'self'"
        >处理人：{{ event.creatername }}({{ event.createrid }})</span>
        <span
          class="handletime"
          v-if="event.type === '5'"
        >处理人：{{ event.creatername }}({{ event.createrid }})</span>
        <span
          class="handletime"
          v-if="event.type === '9'"
        >处理人：{{ event.creatername }}({{ event.createrid }})</span>
      </div>
      <!-- 派单信息 -->
      <div class="distrubeinfo" v-if="event.type === '4' && event.handletype === '1'">
        <span class="handletime">
          {{ repairevent.creatername }}派单给【{{ repairevent.repairername }}】
          , 在【{{
          util.formatTime(repairevent.starttime, "YYYY-MM-DD")
          }}】上门维修
        </span>
      </div>
      <div
        class="distrubeinfo"
        v-if="event.type === '4' && event.handletype === '1'"
      >{{ repairevent.sendnote }}</div>
      <!-- 不维修信息 -->
      <div
        class="distrubeinfo"
        v-if="event.type === '4' && event.handletype === '5'"
      >{{ repairevent.note }}</div>
      <!-- 办理信息 -->
      <div class="distrubeinfo" v-if="event.type === '1'">
        <span class="handletime">
          {{ event.creatername }}派单给维修负责人【{{
          event.repairleadername
          }}】
        </span>
      </div>
      <!-- 评价信息 -->
      <div class="rateinfo" v-if="event.type == 6">
        <span class="rateresult">
          维修结果：
          <span v-if="event.result == 1">
            <img src="../../static/images/success.png" width="15px" height="15px" />已完结
          </span>
          <span v-if="event.result == 0">
            <img src="../../static/images/fail.png" width="15px" height="15px" />未修复
          </span>
        </span>
        <span class="rate" v-if="event.result == 1">
          <van-rate v-model="event.markscore" readonly :size="15" color="#fd7d18" />
        </span>
      </div>
      <p class="content" :class="{ active: active }">{{ event.note }}</p>
      <div class="attaches" v-if="event.photos">
        <img
          width="60px"
          height="60px"
          :src="$store.state.fileUrl + photoid"
          v-for="photoid in event.photos"
          :key="photoid"
          @click="showimgs"
          alt
        />
      </div>
    </div>
  </div>
</template>

<script>
import { ImagePreview } from "vant";
export default {
  data() {
    return {
      repairevent: {
        creatername: "",
        repairername: "",
        starttime: "",
        sendnote: "",
        repairerid: ""
      }
    };
  },
  props: {
    event: Object,
    active: Boolean,
    last: Boolean
  },
  components: {},

  methods: {
    showimgs() {
      let imgs = _.map(this.event.photos, item => {
        return this.$store.state.fileUrl + item;
      });
      ImagePreview(imgs);
    }
  },
  created() {
    if (this.event.type === "4" && this.event.id) {
      if (this.event.id === "self") {
        this.repairevent.sendnote = this.event.note;
        this.repairevent.creatername = this.event.creatername;
        return;
      }
      this.util
        .postAjax({
          code: this.global.code,
          url: "/repair/findById",
          data: {
            id: this.event.id
          }
        })
        .then(res => {
          if (res.success) {
            // debugger
            this.repairevent.creatername = res.data.repairleadername;
            this.repairevent.repairername = res.data.repairername;
            this.repairevent.starttime = res.data.starttime;
            this.repairevent.sendnote = res.data.sendnote;
            this.repairevent.repairerid = res.data.repairleaderid;
          }
        });
    }
  }
};
</script>
<style lang='scss' scoped>
.progressitem {
  padding-left: 16px;
  border-left: 1px solid rgba(219, 219, 219, 1);
  padding-bottom: 16px;
  position: relative;
  .dot {
    position: absolute;
    width: 14px;
    height: 14px;
    background-color: rgba(219, 219, 219, 1);
    border-radius: 50%;
    top: 0px;
    left: -7px;
    &.active {
      background-color: rgba(253, 125, 24, 1);
    }
  }
  .title {
    position: absolute;
    top: -4px;
  }
}
.title {
  font-size: 14px;
  font-weight: 600;
  color: rgba(147, 146, 142, 1);
  line-height: 21px;
  &.active {
    color: rgba(70, 64, 50, 1);
  }
}
.progressstate,
.distrubeinfo {
  font-size: 11px;
  font-weight: 400;
  color: #93928e;
  line-height: 16px;
  .handletime {
    display: inline-block;
    margin-right: 20px;
  }
}
.rateinfo {
  font-size: 11px;
  font-weight: 400;
  color: rgba(102, 102, 102, 1);
  line-height: 16px;
  margin-bottom: 8px;
  .rate {
    float: right;
    margin-top: 2px;
  }
  .rateresult {
    line-height: 16px;
    height: 100%;
    img {
      vertical-align: text-bottom;
    }
  }
  img {
    margin-top: 3px;
    margin-right: 5px;
  }
}
.content {
  font-size: 11px;
  font-weight: 400;
  color: #999999;
  line-height: 16px;
  &.active {
    color: rgba(70, 64, 50, 1);
  }
}
.attaches {
  margin: 8px 0;
  img {
    display: inline-block;
    margin-right: 8px;
  }
}
p,span {
  line-height: 20px;
  margin-bottom: 8px;
}
</style>
