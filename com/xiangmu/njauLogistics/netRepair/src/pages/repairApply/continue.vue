<template>
  <div class="main">
    <div class="title" style="border-bottom: 1px solid #f0f0f0;">
      <span class="title-main">我要续报</span>
      <el-divider direction="vertical"></el-divider>
      <div @click="$router.push('/index')">
        <img src="@/../static/images/home.png" alt />
        <span>首页</span>
      </div>
      <!-- <div class="title-right" @click="clearForm">
        <i class="iconfont iconqingkong"></i>
        <span>清空内容</span>
      </div>-->
    </div>
    <div class="content" v-loading="loading">
      <div class="list-box">
        <div class="list-box-title">
          <span class="tag">{{common.typeFormat(detail.faulttype)}}</span>
          <span class="title">{{detail.title}}</span>
          <span class="time">{{common.timeFormat(detail.createtime)}}</span>
        </div>
        <div class="list-box-content" style="margin-bottom:0">
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
      </div>
      <el-form
        class="edit-form"
        :model="editForm"
        ref="editForm"
        :rules="rules"
        label-position="top"
        label-suffix="："
        size="small"
      >
        <el-form-item label="续报描述" prop="note">
          <el-input
            v-model="editForm.note"
            type="textarea"
            maxlength="200"
            rows="5"
            resize="none"
            placeholder="请输入说明，不超过200字"
          ></el-input>
        </el-form-item>
        <el-form-item label="图片说明" prop="photos">
          <div class="upload-box" v-if="editForm.photos.length < 3">
            <el-button
              icon="el-icon-upload2"
              size="small"
              @click="upload"
              :loading="imgLoading"
            >上传图片</el-button>
            <p class="img-des">最多可上传三张照片</p>
          </div>
          <div class="upload-imgs" v-for="(item,index) in editForm.photos" :key="item">
            <img :src="fileUrl + item" alt />
            <i class="el-icon-close" @click="deletePhoto(index)"></i>
          </div>
        </el-form-item>
      </el-form>
      <div>
        <el-button type="primary" @click="onSubmit('submit')" size="small">提交报修</el-button>
      </div>
    </div>
    <!------------------------- 上传组件 ------------------------->
    <upload
      v-show="false"
      :multiple="false"
      :size="5120"
      exts="bmp|BMP|jpeg|JPEG|jpg|JPG|gif|GIF|png|PNG"
      @done="uploaded"
      @choose="imgLoading=true"
      :url="$store.state.uploadUrl"
      ref="upload"
    ></upload>
  </div>
</template>

<script>
import upload from "../../components/BaseUpload";
export default {
  components: {
    upload
  },
  props: {
    id: String
  },
  data() {
    let checkPhotos = (rule, value, callback) => {
      if (!value || value.length == 0) {
        return callback(new Error("请上传图片"));
      } else {
        callback();
      }
    };
    return {
      loading: false,
      detail: {},
      imgLoading: false,
      editForm: {
        note: null,
        photos: []
      },

      rules: {
        note: [{ required: true, trigger: "blur", message: "请输入续报描述" }],
        photos: [
          {
            required: true,
            trigger: "change",
            validator: checkPhotos,
            message: "请上传图片"
          }
        ]
      }
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
    }
  },
  methods: {
    // 清空表单
    clearForm() {
      this.$refs.editComponent.clearForm();
    },
    // 上传
    upload() {
      this.$refs.upload.toupload();
    },
    // 上传完成
    uploaded(res) {
      this.imgLoading = false;
      if (res.success && this.editForm.photos.length < 3) {
        this.editForm.photos.unshift(res.data[0].ID);
      } else {
        this.$message({
          showClose: true,
          message: "上传失败！",
          type: "error"
        });
      }
    },
    // 删除图片
    deletePhoto(index) {
      this.editForm.photos.splice(index, 1);
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
            this.detail = res.data || {}; // 续报
            this.detail.applycontinues.forEach(i => {
              let images = i.photos ? i.photos.split(",") : [];
              i.srcList = images.map(i => this.fileUrl + i);
            });
            this.detail.applycontinues.sort((a, b) => {
              return a.createtime > b.createtime ? 1 : -1;
            });
          }
        })
        .catch(err => {
          this.loading = false;
        });
    },
    // 提交
    onSubmit() {
      this.$refs.editForm.validate(valid => {
        if (valid) {
          // 发送请求
          this.loading = true;
          this.util
            .postAjax({
              code: this.global.code,
              url: "/applycontinue/save",
              isRep: true,
              data: {
                applyid: this.id,
                note: this.editForm.note,
                photos: this.editForm.photos.join(",")
              }
            })
            .then(res => {
              this.loading = false;
              if (res.success) {
                this.$message({
                  showClose: true,
                  type: "success",
                  message: `提交成功！`
                });
                this.$router.go(-1);
              } else {
                this.$message({
                  showClose: true,
                  type: "error",
                  message: `提交失败！` + res.data.message
                });
              }
            })
            .catch(err => {
              this.loading = false;
              this.$message({
                showClose: true,
                type: "error",
                message: `提交失败！` + err
              });
            });
        }
      });
    }
  },
  created() {
    this.getDetail();
  }
};
</script>

<style lang="scss" scoped>
.main {
  width: 1400px;
  margin: 20px auto 0;
  background: #ffffff;
  border-radius: 5px;
  padding: 30px 400px;
}
.title {
  padding-bottom: 15px;
  .title-main {
    font-size: 16px;
    font-weight: bold;
    color: #464032;
    position: relative;
    z-index: 10;
    &::before {
      position: absolute;
      display: block;
      content: "";
      width: 30px;
      height: 4px;
      background: #fedec5;
      left: 0;
      top: 18px;
      border-radius: 24px;
      z-index: -10;
    }
  }
  & > div {
    display: inline-block;
    cursor: pointer;
    img {
      width: 20px;
      height: 20px;
      margin-right: 4px;
      vertical-align: text-bottom;
    }
    span {
      color: #666666;
    }
    &:hover {
      i,
      span {
        color: #fd7d18;
      }
    }
  }
  .title-right {
    float: right;
  }
  .el-divider--vertical {
    margin: 0 15px;
  }
}
.content {
  padding: 20px 0 30px 0;
}
.list-box {
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

.upload-box {
  display: inline-block;
  margin-right: 20px;
  vertical-align: top;
  .img-des {
    color: rgba(0, 0, 0, 0.45);
  }
}

.upload-imgs {
  position: relative;
  display: inline-block;
  width: 80px;
  height: 80px;
  background: #f6f6f6;
  text-align: center;
  margin-right: 12px;
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  i {
    position: absolute;
    top: 0;
    right: 0;
    background: rgba(0, 0, 0, 0.2);
    color: #ffffff;
    font-size: 10px;
    padding: 2px;
    cursor: pointer;
  }
}
</style>