<template>
  <div class="list-box" v-loading="loading">
    <div class="list-box-title">
      <span class="tag">{{common.typeFormat(detail.faulttype)}}</span>
      <span class="title">{{detail.title}}</span>
      <span class="time">{{common.timeFormat(detail.createtime)}}</span>
    </div>
    <!---------------------------------- 收起详情 ---------------------------------->
    <transition name="fade2">
      <div class="list-box-content clearfix" v-if="!showDetail">
        <div class="left-content">
          <p class="ellipsis--l2" style="min-height: 48px;">{{detail.note}}</p>
          <span class="status-tag" v-if="!isDraft">{{common.statusFormat(detail.applystatus)}}</span>
          <!---------------------------------- 草稿状态，可以编辑和删除 ---------------------------------->
          <div class="right-btns" v-if="isDraft">
            <el-button type="info" plain size="small" @click="deleteDraft">删除</el-button>
            <el-button type="primary" plain size="small" @click="toEdit">编辑报修</el-button>
          </div>
          <!---------------------------------- view，只能查看详情 ---------------------------------->
          <div class="right-btns" v-else-if="operType ==='view'">
            <el-button type="primary" plain size="small" @click="getDetail">查看详情</el-button>
          </div>
          <!---------------------------------- edit，并且已提交，可以评价和查看详情 ---------------------------------->
          <div class="right-btns" v-else-if="operType ==='edit'">
            <el-button
              v-if="detail.applystatus === '4'"
              type="info"
              plain
              size="small"
              @click="showDetail=true;"
            >评价</el-button>
            <el-button type="primary" plain size="small" @click="getDetail">查看详情</el-button>
          </div>
        </div>

        <div class="right-content" v-if="!showDetail">
          <div class="images" v-if="detail.photos&&!showDetail">
            <img :src="srcList[0]" alt />
            <span class="count">{{ srcList.length }}图</span>
          </div>
          <img v-else src="../../static/images/nophoto.png" alt />
        </div>
      </div>
    </transition>
    <!---------------------------------- 查看详情 ---------------------------------->
    <mycollapse>
      <div v-if="showDetail">
        <div class="list-box-content" style="margin-bottom:0">
          <p>物品类型：{{detail.itemname || "--"}}</p>
          <p>{{detail.note}}</p>
          <div class="big-images" v-if="detail.photos">
            <el-image v-for="img in srcList" :key="img" :src="img" :preview-src-list="srcList"></el-image>
          </div>
          <!---------------------------------- 报修单进展 ---------------------------------->
          <div class="process" v-if="processList.length > 0">
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
                :operType="operType"
              ></time-line>
              <mycollapse>
                <time-line
                  class="second-time-line"
                  :list="processList.slice(1)"
                  :detail="detail"
                  color="#dbdbdb"
                  v-if="showProcess"
                  :operType="operType"
                ></time-line>
              </mycollapse>
            </div>
          </div>
          <!---------------------------------- 维修评价 ---------------------------------->
          <div class="process" v-if="operType ==='edit' && detail.applystatus === '4'">
            <div class="process-title">
              <span class="title">维修评价</span>
            </div>
            <div class="process-content">
              <score-form ref="scoreComponent" :id="detail.id" @doFunc="getDetail"></score-form>
            </div>
          </div>
        </div>
        <div class="list-box-footer">
          <span class="status-tag">{{common.statusFormat(detail.applystatus)}}</span>
          <div class="right-btns">
            <el-button type="primary" plain size="small" @click="closeEllopse">收起详情</el-button>
          </div>
        </div>
      </div>
    </mycollapse>
  </div>
</template>

