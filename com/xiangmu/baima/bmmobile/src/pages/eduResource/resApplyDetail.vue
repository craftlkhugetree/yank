<template>
  <div>
    <van-nav-bar title="详情" :border="false" left-arrow @click-left="goBack" />
    <!-- 步骤条 -->
    <!-- <res-process
      v-show="detail.applystatus !== 0"
      :active="active"
      :data="processData"
      :applyInfoForm="applyInfoForm"
    ></res-process> -->
    <res-process
      :applyInfoForm="applyInfoForm"
      :processData="this.applyInfoForm.useType == '1' ? processData : processData2"
    ></res-process>

    <!-- 申请信息 -->
    <div class="form-box">
      <div class="form-box-title">申请信息</div>
      <div class="form-box-content">
        <van-cell title="资源类型" :value="applyInfoForm.typeName" />
        <van-cell title="资源编号" :value="applyInfoForm.resName" />
        <van-cell title="面积(㎡)" :value="applyInfoForm.areas" />
        <van-cell title="使用时长" :value="common.cycleUnit(applyInfoForm)" />
        <van-cell
          title="课题组经费负责人"
          :border="false"
          :value="applyInfoForm.classfeeLeaderName"
        />
        <van-cell title="联系电话" class="van-cell-phone">
          <span slot="default">
            <van-icon name="phone" />
            {{ applyInfoForm.classfeeLeaderMobile }}
          </span>
        </van-cell>
        <van-cell title="学院名称" :value="applyInfoForm.orgName" />
        <van-cell title="课题组名称" :value="applyInfoForm.classgroupName" class="for-width" />
        <van-cell title="日常联系人" :border="false" :value="applyInfoForm.contacterName" />
        <van-cell title="联系电话" class="van-cell-phone">
          <span slot="default">
            <van-icon name="phone" />
            {{ applyInfoForm.contacterMobile }}
          </span>
        </van-cell>

        <van-cell title="项目名称" :value="applyInfoForm.projectName" />
        <van-cell title="项目来源" :value="applyInfoForm.projectFrom" class="for-width" />
        <van-cell title="项目经费" :value="common.money(applyInfoForm.projectFee, 4) + ' 万元'" />
        <van-cell
          title="项目时间"
          :value="applyInfoForm.projectStarttime + '~' + applyInfoForm.projectEndtime"
        />
        <van-cell title="项目概况" :value="applyInfoForm.projectOverview" class="for-width" />
        <van-cell
          class="for-width"
          title="实验概况"
          :border="false"
          :value="applyInfoForm.experimentOverview || '--'"
        />
        <van-cell
          class="for-width"
          title="预期成果"
          :border="false"
          :value="applyInfoForm.expectedResult || '--'"
        />
      </div>
    </div>
    <!-- 费用(退租时不显示) -->
    <div class="form-box" v-if="applyInfoForm.useType !== '3'">
      <div class="form-box-title">费用</div>
      <!-- <span class="form-box-title-btn" v-if="operType === 'audit'">
        <van-icon name="edit" color="#faac16"></van-icon>编辑
      </span>-->
      <div class="form-box-content" style="padding:10px 0;">
        <el-table :data="tmpData" style="width: 100%">
          <el-table-column prop="eduResourceName" label="资源编号" align="center"></el-table-column>
          <el-table-column prop="eduResourceArea" label="面积" align="center"></el-table-column>
          <!-- :label="`${applyInfoForm.ct1}(${applyInfoForm.ct2})`" -->
          <el-table-column
            prop="eduResourcePrice"
            :label="'单价（元/' + applyInfoForm.chargecycle + '/' + applyInfoForm.ct2 + '）'"
            :formatter="common.moneyFormatter"
            align="center"
          ></el-table-column>
          <el-table-column
            prop="useCycle"
            :label="'时长(' + applyInfoForm.chargecycle + ')'"
            align="center"
          >
            <template>
              {{ applyInfoForm.useCycle }}
            </template>
          </el-table-column>
          <el-table-column
            prop="cost"
            label="费用(元)"
            align="center"
            :formatter="common.moneyFormatter"
          ></el-table-column>
        </el-table>
        <div class="total-cost">
          <van-cell
            title="费用总计"
            :border="false"
            :value="common.money(applyInfoForm.summaryTotal) + ' 元'"
          />
        </div>
      </div>
    </div>

    <!-- 材料文件(退租时不显示) -->
    <div class="form-box" v-if="canCatchFiles">
      <div class="form-box-title">材料文件</div>
      <div class="form-box-content">
        <van-cell class="van-cell-file" v-if="operDev === 'bm' && activeTableTab == 2">
          <div slot="default">
            <img src="../../../static/imgs/bm-file-pdf.png" />
            <div class="file-list-content">
              <h3 class="ellipsis">申请表</h3>
              <span>{{ common.formatTime(applyInfoForm.createTime, 'YYYY.MM.DD hh:mm') }}</span>
            </div>
            <div class="file-list-btns">
              <img
                class="file-view"
                src="../../../static/imgs/bm-file-view.png"
                @click="downFile('applyForm', '2')"
              />
              <img
                class="file-down"
                src="../../../static/imgs/bm-file-down.png"
                @click="downFile('applyForm', '1')"
              />
            </div>
          </div>
        </van-cell>
        <van-cell class="van-cell-file" v-if="operDev == 0">
          <div slot="default">
            <img src="../../../static/imgs/bm-file-pdf.png" />
            <div class="file-list-content">
              <h3 class="ellipsis">租用协议</h3>
              <span>{{ common.formatTime(applyInfoForm.createTime, 'YYYY.MM.DD hh:mm') }}</span>
            </div>
            <div class="file-list-btns">
              <img
                class="file-view"
                src="../../../static/imgs/bm-file-view.png"
                @click="downFile('applyRules', '2')"
              />
              <img
                class="file-down"
                src="../../../static/imgs/bm-file-down.png"
                @click="downFile('applyRules', '1')"
              />
            </div>
          </div>
        </van-cell>

        <van-cell
          class="van-cell-file"
          v-if="operDev == 0 || (operDev === 'bm' && activeTableTab == 2)"
        >
          <div slot="default">
            <img src="../../../static/imgs/bm-file-pdf.png" />
            <div class="file-list-content">
              <h3 class="ellipsis">进驻/退租交接单</h3>
              <span>{{ common.formatTime(applyInfoForm.createTime, 'YYYY.MM.DD hh:mm') }}</span>
            </div>
            <div class="file-list-btns">
              <img
                class="file-view"
                src="../../../static/imgs/bm-file-view.png"
                @click="downFile('handover', '2')"
              />
              <img
                class="file-down"
                src="../../../static/imgs/bm-file-down.png"
                @click="downFile('handover', '1')"
              />
            </div>
          </div>
        </van-cell>
      </div>
    </div>
    <!-- 审批信息 -->
    <div class="form-box">
      <div v-if="auditList.length === 0">
        <div class="form-box-title">审批信息</div>
        <div class="form-box-content">
          <van-cell title="暂无审批信息" />
        </div>
      </div>
      <div v-else>
        <div v-for="item in auditList" :key="item.id">
          <div class="form-box-title" style="width: 150px">
            {{ item.bizNode == 'LD' ? '单位领导审批意见' : '基地审批意见' }}
          </div>
          <div class="form-box-content">
            <van-cell
              :title="item.eventResult == 1 ? '通过该申请' : '驳回该申请'"
              :class="{
                'van-cell-pass': item.eventResult == 1,
                'van-cell-reject': item.eventResult != 1,
              }"
            >
              <van-icon
                slot="right-icon"
                :name="item.eventResult == 1 ? 'checked' : 'clear'"
              ></van-icon>
            </van-cell>
            <van-cell title="审批人" :border="false" style="padding-bottom: 0">
              {{ item.createName }}
            </van-cell>
            <van-cell title="审批意见" :border="false" style="padding-bottom: 0">
              {{ item.eventNote }}
            </van-cell>
            <van-cell title="审批日期">
              {{ item.eventTime }}
            </van-cell>
          </div>
        </div>
      </div>
    </div>
    <!-- 审批意见 -->
    <div class="form-box" v-if="operType === 'audit'" style="margin-bottom: 54px;">
      <div class="form-box-title">审批意见</div>
      <div class="form-box-content">
        <van-field
          style="background:#f8f8f8;"
          v-model="eventnote"
          name="审批意见"
          placeholder="请输入审批意见"
          rows="4"
          autosize
          type="textarea"
          maxlength="100"
          :show-word-limit="true"
          :rules="[{ required: true, message: '请输入审批意见' }]"
        />
      </div>
    </div>
    <div class="form-btns" v-if="operType === 'audit'">
      <van-button type="default" @click="doAudit(0)">不通过</van-button>
      <van-button type="primary" @click="doAudit(1)">通过</van-button>
    </div>
    <div style="width: 100%; height: 50px;"></div>
    <!-- 撤回 -->
    <div
      class="form-btns"
      v-if="
        operDev == 0 &&
          applyInfoForm.status == 1 &&
          (applyInfoForm.useType == 2 ||
            (applyInfoForm.useType == 1 && applyInfoForm.handleNode === 'LD'))
      "
    >
      <van-button type="primary" @click="withDraw" style="width: 100%">撤回</van-button>
    </div>
    <!-- 是否确定撤回 -->
    <van-action-sheet
      v-model="showConfirmCheckOut"
      :actions="[{ name: '确定撤回', color: '#fe3e61' }]"
      @select="confirmCheckOut"
      cancel-text="取消"
    />

    <agreement-form
      style="margin-left: -2000px; width:1000px;  padding: 100px 100px 0"
      v-show="agreement"
      :hasSignature="true"
      :form="applyInfoForm"
      :tableTable="applyInfoForm.resArr || []"
      :today="today"
      :newDate="newDate"
    ></agreement-form>

    <handover-sheet
      style="margin-left: -2000px; width:1000px;  padding: 100px 100px 0"
      v-show="handover"
      :form="applyInfoForm"
      :handover="true"
    ></handover-sheet>

    <apply-table
      style="margin-left: -2000px; width:1000px;  padding: 100px 100px 0"
      v-show="applyTable"
      :form="applyInfoForm"
    ></apply-table>
  </div>
