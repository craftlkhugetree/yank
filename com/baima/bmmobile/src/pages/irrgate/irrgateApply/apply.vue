<template>
  <div>
    <van-nav-bar title="水资源申请" :border="false" left-arrow @click-left="goBack" />
    <van-form ref="edifForm" input-align="right" error-message-align="right">
      <!-- 基本信息 -->
      <div class="form-box">
        <div class="form-box-title">1.基本信息</div>
        <div class="form-box-content">
          <van-field
            v-model="applyForm.orgname"
            name="学院名称"
            label="学院名称"
            placeholder="请输入"
            disabled
            :rules="[{ required: true, message: '请填写学院名称' }]"
          />
          <!-- <van-field
            v-model="applyForm.projectname"
            name="项目名称"
            label="项目名称"
            placeholder="请输入"
            :rules="[{ required: true, message: '请填写项目名称' }]"
          />-->
          <van-field
            name="项目名称"
            label="项目名称"
            placeholder="请选择"
            readonly
            clickable
            v-model="applyForm.projectname"
            @click="showProjectPicker = true"
            right-icon="arrow-down"
            :border="false"
            :rules="[{ required: true, message: '请选择项目名称' }]"
          />
          <base-input-select-popup
            :showPicker.sync="showProjectPicker"
            @selectItem="selectProject"
          ></base-input-select-popup>
          <van-cell style="padding-top:0;">
            <span style="color:#faac16;font-size:12px;">{{ '请规范详实填写项目名称' }}</span>
          </van-cell>
          <van-field
            name="课题组负责人"
            label="课题组负责人"
            placeholder="请选择"
            readonly
            clickable
            v-model="applyForm.classleadername"
            @click="showLeaderPicker = true"
            right-icon="arrow-down"
            :border="false"
            :rules="[{ required: true, message: '请选择课题组负责人' }]"
          />
          <base-user-select-popup
            :showPicker.sync="showLeaderPicker"
            @selectItem="selectLeader"
          ></base-user-select-popup>
          <van-field
            v-model="applyForm.classleadermobile"
            name="联系电话"
            label="联系电话"
            placeholder="请输入"
            type="tel"
            style="padding-top: 5px"
            :rules="[{ pattern: /1\d{10}$/, message: '请填写正确的手机号' }]"
          />
          <van-field
            v-model="applyForm.applyername"
            name="申请人"
            label="申请人"
            placeholder="请输入"
            disabled
            :border="false"
            :rules="[{ required: true, message: '请填写申请人' }]"
          />
          <van-field
            v-model="applyForm.applyermobile"
            name="联系电话"
            label="联系电话"
            placeholder="请输入"
            type="tel"
            style="padding-top: 5px"
            :rules="[{ pattern: /1\d{10}$/, message: '请填写正确的手机号' }]"
          />
          <van-field
            v-model="applyForm.worker"
            name="田间值守人"
            label="田间值守人"
            placeholder="请输入"
            :border="false"
            :rules="[{ required: true, message: '请填写田间值守人' }]"
          />
          <van-field
            v-model="applyForm.workermobile"
            name="联系电话"
            label="联系电话"
            placeholder="请输入"
            type="tel"
            style="padding-top: 5px"
            :rules="[{ pattern: /1\d{10}$/, message: '请填写正确的手机号' }]"
          />
        </div>
      </div>
      <!-- 灌溉信息 -->
      <div class="form-box">
        <div class="form-box-title">2.灌溉信息</div>
        <div class="form-box-content">
          <van-field
            name="灌溉类型"
            label="灌溉类型"
            placeholder="请选择"
            readonly
            clickable
            v-model="applyForm.typename"
            @click="showTypePicker = true"
            right-icon="arrow-down"
            :rules="[{ required: true, message: '请选择灌溉类型' }]"
          />
          <van-popup v-model="showTypePicker" position="bottom">
            <van-picker
              show-toolbar
              :columns="resTypes"
              @confirm="onConfirmType"
              @cancel="showTypePicker = false"
            />
          </van-popup>
          <van-field
            name="资源编号"
            label="资源编号"
            placeholder="请选择"
            readonly
            clickable
            v-model="applyForm.rescodes"
            @click="showCodePicker"
            right-icon="arrow-down"
            :rules="[{ required: true, message: '请选择资源编号' }]"
          />
          <van-popup v-model="showIdsPicker" position="bottom" style="overflow:hidden;">
            <van-nav-bar
              left-text="取消"
              right-text="确定"
              @click-left="showIdsPicker = false"
              @click-right="onConfirmIds"
            />
            <div style="height:220px;overflow:auto;">
              <van-checkbox-group v-model="checkboxvalue">
                <van-checkbox
                  class="new-checkbox"
                  v-for="item in resids"
                  :key="item.id"
                  :name="item"
                  ref="checkboxs"
                >
                  {{ item.rescode }}
                </van-checkbox>
              </van-checkbox-group>
            </div>
          </van-popup>
          <van-field
            readonly
            clickable
            name="灌溉日期"
            v-model="applyForm.irdate"
            label="灌溉日期"
            placeholder="请选择"
            @click.stop="showCalendar = true"
            right-icon="calender-o"
            :rules="[{ required: true, message: '请选择灌溉日期' }]"
            :border="false"
            style="padding-bottom:0;"
            input-align="right"
          >
            <template #button>
              <van-button size="small" type="normal" @click.stop="changeTimePop(true)">
                {{ selectTime }}
              </van-button>
              <van-popup v-model="showTime" position="bottom" v-if="vp" @click-overlay="stopP">
                <van-picker
                  show-toolbar
                  @confirm="onConfirmTime"
                  @cancel="changeTimePop(false)"
                  :columns="timeOption"
                  :default-index="selectTimeId - 1"
                />
              </van-popup>
              <!-- <van-dropdown-menu z-index="9" >
                <van-dropdown-item v-model="timeZone" :options="timeOption" v-if="vp"/>
              </van-dropdown-menu> -->
            </template>
          </van-field>
          <van-cell style="padding-top:0;">
            <span style="color:#faac16;font-size:12px;">{{ ruleDayTime }}</span>
          </van-cell>
          <van-calendar
            v-if="!showTime"
            v-model="showCalendar"
            @confirm="onConfirmDate"
            :default-date="common.defaultDate(applyForm.irdate)"
            :show-confirm="false"
            color="#00b09b"
            :min-date="irMinDate"
            :max-date="new Date(2050, 1, 1)"
          />

          <div class="van-cell land-preview">
            <div class="van-cell__title van-field__label">
              <span>地块细分预览</span>
            </div>
            <div class="van-cell__value van-field__value" @click="showPics = true">
              <img src="../../../../static/imgs/bm-land.png" />
              <span>预览</span>
              <span style="margin: 0 5px 0 20px">>></span>
            </div>
          </div>
        </div>
      </div>
      <!-- 备注信息 -->
      <div class="form-box">
        <div class="form-box-title">3.备注信息</div>
        <div class="form-box-content">
          <van-field
            style="background:#f8f8f8;"
            v-model="applyForm.note"
            name="备注信息"
            placeholder="请输入"
            rows="3"
            type="textarea"
            maxlength="50"
            :show-word-limit="true"
            input-align="left"
          />
        </div>
      </div>
      <div style="width: 100%; height: 50px;"></div>
      <div class="form-btns">
        <van-button v-if="operType !== 'auditEdit'" type="default" @click="doApply(0)">
          保存
        </van-button>
        <van-button v-if="operType !== 'auditEdit'" type="primary" @click="doApply(1)">
          提交
        </van-button>
        <van-button v-if="operType === 'auditEdit'" type="default" @click="goBack">返回</van-button>
        <van-button v-if="operType === 'auditEdit'" type="primary" @click="auditEdit">
          保存
        </van-button>
      </div>
    </van-form>

    <!-- 查看图片 -->
    <van-image-preview
      v-model="showPics"
      :showIndicators="true"
      :images="images"
      :maxZoom="10"
    ></van-image-preview>
  </div>
