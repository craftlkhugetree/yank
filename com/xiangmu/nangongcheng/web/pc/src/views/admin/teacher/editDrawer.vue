<template>
  <s-drawer
    :title="title"
    :drawer="drawer"
    @close="closeDrawer"
    @save="saveAccount"
    :drawerLoading="drawerLoading"
  >
    <div class="drawer-container">
      <!-------------------- 保存 -------------------->
      <el-form
        ref="editForm"
        :model="editForm"
        label-width="150px"
        label-position="right"
        :show-message="true"
        :rules="rules"
      >
        <el-form-item prop="name" label="名师姓名：" style="margin-bottom:16px;">
          <el-input
            v-model="editForm.name"
            placeholder="请输入姓名"
            size="small"
            style="width:300px;"
            maxlength="100"
          ></el-input>
        </el-form-item>
        <el-form-item prop="profile" label="人物介绍：" style="margin-bottom:16px;">
          <el-input
            v-model="editForm.profile"
            placeholder="人物介绍（含出生年月），限400字"
            size="small"
            maxlength="400"
            type="textarea"
            :autosize="{ minRows: 5, maxRows: 10 }"
          ></el-input>
        </el-form-item>
        <el-form-item prop="media" label="音频/视频/图片：" style="margin-bottom:16px;">
          <div class="div_flex">
            <el-button type="default" class="up-btn" size="small" @click="uploadFile">
              <div class="div_flex">
                <i class="iconfont iconupload1"></i>
                &nbsp;&nbsp;上传文件
              </div>
            </el-button>
            <span class="tips_text">支持常见流媒体/图片格式</span>
          </div>
          <div class="card" v-for="(item, index) in fileList" :key="item.id">
            <el-form ref="picForm" label-width="100px" label-position="right">
              <el-form-item prop="fileName" label="文件：" style="margin-bottom:16px;">
                <div class="div_flex">
                  <i class="iconfont iconattachment1"></i>
                  <span class="ellipsis" :title="item.fileName">{{ item.fileName }}</span>
                  <i class="iconfont icon-delete img_right" @click="delPic(index)"></i>
                </div>
                <el-progress
                  v-if="item.videoFlag"
                  :percentage="videoUploadPercent"
                  :stroke-width="3"
                ></el-progress>
              </el-form-item>
              <el-form-item prop="name" label="展示名称：" style="margin-bottom:16px;">
                <el-input
                  v-model="item.name"
                  placeholder="请输入文件名"
                  size="small"
                  style="width:300px;"
                  maxlength="100"
                ></el-input>
              </el-form-item>
            </el-form>
          </div>
        </el-form-item>
      </el-form>
      <upload
        v-show="false"
        ref="upload"
        class="my-upload"
        :url="uploadUrl"
        :multiple="false"
        :exts="mvType + '|\n\r|' + auditType + '|' + imgType"
        @choose="choosefile"
        @done="finish"
        :videoUploadPercent="changeProgress"
      ></upload>
    </div>
  </s-drawer>
</template>

<script>
import { personSave } from '@/api/person';
import { mvType, imgType, auditType } from '@/assets/js/options';
export default {
  props: {
    rs: Number,
  },
  components: {
    upload: () => import('@/components/BaseUpload'),
  },
  data() {
    return {
      title: '新增名师',
      drawer: false,
      drawerLoading: false,
      editForm: {
        name: null, // 姓名
        profile: null,
      },
      roleList: [],
      rules: {
        name: [
          { required: true, message: '请输入姓名', trigger: 'blur' },
          { max: 100, trigger: 'blur' },
        ],
        profile: [{ required: true, message: '请输入人物介绍', trigger: 'blur' }],
      },
      uploadUrl: window.g.url + 'attach/upload',
      mvType,
      imgType,
      auditType,
      fullscreenLoading: null,
      videoUploadPercent: 0,
      fileList: [],
      fileName: '',
    };
  },
  methods: {
    delPic(index) {
      this.fileList.splice(index, 1);
    },
    changeProgress(val) {
      this.videoUploadPercent = val;
    },
    //点击上传
    uploadFile() {
      this.$refs.upload.$refs.uploaddom.click();
    },

    choosefile(f) {
      this.fullscreenLoading = this.$loading({
        lock: true,
        text: '上传中',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)',
      });
      this.fileName = f[0] && f[0].name;
      this.fileList.push({
        fileName: this.fileName,
        videoFlag: true,
      });
    },
    finish(res) {
      this.fullscreenLoading.close();
      if (res && res.code === '000000') {
        let data = { ...res.data };
        data.fileName = data.fileName || this.fileName;
        data.name = data.fileName;
        data.videoFlag = false;
        this.fileList.pop();
        this.fileList.push(data);
        this.$forceUpdate();
      }
    },
    // 关闭抽屉
    closeDrawer() {
      this.$refs.editForm.resetFields();
      this.fileList = [];
      this.editForm = {
        name: null, // 姓名
        profile: null,
      };
      this.drawer = false;
    },
    // 保存
    saveAccount() {
      this.$refs.editForm.validate(valid => {
        if (valid) {
          this.drawerLoading = true;
          let param = { relationship: this.rs };
          for (let key in this.editForm) {
            param[key] = this.editForm[key];
          }
          param.attachs = [];
          this.fileList.forEach(f => {
            param.attachs.push({ id: f.id, name: f.name });
          });
          personSave(param).then(res => {
            this.drawerLoading = false;
            if (res && res.code === '000000') {
              this.$message({
                showClose: true,
                type: 'success',
                message: '保存成功！',
              });
              this.closeDrawer();
              this.$emit('doFunc');
            }
          });
        }
      });
    },
  },
  created() {},
};
</script>

<style lang="scss" scoped>
.drawer-container {
  padding: 30px;
}
.tips {
  width: 400px;
  background: #e6f7ff;
  border-radius: 2px;
  border: 1px solid #91d5ff;
  padding: 9px 14px;
  color: rgba(0, 0, 0, 0.65);
  margin-bottom: 16px;
  span {
    margin: 0 5px;
  }
  .bold,
  i {
    color: #1890ff;
    font-weight: 600;
  }
}
.tips_text {
  font-family: 'PingFang SC';
  font-style: normal;
  font-weight: 400;
  font-size: 14px;
  line-height: 20px;
  color: rgba(0, 0, 0, 0.25);
  margin-left: 12px;
}
.card {
  margin-top: 20px;
  box-sizing: border-box;
  /* 主色/白色 */
  background: #ffffff;
  mix-blend-mode: normal;

  /* 黑色/15 */
  border: 1px solid rgba(0, 0, 0, 0.15);
  .img_right {
    margin-left: auto;
    margin-right: 30px;
    cursor: pointer;
  }
}
</style>
