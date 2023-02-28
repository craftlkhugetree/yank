<template>
  <section class="form-section" onselectstart="return false" style="-moz-user-select: none">
    <!---------------------------- 行列设置 ---------------------------->
    <el-form
      ref="editForm"
      :model="editForm"
      :rules="rules"
      label-position="right"
      label-width="120px"
      class="form-content"
    >
      <el-form-item label="座位行列设置" prop="setRowCol">
        <el-input-number
          controls-position="right"
          v-model.number="editForm.row"
          size="small"
          style="width: 100px"
          :min="0"
          @change="initSeat"
        ></el-input-number>
        <span class="mg-lf">排，</span>
        <el-input-number
          controls-position="right"
          class="mg-lf"
          v-model.number="editForm.col"
          size="small"
          style="width: 100px"
          :min="0"
          @change="initSeat"
        ></el-input-number>
        <span class="mg-lf">列。</span>
        座位数：{{ seatNum }}
      </el-form-item>
    </el-form>

    <el-container class="container" id="aside">
      <!---------------------------- 左侧素材 ---------------------------->
      <el-aside class="aside" width="143px">
        <h3 class="title">素材选择</h3>
        <ul class="icons-list">
          <li
            class="icon-item"
            v-for="(item, index) in seatOptions"
            :key="index"
            @click="replaceSeat(item)"
          >
            <i class="img" :class="item.type"></i>
            <span class="icon-name">{{ item.text }}</span>
          </li>
        </ul>
        <el-popover placement="right" width="260" v-model="sortVisible">
          <p>
            <label>座位开始编号：</label>
            <el-input-number
              controls-position="right"
              v-model.number="sortNum"
              size="small"
              style="width: 100px; margin-bottom: 24px"
              :min="0"
            ></el-input-number>
          </p>
          <div style="text-align: right; margin: 0">
            <el-button type="primary" size="mini" @click="handleSort">确定</el-button>
          </div>
          <button slot="reference" class="sort-btn">编号正排</button>
        </el-popover>
        <el-popover placement="right" width="260" v-model="sortDownVisible">
          <p>
            <label>座位开始编号：</label>
            <el-input-number
              controls-position="right"
              v-model.number="sortNum"
              size="small"
              style="width: 100px; margin-bottom: 24px"
              :min="0"
            ></el-input-number>
          </p>
          <div style="text-align: right; margin: 0">
            <el-button type="primary" size="mini" @click="handleDownSort">确定</el-button>
          </div>
          <button slot="reference" class="sort-btn">编号倒排</button>
        </el-popover>
      </el-aside>
      <!--   @mousedown.left="onmousedownClick" @mouseup.left="handMouseUp" -->
      <div class="main" ref="elmain" @mousedown.left="onmousedownClick">
        <!---------------------------- 右侧座位表格 ---------------------------->
        <table class="seattable">
          <tr v-for="(itmes, index) in seatList" :key="'row' + index" class="tr">
            <td
              v-for="(seat, sindex) in itmes"
              :key="'col' + sindex"
              :class="[options[seat.type], { seatselected: selectIds.includes(seat.seatId) }]"
              @click.stop="clickSeat(seat)"
              @dblclick.stop="dbClickSeat(seat)"
              onselect="return false"
              onselectstart="return false"
              ondragstart="return false"
              @mouseup.right="selecteItem(item, index)"
              name="seat-td"
              :id="seat.seatId"
            >
              <span :class="seat.type == 1 && !seat.isDbClick ? 'seat-num' : 'no-num'">
                {{ seat.name }}
              </span>
              <input
                v-if="seat.isDbClick"
                :class="{ 'blue-input': seat.isDbClick }"
                v-model="newName"
                ref="myInput"
                autofocus
                type="text"
                @blur="editName(seat)"
                @keyup.13="editName(seat)"
              />
            </td>
          </tr>
        </table>
      </div>
      <div id="rectangular"></div>
    </el-container>
  </section>
</template>

