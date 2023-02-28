<template>
  <div class="file-list">
    <van-nav-bar fixed title="考核材料" :border="false" left-arrow @click-left="$router.goBack()" />
    <div style="width:100%;height:46px;"></div>
    <div
      class="file-box"
      v-for="(item,index) in fileList"
      :key="item.ID"
      :class="`animation-${index + 1}`"
    >
      <span class="dot"></span>
      <span class="title">{{item.TITLE}}</span>
      <span class="btn" @click="goFileView(item)">查看</span>
    </div>
    <div v-if="fileList.length == 0" class="nodata">暂无数据</div>
  </div>
</template>

<script>
import { fetchFileInfo } from "@/api/kpi/confirm";
export default {
  data() {
    return {
      fileIds: [],
      fileList: []
    };
  },
  methods: {
    // 文件预览页面
    goFileView(item) {
      this.$router.push({
        path: "/file-view/" + item.ID,
        query: {
          ftype: item.FTYPE,
          title: item.TITLE
        }
      });
    },
    // 获取文件列表
    getFileList() {
      // 获取考核文件
      if (this.fileIds.length > 0) {
        fetchFileInfo({ IDs: this.fileIds }).then(res => {
          if (res.success) {
            let data = res.data || {};
            let arr = [];
            for (let key in data) {
              arr.push(data[key]);
            }
            this.fileList = arr;
          }
        });
      }
    }
  },
  created() {
    let data = sessionStorage.getItem("fileIds");
    this.fileIds = data ? data.split(",") : [];
    this.getFileList();
  }
};
</script>

<style lang="scss" scoped>
.file-list {
  width: 100%;
  height: 100%;
  background: #ffffff;
  .file-box {
    padding: 24px 28px;
    border-bottom: 1px solid #dbdbdb;
    .dot {
      float: left;
      width: 12px;
      height: 12px;
      border-radius: 6px;
      background: #3f86f7;
      margin-top: 12px;
    }
    .title {
      display: inline-block;
      width: 80%;
      font-size: 26px;
      color: #333333;
      line-height: 38px;
      padding-left: 20px;
    }
    .btn {
      font-size: 26px;
      color: #3f86f7;
      line-height: 38px;
      float: right;
    }
  }
}
</style>