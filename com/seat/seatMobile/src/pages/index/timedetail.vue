<template>
  <div class="timeDetail_content">
    <div class="timeDetail_top">
      <div class="icons"></div>
      <div class="timeDetail_text">
        <h3>预约成功啦</h3>
        <p>注意已经预约的时间段哦～</p>
      </div>
      <div class="timeDetail_name">
        <h3>
          <p>{{sectionname}}</p>
          <span>
            {{seatname}}号座位
            <i v-if="islocakers==1">有柜子</i>
          </span>
        </h3>
        <p>{{location}}</p>
      </div>
    </div>
    <div class="timeDetails">
      <h3>已预约时间段</h3>
      <div class="detailtimesbox clearfix" v-for="(v,i) in detailtimeArr" :key="i">
        <div class="detailtimes_left">
          <p>周{{v.weekno=='1'?'一':v.weekno=='2'?'二':v.weekno=='3'?'三':v.weekno=='4'?'四':v.weekno=='5'?'五':v.weekno=='6'?'六':'日'}} {{v.weekday}}:</p>
          <span v-if="type==2">(今天)</span>
        </div>
        <div class="detailtimes_right">
          <span
            v-for="(e,j) in v.origin"
            :key="e.id"
          >{{e.starttime.substring(0,2)}}:{{e.starttime.substring(2,4)}}～{{e.endtime.substring(0,2)}}:{{e.endtime.substring(2,4)}}</span>
        </div>
      </div>
    </div>
    <div class="timeDetail_bottom">
      <div @click="back">返回</div>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    sectionname: String,
    location: String,
    seatname: String,
    type: String,
    islocakers: String
  },
  data() {
    return {
      detailtimeArr: []
    };
  },
  methods: {
    back() {
      this.$router.push("/");
    }
  },
  created() {
    this.detailtimeArr = JSON.parse(
      window.sessionStorage.getItem("detailtimeArr")
    );
    // console.log(this.detailtimeArr)
  }
};
</script>
<style scoped>
.timeDetail_content {
  width: 100%;
  height: 100%;
  position: fixed;
  top: 0;
  left: 0;
}
.timeDetail_top {
  width: 100%;
  height: 237px;
  background: url(../../../static/img/detailback.png) no-repeat center center;
  background-size: cover;
  position: relative;
  padding: 24px 30px;
  box-sizing: border-box;
}
.timeDetail_name {
  width: calc(100% - 60px);
  height: 154px;
  background: #fff;
  box-shadow: 0px 2px 10px 0px rgba(238, 238, 238, 0.4);
  border-radius: 24px;
  position: absolute;
  bottom: -67px;
  left: 30px;
  padding: 30px;
  box-sizing: border-box;
}
.timeDetail_name > h3 {
  width: 100%;
  font-size: 32px;
  font-weight: 550;
  color: #333333;
  height: 44px;
  line-height: 44px;
}
.timeDetail_name > h3 > p {
  max-width: 500px;
  float: left;
  display: inline-block;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.timeDetail_name > h3 > span {
  display: inline-block;
  margin-left: 24px;
}
.timeDetail_name > h3 > span > i {
  display: inline-block;
  width: 90px;
  height: 40px;
  font-size: 18px;
  font-weight: 400;
  color: #ffffff;
  background: linear-gradient(135deg, #ffd435 0%, #f76b1c 100%);
  border-radius: 15px;
  /* border: 1px solid #ffa033; */
  text-align: center;
  font-style: normal;
  margin-left: 24px;
}
.timeDetail_name > p {
  width: 100%;
  height: 37px;
  font-size: 26px;
  font-weight: 400;
  color: #333333;
  line-height: 37px;
  margin-top: 13px;
}
.timeDetail_top > .icons {
  width: 70px;
  height: 70px;
  background: url(../../../static/img/detailicon.png) no-repeat center center;
  background-size: cover;
  float: left;
}
.timeDetail_text {
  margin-left: 40px;
  display: inline-block;
}
.timeDetail_text > h3 {
  width: 100%;
  height: 45px;
  font-size: 32px;
  font-weight: 550;
  color: #ffffff;
  line-height: 45px;
}
.timeDetail_text > p {
  width: 100%;
  height: 37px;
  font-size: 26px;
  font-weight: 400;
  color: #ffffff;
  line-height: 37px;
}
.timeDetail_bottom {
  width: 100%;
  height: 132px;
  background: #ffffff;
  position: fixed;
  bottom: 0;
  left: 0;
}
.timeDetail_bottom > div {
  width: calc(100% - 60px);
  height: 84px;
  background: #ffffff;
  border-radius: 44px;
  border: 2px solid #cccccc;
  margin: 24px auto;
  font-size: 30px;
  font-weight: 400;
  color: #333333;
  line-height: 84px;
  text-align: center;
}
.timeDetails {
  width: 100%;
  height: calc(100% - 400px);
  background: #fff;
  margin-top: 94px;
  padding: 30px;
  box-sizing: border-box;
  overflow: auto;
}
.timeDetails > h3 {
  width: 100%;
  height: 42px;
  font-size: 30px;
  font-weight: 550;
  color: #333333;
  line-height: 42px;
}
.detailtimesbox {
  width: 100%;
  margin-top: 24px;
  border-bottom: 1px solid #eee;
  display: flex;
}
.detailtimes_left {
  width: 150px;
  /* height: 2.35rem; */
  /* float: left; */
  font-size: 26px;
  font-weight: 400;
  color: #333333;
  line-height: 36px;
}
.detailtimes_left > span {
  font-size: 20px;
  font-weight: 400;
  color: #ffa033;
  line-height: 28px;
}
.detailtimes_right {
  width: calc(100% - 120px);
  /* float: right; */
}
.detailtimes_right > span {
  display: inline-block;
  width: 250px;
  height: 70px;
  background: #f7f7f7;
  border-radius: 4px;
  font-size: 28px;
  font-weight: 400;
  color: #333333;
  line-height: 70px;
  text-align: center;
  margin-bottom: 24px;
  margin-left: 15px;
}
/* .detailtimes_right > span:nth-of-type(2n) {
  margin-left: 24px;
} */
</style>