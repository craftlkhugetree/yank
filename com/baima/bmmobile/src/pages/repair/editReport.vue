<template>
  <div>
    <van-nav-bar
      ref="navBar"
      :title="isEdit ? '编辑报修' : '我要报修'"
      :border="false"
      left-arrow
      @click-left="goBack"
    />
    <!-- 报修信息 -->
    <div class="form-box">
      <van-form ref="edifForm" input-align="right" error-message-align="right">
        <div class="form-box-content">
          <div class="field-box">
            <p>选择校区：</p>
            <van-field readonly :rules="[{ required: true, message: '请选择校区' }]">
              <template #input>
                <div class="field-box-radio">
                  <van-radio-group v-model="editForm.campus" direction="horizontal" name="campus">
                    <van-radio
                      style="width: 40%; margin-bottom: 5px"
                      :name="item.val + ''"
                      v-for="item in schoolZone"
                      :key="item.val"
                    >
                      {{ item.name }}
                    </van-radio>
                  </van-radio-group>
                </div>
              </template>
            </van-field>
          </div>

          <div class="field-box" v-if="editForm.campus == '2'">
            <p>选择{{ bmjd }}区域：</p>
            <van-field
              readonly
              :rules="[{ required: editForm.campus == '2', message: '请选择区域' }]"
            >
              <template #input>
                <div class="field-box-radio">
                  <van-radio-group v-model="editForm.area" direction="horizontal" name="area">
                    <van-radio
                      style="width: 40%; margin-bottom: 5px"
                      :name="item.val + ''"
                      v-for="item in bmBasement"
                      :key="item.val"
                    >
                      {{ item.name }}
                    </van-radio>
                  </van-radio-group>
                </div>
              </template>
            </van-field>
          </div>

          <div class="field-box">
            <div class="field-box-textarea">
              <p>详细描述：</p>
              <van-field
                v-model.trim="editForm.content"
                name="问题描述"
                placeholder="请描述清楚故障地点和信息"
                rows="3"
                type="textarea"
                maxlength="200"
                :show-word-limit="true"
                input-align="left"
                :rules="[{ required: true, message: '请填写问题描述' }]"
              />
            </div>
          </div>

          <div class="field-box vanFieldPadding">
            <van-field
              v-model="editForm.mobile"
              name="联系电话"
              label="联系电话："
              placeholder="请输入"
              type="tel"
              input-align="right"
              :rules="[
                {
                  required: true,
                  validator: v => {
                    if (v) {
                      return util.regExps.phone.test(v) || util.regExps.yphone.test(v);
                    } else {
                      return true;
                    }
                  },
                  message: '请填写正确的电话号码',
                },
              ]"
            />
          </div>

          <div class="field-box">
            <div class="field-box-files">
              <p>图片说明：</p>
              <p class="pp">最多可上传{{ maxLen }}张图片</p>
              <van-field
                v-model="files.length"
                name="场地图片"
                :rules="[{ required: false }]"
                readonly
              >
                <template #input>
                  <div class="files-box">
                    <li v-if="loading">
                      <van-loading></van-loading>
                    </li>
                    <li v-for="(item, index) in files" :key="item.ID">
                      <img :src="fileUrl + item.FILEID" alt />
                      <van-icon
                        name="clear"
                        color="#fe3e61"
                        size="18px"
                        @click="deleteFile(index)"
                      ></van-icon>
                    </li>
                    <li class="add-file" @click="uploadFile" v-if="files.length < maxLen">
                      <van-icon name="plus" color="#00b09b"></van-icon>
                    </li>
                  </div>
                </template>
              </van-field>
            </div>
          </div>
        </div>
        <div class="form-btns">
          <van-button type="default" @click="doSubmit(0)">保存草稿</van-button>
          <van-button type="primary" @click="doSubmit(1)">提交</van-button>
        </div>
      </van-form>
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
import { bmjd, schoolZone, bmBasement } from '@/assets/js/options';
import { save, findId } from '@/assets/js/api';
export default {
  components: {
    upload: () => import('@/components/BaseUpload'),
  },
  data() {
    return {
      bmjd,
      schoolZone,
      bmBasement,
      fileType: 'jpg|JPG|png|PNG|jpeg|JPEG|gif|GIF',
      loading: false,
      editForm: {
        campus: '',
        area: '',
        content: '',
        mobile: '',
      },
      files: [],
      maxLen: 3,
      // 编辑状态
      isEdit: this.$route.query.id,
    };
  },
  props: {},
  computed: {
    fileUrl() {
      return this.$store.state.fileUrl;
    },
    uploadUrl() {
      return this.$store.state.uploadUrl;
    },
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
        this.files = data.concat(this.files);
      }
    },
    // 删除图片
    deleteFile(index) {
      this.files.splice(index, 1);
    },
    // 提交或暂存
    doSubmit(type) {
      this.$refs.edifForm
        .validate()
        .then(() => {
          let pre = schoolZone.find(s => s.val == this.editForm.campus).name;
          let suf = '';
          if (this.editForm.campus != 2) {
            this.editForm.area = '';
          } else {
            suf = bmBasement.find(b => b.val == this.editForm.area).name;
          }
          let title = suf ? pre + '/' + suf : pre;
          const params = { title };
          let photos = '';
          this.files.forEach(f => {
            photos += f.ID + ',';
          });
          params.bizNode = '_START';
          params.createId = this.$store.state.userInfo.ID;
          params.createName = this.$store.state.userInfo.NAME;
          for (let name in this.editForm) {
            params[name] = this.editForm[name];
          }
          params.photos = photos.substring(0, photos.length - 1);
          params.status = type;
          this.$toast.loading({
            message: '提交中...',
            forbidClick: true,
            duration: 0,
          });
          save(params)
            .then(res => {
              this.$toast.clear();
              if (res.success == true) {
                this.$toast.success('提交成功');
                this.goBack();
              } else {
                this.$toast.fail('提交失败' + '\n' + res.message);
              }
            })
            .catch(err => {
              this.$toast.clear();
              this.$toast.fail('提交失败' + '\n' + err);
            });
        })
        .catch(err => {
          // this.$toast.fail('请填写必要信息');
        });
    },
    // id查询
    findById() {
      this.$toast.loading({
        forbidClick: true,
        duration: 0,
      });
      findId(this.isEdit)
        .then(res => {
          this.$toast.clear();
          if (res && res.success) {
            const photos = res.data.photos;
            this.editForm = { ...res.data };
            let files = (photos && photos.split(',')) || [];
            files.forEach(f => {
              this.files.push({ ID: f, FILEID: f });
            });
          } else {
            this.$toast.fail('获取数据失败' + '\n' + res.message);
          }
        })
        .catch(err => {
          this.$toast.clear();
          this.$toast.fail('获取数据失败' + '\n' + err);
        });
    },
  },
  created() {
    if (this.isEdit) {
      this.findById();
    }
  },
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
  p {
    display: inline-block;
    &.pp {
      font-weight: 400;
      color: #b6bdc6;
    }
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
        object-fit: contain;
        width: 100%;
        height: 100%;
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
/deep/ .van-radio__icon--checked .van-icon-success {
  background-color: #00b09b;
  border-color: #00b09b;
}

/deep/ .vanFieldPadding .van-cell.van-field {
  padding-left: 0;
}
</style>
