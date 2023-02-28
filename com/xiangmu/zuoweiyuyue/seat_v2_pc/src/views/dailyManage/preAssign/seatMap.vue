<template>
  <section
    class="form-section"
    onselectstart="return false"
    style="-moz-user-select: none"
  >
    <el-container class="container">
      <!---------------------------- 左侧素材 ---------------------------->
      <div class="main" ref="elmain">
        <div class="icons-list">
          <div
            class="icon-item"
            v-for="(item, index) in seatOptions"
            :key="index"
          >
            <i class="img" :class="item.type"></i>
            <span class="icon-name">{{ item.text }}</span>
          </div>
        </div>
        <!---------------------------- 右侧座位表格 ---------------------------->
        <table class="seattable">
          <tr v-for="(itmes, index) in seatList" :key="'row' + index">
            <!-- epidemic: seat.isopen == 0, -->
            <td
              v-for="(seat, sindex) in itmes"
              :key="'col' + sindex"
              :class="[
                {
                  selected: seat.selected,
                  full: seat.nowstatus == 3,
                  part: seat.nowstatus == 2,
                },
                seat.type == 1 && (seat.selected || [2,3].includes(seat.nowstatus)) ? '' : options[seat.type],
              ]"
              name="seat-td"
              :id="seat.seatId"
              :style="
                seat.type == 1 && !seat.selected ? { cursor: 'pointer' } : ''
              "
              @click.stop="
                seat.type == 1 && !seat.selected ? selectSeat(seat) : void 0
              "
            >
              <span :class="seat.type == 1 ? 'seat-num' : 'no-num'">{{
                seat.name
              }}</span>
            </td>
          </tr>
        </table>
        <div class="h3-icon">
          <span> <i class="empty"></i>可选 </span>
          <span> <i class="noseat"></i>不可选 </span>
          <span> <i class="partSeat"></i>部分可选 </span>
          <span> <i class="epidemic"></i>疫情座位 </span>
        </div>
      </div>
    </el-container>
  </section>
</template>

<script>
export default {
  props: {
    detailData: Array,
  },
  data() {
    return {
      seatList: [], //1座位 2过道 3书架 4墙 5门 6窗 7 疫情座位
      options: [
        "",
        "seat",
        "pass",
        "pillar",
        "wall",
        "door",
        "window",
        "interval-seat",
      ],
      sectionname: "",
      seatname: "",
      seatOptions: [
        // 座位素材
        { type: "wall", value: "4", text: "墙" },
        { type: "window", value: "6", text: "窗" },
        { type: "door", value: "5", text: "门" },
        { type: "pillar", value: "3", text: "书架" },
        { type: "pass", value: "2", text: "过道" },
        // { type: "seat", value: "1", text: "座位" },
        // { type: "interval-seat", value: "7", text: "疫情座位" },
      ],
      isselected: false, //是不是选择了座位了
      showtime: false, //显示选择时间的有弹窗
      isappoint: true, //选择时间弹窗是不是预约的
      ismonitor: false,
      appointSucc: false,
      selectseat: "", //选择的座位信息
      Opentime: [],
      appointTime: [],
      selectTimes: [], //已经选择的时间段
      hasselected: false,
      times: [],
      isScale: false, //
      changeSeat: false,
      sureflag: true,
    };
  },

  computed: {},

  watch: {
    detailData() {
      let seatData = _.cloneDeep(this.detailData);
      let newseats = [];
      //一维数组 转换成对应的二维数组 && m.type == "1" && m.name % 1 == 0
      let seatId = 1;
      seatData.forEach((m) => {
        if (m.isopen == "0") {
          m.type = "7";
        }
        if (typeof newseats[m.rowno - 1] == "undefined") {
          newseats[m.rowno - 1] = [];
        }
        newseats[m.rowno - 1][m.colno - 1] = m;
      });

      this.seatList = newseats;
    },
  },

  mounted() {},

  methods: {
    selectSeat(obj) {
      this.changeSeat = true;
      this.selectTimes = [];
      if (obj.nowstatus == 3 || obj.isopen == 0) {
        this.$message({
          type: "waring",
          message: "当前座位不可选!",
        });
        return;
      }
      this.seatList.forEach((e) => {
        e.forEach((ee) => {
          if (ee.id != obj.id && obj.type == 1) {
            ee.selected = false;
          }
        });
      });
      if (obj.type == 1) {
        obj.selected = !obj.selected;
        // this.hasselected = false;
        if (obj.selected) {
          this.selectseat = obj;
          this.isselected = true;
        } else {
          this.selectseat = "";
          this.isselected = false;
        }
      }
      this.seatList = [...this.seatList]
      this.$emit('chooseSeat', obj)
    },
  },
};
</script>

<style lang="scss" scoped>
.container {
  border: 1px solid #eeeeee;
}
.icons-list {
  height: auto;
  width: 60%;
  margin: 0 auto;
  display: flex;
  justify-content: space-around;
  .icon-item {
    justify-content: center;
    float: left;
    align-items: center;
    width: auto;
    text-align: center;
    color: #666;
    // cursor: pointer;
  }
  .icon-name {
    display: inline-block;
    text-align: center;
    white-space: nowrap;
    vertical-align: middle;
    height: 26px;
    line-height: 26px;
  }
}
i.img {
  vertical-align: middle;
  display: inline-block;
  width: 26px;
  height: 26px;
  margin: 5px;
}

.main {
  background-color: #f9f9fa;
  overflow-x: auto;
  overflow-y: inherit;
  min-height: 500px;
  width: 100%;
  position: relative;
}
.seattable {
  margin: 10px auto;
  white-space: nowrap;
}
.seattable tr {
  display: flex;
}
.seattable td {
  border: 1px transparent solid;
  display: inline-block;
  width: 30px;
  height: 30px;
  margin: 3px;
  text-align: center;
  line-height: 25px;
  font-size: 12px;
  position: relative;
}
.seattable .seatselected {
  outline: #3d7fff 1px solid;
}
.no-num {
  color: transparent;
}

.h3-icon {
  height: auto;
  width: 60%;
  margin: 0 auto;
  display: flex;
  justify-content: space-around;
  span {
    float: left;
    width: auto;
    text-align: center;
    color: #666;
    vertical-align: middle;
    height: 26px;
  }
  i {
    display: inline-block;
    width: 26px;
    height: 26px;
    text-align: center;
    white-space: nowrap;
    vertical-align: middle;
    line-height: 26px;
    margin: 5px;
  }
}
.epidemic {
  background: url("~@/assets/img/epidemicseat.png") no-repeat center center;
  background-size: cover;
}
.noseat {
  background: url("~@/assets/img/monitor.png") no-repeat center center;
  background-size: cover;
}

.empty {
  background: url("~@/assets/img/empty.png") no-repeat center center;
  background-size: cover;
}

.partSeat {
  background: url("~@/assets/img/half.png") no-repeat center center;
  background-size: cover;
}

.selected {
  background: url("~@/assets/img/selected.png") no-repeat center center;
  background-size: contain;
  color: transparent;
}
.full {
  background: url("~@/assets/img/monitor.png") no-repeat center center;
  background-size: contain;
  color: #fff;
}
.part {
  background: url("~@/assets/img/half.png") no-repeat center center;
  background-size: contain;
  color: #fff;
}
</style>
