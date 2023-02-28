

import Vue from "vue";
import moment from "moment";
// 俩日期相差多少分钟
export function diffmin(start, end) {
  let dura =
    moment(start).format("x") -
    moment(end).format("x");
  //计算时间差并转换成标准时间单位
  let alldura = moment.duration(dura);
  let diffMins =
    parseInt(alldura.minutes()) +
    parseInt(alldura.hours() * 60) +
    parseInt(alldura.days() * 24 * 60);
  // console.log('diffMins', start, end, diffMins)
  return diffMins;
};