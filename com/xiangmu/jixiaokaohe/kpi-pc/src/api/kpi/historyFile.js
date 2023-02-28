import service from "@/assets/js/util";

//根据id删除
export function deleteById(data) {
    return service.postAjax({
        code: "url",
        url: "assessment/delete",
        data
    })
}

//列表
export function fetchAllFileList(data) {
    return service.postAjax({
        code: "url",
        url: "assessment/items",
        isRep: true,
        data
    })
}

//列表分页
export function fetchFileList(data) {
    return service.postAjax({
        code: "url",
        url: "assessment/pageQuery",
        isRep: true,
        data
    })
}

//保存
export function saveFile(data) {
    return service.postAjax({
        code: "url",
        url: "assessment/save",
        isRep: true,
        data
    })
}

//批量保存
export function saveFileBatch(data) {
    return service.postAjax({
        code: "url",
        url: "assessment/saveBatch",
        isRep: true,
        data
    })
}

