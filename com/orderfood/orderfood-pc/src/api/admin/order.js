import service from "@/assets/js/util";

// 提交订单
export function saveOrder(data) {
    return service.postAjax({
        code: "url",
        url: "order/save",
        isRep: true,
        data
    })
}

// 支付订单
export function payOrder(data) {
    return service.postAjax({
        code: "url",
        url: "order/pay",
        data
    })
}

// 订单列表
export function fetchAllOrderList(data) {
    return service.postAjax({
        code: "url",
        url: "order/items",
        isRep: true,
        data
    })
}

// 订单列表-分页
export function fetchOrderList(data) {
    return service.postAjax({
        code: "url",
        url: "order/pageQuery",
        isRep: true,
        data
    })
}

// 订单数量
export function fetchOrderNum(data) {
    return service.postAjax({
        code: "url",
        url: "order/getOrderNums",
        data
    })
}

// 订单详情
export function fetchOrderDetail(data) {
    return service.postAjax({
        code: "url",
        url: "order/findById",
        data
    })
}

// 订单-确认送达
export function signOrder(data) {
    return service.postAjax({
        code: "url",
        url: "order/sign",
        data
    })
}

// 订单-打印
export function printOrders(data) {
    return service.postAjax({
        code: "url",
        url: "order/print",
        data
    })
}


// 订单-取消
export function cancelOrders(data) {
    return service.postAjax({
        code: "url",
        url: "order/cancelOrder",
        data
    })
}

// 订单-删除
export function deleteOrders(data) {
    return service.postAjax({
        code: "url",
        url: "order/delOrder",
        data
    })
}