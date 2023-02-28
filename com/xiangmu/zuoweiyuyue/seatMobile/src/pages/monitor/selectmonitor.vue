<template>
  <div class="selectmonitor_content">
    <div class="selectmonitor_top">
      <van-field
        class="monitor_picker"
        readonly
        clickable
        name="picker"
        :value="roomname1"
        placeholder="请先选择教室"
        @click="showPicker = true"
        right-icon="arrow-down"
      />
    </div>
    <van-popup v-model="showPicker" position="bottom">
      <van-picker
        show-toolbar
        :columns="roomLists"
        @confirm="onConfirm"
        @cancel="showPicker = false"
      />
    </van-popup>
    <div class="monitorRoom" v-if="roomname1">
      <div class="icons">
        <span> <i class="wall"></i>墙 </span>
        <span> <i class="window"></i>窗 </span>
        <span> <i class="door"></i>门 </span>
        <span> <i class="pass"></i>过道 </span>
        <span> <i class="pillar"></i>书架 </span>
      </div>
      <div class="hastimebox">
        <div class="seatDetail" :class="{ scale: isScale }" v-pinch="pinchCtrl">
          <ul class="clearfix" v-for="(items, index) in seatDeatil">
            <li
              v-for="(itemss, indexs) in items"
              :class="[
                {
                  selected: itemss.selected,
                  full: itemss.nowstatus == 3,
                  leave: itemss.nowstatus == 2,
                  epidemic: itemss.isopen == 0,
                  nosign: !itemss.signtime,
                },
                'type' + itemss.type,
              ]"
              @click="selectSeat(itemss)"
            >
              {{ itemss.type == 1 && !(itemss.isopen == 0) ? itemss.name : "" }}
            </li>
          </ul>
        </div>
      </div>
    </div>
    <div class="monitorRoom" v-else>
      <div class="notimebox">
        <div></div>
        <p>请先选择教室</p>
      </div>
    </div>
    <div class="selectseat">
      <div class="selectseat_top">
        <span> <i class="selected"></i>选中 </span>
        <span> <i class="epidemic"></i>疫情座位 </span>
        <span> <i class="nosign"></i>未签到 </span>
        <span> <i class="monitor"></i>已被举报 </span>
        <span> <i class="leave"></i>暂离 </span>
      </div>
      <div class="line"></div>
      <div class="selectseat_num">
        已选位置
        <span v-if="isselected">
          {{ selectseat.name }}号座
          <i @click="delSeat"></i>
        </span>
      </div>
      <div class="bottom nobottom" v-if="!isselected">请 选 择</div>
      <div class="bottom" v-if="isselected" @click="saveMonitor">确 定</div>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    roomname: String,
    roomid: String,
    seatname: String,
    seatid: String,
    type: String,
    orderid: String,
  },
  data() {
    return {
      roomname1: "",
      roomid1: "",
      showPicker: false,
      columns: ["杭州", "宁波", "温州", "嘉兴", "湖州"],
      roomLists: [], //教室列表
      isselected: false,
      seatDeatil: [],
      selectseat: "",
      isScale: false,
    };
  },
  methods: {
    pinchCtrl: function (e) {
      if (e === "pinchin") {
        console.log("捏合");
        this.isScale = false;
      }
      if (e === "pinchout") {
        console.log("扩大");
        this.isScale = true;
      }
    },
    getroomLists() {
      this.util
        .postAjax({
          code: this.code.base,
          url: this.code.PickList,
          data: {
            limit: 10000,
            page: 1,
          },
          isRep: true,
        })
        .then((res) => {
          if (res.success) {
            this.roomLists = res.data;
            this.roomLists.forEach((e) => {
              e.text = e.name;
            });
          } else {
            this.Toast(res.data.message);
          }
        });
    },
    onConfirm(value) {
      this.showPicker = false;
      if (value.unusenum != 0) {
        this.roomname1 = "";
        this.seatDeatil = [];
        this.isselected = false;
        this.Toast("当前房间尚有空座,不允许举报!");
        return;
      } else {
        this.roomname1 = value.text;
        this.roomid1 = value.id;
        this.getReportSeats(value.id);
      }
    },
    getReportSeats(id) {
      this.util
        .postAjax({
          code: this.code.base,
          url: this.code.ReportSeats,
          data: {
            id: id,
          },
        })
        .then((res) => {
          if (res.success) {
            var seats = res.data;
            this.isselected = false;
            var newseats = [];
            seats.forEach((m) => {
              if (m.type == 1) {
                m.selected = false;
                if (m.id == this.seatid) {
                  this.selectseat = m;
                  m.selected = true;
                  this.isselected = true;
                }
              }
              if (typeof newseats[m.rowno - 1] == "undefined") {
                newseats[m.rowno - 1] = [];
              }
              newseats[m.rowno - 1][m.colno - 1] = m;
            });
            this.seatDeatil = newseats;
          }
        });
    },
    selectSeat(obj) {
      if (
        obj.nowstatus == 3 ||
        obj.nowstatus == 2 ||
        obj.isopen == 0 ||
        !obj.signtime
      ) {
        this.Toast("当前座位不可选");
        return;
      }
      this.seatDeatil.forEach((e) => {
        e.forEach((ee) => {
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
      }
    },
    delSeat() {
      this.isselected = false;
      this.selectseat = "";
      this.seatDeatil.forEach((e) => {
        e.forEach((ee) => {
          ee.selected = false;
        });
      });
    },
    saveMonitor() {
      // console.log(this.selectseat)
      this.$router.push({
        path: "writemonitor",
        query: {
          roomname: this.roomname1,
          roomid: this.roomid1,
          seatname: this.selectseat.name,
          seatid: this.selectseat.id,
          orderid: this.selectseat.orderid,
          type: this.type,
        },
      });
    },
  },
  created() {
    this.roomname1 = this.roomname;
    this.roomid1 = this.roomid;
    if (this.roomid1) {
      this.selectseat = {};
      this.selectseat.seatname = this.seatname;
      this.getReportSeats(this.roomid1);
    }
    this.getroomLists();
  },
};
</script>
<style scoped>
.selectmonitor_content > .selectseat > .selectseat_top {
  overflow-x: scroll;
  display: flex;
  justify-content: flex-start;
  flex-wrap: nowrap;
  line-height: 87px;
  padding: 0 0.75rem;
  box-sizing: border-box;
}
.selectmonitor_content > .selectseat > .selectseat_top > span {
  flex-shrink: 0;
  /* margin-top:40px; */
}
.selectseat > .bottom.nobottom {
  background: #dddddd;

  color: #999999;
}
</style>