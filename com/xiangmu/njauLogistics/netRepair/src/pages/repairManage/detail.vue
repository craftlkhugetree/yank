<template>
  <div class="detail" v-loading="loading">
    <h3>报修单详情</h3>
    <el-button
      v-if="detail.applystatus >= '5' && canDown"
      class="top-btn"
      type="primary"
      size="small"
      icon="el-icon-download"
      @click="downloadApply"
    >下载</el-button>
    <div class="detail-content">
      <div class="detail-title">
        <span class="title">{{detail.title}}</span>
        <span class="status-tag">{{common.statusFormat(detail.applystatus)}}</span>
      </div>
      <div class="detail-info">
        <span>报修时间：{{common.timeFormat(detail.createtime)}}</span>
        <span>报修人：{{detail.applyername}}</span>
        <span>联系电话：{{detail.mobile}}</span>
      </div>
      <p>{{detail.note}}</p>
      <div class="big-images" v-if="detail.photos">
        <el-image v-for="img in srcList" :key="img" :src="img" :preview-src-list="srcList"></el-image>
      </div>
      <div v-for="con in detail.applycontinues" :key="con.id">
        <div class="list-box-title">
          <span class="title">我的续报</span>
          <span class="time">{{common.timeFormat(con.createtime)}}</span>
        </div>
        <p>{{con.note}}</p>
        <div class="big-images" v-if="con.photos">
          <el-image
            v-for="img in con.srcList"
            :key="img"
            :src="img"
            :preview-src-list="con.srcList"
          ></el-image>
        </div>
      </div>
    </div>
    <slot></slot>
    <!---------------------------------- 报修单进展 ---------------------------------->
    <div class="process">
      <div class="process-title">
        <span class="title">报修单进展</span>
        <div class="right-btn" @click="showProcess = !showProcess">
          <span>维修单位：{{common.deptFormat(detail.repairdeptid)}}</span>
          <el-divider direction="vertical"></el-divider>
          <span>{{showProcess ? "收起进展": "展开更多"}}</span>
          <i :class="showProcess ? 'el-icon-arrow-up' : 'el-icon-arrow-down'"></i>
        </div>
      </div>
      <div class="process-content">
        <time-line
          class="first-time-line"
          :class="{'show-process': showProcess && processList.length > 1}"
          :list="processList.slice(0,1)"
          :detail="detail"
          color="#FD7D18"
        ></time-line>
        <mycollapse>
          <time-line
            class="second-time-line"
            :list="processList.slice(1)"
            :detail="detail"
            color="#dbdbdb"
            v-if="showProcess"
          ></time-line>
        </mycollapse>
      </div>
    </div>
  </div>
</template>

<script>
import mycollapse from "../../assets/js/collapse";
import timeLine from "./timeLine";
export default {
  components: {
    mycollapse,
    timeLine
  },
  props: {
    id: String,
    canDown: {
      // 是否可以下载报修单
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      loading: false,
      detail: {},
      showProcess: false,
      lastRepairIndex: "" // 最后一个维修单索引
    };
  },
  computed: {
    fileUrl() {
      return this.$store.state.fileUrl;
    },
    // 图片列表
    srcList() {
      let images = this.detail.photos ? this.detail.photos.split(",") : [];
      return images.map(i => this.fileUrl + i);
    },
    // 报修单进展
    processList() {
      let data = {
        id: "0001",
        type: "报修",
        createtime: this.detail.createtime,
        note: "发起报修"
      };
      let arr = _.cloneDeep(this.detail.events) || [];
      arr.push(data);
      // 图片列表
      arr.forEach(i => {
        if (i.photos) {
          let list = i.photos.split(",");
          i.photoList = list.map(j => this.fileUrl + j);
        }
      });
      return this.showProcess ? arr : arr.slice(0, 1);
    }
  },
  watch: {
    id() {
      // this.repairApplyList = [];
      this.getDetail();
    }
  },
  methods: {
    // 下载
    downloadApply() {
      let url = `${window.g.url}apply/downloadPdf?applyid=${this.id}`;
      window.open(url, "_blank");
    },
    // 获取数据
    getDetail() {
      this.loading = true;
      this.util
        .postAjax({
          code: this.global.code,
          url: "apply/findById",
          data: {
            id: this.id
          }
        })
        .then(res => {
          this.loading = false;
          if (res.success) {
            this.detail = res.data || {};

            // 续报
            this.detail.applycontinues.forEach(i => {
              let images = i.photos ? i.photos.split(",") : [];
              i.srcList = images.map(i => this.fileUrl + i);
            });
            this.detail.applycontinues.sort((a,b) => {
              return a.createtime > b.createtime ? 1 : -1;
            })

            let indexArr = []; // 暂存派单和重复派单的index
            this.detail.events.forEach((i, index) => {
              // 如果是派单 和 重复派单，则获取维修单信息
              if (["1", "4"].includes(i.handletype) && i.repairid) {
                indexArr.push(index);
                this.getRepairInfo(i.repairid, index).then(res => {
                  i.note = res.sendnote;
                  i.repairername = res.repairername;
                  i.starttime = res.starttime;
                });
              }
            });
            // 取index最小的为最后一个维修单index
            if (indexArr.length > 0) {
              this.lastRepairIndex = Math.min(...indexArr);
            } else {
              this.$store.commit("setCurRepairItem", {});
            }
            // 评分转换为数值
            let score = this.detail.markscore;
            if (score) {
              this.detail.markscore = parseInt(score);
            }
          }
        })
        .catch(err => {
          this.loading = false;
        });
    },

    // 获取维修单信息
    getRepairInfo(repairid, index) {
      return new Promise((resolve, reject) => {
        this.loading = true;
        this.util
          .postAjax({
            code: this.global.code,
            url: "repair/findById",
            data: {
              id: repairid
            }
          })
          .then(res => {
            this.loading = false;
            if (res.success) {
              let data = res.data || {};
              // 设置当前的维修单信息
              if (index === this.lastRepairIndex) {
                this.$store.commit("setCurRepairItem", data);
              }
              // if (res.data.id) {
              //   this.getRepairApplyList(res.data.id);
              // }
              resolve(res.data);
            } else {
              reject(res.data.message);
            }
          })
          .catch(err => {
            this.loading = false;
            reject(err);
          });
      });
    }

    // 获取关联报修单
    // getRepairApplyList(id) {
    //   this.util
    //     .postAjax({
    //       code: this.global.code,
    //       url: "repair/queryApplyByRepairId",
    //       data: {
    //         id: id
    //       }
    //     })
    //     .then(res => {
    //       this.loading = false;
    //       if (res.success) {
    //         let data = res.data || [];
    //         this.repairApplyList = data.filter(i => i.id !== this.id);
    //       } else {
    //       }
    //     })
    //     .catch(err => {
    //       this.loading = false;
    //     });
    // }
  },
  created() {
    this.getDetail();
  }
};
</script>

