<template>
  <div class="showtimewrapper" @click.stop>
    <div class="cancel_time">
      <div class="cancel_time_top">
        <h3>
          选择时间段
          <span @click="selectAlls(appoint||cancelAppoint?'appoint':'')">
            <i :class="{'selected':isAlls}"></i> 全选
          </span>
        </h3>
        <van-tabs v-if="!appoint && !cancelAppoint">
          <van-tab title="标签 ">
            <template #title>
              <h4>今天</h4>
              <p>{{nowMonthDay}}</p>
            </template>
          </van-tab>
        </van-tabs>
        <van-tabs v-else @click="tabchange">
          <van-tab title="标签 " v-for="(v,i) in canCancleTime" :key="i">
            <template #title>
              <h4>周{{v.weekno=='1'?'一':v.weekno=='2'?'二':v.weekno=='3'?'三':v.weekno=='4'?'四':v.weekno=='5'?'五':v.weekno=='6'?'六':'日'}}</h4>
              <p>{{v.weekday}}</p>
            </template>
          </van-tab>
        </van-tabs>
      </div>
      <ul class="timeDetail clearfix" id="timeDetail" v-if="!appoint && !cancelAppoint">
        <li @click="selectAll('')" :class="{'selected':isAll}">全选</li>
        <li
          v-for="(v,i) in canCancleTime"
          :key="i"
          @click="selectSingle(v)"
          :class="{'selected':v.selected}"
        >{{v.starttime.substring(0,2)}}:{{v.starttime.substring(2,4)}}～{{v.endtime.substring(0,2)}}:{{v.endtime.substring(2,4)}}</li>
      </ul>
      <ul class="timeDetail clearfix" id="timeDetail" v-else>
        <li @click="selectAll('appoint')" :class="{'selected':isAll}">全选</li>
        <li
          v-for="(v,i) in timeLis"
          :key="i"
          @click="selectSingle(v,'appoint')"
          :class="{'selected':v.selected}"
        >{{v.starttime.substring(0,2)}}:{{v.starttime.substring(2,4)}}～{{v.endtime.substring(0,2)}}:{{v.endtime.substring(2,4)}}</li>
      </ul>
      <div class="bottom clearfix" v-if="(!appoint && !isDetail)||cancelAppoint">
        <div @click="goback">返 回</div>
        <div v-if="!canCancel">确认取消</div>
        <div v-else class="bottom11" @click="cancelOrder">确认取消</div>
      </div>
      <div class="bottom1 clearfix" v-if="appoint">
        <div @click="goAppoint">确 定</div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    appoint: Boolean,
    currentcancelTime: Array,
    isDetail: Boolean,
    appointTime: Array,
    cancelAppoint: Boolean
  },
  data() {
    return {
      nowMonthDay: "",
      canCancleTime: "",
      isAll: false,
      isAlls: false,
      canCancel: false, //是不是可以取消
      tabindex: 0,
      timeLis: [] //预约tab切换的时间数组
    };
  },
  methods: {
    goback() {
      this.$emit("closetimeselect");
    },
    goAppoint() {
      this.canCancleTime.forEach(e => {
        e.times = [];
        e.num = 0;
        e.origin.forEach(ee => {
          if (ee.selected) {
            e.times[e.num++] = ee;
          }
        });
      });
      //查找符合条件值并存入新数组
      console.log(this.canCancleTime);
      this.$emit("AppointResult", this.canCancleTime);
    },
    getnowMonthDay() {
      var myDate = new Date();
      var month = myDate.getMonth() + 1;
      if (month >= 1 && month <= 9) {
        //月
        month = "0" + month;
      }
      var strDate = myDate.getDate();
      if (strDate >= 0 && strDate <= 9) {
        //日
        strDate = "0" + strDate;
      }
      return "" + month + "月" + strDate + "日";
    },
    selectAlls(type) {
      // console.log(type)
      if (!type) {
        //占座
        this.isAll = !this.isAll;
        this.isAlls = !this.isAlls;
        this.canCancleTime.forEach(e => {
          if (this.isAll) {
            e.selected = true;
            this.canCancel = true;
          } else {
            e.selected = false;
            this.canCancel = false;
          }
        });
      } else {
        //预约
        this.isAll = !this.isAll;
        this.isAlls = !this.isAlls;
        this.currentcancelTime.forEach(e => {
          e.origin.forEach(ee => {
            if (this.isAlls) {
              ee.selected = true;
              this.canCancel = true;
            } else {
              ee.selected = false;
              this.canCancel = false;
            }
          });
        });
      }
    },
    selectAll(type) {
      if (!type) {
        this.isAll = !this.isAll;
        this.canCancleTime.forEach(e => {
          if (this.isAll) {
            e.selected = true;
            this.canCancel = true;
            this.isAlls = true;
          } else {
            e.selected = false;
            this.canCancel = false;
            this.isAlls = false;
          }
        });
      } else {
        this.isAll = !this.isAll;
        this.timeLis.forEach(e => {
          if (this.isAll) {
            e.selected = true;
            this.canCancel = true;
          } else {
            e.selected = false;
            this.canCancel = false;
          }
        });
        var num = 0;
        this.canCancleTime.forEach(e => {
          e.origin.forEach(ee => {
            if (!ee.selected) {
              num++;
            }
          });
        });
        if (num == 0) {
          this.isAlls = true;
        } else {
          this.isAlls = false;
        }
      }
    },
    selectSingle(item, type) {
      if (!type) {
        var num = 0;
        item.selected = !item.selected;
        var index = this.canCancleTime.findIndex(item => !item.selected);
        if (index == -1) {
          //表示全选
          this.isAll = true;
          this.isAlls = true;
          this.canCancel = true;
          num = this.canCancleTime.length;
        } else {
          this.isAll = false;
          this.isAlls = false;
          this.canCancleTime.forEach(e => {
            if (e.selected) {
              num++;
            }
          });
          if (num > 0) {
            this.canCancel = true;
          } else {
            this.canCancel = false;
          }
        }
        this.$forceUpdate();
      } else {
        //预约
        var num = 0,
          numAll = 0;
        item.selected = !item.selected;
        var index = this.timeLis.findIndex(item => !item.selected);
        if (index == -1) {
          //表示全选
          this.isAll = true;
          this.canCancel = true;
          num = this.timeLis.length;
        } else {
          this.isAll = false;
          this.timeLis.forEach(e => {
            if (e.selected) {
              num++;
            }
          });
          if (num > 0) {
            this.canCancel = true;
          } else {
            this.canCancel = false;
          }
        }
        this.canCancleTime.forEach(e => {
          e.origin.forEach(ee => {
            if (!ee.selected) {
              numAll++;
            }
          });
        });
        if (numAll == 0) {
          this.isAlls = true;
        } else {
          this.isAlls = false;
        }
        this.$forceUpdate();
      }
    },
    cancelOrder() {
      var ids = "";
      if (!this.cancelAppoint) {
        this.canCancleTime.forEach(e => {
          if (e.selected) {
            ids += e.id + ",";
          }
        });
        ids = ids.slice(0, ids.length - 1);
      } else {
        this.canCancleTime.forEach(e => {
          e.origin.forEach(ee => {
            if (ee.selected) {
              ids += ee.id + ",";
            }
          });
        });
        ids = ids.slice(0, ids.length - 1);
      }
      this.Dialog.confirm({
        message: "确认取消？"
      }).then(() => {
        this.util
          .postAjax({
            code: this.code.base,
            url: this.code.ordercancel,
            data: {
              ids: ids
            }
            // isRep:true
          })
          .then(res => {
            if (res.success) {
              this.$emit("closetimeselect");
            } else {
              this.Toast(res.data.message);
            }
          });
      });
    },
    tabchange(name, title) {
      this.timeLis = this.canCancleTime[name].origin;
      var num = 0;
      var index = this.timeLis.findIndex(item => !item.selected);
      if (index == -1) {
        //表示全选
        this.isAll = true;
        this.canCancel = true;
        num = this.timeLis.length;
      } else {
        this.isAll = false;
        this.timeLis.forEach(e => {
          if (e.selected) {
            num++;
          }
        });
        if (num > 0) {
          this.canCancel = true;
        } else {
          this.canCancel = false;
        }
      }
    }
  },
  created() {
    console.log("appp", this.appoint);
    console.log("cancelAppoint", this.cancelAppoint);
    if (!this.appoint) {
      this.nowMonthDay = this.getnowMonthDay();
    }
    if (this.appoint || this.cancelAppoint) {
      this.timeLis = this.appointTime;
      var index = this.timeLis.findIndex(item => !item.selected);
      if (index == -1) {
        //表示全选
        this.isAll = true;
        this.isAlls = true;
      }
    }
    this.canCancleTime = this.currentcancelTime;
    // console.log('this.canCancleTime', this.canCancleTime)
  }
};
</script>
<style scoped>
.showtimewrapper > div {
  width: 100%;
  /* height: 17.3rem; */
  background: #ffffff;
  border-radius: 1rem 1rem 0rem 0rem;
  position: fixed;
  left: 0;
  bottom: 0;
}
.cancel_time_top {
  width: 100%;
  height: 238px;
  background: #ffffff;
  box-shadow: 0px 8px 15px 0px rgba(238, 238, 238, 0.4);
  border-radius: 40px 40px 0px 0px;
}
.cancel_time_top > h3 {
  width: 100%;
  font-size: 32px;
  font-weight: 500;
  color: #333333;
  line-height: 114px;
  margin-left: 30px;
  box-sizing: border-box;
}
.cancel_time_top > h3 > span {
  width: 2.5rem;
  float: right;
  font-size: 28px;
  font-weight: 400;
  color: #333333;
}
.cancel_time_top > h3 > span > i {
  display: inline-block;
  width: 28px;
  height: 28px;
  background: url(../../static/img/no_select.png) no-repeat center center;
  background-size: cover;
  border-radius: 5px;
  float: left;
  margin-top: 42px;
  margin-right: 20px;
}
.cancel_time_top > h3 > span > i.selected {
  background: url(../../static/img/select1.png) no-repeat center center;
  background-size: cover;
}
.cancel_time_top h4 {
  text-align: center;
  text-overflow: -o-ellipsis-lastline;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
}

