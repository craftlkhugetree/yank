<template>
  <div class="base-search-table detail">
    <div class="search-box clearfix">
      <i class="el-icon-arrow-left" @click="$router.go(-1)">返回</i>
      <el-divider direction="vertical"></el-divider>查看资料
      <!---------------------------- 查询条件 ---------------------------->
      <div class="search-box-right" style="max-width: 100%">
        <el-button type="primary" size="small" @click="toEdit">编辑</el-button>
        <el-button size="small" class="bule-border" @click="deleteTrain"
          >删除</el-button
        >
      </div>
    </div>
    <div class="content">
      <!---------------------------- 标题 ---------------------------->
      <h3>{{ detail.name }}</h3>
    <div class="sub">
      <p class="w">
        {{ detail.watchCount }}阅读 · {{!(type == '3') ? detail.downloadCount + '下载 ·' : ''}}
        {{ !(type == '3') ? common.learnSizeFormat(detail.fileSize) + ' ·' : ''}}
        {{ common.defaultTimeFormat(detail.createTime)}}
      </p>
        <p v-if="!(type == '3')" class="download" @click="downloadF"><img src="@/assets/img/download.png">下载</p>
        <!-- <p v-if="!(type == '3')" class="download" @click="downloadF"><i class="el-icon-download"></i>下载</p> -->
        </div>
      <!---------------------------- 视频和文档 ---------------------------->
      <div class="video-box" v-if="detail.id">
        <video
          v-if="type == '1'"
          ref="video"
          controls
          :src="fileViewUrl + detail.id"
        >
          您的浏览器不支持HTML5 video标签
        </video>
        <iframe
          v-if="type == '2'"
          ref="pdf"
          :src="fileViewUrl + detail.id"
          width="100%"
          height="680px"
        ></iframe>
      </div>
      <!---------------------------- 封面和简介 ---------------------------->
      <div class="desc-box">
        <img :src="imgViewUrl + detail.cover" alt />
        <div class="desc">{{ detail.desc }}</div>
      </div>
      <!---------------------------- 在线文章 ---------------------------->
      <div class="dhtml" v-if="type == '3'" v-html="detail.dhtml"></div>
      <!---------------------------- 所属模块、校区、用户类型 ---------------------------->
      <div class="tag-box">
        <div>
          <label>所属模块：</label>
          <div class="tags">
            <span v-for="item in detail.models" :key="item.id">{{
              item.name
            }}</span>
          </div>
        </div>
        <div>
          <label>所属校区：</label>
          <div class="tags">
            <span v-for="item in detail.campuss" :key="item.id">{{
              item.name
            }}</span>
          </div>
        </div>
        <div>
          <label>用户类型：</label>
          <div class="tags">
            <span v-for="item in detail.usertypes" :key="item.id">{{
              item.name
            }}</span>
          </div>
        </div>
        <div v-if="!(type == '3')">
          <label>开启下载：</label>
          <span>{{ detail.isDownload == "1" ? "是" : "否" }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { fetchDetail, deleteLearn } from "@/api/train";
export default {
  props: {
    type: String, // 1视频, 2文档, 3在线文章
    id: String,
  },
  data() {
    return {
      loading: false,
      detail: {},
      fileViewUrl: window.g.fileViewUrl,
      imgViewUrl: window.g.viewUrl,
    };
  },
  methods: {
    downloadF() {
      let f = this.detail.fileName;
      let a = f.split('.') || [];
      let len = a.length;
      let ext = len && a[len - 1];
      let left = f.indexOf('.' + ext);
      let name = f.substring(0, left);
      this.util.exportFile('learn/download/' + this.id, true, {}, name, 'pdf')
    },
    // 编辑
    toEdit() {
      this.$router.push(`/train/edit/${this.id}`);
    },

    // 获取详情
    getDetail() {
      this.loading = true;
      fetchDetail(this.id)
        .then((res) => {
          this.loading = false;
          if (res.code == "000000") {
            this.detail = res.data || {};
          } else {
            this.$message({
              showClose: true,
              type: "error",
              message: "获取详情失败：" + res.msg,
            });
          }
        })
        .catch((err) => {
          this.loading = false;
          this.$message({
            showClose: true,
            type: "error",
            message: "获取详情失败：" + err,
          });
        });
    },

    // 删除
    deleteTrain() {
      const h = this.$createElement;
      this.$confirm("", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
        message: h("p", null, [
          h(
            "span",
            { style: "white-space: normal" },
            `是否确认删除培训资料『 ${this.detail.name}』？`
          ),
        ]),
      })
        .then(() => {
          this.loading = true;
          deleteLearn(this.id)
            .then((res) => {
              this.loading = false;
              if (res.code == "000000") {
                this.$message({
                  showClose: true,
                  type: "success",
                  message: `删除成功！`,
                });
                this.$router.go(-1);
              } else {
                this.$message({
                  showClose: true,
                  type: "error",
                  message: `删除失败：${res.msg}`,
                });
              }
            })
            .catch((err) => {
              this.loading = false;
              this.$message({
                showClose: true,
                type: "error",
                message: `删除失败：${err}`,
              });
            });
        })
        .catch(() => {
          return;
        });
    },
  },
  created() {
    this.getDetail();
  },
};
</script>

