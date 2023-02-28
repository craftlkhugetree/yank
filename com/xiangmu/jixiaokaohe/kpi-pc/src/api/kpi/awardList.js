import service from "@/assets/js/util";

// 绩效清单列表
export function fetchKpiList(data) {
    return service.postAjax({
        code: "url",
        url: "kpi/pageQuery",
        isRep: true,
        data
    })
}

// 绩效详情
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
