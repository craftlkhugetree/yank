<template>
  <div class="count-box">
    <div class="count-box-title">
      <span>{{ title }}</span>
    </div>
    <div class="count-box-content clearfix">
      <div class="num-box">
        <label>预约次数</label>
        <el-tooltip class="item" effect="light" :content="yycs" placement="right">
          <img :src="questionImg" />
        </el-tooltip>
        <countTo
          class="counttospan"
          :startVal="0"
          :endVal="totalData.yycs"
          :duration="1000"
        ></countTo>
      </div>
      <div class="num-box no-border">
        <label>实际使用次数</label>
        <el-tooltip class="item" effect="light" :content="sjsycs" placement="right">
          <img :src="questionImg" />
        </el-tooltip>
        <countTo
          class="counttospan"
          :startVal="0"
          :endVal="totalData.sjsycs"
          :duration="1000"
        ></countTo>
      </div>
      <div class="num-box">
        <label>预约时长(天)</label>
        <el-tooltip class="item" effect="light" :content="yysc" placement="right">
          <img :src="questionImg" />
        </el-tooltip>
        <countTo
          class="counttospan"
          :startVal="0"
          :endVal="totalData.yysc"
          :duration="1000"
        ></countTo>
      </div>
      <div class="num-box no-border">
        <label>实际使用时长(天)</label>
        <el-tooltip class="item" effect="light" :content="sjsysc" placement="right">
          <img :src="questionImg" />
        </el-tooltip>
        <countTo
          class="counttospan"
          :startVal="0"
          :endVal="totalData.sjsysc"
          :duration="1000"
        ></countTo>
      </div>
      <div class="num-box">
        <label>服务人数</label>
        <el-tooltip class="item" effect="light" :content="fwrs" placement="right">
          <img :src="questionImg" />
        </el-tooltip>
        <countTo
          class="counttospan"
          :startVal="0"
          :endVal="totalData.fwrszj"
          :duration="1000"
        ></countTo>
      </div>
    </div>
  </div>
</template>
<script>
import countTo from 'vue-count-to';
import questionImg from '@/assets/img/question.png';
export default {
  name: 'StaCount',
  props: {
    totalData: Object,
    title: String,
  },
  components: {
    countTo,
  },
  data() {
    return {
      questionImg,
      yycs: '预约过的次数，包含已签到、未签到、已取消',
      sjsycs: '预约过且未取消的次数',
      yysc: '预约过的时间段时长累加',
      sjsysc: '预约过且未取消的时间段时长累加',
      fwrs: '预约人数和邀请添加人数合计',
    };
  },
};
</script>
<style lang="scss" scoped>

</style>
