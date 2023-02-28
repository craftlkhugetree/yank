import service from "@/assets/js/util";
import g from "@/assets/js/global";
import common from "@/assets/js/common";
import store from "@/store";
import _ from "loadsh";
function userInfo() {
  return store.state.userInfo;
}
function userId() {
  let s = userInfo();
  return s.ID || common.getUserInfo().ID;
}
function combine(obj, data) {
  let d = _.cloneDeep(data);
  let tmp = {};
  for (let p in d) {
    tmp[p] = d[p] || obj[p];
  }
  // besides filter is an obj
  return { ...obj, ...tmp };
}
const depArr = common.getStore("userDepts") || [];
const depId = depArr.map(d => d.ID).join(",") || "";
// const depId = depArr.map(d => d.GROUPUSERID).join(",") || "";

// /workOrder/query列表查询;
export function workOrder_query(data) {
  let d = combine({ orderBy: "createTime", sort: "desc" }, data);
  let id = userId();
  if (data.roleName === g.DCJC) {
    d.filter.createId = id;
  } else if (data.roleName === g.YWZX) {
    d.filter[g.handleDeptId] = depId;
  } else if (data.roleName === g.DCGL) {
    delete d.filter;
  }
  delete d.fun;
  delete d.funTab;
  delete d[g.roleName];
  return service.postAjax({
    code: g.code,
    url: "/workOrder/query",
    isRep: true,
    loadingText: "",
    data: d
  });
}
// /workOrder/movedList;转移;
export function workOrder_movedList(data) {
  let d = combine({ orderBy: "createTime", sort: "desc" }, data);
  d.filter[g.handleDeptId] = depId;
  delete d.fun;
  delete d.funTab;
  delete d[g.roleName];
  return service.postAjax({
    code: g.code,
    url: "/workOrder/movedList",
    isRep: true,
    data: d
  });
}
// /workOrder/overview督查概览
export function workOrder_overview(data) {
  return service.postAjax({
    code: g.code,
    url: "/workOrder/overview/?userId=" + data,
    // loadingText: "",
    isGet: true
  });
}
// /workOrder/save;保存;
export function workOrder_save(data) {
  let id = userId();
  let name = userInfo().NAME;
  data.createId = id;
  data.createName = name;
  return service.postAjax({
    code: g.code,
    url: "/workOrder/save",
    isRep: true,
    data
  });
}
// /workOrder/find / { id };根据ID查询;
export function workOrder_find(data) {
  return service.postAjax({
    code: g.code,
    url: "/workOrder/find/" + data,
    loadingText: "",
    isGet: true
  });
}
// /workOrder/checkReply;复查确认 / 确认;
export function workOrder_checkReply(data) {
  return service.postAjax({
    code: g.code,
    url: "/workOrder/checkReply",
    isRep: true,
    data
  });
}
// 整改反馈
export function workOrder_handleReply(data) {
  return service.postAjax({
    code: g.code,
    url: "/workOrder/handleReply",
    isRep: true,
    data
  });
}
// /workOrder/move;转移;
export function workOrder_move(data) {
  return service.postAjax({
    code: g.code,
    url: "/workOrder/move",
    isRep: true,
    data
  });
}
// /workLabel/query
export function workLabel_query(data) {
  // let d = { orderBy: "useCount", sort: "desc", ...data };
  let d = combine({ orderBy: "useCount", sort: "desc" }, data);
  return service.postAjax({
    code: g.code,
    url: "/workLabel/query",
    isRep: true,
    loadingText: "",
    data: d
  });
}

// /workArea/query列表查询
export function workArea_query(data) {
  return service.postAjax({
    code: g.code,
    url: "/workArea/query",
    loadingText: "",
    isRep: true,
    data
  });
}

// /workCampus/query列表查询
export function workCampus_query(data) {
  return service.postAjax({
    code: g.code,
    url: "/workCampus/query",
    isRep: true,
    data
  });
}

// 转存语音
export function pushVoice(id) {
  return service.postAjax({
    code: g.code,
    url: "/attach/wxVoice/" + id,
    isGet: true
  });
}

// /commonReply/query;列表查询;
export function commonReply_query(data) {
  let d = combine({ orderBy: "createTime", sort: "desc" }, data);
  d.filter[g.handleDeptId] = depId;
  return service.postAjax({
    code: g.code,
    url: "/commonReply/query",
    isRep: true,
    data: d
  });
}

// /historyReply/query;列表查询;
export function historyReply_query(data) {
  let d = combine({ orderBy: "createTime", sort: "desc" }, data);
  d.filter[g.handleDeptId] = depId;
  return service.postAjax({
    code: g.code,
    url: "/historyReply/query",
    isRep: true,
    data: d
  });
}
// /historyReply/save;
export function historyReply_save(data) {
  return service.postAjax({
    code: g.code,
    url: "/historyReply/save",
    isRep: true,
    data
  });
}
