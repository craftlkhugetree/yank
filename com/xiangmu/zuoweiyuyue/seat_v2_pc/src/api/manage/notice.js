import service from "@/assets/js/util";

// 列表  
export function fetchNotice(data) {
    return service.postAjax({
        code: "url",
        url: "notice/pageQuery",
        isRep: true,
        data,
    })
}

//保存  
export function saveNotice(data) {
    return service.postAjax({
        code: "url",
        url: "notice/save",
        isRep: true,
        data,
    })
}

// 详情
export function queryById(data) {
    return service.postAjax({
        code: "url",
        url: "notice/findById",
        data,
    })
}

// 删除
export function deleteNotice(data) {
    return service.postAjax({
        code: "url",
        url: "notice/delete",
        data,
    })
}
