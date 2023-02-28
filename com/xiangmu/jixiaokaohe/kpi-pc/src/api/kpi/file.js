import service from "@/assets/js/util";

//根据id删除
export function deleteById(data) {
    return service.postAjax({
        code: "url",
        url: "kpifile/delete",
        data
    })
}

// 文件可见
export function changeIsvisible(data) {
    return service.postAjax({
        code: "url",
        url: "kpifile/changeIsvisible",
        data
    })
}

//下移
export function downFile(data) {
    return service.postAjax({
        code: "url",
        url: "/kpifile/down",
        data
    })
}

//上移
export function upFile(data) {
    return service.postAjax({
        code: "url",
        url: "/kpifile/up",
        data
    })
}

//列表分页
export function fetchFileList(data) {
    return service.postAjax({
        code: "url",
        url: "/kpifile/pageQuery",
        isRep: true,
        data
    })
}

//保存
export function saveFile(data) {
    return service.postAjax({
        code: "url",
        url: "/kpifile/save",
        isRep: true,
        data
    })
}

