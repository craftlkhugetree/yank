<template>
  <div>
    <div class="top">
      <!-- 详情标题 -->
      <div class="detail-title">
        <h2>{{ rInfo.title }}</h2>
        <span class="sp2" v-if="activeTab != 'pending' && activeTab != '2'">{{
          statusName
        }}</span>
        <span class="sp1" v-if="!isHandle">
          {{ common.formatTime(rInfo.createTime, "YYYY.MM.DD hh:mm:ss") }}
        </span>
      </div>
      <el-divider></el-divider>
      <!-- 报修内容 -->
      <div class="edu-card-content">
        <div v-if="isHandle" class="span-sp">
          <span
            >报修时间：{{
              common.formatTime(rInfo.createTime, "YYYY.MM.DD hh:mm:ss")
            }}</span
          >
          <span>报修人：{{ rInfo.createName }}</span>
          <span>联系电话：{{ rInfo.mobile }}</span>
        </div>
        <div class="wrapper">
          {{ rInfo.content }}
        </div>
        <div class="imgs">
          <el-image
            :src="viewUrl + item.ID"
            v-for="item in imgs"
            :key="item.ID"
            :preview-src-list="[viewUrl + item.ID]"
            fit="contain"
            style="margin-right: 20px;
                width: 80px;
                height: 80px;"
          >
          </el-image>
        </div>
      </div>
    </div>

    <!-- 维修/转移 -->
    <move
      :rInfo="rInfo"
      v-if="activeTab == 'pending'"
      @triggerTab="triggerTab"
    ></move>

    <div class="middle">
      <h2>报修单进展</h2>
      <div @click.stop="collapse" v-if="progress.length > 1" class="collapse">
        {{ disProgress.length &lt; progress.length ? unfoldStr : foldStr }}
        <el-icon
          name="arrow-down"
          v-if="disProgress.length &lt; progress.length"
        />
        <el-icon name="arrow-up" v-else />
      </div>
    </div>
    <el-divider></el-divider>
    <!-- 详情进展 -->
    <div
      class="end"
      :class="disProgress.length &lt; progress.length ? 'select-close' : 'select-open'"
    >
      <el-timeline>
        <el-timeline-item
          v-for="(item, index) in disProgress"
          :key="item.time"
          :color="index == 0 ? '#FD7D18' : ''"
        >
          <h3 :class="index == 0 ? 'first' : ''">{{ item.name }}</h3>
          <p :class="index == 0 ? 'first' : ''">
            {{
              common.formatTime(item.time, "YYYY.MM.DD hh:mm:ss")
            }}&nbsp;&nbsp;&nbsp;
            {{
              item.result && ["3-1", "3-2"].includes(item.result.val)
                ? "处理人：" + `${item.createName}(${item.createId})`
                : ""
            }}
          </p>
          <div v-if="item.result && item.result.cIcon" class="end-inline">
            <span :class="index == 0 ? 'first' : ''">
              维修结果：
            </span>
            <img :src="require(`st@tic/images/${item.result.cIcon}`)" alt />
            <span :class="index == 0 ? 'first' : ''">{{
              item.result.name
            }}</span>
            <el-rate
              v-if="item.score"
              disabled
              v-model="item.score"
              :size="25"
              color="#ffd21e"
              void-icon="star"
              void-color="#eee"
            />
          </div>
          <span :title="item.content" :class="index == 0 ? 'first' : ''">{{
            item.content
          }}</span>
          <div class="imgs" v-if="item.eventType && item.eventType != 1">
            <el-image
              :src="viewUrl + g.ID"
              alt
              v-for="g in item.imgs"
              :key="g.ID"
              :preview-src-list="[viewUrl + g.ID]"
              fit="contain"
              style="margin-right: 20px;
                width: 80px;
                height: 80px;"
            />
          </div>
        </el-timeline-item>
      </el-timeline>
    </div>

    <div v-show="isConsumer()">
      <div class="middle">
        <h2>维修评价</h2>
      </div>
      <el-divider></el-divider>
      <judge ref="judge" :rInfo="rInfo"></judge>
    </div>

    <!-- <template v-if="!(disProgress.length &lt; progress.length) && progress.length > 1"> -->
    <template v-if="!isHandle">
      <el-divider></el-divider>
      <div
        @click.stop="collapseOut"
        class="my-button plain-green"
        style="float: right"
      >
        收起详情
      </div>
    </template>
  </div>
</template>

<script>
import { findId } from "@/assets/js/api";
import { repairStatus, result, roleId, bizNode } from "@/assets/js/options";

