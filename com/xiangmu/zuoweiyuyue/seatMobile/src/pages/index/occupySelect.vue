<template>
  <div class="appointSelectContent OccupyselectContent">
    <div class="appointSelect_top">
      <h3>
        {{ name }}
        <i v-if="islocakers == 1">有柜子</i>
      </h3>
      <p>{{ location }}</p>
    </div>
    <div class="selectOccupyTime">
      <h3>选择时间段</h3>
      <ul>
        <li
          v-for="(v, i) in Opentime"
          :class="{ selectact: v.canSelect }"
          :key="i"
          @click="selTime(v)"
        >
          {{ v && v.starttime.substring(0, 2) }}:{{
            v && v.starttime.substring(2, 4)
          }}~{{ v && v.endtime.substring(0, 2) }}:{{
            v && v.endtime.substring(2, 4)
          }}
        </li>
      </ul>
    </div>
    <div class="roomDetail monitorRoom" id="cnt" v-if="selecttime">
      <div class="icons">
        <span> <i class="wall"></i>墙 </span>
        <span> <i class="window"></i>窗 </span>
        <span> <i class="door"></i>门 </span>
        <span> <i class="pass"></i>过道 </span>
        <span> <i class="pillar"></i>书架 </span>
      </div>
      <div class="hastimebox">
        <div
          class="seatDetail"
          ref="test"
          :class="{ scale: isScale }"
          v-pinch="pinchCtrl"
          :style="`zoom: ${zoom}`"
        >
          <ul class="clearfix" v-for="(items, index) in seatDeatil">
            <li
              v-for="(itemss, indexs) in items"
              :class="[
                {
                  selected: itemss.selected,
                  full: itemss.nowstatus == 3 || itemss.nowstatus == 2,
                  epidemic: itemss.isopen == 0
                },
                'type' + itemss.type
              ]"
              @click="selectSeat(itemss)"
            >
              <!-- {{ itemss.type == 1 ? itemss.name : "" }} -->
              <!-- {{ itemss.type == 1 && !(itemss.nowstatus == 3 || itemss.nowstatus == 2 || itemss.isopen == 0) ? itemss.name : "" }} -->
              {{ itemss.type == 1 && !(itemss.isopen == 0) ? itemss.name : "" }}
            </li>
          </ul>
        </div>
      </div>
      <div class="bottom">
        <h3>
          <span> <i class="empty"></i>可选 </span>
          <span> <i class="noseat"></i>不可选 </span>
          <span> <i class="selected"></i>选中 </span>
          <span> <i class="epidemic"></i>暂不开放 </span>
        </h3>
        <div class="line"></div>
        <div class="selectSeatBox">
          已选位置
          <span v-if="isselected">
            {{ selectseat.name }}号座
            <i @click="delSeat"></i>
          </span>
        </div>
        <div class="bottom_" v-if="!isselected">请 选 择</div>
        <div class="bottom_1" v-else @click="sureOccutpy">确 定</div>
      </div>
    </div>
    <div v-else class="roomDetail">
      <div class="notimebox">
        <div></div>
        <p>请先选择时间段</p>
      </div>
      <div class="bottom">
        <h3>
          <span> <i class="empty"></i>可选 </span>
          <span> <i class="noseat"></i>不可选 </span>
          <span> <i class="selected"></i>选中 </span>
          <span> <i class="epidemic"></i>暂不开放 </span>
        </h3>
        <div class="line"></div>
        <div class="selectSeatBox">
          已选位置
          <!-- <span>4排1号座 <i></i></span> -->
        </div>
        <div class="bottom_" v-if="!isselected">请 选 择</div>
        <div class="bottom_ bottom_1" v-else>确 定</div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    opentime: String,
    id: String,
    name: String,
    location: String,
    islocakers: String,
    pickendtime: Number | String,
    ruleid: String,
    seatname: String,
    seatid: String
  },
  data() {
    return {
      isselected: false,
      nowdata: "",
      selecttime: true,
      Opentime: [], //开放的时间
      starttime: "",
      endtime: "",
      seatDeatil: [], //座位排序--渲染座位
      isScale: false, //
      time: [], //选中的时间数组
      timeStartEnd: [], //选中的时间段的开始时间结束时间数组
      selectseat: "", //选中的座位信息
      sureflag: true,
      boxGesture: null,
      zoom: 1
    };
  },
  methods: {
    // 初始化缩放事件
    initGesture() {
      // obj
      this.boxGesture = this.common.setGesture(this.$refs.test);

      // 给obj添加方法
      this.boxGesture.gesturemove = e => {
        // e === position
        this.zoom = e.scale;
      };
    },
    queryOpentime() {
      this.util
        .postAjax({
          code: this.code.base,
          url: this.code.queryOpentime,
          data: {
            enddate: this.nowdata,
            sectionid: this.id,
            startdate: this.nowdata,
            type: 2
          },
          isRep: true
        })
        .then(res => {
          if (res.success) {
            this.Opentime = [];
            if (res.data.length < 1) {
              this.Toast("当前暂无可选时间段");
              this.$router.push("/");
              return;
            }
            res.data.forEach(e => {
              e.daytime =
                this.util.formatMYD("/") +
                " " +
                e.endtime.substring(0, 2) +
                ":" +
                e.endtime.substring(2, 4);
              if (
                Date.parse(e.daytime) - new Date().getTime() >
                60000 * parseInt(this.pickendtime)
              ) {
                //结束开始前几分钟停止占座
                e.canSelect = false;
                this.Opentime.push(e);
              }
            });
            this.starttime = this.Opentime[0] && this.Opentime[0].starttime;
            this.endtime = this.Opentime[0] && this.Opentime[0].endtime;
            this.time.push(this.Opentime[0]);
            var obj = {
              starttime: this.Opentime[0] && this.Opentime[0].starttime,
              endtime: this.Opentime[0] && this.Opentime[0].endtime
            };
            this.timeStartEnd.push(obj);
            this.Opentime[0].canSelect = true;
            this.getPickDetail();
            //找出第一个默认选中的下标
            // this.timeactIndex = this.Opentime.findIndex( item => item.canSelect == true);
          }
        });
    },
    selTime(time) {
      time.canSelect = !time.canSelect;
      var index = this.time.findIndex(item => item.id === time.id);
      if (index == -1) {
        this.time.push(time);
      } else {
        this.time.splice(index, 1);
      }
      this.timeStartEnd = [];
      this.time.forEach(e => {
        var obj = {
          starttime: e && e.starttime,
          endtime: e && e.endtime
        };
        this.timeStartEnd.push(obj);
      });
      if (this.timeStartEnd.length > 0) {
        this.selecttime = true;
        this.getPickDetail();
      } else {
        this.selecttime = false;
      }
    },
    getPickDetail() {
      this.util
        .postAjax({
          code: this.code.base,
          url: this.code.PickDetail,
          data: {
            enddate: this.nowdata,
            sectionid: this.id,
            startdate: this.nowdata,
            times: this.timeStartEnd
          },
          isRep: true
        })
        .then(res => {
          if (res.success) {
            var seats = res.data;
            this.isselected = false;
            var newseats = [];
            seats.forEach(m => {
              if (m.type == 1) {
                m.selected = false;
                if (this.seatname && m.name == this.seatname) {
                  if (m.isopen == 0) {
                    m.selected = false;
                  } else {
                    m.selected = true;
                    this.isselected = true;
                    this.selectseat = {
                      name: this.seatname,
                      id: this.seatid
                    };
                  }
                }
              }

              if (typeof newseats[m.rowno - 1] == "undefined") {
                newseats[m.rowno - 1] = [];
              }
              newseats[m.rowno - 1][m.colno - 1] = m;
            });
            this.seatDeatil = newseats;
            // if(this.seatname){//表示常用座位进来的,
            //     this.isselected = true;
            //     this.selectseat = {
            //         name:this.seatname,
            //         id:this.seatid
            //     }
            // }
          }
        });
    },
    selectSeat(obj) {
      if (obj.nowstatus == 3 || obj.nowstatus == 2 || obj.isopen == 0) {
        this.Toast("当前座位不可选");
        return;
      }
      this.seatDeatil.forEach(e => {
        e.forEach(ee => {
          if (ee.id != obj.id && obj.type == 1) {
            ee.selected = false;
          }
        });
      });
      if (obj.type == 1) {
        obj.selected = !obj.selected;
        if (obj.selected) {
          this.selectseat = obj;
          this.isselected = true;
        } else {
          this.selectseat = "";
          this.isselected = false;
        }
      } else {
        // this.selectseat = obj;
      }
    },
    sureOccutpy() {
      this.timeStartEnd.forEach(e => {
        e.orderdate = this.nowdata;
      });
      if (this.sureflag) {
        this.sureflag = false;
        this.util
          .postAjax({
            code: this.code.base,
            url: this.code.ordersave,
            data: {
              enddate: this.nowdata,
              ruleid: this.ruleid,
              seatid: this.selectseat.id,
              seatname: this.selectseat.name,
              sectionid: this.id,
              sectionname: this.name,
              startdate: this.nowdata,
              times: this.timeStartEnd,
              type: "2" //1预约 2 选座
            },
            isRep: true
          })
          .then(res => {
            if (res.success) {
              this.$router.push("/");
            } else {
              this.sureflag = true;
              this.Toast(res.data.message);
            }
          });
      } else {
        // this.Toast('')
      }
    },
    delSeat() {
      this.isselected = false;
      this.selectseat = "";
      this.seatDeatil.forEach(e => {
        e.forEach(ee => {
          ee.selected = false;
        });
      });
    },
    pinchCtrl: function(e) {
      if (e === "pinchin") {
        console.log("捏合");
        this.isScale = false;
      }
      if (e === "pinchout") {
        console.log("扩大");
        this.isScale = true;
      }
    }
  },
  created() {
    this.nowdata = this.util.formatMYD();
    this.queryOpentime();
  },
  mounted() {
    this.initGesture()
  }
};
</script>
<style scoped>
.appointSelectContent {
  width: 100%;
  height: 100%;
  position: fixed;
  top: 0;
  left: 0;
}

.OccupyselectContent > .roomDetail {
  width: 100%;
  height: calc(100% - 360px);
  background: #f8f8f8;
}

.roomDetail > .bottom {
  width: 100%;
  height: 328px;
  background: #ffffff;
  box-shadow: 0px -2px 10px 0px rgba(238, 238, 238, 0.4);
  border-radius: 60px 60px 0px 0px;
  position: absolute;
  left: 0;
  bottom: 0;
}
.roomDetail > div.hastimebox {
  width: 100%;
  /* height: 90%; */
  height: calc(100% - 450px);
  overflow: auto;
  display: flex;
  justify-content: center;
}
</style>
