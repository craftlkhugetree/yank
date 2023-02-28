import moment from "moment";
import store from "../../store";
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
   * 转换时间格式
   * @param {String} time 14位字符串时间
   */
  timeFormat(time, format) {
    if (time) {
      let newFormat = format || "YYYY-MM-DD  HH:mm:ss";
      return moment(time,"YYYYMMDDHHmmss").format(newFormat);
    } else {
      return "--";
    }
  },

  /**
   * 转换维修类型
   * @param {String} type 
   */
  typeFormat(type) {
    if (type) {
      let list = store.state.repairTypeList
      let index = list.findIndex(i => i.id === type);
      if (index >= 0) {
        return list[index].name;
      } else {
        return "--"
      }
    } else {
      return "--"
    }
  },

  /**
   * 转换报修区域
   * @param {String} type 
   */
  areaTypeFormat(type) {
    if (type) {
      let list = store.state.repairAreaList
      let index = list.findIndex(i => i.id === type);
      if (index >= 0) {
        return list[index].name;
      } else {
        return "--"
      }
    } else {
      return "--"
    }
  },

  /**
   * 转换维修部门
   * @param {String} deptid 
   */
  deptFormat(deptid) {
    if (deptid) {
      let list = store.state.deptList
      let index = list.findIndex(i => i.ID === deptid);
      if (index >= 0) {
        return list[index].NAME;
      } else {
        return "--"
      }
    } else {
      return "--"
    }
  },

  /**
   * 转换维修状态
   * @param {String} status 
   */
  statusFormat(status) {
    switch (status) {
      case "1":
      case "2":
        return "等待派单";
        break;
      case "3":
        return "维修中";
        break;
      case "4":
        return "维修完工";
        break;
      case "5":
        return "维修结束";
        break;
      default:
        return "--";
    }
  },

  /**
   * 转换事件状态
   * @param {String} type  1办理2撤回3退回4处理5维修完工6评价9转移
   * @param {String} handletype
   * @param {String} result 1已完结 0未修复
   */
  eventFormat(type, handletype, result) {
    switch (type) {
      case "1":
        return "办理";
        break;
      case "2":
        return "撤回";
        break;
      case "3":
        return "退回";
        break;
      case "4":
        switch (handletype) {
          case "1": // 派单
          case "4": // 重复报修
            return "派单";
            break;
          case "2": // 已维修
          case "3": // 暂不维修
            return "维修完工";
            break;
        }
        break;
      case "5":
        return "维修完工";
        break;
      case "6":
        if (result === "1") {
          return "维修结束";
        } else {
          return "维修未修复";
        }
        break;
      case "9":
        return "转移";
        break;
      default:
        return type;
    }
  },
  /**
   * 统计  设置表格数据
   * @param {*} header 
   * @param {*} body 
   */
  setTableData(header, body) {
    let arr = [];
    body.forEach((data, i) => {
      let obj = {};
      header.forEach((head, j) => {
        obj[head] = data[j];
      });
      arr.push(obj);
    });
    return {
      header: header,
      data: arr
    };
  },

  /**
   * 设置系列数据 
   * @param {*} legendData 
   * @param {*} dataArr 
   * @param {*} type  line / bar
   */
  setSeriesData(legendData, dataArr, type) {
    let barStyle = {
      type: "bar",
      barMaxWidth: 50,
      stack: "bar",
      itemStyle: {},
      labelLine: {
        show: true
      }
    };
    let lineStyle = {
      type: "line",
      itemStyle: {}
    };
    let style = type === "line" ? lineStyle : barStyle;
    let colors = ["#FF6F4B", "#3A78FC"];
    // 图形数据
    let arr = [];
    let len = legendData.length;
    legendData.forEach((name, index) => {
      let obj = _.cloneDeep(style);
      obj.name = name;
      obj.data = [];
      if (type === "line") {
        obj.itemStyle.color = colors[index];
      } else {
        let opacity = (1 / len) * (len - index);
        obj.itemStyle.color = `rgba(58,120,252,${opacity})`;
      }
      dataArr.forEach(i => {
        obj.data.push(i[name]);
      });
      arr.push(obj);
    });
    // 折线数据
    if (type === "bar") {
      let lineData = dataArr.map(i => {
        let sum = 0;
        legendData.forEach(name => {
          sum += parseInt(i[name])
        });
        return sum;
      });
      let line = {
        name: "总计",
        type: "line",
        data: lineData,
        itemStyle: {
          color: "#3a78fc"
        }
      };
      arr.push(line);
    }
    return arr;
  },

  /**
   * 设置图表配置项
   * @param {*} legendData 
   * @param {*} xAxisData 
   * @param {*} seriesData 
   */
  setOptions(legendData, xAxisData, seriesData) {
    let obj = {
      tooltip: {
        trigger: "axis",
        backgroundColor: "rgba(255,255,255,0.95)",
        padding: [5, 12],
        axisPointer: {
          type: "line",
          lineStyle: {
            color: "#000000",
            opacity: 0.1,
            width: 1
          }
        },
        textStyle: {
          fontSize: 12,
          lineHeight: 30,
          color: "#000000"
        },
        extraCssText: "box-shadow: 0px 9px 28px 8px rgba(0, 0, 0, 0.05), 0px 6px 16px 0px rgba(0, 0, 0, 0.08), 0px 3px 6px -4px rgba(0, 0, 0, 0.12);"
      },
      legend: {
        data: legendData,
        left: 20,
        top: 10,
        icon: "rect",
        itemHeight: 1,
        itemWidth: 10,
        textStyle: {
          color: "#2a2e2e"
        }
      },
      grid: {
        left: "20px",
        right: "20px",
        bottom: "20px",
        containLabel: true
      },
      xAxis: {
        type: "category",
        data: xAxisData,
        axisLabel: {
          color: "#999999",
          fontSize: 12
        },
        axisLine: {
          lineStyle: {
            color: "rgba(65,97,128,0.45)"
          }
        },
        axisPointer: {
          label: {
            color: "#cccccc",
            fontWeight: "bold"
          }
        }
      },
      yAxis: {
        type: "value",
        axisLabel: {
          color: "#999999",
          fontSize: 12
        },
        axisLine: {
          show: false,
          lineStyle: {
            color: "#e2e2e2"
          }
        },
        splitLine: {
          lineStyle: {
            color: "#e2e2e2"
          }
        }
      },
      series: seriesData
    }
    return obj;
  }
}
