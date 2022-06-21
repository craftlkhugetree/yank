<template>
  <div>
    <van-nav-bar title="维修详情" :border="false" left-arrow @click-left="goBack" />
    <div class="form-box top">
      <div class="form-box-content">
        <div class="field-box">
          <h2>{{ rInfo.title }}</h2>
          <van-divider></van-divider>
          <div class="edu-card-content">
            <div class="left">
              <div class="wrapper">
                {{ rInfo.content }}
              </div>
              <div class="imgs">
                <img
                  :src="fileUrl + item.ID"
                  alt
                  v-for="item in imgs"
                  :key="item.ID"
                  @click="clickImg(item)"
                />
              </div>
              <div class="sp-text">
                <span class="sp1">
                  {{ common.formatTime(rInfo.createTime, 'YYYY.MM.DD hh:mm:ss') }}
                </span>
                <div style="flex-grow: 1"></div>
                <span class="sp2">{{ statusName }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="middle">报修单进展</div>
    <div class="form-box end">
      <div class="form-box-content">
        <div class="field-box">
          <van-steps direction="vertical" :active="0">
            <van-step v-for="(item, index) in disProgress" :key="item.time">
              <h3 :class="index == 0 ? 'first' : ''">{{ item.name }}</h3>
              <p :class="index == 0 ? 'first' : ''">
                {{ common.formatTime(item.time, 'YYYY.MM.DD hh:mm:ss') }}&nbsp;&nbsp;&nbsp;
                {{
                  item.result && ['3-1', '3-2'].includes(item.result.val)
                    ? '处理人：' + `${item.createName}(${item.createId})`
                    : ''
                }}
              </p>
              <div
                v-if="item.result && item.result.cIcon"
                class="end-inline"
                :class="index == 0 ? 'first' : ''"
              >
                维修结果：
                <img :src="require(`st@tic/imgs/${item.result.cIcon}`)" alt />
                <span :class="index == 0 ? 'first' : ''">{{ item.result.name }}</span>
                <van-rate
                  v-if="item.score"
                  v-model="item.score"
                  readonly
                  :size="20"
                  color="#ffd21e"
                  void-icon="star"
                  void-color="#eee"
                />
              </div>
              <span :class="index == 0 ? 'first' : ''">{{ item.content }}</span>
              <div class="imgs">
                <img
                  :src="fileUrl + g.ID"
                  alt
                  v-for="g in item.imgs"
                  :key="g.ID"
                  @click="clickImg(g)"
                />
              </div>
            </van-step>
          </van-steps>
          <div @click.stop="collapse" v-if="progress.length > 2" class="collapse">
            {{ disProgress.length &lt; progress.length ? unfoldStr : foldStr }}
            <van-icon name="arrow-down" v-if="disProgress.length &lt; progress.length" />
            <van-icon name="arrow-up" v-else />
          </div>
        </div>
      </div>
    </div>
    <div class="form-btns" v-if="activeTab === 'pending' && isWorker()">
      <van-button type="default" @click="move">转移</van-button>
      <van-button type="primary" @click="repair">维修</van-button>
    </div>
    <div class="middle" v-if="isConsumer()">维修评价</div>
    <div class="form-box rear" v-if="isConsumer()">
      <span>还没有收到你的评价信息</span>
      <van-button round type="primary" @click="toJudge(rInfo.id)">立即评价</van-button>
    </div>

    <!-- 转移确认框 -->
    <van-dialog
      v-if="dVisible"
      v-model="dVisible"
      :closeOnClickOverlay="false"
      width="90%"
      @confirm="submitDiag"
      @cancel="dVisible = false"
      show-cancel-button
    >
      <template #title>
        <div class="diag">
          <img :src="require('st@tic/imgs/dialog.png')" />
          <span class="diag-title">提示</span>
        </div>
      </template>
      <span class="info44">{{ diagBody }}</span>
    </van-dialog>
  </div>
</template>

<script>
import { findId, move } from '@/assets/js/api';
import { repairStatus, result, roleId, bizNode } from '@/assets/js/options';
import { ImagePreview } from 'vant';

export default {
  data() {
    return {
      dVisible: false,
      diagBody: '',
      rInfo: {},
      imgs: [],
      statusName: '',
      progress: [],
      unfoldStr: '点击展开进展',
      foldStr: '点击收起进展',
      disProgress: [],
    };
  },
  computed: {
    fileUrl() {
      return this.$store.state.fileUrl;
    },
    curRole() {
      return sessionStorage.getItem('curRole') || '';
    },
    activeTab() {
      return sessionStorage.getItem('repairTab') || '';
    },
  },
  watch: {
    disProgress() {
      this.fold = this.disProgress.length < this.progress.length;
    },
  },
  methods: {
    // 返回
    goBack() {
      this.$router.go(-1);
    },
    // id查询
    findById() {
      this.$toast.loading({
        forbidClick: true,
        duration: 0,
      });
      findId(this.$route.query.id)
        .then(res => {
          this.$toast.clear();
          if (res && res.success) {
            this.rInfo = { ...res.data };
            this.statusName = repairStatus.find(r => r.val == this.rInfo.status).name;
            this.transPhotos(res.data, this.imgs);
            this.genProgress();
          } else {
            this.$toast.fail('获取数据失败' + '\n' + res.message);
          }
        })
        .catch(err => {
          this.$toast.clear();
          this.$toast.fail('获取数据失败' + '\n' + err);
        });
    },
    clickImg(item) {
      const url = this.fileUrl + item.ID;
      ImagePreview({ images: [url], showIndex: false });
    },
    // transfer photos to array
    transPhotos(obj, arr) {
      const photos = obj.photos;
      let files = (photos && photos.split(',')) || [];
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
        this.progress.unshift(obj);
      }
      this.disProgress = this.progress.length > 2 ? this.progress.slice(0, 2) : this.progress;
    },
    // 收起
    collapse() {
      this.disProgress =
        this.disProgress.length < this.progress.length ? this.progress : this.progress.slice(0, 2);
    },
    // 获取进展对象
    getProgressObj(item) {
      const r = this.rInfo;
      const et = item.eventType;
      let obj = { imgs: [] };
      if (et == '1') {
        obj.name = '报修';
        obj.time = r.applyTime;
        obj.content = r.content;
        this.transPhotos(r, obj.imgs);
      } else {
        if (et == '4') {
          if (item.result === '4-1') {
            obj.name = '维修结束';
            obj.score = item.markscore ? parseInt(item.markscore) : r.markscore;
          } else if (item.result == '4-2') {
            obj.name = '维修未修复';
          }
        } else if (et == '3') {
          if (item.result === '3-1') {
            obj.name = '维修完工';
          } else if (item.result === '3-2') {
            obj.name = '不维修';
          }
        } else if (et == '2') {
          obj.name =
            '转移' +
            (r.bizNode === bizNode.bm
              ? '到白马管理员'
              : r.bizNode === bizNode.hq
              ? '到后勤管理员'
              : '');
        }
        obj.content = item.note;
        obj.result = result.find(re => re.val === item.result);
        obj.time = item.createTime;
        obj.createId = item.createId;
        obj.createName = item.createName;
        this.transPhotos(item, obj.imgs);
      }
      this.progress.unshift(obj);
    },
    // 评价
    toJudge(id) {
      this.$router.push({ path: '/report/judge', query: { id } });
    },
    // 是否报修者
    isConsumer() {
      return [3, 2].includes(this.rInfo.status) && !this.isWorker();
    },
    // 是否维修人员
    isWorker() {
      return [roleId.bm, roleId.hq].includes(this.curRole);
    },
    // 转移
    move() {
      this.dVisible = true;
      this.diagBody =
        this.curRole === roleId.bm ? '是否转移至后勤管理员？' : '是否转移至白马管理员？';
    },
    // 维修
    repair() {
      this.$router.push({ path: '/repair/handle', query: { data: JSON.stringify([this.rInfo]) } });
    },
    // confirm to move
    submitDiag() {
      const params = {};

      params.moveNode = this.curRole === roleId.bm ? bizNode.hq : bizNode.bm;
      params.repairId = this.rInfo.id;
      params.repairVersion = this.rInfo.version;

      this.$toast.loading({
        message: '转移中...',
        forbidClick: true,
        duration: 0,
      });
      move(params)
        .then(res => {
          this.$toast.clear();
          if (res.success == true) {
            this.$toast.success('转移成功');
            this.$router.push('/repair');
          } else {
            this.$toast.fail('转移失败' + '\n' + res.message);
          }
        })
        .catch(err => {
          this.$toast.clear();
          this.$toast.fail('转移失败' + '\n' + err);
        });
    },
  },
  created() {
    this.findById();
  },
};
</script>

