import service from "@/assets/js/util";

// 获取物料列表
export function fetchGoodsList() {
    return service.postAjax({
        code: "url",
        url: "goods/list",
        isRep: true,
        data: {}
    })
}

// 等待叫号列表
export function fetchWaitList(data) {
    return service.postAjax({
        code: "url",
        url: "bill/waitting",
        data
    })
}

// 叫号中列表
export function fetchCallList(data) {
    return service.postAjax({
        code: "url",
        url: "bill/calling",
        data
    })
}

// 结束列表
export function fetchEndList(data) {
    return service.postAjax({
        code: "url",
        url: "bill/ended",
        data
    })
}

// 暂停/恢复叫号
export function changeGoodsStatus(id) {
    return service.postAjax({
        code: "url",
        url: `goods/changeSuspended/${id}`,
        isGet: true
    })
}

// 选叫
export function chooseOne(id) {
    return service.postAjax({
        code: "url",
        url: `bill/choose/${id}`,
        isGet: true
    })
}


// 获取鹤位列表
export function fetchOutPortList(data) {
    return service.postAjax({
        code: "url",
        url: "outport/list",
        isRep: true,
        data
    })
}

// 重新分配
export function changeOutport(id) {
    return service.postAjax({
        code: "url",
        url: `bill/changeOutport/${id}`,
        isGet: true
    })
}

// 故障
export function isFault(id) {
    return service.postAjax({
        code: "url",
        url: `bill/fault/${id}`,
        isGet: true
    })
}

// 取消
export function cancelOrder(id) {
    return service.postAjax({
        code: "url",
        url: `bill/cancel/${id}`,
        isGet: true
    })
}

// 装车
export function load(id) {
    return service.postAjax({
        code: "url",
        url: `bill/load/${id}`,
        isGet: true
    })
}

// 称重
export function weight(data) {
    return service.postAjax({
        code: "url",
        url: "bill/weight",
        isRep: true,
        data
    })
}
