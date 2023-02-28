import moment from 'moment';
import * as XLSX from 'xlsx';
export default {
  /**
   * 表格中字段为空时的默认转换
   * @param {*} row
   * @param {*} column
   * @param {*} value
   */
  defaultFormat(row, column, value) {
    if (value) {
      return value;
    } else {
      return '--';
    }
  },

  /**
   * 表格中时间的默认转换
   * @param {*} row
   * @param {*} column
   * @param {*} value
   * @param {*} index
   * @param {*} format
   */
  timeFormat(row, column, value, index, format) {
    if (value) {
      let f = format || 'YYYY-MM-DD HH:mm:ss';
      return moment(value, 'YYYYMMDDHHmmss').format(f);
    } else {
      return '--';
    }
  },

  /**
   * 时间的默认转换
   * @param {*} value
   * @param {*} format
   */
  defaultTimeFormat(value, format) {
    if (value) {
      let f = format || 'YYYY-MM-DD HH:mm:ss';
      return moment(value, 'YYYYMMDDHHmmss').format(f);
    } else {
      return '--';
    }
  },

  /**
   * 下载文件
   * @param {*} fileid
   */
  downloadFile(fileid) {
    window.location.href = window.g.downUrl + fileid;
  },

  /**
   * 多人预约签到签退
   * @param {*} obj
   */
  signEvents(obj) {
    if (obj.type == '2' || obj.type == '3') {
      obj.resultnote = '';
      obj.note = obj.type == '2' ? '签到' : '签退';
      obj.name = obj.type == '2' ? '签到' : '签退';
    }
  },
  // 二维数组
  exportExcel(arr, fileName) {
    let ws = XLSX.utils.aoa_to_sheet(arr);
    let wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws);
    XLSX.writeFile(wb, fileName);
  },

  // 导入Excel
  getFile(obj) {
    const { e, _this, $searchBar } = obj;
    let f = e.target.files[0];
    // this.$refs.uploadDom.value = '';
    ($searchBar || _this.$refs.searchBar).clear();
    if (!judgeIfExcel(f)) {
      _this.$message({
        showClose: true,
        type: 'warning',
        message: '仅支持xlsx、xls格式文件',
      });
      return;
    }
    if (f.size > 10 * 1000 * 1000) {
      _this.$message({
        showClose: true,
        type: 'warning',
        message: '文件大小不能超过10M',
      });
      return;
    }
    const fileReader = new FileReader();
    fileReader.onload = ev => {
      const workbook = XLSX.read(ev.target.result, {
        type: 'binary',
      });
      const wsname = workbook.SheetNames[0];
      const ws = XLSX.utils.sheet_to_json(workbook.Sheets[wsname]);
      console.log('ws:', ws); // 转换成json的数据
      checkExcelData(ws, obj);
    };
    fileReader.readAsBinaryString(f);
  },
  // 确认小弹窗
  showPopup(obj) {
    const { _this, txt, tips, type, fun } = obj;
    _this
      .$confirm(txt, tips, {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type,
      })
      .then(fun)
      .catch(() => {
        return;
      });
  },
  judgeTitle(title, str, condition = true) {
    return title.indexOf(str) > -1 && condition;
  },
};

function judgeIfExcel(file) {
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
}

function checkExcelData(data, obj) {
  const { _this, key, title, regCheck, callback, commonParams } = obj;
  if (!Array.isArray(data)) {
    throw '需要数组';
  }
  if (!data.length) {
    _this.$message({
      showClose: true,
      type: 'warning',
      message: '导入文件没有数据',
    });
    throw '没有数据';
  }
  const head = Object.keys(data[0]) || [];
  const arr = head.filter((t, index, A) => A.indexOf(t) === index) || [];
  let flag = 0;
  if (!arr.length) {
    ++flag;
  }
  arr.forEach(item => {
    if (!title.includes(item)) {
      ++flag;
    }
  });
  if (flag) {
    _this.$message({
      showClose: true,
      type: 'warning',
      message: '表头有误，请按模板导入。',
    });
    throw '表头有误';
  }
  let arrT = [];
  data.forEach(obj => {
    let msg = regCheck({ obj });
    if (msg) {
      flag++;
      _this.$message({
        duration: 3000,
        showClose: true,
        type: 'warning',
        message: msg,
      });
      throw msg;
    }
    let arrEle = { ...commonParams };
    title.forEach((item, index) => {
      arrEle[key[index]] = obj[item];
    });
    arrT.push(arrEle);
  });
  if (!flag) {
    arrT.length &&
      arrT.forEach(a => {
        for (let key in a) {
          if (key && a[key] && a[key].length && a[key].length > 800) {
            _this.$message({
              showClose: true,
              type: 'warning',
              message: '单行文字过多，请编辑后重新导入',
            });
            throw '单行文字过多，请编辑后重新导入';
          }
        }
      });
    callback(arrT);
  }
}
