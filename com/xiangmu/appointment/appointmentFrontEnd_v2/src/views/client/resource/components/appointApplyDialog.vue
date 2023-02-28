<template>
  <div>
    <el-dialog
      class="base-dialog"
      title="预约申请"
      :visible.sync="dialogVisible"
      :modal="false"
      :close-on-click-modal="false"
      width="600px"
      center
      :before-close="cancelDialog"
    >
      <slot></slot>
      <div class="item">
        <h3 class="title">预约时间</h3>
        <div class="content-time">
          <!-- 已选中的预约时间段 -->
          <span class="time" v-for="(date, index) in opointData" :key="index">
            {{ date.usedate }} {{ date.starttime }} ~ {{ date.endtime }}
            <i class="el-icon-close" @click="removeAppointTime(date.starttime, date.usedate)"></i>
          </span>
        </div>
      </div>
      <div class="item" v-if="hasLimit">
        <h3 class="title">
          多人预约
          <span class="tips">{{ mulPeopleText }}</span>
        </h3>
        <div class="content-time">
          <el-button
            class="orange-btn"
            type="primary"
            plain
            size="small"
            icon="el-icon-plus"
            @click="addAppoint"
            :disabled="!hasLimit"
          >
            添加预约人
          </el-button>
          <div v-for="(p, index) in peoList" :key="index" class="div_flex">
            <span style="color: red; width: 20px" v-if="p.must">*</span>
            <span v-else style="width: 20px">&nbsp;&nbsp;</span>
            <span>预约人：</span>
            <el-select
              v-model="p.userName"
              filterable
              remote
              placeholder="请输入工号或姓名"
              :remote-method="remoteMethodProject"
              @change="val => dataFilterProject(val, index)"
              :loading="searchLoading"
              style="width: 50%"
              size="small"
            >
              <el-option
                v-for="item in userList"
                :label="item.userName"
                :value="JSON.stringify(item)"
                :key="item.ID"
              ></el-option>
            </el-select>
            <img :src="delImg" alt="" @click="delAppoint(index)" v-if="!p.must" />
          </div>
        </div>
      </div>
      <!--各类型的表单 -->
      <div class="item" v-show="applyFields && applyFields.length">
        <h3 class="title">申请表单</h3>
        <div class="content-form">
          <el-form ref="applyForm" :model="applyForm">
            <template v-for="item in applyFields">
              <!-- input框:文本框、邮箱、联系方式  -->
              <el-form-item
                v-if="inputTypes.includes(item.fieldtype)"
                :key="item.id"
                :label="`${item.name}`"
                label-width="120px"
                :prop="item.id"
                :rules="validateType(item)"
              >
                <el-input v-model="applyForm[item.id]" :placeholder="item.placeholder" />
              </el-form-item>
              <!--多个附件判断 -->
              <el-form-item
                v-if="item.fieldtype == 'upload'"
                :key="item.id"
                :label="`${item.name}`"
                label-width="120px"
                :prop="item.id"
                :rules="validateType(item)"
              >
                <el-input v-model="applyForm[item.id]" v-show="false" />
                <div class="upload-box">
                  <el-button
                    icon="el-icon-upload2"
                    size="small"
                    @click="upload(item)"
                    :loading="imgLoading && uploadItem.id == item.id"
                  >
                    上传文件
                  </el-button>
                  <p class="upload-des">{{ item.placeholder }}</p>
                </div>
                <div
                  class="upload-imgs"
                  v-for="(uploadItem, index) in applyForm.files"
                  :key="index + uploadItem.id"
                >
                  <span v-show="uploadItem.id == item.id">
                    <i class="el-icon-paperclip"></i>
                    <span class="file-title">{{ uploadItem.file.TITLE }}</span>
                    <i class="el-icon-close" @click="deleteFiles(index)"></i>
                  </span>
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

      <span slot="footer">
        <el-button type="primary" size="small" @click="submitApply" :loading="loading">
          提交
        </el-button>
      </span>
    </el-dialog>
    <appoint-ok-dialog
      v-if="successVisible"
      :okVisible="successVisible"
      class="fixed-dialog"
      :resDetail="resDetail"
      :successData.sync="successData"
      @doFunc="closeOkDialog"
    ></appoint-ok-dialog>
  </div>
</template>

