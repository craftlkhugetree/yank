<template>
  <div class="baoxiu">
    <h2>我要报修</h2>
    <div @click.stop="reset4Form" class="my-button green reset">重置表单</div>
    <el-divider></el-divider>
    <!-- 报修信息 -->
    <el-form
      style="font-family: PingFangSC-Semibold, PingFang SC;"
      :model="editForm"
      ref="edifForm"
      input-align="right"
      error-message-align="right"
      label-position="top"
      size="small"
      :rules="rules"
    >
      <el-form-item
        label="选择校区："
        prop="campus"
        :rules="[{ required: true, message: '请选择校区' }]"
      >
        <el-radio-group v-model="editForm.campus" class="elRadio">
          <el-radio
            class="itemRadio"
            v-for="item in schoolZone"
            :key="item.val"
            :label="item.val + ''"
            >{{ item.name }}</el-radio
          >
        </el-radio-group>
      </el-form-item>

      <el-form-item
        :label="`选择${bmjd}区域：`"
        prop="area"
        :rules="[{ required: editForm.campus == '2', message: '请选择区域' }]"
        v-if="editForm.campus == '2'"
      >
        <el-radio-group v-model="editForm.area" class="elRadio">
          <el-radio
            class="itemRadio"
            v-for="item in bmBasement"
            :key="item.val"
            :label="item.val + ''"
            >{{ item.name }}</el-radio
          >
        </el-radio-group>
      </el-form-item>

      <el-form-item
        label="详细描述："
        prop="content"
        :rules="[{ required: true, message: '请填写问题描述' }]"
      >
        <el-input
          v-model.trim="editForm.content"
          type="textarea"
          maxlength="200"
          rows="3"
          resize="none"
          placeholder="请描述清楚故障地点和信息"
          :show-word-limit="true"
        ></el-input>
      </el-form-item>

      <el-form-item label="联系电话：" prop="mobile">
        <el-input
          v-model.trim="editForm.mobile"
          maxlength="20"
          placeholder="请输入"
          auto-complete
        ></el-input>
      </el-form-item>

      <el-form-item label="图片说明：">
        <div class="upload-box" v-if="files.length < 3">
          <el-button
            icon="el-icon-upload2"
            size="small"
            @click="uploadFile"
            :loading="imgLoading"
            >上传图片</el-button
          >
          <p class="img-des">最多可上传三张照片</p>
        </div>
      </el-form-item>
    </el-form>

    <div class="upload-imgs" v-for="(item, index) in files" :key="item.ID">
      <img :src="viewUrl + item.ID" alt />
      <i class="el-icon-close" @click="deleteFile(index)"></i>
    </div>

    <div style="margin-top: 30px" class="elRadio">
      <div @click.stop="doSubmit(1)" class="my-button green">提交报修</div>
      <div
        class="my-button plain-green"
        style="width: 150px; margin: 0 10px"
        @click.stop="doSubmit(2)"
      >
        提交并录入下一条
      </div>
      <div @click.stop="doSubmit(0)" class="my-button plain-grey">保存草稿</div>
    </div>

    <!-- 上传组件 -->
    <upload
      v-show="false"
      ref="upload"
      class="my-upload"
      :url="uploadUrl"
      :multiple="false"
      :exts="fileType"
      :isCarmera="true"
      @choose="imgLoading = true"
      @done="finish"
    ></upload>
  </div>
</template>

