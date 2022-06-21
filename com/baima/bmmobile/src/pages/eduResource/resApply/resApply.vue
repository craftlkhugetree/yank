<template>
  <div style="margin-bottom:54px;">
    <van-nav-bar title="资源申请" :border="false" left-arrow @click-left="goBack" />
    <div class="title-des">请在审批后5个工作日内办理入驻</div>
    <van-form ref="edifForm" input-align="right" error-message-align="right">
      <!-- 基本信息 -->
      <div class="form-box">
        <div class="form-box-title">基本信息</div>
        <div class="form-box-content">
          <van-field
            v-if="usetype === '2'"
            name="资源编号"
            label="资源编号"
            placeholder="请选择"
            readonly
            v-model="editForm.rescodes"
            :rules="[{ required: true, message: '请选择资源编号' }]"
          />
          <van-field
            v-if="usetype === '1'"
            name="资源编号"
            label="资源编号"
            placeholder="请选择"
            readonly
            clickable
            v-model="editForm.rescodes"
            @click="showCodePicker"
            right-icon="arrow-down"
            :rules="[{ required: true, message: '请选择资源编号' }]"
            :border="false"
            style="padding-bottom:0;"
          />
          <van-cell style="padding-top:0;" v-if="usetype === '1'">
            <span style="color:#faac16;font-size:12px;">最多可以选择{{ruleNum}}个资源</span>
          </van-cell>
          <van-popup v-model="codePicker" position="bottom" style="overflow:hidden;">
            <van-nav-bar
              left-text="取消"
              right-text="确定"
              @click-left="codePicker = false"
              @click-right="onConfirmCodes"
            />
            <div style="height:220px;overflow:auto;">
              <van-checkbox-group v-model="checkboxvalue">
                <van-checkbox
                  class="new-checkbox"
                  v-for="item in resids"
                  :key="item.id"
                  :name="item"
                  ref="checkboxs"
                >{{item.rescode}}</van-checkbox>
              </van-checkbox-group>
            </div>
          </van-popup>
          <van-field
            v-model="editForm.orgname"
            name="学院名称"
            label="学院名称"
            placeholder="请输入"
            disabled
            :rules="[{ required: true, message: '请填写学院名称' }]"
          />
          <van-field
            v-model="editForm.classname"
            name="课题组名称"
            label="课题组名称"
            placeholder="请输入"
            :rules="[{ required: true, message: '请填写课题组名称' }]"
          />
          <!-- <van-field
            name="课题组名称"
            label="课题组名称"
            placeholder="请选择"
            readonly
            clickable
            v-model="editForm.classname"
            @click="showClassPicker = true"
            right-icon="arrow-down"
            :border="false"
            :rules="[{ required: true, message: '请选择课题组名称' }]"
          />
          <base-input-select-popup :showPicker.sync="showClassPicker" @selectItem="selectClass"></base-input-select-popup> -->
          <van-field
            v-model="editForm.applyername"
            name="申请人"
            label="申请人"
            placeholder="请输入"
            disabled
            :border="false"
            :rules="[{ required: true, message: '请填写申请人' }]"
          />
          <van-field
            v-model="editForm.applyermobile"
            name="联系电话"
            label="联系电话"
            placeholder="请输入"
            type="tel"
            style="padding-top: 5px"
            :rules="[{ pattern:/1\d{10}$/,  message: '请填写正确的手机号' }]"
          />
          <van-field
            name="课题组负责人"
            label="课题组负责人"
            placeholder="请选择"
            readonly
            clickable
            v-model="editForm.classleadername"
            @click="showLeaderPicker = true"
            right-icon="arrow-down"
            :border="false"
            :rules="[{ required: true, message: '请选择课题组负责人' }]"
          />
          <base-user-select-popup :showPicker.sync="showLeaderPicker" @selectItem="selectLeader"></base-user-select-popup>
          <van-field
            v-model="editForm.classleadermobile"
            name="联系电话"
            label="联系电话"
            placeholder="请输入"
            type="tel"
            style="padding-top: 5px"
            :rules="[{ pattern:/1\d{10}$/,  message: '请填写正确的手机号' }]"
          />
          <!-- <van-field
            v-model="editForm.projectname"
            name="项目名称"
            label="项目名称"
            placeholder="请输入"
            :rules="[{ required: true, message: '请填写项目名称' }]"
          /> -->
          <van-field
            name="项目名称"
            label="项目名称"
            placeholder="请选择"
            readonly
            clickable
            v-model="editForm.projectname"
            @click="showProjectPicker = true"
            right-icon="arrow-down"
            :border="false"
            :rules="[{ required: true, message: '请选择项目名称' }]"
          />
          <base-input-select-popup :showPicker.sync="showProjectPicker" @selectItem="selectProject"></base-input-select-popup>
          <van-field
            v-model="editForm.projectfrom"
            name="项目来源"
            label="项目来源"
            placeholder="请输入"
            :rules="[{ required: true, message: '请填写项目来源' }]"
          />
          <van-field
            v-model="editForm.projectprice"
            name="项目经费"
            label="项目经费(万元)"
            placeholder="请输入"
            type="number"
            label-width="100"
            :rules="[{ pattern: /(^[1-9](\d+)?(\.\d{1,4})?$)|(^0\.\d{1,4}$)/, message: '请填写金额(整数或四位小数)' }]"
          />
          <van-field
            v-model="editForm.usecycle"
            name="使用时长"
            :label="`使用时长(${chargecycle})`"
            placeholder="请输入"
            type="digit"
            :border="false"
            style="padding-bottom:0;"
            :rules="[{ validator:(v) => {return v <= maxusecycle}, message: '请填写时长(整数且不大于最大使用时长)' }]"
          />
          <van-cell style="padding-top:0;">
            <span style="color:#faac16;font-size:12px;">最大使用时长为{{maxusecycle}}{{chargecycle}}</span>
          </van-cell>
          <div class="field-box">
            <div class="field-box-textarea">
              <p>项目概况</p>
              <van-field
                v-model="editForm.projectnote"
                name="项目概况"
                placeholder="请输入"
                rows="3"
                type="textarea"
                maxlength="500"
                :show-word-limit="true"
                input-align="left"
                :rules="[{ required: true, message: '请填写项目概况' }]"
              />
            </div>
          </div>
          <div class="field-box">
            <div class="field-box-textarea">
              <p>实验概况</p>
              <van-field
                v-model="editForm.situation"
                name="实验概况"
                placeholder="主要包括实验目的、材料、实验方法、进度计划及预期成果和应用价值等；（如果是宿舍类，注明居住人姓名、性别、身份证号、联系电话等）"
                rows="3"
                type="textarea"
                maxlength="500"
                :show-word-limit="true"
                input-align="left"
                :rules="[{ required: true, message: '请填写实验概况' }]"
              />
            </div>
          </div>
          <van-field
            readonly
            clickable
            name="审批领导"
            label="审批领导"
            v-model="editForm.approvername"
            placeholder="请选择"
            right-icon="arrow-down"
            @click="showApproverPicker = true"
            :rules="[{ required: true, message: '请选择审批领导' }]"
          />
          <van-popup v-model="showApproverPicker" position="bottom">
            <van-picker
              show-toolbar
              :columns="leaderList"
              @confirm="chooseApporver"
              @cancel="showApproverPicker = false"
            />
          </van-popup>
          <div style="width: 100%; height: 50px;"></div>
        </div>
      </div>
      <div class="form-btns">
        <van-button type="default" @click="goBack">取消</van-button>
        <van-button type="primary" @click="doApply">提交</van-button>
      </div>
    </van-form>

    <!-- 阅读协议弹窗 -->
    <van-dialog
      v-model="showDialog"
      title="南京农业大学白马教学科研基地科教资源租用协议"
      show-cancel-button
      :before-close="doSubmit"
    >
      <agreement-form v-if="showDialog" :usetype="usetype" :form="editForm" :resList="resids"></agreement-form>
      <van-checkbox v-model="readchecked" shape="square" icon-size="16px">已阅读上述协议后请确认填写信息无误</van-checkbox>
    </van-dialog>
  </div>
