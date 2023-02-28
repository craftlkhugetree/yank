<template>
  <div class="selectmonitor_content">
    <div class="selectmonitor_top">
      <van-field
        class="monitor_picker"
        readonly
        clickable
        name="picker"
        :value="roomid"
        placeholder="请先选择教室"
        @click="showPicker = true"
        right-icon="arrow-down"
      />
    </div>
    <van-popup v-model="showPicker" position="bottom">
      <van-picker
        show-toolbar
        :columns="commonLists"
        @confirm="onConfirm"
        @cancel="showPicker = false"
      />
    </van-popup>
    <div class="monitorRoom" v-if="roomid">
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
                { selected: itemss.selected, full: itemss.onlyid == onlyid },
                'type' + itemss.type,
              ]"
              @click="selectSeat(itemss)"
            >
              {{ itemss.type == 1 ? itemss.name : "" }}
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
        <span> <i class="empty"></i>可选 </span>
        <span> <i class="selected"></i>已选 </span>
        <span> <i class="monitor"></i>不可选 </span>
      </div>
      <div class="line"></div>
      <div class="selectseat_num">
        已选位置
        <span v-if="isselected">
          {{ selectseat.name }}号座
          <i @click="delSeat"></i>
        </span>
      </div>
      <div class="bottom noselect" v-if="!isselected">请 选 择</div>
      <div class="bottom" v-else @click="savecommom">确 定</div>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    onlyid: String,
  },
  data() {
    return {
      roomid: "",
      showPicker: false,
      columns: ["杭州", "宁波", "温州", "嘉兴", "湖州"],
      commonLists: [],
      seatDeatil: [],
      isselected: false,
      selectseat: "",
      oneseatid: "", //一个常用座位的onlyid
      isScale: false, //
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
    getcommonLists() {
      this.util
        .postAjax({
          code: this.code.base,
          url: this.code.commonLists,
          data: {},
          isRep: true,
        })
        .then((res) => {
          if (res.success) {
            var data = res.data;
            this.commonLists = [];
            // this.commonLists = res.data;//status 1的显示
            data.forEach((e) => {
              e.text = e.name;
              if (e.status == 1) {
                this.commonLists.push(e);
              }
            });
            // this.commonLists.forEach(e=>{
            //     e.text = e.name
            // })
          } else {
            this.Toast(res.data.message);
          }
        });
    },
    getcommonSeats(id) {
      this.util
        .postAjax({
          code: this.code.base,
          url: this.code.commonSeats,
          data: {
            id: id,
          },
          // isRep:true
        })
        .then((res) => {
          if (res.success) {
            var seats = res.data.seats;
            var newseats = [];
            seats.forEach((m) => {
              if (m.type == 1) {
                m.selected = false;
                m.onlyid = m.sectionid + "" + m.id;
              }
              if (typeof newseats[m.rowno - 1] == "undefined") {
                newseats[m.rowno - 1] = [];
              }
              newseats[m.rowno - 1][m.colno - 1] = m;
            });
            this.seatDeatil = newseats;
          } else {
            this.Toast(res.data.message);
          }
        });
    },
    selectSeat(obj) {
      if (obj.onlyid == this.onlyid) {
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
    savecommom() {
      this.util
        .postAjax({
          code: this.code.base,
          url: this.code.savecommon,
          data: {
            seatid: this.selectseat.id,
            seatname: this.selectseat.name,
            sectionid: this.selectseat.sectionid,
            sectionname: this.roomid,
          },
          isRep: true,
        })
        .then((res) => {
          if (res.success) {
            this.$router.push("person");
          } else {
            this.Toast(res.data.message);
          }
        });
    },
    onConfirm(value) {
      this.roomid = value.text;
      this.getcommonSeats(value.id);
      this.showPicker = false;
    },
  },
  created() {
    this.getcommonLists();
  },
};
</script>
<style scoped>
</style>