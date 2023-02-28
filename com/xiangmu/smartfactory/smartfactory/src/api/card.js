import service from "@/assets/js/util";

// 获取列表-提货单
export function fetchCardList(data) {
    return service.postAjax({
        code: "url",
        url: "bill/pageQuery",
        isRep: true,
        data
    })
}


// 开卡
export function saveCard(data) {
    return service.postAjax({
        code: "url",
        url: "bill/openCard",
        isRep: true,
        data
    })
}

// 详情
export function fetchDetail(id) {
    return service.postAjax({
        code: "url",
        url: `bill/find/${id}`,
        isGet: true
    })
}

// 查询订单-根据身份证
export function searchOrderByID(data) {
    return service.postAjax({
        code: "url",
        url: `bill/getOrders`,
        // isRep: true,
        data
    })
}

// 查询订单-根据卡号
export function searchOrderByCard(data) {
    return service.postAjax({
        code: "url",
        url: `bill/findByCardNo`,
        data
    })
}

// 绑定卡号
export function bindCard(id) {
    return service.postAjax({
        code: "url",
        url: `bill/changeCard/${id}`,
        isGet: true
    })
}

// 归还卡片
export function backCard(id) {
    return service.postAjax({
        code: "url",
        url: `bill/returnCard/${id}`,
        isGet: true
    })
}

// 装车记录
export function fetchRecord(id) {
    return service.postAjax({
        code: "url",
        url: `bill/find/${id}`,
        isGet: true
    })
}
