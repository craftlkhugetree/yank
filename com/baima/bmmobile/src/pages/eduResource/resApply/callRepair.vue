<template>
  <div>
    <van-nav-bar ref="navBar" title="报修" :border="false" left-arrow @click-left="goBack" />
    <!-- 报修信息 -->
    <div class="form-box">
      <div class="form-box-title fit-title">资源编号：{{repairMsg.rescode}}</div>
      <van-form ref="edifForm" input-align="right" error-message-align="right">
        <div class="form-box-content">
          <div class="field-box">
            <div class="field-box-textarea">
              <p>问题描述</p>
              <van-field
                v-model="editForm.problemnote"
                name="问题描述"
                placeholder="请输入"
                rows="3"
                type="textarea"
                maxlength="500"
                :show-word-limit="true"
                input-align="left"
                :rules="[{ required: true, message: '请填写问题描述' }]"
              />
            </div>
          </div>
          <div class="field-box">
            <div class="field-box-files">
              <p>场地图片</p>
              <van-field
                v-model="editForm.files.length"
                name="场地图片"
              >
                <template #input>
                  <div class="files-box">
                    <li v-if="loading">
                      <van-loading></van-loading>
                    </li>
                    <li v-for="(item,index) in editForm.files" :key="item.ID">
                      <img :src="fileUrl + item.FILEID" alt />
                      <van-icon name="clear" color="#fe3e61" size="18px" @click="deleteFile(index)"></van-icon>
                    </li>
                    <li class="add-file" @click="uploadFile">
                      <van-icon name="plus" color="#00b09b"></van-icon>
                    </li>
                  </div>
                </template>
              </van-field>
            </div>
          </div>
        </div>
        <div class="form-btns">
          <van-button type="default" @click="goBack">取消</van-button>
          <van-button type="primary" @click="doSubmit">提交</van-button>
        </div>
      </van-form>
    </div>

    <!-- 上传组件 -->
    <upload
      v-show="false"
      ref="upload"
      class="my-upload"
      :url="uploadUrl"
      :multiple="true"
      :exts="fileType"
      :isCarmera="true"
      @choose="choosefile"
      @done="finish"
    ></upload>
  </div>
</template>

<script>
import upload from "../../../components/BaseUpload";
export default {
  components: {
    upload
  },
  data() {
    return {
      fileType: "jpg|JPG|png|PNG|jpeg|JPEG|gif|GIF",
      loading: false,
      editForm: {
        problemnote: "",
        files: []
      }
    };
  },
  props: {
    resid: String
  },
  computed: {
    fileUrl() {
      return this.$store.state.fileUrl;
    },
    uploadUrl() {
      return this.$store.state.uploadUrl;
    },
    repairMsg() {
      let data = sessionStorage.getItem("repairMsg");
      return data ? JSON.parse(data) : {};
    }
  },
  methods: {
    // 返回
    goBack() {
      this.$router.go(-1);
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
        this.editForm.files = data.concat(this.editForm.files);
      }
    },
    // 删除图片
    deleteFile(index) {
      this.editForm.files.splice(index, 1);
    },
    // 提交
    doSubmit() {
      this.$refs.edifForm
        .validate()
        .then(() => {
          this.$toast.loading({
            message: "提交中...",
            forbidClick: true,
            duration: 0
          });
          this.util
            .postAjax({
              code: this.global.bmCode,
              url: "/sprepair/add",
              isRep: true,
              data: {
                ...this.editForm,
                sprestypeid: this.repairMsg.sprestypeid,
                orgid: this.repairMsg.orgid,
                resList: [{
                    resid: this.resid
                }]
              }
            })
            .then(res => {
              this.$toast.clear();
              if (res.success == true) {
                this.$toast.success("提交成功");
                this.goBack();
              } else {
                this.$toast.fail("提交失败" + '\n' + res.message);
              }
            })
            .catch(err => {
              this.$toast.clear();
              this.$toast.fail("提交失败" + '\n' + err);
            });
        })
        .catch(err => {
          this.$toast.fail("请填写正确信息");
        });
    }
  }
};
</script>

<style lang="scss" scoped>
.fit-title {
  width: fit-content !important;
  padding-right: 10px !important;
  max-width: 80% !important;
}
.field-box-files {
  .van-cell {
    padding: 10px 0;
  }
  .files-box {
    width: 100%;
    li {
      list-style: none;
      float: left;
      width: 90px;
      height: 90px;
      line-height: 90px;
      border-radius: 5px;
      text-align: center;
      vertical-align: middle;
      background: #f8f8f8;
      position: relative;
      margin-bottom: 15px;
      img {
        width: 100%;
        vertical-align: middle;
      }
      .van-icon-clear {
        position: absolute;
        top: -9px;
        right: -9px;
      }
      &:not(:last-child) {
        margin-right: 20px;
      }
      &.add-file {
        border: 1px dashed #00b09b;
        .van-icon-plus {
          font-size: 20px;
        }
      }
    }
  }
}
</style>