import service from "@/assets/js/util";

// 分类列表
export function fetchTypeList(data) {
  return service.postAjax({
    code: "url",
    url: "shopitemtype/items",
    isRep: true,
    data
  })
}
// 分类上下架数量
export function fetchTypeNums(data) {
  return service.postAjax({
    code: "url",
    url: "shopitem/itemShowNums",
    data
  })
}
// 餐厅
export function fetchShops(data) {
  return service.postAjax({
    code: 'url',
    url: 'shop/items',
    data,
    isRep: true
  })
};
// 餐厅配置信息
export function fetchConfigs(data) {
  return service.postAjax({
    code: 'url',
    url: 'shopconfig/items', //'shop/items',
    data,
    isRep: true
  })
};

// 菜品列表
export function fetchFoodList(data) {
  return service.postAjax({
    code: 'url',
    url: 'shopitem/pageQuery',
    data,
    isRep: true
  })
};


// 不分页菜品列表
export function fetchAllFoodList(data) {
  return service.postAjax({
    code: 'url',
    url: 'shopitem/items',
    data,
    isRep: true
  })
};

// 菜品的详情
export function fetchDetail(data) {
  return service.postAjax({
    code: 'url',
    url: 'shopitem/findById',
    data,
  })
};


// 订餐
export function saveOrder(data) {
  return service.postAjax({
    code: 'url',
    url: 'order/save',
    data,
    isRep: true
  })
};


// 获取订单信息
export function getOrderById(data) {
  return service.postAjax({
    code: 'url',
    url: 'order/findById',
    data,
  })
};

// 订单签收
export function orderSign(data) {
  return service.postAjax({
    code: 'url',
    url: 'order/sign',
    data,
  })
};

// 获取本人超过30天未结算的订单数量
export function getNoSettleNum() {
  return service.postAjax({
    code: "url",
    url: "order/getOverMonthNoSettleNum"
  })
}


//支付
export function payOrder(data) {
  return service.postAjax({
    code: "url",
    url: "order/pay",
    data
  })
}

//取消订单 
export function cancelOrder(data) {
  return service.postAjax({
    code: "url",
    url: "order/cancelOrder",
    data
  })
}

//当前登录人对应菜品购买量 （限购一人份）
export function getItemBuyNum(data) {
  return service.postAjax({
    code: "url",
    url: "shopitem/getItemBuyNum",
    data
  })
}







