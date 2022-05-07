import moment from "moment"
let BigDecimal = require('js-big-decimal');
import store from "@/store"
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
      let f = format || "YYYY-MM-DD HH:mm"
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
      let f = format || "YYYY-MM-DD HH:mm"
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
    let newV = "";
    if (value) {
      newV = BigDecimal.round(value.toString(), 2); // 两位小数点
      return BigDecimal.getPrettyValue(newV); // 千分位
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


  //文件下载
  downloadFile(fileid) {
    window.location.href = window.g.downUrl + fileid;
  },
  //文件预览
  reviewFile(fileid) {
    window.location.href = window.g.viewUrl + fileid;
  },

  // 资料形式
  learnTypeFormat(type) {
    let list = store.state.trainTypeList
    let obj = list.find(i => i.value == type) || {}
    return obj.label || "--";
  },

  // 资料大小 KB
  learnSizeFormat(size) {
    if(size < 1024) {
      return this.divide(size, 1, 1) + "B"
    }
    if(size < 1024 * 1024) {
      return this.divide(size, 1024, 1) + "KB"
    }
    if(size < 1024 * 1024 * 1024) {
      return this.divide(size, 1024 * 1024, 1) + "M"
    } else {
      return this.divide(size, 1024 * 1024 * 1024, 1) + "G"
    }
  },


  /**
   * 函数防抖（只执行最后一次点击）
   * 其原理就第一次调用函数，创建一个定时器，在指定的时间间隔之后运行代码。当第二次调用该函数时，
   * 它会清除前一次的定时器并设置另一个。如果前一个定时器已经执行过了，这个操作就没有任何意义。
   * 然而，如果前一个定时器尚未执行，其实就是将其替换为一个新的定时器，然后延迟一定时间再执行。
   * @param fn
   * @param delay
   * @returns {Function}
   * @constructor
   */
  debounce(fn, delay = 500) {
    let timer = null
    return function () {
      if(timer) clearTimeout(timer);
      timer = setTimeout(() => {
        fn.apply(this, arguments)
      }, delay);
    }
  },

  /**
   * 函数节流
   * 规定在一个单位时间内，只能触发一次函数，如果这个单位时间内触发多次函数，只有一次生效
   * 其原理是用时间戳来判断是否已到回调该执行时间，记录上次执行的时间戳，然后每次触发事件执行回调，
   * 回调中判断当前时间戳距离上次执行时间戳的间隔是否已经到达 规定时间段，如果是，则执行，并更新上次执行的时间戳，如此循环
   * @param fn
   * @param interval
   * @returns {Function}
   * @constructor
   */
  throttle(fn, interval = 500) {
    let last, timer
    return function () {
      let args = arguments
      /**
       * 记录当前函数触发的时间
       * +new Date()这个操作是将该元素转换成Number类型
       * 等同于Date.prototype.getTime()
       */
      let now = +new Date()
      if (last && now - last < interval) {
        clearTimeout(timer)
        itmer = setTimeout(() => {
          last = now
          fn.apply(this, args)
        }, interval)
      } else {
        last = now
        fn.apply(this, args)
      }
    }
  },


  /**
   * 深拷贝
   * @param {Object} obj 要拷贝的对象
   * @param {Map} map 用于存储循环引用对象的地址
   */
  deepClone(obj = {}, map = new Map()) {

    if(typeof obj !== "object") {return obj}

    let res = Array.isArray(obj) ? [] : {}
    // 防止循环引用
    if(map.get(obj)) {return map.get(obj)}
    map.set(obj, res)

    for(const key in obj) {
      // 保证 key 不是原型属性
      if(obj.hasOwnProperty(key)) {
        res[key] = this.deepClone(obj[key], map)
      }
    }
    return res
  }

}