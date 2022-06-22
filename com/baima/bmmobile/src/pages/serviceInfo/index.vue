<template>
  <div style="background:#fff;">
    <van-nav-bar
      ref="navBar"
      title="发布信息"
      :border="false"
      right-text="功能首页"
      @click-right="$router.push('/fun-module')"
    />
    <!-- 上传文件 -->
    <!-- <div class="upload-box" v-if="operType === 'edit'">
      <van-button type="primary" size="small" @click="uploadFile">上传文件</van-button>
    </div> -->
    <!-- 文件列表 -->
    <div class="file-list">
      <div class="file-list-title">全部文件（{{ total }}）</div>
      <div class="file-list-box">
        <van-loading v-show="loading" style="text-align:center;"></van-loading>
        <draggable v-model="list" :disabled="operType !== 'edit'" @end="dragEnd">
          <li v-for="item in list" :key="item.id" ref="lis">
            <img src="../../../static/imgs/bm-file-all.png" />
            <div class="file-list-content">
              <h3 class="ellipsis">{{ item.title }}</h3>
              <span>{{ common.formatTime(item.createtime, 'YYYY.MM.DD hh:mm') }}</span>
            </div>
            <div class="file-list-btns">
              <img
                v-if="operType === 'view'"
                class="file-view"
                src="../../../static/imgs/bm-file-view.png"
                @click="goFileView(item)"
              />
              <img
                class="file-down"
                src="../../../static/imgs/bm-file-down.png"
                @click="common.downloadFile(item.fileid)"
              />
              <img
                v-if="operType === 'edit'"
                class="file-delete"
                src="../../../static/imgs/bm-file-delete.png"
                @click="deleteFile(item)"
              />
              <img
                v-if="operType === 'edit'"
                class="file-move"
                src="../../../static/imgs/bm-file-move.png"
              />
            </div>
          </li>
        </draggable>
      </div>
    </div>
    <!-- 是否确定删除 -->
    <van-action-sheet
      v-model="showConfirmDelete"
      :actions="[{ name: '确定删除', color: '#fe3e61' }]"
      @select="confirmDelete"
      cancel-text="取消"
    />
    <!-- 上传组件 -->
    <upload
      v-show="false"
      ref="upload"
      class="my-upload"
      :url="uploadUrl"
      :multiple="false"
      :exts="fileType"
      :isCarmera="true"
      @choose="choosefile"
      @done="finish"
    ></upload>
  </div>
</template>

