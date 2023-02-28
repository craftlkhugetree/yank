import service from "@/assets/js/util";
import store from "@/store";

// 获取物料列表
export function fetchGoodsList() {
    return service.postAjax({
        code: "url",
        url: "goods/items",
        isRep: true,
        data: {}
    })
}

// 获取排队列表
export function fetchOrderList(data) {
    return service.postAjax({
        code: "url",
        url: "order/items",
        isRep: true,
        data
    })
}

// 暂停/恢复叫号
export function changeGoodsStatus(data) {
    return service.postAjax({
        code: "url",
        url: "goods/changeStatus",
        data
    })
}

// 选叫
export function chooseOne(data) {
    return service.postAjax({
        code: "url",
        url: "order/chooseOne",
        data
    })
}

// 下一号
export function callNext(data) {
    return service.postAjax({
        code: "url",
        url: "order/callNext",
        data
    })
}

// 获取装车台列表
export function fetchOutPortList(data) {
    return service.postAjax({
        code: "url",
        url: "edi/items",
        isRep: true,
        data
    })
}

// 重新分配
export function changeOutport(data) {
    return service.postAjax({
        code: "url",
        url: "order/changeEdi",
        data
    })
}

// 故障
export function isFault(data) {
    return service.postAjax({
        code: "url",
        url: "order/isFault",
        data
    })
}

// 取消
export function cancelOrder(data) {
    return service.postAjax({
        code: "url",
        url: "order/cancel",
        data
    })
}

// 测试用新增数据
export function addOrder(data) {
    return service.postAjax({
        code: "url",
        url: "order/mockaddData",
        isRep: true,
        data
    })
}