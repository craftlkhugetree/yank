import service from "@/assets/js/util";

// 参数列表
export function fetchConfigList(data) {
    return service.postAjax({
        code: "url",
        url: "config/pageQuery",
        isRep: true,
        data,
    })
}

// 所有参数
export function fetchConfigs(data) {
    return service.postAjax({
        code: "url",
        url: "config/items",
        isRep: true,
        data,
    })
}

// 保存
export function saveConfig(data) {
    return service.postAjax({
        code: "url",
        url: "config/save",
        isRep: true,
        data,
    })
}

// 参数详情
export function fetchConfigById(data) {
    return service.postAjax({
        code: "url",
        url: "config/findById",
        data,
    })
}

// 删除
export function deleteConfig(data) {
    return service.postAjax({
        code: "url",
        url: "config/delete",
        data,
    })
}



// 获取默认时间
export function queryConfigtimes(data) {
    return service.postAjax({
        code: "url",
        url: "config/queryConfigtimes",
        data,
    })
}