export default {
  components: {
    Judge: () => import("./judge"),
    move: () => import("./move")
  },
  props: {
    activeTab: String | Number,
    isHandle: Boolean
  },
  data() {
    return {
      diagBody: "",
      rInfo: {},
      imgs: [],
      statusName: "",
      progress: [],
      unfoldStr: "点击展开进展",
      foldStr: "点击收起进展",
      disProgress: []
    };
  },
  computed: {
    viewUrl() {
      return this.$store.state.viewUrl;
    },
    curRole() {
      let url = document.location.href;
      if (url.indexOf("/repair/bm_handle") > -1) {
        return roleId.bm;
      } else if (url.indexOf("/repair/hq_handle") > -1) {
        return roleId.hq;
      }
      return "16000";
    }
  },
  watch: {
    disProgress() {
      this.fold = this.disProgress.length < this.progress.length;
    }
  },
  methods: {
    // id查询
    findById(id) {
      this.$store.commit('setGLoading', true)
      findId(id)
        .then(res => {
          if (res && res.success) {
            this.rInfo = { ...res.data };
            this.statusName = repairStatus.find(
              r => r.val == this.rInfo.status
            ).name;
            this.transPhotos(res.data, this.imgs);
            this.genProgress();
          }
          this.$store.commit('setGLoading', false)
        })
        .catch(err => {
          this.$store.commit('setGLoading', false)
        });
    },
    // transfer photos to array
    transPhotos(obj, arr) {
      const photos = obj.photos;
      arr.length = 0;
      let files = (photos && photos.split(",")) || [];
      files.forEach(f => {
        arr.push({ ID: f });
      });
    },
    // 进展数组
    genProgress() {
      this.progress = [];
      const r = this.rInfo;
      const e = r.events;
      if (e && e.length) {
        e.forEach(item => {
          this.getProgressObj(item);
        });
      } else {
        let obj = { imgs: [] };
        obj.name = repairStatus.find(re => re.val == r.status).name;
        obj.time = r.createTime;
        obj.createId = r.createId;
        obj.createName = r.createName;
        obj.content = r.content;
        this.transPhotos(r, obj.imgs);
        this.progress.push(obj);
        // this.progress.unshift(obj);
      }
      this.disProgress =
        this.progress.length > 1 ? this.progress.slice(0, 1) : this.progress;
    },
    // 收起
    collapse() {
      this.disProgress =
        this.disProgress.length < this.progress.length
          ? this.progress
          : this.progress.slice(0, 1);
    },
    collapseOut() {
      this.$parent._props.tableData.forEach(t => {
        if (t.isExpand) {
          t.isExpand = false
        }
      })
    },
    changeExpand(id) {
      this.$parent._props.tableData.forEach(t => {
        if (t.id === id) {
          t.isExpand = true;
        } else {
          t.isExpand = false;
        }
      });
      this.$forceUpdate()
    },
    // 获取进展对象
    getProgressObj(item) {
      const r = this.rInfo;
      const et = item.eventType;
      let obj = { imgs: [], eventType: et };
      if (et == "1") {
        obj.name = "报修";
        obj.time = r.applyTime;
        obj.content = r.content;
        this.transPhotos(r, obj.imgs);
      } else {
        if (et == "4") {
          if (item.result === "4-1") {
            obj.name = "维修结束";
            obj.score = item.markscore || item.markscore == '0' ? parseInt(item.markscore) : r.markscore;
          } else if (item.result == "4-2") {
            obj.name = "维修未修复";
          }
        } else if (et == "3") {
          if (item.result === "3-1") {
            obj.name = "维修完工";
          } else if (item.result === "3-2") {
            obj.name = "不维修";
          }
        } else if (et == "2") {
          obj.name =
            "转移" +
            (item.moveNode === bizNode.bm
              ? "到基地管理员"
              : item.moveNode === bizNode.hq
              ? "到后勤管理员"
              : "到--");
        }
        obj.content = item.note;
        obj.result = result.find(re => re.val === item.result);
        obj.time = item.createTime;
        obj.createId = item.createId;
        obj.createName = item.createName;
        this.transPhotos(item, obj.imgs);
      }
      this.progress.push(obj);
      // this.progress.unshift(obj);
    },
    // 评价
    toJudge(id) {
      this.$router.push({ path: "/report/judge", query: { id } });
    },
    // 是否报修者
    isConsumer() {
      return [3, 2].includes(this.rInfo.status) && !this.isWorker();
    },
    // 是否维修人员
    isWorker() {
      return [roleId.bm, roleId.hq].includes(this.curRole);
    },
    // 触发tab
    triggerTab(str) {
      this.$parent.$data.activeTab = str;
      this.$parent.changeTab();
    }
  }
};
</script>

