<template>
  <div>
    <!-- 报修信息 -->
    <el-form
      ref="edifForm"
      input-align="right"
      error-message-align="right"
      :model="editForm"
    >
      <el-form-item
        label="维修结果："
        prop="result"
        :rules="[{ required: true, message: '请选择维修结果' }]"
      >
        <div
          v-for="item in rResult"
          :key="item.icon"
          class="smile"
          @click.stop="clickSmile(item)"
        >
          <img
            :src="
              require(`st@tic/images/${item.click ? item.cIcon : item.icon}`)
            "
            alt
          />
          <span>{{ item.name }}</span>
        </div>
      </el-form-item>

      <el-form-item
        class="forcenter"
        v-if="editForm.result === '4-1'"
        label="维修评价："
        prop="markscore"
        :rules="[
          {
            required: editForm.result === '4-1',
            message: '请打分',
            validator: scoreVal
          }
        ]"
      >
        <el-rate
          v-model="editForm.markscore"
          :size="25"
          color="#ffd21e"
          void-icon="star"
          void-color="#eee"
        />
      </el-form-item>

      <el-form-item
        label="详细描述："
        prop="note"
        :rules="[
          {
            required: editForm.result === '4-2',
            message: '请填写问题描述'
          }
        ]"
      >
        <el-input
          v-model.trim="editForm.note"
          resize="none"
          style="width: 80%"
          name="问题描述"
          placeholder="请输入"
          rows="3"
          type="textarea"
          maxlength="200"
          :show-word-limit="true"
          input-align="left"
        />
      </el-form-item>

      <el-form-item
        label="图片说明："
        v-if="editForm.result === '4-2'"
        prop="files"
      >
        <!-- :rules="[
          {
            required: true,
            validator: (r, v, cb) => {
              if (v && v.length) {
                cb();
              } else {
                return cb(imgErr);
              }
            }
          }
        ]" -->
        <div class="upload-box" v-if="files.length < 3">
          <el-button icon="el-icon-upload2" size="small" @click="uploadFile"
            >上传图片</el-button
          >
          <p class="img-des">最多可上传三张照片</p>
        </div>
      </el-form-item>
    </el-form>

    <div v-if="editForm.result === '4-2'">
      <div class="upload-imgs" v-for="(item, index) in files" :key="item.ID">
        <img :src="viewUrl + item.ID" alt />
        <i class="el-icon-close" @click="deleteFile(index)"></i>
      </div>
    </div>

    <div style="margin-top: 30px">
      <div
        @click.stop="doSubmit"
        class="my-button green"
        style="margin-right: 10px"
      >
        提交评价
      </div>
      <div @click.stop="reset" class="my-button plain-grey">重置</div>
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
      @choose="choosefile"
      @done="finish"
    ></upload>
  </div>
</template>

<script>
import { result } from "@/assets/js/options";
import { evaluation } from "@/assets/js/api";
export default {
  props: {
    rInfo: Object
  },
  components: {
    upload: () => import("@/components/BaseUpload")
  },
  data() {
    return {
      rResult: [],
      fileType: "jpg|JPG|png|PNG|jpeg|JPEG|gif|GIF",
      editForm: {
        note: "",
        result: "",
        markscore: null,
        files: []
      },
      imgErr: new Error(`请上传图片`),
      loading: false,
      files: [],
      maxLen: 3
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
    scoreVal(r, v, cb) {
      if (this.editForm.result === "4-1" && !v) {
        return cb(new Error("请打分"));
      } else {
        cb();
      }
    },
    // 点击上传
    uploadFile() {
      this.$refs.upload.$refs.uploaddom.click();
    },
    // 选择文件
    choosefile() {
      this.loading = true;
    },
    // 上传文件
    finish(res) {
      this.loading = false;
      if (res.success) {
        let data = res.data || [];
        data.forEach(i => {
          i.FILEID = i.ID;
        });
        this.files = data.concat(this.files);
        this.editForm.files = data.concat(this.editForm.files);
      }
    },
    // 删除图片
    deleteFile(index) {
      this.files.splice(index, 1);
      this.editForm.files.splice(index, 1);
    },
    // 提交
    doSubmit() {
      this.$refs.edifForm
        .validate()
        .then(() => {
          const params = {};
          if (this.editForm.result === "4-2") {
            let photos = "";
            this.files.forEach(f => {
              photos += f.ID + ",";
            });
            params.photos = photos.substring(0, photos.length - 1);
          } else {
            params.markscore = this.editForm.markscore;
          }
          params.note = this.editForm.note;
          params.result = this.editForm.result;
          params.eventType = 4;
          params.moveNode = this.rInfo.bizNode;
          params.repairId = this.rInfo.id;
          params.repairVersion = this.rInfo.version;
          evaluation(params)
            .then(res => {
              if (res.success == true) {
                this.$message({
                  showClose: true,
                  type: "success",
                  message: "评价成功"
                });
                this.$parent.findById(this.rInfo.id);
                this.reset();
              } else {
                this.$message({
                  showClose: true,
                  type: "warning",
                  message: res.message
                });
              }
            })
            .catch(err => {});
        })
        .catch(err => {});
    },
    // 维修结果数组
    genR() {
      this.rResult = [];
      result.forEach(r => {
        if (r.icon && r.cIcon) {
          this.rResult.push({ click: false, ...r });
        }
      });
    },
    clickSmile(item) {
      this.$refs.edifForm.clearValidate();
      this.rResult.forEach(r => {
        if (item.val === r.val) {
          this.editForm.result = item.val;
          this.$set(r, "click", true);
        } else {
          this.$set(r, "click", false);
        }
      });
    },
    reset() {
      this.files = [];
      this.editForm = {
        note: "",
        result: "",
        markscore: null
      };
      this.clickSmile({});
    }
  }
};
</script>

<style lang="scss" scoped>
.smile {
  float: left;
  display: flex;
  align-items: center;
  text-align: center;
  margin-right: 20px;
  color: #323233;
  cursor: pointer;
  img {
    width: 24px;
    height: 24px;
  }
  span {
    margin: auto 10px;
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
}

/deep/ .forcenter.el-form-item.is-required {
  display: flex;
  align-items: center;
}
</style>