<script>
import ScoreForm from "./ScoreForm";
import mycollapse from "../assets/js/collapse.js";
import TimeLine from "./TimeLine";
export default {
  components: {
    ScoreForm,
    mycollapse,
    TimeLine
  },
  props: {
    item: Object,
    operType: {
      type: String,
      default: "view" // view查看，edit编辑
    },
    isDraft: {
      type: Boolean, // 是否草稿
      default: false
    }
  },
  data() {
    return {
      loading: false,
      showDetail: false,
      showProcess: false,
      detail: {}
    };
  },
  computed: {
    fileUrl() {
      return this.$store.state.fileUrl;
    },
    // 图片列表
    srcList() {
      let images = this.item.photos ? this.item.photos.split(",") : [];
      return images.map(i => this.fileUrl + i);
    },
    // 维修进展
    processList() {
      let data = {
        id: "0001",
        type: "报修",
        createtime: this.item.createtime,
        note: "发起报修"
      };
      // 过滤掉办理、撤回、退回、转移
      let events = this.detail.events || [];
      let arr = events.filter(i => !["1", "2", "3", "9"].includes(i.type));
      arr.push(data);
      // 图片列表
      arr.forEach(i => {
        if (i.photos) {
          let list = i.photos.split(",");
          i.photoList = list.map(j => this.fileUrl + j);
        }
      });
      // return this.showProcess ? arr : arr.slice(0, 1);
      return arr;
    }
  },
  methods: {
    closeEllopse() {
      this.showDetail = false;
    },
    // 删除
    deleteDraft() {
      this.$confirm(`是否确认删除该草稿？`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.loading = true;
          this.util
            .postAjax({
              code: this.global.code,
              url: "applydraft/delete",
              data: {
                id: this.item.id
              }
            })
            .then(res => {
              this.loading = false;
              if (res.success) {
                this.$message({
                  showClose: true,
                  type: "success",
                  message: `删除成功！`
                });
                this.$emit("doFunc");
              } else {
                this.$message({
                  showClose: true,
                  type: "error",
                  message: `删除失败：${res.data.message}`
                });
              }
            })
            .catch(err => {
              this.loading = false;
              this.$message({
                showClose: true,
                type: "error",
                message: `删除失败：${err}`
              });
            });
        })
        .catch(() => {
          return;
        });
    },
    // 编辑
    toEdit() {
      this.$router.push(`/draft/${this.item.id}`);
    },
    // 获取数据
    getDetail() {
      this.loading = true;
      this.util
        .postAjax({
          code: this.global.code,
          url: "apply/findById",
          data: {
            id: this.item.id
          }
        })
        .then(res => {
          this.loading = false;
          if (res.success) {
            this.detail = res.data || {};
            this.detail.events.forEach(i => {
              // 如果是派单 和 重复派单，则获取维修单信息
              if (["1", "4"].includes(i.handletype) && i.repairid) {
                this.getRepairInfo(i.repairid).then(res => {
                  i.note = res.sendnote;
                  i.repairername = res.repairername;
                  i.starttime = res.starttime;
                });
              }
            });

            // 评分转换为数值
            let score = this.detail.markscore;
            if (score) {
              this.detail.markscore = parseInt(score);
            }
            this.showDetail = true;
          }
        })
        .catch(err => {
          this.loading = false;
        });
    },
    // 获取维修单信息
    getRepairInfo(repairid) {
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
              // this.$store.commit("setCurRepairItem", res.data || {});
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
  },
  mounted() {
    this.detail = this.item;
  }
};
</script>

<style lang="scss" scoped>
.list-box {
  padding: 20px 30px;
  margin-bottom: 20px;
  border-radius: 5px;
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
  }
  .time {
    float: right;
    font-size: 12px;
    color: #999999;
    line-height: 24px;
  }
}
.list-box-content {
  p {
    font-size: 12px;
    color: #93928e;
    line-height: 24px;
    margin-bottom: 10px;
  }
  .left-content {
    float: left;
    width: calc(100% - 100px);
  }
  .right-content {
    float: right;
    width: 80px;
    height: 80px;
    img {
      width: 100%;
      height: 100%;
      border-radius: 5px;
    }
    .images {
      width: 100%;
      height: 100%;
      position: relative;
      .count {
        position: absolute;
        display: inline-block;
        padding: 5px;
        bottom: 0;
        right: 0;
        background: rgba(0, 0, 0, 0.3);
        border-radius: 5px 0 5px 0;
        color: rgba(255, 255, 255, 0.7);
        font-size: 12px;
      }
    }
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
  }
}
.list-box-footer {
  margin: 0 -30px -10px;
  padding: 10px 30px 0;
  box-shadow: 0px -1px 3px 0px rgba(18, 18, 18, 0.1);
}
.status-tag {
  display: inline-block;
  background: rgba(253, 125, 24, 0.1);
  font-size: 14px;
  color: #fd7d18;
  line-height: 22px;
  padding: 5px 16px;
}
.right-btns {
  float: right;
  .el-button {
    min-width: 80px;
  }
}

// 动画
.slide-fade-enter-active,
.slide-fade-leave-active {
  transition: all 0.5s ease-in;
}
.slide-fade-enter, .slide-fade-leave-to
/* .slide-fade-leave-active for below version 2.1.8 */ {
  transform: translateY(-30px);
  opacity: 0;
}
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
.fade3-enter-active,
.fade3-leave-active {
  transition: opacity 1s;
}
.fade3-enter, .fade3-leave-to
/* .slide-fade-leave-active for below version 2.1.8 */ {
  opacity: 0;
}

// .fade-enter-active, .fade-leave-active {
//   transition: opacity .5s;
// }
// .fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
//   opacity: 0;
// }
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