<style lang="scss" scoped>
.top {
  .detail-title {
    display: flex;
    align-items: center;
    h2 {
      display: inline-block;
      height: 25px;
      font-size: 18px;
      font-family: PingFangSC-Semibold, PingFang SC;
      font-weight: 600;
      color: #172535;
      line-height: 25px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .sp2 {
      margin-left: 10px;
      width: 56px;
      height: 22px;
      font-size: 14px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #fd7d18;
      line-height: 22px;
    }
    .sp1 {
      margin-left: auto;
      width: 121px;
      height: 17px;
      font-size: 12px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #999999;
      line-height: 17px;
    }
  }
  .edu-card-content {
    .wrapper {
      font-size: 14px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #172535;
      line-height: 28px;
      margin-bottom: 10px;
      overflow: hidden;
      word-wrap: break-word;
      white-space: normal;
      text-align: left;
    }
  }
}
.middle {
  margin-top: 20px;
  display: flex;
  align-items: center;
  h2 {
    height: 25px;
    font-size: 18px;
    font-family: PingFangSC-Semibold, PingFang SC;
    font-weight: 600;
    color: #172535;
    line-height: 25px;
  }
  .collapse {
    margin-left: auto;
    height: 17px;
    font-size: 12px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: #999999;
    line-height: 17px;
    cursor: pointer;
  }
}
@keyframes slide-down {
  0% {
    transform: scale(1, 0);
  }
  25% {
    transform: scale(1, 1.2);
  }
  50% {
    transform: scale(1, 0.85);
  }
  75% {
    transform: scale(1, 1.05);
  }
  100% {
    transform: scale(1, 1);
  }
}
.select-open {
  animation: slide-down 2s ease-in;
  transition: 2s ease-in;
  transform-origin: 50% 0;
}
.select-close {
  transform: scaleY(1);
  transition: transform 1s;
  transform-origin: top center;
}

.end {
  margin: 10px auto;
  h3 {
    height: 22px;
    font-size: 16px;
    font-family: PingFangSC-Semibold, PingFang SC;
    font-weight: 600;
    color: #999999;
    line-height: 22px;
    &.first {
      color: #172535;
    }
  }
  p {
    margin: 10px auto;
    height: 17px;
    font-size: 12px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: #999999;
    line-height: 17px;
    &.first {
      color: #172535;
    }
  }
  span {
    max-height: 56px;
    font-size: 14px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: #999999;
    line-height: 28px;
    display: -webkit-box; // 必须有，否则clamp可能不兼容
    overflow: hidden;
    word-wrap: break-word;
    white-space: normal;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    text-overflow: ellipsis;
    &.first {
      color: #172535;
    }
  }
}

.imgs {
  display: flex;
  flex-wrap: nowrap;
}

.end-inline {
  display: flex;
  flex-wrap: nowrap;
  align-items: center;
  &.first {
    color: #172535;
  }
  span {
    margin-right: 10px;
  }
  img {
    width: 24px;
    height: 24px;
  }
}

/deep/ .el-divider.el-divider--horizontal {
  margin: 5px 0;
}
/deep/ .el-icon.el-icon-checked.el-step__icon.el-step__icon--active {
  color: #fd7d18;
  border-radius: 50%;
  width: 12px;
  height: 12px;
  background: #fd7d18;
  &::before {
    color: "";
  }
}
/deep/ .el-step__title.el-step__title--active {
  color: inherit;
}
</style>

<style lang="scss" scoped>
.diag {
  width: 121px;
  height: 27px;
  text-align: left;
  img {
    vertical-align: middle;
    width: 29px;
    height: 27px;
  }
  .diag-title {
    vertical-align: middle;
    height: 25px;
    margin-top: 1px;
    width: 72px;
  }
}
.info44 {
  width: 341px;
  height: auto;
  overflow-wrap: break-word;
  color: rgba(31, 35, 47, 1);
  font-size: 14px;
  letter-spacing: -0.12098753452301025px;
  text-align: center;
  white-space: normal;
  line-height: 20px;
  display: block;
  margin: 20px auto;
}
/deep/ .el-dialog {
  min-height: 20%;
}
/deep/ .el-dialog__footer {
  margin-bottom: 10px;
  display: flex;
  justify-content: space-between;
}
/deep/ .el-dialog__cancel {
  margin: 0 10px;
  width: 120px;
  height: 42px;
  background: #ffffff;
  border-radius: 20px;
  border: 1px solid rgba(0, 0, 0, 0.15);
  .el-button__text {
    height: 33px;
    font-size: 14px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: rgba(0, 0, 0, 0.65);
    line-height: 33px;
  }
}
/deep/ .el-dialog__confirm {
  margin: 0 10px;
  width: 120px;
  height: 42px;
  background: #00b09b;
  border-radius: 20px;
  border: 1px solid rgba(0, 0, 0, 0.15);
  .el-button__text {
    height: 33px;
    font-size: 14px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: #ffffff;
    line-height: 33px;
  }
}
.span-sp {
  width: 100%;
  // height: 17px;
  white-space: normal;
  font-size: 12px;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
  color: #999999;
  line-height: 17px;
  margin: 5px 0;
  span {
    margin-right: 15px;
  }
}
</style>
