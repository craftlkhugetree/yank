import util from "./util";
import global from "./global";

/**
 * 报修模块====================>
 */

// 获取状态数量
export const getCountFlag = data => {
  return util.postAjax({
    code: global.code,
    url: "/bmRepair/countFlag",
    isRep: true,
    data
  });
};

// 报修人获取报修列表
export const getMyRepairs = data => {
  return util.postAjax({
    code: global.code,
    url: "/bmRepair/myRepairs",
    isRep: true,
    data
  });
};

// 维修人员获取维修列表
export const pageQuery = data => {
  return util.postAjax({
    code: global.code,
    url: "/bmRepair/pageQuery",
    isRep: true,
    data
  });
};

// 批量处理报修
export const handleBatch = data => {
  return util.postAjax({
    code: global.code,
    url: "/bmRepair/handleBatch",
    isRep: true,
    data
  });
};

// 维修人员转移报修
export const move = data => {
  return util.postAjax({
    code: global.code,
    url: "/bmRepair/move",
    isRep: true,
    data
  });
};

// 批量转移报修
export const moveBatch = data => {
  return util.postAjax({
    code: global.code,
    url: "/bmRepair/moveBatch",
    isRep: true,
    data
  });
};

// 提交或暂存报修
export const save = data => {
  return util.postAjax({
    code: global.code,
    url: "/bmRepair/save",
    isRep: true,
    data
  });
};

// 删除报修
export const deleteId = id => {
  return util.postAjax({
    code: global.code,
    url: "/bmRepair/delete/" + id,
    isGet: true
  });
};

// 根据ID查询
export const findId = id => {
  return util.postAjax({
    code: global.code,
    url: "/bmRepair/find/" + id,
    isGet: true
  });
};

// 评价
export const evaluation = data => {
  return util.postAjax({
    code: global.code,
    url: "/bmRepair/evaluation",
    isRep: true,
    data
  });
};

/**
 * <====================报修模块
 */

/**
 * 消息/待办模块====================>
 */
// 任务列表
export const myTasks = data => {
  return util.postAjax({
    code: global.code,
    url: "/bmTask/myTasks",
    isRep: true,
    data
  });
};

// 消息列表
export const myMessages = data => {
  return util.postAjax({
    code: global.code,
    url: "/bmMessage/myMessages",
    isRep: true,
    data
  });
};

/**
 *<====================消息模块
 */