.cancel_time .timeDetail {
  width: 100%;
  padding: 60px 30px;
  box-sizing: border-box;
  overflow: scroll;
  margin-bottom: 80px;
}

.cancel_time > ul > li,
.cancel_time > ul > li.selected {
  width: calc(calc(100% - 80px) / 3);
  height: 80px;
  background: #eeeeee;
  border-radius: 8px;
  font-size: 28px;
  font-weight: 400;
  color: #333333;
  line-height: 80px;
  text-align: center;
  float: left;
  margin-right: 30px;
  border: 1px solid #eeeeee;
  margin-bottom: 30px;
}
.cancel_time > ul > li.selected {
  /* width: calc(calc(100% - 40px) / 3);
  height: 80px;
  line-height: 80px; */
  background: #ffecd6;
  border: 1px solid #ffa033;
  /* font-size: 28px; */
  color: #ffa033;
}
.cancel_time > ul > li:nth-of-type(3n) {
  margin-right: 0;
}
.cancel_time .bottom {
  width: calc(100% - 60px);
  height: 84px;
  background: #fff;
  position: fixed;
  bottom: 40px;
  left: 30px;
}
.cancel_time .bottom1 {
  width: calc(100% - 60px);
  height: 84px;
  background: #ffa033;
  border-radius: 44px;
  font-size: 30px;
  font-weight: 500;
  color: #ffffff;
  line-height: 84px;
  text-align: center;
  position: fixed;
  bottom: 40px;
  left: 30px;
}
.cancel_time .bottom > div {
  width: calc(calc(100% - 24px) / 2);
  height: 100%;
  float: left;
  border-radius: 44px;
  border: 2px solid #cccccc;
  font-size: 30px;
  font-weight: 400;
  color: #333333;
  line-height: 84px;
  text-align: center;
}
.cancel_time .bottom > div:last-of-type.bottom11 {
  background: #ffa033;
  color: #fff;
}

.cancel_time .bottom > div:last-of-type {
  float: right;
  background: #dddddd;
  color: #999999;
  border: none;
}
.cancel_time .bottom > div:last-of-type.bottom1 {
  background: #ffa033;
  color: #fff;
}
</style>