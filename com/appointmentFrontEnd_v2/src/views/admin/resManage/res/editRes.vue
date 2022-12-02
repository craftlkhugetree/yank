<template>
  <div class="base-search-table bg-white" v-loading="loading">
    <div class="search-box clearfix">
      <span class="go-back" @click="$router.go(-1)">
        <i class="el-icon-arrow-left">返回</i>
        <el-divider direction="vertical"></el-divider>
      </span>
      <h3>编辑资源</h3>
      <div class="search-box-right">
        <el-button type="primary" size="small" @click="saveRes">保存</el-button>
      </div>
    </div>
    <div class="res-content">
      <el-row>
        <!------------------------- 左侧资源信息 ------------------------->
        <el-col :span="11">
          <div class="edit-box">
            <el-form
              ref="editForm"
              :model="editForm"
              :rules="rules"
              label-position="right"
              label-width="90px"
            >
              <el-form-item label="模板:" prop="templateid">
                <el-select
                  v-model="editForm.templateid"
                  size="small"
                  placeholder="请选择"
                  filterable
                  clearable
                  popper-class="noarrow"
                  disabled
                >
                  <el-option
                    v-for="item in tplList"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id"
                  >
                    <span style="float: left; color: rgba(0,0,0,0.65)">{{ item.name }}</span>
                    <i
                      v-if="editForm.templateid === item.id"
                      style="float:right;margin-top:8px;"
                      class="el-icon-check"
                    ></i>
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="资源集:" prop="resgroupid" style="position:relative;">
                <res-group-select :resGroupId.sync="editForm.resgroupid"></res-group-select>
              </el-form-item>
              <el-form-item label="资源名称:" prop="name">
                <el-input v-model="editForm.name" size="small" style="width:400px;max-width:90%;"></el-input>
              </el-form-item>
              <el-form-item label="资源位置:" prop="location">
                <el-input
                  v-model="editForm.location"
                  size="small"
                  style="width: 400px;max-width:90%;"
                ></el-input>
              </el-form-item>
              <el-form-item label="资源描述:" prop="note">
                <el-input
                  type="textarea"
                  v-model="editForm.note"
                  size="small"
                  :rows="6"
                  :maxlength="200"
                  show-word-limit
                  resize="none"
                  style="width:400px;max-width:90%;"
                ></el-input>
              </el-form-item>
              <el-form-item label="资源图片" prop="photos" style="margin-left:10px;">
                <div class="upload-box">
                  <el-button
                    icon="el-icon-upload2"
                    size="small"
                    @click="upload"
                    :loading="imgLoading"
                  >上传图片</el-button>
                  <p class="img-des">支持.bmp .jpg .jpeg .png .gif</p>
                </div>
                <div class="upload-imgs" v-for="(item,index) in editForm.photos" :key="item">
                  <img :src="fileUrl + item" alt />
                  <i class="el-icon-close" @click="deletePhoto(index)"></i>
                </div>
              </el-form-item>
            </el-form>
          </div>
        </el-col>
        <!------------------------- 右侧tabs ------------------------->
        <el-col :span="13" class="tab-box">
          <el-tabs v-model="activeTab">
            <el-tab-pane label="申请表单" name="fields">
              <fields ref="fields" :resDetail="resDetail"></fields>
            </el-tab-pane>
            <el-tab-pane label="预约规则" name="appointRules">
              <appoint-rules ref="appointRules" :resDetail="resDetail"></appoint-rules>
            </el-tab-pane>
            <el-tab-pane label="签到规则" name="checkRules">
              <check-rules ref="checkRules" :resDetail="resDetail"></check-rules>
            </el-tab-pane>
            <el-tab-pane label="审核规则" name="auditRules">
              <approve-rules ref="approveRules" :resDetail="resDetail"></approve-rules>
            </el-tab-pane>
          </el-tabs>
        </el-col>
      </el-row>
    </div>
    <!------------------------- 上传组件 ------------------------->
    <upload
      v-show="false"
      :multiple="false"
      :size="5120"
      exts="bmp|BMP|jpeg|JPEG|jpg|JPG|gif|GIF|png|PNG"
      @done="uploaded"
      @choose="imgLoading=true"
      :url="uploadUrl"
      ref="upload"
    ></upload>
  </div>
