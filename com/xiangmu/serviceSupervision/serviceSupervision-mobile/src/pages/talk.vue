<template>
  <div>
    <van-nav-bar title="我要说" left-arrow fixed @click-left="goback" />
    <div style="width:100%;height:46px;"></div>
    <div class="basic-box clearfix" style="margin-bottom:0;">
      <!----------------------------- 类型 ----------------------------->
      <div
        class="type-item"
        v-for="item in serviceTypes"
        :key="item.type"
        @click="changeType(item)"
        :class="{'active': item.type === editForm.type}"
      >
        <div>
          <i :class="item.icon" />
          <p>{{item.name}}</p>
        </div>
      </div>
    </div>
    <van-form ref="editForm" label-width="70" colon :show-error-message="false">
      <!----------------------------- 联系方式 ----------------------------->
      <van-field
        v-model="editForm.applyermobile"
        name="联系方式"
        label="联系方式"
        placeholder="请输入手机号"
        type="tel"
        style="padding-top: 5px"
        :rules="[{ pattern:/^1\d{10}$/,  message: '请填写正确的手机号' }]"
      />
      <!----------------------------- 业务领域 ----------------------------->
      <van-field
        readonly
        clickable
        name="picker"
        :value="editForm.handledeptname"
        label="业务领域"
        placeholder="请选择"
        right-icon="arrow"
        @click="showPicker = true"
        :rules="[{ required: true, message: '请选择业务领域！' }]"
      />
      <van-popup v-model="showPicker" position="bottom">
        <van-picker
          show-toolbar
          :columns="deptList"
          @confirm="chooseDept"
          @cancel="showPicker = false"
        />
      </van-popup>
      <!----------------------------- 标题 ----------------------------->
      <van-field
        v-model="editForm.title"
        name="标题"
        label="标题"
        placeholder="请输入标题"
        :rules="[{ required: true, message: '请输入标题！' }]"
      />
      <!----------------------------- 内容 ----------------------------->
      <van-field
        v-model="editForm.content"
        name="内容"
        label="内容"
        type="textarea"
        rows="4"
        maxlength="200"
        placeholder="请输入内容，不超过200字"
        :rules="[{ required: true, message: '请输入内容！' }]"
      />

      <!----------------------------- 上传图片 ----------------------------->
      <van-field>
        <template #input>
          <div class="upload" v-if="imgLoading">
            <van-loading type="spinner" size="20" />
          </div>
          <div class="upload-imgs" v-for="(item,index) in editForm.photos" :key="item">
            <img :src="fileUrl + item" alt />
            <van-icon name="cross" @click="deletePhoto(index)"></van-icon>
          </div>
          <div class="upload" @click="upload" v-if="!imgLoading && editForm.photos.length < 3">
            <van-icon name="plus"></van-icon>
            <p>上传图片</p>
          </div>
        </template>
      </van-field>
    </van-form>

    <div style="margin: 24px;">
      <van-button size="large" type="info" icon="checked" :loading="loading" @click="doTalk">提交</van-button>
    </div>

    <!----------------------------- 上传组件 ----------------------------->
    <upload
      v-show="false"
      :multiple="false"
      :size="5120"
      exts="bmp|BMP|jpeg|JPEG|jpg|JPG|gif|GIF|png|PNG"
      @choose="imgLoading = true"
      @done="uploaded"
      :url="$store.state.uploadUrl"
      ref="upload"
    ></upload>
  </div>
</template>

<script>
import upload from "../components/BaseUpload";
export default {
  components: {
    upload
  },
  data() {
    return {
      editForm: {
        applyermobile: "",
        type: "",
        handledeptid: "",
        handledeptname: "",
        title: "",
        content: "",
        photos: []
      },
      value: "",
      showPicker: false,
      imgLoading: false,
      loading: false
    };
  },
  computed: {
    // 角色ids
    userRoleIds() {
      return this.$store.state.userRoles.map(i => i.ID);
    },
    // 图片地址
    fileUrl() {
      return this.$store.state.fileUrl;
    },
    // 服务类型
    serviceTypes() {
      return this.$store.state.serviceTypes;
    },
    // 业务领域列表
    deptList() {
      let depts = this.$store.state.departments.filter(i => i.ISLOCK=='0');
      let arr = depts.map(i => {
        return {
          text: i.NAME,
          value: i.ID
        };
      });
      return arr;
    }
  },
  methods: {
    goback() {
      this.$router.go(-1);
    },
    // 切换类型
    changeType(item) {
      this.editForm.type = item.type;
    },
    // 选择业务领域
    chooseDept(item) {
      this.editForm.handledeptid = item.value;
      this.editForm.handledeptname = item.text;
      this.showPicker = false;
    },
    // 上传图片
    upload() {
      this.$refs["upload"].toupload();
    },
    // 上传完成
    uploaded(res) {
      this.imgLoading = false;
      if (res.success && this.editForm.photos.length < 3) {
        this.editForm.photos.unshift(res.data[0].ID);
      } else {
        this.$toast.fail("上传失败！");
      }
    },
    // 删除图片
    deletePhoto(index) {
      this.editForm.photos.splice(index, 1);
    },
    // 提交
    doTalk() {
      this.$refs.editForm
        .validate()
        .then(() => {
          this.loading = true;
          let data = _.cloneDeep(this.editForm);
          data.photos = data.photos.join(",");
          this.util
            .postAjax({
              code: this.global.code,
              url: "/apply/save",
              isRep: true,
              data: {
                ...data,
                applyertype: this.userRoleIds.includes("9100003-4") ? "1" : "0" // 是否学生督察员
              }
            })
            .then(res => {
              this.loading = false;
              if (res.success) {
                this.$toast.success("提交成功！");
                this.goback();
              } else {
                this.$toast.fail("提交失败！" + res.message);
              }
            })
            .catch(err => {
              this.loading = false;
              this.$toast.fail("提交失败！" + err);
            });
        })
        .catch(() => {
          return;
        });
    }
  },
  mounted() {
    let talkType = sessionStorage.getItem("talkType") || 1;
    this.editForm.type = parseInt(talkType);
  }
};
</script>

<style lang="scss" scoped>
.basic-box {
  padding: 18px 5px;
}

.type-item {
  float: left;
  width: 20%;
  text-align: center;
  div {
    width: 56px;
    background: #eeeeee;
    border-radius: 5px;
    margin: 0 auto;
    padding: 10px 0 8px;
  }
  i {
    font-size: 22px;
    color: #999999;
  }
  p {
    font-size: 14px;
    color: #999999;
    margin-top: 8px;
    line-height: 20px;
  }
  &.active {
    div {
      background: #3a78fc;
      box-shadow: 0px 4px 10px 0px rgba(58, 120, 252, 0.3);
    }
    i,
    p {
      color: #ffffff;
    }
  }
}
.van-cell {
  padding: 16px;
}
.upload,
.upload-imgs {
  display: inline-block;
  width: 80px;
  height: 80px;
  background: #f6f6f6;
  text-align: center;
  padding: 16px 0 0;
  margin-right: 8px;
  i,
  p {
    color: #999999;
  }
  i {
    font-size: 20px;
  }
  p {
    font-size: 12px;
  }
}
.upload-imgs {
  position: relative;
  padding: 0;
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  .van-icon {
    position: absolute;
    top: 0;
    right: 0;
    background: rgba(0, 0, 0, 0.2);
    color: #ffffff;
    font-size: 10px;
    padding: 2px;
  }
}
</style>