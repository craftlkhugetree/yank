import service from "@/assets/js/util";

// 列表
export function fetchBlacklist(data) {
    return service.postAjax({
        code: "url",
        url: "blacklist/pageQuery",
        isRep: true,
        data,
    })
}

// 保存
export function saveSection(data) {
    return service.postAjax({
        code: "url",
        url: "section/save",
        isRep: true,
        data,
    })
}

// 删除
export function deleteBlackList(data) {
    return service.postAjax({
        code: "url",
        url: "blacklist/cancelById",
        data,
    })
}