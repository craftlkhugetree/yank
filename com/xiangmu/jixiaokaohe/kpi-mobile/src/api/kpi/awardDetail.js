import service from "@/assets/js/util";

// 我的绩效奖励查询
export function fetchMyKpi(data) {
    return service.postAjax({
        code: "url",
        url: "kpi/myKpi",
        data
    })
}

