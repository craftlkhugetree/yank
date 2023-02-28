import service from "@/assets/js/util";
//绩效管理
// 我的绩效奖励查询
export function fetchMyKpi(data) {
    return service.postAjax({
        code: "url",
        url: "/kpi/myKpi",
        data
    })
}

// 已审核保存附件
export function saveAttachment(data) {
    return service.postAjax({
        code: "url",
        url: "kpi/saveAttachment",
        // isRep: true,
        data
    })
}


// 保存草稿
export function saveKpi(data) {
    return service.postAjax({
        code: "url",
        url: "kpi/save",
        isRep: true,
        data
    })
}

// 确认
export function confirmKpi(data) {
    return service.postAjax({
        code: "url",
        url: "kpi/confirm",
        isRep: true,
        data
    })
}

//撤回
export function withdrawKpi(data) {
    return service.postAjax({
        code: "url",
        url: "kpi/withdraw",
        isRep: true,
        data
    })
}

//根据日期查询
export function findKpiByDate(data) {
    return service.postAjax({
        code: "url",
        url: "kpi/findByDate",
        data
    })
}

//根据id查询
export function findKpiById(data) {
    return service.postAjax({
        code: "url",
        url: "kpi/findById",
        data
    })
}

//查询用户历史记录
export function findUserDetails(data) {
    return service.postAjax({
        code: "url",
        url: "kpi/userDetails",
        data
    })
}


//审核
export function reviewKpi(data) {
    return service.postAjax({
        code: "url",
        url: "kpi/review",
        isRep: true,
        data
    })
}


//待审核
export function needReviews(data) {
    return service.postAjax({
        code: "url",
        url: "kpi/needReviews",
        isRep: true,
        data
    })
}

//已审核
export function myReviewed(data) {
    return service.postAjax({
        code: "url",
        url: "kpi/myReviewed",
        data
    })
}

//已创建的月绩效单
export function usedMonthFee(data) {
    return service.postAjax({
        code: "url",
        url: "kpi/usedMonthFee",
        // isRep: true,
        data
    })
}


