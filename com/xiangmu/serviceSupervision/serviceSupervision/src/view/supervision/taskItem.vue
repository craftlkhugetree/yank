
<template>
  <div>
    <p class="title">
      <span class="tasktype">{{ taskType[info.type] }}</span>
      <span class="titletext">{{ info.title }}</span>
      <span class="tasktime"  style="float:right;">{{  formatTime(info.createtime, "YYYY-MM-DD HH:mm") }}</span>
    </p>
    <p v-show="showApplyer">
      <span class="taskDept">{{info.handledeptname}}</span>
      <span class="taskDept blue" v-if="info.applyertype=='1'">学生督察员</span>
      <span class="tasktime">提问人：{{ info.applyername }}({{ info.applyerid }})</span>
      <span class="tasktime">联系电话：{{ info.applyermobile }}</span>
      <span class="tasktime">提问时间：{{ formatTime(info.createtime, "YYYY-MM-DD HH:mm") }}</span>
    </p>
    <!-- 短文字 -->
    <div class="sample" v-if="viewType === 'sample'">
      <div class="context">{{ info.content }}</div>
    </div>
    <!-- <transition name="fade2"> -->
    <div class="prev" v-show="viewType === 'prev'">
      <div class="context">
        {{ simplecontent }}
        <span class="detail" @click="showall">
          查看更多
          <i class="el-icon-arrow-down"></i>
        </span>
      </div>
    </div>
    <!-- </transition> -->
    <transition name="fade2">
      <div class="previmg clearfix" v-show="viewType === 'previmg'">
        <div class="context">
          {{ simplecontent }}
          <span class="detail" @click="showall">
            查看更多
            <i class="el-icon-arrow-down"></i>
          </span>
        </div>
        <div class="contextimg">
          <!-- <img :src="imgUrls[0]" alt="" /> -->
          <el-image
            class="imgs"
            style="width: 80px; height: 80px"
            :src="imgUrls[0]"
            :preview-src-list="imgUrls"
          ></el-image>
          <span>{{ imgUrls.length }}图</span>
        </div>
      </div>
    </transition>

    <!-- 全文 -->
    <mycollapse>
      <div class="all" v-show="viewType === 'all'">
        <div class="context">
          {{ allcontent }}
          <span class="detail" @click="hide">
            收起
            <i class="el-icon-arrow-up"></i>
          </span>
        </div>
        <div class="taskattaches">
          <el-image
            class="imgs"
            style="width: 160px; height: 160px"
            v-for="item in imgUrls"
            :src="item"
            :preview-src-list="imgUrls"
            :key="item"
          ></el-image>
          <!-- <img :src="item" alt="" v-for="item in imgUrls" :key="item" /> -->
        </div>
      </div>
    </mycollapse>
  </div>
</template>

<script>
import mycollapse from "../../assets/js/collapse";
export default {
  components: { mycollapse },
  data() {
    return {
      taskType: ["", "咨询", "投诉", "表扬", "反馈", "其他"],
      viewType: "sample", //prev,all,sample,previmg
      prevview: "",
      allcontent: "",
      simplecontent: "",
      imgUrls: []
    };
  },
  props: {
    info: Object,
    showApplyer: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    formatTime(time) {
      return this.util.formatTime(time, "YYYY-MM-DD HH:mm");
    },
    showall() {
      this.prevview = this.viewType;
      this.viewType = "all";
    },
    hide() {
      this.viewType = this.prevview;
    }
  },
  created() {
    this.allcontent = this.info.content;
    if (this.info.content.length > 165) {
      this.simplecontent = this.info.content.substring(0, 165) + "...";
      this.viewType = "prev";
    }
    if (this.info.photos) {
      this.simplecontent =
        this.info.content.length > 140
          ? this.info.content.substring(0, 140) + "..."
          : this.info.content;
      let photos = this.info.photos.split(",");
      this.imgUrls = _.map(photos, photo => {
        // return this.$store.state.fileUrl + photo + '.png';
        return this.$store.state.fileUrl + photo;
      });
      this.viewType = "previmg";
    }
  }
};
</script>
<style lang='scss' scoped>
.fade2-enter-active {
  transition: opacity 1s ease-in;
}
.fade2-leave-active {
  transition: opacity 0.5s ease;
}
.fade2-enter, .fade2-leave-to
/* .slide-fade-leave-active for below version 2.1.8 */ {
  opacity: 0;
}
.taskDept {
  background: #fff0ed;
  border-radius: 3px;
  font-size: 12px;
  font-weight: 400;
  color: #ff6f4b;
  line-height: 17px;
  padding: 3px 5px;
  margin-right: 10px;
  &.blue {
    color: #3A78FC;
    background: #E7EEFE;
    margin-right: 0;
  }
}
.tasktype {
  display: inline-block;
  width: 40px;
  height: 22px;
  line-height: 22px;
  font-size: 12px;
  text-align: center;
  font-weight: 400;
  background: #ff6f4b;
  border-radius: 3px;
  color: #fff;
  margin-right: 10px;
}
.titletext {
  display: inline-block;
  font-size: 16px;
  font-weight: 600;
  color: #2a2e2e;
  line-height: 22px;
  height: 22px;
}
.tasktime {
  // float: right;
  display: inline-block;
  height: 22px;
  font-size: 12px;
  color: #999999;
  line-height: 22px;
  margin-top: 10px;
  margin-left: 30px;
}
.context {
  margin-top: 10px;
  font-size: 14px;
  font-weight: 400;
  color: #5f6464;
  line-height: 28px;
  position: relative;
}
.previmg .context {
  width: 710px;
  float: left;
  margin-right: 10px;
}
.previmg .contextimg {
  width: 80px;
  float: left;
  height: 80px;
  //   outline: 1px solid #ff6f4b;
  margin-top: 10px;
  position: relative;
}
.contextimg > img {
  width: 100%;
  height: 100%;
}
.contextimg > span {
  position: absolute;
  bottom: 0;
  right: 0;
  text-align: center;
  background-color: rgba(0, 0, 0, 0.3);
  color: #fff;
  width: 30px;
  height: 24px;
  line-height: 24px;
}
.detail {
  height: 28px;
  font-size: 14px;
  color: #ff6f4b;
  line-height: 28px;
  cursor: pointer;
  position: absolute;
  bottom: 0;
  right: 10px;
  text-align: center;
  background-color: #fff;
  padding-left: 10px;
}
.taskattaches {
  margin-top: 10px;
  .imgs {
    width: 160px;
    height: 160px;
    display: inline-block;
    margin-right: 20px;
  }
}
.transferInfo {
  height: 14px;
  font-size: 12px;
  color: #999999;
  line-height: 14px;
  margin-top: 10px;
}
.orgname {
  display: inline-block;
  margin-right: 30px;
}
</style>
