import service from "@/assets/js/util";

// 模板列表
export function fetchTempList() {
    return service.postAjax({
        code: "url",
        url: "template/items",
        isRep: true,
        data: {}
    })
}

// 获取资源集列表
export function fetchResGroupList(data) {
    return service.postAjax({
        code: "url",
        url: "resgroup/items",
        isRep: true,
        data: data
    })
}

// 获取资源集列表
export function resgroupItemsFillRes(data) {
    return service.postAjax({
      code: 'url',
      url: '/resgroup/itemsFillRes',
      isRep: true,
      data: data,
    });
}

// 保存资源集
export function saveResGroup(data) {
    return service.postAjax({
        code: "url",
        url: "resgroup/save",
        isRep: true,
        data,
    })
}

// 删除资源集
export function deleteResGroup(data) {
    return service.postAjax({
        code: "url",
        url: "resgroup/delete",
        data,
    })
}

// 获取资源列表
export function fetchResList(data) {
    return service.postAjax({
        code: "url",
        url: "res/pageQuery",
        isRep: true,
        data,
    })
}

// 保存资源
export function saveRes(data) {
    return service.postAjax({
        code: "url",
        url: "res/save",
        isRep: true,
        data,
    })
}

// 改变资源状态
export function changeResStatus(data) {
    return service.postAjax({
        code: "url",
        url: "res/changeStatus",
        data,
    })
}

// 获取资源详情
export function getResDetail(data) {
    return service.postAjax({
        code: "url",
        url: "res/findById",
        data,
    })
}


// 删除资源
export function deleteRes(data) {
    return service.postAjax({
        code: "url",
        url: "res/delete",
        data,
    })
}