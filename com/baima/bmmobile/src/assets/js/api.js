import util from './util';
import global from './global';

/**
 * 科教资源====================>
 */
// 资源库维护列表查询
export const eduTypePageQuery = data => {
  return util.postAjax({
    code: global.bmCode,
    url: "/eduType/pageQuery",
    isRep: true,
    data
  });
};

// 资源库维护id详情
export const find = id => {
  return util.postAjax({
    code: global.bmCode,
    url: "/eduType/find/" + id,
    isGet: true
  });
};
// 资源类型不分页查询
export const eduTypeList = data => {
  return util.postAjax({
    code: global.bmCode,
    url: "/eduType/list",
    isRep: true,
    data
  });
};

// 资源库维护-原资源日常管理，列表查询
export const eduResourcePageQuery = data => {
  return util.postAjax({
    code: global.bmCode,
    url: "/eduResource/pageQuery",
    isRep: true,
    data
  });
};

// 资源库维护-原资源日常管理，不分页查询
export const eduResourceList = data => {
  return util.postAjax({
    code: global.bmCode,
    url: "/eduResource/list",
    isRep: true,
    data
  });
};

// 资源入驻分页查询
export const eduResourceResourceCheckList = data => {
  return util.postAjax({
    code: global.bmCode,
    url: "/eduResource/resourceCheckList",
    isRep: true,
    data
  });
};

// 资源库维护-原资源日常管理，id查询
export const eduResourceFind = id => {
  return util.postAjax({
    code: global.bmCode,
    url: "/eduResource/find/" + id,
    isGet: true
  });
};
// 批量强制退出
export const forceCheckoutBatch = data => {
  return util.postAjax({
    code: global.bmCode,
    url: "/eduResource/forceCheckoutBatch",
    data
  });
};
// 资源库维护-原资源日常管理，批量删除
export const batchDel = data => {
  return util.postAjax({
    code: global.bmCode,
    url: "/eduResource/batchDel",
    data
  });
};

export const batchOpen = data => {
  return util.postAjax({
    code: global.bmCode,
    url: "/eduResource/batchOpen",
    data
  });
};

export const batchClose = data => {
  return util.postAjax({
    code: global.bmCode,
    url: "/eduResource/batchClose",
    data
  });
};

// 续租资源查询id   
export const eduResourceReCheckin = data => {
  return util.postAjax({
    code: global.bmCode,
    url: "/eduResource/reCheckin",
    data
  });
};

// 资源退出
export const eduResourceCheckoutApply = data => {
  return util.postAjax({
    code: global.bmCode,
    url: "/eduResource/checkoutApply",
    data
  });
};


// 下载资源库模板
export const downloadTemplate = id => {
  return util.postAjax({
    code: global.bmCode,
    url: "/eduResource/downloadTemplate/" + id,
    isGet: true
  });
};

// 入驻管理列表查询
export const eduResourceUserecordPageQuery = data => {
  return util.postAjax({
    code: global.bmCode,
    url: "/eduResourceUserecord/pageQuery",
    isRep: true,
    data
  });
};
// 入驻资源id
export const eduResourceUserecordFind = id => {
  return util.postAjax({
    code: global.bmCode,
    url: "/eduResourceUserecord/find/" + id,
    isGet: true
  });
};
// 编辑联系人电话
export const eduResourceUserecordChangeContacter = data => {
  return util.postAjax({
    code: global.bmCode,
    url: "/eduResourceUserecord/changeContacter",
    data
  });
};


// 费用列表查询
export const eduResourceAmountPageQuery = data => {
  return util.postAjax({
    code: global.bmCode,
    url: "/eduResourceAmount/pageQuery",
    isRep: true,
    data
  });
};

// 费用id查询
export const eduResourceAmountFind = id => {
  return util.postAjax({
    code: global.bmCode,
    url: "/eduResourceAmount/find/" + id,
    isGet: true
  });
};

// 费用id删除
export const eduResourceAmountDelete = id => {
  return util.postAjax({
    code: global.bmCode,
    url: "/eduResourceAmount/delete/" + id,
    isGet: true
  });
};
// 缴费
export const eduResourceAmountPay = id => {
  return util.postAjax({
    code: global.bmCode,
    url: "/eduResourceAmount/pay/" + id,
    isGet: true
  });
};

// 科教资源申请列表
export const eduApplyPageQuery = data => {
  return util.postAjax({
    code: global.bmCode,
    url: "/eduApply/pageQuery",
    isRep: true,
    data
  });
};
// 科教资源申请保存
export const eduApplySave = data => {
  return util.postAjax({
    code: global.bmCode,
    url: "/eduApply/save",
    isRep: true,
    data
  });
};
// 科教资源申请撤回
export const eduApplyWithdraw = data => {
  return util.postAjax({
    code: global.bmCode,
    url: "/eduApply/withdraw",
    isRep: true,
    data
  });
};
// 申请查询id
export const eduApplyFind = id => {
  return util.postAjax({
    code: global.bmCode,
    url: "/eduApply/find/" + id,
    isGet: true
  });
};


/**
 *<====================科教资源
 */


/**
 * 报修模块====================>
 */

// 获取状态数量
export const getCountFlag = data => {
  return util.postAjax({
    code: global.bmCode,
    url: '/bmRepair/countFlag',
    isRep: true,
    data,
  });
};

// 报修人获取报修列表
export const getMyRepairs = data => {
  return util.postAjax({
    code: global.bmCode,
    url: '/bmRepair/myRepairs',
    isRep: true,
    data,
  });
};

// 维修人员获取维修列表
export const pageQuery = data => {
  return util.postAjax({
    code: global.bmCode,
    url: '/bmRepair/pageQuery',
    isRep: true,
    data,
  });
};

// 批量转移报修
export const moveBatch = data => {
  return util.postAjax({
    code: global.bmCode,
    url: "/bmRepair/moveBatch",
    isRep: true,
    data
  });
};

// 批量处理报修
export const handleBatch = data => {
  return util.postAjax({
    code: global.bmCode,
    url: '/bmRepair/handleBatch',
    isRep: true,
    data,
  });
};

// 维修人员转移报修
export const move = data => {
  return util.postAjax({
    code: global.bmCode,
    url: '/bmRepair/move',
    isRep: true,
    data,
  });
};

// 提交或暂存报修
export const save = data => {
  return util.postAjax({
    code: global.bmCode,
    url: '/bmRepair/save',
    isRep: true,
    data,
  });
};

// 删除报修
export const deleteId = id => {
  return util.postAjax({
    code: global.bmCode,
    url: '/bmRepair/delete/' + id,
    isGet: true,
  });
};

// 根据ID查询
export const findId = id => {
  return util.postAjax({
    code: global.bmCode,
    url: '/bmRepair/find/' + id,
    isGet: true,
  });
};

// 评价
export const evaluation = data => {
  return util.postAjax({
    code: global.bmCode,
    url: '/bmRepair/evaluation',
    isRep: true,
    data,
  });
};

/**
 * <====================报修模块
 */