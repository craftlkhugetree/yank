<template>
  <div style="margin-bottom:54px;">
    <van-nav-bar
      :title="title"
      :border="false"
      left-arrow
      @click-left="goBack"
      right-text="功能首页"
      @click-right="$router.push('/fun-module')"
    />
    <van-form ref="editForm" input-align="right" error-message-align="right">
      <div class="form-box">
        <div v-if="type === 'phone'">
          <van-field
            v-model="form.contacterName"
            name="日常联系人"
            label="日常联系人"
            placeholder="请选择"
            right-icon="arrow-down"
            @click="showLeaderPicker = true"
            :rules="[{ required: true, message: '请选择日常联系人' }]"
          />
          <base-user-select-popup
            :showPicker.sync="showLeaderPicker"
            @selectItem="selectLeader"
          ></base-user-select-popup>

          <van-field
            v-model="form.contacterMobile"
            name="联系电话"
            label="联系电话"
            placeholder="请输入"
            type="tel"
            style="padding-top: 5px"
            :rules="[{ pattern: /1\d{10}$/, message: '请填写正确的手机号', trigger: 'blur' }]"
          />
        </div>
        <div v-else>
          <div class="form-box-title">{{ tips }}</div>
          <div class="form-box-content">
            <van-field
              name="单价"
              :label="tips == '水表记录' ? '单价(元/吨)' : '单价(元/度)'"
              placeholder="请输入"
              v-model="form.price"
              type="number"
              :maxlength="maxLen"
              :rules="[{ required: true, message: '请输入单价' }]"
            />
            <van-field
              name="数值"
              :label="tips == '水表记录' ? '数值(吨)' : '数值(度)'"
              placeholder="请输入"
              v-model="form.priceNum"
              type="number"
              :maxlength="maxLen"
              :rules="[{ required: true, message: '请输入数值' }]"
            />
            <van-field name="pic" :label="'上传图片'" placeholder="请上传图片" readonly />
          </div>
          <div class="upload-box" v-if="files.length < 1">
            <van-button type="primary" size="small" @click="uploadFile">上传图片</van-button>
          </div>
          <div v-if="files.length" class="files-box">
            <li v-for="(item, index) in files" :key="item.ID">
              <img :src="fileUrl + item.ID" alt />
              <van-icon
                name="clear"
                color="#fe3e61"
                size="18px"
                @click="deleteFile(index)"
              ></van-icon>
            </li>
          </div>
        </div>
      </div>
      <div class="form-btns">
        <van-button type="default" @click="goBack">取消</van-button>
        <van-button type="primary" @click="doApply" v-if="'phone' === type">保存修改</van-button>
        <van-button type="primary" @click="doApply" v-else>提交</van-button>
      </div>
    </van-form>

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
import { eduResourceUserecordChangeContacter, eduResourceAmountPageQuery } from '@/assets/js/api';

