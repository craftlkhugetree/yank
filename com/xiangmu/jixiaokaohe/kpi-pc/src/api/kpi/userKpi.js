import service from "@/assets/js/util";

// 人员绩效列表
export function fetchUserKpiList(data) {
    return service.postAjax({
        code: "url",
        url: "kpi/personKpi",
        isRep: true,
        data
    })
}

// 人员绩效详情
export function fetchUserKpiDetail(data) {
    return service.postAjax({
        code: "url",
        url: "kpi/personKpiDetail",
        data
    })
}
