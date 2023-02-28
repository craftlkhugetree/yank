<template>
  <div style="margin-bottom:54px;">
    <van-nav-bar
      :title="usetype == 1 ? '资源申请' : '资源续租'"
      :border="false"
      left-arrow
      @click-left="goBack"
      right-text="功能首页"
      @click-right="$router.push('/fun-module')"
    />
    <div class="title-des">请在审批后5个工作日内办理入驻</div>
    <van-form ref="edifForm" input-align="right" error-message-align="right">
      <!-- 基本信息 -->
      <div class="form-box">
        <div class="form-box-title">基本信息</div>
        <div class="form-box-content">
          <van-field
            readonly
            name="资源类型"
            label="资源类型"
            v-model="form.eduTypeName"
            placeholder="请选择"
            right-icon="arrow-down"
            :disabled="usetype == '2'"
            @click="usetype == '2' ? void 0 : (showTypePicker = true)"
            :rules="[{ required: true, message: '请选择资源类型' }]"
          />
          <van-popup v-model="showTypePicker" position="bottom">
            <van-picker
              show-toolbar
              :columns="resTypeList.map(r => r.name)"
              @confirm="typeChange"
              @cancel="showTypePicker = false"
            />
          </van-popup>

          <van-field
            name="资源编号"
            label="资源编号"
            placeholder="请选择"
            readonly
            :disabled="usetype == '2'"
            @click="usetype == '2' ? void 0 : showCodePicker()"
            v-model="form.names"
            right-icon="arrow-down"
            :rules="[{ required: true, message: '请选择资源编号' }]"
            :border="false"
            style="padding-bottom:0;"
          />
          <van-cell style="padding-top:0;" v-if="usetype == '1'">
            <span style="color:#faac16;font-size:12px;">最多可以选择{{ ruleNum }}个资源</span>
          </van-cell>
          <van-popup
            v-model="codePicker"
            position="bottom"
            style="overflow:hidden;"
            :close-on-click-overlay="false"
          >
            <van-nav-bar
              left-text="取消"
              right-text="确定"
              @click-left="onCancelCodes"
              @click-right="onConfirmCodes"
            />
            <div style="height:220px;overflow:auto;">
              <van-checkbox-group v-model="checkboxvalue">
                <van-checkbox
                  class="new-checkbox"
                  v-for="item in resList"
                  :key="item.id"
                  :name="item.id"
                  ref="checkboxs"
                >
                  {{ item.name }}
                </van-checkbox>
              </van-checkbox-group>
            </div>
          </van-popup>
          <van-field
            v-model="form.areas"
            name="面积"
            label="面积(㎡)"
            placeholder="请输入"
            disabled
            :rules="[{ required: true, message: '请填写面积' }]"
          />

          <!-- name="使用时长" -->
          <van-field
            v-model="form.useCycle"
            name="validator"
            :label="`使用时长(${form.chargecycle})`"
            placeholder="请输入"
            type="digit"
            :border="false"
            style="padding-bottom:0;"
            :rules="[
              {
                validator: val => {
                  return val <= resTypeDetail.maxUse;
                },
                message: '请填写时长(整数且不大于最大使用时长)',
              },
            ]"
          />
          <van-cell style="padding-top:0;">
            <span style="color:#faac16;font-size:12px;">
              最大使用时长为{{
                (resTypeDetail.maxUse || 0) +
                  (form.chargecycle === '月' ? '个月' : form.chargecycle)
              }}
            </span>
            <br />
            <span style="color:#faac16;font-size:12px;" v-if="form.useCycle">
              租期自{{ today }}到{{ newDate }}
            </span>
          </van-cell>

          <van-field
            class="leaderPro"
            name="课题组经费负责人"
            label="课题组经费负责人"
            placeholder="请选择"
            disabled
            v-model="form.classfeeLeaderName"
            :border="false"
            :rules="[{ required: true, message: '请选择课题组负责人' }]"
          />

          <van-field
            v-model="form.classfeeLeaderMobile"
            name="联系电话"
            label="联系电话"
            placeholder="请输入"
            type="tel"
            style="padding-top: 5px"
            :rules="[{ pattern: /1\d{10}$/, message: '请填写正确的手机号' }]"
          />

          <van-field
            v-model="form.orgName"
            name="学院名称"
            label="学院名称"
            placeholder="请输入"
            disabled
            :rules="[{ required: true, message: '请填写学院名称' }]"
          />
          <van-field
            v-model="form.classgroupName"
            :maxlength="maxLen2"
            name="课题组名称"
            label="课题组名称"
            placeholder="请输入"
            :rules="[{ required: true, message: '请填写课题组名称' }]"
          />

          <van-field
            v-model="form.contacterName"
            name="日常联系人"
            label="日常联系人"
            placeholder="请选择"
            right-icon="arrow-down"
            :border="false"
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
            :rules="[{ pattern: /1\d{10}$/, message: '请填写正确的手机号' }]"
          />
        </div>
      </div>
      <!-- 项目信息 -->
      <div class="form-box">
        <div class="form-box-title">项目信息</div>
        <div class="form-box-content">
          <van-field
            name="项目名称"
            label="项目名称"
            placeholder="请选择"
            readonly
            clickable
            v-model="form.projectName"
            @click="showProjectPicker = true"
            right-icon="arrow-down"
            :border="false"
            :rules="[{ required: true, message: '请选择项目名称' }]"
          />
          <base-input-select-popup
            :showPicker.sync="showProjectPicker"
            @selectItem="selectProject"
          ></base-input-select-popup>
          <van-field
            v-model="form.projectFrom"
            :maxlength="maxLen2"
            name="项目来源"
            label="项目来源"
            placeholder="请输入"
            :rules="[{ required: true, message: '请填写项目来源' }]"
          />
          <van-field
            v-model="form.projectFee"
            maxlength="10"
            name="项目经费"
            label="项目经费(万元)"
            placeholder="请输入"
            type="number"
            label-width="150"
            :rules="[
              {
                pattern: /(^[1-9](\d+)?(\.\d{1,4})?$)|(^0\.\d{1,4}$)/,
                message: '请填写金额(整数或四位小数)',
              },
            ]"
          />
          <van-field
            readonly
            clickable
            name="项目时间"
            label="项目时间"
            :value="date"
            placeholder="请选择"
            @click="show = true"
            right-icon="calender-o"
            :border="false"
            :rules="[
              {
                message: '请选择项目日期',
                validator: v => {
                  return v && v.length;
                },
              },
            ]"
          />

          <van-calendar
            :allow-same-day="true"
            v-model="show"
            type="range"
            @confirm="onConfirmRange"
            :default-date="defaultDate"
          />
          <div class="field-box">
            <div class="field-box-textarea">
              <p>项目概况</p>
              <van-field
                v-model="form.projectOverview"
                name="项目概况"
                placeholder="不少于200字"
                rows="3"
                type="textarea"
                :maxlength="maxLen"
                :show-word-limit="true"
                input-align="left"
                :rules="[
                  {
                    required: true,
                    message: '请填写项目概况，且不少于200字',
                    validator: v => {
                      return v.length > 200;
                    },
                  },
                ]"
              />
            </div>
          </div>

          <div class="field-box">
            <div class="field-box-textarea">
              <p>实验概况</p>
              <van-field
                v-model="form.experimentOverview"
                name="实验概况"
                placeholder="主要包括实验目的、材料、实验方法、进度计划及预期成果和应用价值等；（如果是宿舍类，注明居住人姓名、性别、身份证号、联系电话等）"
                rows="3"
                type="textarea"
                :maxlength="maxLen"
                :show-word-limit="true"
                input-align="left"
                :rules="[{ required: true, message: '请填写实验概况' }]"
              />
            </div>
          </div>
          <div class="field-box">
            <div class="field-box-textarea">
              <p>预期成果</p>
              <van-field
                v-model="form.expectedResult"
                name="预期成果"
                placeholder="请输入"
                rows="3"
                type="textarea"
                :maxlength="maxLen"
                :show-word-limit="true"
                input-align="left"
                :rules="[{ required: true, message: '请填写预期成果' }]"
              />
            </div>
          </div>
          <van-field
            v-if="usetype == 1"
            readonly
            clickable
            name="审批领导"
            label="审批领导"
            v-model="form.approvername"
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
          <van-field
            readonly
            label="请确认所有内容填写完整，否则审核无法通过。"
            class="end-tips"
            label-width="300"
          />
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
      <agreement-form
        :isMobile="true"
        v-if="showDialog"
        :hasSignature="false"
        :usetype="usetype"
        :form="form"
        :tableTable="tableDate"
        :today="today"
        :newDate="newDate"
      ></agreement-form>
      <van-checkbox v-model="readchecked" shape="square" icon-size="16px">
        已阅读上述协议后请确认填写信息无误
      </van-checkbox>
      <span class="agree-warn">
        审核通过后，请下载打印协议文件到基地办理入驻。
      </span>
    </van-dialog>
  </div>
