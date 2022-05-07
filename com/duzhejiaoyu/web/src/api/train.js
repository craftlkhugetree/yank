import service from "@/assets/js/util";
import store from "@/store/index";

// 获取列表
export function fetchAllLearnList(data) {
    return service.postAjax({
        code: "url",
        url: "learn/list",
        isRep: true,
        data
    })
}

// 获取列表-分页
export function fetchLearnList(data) {
    return service.postAjax({
        code: "url",
        url: "learn/pageQuery",
        isRep: true,
        data
    })
}

// 删除
export function deleteLearn(id) {
    return service.postAjax({
        code: "url",
        url: `learn/delete/${id}`,
        isGet: true
    })
}

// 上移
export function upLearn(data) {
    return service.postAjax({
        code: "url",
        url: "learn/up",
        data
    })
}

// 下移
export function downLearn(data) {
    return service.postAjax({
        code: "url",
        url: "learn/down",
        data
    })
}

// 保存
export function saveLearn(data) {
    return service.postAjax({
        code: "url",
        url: "learn/save",
        isRep: true,
        data
    })
}

// 批量设置
export function batchSet(data) {
    return service.postAjax({
        code: "url",
        url: "learn/batchSet",
        isRep: true,
        data
    })
}

// 详情
export function fetchDetail(id) {
    return service.postAjax({
        code: "url",
        url: `learn/find/${id}`,
        isGet: true
    })
}