<script>
export default {
  props: {
    detailData: Object,
  },
  data() {
    let rowAndCol = (rule, value, callback) => {
      if (!this.editForm.col || !this.editForm.row) {
        return callback(new Error('请设置座位排、列！'));
      } else {
        callback();
      }
    };
    return {
      seatList: [], //1座位 2过道 3书架 4墙 5门 6窗 7 疫情座位
      options: ['', 'seat', 'pass', 'pillar', 'wall', 'door', 'window', 'interval-seat'],
      editForm: {
        col: null,
        row: null,
      },
      selectedIndex: [],
      rules: {
        setRowCol: [
          {
            required: true,
            validator: rowAndCol,
            trigger: 'change',
          },
        ],
      },
      newName: '0',
      isShift: false,
      mouseDown: false,
      selectIds: [], //座位框选的seatID, 递增数字
      sortNum: 0,
      sortVisible: false,
      sortDownVisible: false,
    };
  },

  computed: {
    seatOptions() {
      let tmp = this.$store.state.seatOptions;
      return tmp.filter(t => t.value != '7');
    },
    seatNum() {
      let list = this.seatList.flat();
      let newList = list.filter(item => item.type == 1);
      let num = newList.length;
      return num;
    },
  },

  watch: {
    detailData() {
      let seatData = _.cloneDeep(this.detailData.seats);
      let ROW = this.detailData.row;
      let COL = this.detailData.col;
      this.editForm.row = ROW;
      this.editForm.col = COL;
      let newseats = [];
      //一维数组 转换成对应的二维数组
      let seatId = 1;
      seatData.forEach(m => {
        if (m.isopen == '0') {
          m.type = '7';
        }
        if (typeof newseats[m.rowno - 1] == 'undefined') {
          newseats[m.rowno - 1] = [];
        }
        newseats[m.rowno - 1][m.colno - 1] = m;
        let isWall = m.rowno == 1 || m.colno == 1 || m.rowno == 2 + ROW || m.colno == 2 + COL;
        m.isWall = isWall ? true : false;
      });
      //递增 添加seatID
      newseats.forEach(items => {
        items.forEach(s => {
          s.seatId = seatId++;
        });
      });

      this.seatList = newseats;
    },
  },

  mounted() {
    // 获取键盘按住 判断是否按住shift键，是就把isShift赋值为true
    window.addEventListener('keydown', code => {
      if (code.keyCode === 16 && code.shiftKey) {
        this.isShift = true;
      }
    });
    // 松开事件 找出shift按下时，最后选中两个的之间行列，全部设置为选中
    window.addEventListener('keyup', code => {
      if (code.keyCode === 16) {
        this.isShift = false;
        if (this.selectIds.length) {
          let sortArr = _.cloneDeep(this.selectIds);
          let lastArr = sortArr.slice(-2);
          let maxId = Math.max(...lastArr);
          let minId = Math.min(...lastArr);
          let list = this.seatList.flat();
          let minSeat = list.filter(item => item.seatId == minId)[0];
          let maxSeat = list.filter(item => item.seatId == maxId)[0];
          this.seatList.forEach(items => {
            items.forEach(s => {
              if (
                s.seatId > minId &&
                s.seatId < maxId &&
                s.colno >= minSeat.colno &&
                s.rowno >= minSeat.rowno &&
                s.colno <= maxSeat.colno &&
                s.rowno <= maxSeat.rowno
              ) {
                this.selectIds.push(s.seatId);
              }
            });
          });
        }
      }
    });
  },
  // 移除监听事件
  beforeDestroy() {
    window.removeEventListener('mousemove', this.onMouseMove);
    window.removeEventListener('mouseup', this.onMouseUp);
  },

  methods: {
    selecteItem(item, index) {

    },
    // 重新生成编号
    renameId() {
      let count = 1;
      this.seatList.forEach(items => {
        items.forEach(item => {
          if (item.type == 1) {
            this.$set(item, 'name', count++)
          }
        })
      })
    },
    // 初始生成座位，全部都是座位，边框为墙
    initSeat(val) {
      if (!val) {
        return false;
      }
      let row = [...Array(this.editForm.row + 2).keys()];
      let col = [...Array(this.editForm.col + 2).keys()];
      let obj = null,
        newseats = [],
        seatno = 1,
        seatId = 1,
        colArr = [];
      row.forEach(r => {
        newseats[r] = [];
        col.forEach(c => {
          let isWall = r == 0 || c == 0 || r == row.length - 1 || c == col.length - 1;
          obj = {
            colno: c + 1,
            rowno: r + 1,
            id: '',
            seatId: seatId++,
            isopen: '',
            isWall: isWall ? true : false,
            name: isWall ? '0' : seatno++,
            sectionid: '',
            type: isWall ? '4' : '1',
            isDbClick: false,
          };
          newseats[r][c] = obj;
        });
      });

      this.seatList = newseats;
    },
    //编号倒序(编号递减，按行)
    handleDownSort() {
      for (let index = this.seatList.length - 1; index >= 0; index--) {
        let item = this.seatList[index] || [];
        for (let id = item.length - 1; id >= 0; id--) {
          if (item[id].type == '1' && this.selectIds.includes(item[id].seatId)) {
            item[id].name = this.sortNum++;
          }
        }
        // item.forEach((seat, idex) => {
        //   if (seat.type == '1' && this.selectIds.includes(seat.seatId)) {
        //     seat.name = this.sortNum++;
        //   }
        // });
      }
      this.sortDownVisible = false;
      this.selectIds = [];
      this.sortNum = 0;
    },

    //编号排序（编号递增）
    handleSort() {
      this.seatList.forEach(item => {
        item.forEach(seat => {
          if (seat.type == '1' && this.selectIds.includes(seat.seatId)) {
            seat.name = this.sortNum++;
          }
        });
      });
      this.sortVisible = false;
      this.selectIds = [];
      this.sortNum = 0;
    },

    editName(item) {
      this.$set(item, 'isDbClick', false);
      this.$set(item, 'name', this.newName || '0');
      this.$forceUpdate();
    },

    //双击
    dbClickSeat(item) {
      if (item.type !== '1') {
        return false;
      }
      this.newName = item.name;
      this.$set(item, 'isDbClick', !item.isDbClick);
      this.selectIds = [];
      this.$forceUpdate();
      //自动获取焦点
      this.$nextTick(() => {
        this.$refs.myInput[0].focus();
      });
    },
    //单击
    clickSeat(item) {
      //正在双击编辑时，直接返回
      if (item.isDbClick) {
        return false;
      }
      let findIndex = this.selectIds.findIndex(v => v == item.seatId);
      if (findIndex > -1) {
        this.selectIds.splice(findIndex, 1);
      } else {
        this.selectIds.push(item.seatId);
      }
    },
    //替换座位类型 ,边缘为墙面不可替换为座位
    replaceSeat(material) {
      if (!this.selectIds.length) {
        return;
      }
      const seatType = ['interval-seat', 'seat'];
      this.seatList.forEach(items => {
        items.forEach(item => {
          if (
            !(seatType.includes(material.type) && item.isWall) &&
            this.selectIds.includes(item.seatId)
          ) {
            this.$set(item, 'type', material.value);
            this.$set(item, 'name', ' ');
          }
        });
      });
      // this.renameId();
      this.$forceUpdate();
      this.selectIds = [];
    },
    //鼠标 移动框选
    onMouseMove(event) {
      if (!this.mouseDown) return;
      let that = this;
      let end_x = event.clientX;
      let end_y = event.clientY;
      let divElement = document.getElementById('rectangular');
      divElement.style.display = 'block';
      divElement.className = 'rectangular';
      //从左往右
      // 画矩形
      if (that.start_x < end_x) {
        divElement.style.width = end_x - that.start_x + 'px';
        divElement.style.height =
          (that.start_y > end_y > 0 ? that.start_y - end_y : end_y - that.start_y) + 'px';
        divElement.style.left = that.start_x + 'px';
        divElement.style.right = end_x + 'px';
        //从下往上
        if (that.start_y > end_y) {
          divElement.style.top = end_y + 'px';
          divElement.style.bottom = that.start_y + 'px';
        } else {
          divElement.style.top = that.start_y + 'px';
          divElement.style.bottom = end_y + 'px';
        }
      } else {
        divElement.style.width = that.start_x - end_x + 'px';
        divElement.style.height =
          (that.start_y > end_y > 0 ? that.start_y - end_y : end_y - that.start_y) + 'px';
        divElement.style.left = end_x + 'px';
        divElement.style.right = that.start_x + 'px';
        //从下往上
        if (that.start_y > end_y) {
          divElement.style.top = end_y + 'px';
          divElement.style.bottom = that.start_y + 'px';
        } else {
          divElement.style.top = that.start_y + 'px';
          divElement.style.bottom = end_y + 'px';
        }
      }
    },

    //鼠标左键按下方法
    onmousedownClick(event) {
      let className = ['main', 'tr'];
      // 阻止捕获到item
      if (!className.includes(event.target.className)) return;
      this.mouseDown = true;
      this.start_x = event.clientX;
      this.start_y = event.clientY;
      // 开始监听鼠标 移动，抬起 事件
      window.addEventListener('mousemove', this.onMouseMove);
      window.addEventListener('mouseup', this.onMouseUp);
    },

    onMouseUp(event) {
      // 清除事件
      window.removeEventListener('mousemove', this.onMouseMove);
      window.removeEventListener('mouseup', this.onMouseUp);
      // 重置状态
      this.mouseDown = false;
      // 移动矩形的样式清空
      let divElement = document.getElementById('rectangular');
      divElement.style.display = 'none';
      this.handMouseUp(event);
    },
    //鼠标左键抬起方法
    handMouseUp(event) {
      this.end_x = event.clientX;
      this.end_y = event.clientY;
      if (this.start_x == this.end_x) {
        this.selectIds = [];
        return false;
      }

      //核心内容，根据你的鼠标移动矩形区域来判断div是否在里面
      this.mouseDown = false;
      let seats = document.getElementsByName('seat-td');
      for (let i = 0; i < seats.length; i++) {
        const seat = seats[i];
        let id = parseInt(seat.id);
        let el = seat.getBoundingClientRect();
        let top = el.top; //上边界
        let left = el.left; //左边界
        let right = el.right; //右边界
        let bottom = el.bottom; //下边界
        //从左往右
        if (this.start_x < this.end_x) {
          //从下到上
          if (this.start_y > this.end_y) {
            if (top < this.start_y && bottom > this.end_y) {
              if (left < this.end_x && right > this.start_x) {
                if (this.selectIds.indexOf(id) === -1) {
                  this.selectIds.push(id);
                }
              }
            }
          }
          //从上到下
          else {
            if (top < this.end_y && bottom > this.start_y) {
              if (left < this.end_x && right > this.start_x) {
                if (this.selectIds.indexOf(id) === -1) {
                  this.selectIds.push(id);
                }
              }
            }
          }
          //从右往左
        } else {
          //从下到上
          if (this.start_y > this.end_y) {
            if (top < this.start_y && bottom > this.end_y) {
              if (left < this.start_x && right > this.end_x) {
                if (this.selectIds.indexOf(id) === -1) {
                  this.selectIds.push(id);
                }
              }
            }
          }
          //从上到下
          else {
            if (top < this.end_y && bottom > this.start_y) {
              if (left < this.start_x && right > this.end_x) {
                if (this.selectIds.indexOf(id) === -1) {
                  this.selectIds.push(id);
                }
              }
            }
          }
        }
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.form-section {
  padding: 24px;
}
.mg-lf {
  margin-left: 8px;
}
.blue-input {
  background-color: #b3d7ff;
  border: none;
  width: 12px;
  height: 12px;
  position: absolute;
  top: 8px;
  left: 5px;
  font-size: 12px;
  &:focus {
    border: none;
    outline: none;
  }
}
.title {
  width: 56px;
  height: 20px;
  font-size: 14px;
  font-weight: 400;
  color: #333333;
  line-height: 20px;
}
.container {
  border: 1px solid #eeeeee;
  position: relative;
}
.aside {
  position: relative;
  box-shadow: 1px 0px 0px 0px #eeeeee;
  // .div-fixed {
  //   position: fixed;
  //   top: 60px;
  // }
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
    width: 70px;
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
  margin: 0px auto;
  margin-bottom: 8px;
}
.sort-btn {
  clear: both;
  border: 1px solid #3d7fff;
  color: #3d7fff;
  background: #fff;
  padding: 12px 20px;
  font-size: 14px;
  border-radius: 4px;
  text-align: center;
  box-sizing: border-box;
  margin: 10px auto;
  display: block;
}
.main {
  background-color: #f9f9fa;
  overflow-x: auto;
  width: 100%;
}
.seattable {
  margin: 100px auto;
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
.rectangular {
  background-color: rgba(235, 239, 243, 0.45);
  position: fixed;
  border: 1px solid rgba(24, 135, 243, 1);
  z-index: 20000;
}
</style>