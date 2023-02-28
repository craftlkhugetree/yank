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
      let f = format || "YYYY-MM-DD"
      return moment(value, "YYYYMMDDHHmmss").format(f)
    } else {
      return "--"
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
  allTimeFormat(row, column, value, index, format) {
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
   * 下载文件
   * @param {*} fileid
   */
  downloadFile(fileid) {
    window.location.href = window.g.downUrl + fileid;
  },
  /**
     * 获取日期
     * 
     */
  getDate(datestr) {
    var temp = datestr.split("-");
    var date = new Date(temp[0], temp[1] - 1, temp[2]);
    return date;
  },

  /**
    * 获取两个日期之间的日
    * 
    */
  getRangeDay(start, end) {
    let dateList = [];
    while (end.getTime() - start.getTime() >= 0) {
      var year = start.getFullYear();
      var month =
        start.getMonth() + 1 < 10
          ? "0" + (start.getMonth() + 1)
          : start.getMonth() + 1;
      var day =
        start.getDate().toString().length == 1
          ? "0" + start.getDate()
          : start.getDate();
      dateList.push(month + "-" + day);
      start.setDate(start.getDate() + 1);
    }
    return dateList;
  },
  /**
    * 小数转换成百分比
    */
  toPercent(point) {
    if (point == 0) {
      return 0;
    }
    let str = parseFloat(point).toFixed(2);
    str += "%";
    return str;
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
          fontSize: 12,
          interval: 0
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
  },
  /**
   * 设置系列数据 (折线图、堆叠图)
   * @param {*} legendData 
   * @param {*} dataArr 
   * @param {*} type  line / bar
   * @param {*} isarea  是否展示面积
   */
  setSeriesData(legendData, dataArr, type, isarea) {
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
      itemStyle: {},
      smooth: true
    };
    if (isarea) {
      lineStyle.areaStyle = {
        color: {
          type: 'linear',
          x: 0,
          y: 0,
          x2: 0,
          y2: 1,
          colorStops: [{
            offset: 0,
            color: "rgba(58,120,252,0.25)" // 0% 处的颜色
          }, {
            offset: 1,
            color: "rgba(255,255,255,0.25)" // 100% 处的颜色
          }],
          global: false // 缺省为 false
        }
      }
    }
    let style = type === "line" ? lineStyle : barStyle;
    let colors = ["#3A78FC", "#FF6F4B"];
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
}