<style lang="scss" scoped>
.top {
  margin-top: 5px;
  h2 {
    width: fit-content !important;
    height: 22px;
    font-size: 16px;
    font-family: PingFangSC-Semibold, PingFang SC;
    font-weight: 600;
    color: #172535;
    line-height: 22px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .edu-card-content {
    .left {
      display: flex;
      flex-wrap: wrap;
      width: 100%;
      .wrapper {
        flex-basis: 100%;
        height: 56px;
        font-size: 14px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #172535;
        line-height: 28px;
        text-align: left;
        display: -webkit-box; // 必须有，否则clamp可能不兼容
        overflow: hidden;
        word-wrap: break-word;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        text-overflow: ellipsis;
      }
      .sp-text {
        flex-basis: 100%;
        margin-top: 10px;
        display: flex;
        align-items: center;
        .sp1 {
          width: 121px;
          height: 17px;
          font-size: 12px;
          font-family: PingFangSC-Regular, PingFang SC;
          font-weight: 400;
          color: #999999;
          line-height: 17px;
        }
        .sp2 {
          width: 56px;
          height: 22px;
          font-size: 14px;
          font-family: PingFangSC-Regular, PingFang SC;
          font-weight: 400;
          color: #fd7d18;
          line-height: 22px;
        }
      }
    }
  }
}
.middle {
  padding: 0 10px;
  width: 100%;
  min-height: 22px;
  font-size: 16px;
  font-family: PingFangSC-Semibold, PingFang SC;
  color: #172535;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.end {
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
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    text-overflow: ellipsis;
    &.first {
      color: #172535;
    }
  }
}

