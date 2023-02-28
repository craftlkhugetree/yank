import moment from "moment"
let BigDecimal = require('js-big-decimal');
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
      let f = format || "YYYY-MM-DD HH:mm:ss"
      return moment(value, "YYYYMMDDHHmmss").format(f)
    } else {
      return "--"
    }
  },

  /**
   * 时间的默认转换
   * @param {*} value
   * @param {*} format
   */
  defaultTimeFormat(value, format) {
    if (value) {
      let f = format || "YYYY-MM-DD HH:mm:ss"
      return moment(value, "YYYYMMDDHHmmss").format(f)
    } else {
      return "--"
    }
  },

  /**
  * 两数相加
  * @param {*} p1
  * @param {*} p2
  * @param {*} precision 精度
  */
  add(p1, p2, precision) {
    let a = p1 || 0;
    let b = p2 || 0;
    if (precision) {
      return BigDecimal.round(BigDecimal.add(a.toString(), b.toString()), precision);
    } else {
      return BigDecimal.add(a.toString(), b.toString());
    }
  },
  /**
    * 两数相减
    * @param {*} p1
    * @param {*} p2
    * @param {*} precision 精度
    */
  subtract(p1, p2, precision) {
    let a = p1 || 0;
    let b = p2 || 0;
    if (precision) {
      return BigDecimal.round(BigDecimal.subtract(a.toString(), b.toString()), precision);
    } else {
      return BigDecimal.subtract(a.toString(), b.toString());
    }
  },


  /**
   * 转换为两位小数的金额格式
   * @param value 金额
   */
  moneyFormat(value) {
    let newV = "";
    if (value) {
      newV = BigDecimal.round(value.toString(), 2); // 两位小数点
      return BigDecimal.getPrettyValue(newV);       // 千分位
    } else {
      return "--";
    };
  },

  /**
   * el-input输入框  金额限制输入格式:整数或两位小数点
   * @param {*} $event
   */
  moneyInput(e) {
    e.target.value = e.target.value.replace(/[^\d.]/g, '');
    e.target.value = e.target.value.replace(/\.{2,}/g, '.');
    e.target.value = e.target.value.replace(/^\./g, '0.');
    e.target.value = e.target.value.replace(/^\d*\.\d*\./g, e.target.value.substring(0, e.target.value.length - 1));
    e.target.value = e.target.value.replace(/^0[^\.]+/g, '');
    e.target.value = e.target.value.replace(/^(\d+)\.(\d\d).*$/, '$1.$2');

  },

  /**
  *   计算合计时 金额限制输入格式:整数或两位小数点
  * @param {*} $event
  */
  filterInput(value) {
    if (value) {
      value = value.toString();
      value = value.replace(/[^\d.]/g, '');
      value = value.replace(/\.{2,}/g, '.');
      value = value.replace(/^\./g, '0.');
      value = value.replace(/^\d*\.\d*\./g, value.substring(0, value.length - 1));
      value = value.replace(/^0[^\.]+/g, '');
      value = value.replace(/^(\d+)\.(\d\d).*$/, '$1.$2');
    }
    return value
  },

  //文件下载
  downloadFile(fileid) {
    window.location.href = window.g.downUrl + fileid;
  },
  //文件预览
  reviewFile(fileid) {
    window.location.href = window.g.viewUrl + fileid;
  },
  formatJson(filterVal, jsonData) {
    return jsonData.map(v => filterVal.map(j => v[j]));
  },
  /**
    * 根据数组对象的某个字段去重
    * item.name  是[{name:1}] 根据每条数据的name值来去重
    * */
  unique(arr, val) {
    const res = new Map();
    return arr.filter(item => !res.has(item[val]) && res.set(item[val], 1));
  },

}