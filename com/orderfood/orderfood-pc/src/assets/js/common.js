import moment from "moment"
let BigDecimal = require('js-big-decimal');
import {
  fetchBuyNum
} from "@/api/admin/food";
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
   * 两数相乘
   * @param {*} p1
   * @param {*} p2
   * @param {*} precision 精度
   */
  multiply(p1, p2, precision) {
    let a = p1 || 0;
    let b = p2 || 0;
    if (precision) {
      return BigDecimal.round(BigDecimal.multiply(a.toString(), b.toString()), precision);
    } else {
      return BigDecimal.multiply(a.toString(), b.toString());
    }
  },

  /**
   * 两数相除
   * @param {*} p1
   * @param {*} p2
   * @param {*} precision 精度
   */
  divide(p1, p2, precision) {
    let prec = precision || 4;
    let a = p1 || 0;
    let b = p2 || 1;
    return BigDecimal.divide(a.toString(), b.toString(), prec);
  },

  /**
   * 转换为两位小数的金额格式
   * @param value 金额
   */
  moneyFormat(value) {
    let newV = '';
    if (value) {
      newV = BigDecimal.round(value.toString(), 2); // 两位小数点
      return BigDecimal.getPrettyValue(newV); // 千分位
    } else {
      return '0.00';
    }
  },

  /**
   * el-input输入框  金额限制输入格式:整数或两位小数点
   * @param {*} $event
   */
  moneyInput(e) {
    e.target.value = e.target.value.replace(/[^\d.]/g, '');
    e.target.value = e.target.value.replace(/\.{2,}/g, '.');
    e.target.value = e.target.value.replace(/^\./g, '0.');
    e.target.value = e.target.value.replace(
      /^\d*\.\d*\./g,
      e.target.value.substring(0, e.target.value.length - 1)
    );
    e.target.value = e.target.value.replace(/^0[^\.]+/g, '');
    e.target.value = e.target.value.replace(/^(\d+)\.(\d\d).*$/, '$1.$2');
  },

  //文件下载
  downloadFile(fileid) {
    window.location.href = window.g.downUrl + fileid;
  },
  //文件预览
  reviewFile(fileid) {
    window.location.href = window.g.viewUrl + fileid;
  },

  // 订单状态  单位：1-待确认，2-配送中，3-已送达  个人：1-待配餐，2-待取餐，3-已取餐
  statusFormat(orderstatus, ordertype) {
    let newV = null;
    switch (orderstatus) {
      case '0':
        newV = '等待支付';
        break;
      case '1':
        newV = ordertype == 'group' ? '待确认' : '待配餐';
        break;
      case '2':
        newV = ordertype == 'group' ? '配送中' : '待取餐';
        break;
      case '3':
        newV = ordertype == 'group' ? '已送达' : '已取餐';
        break;
      case '4':
        newV = '已取消';
        break;
    }
    return newV;
  },

  // 备餐单位格式转换
  unitFormat(unit) {
    let data = null;
    switch (unit) {
      case 'minute':
        data = '分钟';
        break;
      case 'hour':
        data = '小时';
        break;
      case 'day':
        data = '天';
        break;
    }
    return data;
  },

  // 获取个人对应该菜品的下单量
  fetchItemBuyNum(food) {
    return new Promise((resolve, reject) => {
      let param = {
        id: food.id,
      };
      fetchBuyNum(param).then(res => {
        let buyNum = res.data;
        let curPerNum = parseInt(this.subtract(food.onelimitnum, buyNum, 0));
        resolve(curPerNum);
      });
    });
  },

  // 设置菜品的剩余数量 和 最大可选值
  setLastAndMaxNum(list) {
    list.forEach(i => {
      if (i.alllimit == '1') {
        i.lastnum = parseInt(this.subtract(i.alllimitnum, i.allbuynum, 0));
      }
      // 设置限制文本 和 限制数量
      if (i.alllimit == '1' && i.onelimit == '0') {
        i.limittext = `剩余${i.lastnum}份`;
        i.max = i.lastnum;
      } else if (i.alllimit == '0' && i.onelimit == '1') {
        i.limittext = `限${i.onelimitnum}份/人`;
        i.max = i.onelimitnum;
      } else if (i.alllimit == '1' && i.onelimit == '1') {
        i.limittext = i.lastnum > i.onelimitnum ? `限${i.onelimitnum}份/人` : `剩余${i.lastnum}份`;
        let max = i.lastnum > i.onelimitnum ? i.onelimitnum : i.lastnum;
        i.max = max;
      }
    });
  },

  // 转换取餐时间
  pickupTimeText(obj) {
    let shopDetail = obj || {};
    let str = shopDetail.pickuptime;
    let d1 = '$',
      d2 = '|';
    if ([2, 3].includes(shopDetail.orderway)) {
      // arr字符串数组
      let arr = (str && str.split(d2)) || [];
      if (arr.length) {
        let label = arr.shift();
        let labelArr = label.split(d1);
        if (labelArr.length && !labelArr[0]) {
          labelArr.shift();
        }
        if (labelArr.length && !labelArr[labelArr.length - 1]) {
          labelArr.pop();
        }
        const tmp = [];
        labelArr.forEach(b => {
          tmp.push(b ? { text: b, isVal: 0 } : { text: '', isVal: 1 });
        });
        let valArr = tmp.filter(t => t.isVal);
        valArr.forEach((v, id) => {
          v.text = arr[id] || '';
        });
        str = '';
        tmp.forEach(t => {
          str += t.text;
        });
      }
    }
    return str || '--';
  },
};