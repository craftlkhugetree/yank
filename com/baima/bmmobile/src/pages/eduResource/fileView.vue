<template>
  <div style="background:#fff;">
    <van-nav-bar ref="navBar" title="文件预览" :border="false" left-arrow @click-left="goBack" />
    <div class="file-content">
      <!-- <h3>{{ title }}</h3> -->
      <!-- pdf预览 -->
      <!-- <pdf :src="filePreviewUrl"></pdf> -->
      <!-- <div id="demo"></div> -->
      <agreement-form
        v-if="filetype === 'applyRules'"
        :hasSignature="true"
        :isMobile="!agreement"
        :form="form"
        :tableTable="tableData"
        :today="today"
        :newDate="newDate"
      ></agreement-form>
      <agreement
        :style="
          agreement ? { width: '1000px', padding: '100px 100px 0', 'margin-left': '-2000px' } : ''
        "
        v-show="filetype === 'applyRules' && agreement"
        :hasSignature="true"
        :form="form"
        :tableTable="tableData"
        :today="today"
        :newDate="newDate"
      ></agreement>
      <handover-sheet
        :style="handover ? { width: '1000px', padding: '100px 100px 0' } : ''"
        :handover="handover"
        v-if="filetype === 'handover'"
        :form="form"
      ></handover-sheet>

      <apply-table
        :style="applyTable ? { width: '1000px', padding: '100px 100px 0' } : ''"
        v-if="filetype === 'applyForm'"
        :form="form"
      ></apply-table>
    </div>
    <div style="width: 100%; height: 50px;"></div>
    <div class="form-btns">
      <van-button type="default" @click="goBack">返回</van-button>
      <van-button type="primary" @click="downFile">下载</van-button>
    </div>
  </div>
</template>

<script>
// import pdf from "vue-pdf";
// import Pdfh5 from 'pdfh5';
export default {
  components: {
    // pdf,
    // Pdfh5,
    AgreementForm: () => import('./resApply/agreementForm.vue'),
    Agreement: () => import('@/components/downAgreement.vue'),
    handoverSheet: () => import('@/components/handoverSheet'),
    applyTable: () => import('@/components/applyTable'),
  },
  data() {
    return {
      pdf: '',
      title: '',
      filePreviewUrl: '',
      form: {},
      tableData: [],
      today: '',
      newDate: '',
      agreement: false,
      handover: false,
      applyTable: false,
    };
  },
  props: {
    resid: String,
    filetype: String, // 申请表applyForm   租用协议applyRules
  },
  methods: {
    // 返回
    goBack() {
      this.$router.go(-1);
    },
    // 下载
    downFile() {
      // let url = `${window.g.bm}/spapply/${this.filetype}?id=${this.resid}&type=1`;
      // window.open(url, '_blank');
      this.$toast.loading({
        message: '下载中...',
        forbidClick: true,
        duration: 0,
      });
      if (this.filetype === 'applyRules') {
        this.agreement = true;
        // this.$nextTick(() =>
        //   this.common.transToPdf(this.form.projectName + '协议', 'agreement', this)
        // );
        this.common.outPutPdfFn(this, 'agreement', 'item-order', this.form.projectName + '协议');
      } else if (this.filetype === 'handover') {
        this.handover = true;
        this.$nextTick(() =>
          this.common.transToPdf(this.form.projectName + '交接单', 'handover', this)
        );
      } else {
        this.applyTable = true;
        // this.$nextTick(() =>
        //   this.common.transToPdf(this.form.projectName + '申请表', 'applyTable', this)
        // );
        this.common.outPutPdfFn(
          this,
          'applyTable',
          'normal-table',
          this.form.projectName + '申请表'
        );
      }
    },
    calDay() {
      const r = this.form;
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
  },
  created() {
    this.$nextTick(() => {
      // let url = `${window.g.bm}/spapply/${this.filetype}?id=${this.resid}&type=2`;
      // this.filePreviewUrl = pdf.createLoadingTask(url);
      // this.pdf = new Pdfh5('#demo', {
      //   pdfurl: url,
      // });
      this.title =
        this.filetype === 'applyForm'
          ? '申请表'
          : this.filetype === 'applyRules'
          ? '租用协议'
          : '交接单';
      if (this.$route.query.form) {
        this.form = JSON.parse(this.$route.query.form);
        this.tableData = this.form.resArr;
      }
      this.calDay();
    });
  },
};
</script>

<style lang="scss">
@import 'pdfh5/css/pdfh5.css';
.file-content {
  width: 100%;
  padding: 0 20px;
  background: #ffffff;
  min-height: 100vh;
  // text-align: center;
  h3 {
    font-size: 14px;
    font-weight: bold;
    margin-bottom: 20px;
  }
  img {
    max-width: 100%;
  }
}
</style>