</template>

<script>
import BaseUserSelectPopup from '../../../components/BaseUserSelectPopup';
import BaseInputSelectPopup from '../../../components/BaseInputSelectPopup';
export default {
  components: {
    BaseUserSelectPopup,
    BaseInputSelectPopup,
  },
  data() {
    return {
      selectTime: '全天',
      selectTimeId: 1,
      showTime: false,
      vp: false,
      // fieldBtnIcon: require('st@tic/imgs/down.png'),
      timeZone: 1,
      timeOption: [
        { text: '全天', value: 1 },
        { text: '上午', value: 2 },
        { text: '下午', value: 3 },
      ],
      applyForm: {
        id: '',
        orgname: '',
        orgid: '',
        projectname: '',
        projectbh: '',
        classleadername: '',
        classleaderid: '',
        classleadermobile: '',
        applyername: '',
        applyermobile: '',
        worker: '',
        workermobile: '',
        irrestypeid: '',
        typename: '',
        resList: [],
        rescodes: '',
        irdate: '',
        note: '',
      },
      showProjectPicker: false,
      showLeaderPicker: false,
      checkboxvalue: [],
      irdate: '',
      resTypes: [],
      showTypePicker: false,
      resids: [],
      showIdsPicker: false,
      showCalendar: false,
      userloading: false,
      userList: [],
      queryUser: '',
      ruleDay: '',
      ruleTime: '',
      showPics: false,
      images: [
        require('../../../../static/imgs/bm-land-01.png'),
        require('../../../../static/imgs/bm-land-02.svg'),
      ],
    };
  },
  props: {
    id: String,
    operType: String,
  },
  computed: {
    // 规则信息
    ruleDayTime() {
      return this.ruleDay
        ? this.ruleTime
          ? `请提前${this.ruleDay}天${this.ruleTime}前申请`
          : `请提前${this.ruleDay}天申请`
        : `请于${this.ruleTime}前申请`;
    },
    // 最小可选时间
    irMinDate() {
      let days = parseInt(this.ruleDay) || 0;
      let nowTime = this.util.formatTime(new Date().getTime(), 'hh:mm');
      if (this.ruleTime && this.ruleTime < nowTime) {
        days += 1;
      }
      return this.common.DateAdd('天', days, new Date());
    },
  },
  methods: {
    stopP(e) {
      let event = e || window.event;
      event.stopPropagation && event.stopPropagation();
      event.preventDefault && event.preventDefault();
      this.showCalendar = false;
    },
    onConfirmTime(val) {
      this.changeTimePop(false);
      // let obj = this.timeOption.find(t => t.text === val) || this.timeOption[0];
      // this.selectTime = obj.text;
      this.selectTimeId = val && val.value;
      this.selectTime = val && val.text;
    },
    changeTimePop(bool, e) {
      this.stopP(e);
      this.vp = this.showTime = bool;
    },
    // 返回
    goBack() {
      this.$router.go(-1);
    },
    // 选择项目名称
    selectProject(item) {
      this.applyForm.projectname = item.xmmc;
      this.applyForm.projectbh = item.xmbh;
      this.showProjectPicker = false;
    },
    // 选择负责人
    selectLeader(item) {
      this.applyForm.classleadername = item.name;
      this.applyForm.classleaderid = item.id;
      this.showLeaderPicker = false;
    },
    // 选择灌溉类型
    onConfirmType(item) {
      this.applyForm.irrestypeid = item.value;
      this.applyForm.typename = item.text;
      this.showTypePicker = false;
      this.applyForm.resList = [];
      this.applyForm.rescodes = '';
      this.checkboxvalue = [];
      // 获取灌溉资料编号列表
      this.common.getResCodeList(item.value, this.applyForm.orgid).then(res => {
        this.resids = res;
      });
    },
    // 弹出灌溉编号列表
    showCodePicker() {
      this.showIdsPicker = true;
      // 选中已选择的编号
      this.$nextTick(() => {
        let resList = this.applyForm.resList;
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
    // 选择灌溉编号
    onConfirmIds() {
      this.applyForm.resList = this.checkboxvalue.map(i => {
        return {
          resid: i.id,
        };
      });
      this.applyForm.rescodes = this.checkboxvalue.map(i => i.rescode).join(',');
      this.showIdsPicker = false;
    },
    // 选择灌溉日期
    onConfirmDate(date) {
      this.applyForm.irdate = `${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()}`;
      this.irdate = this.common.formatTime(date.getTime(), 'YYYYMMDD000000');
      this.showCalendar = false;
    },
    // 保存和提交
    doApply(type) {
      this.$refs.edifForm
        .validate()
        .then(() => {
          let url = type === 0 ? '/irapply/saveDraft' : '/irapply/save';
          let message = type === 0 ? '保存' : '提交';
          let data = Object.assign({}, this.applyForm);
          data.irdate = this.irdate;
          data.daytype = this.selectTimeId;
          if (!data.id || this.operType === 'apply') {
            delete data.id;
          }
          this.$toast.loading({
            message: message + '中...',
            forbidClick: true,
            duration: 0,
          });
          this.util
            .postAjax({
              code: this.global.bmCode,
              url: url,
              isRep: true,
              data: data,
            })
            .then(res => {
              this.$toast.clear();
              if (res.success == true) {
                let path = type === 0 ? '/irrgate-apply' : '/irrgate-apply/apply-success';
                this.$toast.success(message + '成功');
                this.$router.push(path);
              } else {
                console.log(res);
                this.$toast.fail(message + '失败' + '\n' + res.message);
              }
            })
            .catch(err => {
              this.$toast.clear();
              this.$toast.fail(message + '失败' + '\n' + err);
            });
        })
        .catch(() => {
          this.$toast.fail('请填写正确信息');
        });
    },
    //审批编辑
    auditEdit() {
      this.$refs.edifForm
        .validate()
        .then(() => {
          let data = Object.assign({}, this.applyForm);
          data.irdate = this.irdate;

          this.$toast.loading({
            message: '保存中...',
            forbidClick: true,
            duration: 0,
          });
          this.util
            .postAjax({
              code: this.global.bmCode,
              url: '/irapply/edit',
              isRep: true,
              data: data,
            })
            .then(res => {
              this.$toast.clear();
              if (res.success == true) {
                this.$toast.success('保存成功');
                this.$router.push('/irrgate-manage');
              } else {
                this.$toast.fail('保存失败' + '\n' + res.message);
              }
            })
            .catch(err => {
              this.$toast.clear();
              this.$toast.fail('保存失败' + '\n' + err);
            });
        })
        .catch(() => {
          this.$toast.fail('请填写正确信息');
        });
    },
    // 获取详情
    getDetail() {
      this.util
        .postAjax({
          code: this.global.bmCode,
          url: '/irapply/findById',
          data: {
            id: this.id,
          },
        })
        .then(res => {
          if (res.success) {
            this.detail = res.item.apply || {};
            // 转换资源编号、资源编号id、资源编号多选框
            this.detail.rescodes = res.item.ress.map(i => i.rescode).join(',');
            this.detail.resList = res.item.ress.map(i => {
              return {
                resid: i.id,
              };
            });

            this.irdate = this.detail.irdate;
            this.detail.irdate = this.common.formatTime(this.detail.irdate, 'YYYY.MM.DD');
            this.applyForm = this.detail;
            if (this.operType === 'applyEdit') {
              let obj = this.timeOption.find(t => this.applyForm.daytype == t.value) || this.timeOption[0];
              this.selectTime = obj.text;
              this.selectTimeId = obj.value;
            }
            // 获取灌溉资料编号列表
            this.common
              .getResCodeList(this.applyForm.irrestypeid, this.applyForm.orgid)
              .then(res => {
                this.resids = res;
              });
          } else {
            this.$toast.fail('获取数据失败' + '\n' + res.message);
          }
        })
        .catch(err => {
          // this.$toast.fail("获取数据失败" + "\n" + err);
        });
    },
    // 获取规则(提前天数)
    getDayRule() {
      this.util
        .postAjax({
          code: this.global.bmCode,
          url: '/rules/findByCode',
          data: {
            code: 'IRAPPLYDAY',
          },
        })
        .then(res => {
          if (res.success) {
            this.ruleDay = res.item.rulevalue;
          }
        });
    },
    // 获取规则(截止时间点)
    getTimeRule() {
      this.util
        .postAjax({
          code: this.global.bmCode,
          url: '/rules/findByCode',
          data: {
            code: 'IRAPPLYTIME',
          },
        })
        .then(res => {
          if (res.success) {
            if (res.item.rulevalue) {
              let time = '00000000' + res.item.rulevalue;
              this.ruleTime = this.common.formatTime(time, 'hh:mm');
            }
          }
        });
    },
  },
  created() {
    if (!this.id) {
      // 设置用户信息
      let userInfo = this.$store.state.userInfo;
      this.applyForm.orgname = userInfo.ORGNAME;
      this.applyForm.orgid = userInfo.ORGID;
      this.applyForm.applyername = userInfo.NAME;
    } else {
      // 获取详情
      this.getDetail();
    }
    // 获取灌溉类型列表
    this.common.getResTypeList().then(res => {
      this.resTypes = res.map(i => {
        return {
          text: i.typename,
          value: i.id,
        };
      });
    });
    // 获取规则
    this.getDayRule();
    this.getTimeRule();
  },
};
</script>

<style lang="scss" scoped>
.land-preview {
  color: #00b09b;
  .van-cell__value {
    background: url('../../../../static/imgs/bm-land-bg.png') no-repeat;
    background-size: 106px 28px;
    background-position: 100% 0%;
    color: #ffffff;
    img {
      width: 14px;
      height: 12px;
      margin-right: 5px;
    }
  }
}
</style>
