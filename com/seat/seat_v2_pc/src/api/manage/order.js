import service from "@/assets/js/util";

// 列表
export function fetchOrder(data) {
  return service.postAjax({
    code: "url",
    url: "order/pageQuery",
    isRep: true,
    data,
  });
}

// 列表
export function queryOrderBySeatid(data) {
  return service.postAjax({
    code: "url",
    url: "order/queryOrderBySeatid",
    data,
  });
}

/**
 * 当前区间的预约记录
 * @param {*} data
 * @returns
 */
export function adminOrderRecords(data) {
  return service.postAjax({
    code: "url",
    url: `order/adminOrderRecords`,
    data,
    isRep: true,
  });
}

// 取消预约
export function adminCancel(data) {
  return service.postAjax({
    code: "url",
    url: `order/adminCancel`,
    data,
    // isRep: true,
  });
}

// 预约座位
export function adminOrder(data) {
  return service.postAjax({
    code: "url",
    url: `order/adminOrder`,
    data,
    isRep: true,
  });
}
