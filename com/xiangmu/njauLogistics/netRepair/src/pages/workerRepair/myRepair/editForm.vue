<template>
  <el-form
    class="edit-form"
    :model="editForm"
    ref="editForm"
    :rules="rules"
    label-suffix="："
    size="small"
    v-loading="loading"
  >
    <el-form-item
      label="图片说明"
      prop="photos"
    >
      <div class="upload-box" v-if="editForm.photos.length < 3">
        <el-button icon="el-icon-upload2" size="small" @click="upload" :loading="imgLoading">上传图片</el-button>
        <p class="img-des">最多可上传三张照片</p>
      </div>
      <div class="upload-imgs" v-for="(item,index) in editForm.photos" :key="item">
        <img :src="fileUrl + item" alt />
        <i class="el-icon-close" @click="deletePhoto(index)"></i>
      </div>
    </el-form-item>
    <el-form-item
      label="详细描述"
      prop="note"
      style="margin-left:10px;"
    >
      <el-input
        v-model="editForm.note"
        type="textarea"
        maxlength="200"
        rows="5"
        resize="none"
        placeholder="请输入说明，不超过200字"
        style="width:400px;"
      ></el-input>
    </el-form-item>
    <!------------------------- 上传组件 ------------------------->
    <upload
      v-show="false"
      :multiple="false"
      :size="20 * 1024"
      exts="bmp|BMP|jpeg|JPEG|jpg|JPG|gif|GIF|png|PNG"
      @done="uploaded"
      @choose="imgLoading=true"
      :url="$store.state.uploadUrl"
      ref="upload"
    ></upload>
  </el-form>
</template>

<script>
import upload from "../../../components/BaseUpload";
export default {
  components: {
    upload
  },
  props: {
    id: String
  },
  data() {
    return {
      loading: false,
      editForm: {
        note: "",
        photos: []
      },
      rules: {
        photos: [
          { required: true, trigger: "change", message: "请上传图片" }
        ]
      },
      imgLoading: false
    };
  },
  computed: {
    fileUrl() {
      return this.$store.state.fileUrl;
    }
  },
  methods: {
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
    }
  }
};
</script>

<style lang="scss" scoped>
.radio-box {
  display: inline-block;
  .radio-item {
    display: inline-block;
    margin-right: 30px;
    color: #999999;
    cursor: pointer;
    &.active {
      color: #666666;
    }
    img {
      width: 24px;
      vertical-align: text-bottom;
      margin-right: 5px;
    }
  }
}
.btns {
  margin-left: 90px;
  .el-button {
    width: 65px;
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