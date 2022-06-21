<template>
  <div class="my">
    <h2 v-if="isReport">我的报修</h2>
    <el-divider v-if="isReport"></el-divider>
    <!-- 状态图标 -->
    <slot></slot>

    <!-- 列表 -->
    <div
      class="edu-card"
      v-for="(item, index) in tableData"
      :key="item.id"
      :class="{ active: curItem === item.id }"
    >
      <div class="edu-card-title">
        <el-checkbox
          v-model="item.checked"
          v-if="activeTab == 'pending'"
          @change="itemCheck"
          >&nbsp;</el-checkbox
        >
        <h2 @click.stop="toDetail(item)">{{ item.title }}</h2>
        <span class="sp1" @click.stop="toDetail(item)">
          {{ common.formatTime(item.createTime, "YYYY.MM.DD hh:mm:ss") }}
        </span>
      </div>
      <div class="edu-card-content" @click.stop="toDetail(item)">
        <div class="left">
          <p class="wrapper" :id="'wrapper' + index" :title="item.content">
            {{ item.content }}
          </p>

          <div class="sp-text">
            <span
              class="sp2"
              v-if="
                activeTab == 1 ||
                  activeTab == 'processed' ||
                  activeTab == 'transfered'
              "
              >{{ getStatus(item) }}</span
            >
            <div class="title-btns">
              <div
                @click.stop="toJudge(item)"
                class="my-button plain-grey"
                v-if="activeTab == 1 && [3, 2].includes(item.status)"
              >
                评价
              </div>
              <!-- <div
                style="margin-left: 10px"
                @click="toDetail(item)"
                v-if="activeTab == 1"
                class="my-button plain-green"
              >
                查看详情
              </div> -->

              <div
                class="my-button plain-grey"
                @click.stop="deleteRes(item)"
                v-if="activeTab == 2"
              >
                删除
              </div>
              <div
                @click.stop="toEdit(item)"
                v-if="activeTab == 2"
                class="my-button plain-green"
              >
                编辑报修
              </div>
            </div>
          </div>
        </div>
        <div style="flex-grow: 1"></div>
        <div class="imgs2">
          <div class="text" v-if="imgLen(item)">
            <span>{{ imgLen(item) }}图</span>
          </div>
          <img :src="viewUrl + firstImg(item)" alt v-if="firstImg(item)" />
          <img :src="require('st@tic/images/nophoto.png')" v-else />
        </div>
      </div>
    </div>

    <div class="no-data" v-if="total == 0">
      <img src="@/../static/images/nodata.png" alt />
      <span>没有找到记录</span>
    </div>
    <!---------------------------- 前端分页 ---------------------------->
    <div class="pagination-box" v-if="total > 0">
      <el-pagination
        background
        layout="sizes, prev, pager, next"
        :total="total"
        :page-size="pageSize"
        :page-sizes="[5, 10, 15, 20]"
        :current-page.sync="currentPage"
        @current-change="page => changePage(page, pageSize)"
        @size-change="size => changePage(currentPage, size, true)"
      ></el-pagination>
    </div>
  </div>
</template>

<script>
import { repairStatus } from "@/assets/js/options";
export default {
  props: {
    isReport: Boolean,
    total: Number,
    tableData: Array,
    activeTab: Number | String
  },
  computed: {
    viewUrl() {
      return this.$store.state.viewUrl;
    },
    getStatus() {
      return item => repairStatus.find(r => r.val == item.status).name;
    },
    // 列表预览第一张图
    firstImg() {
      return item => (item.photos ? item.photos.split(",")[0] : "");
    },
    imgLen() {
      return item =>
        item.photos && item.photos.split(",").length > 1
          ? item.photos.split(",").length
          : "";
    }
  },
  watch: {
    tableData() {
      this.curItem = (this.tableData[0] && this.tableData[0].id) || "";
    }
  },
  data() {
    return {
      curItem: (this.tableData[0] && this.tableData[0].id) || "",
      curList: [],
      pageSize: 5,
      currentPage: 1
    };
  },
  methods: {
    // 编辑页面
    toEdit(row) {
      this.$emit("trigger", "edit", row.id);
    },
    // 报修详情
    toDetail(row) {
      this.curItem = row.id;
      if (this.isReport) {
        this.$emit("trigger", "detail", row.id);
      } else {
        this.$emit("toDetail", row.id);
      }
    },
    // 评价
    toJudge(row) {
      this.$emit("trigger", "judge", row);
    },
    // 删除
    deleteRes(row) {
      this.$emit("trigger", "delete", row);
    },
    // 前端分页
    changePage(page, pageSize, bool) {
      if (bool) {
        this.currentPage = page = 1;
      }
      this.$parent.$data.isChecked = false;
      this.$parent.$data.isIndeterminate = false;
      this.$emit("getList", page, pageSize);
    },
    // 勾选
    itemCheck(item) {
      let arr = this.tableData.filter(t => t.checked) || [];
      if (!arr.length) {
        this.$parent.$data.isChecked = false;
        this.$parent.$data.isIndeterminate = false;
      } else if (arr.length === this.tableData.length) {
        this.$parent.$data.isChecked = true;
        this.$parent.$data.isIndeterminate = false;
      } else if (arr.length < this.tableData.length) {
        this.$parent.$data.isIndeterminate = true;
      }
      this.$forceUpdate();
    }
  }
};
</script>

