<template>
  <div class="main-wapper">
    <van-nav-bar
      class="nav-bar"
      title="预约申请"
      left-arrow
      fixed
      @click-left="$router.go(-1)"
      @click-right="jumpSearch"
    >
      <template #right>
        <van-icon name="search" size="18" />
      </template>
    </van-nav-bar>
    <!---------------------------- 资源详情---------------------------->
    <div class="title-box">
      <img v-if="imgUrls.length > 0" :src="imgUrls[0]" alt @click="showImage = true" />
      <img v-else src="@/assets/img/no-img.png" alt @click="showImage = true" />
      <van-image-preview v-model="showImage" :images="imgUrls"></van-image-preview>
      <h1 class="h1-title van-ellipsis">{{ resDetail.name }}</h1>
      <p class="group">
        <span class="group-title van-ellipsis">{{ resDetail.resgroupname }}</span>
        <span class="van-ellipsis">
          <van-icon name="location " />
          {{ resDetail.location }}
        </span>
      </p>
    </div>
    <div class="item">
      <h3 class="title">预约时间</h3>
      <div class="content-time">
        <!-- 已选中的预约时间段 -->
        <div class="time" v-for="(date, index) in opointData" :key="index">
          <span>{{ date.usedate }} {{ date.starttime }} ~ {{ date.endtime }}</span>
          <i class="el-icon-close" @click="removeAppointTime(date.starttime, date.usedate)"></i>
        </div>
      </div>
    </div>
    <!--多人预约 -->
    <div class="item" v-if="hasLimit">
      <h3 class="title">
        多人预约
        <span class="tips">{{ mulPeopleText }}</span>
      </h3>
      <div class="content-time">
        <el-button
          class="add_btn"
          type="primary"
          plain
          round
          size="small"
          icon="el-icon-plus"
          @click="addAppoint"
          :disabled="!hasLimit"
        >
          添加预约人
        </el-button>
        <div v-for="(p, index) in peoList" :key="index" class="div_flex">
          <span style="color: red; width: 10px" v-if="p.must">*</span>
          <span v-else style="width: 10px">&nbsp;&nbsp;</span>
          <span class="text_style">预约人：</span>
          <el-select
            v-model="p.userName"
            filterable
            remote
            placeholder="请输入工号或姓名"
            :remote-method="remoteMethodProject"
            @change="val => dataFilterProject(val, index)"
            :loading="searchLoading"
            style="width: 60%"
          >
            <!-- size="small" -->
            <el-option
              v-for="item in userList"
              :label="item.userName"
              :value="JSON.stringify(item)"
              :key="item.ID"
              style="height: 25px; font-size: 15px"
            ></el-option>
          </el-select>
          <!-- <img :src="searchImg" class="search_icon"  @click="focusIn" /> -->
          <img :src="delImg" alt="" @click="delAppoint(index)" v-if="!p.must" />
        </div>
      </div>
    </div>
    <!--各类型的表单 -->
    <div class="item" v-show="applyFields && applyFields.length">
      <h3 class="title">申请表单</h3>
      <div class="content-form">
        <el-form ref="applyForm" :model="applyForm" label-position="top">
          <template v-for="item in applyFields">
            <!-- input框:文本框、邮箱、联系方式  -->
            <el-form-item
              v-if="inputTypes.includes(item.fieldtype)"
              :key="item.id"
              :label="`${item.name}`"
              :prop="item.id"
              :rules="validateType(item)"
            >
              <el-input
                class="textarea"
                v-model="applyForm[item.id]"
                :placeholder="item.placeholder"
              />
            </el-form-item>
            <el-form-item
              v-if="item.fieldtype == 'upload'"
              :key="item.id"
              :label="`${item.name}`"
              :prop="item.id"
              :rules="validateType(item)"
            >
              <el-input v-model="applyForm[item.id]" v-show="false" />
              <div class="upload-box">
                <van-icon name="plus" @click="upload(item)" />
                <p class="upload-des">{{ item.placeholder }}</p>
              </div>
              <div class="uploadimgs">
                <div
                  class="attachimgs"
                  v-for="(uploadItem, index) in applyForm.files"
                  :key="index + uploadItem.id"
                >
                  <img :src="fileUrl + uploadItem.file.ID" alt @click="showimgs" />
                  <van-icon class="deletimg" name="clear" @click="deleteFiles(index)" />
                </div>
              </div>
            </el-form-item>
          </template>
        </el-form>
      </div>
      <!------------------------- 上传组件 ------------------------->
      <upload
        v-show="false"
        :multiple="false"
        :size="5120"
        exts="bmp|BMP|jpeg|JPEG|jpg|JPG|gif|GIF|png|PNG"
        @done="uploaded"
        @choose="imgLoading = true"
        :url="uploadUrl"
        ref="upload"
      ></upload>
    </div>
    <div class="btn-box">
      <van-button
        class="big-btn"
        type="info"
        size="small"
        :disabled="canAppoint"
        @click="submitApply"
        :loading="loading"
      >
        立即预约
      </van-button>
    </div>
  </div>
