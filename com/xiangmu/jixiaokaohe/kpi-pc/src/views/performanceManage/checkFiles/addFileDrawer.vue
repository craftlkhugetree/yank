<template>
  <el-drawer
    class="base-drawer"
    title="上传绩效考核文件"
    :visible.sync="drawer"
    v-if="drawer"
    direction="rtl"
    :wrapperClosable="false"
    size="660px"
  >
    <div class="drawer-container">
      <el-form ref="fileForm" :model="fileForm">
        <el-form-item
          label="文件："
          label-width="100px"
          prop="fileId"
          :rules="[{ required: true, message: '请上传文件', trigger:['blur','change']  }]"
        >
          <el-input v-model="fileForm.fileId" v-show="false" />
          <el-button
            icon="el-icon-upload2"
            size="small"
            @click="upload"
            :loading="uploadLoading"
          >上传文件</el-button>
          <span class="upload-des">支持扩展名：.pdf</span>
          <div class="upload-files" v-if="fileForm.fileId">
            <span>
              <i class="el-icon-paperclip"></i>
              <span class="file-title">{{uploadItem.TITLE}}</span>
            </span>
          </div>
        </el-form-item>
      </el-form>
    </div>

    <div class="drawer-footer">
      <el-button type="primary" size="small" @click="doSave">保存</el-button>
      <el-button size="small" @click="drawer = false">取消</el-button>
    </div>
    <!-- ----------------------- 上传组件 ----------------------- -->
    <upload
      v-show="false"
      :multiple="false"
      :size="51200"
      exts="pdf|PDF"
      @done="uploaded"
      @choose="uploadLoading=true"
      :url="uploadUrl"
      ref="upload"
    ></upload>
  </el-drawer>
</template>

<script>
import upload from "@/components/BaseUpload";
import { saveFile } from "@/api/kpi/file";
export default {
  components: {
    upload
  },
  data() {
    return {
      drawer: false,
      fileUrl: window.g.viewUrl,
      uploadUrl: window.g.uploadUrl,
      uploadLoading: false,
      uploadItem: {},
      fileForm: { fileId: "" }
    };
  },
  methods: {
    // 上传
    upload() {
      this.$refs.upload.toupload();
    },
    // 上传完成
    uploaded(res) {
      this.uploadLoading = false;
      if (res.success) {
        this.fileForm.fileId = res.data[0].ID;
        this.uploadItem = res.data[0];
      } else {
        this.$message({
          showClose: true,
          message: "上传失败！",
          type: "error"
        });
      }
    },
    // 取消预约
    doSave() {
      this.$refs.fileForm.validate(valid => {
        if (valid) {
          let data = {
            name: this.uploadItem.TITLE,
            level: "",
            fileid: this.fileForm.fileId
          };
          saveFile(data).then(res => {
            this.loading = false;
            if (res.success) {
              this.$message({
                showClose: true,
                type: "success",
                message: "保存成功！"
              });
              this.$emit("doFunc");
              this.$refs.fileForm.resetFields();
            } else {
              this.$message({
                showClose: true,
                type: "error",
                message: "保存失败"
              });
            }
          });
        }
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.drawer-container {
  // padding: 30px 20px 32px;
  label {
    color: #595959;
    line-height: 30px;
    i {
      color: #ff0000;
      margin-right: 10px;
    }
  }
  .upload-des {
    color: rgba(0, 0, 0, 0.65);
    margin-left: 10px;
  }
  .upload-files {
    color: rgba(0, 0, 0, 0.65);
    .el-icon-paperclip {
      margin-right: 8px;
    }
  }
}
</style>