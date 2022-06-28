import service from "@/assets/js/util";
// 列表
export function fetchAllCafeTypeList(data) {
    return service.postAjax({
        code: "url",
        url: "shoptype/items",
        isRep: true,
        data,
    })
}

// 列表-分页
export function fetchCafeTypeList(data) {
    return service.postAjax({
        code: "url",
        url: "shoptype/pageQuery",
        isRep: true,
        data,
    })
}
// 保存
export function saveCafeType(data) {
    return service.postAjax({
        code: "url",
        url: "shoptype/save",
        isRep: true,
        data,
    })
}
// 删除
export function deleteCafeType(data) {
    return service.postAjax({
        code: "url",
        url: "shoptype/delete",
        data,
    })
}

// 排序-up
export function sortCafeTypeUp(data) {
    return service.postAjax({
        code: "url",
        url: "shoptype/up",
        data,
    })
}

// 排序-down
export function sortCafeTypeDown(data) {
    return service.postAjax({
        code: "url",
        url: "shoptype/down",
        data,
    })
}


