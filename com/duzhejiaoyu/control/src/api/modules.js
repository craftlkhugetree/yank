import service from "@/assets/js/util";
import store from "@/store/index";

// 获取列表
export function fetchModuleList(data) {
    return service.postAjax({
        code: "url",
        url: "model/list",
        isRep: true,
        data
    })
}

// 保存
export function saveModule(data) {
    return service.postAjax({
        code: "url",
        url: "model/save",
        isRep: true,
        data
    })
}

// 删除
export function deleteModule(id) {
    return service.postAjax({
        code: "url",
        url: `model/delete/${id}`,
        isGet: true
    })
}

// 上移
export function upModule(data) {
    return service.postAjax({
        code: "url",
        url: "model/up",
        data
    })
}

// 下移
export function downModule(data) {
    return service.postAjax({
        code: "url",
        url: "model/down",
        data
    })
}