<style lang="scss" scoped>
.my {
  h2 {
    display: inline-block;
    height: 25px;
    font-size: 18px;
    font-family: PingFangSC-Semibold, PingFang SC;
    font-weight: 600;
    color: #172535;
    line-height: 25px;
  }
}

.no-data {
  width: 100%;
  padding: 30px 0;
  border-radius: 5px;
  border: 1px dashed #dbdbdb;
  text-align: center;
  color: #999;
  font-size: 14px;
  img {
    width: 100px;
    height: 100px;
    vertical-align: middle;
    margin-right: 20px;
  }
  div {
    display: inline-block;
    text-align: left;
    vertical-align: top;
    p {
      line-height: 20px;
      margin-bottom: 10px;
    }
    .el-button {
      width: 88px;
    }
  }
}
.pagination-box {
  margin-top: 20px;
}

/deep/ .el-divider.el-divider--horizontal {
  margin: 5px 0;
}
.edu-card {
  background: #ffffff;
  box-shadow: 0px 2px 5px 0px rgba(182, 189, 198, 0.22);
  border-radius: 5px;
  margin: 5px 0;
  cursor: pointer;
  &:hover,
  &.active {
    box-shadow: 0px 0px 15px 0px rgba(37, 38, 41, 0.1),
      0px 24px 20px -24px rgba(37, 38, 41, 0.18);
  }
  .edu-card-title {
    padding: 20px 10px;
    width: 100%;
    height: 22px;
    line-height: 22px;
    display: flex;
    flex-wrap: nowrap;
    align-items: center;
    // justify-content: space-between;
    h2 {
      font-size: 16px;
      font-family: PingFangSC-Semibold, PingFang SC;
      font-weight: 600;
      color: #172535;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .sp1 {
      width: 121px;
      height: 17px;
      font-size: 12px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #999999;
      line-height: 17px;
      margin-left: auto;
    }
  }

  .edu-card-content {
    padding: 10px;
    display: flex;
    align-items: center;
    .left {
      height: 80px;
      width: 75%;
      .wrapper {
        height: 44px;
        width: 100%;
        font-size: 14px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #172535;
        line-height: 22px;
        text-align: left;
        overflow: hidden;
        word-wrap: break-word;
        white-space: normal;
        position: relative;
        display: -webkit-box;
        text-overflow: ellipsis;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 2;
        overflow-wrap: break-word;
      }
      .sp-text {
        .sp2 {
          width: 56px;
          height: 22px;
          font-size: 14px;
          font-family: PingFangSC-Regular, PingFang SC;
          font-weight: 400;
          color: #fd7d18;
          line-height: 22px;
        }
        .title-btns {
          vertical-align: middle;
          float: right;
        }
      }
    }

    .imgs2 {
      position: relative;
      height: 80px;
      width: 80px;
      background: #fff;
      line-height: 80px;
      text-align: center;
      vertical-align: middle;
      img {
        width: 80px;
        height: 80px;
        object-fit: contain;
        background-color: #f8f8f8;
      }
      .text {
        position: absolute;
        width: 30px;
        height: 20px;
        background: #000000;
        opacity: 0.3;
        z-index: 999;
        bottom: 0;
        right: 0;
        text-align: center;
        vertical-align: middle;
        // border-radius: 5px;
        border-top-left-radius: 3px;
        border-bottom-right-radius: 3px;
        span {
          position: absolute;
          bottom: 0;
          right: 5px;
          width: 20px;
          height: 17px;
          font-size: 12px;
          font-family: PingFangSC-Regular, PingFang SC;
          font-weight: 400;
          color: #dcdcdc;
          line-height: 17px;
        }
      }
    }
  }
}
/deep/ .el-pagination.is-background {
  float: right;
  padding-bottom: 20px;
}
</style>