</template>

<script>
import { find, eduApplyFind, eduApplyWithdraw } from '@/assets/js/api';
export default {
  components: {
    ResProcess: () => import('@/components/resProcess'),
    AgreementForm: () => import('@/components/downAgreement.vue'),
    handoverSheet: () => import('@/components/handoverSheet'),
    applyTable: () => import('@/components/applyTable'),
  },
  data() {
    return {
      today: '',
      newDate: '',
      tmpData: [],
      applyTable: false,
      handover: false,
      agreement: false,
      applyInfoForm: {},
      active: 1,
      // processData: [
      //   { id: 1, title: '申请日期', des: '', status: 'success' },
      //   { id: 2, title: '单位领导审批日期', des: '', status: '' },
      //   { id: 3, title: '基地审批日期', des: '', status: '' },
      // ],
      processData: [
        {
          hideLine: true,
          num: 1,
          date: '',
          active: true,
          text: '申请时间',
          status: 'success',
        },
        {
          hideLine: false,
          num: 2,
          date: '',
          active: false,
          text: '单位领导审批',
          status: '',
        },
        {
          hideLine: false,
          num: 3,
          date: '',
          active: false,
          text: '基地审批',
          status: '',
        },
      ],
      processData2: [
        {
          hideLine: true,
          num: 1,
          date: '',
          active: true,
          text: '申请时间',
          status: 'success',
        },
        {
          hideLine: false,
          num: 2,
          date: '',
          active: false,
          text: '基地审批',
          status: '',
        },
        // {hideLine:false,num:3,date:"",active:false,text:"基地审批",status: ""},
      ],
      showConfirmCheckOut: false,
      attment: {},
      auditList: [],
      eventnote: '',
      showDialog: false,
      filePreviewUrl: '',
    };
  },
  props: {
    id: String,
    operDev: String, // 审批单位：单位领导leader、基地bm
    operType: String, // 操作类型：审批audit
    activeTableTab: String, // 已审批2、待审批1
  },
  computed: {
    canCatchFiles() {
      return (
        this.applyInfoForm.useType != '3' &&
        (this.operDev == 0 || (this.operDev === 'bm' && this.activeTableTab == 2))
      );
    },
  },
  methods: {
    withDraw() {
      this.showConfirmCheckOut = true;
    },
    // 撤回
    confirmCheckOut() {
      this.$toast.loading({
        message: '提交中...',
        forbidClick: true,
        duration: 0,
      });
      eduApplyWithdraw({ eduApplyId: this.id })
        .then(res => {
          if (res && res.success === true) {
            this.$toast.success('已提交撤回');
            this.showConfirmCheckOut = false;
            this.goBack();
          } else {
            this.$toast.fail({ message: res.message || '内部错误', duration: 3000 });
          }
          this.$toast.clear();
        })
        .catch(err => {
          this.$toast.clear();
          this.$toast.fail(err || '内部错误');
        });
    },
    // 返回
    goBack() {
      this.$router.go(-1);
    },

    // 预览下载文件
    downFile(filetype, type) {
      // filetype 申请表applyForm  协议applyRules ,  type 1下载 2预览
      if (type === '2') {
        this.$router.push({
          path: `/edures/file-view/${this.id}`,
          query: {
            filetype: filetype,
            form: JSON.stringify(this.applyInfoForm),
          },
        });
      } else if (type === '1') {
        // let url = `${window.g.bm}/spapply/${filetype}?id=${this.id}&type=1`;
        // window.open(url, '_blank');
        this.$toast.loading({
          message: '下载中...',
          forbidClick: true,
          duration: 0,
        });
        if (filetype === 'applyRules') {
          this.calDay();
          this.agreement = true;
          // this.$nextTick(() =>
          //   this.common.transToPdf(this.applyInfoForm.projectName + '协议', 'agreement', this)
          // );
          this.common.outPutPdfFn(
            this,
            'agreement',
            'item-order',
            this.applyInfoForm.projectName + '协议'
          );
        } else if (filetype === 'handover') {
          this.handover = true;
          this.$nextTick(() =>
            this.common.transToPdf(this.applyInfoForm.projectName + '交接单', 'handover', this)
          );
        } else {
          this.applyTable = true;
          // this.$nextTick(() =>
          //   this.common.transToPdf(this.applyInfoForm.projectName + '申请表', 'applyTable', this)
          // );
          this.common.outPutPdfFn(
            this,
            'applyTable',
            'normal-table',
            this.applyInfoForm.projectName + '申请表'
          );
        }
      }
    },
    // 计算日期
    calDay() {
      const r = this.applyInfoForm;
      if (!r.chargecycle) {
        return;
      }
      let interval = r.chargecycle;
      let newDate;
      let now = r.rentStartTime
        ? new Date(this.util.formatTime(r.rentStartTime, 'yyyy-MM-dd'))
        : new Date();
      this.today = this.util.formatTime(now.getTime(), 'yyyy年MM月dd日');
      newDate = this.common.DateAdd(interval, r.useCycle, now).getTime();
      this.newDate = this.util.formatTime(newDate, 'yyyy年MM月dd日');
    },
    //获取类型详情
    getTypeInfo() {
      find(this.applyInfoForm.eduTypeId).then(res => {
        if (res && res.success) {
          this.applyInfoForm.rules = res.data.rules;
        }
      });
    },
    // 获取详情
    getDetail() {
      this.loading = true;
      eduApplyFind(this.id)
        .then(res => {
          if (res && res.success == true) {
            this.applyInfoForm = res.data || {};
            const r = this.applyInfoForm;
            this.getTypeInfo();
            this.applyInfoForm.typeName = r.eduTypeName;
            this.applyInfoForm.billingCycle = r.billingCycle;
            this.applyInfoForm.billingMethod = r.billingMethod;

            let chargecycle = r.billingCycle + '';
            let chargetype = r.billingMethod + '';
            this.common.chargecycleFormatter(chargecycle, r);
            this.common.chargetypeFormatter2(chargetype, r, 'ct2', 'ct1');

            const tmp = res.data.resources;
            if (tmp && tmp.length) {
              // 合成resName和areas
              this.applyInfoForm.resName = tmp.map(t => t.eduResourceName).join(',');
              this.applyInfoForm.areas = tmp.map(t => t.eduResourceArea).join(',');
              const arrTmp = tmp.map(t => ({
                ...t,
                useCycle: r.useCycle,
                cost: this.common.moneyFormatter(
                  '',
                  '',
                  r.billingMethod == 1
                    ? t.eduResourcePrice * r.useCycle * t.eduResourceArea
                    : t.eduResourcePrice * r.useCycle
                ),
              }));
              // 总消费、行合计需要灵活合并单元格
              let cost = arrTmp.reduce((pre, item) => {
                return pre + parseFloat(item.cost);
              }, 0);
              let summary = {};
              for (let p in tmp[0]) {
                summary[p] = '';
              }
              summary.eduResourceName = '合计';
              summary.cost = cost;
              arrTmp.push(summary);
              this.applyInfoForm.resArr = arrTmp;
              this.applyInfoForm.summaryTotal = summary.cost;
              this.tmpData = this.applyInfoForm.resArr.slice(
                0,
                this.applyInfoForm.resArr.length - 1
              );
            }

            //审核列表转换
            let events = (res.data.events && JSON.parse(JSON.stringify(res.data.events))) || [];
            events.forEach(v => {
              v.eventTime = this.util.formatTime(v.createTime, 'yyyy.MM.dd');
              // 审批
              if (v.eventType == '2') {
                this.auditList.push(v);
              }
              // 提交
              else if (v.eventType == '1') {
                this.applyInfoForm.eventnote = v.eventNote;
                this.applyInfoForm.eventername = v.createName;
              }

              // status (integer, optional): 申请单状态：1审核2已完成8驳回9撤回 ,
              // useType (integer, optional): 申请类型1入住2续租3退租
              // eventResult (string, optional): 处理结果0不通过1通过 ,
              // eventType (integer, optional): 1提交2审批3撤回 ,

              //进程时间
              if (this.applyInfoForm.useType == '1') {
                switch (v.eventType + '') {
                  case '1':
                    this.processData[0].date = v.eventTime;
                    break;
                  case '2':
                    if (v.bizNode === 'LD') {
                      this.processData[1].date = v.eventTime;
                      this.processData[1].text = '单位领导审批';
                      this.processData[1].active = true;
                      this.processData[1].status = v.eventResult == 1 ? 'success' : 'fail';
                    } else if (v.bizNode === 'BM') {
                      this.processData[2].date = v.eventTime;
                      this.processData[2].text = '基地审批';
                      this.processData[2].active = true;
                      this.processData[2].status = v.eventResult == 1 ? 'success' : 'fail';
                    }
                    break;
                }
              } else {
                switch (v.eventType + '') {
                  case '1':
                    this.processData2[0].date = v.eventTime;
                    break;
                  case '2':
                    this.processData2[1].date = v.eventTime;
                    this.processData2[1].text = '基地审批';
                    this.processData2[1].active = true;
                    this.processData2[1].status = v.eventResult == 1 ? 'success' : 'fail';
                    break;
                }
              }
            });
          }
          this.loading = false;
        })
        .catch(e => {
          this.loading = false;
        });
    },

    // 审批
    doAudit(type) {
      if (!this.eventnote) {
        this.$toast.fail('请输入审批意见');
        return;
      }
      this.$toast.loading({
        message: '审批中...',
        forbidClick: true,
        duration: 0,
      });
      const EduApplyEvent = {
        bizNode: this.operDev === 'leader' ? 'LD' : 'BM', // (string, optional): 处理节点LD，BM ,
        eduApplyId: this.applyInfoForm.id, // (integer, optional): 科教资源申请单id ,
        eventNote: this.eventnote, // (string, optional): 事件备注 ,
        eventResult: type, // (string, optional): 处理结果0不通过1通过 ,
        eventType: 2, // (integer, optional): 1提交2审批 ,
      };
      let url = this.operDev === 'leader' ? '/eduApply/approveLD' : '/eduApply/approveBM';
      this.util
        .postAjax({
          code: this.global.bmCode,
          url,
          isRep: true,
          data: EduApplyEvent,
        })
        .then(res => {
          this.$toast.clear();
          if (res && res.success) {
            this.$toast.success('审批成功');
            this.goBack();
          } else {
            this.$toast.fail('审批失败' + '\n' + res.message);
          }
        })
        .catch(err => {
          this.$toast.clear();
          this.$toast.fail('审批失败' + '\n' + err);
        });
    },
  },
  created() {
    this.getDetail();
  },
};
</script>

<style lang="scss" scoped>
.total-cost {
  margin: 15px;
  .van-cell {
    background: #e3f9f5;
    border-radius: 5px;
    padding: 10px 20px;
    .van-cell__title,
    .van-cell__value {
      color: #00b09b;
      font-weight: bold;
    }
  }
}
.for-width {
  /deep/ .van-cell__value {
    flex: 3;
  }
}
</style>
