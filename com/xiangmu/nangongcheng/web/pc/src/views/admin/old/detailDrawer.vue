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
        label-width="130px"
        label-position="right"
        :show-message="true"
        :rules="rules"
      >
        <el-form-item
          :prop="getKey(item)"
          :label="`${item}：`"
          style="margin-bottom:16px;"
          v-for="item of d[activeTab]"
          :key="item"
        >
          <div v-if="hasSth(item, '日期')" class="date_div_flex">
            <el-date-picker
              v-model="editForm.publishYear"
              type="year"
              placeholder="年"
              size="small"
              style="width: 90px"
              format="yyyy年"
              value-format="yyyy"
              :clearable="false"
            ></el-date-picker>
            <el-select
              v-model="editForm.publishMonth"
              placeholder="月(可省)"
              class="elsel"
              size="small"
            >
              <div slot="prefix">
                <i class="el-input__icon el-icon-date"></i>
              </div>
              <el-option
                v-for="item in genNum(12)"
                :key="item"
                :label="item"
                :value="item"
              ></el-option>
            </el-select>
            <!-- :label="item + '月'" -->
            <el-select
              v-model="editForm.publishDay"
              placeholder="日(可省)"
              class="elsel"
              size="small"
            >
              <div slot="prefix">
                <i class="el-input__icon el-icon-date"></i>
              </div>
              <el-option
                v-for="item in genNum(31)"
                :key="item"
                :label="item"
                :value="item"
              ></el-option>
            </el-select>
          </div>
          <el-input
            v-else-if="hasSth(item, '摘要')"
            v-model="editForm.summary"
            placeholder="请输入详细，限800字"
            size="small"
            maxlength="800"
            type="textarea"
            :autosize="{ minRows: 5, maxRows: 10 }"
          ></el-input>
          <el-input
            v-else
            v-model="editForm[getKey(item)]"
            :placeholder="hasSth(item, '作者') ? `多个请用中文逗号'，'隔开` : '请输入'"
            size="small"
            style="width:300px;"
            maxlength="100"
          ></el-input>
        </el-form-item>
        <el-form-item prop="cover" label="封面图片：" style="margin-bottom:16px;">
          <div class="div_flex">
            <!-- <img :src="viewUrl + editForm.cover" v-if="editForm.cover" class="img_cover" /> -->
            <el-image
              v-if="editForm.cover"
              class="img_cover"
              :src="viewUrl + editForm.cover"
              :preview-src-list="[viewUrl + editForm.cover]"
              alt="暂无封面"
              fit="contain"
            ></el-image>
            <div v-else class="img_alt">暂无封面</div>
            <div class="btn_text">
              <el-button type="default" class="up-btn" size="small" @click="uploadFile">
                <div class="div_flex">
                  <i class="iconfont iconupload1"></i>
                  &nbsp;&nbsp;上传封面
                </div>
              </el-button>
              <span class="tips_text">支持常见图片格式</span>
            </div>
          </div>
          <!-- <el-progress
            v-if="fileList[0] && fileList[0].videoFlag"
            :percentage="videoUploadPercent"
            :stroke-width="3"
          ></el-progress> -->
        </el-form-item>
      </el-form>
      <upload
        v-show="false"
        ref="upload"
        class="my-upload"
        :url="uploadUrl"
        :multiple="false"
        :exts="imgType"
        @choose="choosefile"
        @done="finish"
        :videoUploadPercent="changeProgress"
      ></upload>
    </div>
  </s-drawer>
</template>

<script>
import { SAVE } from '@/api/all';
import { imgType } from '@/assets/js/options';
export default {
  props: {
    d: Object,
    activeTab: String,
    tk: Object,
  },
  components: {
    upload: () => import('@/components/BaseUpload'),
  },
  data() {
    const validateNum = (rule, value, callback) => {
      let reg = /^[0-9]+$/;
      if (!reg.test(value)) {
        callback(new Error('卷数册数均为数字'));
      } else {
        callback();
      }
    };
    return {
      title: '新增',
      drawer: false,
      drawerLoading: false,
      editForm: {
        name: null,
      },
      rules: {
        name: [
          { required: true, message: '请输入名称', trigger: 'blur' },
          { max: 100, trigger: 'blur' },
        ],
        author: [{ required: true, message: '请输入朝代作者', trigger: 'blur' }],
        bookNo: [{ required: true, message: '请输入书号', trigger: 'blur' }],
        volume: [{ required: true, trigger: 'blur', validator: validateNum}],
        copies: [{ required: true, trigger: 'blur', validator: validateNum}],
      },
      uploadUrl: window.g.uploadUrl,
      viewUrl: window.g.viewUrl,
      imgType,
      fullscreenLoading: null,
      videoUploadPercent: 0,
      fileList: [],
      fileName: '',
    };
  },
  computed: {
    genNum() {
      return function(num) {
        const a = [];
        for (let i = 1; i <= num; i++) {
          a.push(i);
        }
        return a;
      };
    },
    save() {
      return function(data) {
        return SAVE(data, this.d.apiPre[this.activeTab]);
      };
    },
    hasSth() {
      return function(title, str, condition = true) {
        return this.common.judgeTitle(title, str, condition)
      };
    },
    getKey() {
      return function(title) {
        let index = this.tk.title.findIndex(k => k === title);
        return this.tk.key[index] || 'date';
      };
    },
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
        this.editForm.cover = data.id;
        this.$forceUpdate();
      }
    },
    // 关闭抽屉
    closeDrawer() {
      this.$refs.editForm.resetFields();
      this.fileList = [];
      this.editForm = {
        name: null,
      };
      this.drawer = false;
    },
    // 保存
    saveAccount() {
      this.$refs.editForm.validate(valid => {
        if (valid) {
          this.drawerLoading = true;
          let param = {};
          for (let key in this.editForm) {
            param[key] = this.editForm[key];
          }
          if (param.author) {
            param.author = param.author.replace(/,/g, '，');
          }
          this.fileList.forEach(f => {
            param.cover = f.id;
          });
          this.drawerLoading = false;
          this.save(param).then(res => {
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
  display: block;
  color: rgba(0, 0, 0, 0.25);
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
.date_div_flex {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 300px;
}
.elsel {
  width: 90px;
  /deep/ .el-input__suffix {
    display: none;
  }
  /deep/ .el-input--suffix .el-input__inner {
    padding-right: 0;
  }
}
.img_alt {
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 14px;
  background: #f5f7fa;
  color: #c0c4cc;
  vertical-align: middle;
  width: 120px;
  height: 160px;
}
.img_cover,
.btn_text {
  width: 120px;
  height: 160px;
}
.btn_text {
  margin-left: 16px;
}
/deep/ .el-image {
  border: 1px solid rgba(0, 0, 0, 0.15);
}
</style>