<style lang="scss" scoped>
.search-box {
  font-size: 16px;
  font-weight: 600;
  color: #373b4b;
  line-height: 58px;
  padding: 0 20px !important;
  border-bottom: 1px solid #dbdbdb;
  i {
    font-size: 14px;
    font-weight: 400;
    color: #3f86f7;
    cursor: pointer;
    margin-right: 5px;
  }
}
.content {
  width: 800px;
  margin: 0 auto;
  padding: 20px 0;
  h3 {
    font-size: 20px;
    font-weight: 600;
    color: #373b4b;
    line-height: 28px;
    margin-bottom: 10px;
  }
  .sub {
    font-size: 13px;
    font-weight: 400;
    color: #7e8081;
    line-height: 22px;
    margin-bottom: 10px;
    .w {
      display: inline-block;
    }
    .download {
      cursor: pointer;
      float: right;
      img {
        width: 13px;
        height: 13px;
      }
    }
  }
  video {
    width: 800px;
    height: 450px;
  }
  .desc-box {
    border: 1px solid #dbdbdb;
    border-width: 1px 0;
    padding: 20px 0;
    margin: 20px 0;
    display: flex;
    img {
      height: 100px;
      width: auto;
      max-width: 168px;
      margin-right: 20px;
    }
    .desc {
      flex: 1;
      color: #7e8081;
      line-height: 22px;
      height: 90px;
      display: -webkit-box;
      text-overflow: ellipsis;
      overflow: hidden;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
    }
  }
  .tag-box {
    label {
      color: #5f6464;
      line-height: 32px;
    }
    .tags {
      display: inline-block;
      width: calc(100% - 80px);
      vertical-align: top;
      margin-bottom: 10px;
    }
    span {
      display: inline-block;
      background: #f1f2f3;
      border-radius: 16px;
      color: #61666d;
      line-height: 22px;
      padding: 5px 12px;
      margin-right: 10px;
      margin-bottom: 10px;
      white-space: nowrap;
    }
  }
  /deep/ .dhtml {
    width: 100%;
    color: #5f6464;
    line-height: 24px;
    padding-bottom: 20px;
    margin-bottom: 20px;
    border-bottom: 1px solid #dbdbdb;

    table {
      width: 100%;
      border: none;
      border-collapse: collapse;
    }
    table td,
    table th {
      border: 1px solid black !important;
      padding: 3px 5px;
      min-width: 50px;
      height: 20px;
    }
    table th {
      border-right: 1px solid #ccc;
      border-bottom: 2px solid #ccc;
      text-align: center;
      background-color: #f1f1f1;
    }
    blockquote {
      display: block;
      border-left: 8px solid #d0e5f2;
      padding: 5px 10px;
      margin: 10px 0;
      line-height: 1.4;
      font-size: 100%;
      background-color: #f1f1f1;
    }
    code {
      display: inline-block;
      *display: inline;
      *zoom: 1;
      background-color: #f1f1f1;
      border-radius: 3px;
      padding: 3px 5px;
      margin: 0 3px;
    }
    pre code {
      display: block;
    }
    ul,
    ol {
      margin: 10px 0 10px 20px;
    }
    pre {
      border: 1px solid #ccc;
      background-color: #f8f8f8;
      padding: 10px;
      margin: 5px 0px;
      font-size: 0.8em;
      border-radius: 3px;
    }
    .ql-editor ul li {
      list-style-type: disc; // 解决序列li前面的.不展示问题
    }
    .ql-editor ol li {
      list-style-type: decimal; // 解决序列li前面的数字不展示问题
    }
    i {
      font-style: italic !important;
    }
  }
}
</style>
