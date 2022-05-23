import service from "@/assets/js/util";

// 列表
export function fetchReport(data) {
    return service.postAjax({
        code: "url",
        url: "report/pageQuery",
        isRep: true,
        data,
    })
}

// 删除
export function deleteByIds(data) {
    return service.postAjax({
        code: "url",
        url: "report/delete",

        data,
    })
}