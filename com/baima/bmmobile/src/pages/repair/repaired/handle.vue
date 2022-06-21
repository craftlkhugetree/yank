<template>
  <div>
    <van-nav-bar ref="navBar" title="维修办理" :border="false" left-arrow @click-left="goBack" />
    <van-tabs
      ref="tabs"
      v-model="activeTab"
      :border="false"
      color="#00b09b"
      title-active-color="#00b09b"
    >
      <van-tab title="维修" name="repair"></van-tab>
      <van-tab title="转移" name="move"></van-tab>
    </van-tabs>
    <!-- 报修信息 -->
    <div class="form-box">
      <van-form ref="edifForm" input-align="right" error-message-align="right">
        <div class="form-box-content" v-if="'repair' === activeTab">
          <div class="field-box noPad">
            <van-field
              label="选择操作："
              readonly
              :rules="[{ required: true, message: '请选择维修结果' }]"
            >
              <template #input>
                <van-radio-group v-model="editForm.result" direction="horizontal">
                  <van-radio name="3-1">维修完工</van-radio>
                  <van-radio name="3-2">不维修</van-radio>
                </van-radio-group>
              </template>
            </van-field>
          </div>

          <div class="field-box">
            <div class="field-box-textarea">
              <p>详细说明：</p>
              <van-field
                v-model.trim="editForm.note"
                name="详细说明"
                placeholder="请输入"
                rows="3"
                type="textarea"
                maxlength="200"
                :show-word-limit="true"
                input-align="left"
                :rules="[{ required: editForm.result === '3-2', message: '请填写详细说明' }]"
              />
            </div>
          </div>

          <div class="field-box" v-if="editForm.result === '3-1'">
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
        <span class="move-text" v-if="activeTab == 'move'">
          {{ diagBody }}
        </span>

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
      :multiple="false"
      :exts="fileType"
      :isCarmera="true"
      @choose="choosefile"
      @done="finish"
    ></upload>
  </div>
</template>

<script>
import { handleBatch, moveBatch } from '@/assets/js/api';
import { roleId, bizNode } from '@/assets/js/options';
export default {
  components: {
    upload: () => import('@/components/BaseUpload'),
  },
  data() {
    return {
      diagBody: '',
      activeTab: 'repair',
      rInfo: [],
      fileType: 'jpg|JPG|png|PNG|jpeg|JPEG|gif|GIF',
      editForm: {
        note: '',
        result: '',
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
    curRole() {
      return sessionStorage.getItem('curRole') || '';
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
    batchHandle(arr) {
      let fun = 'move' === this.activeTab ? moveBatch : handleBatch;
      fun(arr)
        .then(res => {
          this.$toast.clear();
          if (res.success == true) {
            this.$toast.success('提交成功');
            this.$router.push('/repair');
          } else {
            this.$toast.fail('提交失败' + '\n' + res.message);
          }
        })
        .catch(err => {
          this.$toast.clear();
          this.$toast.fail('提交失败' + '\n' + err);
        });
    },
    // 提交
    doSubmit() {
      const arr = [];
      if (this.activeTab === 'move') {
        this.rInfo.forEach(r => {
          const params = {};
          params.eventType = 2;
          params.repairId = r.id;
          params.repairVersion = r.version;
          params.movedNode = this.curRole === roleId.bm ? bizNode.hq : bizNode.bm;
          arr.push(params);
        });
        this.batchHandle(arr);
        return;
      }
      this.$refs.edifForm.validate().then(() => {
        this.rInfo.forEach(r => {
          const params = {};
          if (this.editForm.result === '3-1') {
            let photos = '';
            this.files.forEach(f => {
              photos += f.ID + ',';
            });
            params.photos = photos.substring(0, photos.length - 1);
          }
          params.note = this.editForm.note;
          params.result = this.editForm.result;
          params.eventType = 3;
          params.repairId = r.id;
          params.repairVersion = r.version;
          arr.push(params);
        });

        this.$toast.loading({
          message: '提交中...',
          forbidClick: true,
          duration: 0,
        });
        this.batchHandle(arr);
      });
    },
  },
  created() {
    this.rInfo = JSON.parse(this.$route.query.data);
    this.diagBody =
      this.curRole === roleId.bm ? '是否转移至后勤管理员？' : '是否转移至白马管理员？';
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
/deep/ .van-radio__icon--checked .van-icon.van-icon-success {
  background-color: #00b09b;
  border-color: #00b09b;
}
.move-text {
  display: inline-block;
  text-align: center;
  width: 100%;
  height: 32px;
  font-size: 16px;
  font-family: PingFangSC-Medium, PingFang SC;
  font-weight: 500;
  color: #20242f;
  line-height: 16px;
}
</style>
