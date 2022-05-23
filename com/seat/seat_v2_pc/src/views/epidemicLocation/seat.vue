<template>
  <section
    class="form-section"
    onselectstart="return false"
    style="-moz-user-select: none"
  >
    <el-container class="container">
      <!---------------------------- 左侧素材 ---------------------------->
      <el-aside class="aside" width="170px">
        <div class="h3-title">
          当前位置：
          <span class="label">{{ sectionname }} — 座位号{{ seatname }}</span>
        </div>
        <ul class="icons-list">
          <li
            class="icon-item"
            v-for="(item, index) in seatOptions"
            :key="index"
          >
            <i class="img" :class="item.type"></i>
            <span class="icon-name">{{ item.text }}</span>
          </li>
        </ul>
      </el-aside>

      <div class="main" ref="elmain">
        <!---------------------------- 右侧座位表格 ---------------------------->
        <table class="seattable">
          <tr v-for="(itmes, index) in seatList" :key="'row' + index">
            <td
              v-for="(seat, sindex) in itmes"
              :key="'col' + sindex"
              :class="[options[seat.type]]"
              name="seat-td"
              :id="seat.seatId"
            >
              <span
                :class="
                  seat.type == '1'
                    ? 'seat-num'
                    : seat.type == '7'
                    ? 'interval-num'
                    : 'no-num'
                "
                >{{ seat.name }}</span
              >
            </td>
          </tr>
        </table>
        <p class="tips">座位图不实时更新，仅供参考</p>
      </div>
    </el-container>
  </section>
</template>

<script>
export default {
  props: {
    detailData: Object,
    curRow: Object,
  },
  data() {
    return {
      seatList: [], //1座位 2过道 3书架 4墙 5门 6窗 7 疫情座位 8 我的座位
      options: [
        "",
        "seat",
        "pass",
        "pillar",
        "wall",
        "door",
        "window",
        "interval-seat",
        "my-seat",
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
        { type: "seat", value: "1", text: "座位" },
        { type: "interval-seat", value: "7", text: "疫情座位" },
        { type: "my-seat", value: "8", text: "我的座位" },
      ],
    };
  },

  computed: {},

  watch: {
    detailData() {
      this.sectionname = this.curRow.sectionname;
      this.seatname = this.curRow.seatname;
      let seatData = _.cloneDeep(this.detailData.seats);
      let newseats = [];
      //一维数组 转换成对应的二维数组 && m.type == "1" && m.name % 1 == 0
      let seatId = 1;
      seatData.forEach((m) => {
        if (m.id == this.curRow.seatid) {
          m.type = "8";
        } else if (m.isopen == "0") {
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

  methods: {},
};
</script>

<style lang="scss" scoped>
.form-section {
}

.mg-lf {
  margin-left: 8px;
}

.h3-title {
  font-size: 14px;
  color: #666;
  padding: 30px 30px 30px 23px;
  border-bottom: 1px solid #eeeeee;
  .label {
    display: block;
    font-size: 16px;
    font-weight: bold;
    color: #333333;
    margin-top: 8px;
    line-height: 22px;
  }
}
.container {
  border: 1px solid #eeeeee;
}
.aside {
  box-shadow: 1px 0px 0px 0px #eeeeee;
  .title {
    margin-top: 30px;
    margin-left: 30px;
    margin-bottom: 10px;
  }
}

.icons-list {
  padding-top: 30px;
  li.icon-item {
    float: left;
    width: 72px;
    text-align: center;
    color: #666;
    margin-bottom: 30px;
    display: list-item;
    cursor: pointer;
  }
  li.icon-name {
    display: inline-block;
    padding-top: 3px;
  }
}
i.img {
  display: block;
  width: 26px;
  height: 26px;
  margin: 4px auto;
}

.main {
  background-color: #f9f9fa;
  overflow-x: auto;
  width: 100%;
  position: relative;
}
.seattable {
  margin: 10% auto;
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
  cursor: pointer;
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
.interval-num {
  color: #fff;
}
.rectangular {
  background-color: rgba(235, 239, 243, 0.45);
  position: fixed;
  border: 1px solid rgba(24, 135, 243, 1);
  z-index: 20000;
}

.tips {
  color: #ffa033;
  text-align: center;
  position: absolute;
  bottom: 24px;
  left: 32%;
}
</style>