.rear {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-around;
  span {
    text-align: center;
    width: 100%;
    display: block;
    height: 20px;
    font-size: 14px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: #888888;
    line-height: 20px;
  }
  /deep/ .van-button__text {
    color: #fff;
  }
}

.imgs {
  display: flex;
  flex-wrap: nowrap;
  img {
    margin-right: 20px;
    display: inline-block;
    width: 80px;
    height: 80px;
    object-fit: contain;
  }
}

.end-inline {
  display: flex;
  flex-wrap: nowrap;
  align-items: center;
  span {
    margin-right: 10px;
  }
  &.first {
    color: #172535;
  }
}
.collapse {
  margin: 5px auto;
  text-align: center;
}
/deep/ .van-divider.van-divider--hairline {
  margin: 5px 0;
}
/deep/ .van-icon.van-icon-checked.van-step__icon.van-step__icon--active {
  color: #fd7d18;
  border-radius: 50%;
  width: 12px;
  height: 12px;
  background: #fd7d18;
  &::before {
    color: '';
  }
}
/deep/ .van-step__title.van-step__title--active {
  color: inherit;
}
</style>

<style lang="scss" scoped>
.diag {
  width: 121px;
  height: 27px;
  text-align: left;
  margin-left: 10px;
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
/deep/ .van-dialog {
  min-height: 20%;
}
/deep/ .van-dialog__footer {
  margin-bottom: 10px;
  display: flex;
  justify-content: space-between;
}
/deep/ .van-dialog__cancel {
  margin: 0 10px;
  width: 120px;
  height: 42px;
  background: #ffffff;
  border-radius: 20px;
  border: 1px solid rgba(0, 0, 0, 0.15);
  .van-button__text {
    height: 33px;
    font-size: 14px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: rgba(0, 0, 0, 0.65);
    line-height: 33px;
  }
}
/deep/ .van-dialog__confirm {
  margin: 0 10px;
  width: 120px;
  height: 42px;
  background: #00b09b;
  border-radius: 20px;
  border: 1px solid rgba(0, 0, 0, 0.15);
  .van-button__text {
    height: 33px;
    font-size: 14px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: #ffffff;
    line-height: 33px;
  }
}
</style>
