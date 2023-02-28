import service from "@/assets/js/util";

// 待审核列表
export function fetchAuditList() {
    return service.postAjax({
        code: "url",
        url: "kpi/needReviews"
    })
}

// 已审核列表
export function fetchAuditedList() {
    return service.postAjax({
        code: "url",
        url: "kpi/myReviewed"
    })
}

// 审核
export function doKpiAudit(data) {
    return service.postAjax({
        code: "url",
        url: "kpi/review",
        isRep: true,
        data
    })
}