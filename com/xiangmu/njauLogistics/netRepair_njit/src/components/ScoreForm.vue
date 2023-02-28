<template>
  <el-form
    class="edit-form"
    :model="scoreForm"
    ref="scoreForm"
    :rules="rules"
    label-suffix="："
    size="small"
    v-loading="loading"
  >
    <el-form-item label="维修结果" prop="result" style="margin-bottom:18px;" class="label-margin-top">
      <el-input v-model="scoreForm.result" v-show="false"></el-input>
      <div class="radio-box">
        <div
          class="radio-item"
          :class="{'active': scoreForm.result == item.id}"
          v-for="item in resultList"
          :key="item.id"
          @click="changeResult(item)"
        >
          <img :src="scoreForm.result == item.id ? item.imgA : item.img" alt />
          {{item.name}}
        </div>
      </div>
    </el-form-item>
    <el-form-item
      label="维修评价"
      prop="markscore"
      class="score label-margin-top"
      v-show="scoreForm.result !== '0'"
    >
      <el-input v-model="scoreForm.markscore" v-show="false"></el-input>
      <el-rate v-model="scoreForm.markscore" :colors="['#FD7D18','#FD7D18','#FD7D18']"></el-rate>
    </el-form-item>
    <el-form-item
      label="详细描述"
      prop="note"
      :style="{'margin-left': scoreForm.result == '1' ? '10px' : '0'}"
      :rules="[{required: scoreForm.result == '0', trigger: 'change',message: '请输入说明'}]"
    >
      <el-input
        v-model="scoreForm.note"
        type="textarea"
        maxlength="200"
        rows="5"
        resize="none"
        placeholder="请输入说明，不超过200字"
        style="width:450px;"
      ></el-input>
    </el-form-item>
    <el-form-item
      label="图片说明"
      prop="photos"
      v-if="scoreForm.result == '0'"
      style="margin-left:10px;"
    >
      <div class="upload-box" v-if="scoreForm.photos.length < 3">
        <el-button icon="el-icon-upload2" size="small" @click="upload" :loading="imgLoading">上传图片</el-button>
        <p class="img-des">最多可上传三张照片</p>
      </div>
      <div class="upload-imgs" v-for="(item,index) in scoreForm.photos" :key="item">
        <img :src="fileUrl + item" alt />
        <i class="el-icon-close" @click="deletePhoto(index)"></i>
      </div>
    </el-form-item>
    <el-form-item class="btns">
      <el-button type="primary" @click="doSubmit">评价</el-button>
      <el-button type="info" plain @click="resetForm">重置</el-button>
    </el-form-item>
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
  </el-form>
</template>

<script>
import upload from "./BaseUpload";
export default {
  components: {
    upload
  },
  props: {
    id: String,
    version : String
  },
  data() {
    let checkScore = (rule, value, callback) => {
      if ((value === 0 || !value) && this.scoreForm.result == '1') {
        return callback(new Error(`请进行维修评价`));
      } else {
        callback();
      }
    };
    return {
      loading: false,
      scoreForm: {
        result: "",
        markscore: 0,
        note: "",
        photos: []
      },
      rules: {
        result: [
          { required: true, trigger: "change", message: "请选择维修结果" }
        ],
        markscore: [
          {
            required: true,
            validator: checkScore,
            trigger: "change",
            message: "请进行维修评价"
          }
        ]
      },
      resultList: [
        {
          id: "1",
          name: "已完结",
          imgA: "@/../static/images/yixiufu.png",
          img: "@/../static/images/yixiufu-gray.png"
        },
        {
          id: "0",
          name: "未修复",
          imgA: "@/../static/images/weixiufu.png",
          img: "@/../static/images/weixiufu-gray.png"
        }
      ],
      imgLoading: false
    };
  },
  computed: {
    fileUrl() {
      return this.$store.state.fileUrl;
    }
  },
  methods: {
    // 选择结果
    changeResult(item) {
      this.$refs.scoreForm.resetFields();
      this.scoreForm.result = item.id;
    },
    // 重置
    resetForm() {
      this.$confirm("是否确认重置?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.$refs.scoreForm.resetFields();
        })
        .catch(() => {
          return;
        });
    },
    // 上传
    upload() {
      this.$refs.upload.toupload();
    },
    // 上传完成
    uploaded(res) {
      this.imgLoading = false;
      if (res.success && this.scoreForm.photos.length < 3) {
        this.scoreForm.photos.unshift(res.data[0].ID);
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
      this.scoreForm.photos.splice(index, 1);
    },
    // 评价
    doSubmit() {
      this.$refs.scoreForm.validate(valid => {
        if (valid) {
          this.loading = true;
          let data = _.cloneDeep(this.scoreForm);
          data.photos = data.photos.join(",");
          this.util
            .postAjax({
              code: this.global.code,
              url: "apply/markscore",
              isRep: true,
              data: {
                applyid: this.id,
                version: this.version,
                ...data
              }
            })
            .then(res => {
              this.loading = false;
              if (res.success) {
                this.$message({
                  showClose: true,
                  type: "success",
                  message: "评价成功！"
                });
                this.$emit("doFunc");
              } else {
                this.$message({
                  showClose: true,
                  type: "error",
                  message: "评价失败：" + res.data.message
                });
              }
            })
            .catch(err => {
              this.loading = false;
              this.$message({
                showClose: true,
                type: "error",
                message: "评价失败：" + err
              });
            });
        }
      });
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
  .img-note {
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