</template>

<script>
import Upload from '@/components/BaseUpload';
import { ImagePreview } from 'vant';
import { saveAppoint } from '@/api/client/appoint';
import { fetchUserList } from '@/api/admin/roles';
import delImg from '@/assets/img/del.png';
import searchImg from '@/assets/img/search.png';
export default {
  name: 'AppointmentApply',
  data() {
    return {
      searchImg,
      delImg,
      peoList: [],
      searchLoading: false,
      userList: [],
      opointData: [],
      applyFields: [],
      inputTypes: ['input', 'email', 'phone'],
      loading: false,
      applyForm: { files: [] },
      fileUrl: window.g.viewUrl,
      uploadUrl: window.g.uploadUrl,
      imgLoading: false,
      successData: [],
      showImage: false,
      uploadItem: {},
      photos: [],
      canAppoint: false,
    };
  },
  components: {
    Upload,
  },
  watch: {
    opointData() {
      this.canAppoint = !this.opointData.length;
    },
  },

  computed: {
    resDetail: function () {
      return this.$store.state.currentResDetail;
    },
    imgUrls() {
      let imgs = this.resDetail.icon;
      imgs = imgs ? imgs.split(',') : [];
      return imgs.map(i => window.g.viewUrl + i);
    },
    rulePerson() {
      return (this.resDetail && this.resDetail.rulePerson) || {};
    },
    hasLimit() {
      return this.rulePerson && Object.keys(this.rulePerson).length;
    },
    mulPeopleText() {
      return this.hasLimit ? `最少添加${this.rulePerson.minPerson}人` : '未启用';
    },
  },
  mounted() {
    this.opointData = this.$route.params.opointData;
    this.applyFields = this.resDetail.fields;
    if (this.hasLimit) {
      this.peoList = Array.from({ length: this.rulePerson.minPerson }, () => ({ must: true }));
    } else {
      this.peoList = [];
    }
    console.log(this.hasLimit, this.peoList);
  },
  methods: {
    jumpSearch() {
      this.$router.push({
        name: 'res-search',
      });
    },
    //放大查看图片
    showimgs() {
      let attaches = this.applyForm.files.map(upload => {
        return upload.file.ID;
      });
      let imgs = _.map(attaches, fileID => {
        return this.fileUrl + fileID;
      });
      ImagePreview(imgs);
    },
    // 上传
    upload(item) {
      this.uploadItem = item;
      this.$refs.upload.toupload();
    },
    // 上传完成
    uploaded(res) {
      this.imgLoading = false;
      if (res.success) {
        this.applyForm.files.unshift({
          id: this.uploadItem.id,
          file: res.data[0],
        });
        this.$set(this.applyForm, this.uploadItem.id, this.uploadItem.id);
      } else {
        this.$toast.fail(`上传失败！`);
      }
    },
    // 删除上传文件 清空隐藏的绑定文件值
    deleteFiles(index) {
      this.applyForm.files.splice(index, 1);
      let hasFile = this.applyForm.files.some(id => id == this.uploadItem.id);
      if (!hasFile) {
        this.applyForm[this.uploadItem.id] = '';
      }
    },
    // 去掉已选中的预约日期
    removeAppointTime(startTime, day) {
      let findIndex = this.opointData.findIndex(i => i.usedate == day && i.starttime == startTime);
      if (findIndex > -1) {
        this.opointData.splice(findIndex, 1);
      }
    },
    // 关闭弹窗
    cancelDialog() {
      this.$emit('update:dialogVisible', false);
      this.$refs['applyForm'].resetFields();
      this.applyForm = { files: [] };
    },
    //验证输入框
    validateType(item) {
      let isRequired = item.isneed == '1' ? true : false;
      let rulesArr = [
        {
          required: isRequired,
          message: `${item.name}不能为空`,
          trigger: ['blur', 'change'],
        },
      ];
      if (item.fieldtype == 'email') {
        rulesArr.push({
          type: 'email',
          message: '请输入正确的邮箱地址',
          trigger: ['blur', 'change'],
        });
      }
      if (item.fieldtype == 'phone') {
        rulesArr.push({
          pattern: /^1[0-9]{10}$/,
          message: '请输入正确的联系电话',
        });
      }
      return rulesArr;
    },
    checkPeople() {
      if(this.hasLimit) {
        const tmp = this.peoList.filter(p => p.ID && p.NAME) || [];
        return tmp.length >= this.rulePerson.minPerson
      }
      return true
    },
    // 提交预约申请表单
    submitApply() {
      if (!this.opointData.length) {
        return false;
      }
      if (!this.checkPeople()) {
        this.$toast.fail('多人预约人数不足');
        return false;
      }

      this.$refs.applyForm.validate(valid => {
        if (valid) {
          let allFields = this.applyFields,
            fieldsArr = [],
            appointTimeArr = [];
          allFields.forEach(item => {
            let value = this.applyForm[item.id];
            //提交附件时
            if (item.fieldtype == 'upload') {
              let filesArr = [];
              this.applyForm.files.map(upload => {
                if (upload.id == item.id) {
                  filesArr.push(upload.file.ID);
                }
              });
              value = filesArr.join(',');
            }
            fieldsArr.push({
              name: item.name,
              val: value,
              type: item.fieldtype,
            });
          });
          let strFieldsArr = JSON.stringify(fieldsArr);
          this.opointData.forEach(item => {
            appointTimeArr.push({
              endtime: item.endtime.replace(/:/g, ''),
              starttime: item.starttime.replace(/:/g, ''),
              usedate: item.usedate.replace(/-/g, ''),
            });
          });
          const persons = [];
          const userInfo = this.$store.state.userInfo;
          const tmp = this.peoList.filter(p => p.ID && p.NAME) || [];
          tmp.forEach(p => {
            if (p.ID !== userInfo.ID) {
              persons.push({
                userId: p.ID,
                userName: p.NAME,
                isApplyer: 0
              })
            }
          })
          persons.push({
            userId: userInfo.ID,
            userName: userInfo.NAME,
            isApplyer: 1
          })
      
          // this.loading = true;
          let data = {
            resid: this.resDetail.id,
            times: appointTimeArr,
            applyfields: strFieldsArr,
          };
          // not only applier
          if(persons.length > 1) {
            data.persons = persons
          }
          saveAppoint(data)
            .then(res => {
			  console.log(res);
              this.loading = false;
              if (res.success && !res.data.fail.length) {
                this.$toast.success('提交成功！');
                this.successData = res.data.successful;
                this.$router.push({
                  name: 'appoint-success',
                  params: {
                    successData: this.successData,
                    curResDetail: this.resDetail,
                  },
                });
              } else if(res.success){
                //预约失败时消息提示语
                let failArr = res.data.fail;
                let failInfo = [];
                failArr.forEach(item => {
                  let day = this.moment(item.usedate).format('YYYY-MM-DD');
                  let starttime = this.moment(item.starttime, 'hhmm').format('HH:mm');
                  let endtime = this.moment(item.endtime, 'hhmm').format('HH:mm');
                  failInfo.push(`${day} ${starttime}~${endtime}`);
                });

                this.$toast.fail('提交失败：' + failInfo.join() + res.data.fail[0].errorMsg);
              }else{
				   this.$toast.fail('提交失败：' + res.data.message);
			  }
            })
            .catch(err => {
              this.loading = false;
              this.$toast.fail('提交失败：' + err);
            });
        }
      });
    },
    // 搜索人员
    remoteMethodProject(query) {
      this.searchLoading = true;
      this.userList = [];
      if (query) {
        let data = {
          filter: JSON.stringify({
            KEYWORD: query,
          }),
          page: 1,
          limit: 300,
        };
        fetchUserList(data)
          .then(res => {
            this.searchLoading = false;
            if (res.success) {
              this.userList = res.items || [];
              this.userList.forEach(u => {
                u.userName = u.NAME + '(' + u.ID + ')';
              });
            }
          })
          .catch(err => {
            console.log(err);
            this.searchLoading = false;
            this.userList = [];
          });
      } else {
        this.searchLoading = false;
      }
    },
    dataFilterProject(value, index) {
      let val = JSON.parse(value);
      // console.log(val, index);
      for (let key in val) {
        this.peoList[index][key] = val[key];
      }
    },
    addAppoint() {
      this.$toast.loading({
        message: '',
        forbidClick: true,
        overlay: true,
        duration: 0,
      });
      this.peoList.push({ must: false });
      this.$nextTick(() => {
        this.$toast.clear();
      });
    },
    delAppoint(index) {
      this.$toast.loading({
        message: '',
        forbidClick: true,
        overlay: true,
        duration: 0,
      });
      this.peoList.splice(index, 1);
      this.$nextTick(() => {
        this.$toast.clear();
      });
    },
    focusIn() {},
  },
};
</script>
<style>
.el-input__inner {
  font-size: 28px !important;
}
</style>

