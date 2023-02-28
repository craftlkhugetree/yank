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
   * 下载文件
   * @param {*} fileid
   */
  downloadFile(fileid) {
    window.location.href = store.state.downUrl + fileid;
  },

}
