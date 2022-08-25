<template>
  <div style="max-height: 1000px; overflow-y: auto">
    <van-nav-bar title="详情" :border="false" left-arrow @click-left="goBack" />
    <!-- 撤回 -->
    <div class="recall" v-if="isReCall">该申请已被撤回</div>
    <!-- 步骤条 -->
    <basic-process
      v-show="detail.applystatus !== 0 && !isBatch"
      :active="active"
      :data="processData"
    ></basic-process>
    <!-- 申请信息 -->
    <div class="form-box" v-if="!isBatch">
      <div class="form-box-title">基本信息</div>
      <div class="form-box-content">
        <van-cell title="学院名称" :value="detail.orgname" />
        <van-cell title="项目名称" :value="detail.projectname" />
        <van-cell title="课题组负责人" :border="false" :value="detail.classleadername" />
        <van-cell title="联系电话" class="van-cell-phone">
          <span slot="default">
            <van-icon name="phone" />
            {{ detail.classleadermobile }}
          </span>
        </van-cell>
        <van-cell title="申请人" :border="false" :value="detail.applyername" />
        <van-cell title="联系电话" class="van-cell-phone">
          <span slot="default">
            <van-icon name="phone" />
            {{ detail.applyermobile }}
          </span>
        </van-cell>
        <van-cell title="田间值守人" :border="false" :value="detail.worker" />
        <van-cell title="联系电话" class="van-cell-phone">
          <span slot="default">
            <van-icon name="phone" />
            {{ detail.workermobile }}
          </span>
        </van-cell>
        <van-cell title="灌溉类型" :value="detail.typename" />
        <van-cell title="资源编号" :value="detail.rescodes" />
        <van-cell title="灌溉日期" :value="detail.irdate + ' ' + timeRange" />
        <van-cell title="备注信息" :value="detail.note || '--'" />
      </div>
    </div>

    <van-collapse v-model="activeName" accordion v-if="isBatch" style="max-height: 600px; overflow-y: auto">
      <van-collapse-item
        :name="index"
        v-for="(detail, index) in checkedList"
        :key="detail.id"
        class="form-box"
      >
        <template #title>
          <div class="form-box-title">基本信息</div>
        </template>
        <div class="form-box-content">
          <van-cell title="学院名称" :value="detail.orgname" />
          <van-cell title="项目名称" :value="detail.projectname" />
          <van-cell title="课题组负责人" :border="false" :value="detail.classleadername" />
          <van-cell title="联系电话" class="van-cell-phone">
            <span slot="default">
              <van-icon name="phone" />
              {{ detail.classleadermobile }}
            </span>
          </van-cell>
          <van-cell title="申请人" :border="false" :value="detail.applyername" />
          <van-cell title="联系电话" class="van-cell-phone">
            <span slot="default">
              <van-icon name="phone" />
              {{ detail.applyermobile }}
            </span>
          </van-cell>
          <van-cell title="田间值守人" :border="false" :value="detail.worker" />
          <van-cell title="联系电话" class="van-cell-phone">
            <span slot="default">
              <van-icon name="phone" />
              {{ detail.workermobile }}
            </span>
          </van-cell>
          <van-cell title="灌溉类型" :value="detail.typename" />
          <van-cell title="资源编号" :value="detail.rescodes" />
          <van-cell title="灌溉日期" :value="detail.irdate" />
          <van-cell title="备注信息" :value="detail.note || '--'" />
        </div>
      </van-collapse-item>
    </van-collapse>

    <!-- 审批信息 -->
    <div class="form-box" v-if="operType !== 'audit'">
      <div class="form-box-title">审批信息</div>
      <div class="form-box-content" v-show="auditList.length === 0">
        <van-cell title="暂无审批信息" />
      </div>
      <div class="form-box-content" v-for="item in auditList" :key="item.id">
        <van-cell
          :title="
            item.eventresult === 1
              ? item.eventtype === '4'
                ? '通过该申请'
                : '接收该申请'
              : '驳回该申请'
          "
          :class="{
            'van-cell-pass': item.eventresult === 1,
            'van-cell-reject': item.eventresult !== 1,
          }"
        >
          <van-icon
            slot="right-icon"
            :name="item.eventresult === 1 ? 'checked' : 'clear'"
          ></van-icon>
        </van-cell>
        <van-cell
          :title="item.eventtype === '4' ? '审批人' : '接收人'"
          :border="false"
          style="padding-bottom: 0"
        >
          {{ item.eventername }}
        </van-cell>
        <van-cell
          v-if="item.eventtype === '4'"
          title="审批意见"
          :border="false"
          style="padding-bottom: 0"
        >
          {{ item.eventnote }}
        </van-cell>
        <van-cell :title="item.eventtype === '4' ? '审批日期' : '接收日期'">
          {{ common.formatTime(item.eventtime, 'YYYY.MM.DD') }}
        </van-cell>
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
  </div>
