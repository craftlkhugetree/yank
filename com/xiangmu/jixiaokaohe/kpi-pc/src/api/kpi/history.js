import service from "@/assets/js/util";

//历史记录列表
export function fetchHistoryList(data) {
    return service.postAjax({
        code: "url",
        url: "kpi/pageQuery",
        isRep: true,
        data
    })
}

//操作记录
export function fetchKpiDetail(data) {
    return service.postAjax({
        code: "url",
        url: "kpi/findById",
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