</template>

<script>
import { fetchTempList, saveRes, getResDetail } from "@/api/admin/res";
import ResGroupSelect from "../components/ResGroupSelect";
import Upload from "@/components/BaseUpload";
import Fields from "./editTabs/fields";
import AppointRules from "./editTabs/appointRules";
import CheckRules from "./editTabs/checkRules";
import ApproveRules from "./editTabs/approveRules";
export default {
  components: {
    ResGroupSelect,
    Upload,
    Fields,
    AppointRules,
    CheckRules,
    ApproveRules
  },
  props: {
    resId: String,
    isCopy: String
  },
  data() {
    return {
      resDetail: {},
      loading: false,
      editForm: {
        id: "",
        name: "",
        resgroupid: "",
        templateid: "",
        location: "",
        note: "",
        photos: [],
        icon: ""
      },
      rules: {
        name: [
          { required: true, message: "请输入资源名称！", trigger: "change" }
        ],
        resgroupid: [
          { required: true, message: "请选择资源集！", trigger: "change" }
        ],
        templateid: [
          { required: true, message: "请选择模板！", trigger: "change" }
        ]
      },
      tplList: [],
      imgLoading: false,
      fileUrl: window.g.viewUrl,
      uploadUrl: window.g.uploadUrl,
      activeTab: "fields"
    };
  },
  methods: {
    // 上传
    upload() {
      this.$refs.upload.toupload();
    },
    // 上传完成
    uploaded(res) {
      this.imgLoading = false;
      if (res.success) {
        this.editForm.photos.unshift(res.data[0].ID);
      } else {
        this.$message({
          showClose: true,
          message: "上传失败！",
          type: "error"
        });
      }
    },
    // 删除图片
    deletePhoto(index) {
      this.editForm.photos.splice(index, 1);
    },
    // 获取模板列表
    getTplList() {
      fetchTempList()
        .then(res => {
          if (res.success) {
            this.tplList = res.data || [];
          }
        })
        // eslint-disable-next-line no-unused-vars
        .catch(err => {});
    },

    // 获取预约时间
    getYyTime() {
      let yyTime = this.$refs.appointRules.$refs.yyTime;
      let obj = {};
      let type = yyTime.timetype;
      if (type !== "none") {
        obj.startday = yyTime[`start${type}day`];
        obj.endday = yyTime[`end${type}day`];
        let st = yyTime[`start${type}time`];
        obj.starttime = st ? st.replace(":", "") : "0000";
        let et = yyTime[`end${type}time`];
        obj.endtime = et ? et.replace(":", "") : "2345";
      }
      obj.timetype = type;
      return obj;
    },

    // 获取签到规则
    getCheckRule() {
      let checkRules = this.$refs.checkRules;
      let obj = {
        checktype: checkRules.isCheckIn
          ? JSON.stringify(checkRules.checkType)
          : null,
        checkin: checkRules.isCheckIn
          ? JSON.stringify(checkRules.checkIn)
          : null,
        checkout: checkRules.isCheckOut
          ? JSON.stringify(checkRules.checkOut)
          : null,
        checktimeout: checkRules.isCheckIn ? checkRules.checkTimeOut : null
      };
      return obj;
    },

    // 获取审核规则
    getApproves() {
      let list = this.$refs.approveRules.list;
      return list.length > 0
        ? list.map(i => {
            return {
              name: i.name,
              order: i.order,
              timeout: i.timeout,
              userids: i.users.map(j => j.ID).join(","),
              usernames: i.users.map(j => j.NAME).join(",")
            };
          })
        : [];
    },

    // 保存资源
    saveRes() {
      this.$refs.editForm.validate(valid => {
        if (valid) {
          let errMsg = "";
          // 校验申请表单
          let fields = this.$refs.fields.list;
          if (fields.some(i => !i.name)) {
            errMsg += "申请表单中存在字段值为空的字段！" + "\n";
          }
          // 校验审核规则
          let approvesList = this.$refs.approveRules.list;
          let hasError = approvesList.some(i => !i.name || i.users.length == 0);
          if (hasError) {
            errMsg += "审核规则中存在没有名称或审批人的审核层级！" + "\n";
          }
          if (errMsg) {
            this.$confirm(errMsg, "提示", {
              showCancelButton: false,
              confirmButtonText: "确定",
              type: "error"
            }).then(() => {
              return;
            });
            return;
          }
          let data = _.cloneDeep(this.editForm);
          data.icon = data.photos.join(",");
          delete data.photos;
          // 申请表单
          data.fields = this.$refs.fields.list;
          // 不可用日期
          data.closetimes = this.$refs.appointRules.closeTimes;
          // 开放时间
          data.opentimes = this.$refs.appointRules.openTimes;
          // 预约时间
          data.yytime = this.getYyTime();
          // 限制条件
          data.conditions = this.$refs.appointRules.conditions;
          // 取消预约
          data.cancel = this.$refs.appointRules.cancel;
          // 签到规则
          data.check = this.getCheckRule();
          // 审核规则
          data.approves = this.getApproves();
          const opRules = this.$refs.appointRules;
          if (opRules.multiplePeople) {
            data.rulePerson = {...this.resDetail.rulePerson} || {}
            data.rulePerson.checkinType = opRules.isNeedAll
            data.rulePerson.minPerson =opRules.leastPeople
          }

          saveRes(data)
            .then(res => {
              this.loading = false;
              if (res.success) {
                this.$message({
                  showClose: true,
                  type: "success",
                  message: "保存成功！"
                });
                sessionStorage.removeItem("newRes");
                this.$router.push("/res-manage");
              } else {
                this.$message({
                  showClose: true,
                  type: "error",
                  message: "保存失败：" + res.data.message
                });
              }
            })
            .catch(err => {
              this.loading = false;
              this.$message({
                showClose: true,
                type: "error",
                message: "保存失败：" + err
              });
            });
        }
      });
    },

    // 获取资源详情
    getResDetail() {
      this.loading = true;
      let data = {
        id: this.resId
      };
      getResDetail(data)
        .then(res => {
          this.loading = false;
          if (res.success) {
            this.resDetail = res.data || {};
            for (let key in this.editForm) {
              this.editForm[key] = this.resDetail[key];
            }
            this.editForm.photos = this.resDetail.icon
              ? this.resDetail.icon.split(",")
              : [];
            if (this.isCopy == "true") {
              this.editForm.id = null;
              this.editForm.name = this.editForm.name + "_复制";
            }
          }
        })
        // eslint-disable-next-line no-unused-vars
        .catch(err => {
          this.loading = false;
        });
    }
  },
  created() {
    this.getTplList();
    if (this.resId && this.resId !== "null") {
      // 获取详情
      this.getResDetail();
    } else {
      // 从sessionStorage中取数据
      let data = sessionStorage.getItem("newRes");
      if (data) {
        let newRes = JSON.parse(data);
        for (let i in newRes) {
          this.editForm[i] = newRes[i];
        }
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.base-search-table {
  overflow: auto;
}
.res-content {
  height: calc(100% - 70px);
  margin: 15px 20px 0;
  border-top: 1px solid #dce1f0;
  .el-row {
    height: 100%;
    .el-col {
      height: 100%;
      &:not(:last-child) {
        border-right: 1px solid #dce1f0;
      }
    }
  }
}

.edit-box {
  padding: 30px 0;
  position: relative;
}
.el-form {
  .el-select,
  .el-input {
    width: 300px;
  }
  .el-checkbox {
    display: block;
    height: 30px;
  }
  .el-form-item {
    margin-bottom: 14px;
  }
}

.upload-box {
  margin-right: 20px;
  vertical-align: top;
  .img-note {
    color: rgba(0, 0, 0, 0.45);
  }
}

.upload-imgs {
  position: relative;
  display: inline-block;
  width: 80px;
  height: 80px;
  background: #f6f6f6;
  text-align: center;
  margin-right: 12px;
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  i {
    position: absolute;
    top: 0;
    right: 0;
    background: rgba(0, 0, 0, 0.2);
    color: #ffffff;
    font-size: 10px;
    padding: 2px;
    cursor: pointer;
  }
}

.tab-box {
  padding: 15px 0 30px 30px;
}
.go-back {
  color: #3f86f7;
  cursor: pointer;
}
</style>