export default {
  name: 'ResModify',
  props: {
    data: Object,
    type: String,
  },
  components: {
    BaseUserSelectPopup: () => import('@/components/BaseUserSelectPopup'),
    upload: () => import('@/components/BaseUpload'),
  },
  data() {
    return {
      tips: '水表记录',
      fileType: 'jpg|JPG|png|PNG|jpeg|JPEG|gif|GIF',
      title: '',
      tableDate: [],
      maxLen: 10,
      form: { contacterName: '', contacterMobile: '', price: '', priceNum: '' },
      showLeaderPicker: false,
      files: [],
      loading: false,
      priceType: 3,
      lastNum: 0,
    };
  },
  computed: {
    isEdit() {
      return this.type.indexOf('Edit') > -1;
    },
    fileUrl() {
      return this.$store.state.fileUrl;
    },
    uploadUrl() {
      return this.$store.state.uploadUrl;
    },
    userInfo() {
      return this.$store.state.userInfo;
    },
  },
  methods: {
    // 返回
    goBack() {
      this.$router.go(-1);
    },
    // 选择联系人
    selectLeader(item) {
      this.form.contacterName = item.name;
      this.showLeaderPicker = false;
    },
    ifSame(obj1, obj2) {
      let arr = Object.keys(obj1);
      return arr.every(a => obj1[a] === obj2[a]);
    },
    // 提交
    doApply() {
      this.$refs.editForm
        .validate()
        .then(async () => {
          this.$toast.loading({
            message: '提交中...',
            forbidClick: true,
            duration: 0,
          });
          const form2 = {};
          let fun;
          if ('phone' === this.type) {
            form2.id = this.form.id;
            form2.name = this.form.contacterName;
            form2.mobile = this.form.contacterMobile;
            if (this.ifSame(this.form, this.data.apply)) {
              this.$toast.clear();
              this.goBack();
              return;
            }
            fun = eduResourceUserecordChangeContacter(form2);
          } else {
            if (this.isEdit) {
              let row = { ...this.data };
              this.lastNum = (row && row.priceNum - row.amount / row.price) || 0;
              // form2.amount = this.form.priceNum * this.form.price;
              form2.amount = (this.form.priceNum - this.lastNum) * this.form.price;
            } else {
              let hasData = this.$route.query.hasData;
              if (hasData && hasData != '0') {
                let num = await new Promise(resolve => {
                  eduResourceAmountPageQuery({
                    page: 1,
                    limit: 1,
                    filter: { eduResourceId: this.data.eduResourceId, priceType: this.priceType },
                  }).then(res => {
                    if (res && res.success == true) {
                      let list = res.data;
                      resolve((list.length && list[0].priceNum) || 0);
                    }
                  });
                });
                form2.amount = (this.form.priceNum - num) * this.form.price;
              } else {
                form2.amount = 0;
              }
            }
            form2.price = this.form.price;
            form2.priceNum = this.form.priceNum;
            form2.priceType = this.priceType;
            form2.eduResourceId = this.data.eduResourceId;
            form2.photos = (this.files.length && this.files[0].ID) || '';
            form2.id = this.data.id || undefined;
            fun = this.util.postAjax({
              code: this.global.bmCode,
              url: '/eduResourceAmount/save',
              isRep: true,
              data: form2,
            });
          }
          fun
            .then(res => {
              this.$toast.clear();
              if (res && res.success === true) {
                this.$toast.success({ message: '成功' });
                this.goBack();
              } else {
                this.$toast.fail(res.message || '内部错误');
              }
            })
            .catch(err => {
              this.$toast.clear();
              this.$toast.fail(err || '内部错误');
            });
        })
        .catch(err => {
          console.log(err);
          this.$toast.fail('请填写正确信息');
        });
    },
    // according route params to set form
    setProp() {
      switch (this.type) {
        case 'phone':
          this.form.contacterName = this.data.apply.contacterName;
          this.form.id = this.data.id || '';
          this.form.contacterMobile = this.data.apply.contacterMobile;
          return '修改日常联系人';
        case 'waterfee':
          return '新增水表记录';
        case 'waterEdit':
          this.form.price = this.data.price;
          this.form.priceNum = this.data.priceNum;
          this.genPhotos(this.data.photos);
          return '编辑水表记录';
        case 'elefee':
          this.tips = '电表记录';
          this.priceType = 4;
          return '新增电表记录';
        case 'eleEdit':
          this.tips = '电表记录';
          this.priceType = 4;
          this.form.price = this.data.price;
          this.form.priceNum = this.data.priceNum;
          this.genPhotos(this.data.photos);
          return '编辑电表记录';
        default:
          return '';
      }
    },
    genPhotos(str) {
      let imgs = (str && str.split(',')) || [];
      this.files = imgs.map(i => ({ ID: i }));
    },
    // 点击上传
    uploadFile() {
      this.$refs.upload.$refs.uploaddom.click();
    },
    // 上传文件
    finish(res) {
      if (res && res.success) {
        let data = res.data || [];
        data.forEach(i => {
          i.FILEID = i.ID;
        });
        this.files = data.concat(this.files);
      }
    },
    // 选择文件
    choosefile() {
      this.loading = true;
    },
    // 删除图片
    deleteFile(index) {
      this.files.splice(index, 1);
    },
  },
  created() {
    this.title = this.setProp();
  },
};
</script>

<style lang="scss" scoped>
@import '../../../assets/css/mixin.scss';
.form-box {
  box-shadow: none !important;
}

.files-box {
  background-color: #fff;
  width: 100%;
  height: 180px;
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
    margin: 20px;
    img {
      width: 100%;
      vertical-align: middle;
      object-fit: contain;
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
</style>
