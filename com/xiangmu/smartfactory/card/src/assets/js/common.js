import moment from "moment";
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
      return "--";
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
      let f = format || "YYYY-MM-DD HH:mm";
      return moment(value, "YYYYMMDDHHmmss").format(f);
    } else {
      return "--";
    }
  },

  /**
   * 时间的默认转换
   * @param {*} value
   * @param {*} format
   */
  defaultTimeFormat(value, format) {
    if (value) {
      let f = format || "YYYY-MM-DD HH:mm";
      return moment(value, "YYYYMMDDHHmmss").format(f);
    } else {
      return "--";
    }
  },

  /**
   * 状态转换
   * @param {*} val
   * 1已开卡2已叫号3已称皮重4已装车5已称毛重6已还卡7故障8已过号9已取消
   */
  statusFormat(val) {
    let res = "";
    switch (val.toString()) {
      case "1":
        res = "已开卡";
        break;
      case "2":
        res = "已叫号";
        break;
      case "3":
        res = "已称皮重";
        break;
      case "4":
        res = "已装车";
        break;
      case "5":
        res = "已称毛重";
        break;
      case "6":
        res = "已还卡";
        break;
      case "7":
        res = "故障";
        break;
      case "8":
        res = "已过号";
        break;
      case "9":
        res = "已取消";
        break;
      default:
        res = "未开卡";
        break;
    }
    return res;
  },

  percentage(val) {
    let res = "";
    switch (val.toString()) {
      case "1":
        res = 20;
        break;
      case "2":
        res = 30;
        break;
      case "3":
        res = 40;
        break;
      case "4":
        res = 60;
        break;
      case "5":
        res = 80;
        break;
      case "6":
        res = 100;
        break;
      case "7":
        res = 100;
        break;
      case "8":
        res = 100;
        break;
      case "9":
        res = 100;
        break;
      default:
        res = 0;
        break;
    }
    return res;
  },
};
