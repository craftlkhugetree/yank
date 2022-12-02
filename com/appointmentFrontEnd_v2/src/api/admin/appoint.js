import service from "@/assets/js/util";

// 预约单列表
export function fetchApplyList(data) {
    return service.postAjax({
        code: "url",
        url: "apply/pageQuery",
        isRep: true,
        data
    })
}

// 预约单详情
export function getApplyDetail(data) {
    return service.postAjax({
        code: "url",
        url: "apply/findById",
        data
    })
}

// 取消预约
export function doCancel(data) {
    return service.postAjax({
        code: "url",
        url: "apply/cancel",
        data
    })
}

