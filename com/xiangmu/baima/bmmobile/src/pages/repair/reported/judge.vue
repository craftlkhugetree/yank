<template>
  <div>
    <van-nav-bar ref="navBar" title="维修评价" :border="false" left-arrow @click-left="goBack" />
    <!-- 报修信息 -->
    <div class="form-box">
      <van-form ref="edifForm" input-align="right" error-message-align="right">
        <div class="form-box-content">
          <div class="field-box noPad">
            <van-field
              label="维修结果："
              v-model="editForm.result"
              readonly
              :rules="[{ required: true, message: '请选择维修结果' }]"
            >
              <template #input>
                <div
                  v-for="item in rResult"
                  :key="item.icon"
                  class="smile"
                  @click.stop="clickSmile(item)"
                >
                  <img :src="require(`st@tic/imgs/${item.click ? item.cIcon : item.icon}`)" alt />
                  <span>{{ item.name }}</span>
                </div>
              </template>
            </van-field>
          </div>

          <div class="field-box noPad" v-if="editForm.result === '4-1'">
            <van-field
              label="维修评价："
              v-model="editForm.markscore"
              readonly
              :rules="[{ required: editForm.result === '4-1', message: '请打分' }]"
            >
              <template #input>
                <van-rate
                  v-model="editForm.markscore"
                  @change="onChange"
                  :size="25"
                  color="#ffd21e"
                  void-icon="star"
                  void-color="#eee"
                />
              </template>
            </van-field>
          </div>

          <div class="field-box">
            <div class="field-box-textarea">
              <p>详细描述：</p>
              <van-field
                v-model.trim="editForm.note"
                name="问题描述"
                placeholder="请输入"
                rows="3"
                type="textarea"
                maxlength="200"
                :show-word-limit="true"
                input-align="left"
                :rules="[{ required: editForm.result === '4-2', message: '请填写问题描述' }]"
              />
            </div>
          </div>

          <div class="field-box" v-if="editForm.result === '4-2'">
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
          <van-button type="default" @click="reset">重置</van-button>
          <van-button type="primary" @click="doSubmit">提交评价</van-button>
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
import { result } from '@/assets/js/options';
import { evaluation, findId } from '@/assets/js/api';
export default {
  components: {
    upload: () => import('@/components/BaseUpload'),
  },
  data() {
    return {
      rResult: [],
      rInfo: {},
      fileType: 'jpg|JPG|png|PNG|jpeg|JPEG|gif|GIF',
      editForm: {
        note: '',
        result: '',
        markscore: null,
      },
      loading: false,
      files: [],
      maxLen: 3,
    };
  },
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
    // 提交
    doSubmit() {
      this.$refs.edifForm
        .validate()
        .then(() => {
          const params = {};
          if (this.editForm.result === '4-2') {
            let photos = '';
            this.files.forEach(f => {
              photos += f.ID + ',';
            });
            params.photos = photos.substring(0, photos.length - 1);
          } else {
            params.markscore = this.editForm.markscore;
          }
          params.note = this.editForm.note;
          params.result = this.editForm.result;
          // params.createName = this.$store.state.userInfo.NAME;
          // params.createId = this.$store.state.userInfo.ID;
          // params.createTime = this.rInfo.createTime;
          params.eventType = 4;
          params.moveNode = this.rInfo.bizNode;
          params.repairId = this.rInfo.id;
          params.repairVersion  = this.rInfo.version;

          this.$toast.loading({
            message: '提交中...',
            forbidClick: true,
            duration: 0,
          });
          evaluation(params)
            .then(res => {
              this.$toast.clear();
              if (res.success == true) {
                this.$toast.success('提交成功');
                // this.goBack();
                this.$router.push('/report')
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
      findId(this.$route.query.id)
        .then(res => {
          this.$toast.clear();
          if (res && res.success) {
            this.rInfo = { ...res.data };
          } else {
            this.$toast.fail('获取数据失败' + '\n' + res.message);
          }
        })
        .catch(err => {
          this.$toast.clear();
          this.$toast.fail('获取数据失败' + '\n' + err);
        });
    },
    // 维修结果数组
    genR() {
      result.forEach(r => {
        if (r.icon && r.cIcon) {
          this.rResult.push({ click: false, ...r });
        }
      });
    },
    clickSmile(item) {
      this.rResult.forEach(r => {
        if (item.val === r.val) {
          this.editForm.result = item.val;
          this.$set(r, 'click', true);
        } else {
          this.$set(r, 'click', false);
        }
      });
    },
    // 打分
    onChange(val) {
      // console.log(val, this.editForm);
    },
    reset() {
      this.files = [];
      this.editForm = {
        note: '',
        result: '',
        markscore: null,
      };
      this.clickSmile({});
    },
  },
  created() {
    this.findById();
    this.genR();
  },
};
</script>

<style lang="scss" scoped>
.smile {
  display: flex;
  align-items: center;
  text-align: center;
  margin-left: 20px;
  color: #323233;
  img {
    // width: 24px;
    height: 24px;
  }
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
/deep/ .noPad .van-cell.van-field {
  padding-left: 0;
}
</style>