<script>
import { bmjd, schoolZone, bmBasement } from "@/assets/js/options";
import { save, findId } from "@/assets/js/api";
export default {
  props: { row: Object },
  components: {
    upload: () => import("@/components/BaseUpload")
  },
  data() {
    return {
      bmjd,
      schoolZone,
      bmBasement,
      fileType: "jpg|JPG|png|PNG|jpeg|JPEG|gif|GIF",
      editForm: {
        campus: "",
        area: "",
        content: "",
        mobile: ""
      },
      files: [],
      imgLoading: false,
      maxLen: 3,
      rules: {
        mobile: [
          {
            required: true,
            validator: (r, v, cb) => {
              if (v) {
                if (
                  !(
                    this.util.regExps.phone.test(v) ||
                    this.util.regExps.yphone.test(v)
                  )
                ) {
                  return cb(new Error("请填写正确的电话号码"));
                } else {
                  cb();
                }
              } else {
                return cb(new Error("联系电话不能为空"));
              }
            }
          }
        ]
      }
    };
  },
  computed: {
    viewUrl() {
      return this.$store.state.viewUrl;
    },
    uploadUrl() {
      return this.$store.state.uploadUrl;
    }
  },
  methods: {
    // 重置表单
    reset4Form() {
      this.editForm.campus = "";
      this.editForm.area = "";
      this.editForm.content = "";
      this.editForm.mobile = "";
      this.reset()
    },
    // 点击上传
    uploadFile() {
      this.$refs.upload.$refs.uploaddom.click();
    },
    // 上传文件
    finish(res) {
      this.imgLoading = false;
      if (res.success) {
        let data = res.data || [];
        data.forEach(i => {
          i.FILEID = i.ID;
        });
        this.files = data.concat(this.files);
      }
    },
    // 删除图片
    deleteFile(index) {
      this.files.splice(index, 1);
    },
    // 提交或暂存
    doSubmit(type) {
      this.$refs.edifForm.validate(valid => {
        if (valid) {
          const params = {};
          params.createId = this.$store.state.userInfo.ID;
          params.createName = this.$store.state.userInfo.NAME;

          let pre = schoolZone.find(s => s.val == this.editForm.campus).name;
          let suf = "";
          if (this.editForm.campus != 2) {
            this.editForm.area = "";
          } else {
            suf = bmBasement.find(b => b.val == this.editForm.area).name;
          }
          let title = suf ? pre + "/" + suf : pre;

          for (let name in this.editForm) {
            params[name] = this.editForm[name];
          }
          let photos = "";
          this.files.forEach(f => {
            photos += f.ID + ",";
          });
          params.title = title;
          params.bizNode = "_START";

          params.photos = photos.substring(0, photos.length - 1);
          params.status = type ? 1 : 0;
          this.$emit("loading", true);
          save(params)
            .then(res => {
              this.$emit("loading", false);
              if (res.success) {
                this.$message({
                  showClose: true,
                  type: "success",
                  message: "成功"
                });
                this.$emit("apis", type);
                if (type == 2) {
                  this.reset();
                }
                this.resetForm();
              } else {
                this.$message({
                  showClose: true,
                  type: "warning",
                  message: res.message
                });
              }
            })
            .catch(err => {
              this.$emit("loading", false);
            });
        }
      });
    },
    resetForm() {
      let obj = {
        createId: null,
        createName: null,
        handleTime: null,
        handledNode: null,
        title: null,
        photos: null,
        version: null,
        markscore: null,
        movedNode: null,
        createTime: null,
        bizId: null,
        id: null,
        applyTime: null,
        bizNode: null,
        events: null,
        status: null
      };
      //   this.editForm = Object.assign({}, this.editForm, { ...obj });
      let tmp = {
        campus: "",
        area: "",
        content: "",
        mobile: ""
      };
      for (let name in tmp) {
        tmp[name] = this.editForm[name];
      }
      this.editForm = tmp;
      this.files = [];
    },
    reset() {
      this.files = [];
      this.$refs.edifForm.resetFields();
    },
    // id查询
    findById(id) {
      this.$emit("loading", true);
      findId(id)
        .then(res => {
          this.$emit("loading", false);
          if (res && res.success) {
            this.reset();
            const photos = res.data.photos;
            this.editForm = { ...res.data };
            let files = (photos && photos.split(",")) || [];
            files.forEach(f => {
              this.files.push({ ID: f, FILEID: f });
            });
          } else {
          }
        })
        .catch(err => {
          this.$emit("loading", false);
        });
    }
  }
};
</script>

<style lang="scss" scoped>
.baoxiu {
  h2 {
    display: inline-block;
    height: 25px;
    font-size: 18px;
    font-family: PingFangSC-Semibold, PingFang SC;
    font-weight: 600;
    color: #172535;
    line-height: 25px;
  }
  .reset {
    height: 25px;
    line-height: 25px;
    width: 80px;
    display: inline-block;
    margin-left: 20px;
    cursor: pointer;
  }
}
/deep/ .el-divider.el-divider--horizontal {
  font-family: PingFangSC-Semibold, PingFang SC;
  margin: 5px 0;
}
.upload-box {
  display: inline-block;
  margin-right: 20px;
  vertical-align: top;
  .img-des {
    font-family: PingFangSC-Semibold, PingFang SC;
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
  margin: 10px 12px 10px 0;
  img {
    width: 100%;
    height: 100%;
    object-fit: contain;
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
.elRadio {
  display: flex;
  flex-wrap: wrap;
  .itemRadio {
    flex-basis: 20%;
  }
}
</style>
