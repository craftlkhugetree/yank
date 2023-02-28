<template>
  <el-dialog
    :title="isUploadShow ? '导入座位' : ''"
    :visible.sync="dialogVisible"
    width="35%"
    v-loading="loading"
    :close-on-click-modal="false"
  >
    <!-- <el-divider></el-divider> -->
    <div v-if="isUploadShow">
      <el-row>
        <el-button @click="toUpload" size="medium" icon="el-icon-upload2">上传文件</el-button>
        <span class="hint">&nbsp;&nbsp;{{ onlyExcel }}</span>
      </el-row>
      <el-row>
        <span class="temp" @click="download">下载座位模板</span>
      </el-row>
      <el-row v-if="filename">
        <img src="@/assets/img/fujian.png" style="width: 14px; height: 14px" />
        <span>{{ filename }}</span>
        <!-- <span class="close" v-if="filename" @click="void 0"></span> -->
      </el-row>
      <input
        type="file"
        :multiple="false"
        @change="getFile"
        title="上传文件"
        accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
        class="upload-input"
        ref="uploadDom"
      />
    </div>

    <span slot="footer" class="dialog-footer">
      <el-button @click="cancel">取 消</el-button>
      <el-button type="primary" @click="submitExcel">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import * as XLSX from 'xlsx';