</template>

<script>
import BaseUserSelectPopup from "../../../components/BaseUserSelectPopup";
import BaseInputSelectPopup from "../../../components/BaseInputSelectPopup";
import AgreementForm from "./agreementForm";
export default {
  components: {
    BaseUserSelectPopup,
    BaseInputSelectPopup,
    AgreementForm
  },
  data() {
    return {
      editForm: {
        rescodes: "",
        resList: [],
        orgname: "",
        orgid: "",
        classname: "",
        applyername: "",
        applyermobile: "",
        classleadername: "",
        classleaderid: "",
        classleadermobile: "",
        projectname: "",
        projectbh: "",
        projectfrom: "",
        projectprice: "",
        usecycle: "",
        projectnote: "",
        situation: "",
        approvername: "",
        approverid: ""
      },
      resids: [],
      checkboxvalue: [],
      codePicker: false,
      showLeaderPicker: false,
      showClassPicker: false,
      showProjectPicker: false,
      showApproverPicker: false,
      leaderList: [],
      showDialog: false,
      readchecked: false,
      ruleNum: "",
      maxusecycle: ""
    };
  },
  props: {
    resid: String, // 资源id
    restypeid: String, // 资源类型id
    usetype: String, // 使用类型 1.入驻 2.续租
    rescode: String
  },
  computed: {
    chargecycle() {
      let curEduResType = sessionStorage.getItem("curEduResType");
      let resType = curEduResType ? JSON.parse(curEduResType) : {};
      return this.common.chargecycleFormatter(resType.chargecycle);
    }
  },
  methods: {
    // 返回
    goBack() {
      this.$router.go(-1);
    },
    // 弹出资源编号列表
    showCodePicker() {
      this.codePicker = true;
      // 选中已选择的编号
      this.$nextTick(() => {
        let resList = this.editForm.resList;
        let checkboxs = this.$refs.checkboxs;
        if (resList.length > 0) {
          resList.forEach(i => {
            let index = checkboxs.findIndex(j => j.name.id === i.resid);
            if (index !== -1) {
              checkboxs[index].toggle(true);
            }
          });
        }
      });
    },
    // 选择编号
    onConfirmCodes() {
      if (this.ruleNum && this.checkboxvalue.length > this.ruleNum) {
        this.$toast.fail(`最多选择${this.ruleNum}个资源`);
        return;
      }
      this.editForm.resList = this.checkboxvalue.map(i => {
        return {
          resid: i.id
        };
      });
      this.editForm.rescodes = this.checkboxvalue.map(i => i.rescode).join(",");
      this.codePicker = false;
    },
    // 选择项目名称
    selectProject(item) {
      this.editForm.projectname = item.xmmc;
      this.editForm.projectbh = item.xmbh;
      this.showProjectPicker = false;
    },
    // 选择课题组名称
    selectClass(item) {
      this.editForm.classname = item.name;
      this.showClassPicker = false;
    },
    // 选择负责人
    selectLeader(item) {
      this.editForm.classleadername = item.name;
      this.editForm.classleaderid = item.id;
      this.showLeaderPicker = false;
    },
    // 选择审批人
    chooseApporver(item) {
      this.editForm.approverid = item.value;
      this.editForm.approvername = item.text;
      this.showApproverPicker = false;
    },
    // 提交
    doApply() {
      this.$refs.edifForm
        .validate()
        .then(() => {
          this.showDialog = true;
        })
        .catch(err => {
          this.$toast.fail("请填写正确信息");
        });
    },
    // 最终提交
    doSubmit(action, done) {
      if (action === "cancel") {
        done();
      } else if (action === "confirm") {
        if (this.readchecked) {
          this.$toast.loading({
            message: "提交中...",
            forbidClick: true,
            duration: 0
          });
          this.util
            .postAjax({
              code: this.global.bmCode,
              url: "/spapply/save",
              isRep: true,
              data: {
                ...this.editForm,
                sprestypeid: this.restypeid,
                usetype: this.usetype
              }
            })
            .then(res => {
              this.$toast.clear();
              if (res.success == true) {
                this.$toast.success("提交成功");
                done();
                this.goBack();
              } else {
                this.$toast.fail("提交失败" + "\n" + res.message);
                done(false);
              }
            })
            .catch(err => {
              this.$toast.clear();
              this.$toast.fail("提交失败" + "\n" + err);
              done(false);
            });
        } else {
          this.$toast.fail("请阅读并勾选租用协议");
          done(false);
        }
      }
    },
    // 获取审批人列表
    getLeaderList() {
      this.util
        .postAjax({
          code: this.global.bmCode,
          url: "/user/userLeaderList"
        })
        .then(res => {
          if (res.success) {
            this.leaderList = res.items.map(i => {
              return {
                text: i.name,
                value: i.id
              };
            });
          } else {
            this.$toast.fail("获取审批人列表失败" + "\n" + res.message);
          }
        })
        .catch(err => {
          // this.$toast.fail("获取审批人列表失败" + "\n" + err);
        });
    },
    // 获取资源列表
    getResList() {
      this.util
        .postAjax({
          code: this.global.bmCode,
          url: "/spres/pageList?date=" + new Date().getTime(),
          data: {
            params: JSON.stringify({
              page: 1,
              limit: 10000,
              restypeid: this.restypeid,
              // usestatus: "1", // 空闲的资源
              resstatus: "1"  // 开启的资源
            })
          }
        })
        .then(res => {
          if (res.success == true) {
            this.resids = res.items || [];
            // 没有资源编号时 或申请时 只提取空闲的资源
            if(!this.resid || this.usetype === "1") {
              this.resids = this.resids.filter(i => i.usestatus === "1");
            } 
            // 申请、续租 设置资源编号
            if (this.resid) {
              this.editForm.rescodes = this.rescode;
              this.editForm.resList = [
                {
                  resid: this.resid
                }
              ];
            }
          }
        });
    },
    // 获取规则
    getRule() {
      this.util
        .postAjax({
          code: this.global.bmCode,
          url: "/rules/findByCode",
          data: {
            code: "SPAPPLYNUM"
          }
        })
        .then(res => {
          if (res.success) {
            this.ruleNum = res.item.rulevalue;
          }
        });
    },
    // 获取资源类型详情
    getResTypeDetail() {
      this.util
        .postAjax({
          code: this.global.bmCode,
          url: "/sprestype/findById",
          data: {
            id: this.restypeid
          }
        })
        .then(res => {
          if (res.success) {
            this.maxusecycle = res.item.maxusecycle || 0;
          }
        })
    },
  },
  created() {
    // 获取用户信息
    let userInfo = this.$store.state.userInfo;
    this.editForm.orgname = userInfo.ORGNAME;
    this.editForm.orgid = userInfo.ORGID;
    this.editForm.applyername = userInfo.NAME;
    // 获取资源列表
    this.getResList();
    // 获取审批人列表
    this.getLeaderList();
    // 获取规则
    this.getRule();
    // 获取资源类型详情
    this.getResTypeDetail()
  }
};
</script>

<style lang="scss" scoped>
@import "../../../assets/css/mixin.scss";
.van-dialog {
  max-width: 80%;
  // max-height: 80%;
  min-height: 400px;
  .van-checkbox {
    font-size: 14px;
    margin: 10px;
  }
}
.title-des {
  background: #ffffff;
  text-align: center;
}
.form-box {
  box-shadow: none !important;
}
</style>