import service from "@/assets/js/util";

// 我负责的考核组
export function fetchMyWorkGroups() {
    return service.postAjax({
        code: "url",
        url: "group/myWorkGroups",
    })
}

// 获取绩效详情
export function fetchKpiDetail(data) {
    return service.postAjax({
        code: "url",
        url: "kpi/findByDate",
        data
    })
}

// 已创建的月绩效清单
export function fetchUsedMonthKpiList(data) {
    return service.postAjax({
        code: "url",
        url: "kpi/usedMonthFee",
        data
    })
}


// 确认
export function doKpiConfirm(data) {
    return service.postAjax({
        code: "url",
        url: "kpi/confirm",
        isRep: true,
        data
    })
}

// 获取文件信息
export function fetchFileInfo(data) {
    return service.postAjax({
        code: "file",
        url: "rest/FileOut/getFiles",
        isRep: true,
        data
    })
}

// 待确认列表
export function fetchConfirmList(data) {
    return service.postAjax({
        code: "url",
        url: "kpi/needConfirm",
        data
    })
}

// 已确认列表
export function fetchConfirmedList(data) {
    return service.postAjax({
        code: "url",
        url: "kpi/confirmed",
        data
    })
}