export default {
  name: 'importDialog',
  props: {
    id: String,
  },
  components: {
    // upload: () => import("@/components/BaseUpload"),
  },
  data() {
    return {
      filename: '',
      seat: [],
      onlyExcel: '仅支持xlsx、xls格式文件',
      dialogVisible: false,
      isUploadShow: true,
      seatT: {
        座位: '1',
        过道: '2',
        书架: '3',
        墙: '4',
        门: '5',
        窗: '6',
        // 疫情座位: '7',
      },
      ifNull: 0,
      loading: false,
    };
  },
  methods: {
    cancel() {
      this.ifNull = 0;
      this.dialogVisible = false;
      this.filename = '';
      this.seat = [];
      this.isUploadShow = true;
    },
    submitExcel() {
      if (this.seat.length) {
        this.$message({
          type: 'success',
          message: '文件导入成功',
        });
        this.$emit('importExcel', _.cloneDeep(this.seat));
      }
      this.cancel();
    },
    judgeIfExcel(file) {
      if (file && file.name) {
        const nArr = file.name.split('.');
        if (nArr && nArr.length > 0) {
          return ['xlsx', 'xls'].includes(nArr[nArr.length - 1].toLowerCase());
        } else {
          return false;
        }
      } else {
        return false;
      }
    },
    // check excel's data
    checkExcelData(info = {}) {
      const { row, r, col, c, isWall, obj } = info;
      let ifSeat = ['1', '7'].includes(obj.type);
      const msg = [];
      const reg = /^[0-9]+$/;
      const seatType = Object.keys(this.seatT).filter(s => s !== '座位');
      if (!col) {
        this.ifNull ? null : (msg.push(`【】：` + '数据组成矩形且不能有空格。'), (this.ifNull = 1));
      } else {
        if (isWall && ifSeat) {
          msg.push(`【${col}】：` + '座位不能出现在边框。');
        }
        if (!(seatType.includes(col) || (obj.type == '1' && reg.test(col)))) {
          msg.push(
            `【${col}】：` +
              "导入文件中只能包含'过道, 书架, 墙, 门, 窗', 而座位只能用数字表示。"
          );
        }
      }
      return msg;
    },
    // 导入Excel
    getFile(event) {
      let _this = this;
      let f = event.target.files[0];
      this.$refs.uploadDom.value = '';
      if (!this.judgeIfExcel(f)) {
        this.$message({
          showClose: true,
          type: 'warning',
          message: this.onlyExcel,
        });
        return;
      }
      if (f.size > 10 * 1000 * 1000) {
        this.$message({
          showClose: true,
          type: 'warning',
          message: '文件大小不能超过10M',
        });
        return;
      }
      let rABS = false; //是否将文件读取为二进制字符串

      let reader = new FileReader();
      //if (!FileReader.prototype.readAsBinaryString) {
      FileReader.prototype.readAsBinaryString = function (f) {
        let binary = '';
        let rABS = false; //是否将文件读取为二进制字符串
        let wb; //读取完成的数据
        let outdata;
        let reader = new FileReader();
        reader.onload = function (e) {
          let bytes = new Uint8Array(reader.result);
          let length = bytes.byteLength;
          for (let i = 0; i < length; i++) {
            binary += String.fromCharCode(bytes[i]);
          }
          function fixdata(data) {
            //文件流转BinaryString(不需要此功能可以删掉)

            var o = '',
              l = 0,
              w = 10240;

            for (; l < data.byteLength / w; ++l)
              o += String.fromCharCode.apply(null, new Uint8Array(data.slice(l * w, l * w + w)));

            o += String.fromCharCode.apply(null, new Uint8Array(data.slice(l * w)));

            return o;
          }

          if (rABS) {
            wb = XLSX.read(btoa(fixdata(binary)), {
              // 手动转化
              type: 'base64',
            });
          } else {
            wb = XLSX.read(binary, {
              type: 'binary',
            });
          }
          //   outdata = XLSX.utils.sheet_to_html(wb.Sheets[wb.SheetNames[0]]); //outdata就是你想要的东西
          outdata = XLSX.utils.sheet_to_txt(wb.Sheets[wb.SheetNames[0]]); //outdata就是你想要的东西
          //   let a = outdata.split("</tr><tr>");
          const hasWall = outdata && outdata.indexOf('墙') > -1;
          const arr1 = outdata.split('\n');
          const arr2 = arr1 && arr1.length > 0 ? arr1.map(a => a.split('\t')) : [];
          // cut the empty rows&cols
          // const t = arr2.filter((row) => row.length > 0 && row.some((r) => r));
          let t = arr2.filter(row => row.length);
          while (t[0]) {
            if (!t[0].some(r => r)) {
              t.shift();
            } else {
              break;
            }
          }
          while (t[t.length - 1]) {
            if (!t[t.length - 1].some(r => r)) {
              t.pop();
            } else {
              break;
            }
          }
          const index = {};
          const seatType = Object.keys(_this.seatT) || [];
          t.forEach(item => {
            item.forEach((ie, id) => {
              if (!ie || !ie.trim()) {
                index[id] = index[id] ? ++index[id] : 1;
                item[id] = '过道';
              } else {
                if (!seatType.includes(ie) && !/\w+/.test(ie)) {
                  item[id] = '过道';
                }
              }
            });
            // 补竖墙
            if (!hasWall) {
              item.unshift('墙');
              item.push('墙');
            }
          });
          let tLen = t.length;
          let count = 0;
          // 削掉空列
          for (let i = 0; i < t[0].length - 1; i++) {
            if (index[i] === tLen) {
              count++;
            } else {
              break;
            }
          }

          let rLen = 0;
          for (let j = t[0].length - 1; j >= 0; j--) {
            if (index[j] === tLen) {
              rLen++;
            } else {
              break;
            }
          }
          t.forEach(item => {
            for (let i = 1; i <= rLen; i++) {
              item.pop();
            }
          });
          t.forEach(item => {
            item.splice(0, count);
          });

          // 补横墙
          if (!hasWall) {
            t.unshift(new Array(t[0].length).fill('墙'));
            t.push(new Array(t[0].length).fill('墙'));
          }

          _this.seat = _this.initSeat(t, f);
          // console.log(outdata, arr1, arr2);
        };
        reader.readAsArrayBuffer(f);
      };
      if (rABS) {
        reader.readAsArrayBuffer(f);
      } else {
        reader.readAsBinaryString(f);
      }
    },
    initSeat(arr = [], f = {}) {
      const seatType = this.seatT;
      const seat = [];
      let seatId = 0;
      let warnMsg = [];
      arr.forEach((row, r) => {
        if (row instanceof Array) {
          row.forEach((col, c) => {
            let isWall = r == 0 || c == 0 || r == arr.length - 1 || c == row.length - 1;
            let obj = {
              colno: c + 1,
              rowno: r + 1,
              id: '',
              seatId: ++seatId,
              isopen: '',
              isWall,
              name: isWall && seatType[col] == '4' ? '0' : seatType[col] ? ' ' : col,
              sectionid: this.id === 'create' ? '' : this.id,
              type: seatType[col] ? seatType[col] : '1',
              isDbClick: false,
            };
            // if(obj.type == '7') {
            //   obj.type = '1'
            //   obj.isopen = '0'
            // }
            let tstr = this.checkExcelData({ row, r, col, c, isWall, obj });
            warnMsg = warnMsg.concat(tstr);
            seat.push(obj);
          });
        }
      });
      if (warnMsg.length > 0) {
        let str = '';
        warnMsg.forEach(m => {
          str += m + '<br/>';
        });
        this.$message({
          dangerouslyUseHTMLString: true,
          showClose: true,
          type: 'error',
          message: str,
        });
        return;
      }
      this.filename = f.name;
      return seat;
    },
    toUpload() {
      this.$refs.uploadDom.click();
    },
    download() {
      this.loading = true;
      const data = [
        ['墙', '门', '门', '墙', '墙', '墙', '墙'],
        ['墙', '过道', '过道', '过道', '过道', '过道', '窗'],
        ['墙', '过道', '1', '2', '3', '过道', '窗'],
        ['墙', '过道', '4', '5', '6', '过道', '墙'],
        ['墙', '过道', '书架', '书架', '书架', '过道', '墙'],
        ['墙', '过道', '7', '8', '9', '过道', '墙'],
        ['墙', '过道', '10', '11', '12', '过道', '墙'],
        ['墙', '过道', '书架', '书架', '书架', '过道', '墙'],
        ['墙', '过道', '13', '14', '15', '过道', '墙'],
        ['墙', '过道', '16', '17', '18', '过道', '墙'],
        ['墙', '过道', '书架', '书架', '书架', '过道', '墙'],
        ['墙', '过道', '19', '20', '21', '过道', '墙'],
        ['墙', '过道', '22', '23', '24', '过道', '墙'],
        ['墙', '过道', '过道', '过道', '过道', '过道', '墙'],
        ['墙', '门', '门', '墙', '墙', '墙', '墙'],
      ];
      try {
        let ws = XLSX.utils.aoa_to_sheet(data);
        let wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws);
        XLSX.writeFile(wb, '座位预约模板.xlsx');
        setTimeout(() => {
          this.loading = false;
        }, 3000);
      } catch (e) {
        this.loading = false;
      }
    },
  },
  mounted() {
    this.isUploadShow = true;
  },
};
</script>

<style scoped>
.uploadbtn {
  width: 80px;
  height: 16px;
  background: rgba(0, 106, 229, 1);
  border-radius: 5px;
  color: #fff;
  padding: 4px 10px;
  cursor: pointer;
}
.upload-input {
  display: none;
}
.hint {
  width: 155px;
  height: 22px;
  font-size: 14px;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
  color: rgba(0, 0, 0, 0.65);
  line-height: 22px;
}
.temp {
  width: 84px;
  height: 22px;
  display: block;
  overflow-wrap: break-word;
  color: rgba(61, 127, 255, 1);
  font-size: 14px;
  text-decoration: underline;
  white-space: nowrap;
  line-height: 22px;
  text-align: left;
  margin: 8px 0;
  cursor: pointer;
}
.close {
  position: absolute;
  /* display: inline-block; */
  width: 14px;
  height: 14px;
  margin: 2px 0;
}
.close:before,
.close:after {
  position: absolute;
  left: 15px;
  content: ' ';
  height: 12px;
  width: 2px;
  background-color: #333;
}
.close:before {
  transform: rotate(45deg);
}
.close:after {
  transform: rotate(-45deg);
}
</style>
