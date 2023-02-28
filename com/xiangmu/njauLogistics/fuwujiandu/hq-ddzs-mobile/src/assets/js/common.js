import moment from "moment";
import store from "../../store/index";
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

  // 转换类型格式
  typeFormat(type) {
    switch (type) {
      case "1":
        return "咨询";
        break;
      case "2":
        return "投诉";
        break;
      case "3":
        return "表扬";
        break;
      case "4":
        return "反馈";
        break;
      case "5":
        return "其他";
        break;
    }
  },

  /**
   * 转换时间格式
   * @param {String} time 14位字符串时间
   */
  timeFormat(time, format) {
    if (time) {
      let day = time.substring(0, 8);
      let hour = time.substring(8) || "000000";
      let newTime = `${day}T${hour}`;
      let newFormat = format || "YYYY-MM-DD  HH:mm:ss";
      return moment(newTime).format(newFormat);
    } else {
      return "--";
    }
  },

  /**
   * 下载文件
   * @param {*} fileid
   */
  downloadFile(fileid) {
    window.location.href = store.state.downUrl + fileid;
  },

  dashVal(v) {
    return v || v === 0 ? v : "--";
  },
  dealRes(res, success, fail) {
    // console.log(arguments.callee);
    if (res && res.code === "000000") {
      "function" === typeof success && success();
    } else {
      "function" === typeof fail && fail();
    }
  },
  getUserInfo() {
    let u = sessionStorage.getItem("dd_userInfo");
    return (u && JSON.parse(u)) || {};
  },
  setStore(str, value) {
    store.commit("set_" + str, value);
    sessionStorage.setItem("dd_" + str, JSON.stringify(value));
  },
  getStore(str) {
    let vx = store.state[str];
    let flag = vx || vx === 0;
    if (vx instanceof Array) {
      flag = vx.length > 0;
    } else if (typeof vx === "object") {
      flag = Object.keys(vx).length;
    }
    let st = sessionStorage.getItem("dd_" + str);
    return flag ? vx : st && JSON.parse(st);
  },
  removeStore(str, val) {
    sessionStorage.removeItem("dd_" + str);
    store.commit("set_" + str, val);
  },
  isTimeout(obj) {
    return obj && obj.events && obj.events.some(e => e.eventType == "7");
  },
  isMoved(obj) {
    return (
      obj &&
      obj.events &&
      obj.events.some(
        e => e.eventType == "8" && e.handleDeptId === this.getStore("depId")
      )
    );
  },
  back() {
    window.history.back();
  },
  genLoading(that) {
    // let caller = arguments.callee; // || that;
    that.$toast.loading({
      forbidClick: true,
      overlay: true,
      duration: 0
    });
  },

};