<style lang="scss" scoped>
.main-wapper {
  margin: 0 auto;
  padding-top: 88px;
  background: #f6f6f6;
  height: 100%;
}
.title-box {
  color: #474d51;
  padding: 32px;
  height: 164px;
  background: #ffffff;
  img {
    float: left;
    margin-right: 24px;
    width: 134px;
    height: 100px;
  }
  .h1-title {
    height: 48px;
    font-size: 34px;
    font-weight: blod;
    line-height: 48px;
    margin-bottom: 10px;
  }
  i.el-icon-location {
    color: #cccccc;
  }
  .group {
    display: flex;
  }
  .group-title {
    display: inline-block;
    color: #ffffff;
    background: #f56323;
    border-radius: 2px;
    height: 42px;
    line-height: 42px;
    padding: 3px 16px;
    width: 180px;
    margin-right: 30px;
  }
  .van-icon {
    font-size: 20px;
    color: #cccccc;
    vertical-align: bottom;
  }
}

.item {
  margin-bottom: 30px;
  background: #ffffff;
  .title {
    height: 33px;
    font-size: 28px;
    font-weight: blod;
    color: #51575c;
    line-height: 33px;
    position: relative;
    padding: 32px 0 64px 68px;
    &::before {
      display: inline-block;
      content: '';
      width: 12px;
      height: 12px;
      border: 6px solid #3f86f7;
      border-radius: 12px;
      position: absolute;
      left: 32px;
      top: 36px;
    }
  }
}
.content-form {
  padding: 24px 32px;
}
.content-time {
  padding: 10px 32px;

  .time {
    height: 80px;
    background: #f4f8ff;
    border-radius: 5px;
    padding: 2px 24px;
    font-size: 28px;
    color: #3f86f7;
    background: #f4f8ff;
    border: none;
    margin-bottom: 10px;
    line-height: 80px;
    i {
      margin-right: 24px;
      line-height: 80px;
      float: right;
      color: #999999;
      cursor: pointer;
    }
  }
}
.content-form /deep/ .el-form--label-top .el-form-item__label {
  padding-left: 18px;
}
.file-title {
  color: #000;
  opacity: 0.65;
  padding: 0px 5px;
}
.big-btn {
  height: 88px;
  background: #3f86f7;
  margin: 32px 0;
  width: 100%;
}
.btn-box {
  padding: 0 32px;
}
.upload-box {
  margin-top: 32px;
  margin-left: 16px;
  .van-icon-plus::before {
    color: #cccccc;
    font-size: 32px;
    padding: 15px;
    border: 1px solid #cccccc;
  }
  .upload-des {
    color: rgba(0, 0, 0, 0.25);
    font-size: 24px;
    margin-top: 16px;
    margin-left: 16px;
  }
}