<style lang="scss" scoped>
.detail {
  position: relative;
  margin: 0 20px 20px 0;
  padding: 25px 20px;
  background: #ffffff;
  box-shadow: 0px 0px 15px 0px rgba(37, 38, 41, 0.1),
    0px 24px 20px -24px rgba(37, 38, 41, 0.18);
  border-radius: 5px;
  h3 {
    color: #464032;
    font-size: 16px;
    font-weight: 600;
    padding-bottom: 15px;
    border-bottom: 1px solid #dbdbdb;
  }
  .top-btn {
    position: absolute;
    top: 15px;
    right: 20px;
  }
  h4 {
    margin-bottom: 10px;
  }
  .detail-title {
    padding-top: 20px;
    padding-bottom: 5px;
    line-height: 32px;
    .title {
      color: #638dec;
      font-size: 16px;
      font-weight: 600;
    }
    .status-tag {
      float: right;
      background: rgba(253, 125, 24, 0.1);
      font-size: 14px;
      color: #fd7d18;
      line-height: 22px;
      padding: 5px 16px;
    }
  }
  .detail-info {
    line-height: 17px;
    margin-bottom: 10px;
    span {
      color: #999999;
      font-size: 12px;
      margin-right: 30px;
    }
  }
  p {
    color: #666666;
    font-size: 14px;
    line-height: 28px;
    margin-bottom: 20px;
  }
  .big-images {
    margin-bottom: 30px;
    .el-image {
      width: 160px;
      height: 160px;
      margin-right: 20px;
    }
  }
}
.process {
  .process-title {
    padding-bottom: 10px;
    border-bottom: 1px solid #dbdbdb;
    .title {
      color: #464032;
      font-weight: 600;
      font-size: 16px;
    }
    .right-btn {
      float: right;
      font-size: 12px;
      color: #999999;
      cursor: pointer;
    }
    .title,
    .right-btn {
      line-height: 22px;
    }
  }
  .process-content {
    padding: 25px 0 0;
    .process-box {
      padding: 5px 0 0;
      color: #999999;
      .time {
        margin-right: 20px;
        font-size: 12px;
      }
      p {
        margin: 10px 0;
        font-size: 14px;
        line-height: 20px;
        color: #999999;
      }
      .images {
        margin-bottom: 10px;
        .el-image {
          width: 80px;
          height: 80px;
          margin-right: 10px;
        }
      }
      .result {
        margin: 10px 0;
        font-size: 14px;
        line-height: 30px;
        label {
          margin-right: 5px;
        }
        img {
          width: 24px;
          height: 24px;
          margin-right: 5px;
          vertical-align: middle;
        }
        .score {
          float: right;
          .el-rate {
            float: right;
          }
        }
      }
    }
    .el-timeline-item.active {
      .process-box {
        color: #666666;
        p {
          color: #666666;
        }
      }
    }
  }
}


.list-box-title {
  margin-bottom: 10px;
  .tag {
    display: inline-block;
    font-size: 12px;
    line-height: 20px;
    padding: 2px 6px;
    background: #f6f6f6;
    margin-right: 6px;
    color: #a7a7a7;
  }
  .title {
    font-size: 16px;
    color: #464032;
    line-height: 24px;
    font-weight: 600;
  }
  .time {
    float: right;
    font-size: 12px;
    color: #999999;
    line-height: 24px;
  }
}

// 动画
.list-leave-active,
.list-enter-active {
  transition: all 0.5s ease-in;
}
.list-enter, .list-leave-to
/* .list-leave-active for below version 2.1.8 */ {
  opacity: 0;
  transform: translateY(-30px);
}
</style>