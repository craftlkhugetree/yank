import service from "@/assets/js/util";



//授权结算
export function authSettle(data) {
    return service.postAjax({
        code: "url",
        url: "settle/authSettle",
        data
    })
}

// 管理员转账 
export function confirmSettle(data) {
    return service.postAjax({
        code: "url",
        url: "settle/confirmSettle",
        data
    })
}

// 取消结算
export function cancelSettle(data) {
    return service.postAjax({
        code: "url",
        url: "settle/cancelSettle",
        data
    })
}

// 结算列表
export function fetchAllSettleList(data) {
    return service.postAjax({
        code: "url",
        url: "settle/items",
        isRep: true,
        data
    })
}

// 转账列表-分页
export function fetchSettleList(data) {
    return service.postAjax({
        code: "url",
        url: "settle/pageQuery",
        isRep: true,
        data
    })
}
// 结算统计数量
export function fetchSettleNum(data) {
    return service.postAjax({
        code: "url",
        url: "settle/settleNums",
        data
    })
}

// 转账管理--统计数量
export function fetchAccountNums(data) {
    return service.postAjax({
        code: "url",
        url: "settle/settleStatusNums",
        data
    })
}

// POST /settle/settleStatusNums

// 提交结算申请
export function fetchSubmitSettle(data) {
    return service.postAjax({
        code: "url",
        url: "settle/submitSettle",
        data,
        isRep: true,
    })
}

// 结算详情
export function fetchSettleDetail(data) {
    return service.postAjax({
        code: "url",
        url: "settle/findById",
        data
    })
}

// 获取经费科目列表 
export function fetchFundCodeList(data) {
    return service.postAjax({
        code: "url",
        url: "fundsno/pageQuery",
        data,
        isRep: true,
    })
}

// 保存经费科目编号
export function saveFundCode(data) {
    return service.postAjax({
        code: "url",
        url: "fundsno/save",
        data
    })
}

// 获取结算单位
export function fetchDepList(data) {
    return service.postAjax({
        code: "auth",
        url: "rest/Org/simpleList",
        data,
    })
}

// 获取本人超过30天未结算的订单数量
export function getNoSettleNnum() {
    return service.postAjax({
        code: "url",
        url: "order/getOverMonthNoSettleNum"
    })
}
