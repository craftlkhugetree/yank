<template>
  <el-timeline>
    <el-timeline-item
      v-for="(item, index) in list"
      :key="item.id"
      :color="index === 0 ? color : '#DBDBDB'"
      :timestamp="common.eventFormat(item.type,item.handletype,item.result)"
      placement="top"
      :class="{'active':index === 0}"
    >
      <div class="process-box">
        <span class="time">{{common.timeFormat(item.createtime)}}</span>
        <!-- 全部报修不显示评价处理人 -->
        <span
          class="time"
          v-if="item.creatername && !(item.type == '6' && operType == 'view')"
        >处理人：{{item.creatername}} ({{item.createrid}})</span>
        <div class="result" v-if="item.type === '6' && item.result == '1'">
          <label>维修结果：</label>
          <img
            :src="item.result === '1' ? '@/../static/images/yixiufu.png' : '@/../static/images/weixiufu.png'"
            alt
          />
          <span>{{item.result == '1' ? '已完结' : '未修复'}}</span>
          <div class="score">
            <label>维修评价：</label>
            <el-rate v-model="detail.markscore" disabled :colors="['#FD7D18','#FD7D18','#FD7D18']"></el-rate>
          </div>
        </div>
        <p v-if="['1', '4'].includes(item.handletype)">
          {{item.creatername}}派单给
          <strong>【{{item.repairername}}】</strong>，在
          <strong>【{{common.timeFormat(item.starttime,"YYYY-MM-DD")}}】</strong>上门维修
        </p>
        <p>
          <strong>{{item.handletype === '3' ? '【暂不维修】' : ''}}</strong>
          {{item.note}}
        </p>
        <div class="images" v-if="item.photos">
          <el-image
            v-for="img in item.photoList"
            :key="img"
            :src="img"
            :preview-src-list="item.photoList"
          ></el-image>
        </div>
      </div>
    </el-timeline-item>
  </el-timeline>
</template>

<script>
export default {
  props: {
    list: Array,
    operType: String,
    detail: Object,
    color: String
  }
};
</script>

<style lang="scss" scoped>
.process-box {
  padding: 5px 0 0;
  color: #999999;
  .time {
    margin-right: 20px;
    font-size: 12px;
  }
  p {
    margin: 10px 0;
    font-size: 14px;
    line-height: 20px;
    color: #999999;
  }
  .images {
    margin-bottom: 10px;
    .el-image {
      width: 80px;
      height: 80px;
      margin-right: 10px;
    }
  }
  .result {
    margin: 10px 0;
    font-size: 14px;
    line-height: 30px;
    label {
      margin-right: 5px;
    }
    img {
      width: 24px;
      height: 24px;
      margin-right: 5px;
      vertical-align: middle;
    }
    .score {
      float: right;
      .el-rate {
        float: right;
      }
    }
  }
}
.el-timeline-item.active {
  .process-box {
    color: #666666;
    p {
      color: #666666;
    }
  }
}
</style>