</template>

<script>
import BaseUserSelectPopup from '../../../components/BaseUserSelectPopup';
import BaseInputSelectPopup from '../../../components/BaseInputSelectPopup';
import AgreementForm from './agreementForm';
import {
  eduResourceReCheckin,
  eduApplySave,
  eduResourcePageQuery,
  eduTypeList,
} from '@/assets/js/api';
export default {
  name: 'ResApplyForm',
  components: {
    BaseUserSelectPopup,
    BaseInputSelectPopup,
    AgreementForm,
  },
  data() {
    return {
      tableDate: [],
      maxLen: 10000,
      maxLen2: 200,
      defaultDate: null,
      date: '',
      show: false,
      today: '',
      newDate: '',
      showTypePicker: false,
      resTypeList: [],
      resList: [],
      form: {},
      resTypeDetail: {},
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
      ruleNum: '',
    };
  },
  props: {
    resid: String, // 资源id
    restypeid: String, // 资源类型id
    usetype: String, // 使用类型 1.申请入驻 2.续租
  },
  computed: {
    userInfo() {
      return this.$store.state.userInfo;
    },
  },
  watch: {
    'form.useCycle': {
      handler() {
        this.calDay();
      },
      deep: true,
    },
  },
  methods: {
    // 时间范围
    onConfirmRange(date) {
      const [start, end] = date;
      this.defaultDate = date;
      this.show = false;
      this.date = this.common.formatTime(start.getTime(), 'yyyy-MM-dd');
      this.date += ' ~ ' + this.common.formatTime(end.getTime(), 'yyyy-MM-dd');
    },
    // 校验时长
    valiDay(val) {
      return val <= this.form.maxUse;
    },
    // 计算租期
    calDay() {
      if (!this.form.useCycle) {
        return;
      }
      const r = this.form;
      let interval = r.chargecycle;
      let newDate;
      let now = r.rentStartTime
        ? new Date(this.util.formatTime(r.rentStartTime, 'yyyy-MM-dd'))
        : new Date();
      this.today = this.util.formatTime(now.getTime(), 'yyyy年MM月dd日');

      newDate = this.common.DateAdd(interval, r.useCycle, now).getTime();
      this.newDate = this.util.formatTime(newDate, 'yyyy年MM月dd日');
    },
    // 类型改变
    typeChange(val) {
      if (this.resTypeDetail.name === val) {
        this.showTypePicker = false;
        return;
      }
      if (val) {
        this.resTypeDetail = this.resTypeList.find(r => r.name === val) || {};
      }
      const filter = {
        status: 1,
        useState: this.usetype == 1 ? 0 : undefined,
        eduTypeId: this.resTypeDetail.id || this.restypeid,
      };
      const params = {
        page: 1,
        limit: 10000,
        filter,
      };
      this.loading = true;
      eduResourcePageQuery(params)
        .then(res => {
          this.loading = false;
          if (res && res.success) {
            this.resList = res.data || [];

            this.resList.forEach(r => {
              const obj = this.resTypeList.find(t => t.id === r.eduTypeId) || {};
              r.typeName = obj.name || '';

              let chargecycle = r.billingCycle + '';
              let chargetype = r.billingMethod + '';
              this.common.chargecycleFormatter(chargecycle, r);
              this.common.chargetypeFormatter2(chargetype, r, 'ct2', 'ct1');
            });

            // 传来的资源id，设置表单信息
            const tmpid = this.resid.split(',');
            const choose = this.resList.filter(item => tmpid.includes(item.id + ''));
            this.form = {
              orgId: this.userInfo.ORGID,
              orgName: this.userInfo.ORGNAME,
              classfeeLeaderName: this.userInfo.NAME,
              classfeeLeader: this.userInfo.ID,
              billingCycle: this.resTypeDetail.billingCycle,
              billingMethod: this.resTypeDetail.billingMethod,
              eduTypeId: filter.eduTypeId,
              eduTypeName: val || this.resTypeDetail.name,
              eduResourceIds: val ? [] : tmpid,
              names: val ? '' : choose.map(c => c.name).join(','),
              rules: this.resTypeDetail.rules,
              rentStartTime: !choose.length ? '' : choose[0].rentStartTime,
              areas: val ? '' : choose.map(rc => rc.area).join(','),
            };
            this.checkboxvalue = val ? [] : this.checkboxvalue;

            this.form.ct2 = this.resTypeList.find(r => r.id === this.form.eduTypeId).ct2;
            this.form.chargecycle = this.resTypeList.find(
              r => r.id === this.form.eduTypeId
            ).chargecycle;
            this.form.ct1 = this.resTypeList.find(r => r.id === this.form.eduTypeId).ct1;
            this.showTypePicker = false;
          }
        })
        .catch(e => {
          this.loading = false;
        });
    },
    // 返回
    goBack() {
      this.$router.go(-1);
    },
    // 弹出资源编号列表
    showCodePicker() {
      this.codePicker = true;
      // 选中已选择的编号
      this.$nextTick(() => {
        let resList = this.form.eduResourceIds;
        let checkboxs = this.$refs.checkboxs;
        // console.log(checkboxs, resList);
        if (resList.length > 0) {
          resList.forEach(i => {
            let index = checkboxs.findIndex(j => j.name == i);
            if (index !== -1) {
              checkboxs[index].toggle(true);
            }
          });
        }
      });
    },
    // 取消选择编号
    onCancelCodes(val) {
      let checkboxs = this.$refs.checkboxs;
      checkboxs.forEach(c => {
        c.toggle(false);
      });
      // console.log(checkboxs);
      this.codePicker = false;
    },
    // 选择编号
    onConfirmCodes() {
      if (this.ruleNum && this.checkboxvalue.length > this.ruleNum) {
        this.$toast.fail(`最多选择${this.ruleNum}个资源`);
        return;
      }
      this.form.eduResourceIds = this.checkboxvalue;
      const tmp = this.resList.filter(i => this.checkboxvalue.includes(i.id)) || [];
      this.form.areas = tmp.map(r => r.area).join(',');
      this.form.names = tmp.map(r => r.name).join(',');
      this.codePicker = false;
    },
    // 选择项目名称
    selectProject(item) {
      this.form.projectName = item.xmmc.includes('新增') ? item.xmmc.split('-')[0] : item.xmmc;
      this.form.projectbh = item.xmbh;
      this.showProjectPicker = false;
    },
    // 选择课题组名称
    selectClass(item) {
      this.form.classname = item.name;
      this.showClassPicker = false;
    },
    // 选择联系人
    selectLeader(item) {
      this.form.contacterName = item.name;
      this.form.contacter = item.id;
      this.showLeaderPicker = false;
    },
    // 选择审批人
    chooseApporver(item) {
      this.form.approver = item.value;
      this.form.approvername = item.text;
      this.showApproverPicker = false;
    },
    // 提交
    doApply() {
      this.$refs.edifForm
        .validate()
        .then(() => {
          let form = this.form;
          let arrTmp = [];
          let resArr = [];

          if (this.usetype == 1) {
            resArr =
              this.resList.filter(r => {
                return form.eduResourceIds.some(e => e == r.id);
              }) || [];
          } else if (this.usetype == 2) {
            resArr = form.resources;
          }
          arrTmp = resArr.map(r => {
            return {
              eduResourceArea: r.area,
              eduResourceId: r.id,
              eduResourceName: r.name,
              eduResourcePrice: r.price,
              useCycle: form.useCycle,
              cost: this.common.moneyFormatter(
                '',
                '',
                form.billingMethod == 1 ? r.price * form.useCycle * r.area : r.price * form.useCycle
              ),
            };
          });

          let cost = arrTmp.reduce((pre, item) => {
            return pre + parseFloat(item.cost);
          }, 0);
          let summary = {};
          for (let p in arrTmp[0]) {
            summary[p] = '';
          }
          summary.eduResourceName = '合计';
          summary.cost = cost;
          arrTmp.push(summary);
          this.tableDate = arrTmp;
          this.showDialog = true;
        })
        .catch(err => {
          this.$toast.fail('请填写正确信息');
        });
    },
    // 最终提交
    doSubmit(action, done) {
      if (action === 'cancel') {
        done();
      } else if (action === 'confirm') {
        if (this.readchecked) {
          this.$toast.loading({
            message: '提交中...',
            forbidClick: true,
            duration: 0,
          });
          let form2 = {};
          for (let p in this.form) {
            form2[p] = this.form[p];
          }
          form2.projectStarttime = this.util.formatTime(this.defaultDate[0].getTime(), 'yyyyMMdd');
          form2.projectEndtime = this.util.formatTime(this.defaultDate[1].getTime(), 'yyyyMMdd');
          form2.useType = this.usetype;
          eduApplySave(form2)
            .then(res => {
              this.$toast.clear();
              if (res.success == true) {
                this.$toast.success('提交成功');
                done();
                this.goBack();
              } else {
                this.$toast.fail('提交失败' + '\n' + res.message);
                done(false);
              }
            })
            .catch(err => {
              this.$toast.clear();
              this.$toast.fail('提交失败' + '\n' + err);
              done(false);
            });
        } else {
          this.$toast.fail('请阅读并勾选租用协议');
          done(false);
        }
      }
    },
    // 获取审批人列表
    getLeaderList() {
      this.util
        .postAjax({
          code: this.global.bmCode,
          url: '/user/userLeaderList',
        })
        .then(res => {
          if (res.success) {
            this.leaderList = res.items.map(i => {
              return {
                text: i.name,
                value: i.id,
              };
            });
          } else {
            this.$toast.fail('获取审批人列表失败' + '\n' + res.message);
          }
        })
        .catch(err => {
          // this.$toast.fail("获取审批人列表失败" + "\n" + err);
        });
    },

    // 获取规则
    getRule() {
      this.util
        .postAjax({
          code: this.global.bmCode,
          url: '/rules/findByCode',
          data: {
            code: 'SPAPPLYNUM',
          },
        })
        .then(res => {
          if (res.success) {
            this.ruleNum = res.item.rulevalue;
          }
        });
    },

    //获取资源类型列表
    getResTypeList() {
      eduTypeList({}).then(res => {
        if (res.success == true) {
          this.resTypeList = res.data;
          this.resTypeList.forEach(r => {
            let chargecycle = r.billingCycle + '';
            let chargetype = r.billingMethod + '';
            this.common.chargecycleFormatter(chargecycle, r);
            this.common.chargetypeFormatter2(chargetype, r, 'ct2', 'ct1');
          });
          this.resTypeDetail = this.resTypeList.find(r => r.id == this.restypeid) || {};
          if (this.usetype == 1) {
            this.typeChange();
          } else if (this.usetype == 2) {
            this.rent();
          }
        }
      });
    },

    // 续租查询
    rent() {
      this.$toast.loading({
        message: '...',
        forbidClick: true,
        duration: 0,
      });

      this.loading = true;
      eduResourceReCheckin({ id: this.resid })
        .then(res => {
          this.$toast.clear();
          if (res && res.success) {
            this.form = res.data;
            this.form.ct2 = this.resTypeList.find(r => r.id === this.form.eduTypeId).ct2;
            this.form.chargecycle = this.resTypeList.find(
              r => r.id === this.form.eduTypeId
            ).chargecycle;
            this.form.ct1 = this.resTypeList.find(r => r.id === this.form.eduTypeId).ct1;
            this.form.rules = this.resTypeList.find(r => r.id === this.form.eduTypeId).rules;
            this.form.eduResourceIds = [this.resid];
            this.form.classfeeLeaderName = this.userInfo.NAME;
            this.form.classfeeLeader = this.userInfo.ID;

            let tmp = res.data.resources || [];
            this.form.areas = tmp.map(t => t.area).join(',');
            this.form.names = tmp.map(r => r.name).join(',');
            if (this.form.projectStarttime && this.form.projectEndtime) {
              let a0 = this.util.formatTime(this.form.projectStarttime, 'yyyy-MM-dd');
              let a1 = this.util.formatTime(this.form.projectEndtime, 'yyyy-MM-dd');
              this.defaultDate = [new Date(a0), new Date(a1)];
              this.onConfirmRange(this.defaultDate);
            }
          } else {
            this.$toast.fail(res.message);
            this.goBack();
          }
          this.loading = false;
        })
        .catch(e => {
          this.$toast.clear();
          this.loading = false;
        });
    },
  },
  created() {
    this.getResTypeList();
    // 获取审批人列表
    this.getLeaderList();
    // 获取规则
    this.getRule();
  },
};
</script>

<style lang="scss" scoped>
@import '../../../assets/css/mixin.scss';
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

/deep/ .van-checkbox__icon--checked .van-icon {
  color: #fff;
  background-color: #00b09b;
  border-color: #00b09b;
}
/deep/ .leaderPro .van-cell__title.van-field__label {
  width: 40%;
}
.end-tips {
  width: 100%;
  font-size: 12px;
  background: #f8f8f8;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
  /deep/ .van-cell__title.van-field__label {
    color: #b6bdc6;
  }
}
.agree-warn {
  // margin-left: 29px;
  width: 100%;
  height: 20px;
  font-size: 13px;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
  color: #fe3e61;
  line-height: 20px;
}
</style>