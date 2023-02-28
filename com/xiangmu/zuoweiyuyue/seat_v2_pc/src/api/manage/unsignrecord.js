import service from "@/assets/js/util";

// 列表
export function fetchUnsignrecord(data) {
    return service.postAjax({
        code: "url",
        url: "unsignrecord/pageQuery",
        isRep: true,
        data,
    })
}

// 保存
export function saveSection(data) {
    return service.postAjax({
        code: "url",
        url: "unsignrecord/save",
        isRep: true,
        data,
    })
}

// 删除
export function deleteByIds(data) {
    return service.postAjax({
        code: "url",
        url: "unsignrecord/deleteByIds",
        // isRep: true,
        data,
    })
}