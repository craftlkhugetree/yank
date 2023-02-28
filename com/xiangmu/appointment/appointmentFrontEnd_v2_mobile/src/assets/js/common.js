import moment from "moment"
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
};