<script>
import appointOkDialog from './appointOkDialog';
import Upload from '@/components/BaseUpload';
import { saveAppoint } from '@/api/client/appoint';
import { fetchUserList } from '@/api/admin/roles';
import delImg from '@/assets/img/del.png';
export default {
  props: ['resDetail', 'opointData', 'applyFields', 'dialogVisible'],
  data() {
    return {
      delImg,
      peoList: [],
      inputTypes: ['input', 'email', 'phone'],
      openTimes: [],
      loading: false,
      searchLoading: false,
      userList: [],
      applyForm: { files: [] },
      fileUrl: window.g.viewUrl,
      uploadUrl: window.g.uploadUrl,
      imgLoading: false,
      successData: [],
      successVisible: false,
      uploadItem: {},
    };
  },
  components: {
    Upload,
    appointOkDialog,
  },
  computed: {
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
  // watch: {
  //   resDetail: function(n, o) {},
  // },
  mounted() {
    if (this.hasLimit) {
      this.peoList = Array.from({ length: this.rulePerson.minPerson }, () => ({ must: true }));
    } else {
      this.peoList = [];
    }
    console.log(this.hasLimit, this.peoList);
  },
  methods: {
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
      this.searchLoading = true;
      this.peoList.push({ must: false });
      this.$nextTick(() => {
        this.searchLoading = false;
      })
    },
    delAppoint(index) {
      this.peoList.splice(index, 1);
    },
    // 上传
    upload(item) {
      this.uploadItem = item;
      this.$refs.upload.toupload();
    },
    // 上传完成 手动赋值到隐藏的绑定表单中
    uploaded(res) {
      this.imgLoading = false;
      if (res.success) {
        this.applyForm.files.unshift({
          id: this.uploadItem.id,
          file: res.data[0],
        });
        this.$set(this.applyForm, this.uploadItem.id, this.uploadItem.id);
      } else {
        this.$message({
          showClose: true,
          message: '上传失败！',
          type: 'error',
        });
      }
    },
    // 删除上传文件 清空隐藏的绑定文件值
    deleteFiles(index) {
      this.applyForm.files.splice(index, 1);
      let hasFile = this.applyForm.files.some(id => id == this.uploadItem.id);
      console.log('hasFile', hasFile);
      if (!hasFile) {
        this.applyForm[this.uploadItem.id] = '';
      }
    },
    // 去掉已选中的预约日期
    removeAppointTime(startTime, day) {
      this.$emit('doRemoveTime', startTime, day);
    },
    //关闭成功弹框
    closeOkDialog() {
      this.$emit('update:dialogVisible', false);
      this.successVisible = false;
      this.doRefresh();
    },
    doRefresh() {
      this.$emit('doRefresh');
    },

    // 关闭弹窗
    cancelDialog() {
      this.peoList = []
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
        this.$message({
          showClose: true,
          message: '请先选择预约时间！',
          type: 'warning',
        });
        return false;
      }
      if (!this.checkPeople()) {
        this.$message({
          showClose: true,
          message: '多人预约人数不足',
          type: 'warning',
        });
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
              this.loading = false;
              if (res.success && !res.data.fail.length) {
                this.$message({
                  showClose: true,
                  type: 'success',
                  message: '提交成功！',
                });
                this.successVisible = true;
                this.successData = res.data.successful;
                this.peoList = []
                // this.$emit('update:dialogVisible', false);
              } else if(res.success) {
                //预约失败时消息提示语
                let failArr = res.data.fail || [];
                let failInfo = [];
                failArr.forEach(item => {
                  let day = this.moment(item.usedate).format('YYYY-MM-DD');
                  let starttime = this.moment(item.starttime, 'hhmm').format('HH:mm');
                  let endtime = this.moment(item.endtime, 'hhmm').format('HH:mm');
                  failInfo.push(`${day} ${starttime}~${endtime}`);
                });

                this.$message({
                  showClose: true,
                  type: 'error',
                  message: '提交失败：' + failInfo.join() + res.data.fail[0].errorMsg,
                });
              }else{
				  message: '提交失败：' +  res.message
			  }
            })
            .catch(err => {
              this.loading = false;
              this.$message({
                showClose: true,
                type: 'error',
                message: '提交失败：' + err,
              });
            });
        }
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.base-dialog /deep/ .el-dialog__footer {
  text-align: right !important;
}

.item {
  margin-bottom: 30px;
  .title {
    font-size: 16px;
    color: #474d51;
    line-height: 22px;
    position: relative;
    padding: 0 0 10px 46px;
    &::before {
      display: inline-block;
      content: '';
      width: 8px;
      height: 8px;
      border: 4px solid #3f86f7;
      border-radius: 8px;
      position: absolute;
      left: 20px;
      top: 3px;
    }
  }
}
.content-form {
  padding: 10px 20px 10px 0px;
}
.content-time {
  padding: 10px 25px;
  .time {
    display: inline-block;
    padding: 2px 8px;
    font-size: 14px;
    color: #3f86f7;
    background: #f4f8ff;
    border: none;
    border-radius: 5px;
    margin-right: 20px;
    margin-bottom: 10px;
    line-height: 36px;
    height: 36px;
    i {
      margin-left: 10px;
      font-size: 8px;
      color: #999999;
      cursor: pointer;
    }
  }
}
.upload-des {
  color: rgba(0, 0, 0, 0.25);
  font-size: 14px;
}
.file-title {
  color: #000;
  opacity: 0.65;
  padding: 0px 5px;
}

.star .el-form-item__label:before {
  content: '*';
  color: #f56c6c;
  margin-right: 4px;
}
.div_flex {
  display: flex;
  align-items: center;
  margin: 10px 0;
  img {
    width: 20px;
    height: 20px;
    margin-left: 10px;
    cursor: pointer;
  }
}
.tips {
  margin-left: 10px;
  height: 17px;
  font-size: 12px;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
  color: rgba(0, 0, 0, 0.35);
  line-height: 17px;
}
/deep/ .el-select__caret.el-input__icon {
  &::after {
    content: '\e778';
    transform: rotateX(180deg) rotateY(180deg);
    margin-right: -10px;
  }
}
</style>