<script>
import Upload from '../../components/BaseUpload';
import Draggable from 'vuedraggable';
export default {
  components: {
    Upload,
    Draggable,
  },
  data() {
    return {
      total: 0,
      list: [],
      loading: true,
      fileType: 'jpg|JPG|png|PNG|jpeg|JPEG|pdf|PDF|doc|DOC|docx|DOCX|xls|XLS|xlsx|XLSX',
      showConfirmDelete: false,
      fileId: '',
    };
  },
  computed: {
    uploadUrl() {
      return this.$store.state.uploadUrl;
    },
  },
  props: {
    operType: String, //view查看  edit编辑
  },
  methods: {
    // 点击上传文件按钮
    uploadFile() {
      this.$refs.upload.$refs.uploaddom.click();
    },
    // 选择文件
    choosefile() {
      this.$toast.loading({
        message: '文件上传中...',
        forbidClick: true,
        duration: 0,
      });
    },
    // 上传文件
    finish(res) {
      if (res.success) {
        let data = res.data[0];
        let form = {
          fileid: data.ID,
          ftype: data.FTYPE,
          furl: data.FURL,
          title: data.TITLE,
          createtime: data.CREATETIME,
          levelcode: this.total + 1,
        };

        this.util
          .postAjax({
            code: this.global.bmCode,
            url: '/farmerinfo/add',
            isRep: true,
            data: form,
          })
          .then(res => {
            this.$toast.clear();
            if (res.success == true) {
              this.$toast.success('上传成功');
              this.getList();
            } else {
              this.$toast.fail('上传失败' + '\n' + res.message);
            }
          })
          .catch(err => {
            this.$toast.fail('上传失败' + '\n' + err);
            this.$toast.clear();
          });
      }
    },
    // 拖拽结束
    dragEnd() {
      let data = this.list.map((i, index) => {
        return {
          id: i.id,
          levelcode: index + 1,
        };
      });
      this.util
        .postAjax({
          code: this.global.bmCode,
          url: '/farmerinfo/sort',
          isRep: true,
          data: data,
        })
        .then(() => {})
        .catch(() => {
          this.$toast.fail('排序失败' + '\n' + res.message);
        });
    },
    // 文件预览页面
    goFileView(item) {
      this.$router.push({
        path: '/service-info-view/file-view/' + item.fileid,
        query: {
          ftype: item.ftype,
          title: item.title,
        },
      });
    },
    // 删除文件
    deleteFile(item) {
      this.showConfirmDelete = true;
      this.fileId = item.id;
    },
    // 确认删除
    confirmDelete() {
      this.$toast.loading({
        message: '删除中...',
        forbidClick: true,
        duration: 0,
      });
      this.showConfirmDelete = false;
      this.util
        .postAjax({
          code: this.global.bmCode,
          url: '/farmerinfo/deleteById',
          data: {
            id: this.fileId,
          },
        })
        .then(res => {
          this.$toast.clear();
          if (res.success == true) {
            this.$toast.success('删除成功');
            this.getList();
          } else {
            this.$toast.fail('删除失败' + '\n' + res.message);
          }
        })
        .catch(err => {
          this.$toast.clear();
          this.$toast.fail('删除失败' + '\n' + err);
        });
    },
    // 获取文件列表
    getList() {
      this.loading = true;
      this.util
        .postAjax({
          code: this.global.bmCode,
          url: '/farmerinfo/list?date=' + new Date().getTime(),
        })
        .then(res => {
          this.loading = false;
          if (res.success == true) {
            let list = res.items || [];
            // list.forEach(i => {
            //   i.imgPath = require("../../../static/imgs/bm-file-" +
            //     i.ftype +
            //     ".png");
            // });
            this.list = list;
            this.total = res.total;
          } else {
            this.$toast.fail('获取数据失败' + '\n' + res.message);
          }
        })
        .catch(err => {
          this.loading = false;
          // this.$toast.fail("获取数据失败" + '\n' + err);
        });
    },
  },
  created() {
    this.getList();
  },
};
</script>

<style lang="scss" scoped>
@import '../../assets/css/mixin.scss';
.file-list {
  padding: 0 15px 60px;
  .file-list-title {
    color: #8c8395;
  }
  li {
    list-style: none;
    padding: 15px 0;
    border-bottom: 0.5px solid #e8ebef;
    position: relative;
    @include clearfix;
    img {
      float: left;
      width: 24px;
      height: 26px;
      margin: 5px 15px 0 10px;
    }
    .file-list-content {
      float: left;
      width: calc(100% - 150px);
      h3 {
        font-size: 14px;
        font-weight: bold;
        color: #1f232f;
        margin-bottom: 10px;
        max-width: 90%;
        line-height: 16px;
      }
      span {
        display: inline-block;
        color: #8c8e95;
        max-width: 90%;
      }
    }
    .file-list-btns {
      position: absolute;
      top: 15px;
      right: 0;
      img {
        padding-left: 10px;
        padding-right: 10px;
        margin-left: 0;
        margin-right: 0;
      }
      .file-view {
        width: 38px;
        height: 18px;
      }
      .file-down {
        width: 39px;
        height: 16px;
      }
      .file-delete {
        width: 37px;
        height: 18px;
      }
      .file-move {
        width: 36px;
        height: 14px;
      }
    }
  }
}
/deep/ .van-nav-bar__text {
  color: #00b09b;
  font-size: 16px;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
}
</style>
