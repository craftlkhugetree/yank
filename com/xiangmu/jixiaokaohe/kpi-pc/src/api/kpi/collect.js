import service from "@/assets/js/util";
//绩效汇总发放
//列表
export function fetchList(data) {
    return service.postAjax({
        code: "url",
        url: "collect/collectList",
        data
    })
}

//确认发放
export function sendCollect(data) {
    return service.postAjax({
        code: "url",
        url: "collect/send",
        data
    })
}

//暂不发放
export function unsendCollect(data) {
    return service.postAjax({
        code: "url",
        url: "collect/unsend",
        data
    })
}

//取消汇总
export function cancelCollect(data) {
    return service.postAjax({
        code: "url",
        url: "collect/cancel",
        data
    })
}

//查看汇总
export function findCollectById(data) {
    return service.postAjax({
        code: "url",
        url: "collect/findById",
        data
    })
}

//汇总
export function collectSave(data) {
    return service.postAjax({
        code: "url",
        url: "collect/save",
        isRep: true,
        data
    })
}

