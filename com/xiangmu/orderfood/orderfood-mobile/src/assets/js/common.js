import moment from "moment"
let BigDecimal = require('js-big-decimal');
import {
  getItemBuyNum,
} from "@/api/client/order";
export default {
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
   * 下载文件
   * @param {*} fileid
   */
  downloadFile(fileid) {
    window.location.href = window.g.downUrl + fileid;
  },

  /**
   * 图片预览
   * @param {*} photo
   */
  viewIcon(photo) {
    return `${window.g.viewUrl}${photo}`;
  },

  // 格式转换
  sendTimeFormat(time) {
    let arr = time.split(',');
    let timeArr = [];
    arr.forEach(i => {
      let iTime = i.split('-');
      timeArr.push(`${iTime[0]} ~ ${iTime[1]}`);
    });
    return timeArr.join('，');
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

  // 获取个人对应该菜品的下单量
  fetchItemBuyNum(food) {
    return new Promise((resolve, reject) => {
      let param = {
        id: food.id,
      };
      getItemBuyNum(param).then(res => {
        let buyNum = res.data;
        let curPerNum = parseInt(this.subtract(food.onelimitnum, buyNum, 0));
        console.log('res', res, curPerNum);
        let obj = { curPerNum };
        resolve(curPerNum);
      });
    });
  },

  // 获取个人对应该菜品的下单量
  fetchByitemid(food) {
    return new Promise((resolve, reject) => {
      let param = {
        id: food.itemid,
      };
      console.log('id', food);
      getItemBuyNum(param).then(res => {
        let buyNum = res.data;
        let curPerNum = parseInt(this.subtract(food.onelimitnum, buyNum, 0));
        console.log('res', res, curPerNum);
        let obj = { curPerNum };
        resolve(curPerNum);
      });
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
  // 期望取餐
  expectFetch(orderData) {
    return !orderData.senddate && !orderData.sendtime
      ? '--'
      : (orderData.senddate
          ? moment(orderData.senddate, 'YYYYMMDDHHmmss').format('YYYY-MM-DD')
          : '') +
          ' ' +
          // (orderData.orderway && orderData.orderway == 1 ? orderData.sendtime || '' : '');
          (orderData.sendtime || '');
  },
  transIOS(str) {
    var arr = str.split(/[- : \/]/);
    return new Date(arr[0], arr[1] - 1, arr[2], arr[3], arr[4]);
  },
};