.content-form /deep/ .el-form-item__error {
  font-size: 24px;
}

.uploadimgs {
  margin-top: 23px;
  margin-left: 16px;
  .attachimgs {
    width: 80px;
    height: 80px;
    display: inline-block;
    margin-right: 16px;
    position: relative;
    background-color: rgba(246, 246, 246, 1);
    .deletimg {
      position: absolute;
      top: -7px;
      right: -8px;
      // background-color: red;
      width: 16px;
      height: 16px;
      text-align: center;
      color: red;
    }
    img {
      width: 100%;
      height: 100%;
    }
  }
}
.tips {
  margin-left: 10px;
  height: 28px;
  font-size: 24px;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
  color: #7d7d80;
  line-height: 28px;
}
.div_flex {
  display: flex;
  align-items: center;
  margin: 10px 0;
  img {
    width: 35px;
    height: 35px;
    margin-left: 10px;
    cursor: pointer;
  }
  .text_style {
    height: 33px;
    font-size: 28px;
    font-family: PingFangSC-Semibold, PingFang SC;
    font-weight: 600;
    color: #474d51;
    line-height: 33px;
  }
  .search_icon {
    margin-left: -20px;
    z-index: 99;
  }
}
.add_btn {
  font-size: 24px;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
  color: #3f86f7;
  line-height: 28px;
}
</style>