</template>

<script>
import BasicProcess from '../../components/BasicProcess';
export default {
  components: {
    BasicProcess,
  },
  computed: {
    timeRange() {
      const timeOption = [
          { text: "全天", value: 1 },
          { text: "上午", value: 2 },
          { text: "下午", value: 3 },
      ];
      let obj = timeOption.find(t => t.value == this.detail.daytype) || {}
      return obj.text || ''
    }
  },
  data() {
    return {
      activeName: -1,
      checkedList: [],
      isBatch: this.$route.params.id === 'batch',
      active: 1,
      processData: [
        { id: 1, title: '申请日期', des: '', status: 'success' },
        { id: 2, title: '审批日期', des: '', status: '' },
        { id: 3, title: '接收日期', des: '', status: '' },
      ],
      detail: {},
      auditList: [],
      eventnote: '',
      isReCall: false, // 是否撤回
    };
  },
  props: {
    id: String,
    operType: String,
  },
  methods: {
    // 返回
    goBack() {
      this.$router.go(-1);
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
            this.detail.rescodes = res.item.ress.map(i => i.rescode).join(',');
            this.detail.irdate = this.common.formatTime(this.detail.irdate, 'YYYY.MM.DD');

            // 审批列表转换
            this.auditList = res.item.events.filter(i => ['3', '4', '5'].includes(i.eventtype));

            //进程日期
            let process = res.item.events.filter(i => ['1', '4', '5'].includes(i.eventtype));
            process.forEach(i => {
              let eventtime = this.common.formatTime(i.eventtime, 'YYYY.MM.DD');
              switch (i.eventtype) {
                case '1':
                  this.processData[0].des = eventtime;
                  break;
                case '4':
                  this.processData[1].des = eventtime;
                  this.processData[1].status = i.eventresult === 1 ? 'success' : 'fail';
                  break;
                case '5':
                  this.processData[2].des = eventtime;
                  this.processData[2].status = i.eventresult === 1 ? 'success' : 'fail';
                  break;
              }
            });
            // 是否撤回
            this.isReCall = res.item.events.some(i => i.eventtype === '2');
          } else {
            this.$toast.fail('获取数据失败' + '\n' + res.message);
          }
        })
        .catch(err => {
          // this.$toast.fail("获取数据失败" + '\n' + err);
        });
    },
    // 审批
    doAudit(type) {
      let url = this.isBatch ? '/irapply/saveEventBatch' : '/irapply/saveEvent';
      let params = {
        eventnote: this.eventnote,
        eventresult: type,
        eventtype: 4,
        applyid: this.id,
      };
      if (!this.eventnote) {
        this.$toast.fail('请输入审批意见');
        return;
      }
      if (this.isBatch) {
        params = [];
        this.checkedList.forEach(c => {
          let obj = {
            eventnote: this.eventnote,
            eventresult: type,
            eventtype: 4,
            applyid: c.id
          };
          params.push(obj)
        })
      }
      this.$toast.loading({
        message: '审批中...',
        forbidClick: true,
        duration: 0,
      });
      this.util
        .postAjax({
          code: this.global.bmCode,
          url,
          isRep: true,
          data: params,
        })
        .then(res => {
          this.$toast.clear();
          if (res.success) {
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
    transformArr() {
      this.checkedList = JSON.parse(this.$route.query.data);
      this.checkedList.forEach(c => {
        c.irdate = this.common.formatTime(c.irdate, 'YYYY.MM.DD');
      });
    },
  },
  created() {
    if (this.isBatch) {
      this.transformArr();
    } else {
      this.getDetail();
    }
  },
};
</script>

<style lang="scss" scoped>
.recall {
  background: #ffeaed;
  padding: 10px 20px;
  color: #fe3e61;
  font-size: 14px;
  text-align: center;
}

/deep/ .form-box > .van-cell {
  padding-left: 0;
  padding-top: 0;
  padding-bottom: 0;
}
.form-box-title {
  max-height: 34px;
  line-height: 14px;
  }
</style>
